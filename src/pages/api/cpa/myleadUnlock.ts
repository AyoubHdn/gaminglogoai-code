import crypto from "crypto";
import { prisma } from "~/server/db";

export async function myleadUnlock(userId: string) {
  const token = `gla_${userId}_${crypto.randomUUID()}`;

  await prisma.cpaUnlock.create({
    data: {
      userId,
      token,
      network: "mylead",
      status: "pending",
    },
  });

  const redirectUrl =
    `https://price-low.eu/a/OYkMMu2BVWcrAvB?ml_sub1=${token}`;

  return { redirectUrl };
}
