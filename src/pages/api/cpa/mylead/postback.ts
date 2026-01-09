/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /pages/api/cpa/mylead/postback.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const {
    status,
    ml_sub1,
    payout_decimal,
    currency,
    transaction_id,
    destination_program_id,
    destination_program_name,
    country_code,
    ip,
  } = req.query;

  const isApproved = status === "0" || status === "approved";

  if (!isApproved) {
    return res.status(200).send("Ignored");
  }

  if (!ml_sub1 || typeof ml_sub1 !== "string") {
    return res.status(400).send("Missing token");
  }

  const unlock = await prisma.cpaUnlock.findUnique({
    where: { token: ml_sub1 },
    include: { user: true },
  });

  if (!unlock) {
    return res.status(200).send("Unknown token");
  }

  if (unlock.status === "approved") {
    return res.status(200).send("Already processed");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: unlock.userId },
      data: { gamingCredits: { increment: 1 } },
    }),
    prisma.cpaUnlock.update({
      where: { id: unlock.id },
      data: {
        status: "approved",
        transactionId: typeof transaction_id === "string" ? transaction_id : null,
        payout: typeof payout_decimal === "string" ? Number(payout_decimal) : null,
        currency: typeof currency === "string" ? currency : null,
        offerId: typeof destination_program_id === "string" ? destination_program_id : null,
        offerName: typeof destination_program_name === "string" ? destination_program_name : null,
        country: typeof country_code === "string" ? country_code : null,
        leadIp: typeof ip === "string" ? ip : null,
        approvedAt: new Date(),
      },
    }),
  ]);

  return res.status(200).send("OK");
}
