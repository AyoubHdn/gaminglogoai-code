/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {
      user_id,
      trans_id,
      type,
      amount_usd,
      secure_hash,
    } = req.query;

    if (!user_id || !trans_id || !type || !secure_hash) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    // 🔐 Verify secure hash
    const CPX_SECRET = process.env.CPX_SECURITY_HASH!;
    const expectedHash = crypto
      .createHash("md5")
      .update(`${trans_id}${CPX_SECRET}`)
      .digest("hex");

    if (secure_hash !== expectedHash) {
      return res.status(403).json({ error: "Invalid hash" });
    }

    // Only handle successful completions for now
    if (type !== "complete") {
      return res.status(200).json({ ignored: type });
    }

    // Prevent duplicate credits
    const existing = await prisma.cpaUnlock.findFirst({
      where: { transactionId: String(trans_id) },
    });

    if (existing) {
      return res.status(200).json({ duplicate: true });
    }

    // Create unlock record
    await prisma.cpaUnlock.create({
      data: {
        userId: String(user_id),
        network: "cpx",
        status: "approved",
        transactionId: String(trans_id),
        payout: Number(amount_usd ?? 0),
        token: crypto.randomBytes(16).toString("hex"),
        approvedAt: new Date(),
      },
    });

    // Credit user
    await prisma.user.update({
      where: { id: String(user_id) },
      data: {
        gamingCredits: { increment: 1 },
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("CPX postback error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
