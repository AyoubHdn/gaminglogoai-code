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

const CPX_SECRET = process.env.CPX_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {
      status,
      trans_id,
      user_id,
      type,
      amount_local,
      amount_usd,
      ip_click,
      hash,
    } = req.query;

    // ---- 1. Required params check ----
    if (!trans_id || !user_id || !hash) {
      return res.status(400).json({ error: "Missing required params" });
    }

    // ---- 2. Hash validation (AUTHORITATIVE) ----
    const expectedHash = crypto
      .createHash("md5")
      .update(`${trans_id}-${CPX_SECRET}`)
      .digest("hex");

    if (hash !== expectedHash) {
      return res.status(403).json({ error: "Invalid hash" });
    }

    // ---- 3. Find latest pending unlock for user ----
    const unlock = await prisma.cpaUnlock.findFirst({
      where: {
        userId: String(user_id),
        network: "cpx",
        status: "pending",
      },
      orderBy: { createdAt: "desc" },
    });

    if (!unlock) {
      return res.status(200).json({ message: "No pending unlock" });
    }

    const payoutUsd = Number(amount_usd ?? 0);
    const result = mapCpxType(String(type), payoutUsd);

    // ---- 4. Status mapping ----
    let newStatus: "approved" | "rejected" = "approved";
    if (status === "2") newStatus = "rejected";

    // ---- 5. Update unlock ----
    await prisma.cpaUnlock.update({
      where: { id: unlock.id },
      data: {
        status: newStatus,
        transactionId: String(trans_id),
        payout: payoutUsd,
        currency: "USD",
        leadIp: String(ip_click ?? ""),
        approvedAt: newStatus === "approved" ? new Date() : null,
        result, // <- enum CpaResult
      },
    });

    // ---- 6. Credit logic ----
    if (newStatus === "approved" && result !== "screenout_no_bonus") {
      await prisma.user.update({
        where: { id: String(user_id) },
        data: { gamingCredits: { increment: 1 } },
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("CPX postback error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}