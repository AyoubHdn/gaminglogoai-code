// ~/server/api/stripe.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { env } from "~/env.mjs";
import { buffer } from "micro";
import { prisma } from "~/server/db";
import { syncUserToMautic } from "~/server/api/routers/mautic-utils";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
});

const planMetadataMap = {
  starter: { credits: 20, plan: "Starter" as const },
  pro: { credits: 50, plan: "Pro" as const },
  elite: { credits: 100, plan: "Elite" as const },
};

const priceIdMap: Record<string, { credits: number; plan: "Starter" | "Pro" | "Elite" }> = {
  [env.PRICE_ID_STARTER]: planMetadataMap.starter,
  [env.PRICE_ID_PRO]: planMetadataMap.pro,
  [env.PRICE_ID_ELITE]: planMetadataMap.elite,
};

function getFulfillmentFromMetadata(metadata?: Stripe.Metadata | null) {
  const planKey = metadata?.plan;
  if (planKey && planKey in planMetadataMap) {
    return planMetadataMap[planKey as keyof typeof planMetadataMap];
  }

  const credits = Number.parseInt(metadata?.credits ?? "", 10);
  return Object.values(planMetadataMap).find((item) => item.credits === credits) ?? null;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, env.STRIPE_WEB_HOOK_SECRET);
    console.log('Stripe Price IDs from env:');
    console.log('STARTER:', env.PRICE_ID_STARTER);
    console.log('PRO:', env.PRICE_ID_PRO);
    console.log('ELITE:', env.PRICE_ID_ELITE);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Error";
    console.error("Webhook Error:", message);
    return res.status(400).send(`Webhook Error: ${message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      console.log("Processing checkout.session.completed event...");
      const completedEvent = event.data.object as Stripe.Checkout.Session;

      const userId = completedEvent.metadata?.userId;
      if (!userId) {
        console.error("User ID missing in session metadata.");
        return res.status(400).send("Invalid metadata in session.");
      }

      console.log(`User ID from metadata: ${userId}`);

      let fulfillment = getFulfillmentFromMetadata(completedEvent.metadata);

      if (!fulfillment) {
        try {
          const lineItems = await stripe.checkout.sessions.listLineItems(completedEvent.id, {
            limit: 1,
          });
          const priceId = lineItems.data[0]?.price?.id;
          console.log("Price ID from line items:", priceId);
          fulfillment = priceId ? priceIdMap[priceId] ?? null : null;
        } catch (err) {
          console.error("Error fetching line items:", err);
          return res.status(500).send("Failed to fetch line items.");
        }
      }

      if (!fulfillment) {
        console.warn(`Unhandled checkout session ${completedEvent.id}; no matching plan metadata or price ID.`);
        return res.status(200).json({ received: true, ignored: true });
      }

      const { credits: incrementCredits, plan } = fulfillment;
      console.log(`Credits to increment: ${incrementCredits}, Plan: ${plan}`);

      try {
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            gamingCredits: {
              increment: incrementCredits,
            },
            gamingPlan: plan,
          },
        });

        console.log("User after update:", updatedUser);

        if (updatedUser.email) {
          void syncUserToMautic({
            email: updatedUser.email,
            name: updatedUser.name,
            brand_specific_credits: updatedUser.gamingCredits,
            brand_specific_plan: updatedUser.gamingPlan,
          }, "gaminglogoai")
            .then((mauticResult) => {
            console.log("Mautic updated after purchase:", mauticResult);
            })
            .catch((err) => {
              console.error("Error updating Mautic after purchase:", err);
            });
        } else {
          console.error("Updated user has no email; cannot update Mautic.");
        }
      } catch (err) {
        console.error("Error updating user credits or plan:", err);
        return res.status(500).send("Failed to update user credits or plan.");
      }

      return res.status(200).json({ received: true });
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
      return res.status(200).json({ received: true });
  }
};

export default webhook;
