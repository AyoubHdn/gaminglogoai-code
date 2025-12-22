/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
// /api/cpa/cpx/postback.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import crypto from "crypto";

// /api/cpa/cpx/postback.ts

function mapCpxType(type: string | undefined, payout: number) {
  if (type === "complete") return "complete";
  if (type === "bonus") return "screenout_bonus";
  if (type === "out_okay") return "screenout_bonus";
  if (type === "out_quality") return "screenout_no_bonus";
  return "screenout_no_bonus";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    status,
    trans_id,
    user_id,
    amount_usd,
    amount_local,
    ip_click,
    type,
    hash,
  } = req.query;

  // 1. Validate hash
  const expectedHash = crypto
    .createHash("md5")
    .update(`${trans_id}-${process.env.CPX_SECRET}`)
    .digest("hex");

  if (hash !== expectedHash) {
    return res.status(403).json({ error: "Invalid hash" });
  }

  // 2. Find pending unlock
  const unlock = await prisma.cpaUnlock.findFirst({
    where: {
      userId: String(user_id),
      network: "cpx",
      status: "pending",
    },
  });

  if (!unlock) {
    return res.json({ message: "No pending unlock" });
  }

  // 3. Reversal
  if (String(status) === "2") {
    await prisma.cpaUnlock.update({
      where: { id: unlock.id },
      data: {
        status: "rejected",
        result: "reversed",
      },
    });

    return res.json({ ok: true });
  }

  // 4. Normal completion / screenout
  const payout = Number(amount_usd ?? 0);
  const result = mapCpxType(String(type), payout);

  await prisma.cpaUnlock.update({
    where: { id: unlock.id },
    data: {
      status: "approved",
      result,
      transactionId: String(trans_id),
      payout,
      currency: "USD",
      leadIp: String(ip_click),
      approvedAt: new Date(),
    },
  });

  // 5. Credit logic (business decision)
  if (result === "complete" || result === "screenout_bonus") {
    await prisma.user.update({
      where: { id: unlock.userId },
      data: { gamingCredits: { increment: 1 } },
    });
  }

  return res.json({ ok: true });
}
