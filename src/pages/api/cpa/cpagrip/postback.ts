/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const {
    password,
    payout,
    offer_id,
    tracking_id,
  } = req.body;

  // 1️⃣ Verify password
  if (password !== process.env.CPAGRIP_POSTBACK_PASSWORD) {
    return res.status(403).send("Invalid password");
  }

  // 2️⃣ Validate tracking ID
  if (!tracking_id || typeof tracking_id !== "string") {
    return res.status(400).send("Missing tracking_id");
  }

  // 3️⃣ Find unlock record
  const unlock = await prisma.cpaUnlock.findUnique({
    where: { token: tracking_id },
  });

  if (!unlock) {
    return res.status(200).send("Unknown token");
  }

  // 4️⃣ Prevent double credit
  if (unlock.status === "approved") {
    return res.status(200).send("Already credited");
  }

  // 5️⃣ Credit user + mark approved
  await prisma.$transaction([
    prisma.user.update({
      where: { id: unlock.userId },
      data: {
        gamingCredits: { increment: 1 },
      },
    }),
    prisma.cpaUnlock.update({
      where: { id: unlock.id },
      data: {
        status: "approved",
        payout: payout ? Number(payout) : null,
        offerId: offer_id?.toString(),
        approvedAt: new Date(),
      },
    }),
  ]);

  return res.status(200).send("OK");
}
