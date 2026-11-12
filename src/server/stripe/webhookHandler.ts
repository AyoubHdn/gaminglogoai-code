import type Stripe from "stripe";
import type { GamingPurchaseInput, GamingPurchaseResult } from "./fulfillPurchase";

export type GamingWebhookDependencies = {
  verify: (body: Buffer, signature: string) => Promise<Stripe.Event>;
  listLineItems: (sessionId: string) => Promise<Stripe.ApiList<Stripe.LineItem>>;
  fulfill: (input: GamingPurchaseInput) => Promise<GamingPurchaseResult>;
  priceIds: { starter: string; pro: string; elite: string };
  afterCommit?: (result: Extract<GamingPurchaseResult, { outcome: "APPLIED" }>) => Promise<void>;
  onSyncFailure?: () => void;
};

export async function handleGamingStripeWebhook(
  rawBody: Buffer,
  signature: string | null,
  deps: GamingWebhookDependencies,
) {
  if (!signature) return { status: 400, body: { error: "Missing Stripe signature" } };
  let event: Stripe.Event;
  try { event = await deps.verify(rawBody, signature); }
  catch { return { status: 400, body: { error: "Webhook signature verification failed" } }; }

  if (event.type !== "checkout.session.completed") {
    return { status: 200, body: { received: true, ignored: true } };
  }
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.mode !== "payment" || session.payment_status !== "paid") {
    return { status: 200, body: { received: true, ignored: true } };
  }
  // A shared Stripe account may send this endpoint another brand's events.
  if (session.metadata?.project && session.metadata.project !== "GamingLogoAI") {
    return { status: 200, body: { received: true, ignored: true } };
  }
  const userId = session.metadata?.userId;
  if (!userId) return { status: 400, body: { error: "Missing checkout user ID" } };

  const prices = [deps.priceIds.starter, deps.priceIds.pro, deps.priceIds.elite];
  if (prices.some((id) => !id) || new Set(prices).size !== 3) {
    return { status: 500, body: { error: "Invalid purchase configuration" } };
  }

  try {
    // Price IDs, not metadata credits/plan or checkout email, authorize the pack.
    const items = await deps.listLineItems(session.id);
    const item = items.data[0];
    if (items.has_more || items.data.length !== 1 || item?.quantity !== 1) {
      return { status: 200, body: { received: true, ignored: true } };
    }
    const index = prices.indexOf(item.price?.id ?? "");
    const pack = ([
      { credits: 20, plan: "Starter" },
      { credits: 50, plan: "Pro" },
      { credits: 100, plan: "Elite" },
    ] as const)[index];
    if (!pack) return { status: 200, body: { received: true, ignored: true } };

    const result = await deps.fulfill({
      eventId: event.id, sessionId: session.id, userId, ...pack,
    });
    if (result.outcome === "DUPLICATE") {
      return { status: 200, body: { received: true, duplicate: true } };
    }
    try { await deps.afterCommit?.(result); }
    catch { deps.onSyncFailure?.(); }
    return { status: 200, body: { received: true } };
  } catch {
    return { status: 500, body: { error: "Purchase fulfillment is retryable" } };
  }
}
