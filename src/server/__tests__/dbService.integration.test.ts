import assert from "node:assert/strict";
import test from "node:test";
import { PrismaClient } from "@prisma/client";
import { createPrismaDbService } from "../dbService.ts";

// Never fall back to the application DATABASE_URL.
const testUrl = process.env.GAMING_DB_SERVICE_TEST_DATABASE_URL;
if (!testUrl) throw new Error("GAMING_DB_SERVICE_TEST_DATABASE_URL is required");
const url = new URL(testUrl);
if (!["127.0.0.1", "localhost", "[::1]"].includes(url.hostname) ||
    url.port !== "5432" || url.pathname !== "/gaminglogoai_ci" ||
    url.search || url.hash) {
  throw new Error("Only disposable localhost gaminglogoai_ci PostgreSQL is allowed");
}
const prisma = new PrismaClient({ datasources: { db: { url: testUrl } } });
const service = createPrismaDbService(prisma);

void test("DB-service boundary against real PostgreSQL", async (t) => {
  const prefix = `db-service-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const freeUser = `${prefix}-free`;
  const buyer = `${prefix}-buyer`;
  const id = (suffix: string) => `${prefix}-${suffix}`;
  try {
    await prisma.user.createMany({
      data: [
        { id: freeUser, gamingCredits: 1, hasPurchasedCredits: false },
        { id: buyer, gamingCredits: 37, gamingPlan: "Pro", hasPurchasedCredits: true },
      ],
    });
    await prisma.icon.createMany({
      data: [
        { id: id("old"), userId: freeUser, prompt: "old", createdAt: new Date("2020-01-01") },
        { id: id("base"), userId: freeUser, prompt: "EmoteBase: valid", imageKey: `emotes/base/${freeUser}/image.png`, createdAt: new Date("2020-01-02") },
        { id: id("wrong-key"), userId: freeUser, prompt: "EmoteBase: wrong owner key", imageKey: `emotes/base/${buyer}/image.png`, createdAt: new Date("2020-01-03") },
        { id: id("wrong-prompt"), userId: freeUser, prompt: "ordinary image", imageKey: `emotes/base/${freeUser}/other.png`, createdAt: new Date("2020-01-04") },
        { id: id("buyer-base"), userId: buyer, prompt: "EmoteBase: another user", imageKey: `emotes/base/${buyer}/image.png`, createdAt: new Date("2020-01-05") },
        { id: id("guest"), userId: null, prompt: "guest", createdAt: new Date("2020-01-06") },
      ],
    });

    await t.test("credit and buyer status stay scoped to their account", async () => {
      assert.equal(await service.getCredits(freeUser), 1);
      assert.equal(await service.getCredits(buyer), 37);
      assert.equal(await service.getHasPurchasedCredits(freeUser), false);
      assert.equal(await service.getHasPurchasedCredits(buyer), true);
    });
    await t.test("missing users return null and no private images", async () => {
      const missing = id("missing");
      assert.equal(await service.getCredits(missing), null);
      assert.equal(await service.getHasPurchasedCredits(missing), null);
      assert.deepEqual(await service.getSavedIcons(missing), []);
      assert.deepEqual(await service.getEmoteBases(missing), []);
    });
    await t.test("saved images exclude the other account and guest, newest first", async () => {
      const rows = await service.getSavedIcons(freeUser);
      assert.deepEqual(rows.map(row => row.id), [id("wrong-prompt"), id("wrong-key"), id("base"), id("old")]);
      assert.ok(rows.every(row => row.userId === freeUser && row.createdAt instanceof Date));
      assert.deepEqual((await service.getSavedIcons(buyer)).map(row => row.id), [id("buyer-base")]);
    });
    await t.test("emote bases require matching owner, prompt prefix, and storage prefix", async () => {
      assert.deepEqual((await service.getEmoteBases(freeUser)).map(row => row.id), [id("base")]);
      assert.deepEqual((await service.getEmoteBases(buyer)).map(row => row.id), [id("buyer-base")]);
    });
    await t.test("community retains public scope, descending dates, and bounded limits", async () => {
      // This suite owns the entire fresh disposable DB; other project data is forbidden.
      await prisma.icon.createMany({
        data: Array.from({ length: 110 }, (_, index) => ({
          id: id(`community-${index}`), userId: null,
          createdAt: new Date(Date.UTC(2021, 0, 1) + index * 1000),
        })),
      });
      const latest = await service.getCommunityIcons(3);
      assert.deepEqual(latest.map(row => row.id), [id("community-109"), id("community-108"), id("community-107")]);
      assert.equal((await service.getCommunityIcons()).length, 50);
      assert.equal((await service.getCommunityIcons(500)).length, 100);
      assert.equal((await service.getCommunityIcons(0)).length, 1);
      assert.equal((await service.getCommunityIcons(-5)).length, 1);
    });
    await t.test("boundary reads leave balances, plans, buyer flags, and icon count unchanged", async () => {
      const users = await prisma.user.findMany({
        where: { id: { in: [freeUser, buyer] } }, orderBy: { id: "asc" },
        select: { id: true, gamingCredits: true, gamingPlan: true, hasPurchasedCredits: true },
      });
      assert.deepEqual(users, [
        { id: buyer, gamingCredits: 37, gamingPlan: "Pro", hasPurchasedCredits: true },
        { id: freeUser, gamingCredits: 1, gamingPlan: "None", hasPurchasedCredits: false },
      ]);
      assert.equal(await prisma.icon.count({ where: { id: { startsWith: prefix } } }), 116);
    });
  } finally {
    await prisma.icon.deleteMany({ where: { id: { startsWith: prefix } } });
    await prisma.user.deleteMany({ where: { id: { in: [freeUser, buyer] } } });
    await prisma.$disconnect();
  }
});
