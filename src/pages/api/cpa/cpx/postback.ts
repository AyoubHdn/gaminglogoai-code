/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import crypto from "crypto";



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cleanQuery = Object.fromEntries(
  Object.entries(req.query).map(([k, v]) => [
    k.trim(),
    typeof v === "string" ? v.trim() : v,
  ])
);
  try {
    const {
      status,
      trans_id,
      user_id,
      amount_usd,
      amount_local,
      ip_click,
      hash,
    } = cleanQuery;

    // 1️⃣ Basic validation
    if (!user_id || !trans_id || !hash) {
      return res.status(400).json({ error: "Missing required params" });
    }

    // 2️⃣ Verify CPX hash
    const APP_SECRET = process.env.CPX_SECURITY_HASH!;
    const expectedHash = crypto
      .createHash("md5")
      .update(`${trans_id}-${APP_SECRET}`)
      .digest("hex");

    if (expectedHash !== hash) {
      return res.status(403).json({ error: "Invalid hash" });
    }

    // 3️⃣ Find latest pending unlock for this user
    const unlock = await prisma.cpaUnlock.findFirst({
      where: {
        userId: String(user_id),
        network: "cpx",
        status: "pending",
      },
      orderBy: { createdAt: "desc" },
    });

    if (!unlock) {
      // Very important: DO NOT error here
      // CPX will retry postback if you return non-200
      return res.status(200).json({ ok: true, message: "No pending unlock" });
    }

    // 4️⃣ Handle reversal (status=2)
    if (String(status) === "2") {
      await prisma.cpaUnlock.update({
        where: { id: unlock.id },
        data: {
          status: "rejected",
        },
      });

      return res.status(200).json({ ok: true, reversed: true });
    }

    // 5️⃣ Approve unlock
    const payoutUsd = Number(amount_usd ?? 0);

    await prisma.$transaction([
      prisma.cpaUnlock.update({
        where: { id: unlock.id },
        data: {
          status: "approved",
          transactionId: String(trans_id),
          payout: payoutUsd,
          currency: "USD",
          leadIp: String(ip_click ?? ""),
          approvedAt: new Date(),
        },
      }),

      prisma.user.update({
        where: { id: String(user_id) },
        data: {
          gamingCredits: { increment: 1 },
        },
      }),
    ]);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("CPX POSTBACK ERROR:", err);

    // Always return 200 so CPX doesn't retry infinitely
    return res.status(200).json({ ok: false });
  }
}
