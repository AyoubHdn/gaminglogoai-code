import assert from "node:assert/strict";
import test from "node:test";
import { PrismaClient } from "@prisma/client";
import { fulfillGamingPurchase } from "../src/server/stripe/fulfillPurchase.ts";

// No fallback to DATABASE_URL. The suite refuses remote or differently named databases.
const testUrl = process.env.GAMING_STRIPE_TEST_DATABASE_URL;
if (!testUrl) throw new Error("GAMING_STRIPE_TEST_DATABASE_URL is required");
const parsed = new URL(testUrl);
if (!["127.0.0.1", "localhost", "[::1]"].includes(parsed.hostname) ||
    parsed.pathname !== "/gaminglogoai_ci" || parsed.search || parsed.port !== "5432") {
  throw new Error("Only the disposable local gaminglogoai_ci PostgreSQL database is allowed");
}
const prisma = new PrismaClient({ datasources: { db: { url: testUrl } } });
test("real PostgreSQL receipt and credit fulfillment", async (t) => {
  const prefix = "stripe-ci-" + Date.now();
  const userId = prefix + "-user";
  const otherId = prefix + "-other";
  const purchase = (name: string, session = name, target = userId) => ({
    eventId: prefix + "-evt-" + name, sessionId: prefix + "-cs-" + session,
    userId: target, credits: 20, plan: "Starter" as const,
  });
  try {
    await prisma.user.createMany({ data: [{ id: userId, gamingCredits: 1 }, { id: otherId, gamingCredits: 1 }] });
    await t.test("concurrent repeated event grants once", async () => {
      const results = await Promise.all(Array.from({ length: 6 }, () => fulfillGamingPurchase(prisma, purchase("same"))));
      assert.equal(results.filter(r => r.outcome === "APPLIED").length, 1);
      const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
      assert.equal(user.gamingCredits, 21); assert.equal(user.gamingPlan, "Starter");
      assert.equal(user.hasPurchasedCredits, true);
    });
    await t.test("another event for the same session does not grant twice", async () => {
      assert.equal((await fulfillGamingPurchase(prisma, purchase("another-event", "same"))).outcome, "DUPLICATE");
      assert.equal((await prisma.user.findUniqueOrThrow({ where: { id: userId } })).gamingCredits, 21);
    });
    await t.test("a reused event with conflicting owner/session is rejected", async () => {
      await assert.rejects(fulfillGamingPurchase(prisma, purchase("same", "different", otherId)));
      assert.equal((await prisma.user.findUniqueOrThrow({ where: { id: otherId } })).gamingCredits, 1);
    });
    await t.test("different concurrent purchases atomically add both packs", async () => {
      await Promise.all([fulfillGamingPurchase(prisma, purchase("a")), fulfillGamingPurchase(prisma, purchase("b"))]);
      assert.equal((await prisma.user.findUniqueOrThrow({ where: { id: userId } })).gamingCredits, 61);
    });
    await t.test("failure after receipt insertion rolls it back, and the same event can retry", async () => {
      await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD CONSTRAINT "ci_only_credit_limit" CHECK ("gamingCredits" < 70)');
      try {
        await assert.rejects(fulfillGamingPurchase(prisma, purchase("rollback")));
        assert.equal(await prisma.gamingStripePurchase.count({ where: { id: purchase("rollback").eventId } }), 0);
        assert.equal((await prisma.user.findUniqueOrThrow({ where: { id: userId } })).gamingCredits, 61);
      } finally {
        await prisma.$executeRawUnsafe('ALTER TABLE "User" DROP CONSTRAINT "ci_only_credit_limit"');
      }
      assert.equal((await fulfillGamingPurchase(prisma, purchase("rollback"))).outcome, "APPLIED");
      assert.equal((await prisma.user.findUniqueOrThrow({ where: { id: userId } })).gamingCredits, 81);
    });
  } finally {
    await prisma.gamingStripePurchase.deleteMany({ where: { userId: { in: [userId, otherId] } } });
    await prisma.user.deleteMany({ where: { id: { in: [userId, otherId] } } });
    await prisma.$disconnect();
  }
});
