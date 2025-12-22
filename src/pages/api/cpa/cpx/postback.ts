/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { prisma } from "~/server/db";

const CPX_APP_SECRET = process.env.CPX_APP_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const {
      status,
      trans_id,
      user_id,
      amount_usd,
      ip_click,
      hash,
    } = req.query;

    // Always return 200 to CPX
    if (!user_id || !trans_id || !hash) {
      return res.status(200).json({ ok: true });
    }

    /* ---------------------------
       Validate CPX secure hash
       md5({trans_id}-{appSecret})
    ----------------------------*/
    const expectedHash = crypto
      .createHash("md5")
      .update(`${trans_id}-${CPX_APP_SECRET}`)
      .digest("hex");

    if (hash !== expectedHash) {
      console.warn("❌ CPX hash mismatch");
      return res.status(200).json({ ok: true });
    }

    /* ---------------------------------------
       Find latest pending unlock for user
    ----------------------------------------*/
    const unlock = await prisma.cpaUnlock.findFirst({
      where: {
        userId: String(user_id),
        network: "cpx",
        status: "pending",
      },
      orderBy: { createdAt: "desc" },
    });

    if (!unlock) {
      return res.status(200).json({ ok: true });
    }

    /* --------------------
       STATUS = 1 → APPROVED
    ---------------------*/
    if (String(status) === "1") {
      await prisma.$transaction([
        prisma.cpaUnlock.update({
          where: { id: unlock.id },
          data: {
            status: "approved",
            transactionId: String(trans_id),
            payout: Number(amount_usd ?? 0),
            currency: "USD",
            leadIp: String(ip_click ?? ""),
            approvedAt: new Date(),
          },
        }),

        prisma.user.update({
          where: { id: String(user_id) },
          data: {
            gamingCredits: {
              increment: 1, // reward logic
            },
          },
        }),
      ]);
    }

    /* --------------------
       STATUS = 2 → REVERSED
    ---------------------*/
    if (String(status) === "2") {
      await prisma.cpaUnlock.update({
        where: { id: unlock.id },
        data: {
          status: "rejected",
        },
      });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("🔥 CPX Postback Error:", error);
    return res.status(200).json({ ok: true });
  }
}
