import assert from "node:assert/strict";
import test from "node:test";
import Stripe from "stripe";
import { handleGamingStripeWebhook, type GamingWebhookDependencies } from "../src/server/stripe/webhookHandler.ts";

const stripe = new Stripe("sk_test_offline");
const cryptoProvider = Stripe.createSubtleCryptoProvider();
const secret = "whsec_test_offline_only";
const prices = { starter: "price_starter", pro: "price_pro", elite: "price_elite" };
function event(overrides: Record<string, unknown> = {}): Stripe.Event {
  return { id: "evt_test", type: "checkout.session.completed", data: { object: {
    id: "cs_test", mode: "payment", payment_status: "paid",
    metadata: { userId: "account_google", project: "GamingLogoAI" },
    customer_details: { email: "checkout@example.invalid" }, ...overrides,
  } } } as unknown as Stripe.Event;
}
function fixture(options: { event?: Stripe.Event; secret?: string; price?: string; failDb?: boolean; failSync?: boolean } = {}) {
  const body = Buffer.from(JSON.stringify(options.event ?? event()));
  const signature = stripe.webhooks.generateTestHeaderString({ payload: body.toString("utf8"), secret });
  const calls: string[] = [];
  let purchase: unknown;
  const deps: GamingWebhookDependencies = {
    verify: (raw, sig) => stripe.webhooks.constructEventAsync(raw, sig, options.secret ?? secret, undefined, cryptoProvider),
    listLineItems: async () => {
      calls.push("items");
      return { data: [{ quantity: 1, price: { id: options.price ?? prices.starter } }], has_more: false } as Stripe.ApiList<Stripe.LineItem>;
    },
    fulfill: async (input) => {
      calls.push("commit"); purchase = input;
      if (options.failDb) throw new Error("private database details");
      return { outcome: "APPLIED", user: { email: "login@example.invalid", name: null, gamingCredits: 21, gamingPlan: "Starter" } };
    },
    afterCommit: async () => { calls.push("sync"); if (options.failSync) throw new Error("private Mautic details"); },
    onSyncFailure: () => { calls.push("sync-failure"); },
    priceIds: prices,
  };
  return { body, signature, deps, calls, getPurchase: () => purchase };
}
test("real Web Crypto verification applies by account ID, not checkout email", async () => {
  const f = fixture();
  assert.equal((await handleGamingStripeWebhook(f.body, f.signature, f.deps)).status, 200);
  assert.deepEqual(f.calls, ["items", "commit", "sync"]);
  assert.deepEqual(f.getPurchase(), { eventId: "evt_test", sessionId: "cs_test", userId: "account_google", credits: 20, plan: "Starter" });
});
test("wrong signing secret and altered body never perform database/API work", async () => {
  for (const altered of [false, true]) {
    const f = fixture(altered ? {} : { secret: "whsec_wrong" });
    const response = await handleGamingStripeWebhook(altered ? Buffer.from("{}") : f.body, f.signature, f.deps);
    assert.equal(response.status, 400); assert.deepEqual(f.calls, []);
  }
});
test("missing signature and rejected async verifier stop before fulfillment", async () => {
  const f = fixture();
  assert.equal((await handleGamingStripeWebhook(f.body, null, f.deps)).status, 400);
  f.deps.verify = async () => { throw new Error("sensitive crypto details"); };
  const response = await handleGamingStripeWebhook(f.body, f.signature, f.deps);
  assert.equal(response.status, 400);
  assert.doesNotMatch(JSON.stringify(response), /sensitive/);
  assert.deepEqual(f.calls, []);
});
test("unpaid checkout and another brand are successful ignored no-ops", async () => {
  for (const e of [event({ payment_status: "unpaid" }), event({ metadata: { userId: "x", project: "NameDesignAI" } })]) {
    const f = fixture({ event: e });
    assert.equal((await handleGamingStripeWebhook(f.body, f.signature, f.deps)).body.ignored, true);
    assert.deepEqual(f.calls, []);
  }
});
test("price ID selects all three packs; metadata cannot inflate credits", async () => {
  for (const [price, credits, plan] of [[prices.starter, 20, "Starter"], [prices.pro, 50, "Pro"], [prices.elite, 100, "Elite"]] as const) {
    const f = fixture({ price, event: event({ metadata: { userId: "account_google", project: "GamingLogoAI", credits: "9999", plan: "elite" } }) });
    assert.equal((await handleGamingStripeWebhook(f.body, f.signature, f.deps)).status, 200);
    assert.deepEqual(f.getPurchase(), { eventId: "evt_test", sessionId: "cs_test", userId: "account_google", credits, plan });
  }
});
test("unknown price, multiple items, and quantity mismatch never fulfill", async () => {
  const unknown = fixture({ price: "price_another_site" });
  assert.equal((await handleGamingStripeWebhook(unknown.body, unknown.signature, unknown.deps)).body.ignored, true);
  assert.deepEqual(unknown.calls, ["items"]);
  for (const item of [{ data: [], has_more: true }, { data: [{ quantity: 2, price: { id: prices.starter } }], has_more: false }]) {
    const f = fixture(); f.deps.listLineItems = async () => item as Stripe.ApiList<Stripe.LineItem>;
    assert.equal((await handleGamingStripeWebhook(f.body, f.signature, f.deps)).body.ignored, true);
    assert.deepEqual(f.calls, []);
  }
});
test("duplicate receipt never repeats external synchronization", async () => {
  const f = fixture(); f.deps.fulfill = async () => ({ outcome: "DUPLICATE" });
  assert.equal((await handleGamingStripeWebhook(f.body, f.signature, f.deps)).body.duplicate, true);
  assert.deepEqual(f.calls, ["items"]);
});
test("database failure returns retryable 500; committed Mautic failure returns 200 with diagnostic", async () => {
  const db = fixture({ failDb: true });
  assert.equal((await handleGamingStripeWebhook(db.body, db.signature, db.deps)).status, 500);
  assert.deepEqual(db.calls, ["items", "commit"]);
  const sync = fixture({ failSync: true });
  assert.equal((await handleGamingStripeWebhook(sync.body, sync.signature, sync.deps)).status, 200);
  assert.deepEqual(sync.calls, ["items", "commit", "sync", "sync-failure"]);
});
