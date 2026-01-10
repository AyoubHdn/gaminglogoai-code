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
    `https://top-deal.me/a/BBpNNT87z4uNJPO?ml_sub1=${token}`;

  return { redirectUrl };
}
