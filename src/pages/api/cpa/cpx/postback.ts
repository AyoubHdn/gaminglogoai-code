/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    status,
    trans_id,
    user_id,
    amount_usd,
    ip_click,
    hash,
  } = req.query;

  // 1️⃣ Validate required fields
  if (!user_id || !trans_id || !status || !hash) {
    return res.status(400).send("Missing parameters");
  }

  // 2️⃣ Validate hash
  const expectedHash = crypto
    .createHash("md5")
    .update(`${trans_id}-${process.env.CPX_SECRET}`)
    .digest("hex");

  if (hash !== expectedHash) {
    return res.status(403).send("Invalid hash");
  }

  // 3️⃣ Find pending unlock
  const unlock = await prisma.cpaUnlock.findFirst({
    where: {
      userId: String(user_id),
      network: "cpx",
      status: "pending",
    },
  });

  if (!unlock) {
    return res.status(200).send("No pending unlock");
  }

  // 4️⃣ Status handling
  if (String(status) === "1") {
    // ✅ APPROVED
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
          transactionId: String(trans_id),
          payout: amount_usd ? Number(amount_usd) : null,
          leadIp: ip_click?.toString(),
          approvedAt: new Date(),
        },
      }),
    ]);
  } else if (String(status) === "2") {
    // ❌ REVERSED
    await prisma.cpaUnlock.update({
      where: { id: unlock.id },
      data: {
        status: "rejected",
        transactionId: String(trans_id),
      },
    });
  }

  return res.status(200).send("OK");
}
