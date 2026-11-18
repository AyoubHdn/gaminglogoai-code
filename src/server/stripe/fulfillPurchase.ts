import type { PrismaClient } from "@prisma/client";

export type GamingPurchaseInput = {
  eventId: string;
  sessionId: string;
  userId: string;
  credits: number;
  plan: "Starter" | "Pro" | "Elite";
};

export type GamingPurchaseResult =
  | { outcome: "DUPLICATE" }
  | { outcome: "APPLIED"; user: { email: string | null; name: string | null; gamingCredits: number; gamingPlan: string } };

/** The receipt and balance increment commit together. A failed update leaves no receipt. */
export async function fulfillGamingPurchase(
  prisma: PrismaClient,
  input: GamingPurchaseInput,
): Promise<GamingPurchaseResult> {
  const packs = { Starter: 20, Pro: 50, Elite: 100 } as const;
  if (!input.eventId || !input.sessionId || !input.userId ||
      !Object.hasOwn(packs, input.plan) || packs[input.plan] !== input.credits) {
    throw new Error("Invalid GamingLogoAI purchase");
  }
  return prisma.$transaction(async (tx) => {
    // Avoid catching a unique violation inside a PostgreSQL transaction:
    // that would leave the transaction aborted. Both unique keys are arbiters.
    const inserted = await tx.$executeRaw`
      INSERT INTO "GamingStripePurchase"
        ("id", "stripeSessionId", "userId", "credits", "plan")
      VALUES
        (${input.eventId}, ${input.sessionId}, ${input.userId},
         ${input.credits}, CAST(${input.plan} AS "Plan"))
      ON CONFLICT DO NOTHING
    `;
    if (inserted === 0) {
      const prior = await tx.gamingStripePurchase.findFirst({
        where: { OR: [{ id: input.eventId }, { stripeSessionId: input.sessionId }] },
      });
      if (!prior || prior.stripeSessionId !== input.sessionId ||
          prior.userId !== input.userId || prior.credits !== input.credits ||
          prior.plan !== input.plan) {
        throw new Error("Conflicting GamingLogoAI purchase receipt");
      }
      return { outcome: "DUPLICATE" as const };
    }
    const user = await tx.user.update({
      where: { id: input.userId },
      data: {
        gamingCredits: { increment: input.credits },
        gamingPlan: input.plan,
        hasPurchasedCredits: true,
      },
      select: { email: true, name: true, gamingCredits: true, gamingPlan: true },
    });
    return { outcome: "APPLIED" as const, user };
  });
}
