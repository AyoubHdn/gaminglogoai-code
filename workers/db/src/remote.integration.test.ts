import assert from "node:assert/strict";
import test from "node:test";
import postgres from "postgres";
import { PrismaClient } from "@prisma/client";

import {
  createPrismaDbService,
  createRemoteGamingDbService,
} from "../../../src/server/dbService.ts";
import { createDbRpcHandler } from "./index.ts";

const testUrl = process.env.GAMING_DB_SERVICE_TEST_DATABASE_URL;
if (!testUrl) throw new Error("GAMING_DB_SERVICE_TEST_DATABASE_URL is required");
const parsed = new URL(testUrl);
if (
  !["127.0.0.1", "localhost", "[::1]"].includes(parsed.hostname) ||
  parsed.port !== "5432" ||
  parsed.pathname !== "/gaminglogoai_ci" ||
  parsed.search ||
  parsed.hash
) {
  throw new Error("Only disposable localhost gaminglogoai_ci PostgreSQL is allowed");
}

const prisma = new PrismaClient({ datasources: { db: { url: testUrl } } });
const sql = postgres(testUrl, { prepare: false });
const prismaService = createPrismaDbService(prisma);

function createWorkerBinding() {
  const handler = createDbRpcHandler((query, values) =>
    sql.unsafe(query, values as never[]),
  );
  return {
    fetch(input: RequestInfo | URL, init?: RequestInit) {
      return handler(new Request(input, init));
    },
  };
}

void test("remote adapter crosses the real Worker RPC boundary", async () => {
  const prefix = "remote-rpc-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  const userA = prefix + "-user-a";
  const userB = prefix + "-user-b";
  const icon = (suffix: string) => prefix + "-icon-" + suffix;
  try {
    await prisma.user.createMany({
      data: [
        { id: userA, gamingCredits: 19, hasPurchasedCredits: false },
        { id: userB, gamingCredits: 31, hasPurchasedCredits: true },
      ],
    });

    await prisma.icon.createMany({
      data: [
        {
          id: icon("a-old"),
          userId: userA,
          prompt: "ordinary",
          imageKey: "icons/a-old.webp",
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
        },
        {
          id: icon("a-base"),
          userId: userA,
          prompt: "EmoteBase: valid",
          imageKey: "emotes/base/" + userA + "/valid.webp",
          createdAt: new Date("2026-01-02T00:00:00.000Z"),
        },
        {
          id: icon("a-wrong-prompt"),
          userId: userA,
          prompt: "ordinary",
          imageKey: "emotes/base/" + userA + "/wrong-prompt.webp",
          createdAt: new Date("2026-01-03T00:00:00.000Z"),
        },
        {
          id: icon("a-wrong-key"),
          userId: userA,
          prompt: "EmoteBase: wrong key",
          imageKey: "emotes/base/" + userB + "/wrong-key.webp",
          createdAt: new Date("2026-01-04T00:00:00.000Z"),
        },
        {
          id: icon("b-base"),
          userId: userB,
          prompt: "EmoteBase: other account",
          imageKey: "emotes/base/" + userB + "/other.webp",
          createdAt: new Date("2026-01-05T00:00:00.000Z"),
        },
        ...Array.from({ length: 105 }, (_, index) => ({
          id: icon("community-" + index),
          userId: null,
          prompt: "community-" + index,
          imageKey: null,
          createdAt: new Date(Date.UTC(2026, 2, 1, 0, 0, index)),
        })),
      ],
    });

    const remote = createRemoteGamingDbService(createWorkerBinding());

    assert.equal(await remote.getCredits(userA), await prismaService.getCredits(userA));
    assert.equal(
      await remote.getHasPurchasedCredits(userA),
      await prismaService.getHasPurchasedCredits(userA),
    );
    assert.equal(await remote.getCredits(userB), await prismaService.getCredits(userB));
    assert.equal(
      await remote.getHasPurchasedCredits(userB),
      await prismaService.getHasPurchasedCredits(userB),
    );

    const missingUser = prefix + "-missing";
    assert.equal(await remote.getCredits(missingUser), null);
    assert.equal(await remote.getHasPurchasedCredits(missingUser), null);
    assert.deepEqual(await remote.getSavedIcons(missingUser), []);
    assert.deepEqual(await remote.getEmoteBases(missingUser), []);

    const prismaSaved = await prismaService.getSavedIcons(userA);
    const remoteSaved = await remote.getSavedIcons(userA);
    assert.deepEqual(remoteSaved.map((row) => row.id), prismaSaved.map((row) => row.id));
    assert.deepEqual(
      remoteSaved.map((row) => row.createdAt),
      prismaSaved.map((row) => row.createdAt),
    );
    assert.ok(remoteSaved.every((row) => row.userId === userA));
    assert.ok(remoteSaved.every((row) => row.createdAt instanceof Date));

    const prismaBases = await prismaService.getEmoteBases(userA);
    const remoteBases = await remote.getEmoteBases(userA);
    assert.deepEqual(remoteBases.map((row) => row.id), [icon("a-base")]);
    assert.deepEqual(remoteBases.map((row) => row.id), prismaBases.map((row) => row.id));

    const prismaCommunity = await prismaService.getCommunityIcons(3);
    const remoteCommunity = await remote.getCommunityIcons(3);
    assert.deepEqual(remoteCommunity.map((row) => row.id), prismaCommunity.map((row) => row.id));
    assert.ok(remoteCommunity.every((row) => row.createdAt instanceof Date));

    const prismaClamped = await prismaService.getCommunityIcons(500);
    const remoteClamped = await remote.getCommunityIcons(500);
    assert.equal(remoteClamped.length, 100);
    assert.deepEqual(remoteClamped.map((row) => row.id), prismaClamped.map((row) => row.id));

    assert.throws(
      () => createRemoteGamingDbService(undefined),
      /binding is required/,
    );

    const closedSql = postgres(testUrl, { prepare: false });
    await closedSql.end({ timeout: 1 });
    const failingHandler = createDbRpcHandler((query, values) =>
      closedSql.unsafe(query, values as never[]),
    );
    const failingService = createRemoteGamingDbService({
      fetch(input: RequestInfo | URL, init?: RequestInit) {
        return failingHandler(new Request(input, init));
      },
    });
    await assert.rejects(
      failingService.getCredits(userA),
      /Remote DB service request failed/,
    );
    assert.equal(await prismaService.getCredits(userA), 19);
  } finally {
    await prisma.icon.deleteMany({ where: { id: { startsWith: prefix } } });
    await prisma.user.deleteMany({ where: { id: { startsWith: prefix } } });
    await sql.end({ timeout: 1 });
    await prisma.$disconnect();
  }
});
