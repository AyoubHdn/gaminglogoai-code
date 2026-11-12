import assert from "node:assert/strict";
import test from "node:test";
import postgres from "postgres";
import { PrismaClient } from "@prisma/client";

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

async function rpc(operation: string, input: Record<string, unknown>) {
  const handler = createDbRpcHandler((query, values) => sql.unsafe(query, values as never[]));
  const response = await handler(new Request("https://gaming-db.test/rpc", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ operation, input }),
  }));
  assert.equal(response.status, 200);
  return response.json();
}

void test("Worker RPC boundary reads disposable PostgreSQL", async () => {
  const prefix = "worker-rpc-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  const userId = prefix + "-user";
  const otherUserId = prefix + "-other-user";
  const iconId = prefix + "-icon";
  try {
    await prisma.user.createMany({
      data: [
        { id: userId, gamingCredits: 12, hasPurchasedCredits: true },
        { id: otherUserId, gamingCredits: 1 },
      ],
    });
    await prisma.icon.createMany({
      data: [
        { id: iconId, userId, prompt: "EmoteBase: worker", imageKey: "emotes/base/" + userId + "/a.webp", createdAt: new Date("2026-01-02") },
        { id: prefix + "-other", userId: otherUserId, prompt: "other", createdAt: new Date("2026-01-03") },
      ],
    });

    const credits = await rpc("user.getCredits", { userId });
    assert.deepEqual(credits, { ok: true, data: 12 });
    const saved = await rpc("icons.getSavedIcons", { userId });
    assert.deepEqual(saved, {
      ok: true,
      data: [{
        id: iconId,
        prompt: "EmoteBase: worker",
        userId,
        imageKey: "emotes/base/" + userId + "/a.webp",
        createdAt: "2026-01-02T00:00:00.000Z",
      }],
    });
    const emotes = await rpc("icons.getEmoteBases", { userId });
    assert.deepEqual(emotes, saved);
    const community = await rpc("icons.getCommunityIcons", { limit: 1 });
    assert.equal(community.ok, true);
    assert.equal(community.data[0]?.id, prefix + "-other");
  } finally {
    await prisma.icon.deleteMany({ where: { id: { startsWith: prefix } } });
    await prisma.user.deleteMany({ where: { id: { startsWith: prefix } } });
    await sql.end({ timeout: 1 });
    await prisma.$disconnect();
  }
});
