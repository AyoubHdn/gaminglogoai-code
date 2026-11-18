import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { syncUserToMautic } from "~/server/api/routers/mautic-utils";
import { fulfillGamingPurchase } from "~/server/stripe/fulfillPurchase";
import { handleGamingStripeWebhook } from "~/server/stripe/webhookHandler";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});
const cryptoProvider = Stripe.createSubtleCryptoProvider();
export const config = { api: { bodyParser: false } };

export default async function webhook(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }
  const rawBody = await buffer(req);
  const signature = req.headers["stripe-signature"];
  const result = await handleGamingStripeWebhook(
    rawBody, typeof signature === "string" ? signature : null,
    {
      verify: (body, signedPayload) => stripe.webhooks.constructEventAsync(
        body, signedPayload, env.STRIPE_WEB_HOOK_SECRET, undefined, cryptoProvider,
      ),
      listLineItems: (id) => stripe.checkout.sessions.listLineItems(id, { limit: 2 }),
      fulfill: (purchase) => fulfillGamingPurchase(prisma, purchase),
      priceIds: {
        starter: env.PRICE_ID_STARTER, pro: env.PRICE_ID_PRO, elite: env.PRICE_ID_ELITE,
      },
      afterCommit: async ({ user }) => {
        if (!user.email) return;
        const synced = await syncUserToMautic({
          email: user.email, name: user.name,
          brand_specific_credits: user.gamingCredits,
          brand_specific_plan: user.gamingPlan,
        }, "gaminglogoai");
        if (synced.errors?.length) throw new Error("Mautic purchase synchronization failed");
      },
      onSyncFailure: () => console.error("GamingLogoAI purchase committed; Mautic synchronization failed"),
    },
  );
  return res.status(result.status).json(result.body);
}
