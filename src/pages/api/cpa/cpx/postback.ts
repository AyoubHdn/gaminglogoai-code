/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // CPX uses GET requests
    if (req.method !== "GET") {
      return res.status(405).send("Method Not Allowed");
    }

    const {
      status,
      trans_id,
      user_id,
      amount_usd,
      type,
      ip_click,
      hash,
    } = req.query;

    // 1️⃣ Validate required params
    if (!status || !trans_id || !user_id || !hash) {
      return res.status(400).send("Missing parameters");
    }

    // 2️⃣ Validate hash
    // hash = md5({trans_id}-{APP_SECURITY_HASH})
    const expectedHash = crypto
      .createHash("md5")
      .update(`${trans_id}-${process.env.CPX_SECURITY_HASH}`)
      .digest("hex");

    if (hash !== expectedHash) {
      return res.status(403).send("Invalid hash");
    }

    // 3️⃣ Handle fraud / canceled (status = 2)
    if (String(status) === "2") {
      await prisma.cpaUnlock.updateMany({
        where: { transactionId: String(trans_id) },
        data: { status: "rejected" },
      });

      return res.status(200).send("Canceled / Reverted");
    }

    // Only continue if completed
    if (String(status) !== "1" || String(type) !== "complete") {
      return res.status(200).send("Ignored event");
    }

    // 4️⃣ Prevent duplicate credits
    const existing = await prisma.cpaUnlock.findFirst({
      where: { transactionId: String(trans_id) },
    });

    if (existing) {
      return res.status(200).send("Already processed");
    }

    // 5️⃣ Create CPA unlock + credit user
    const token = crypto.randomBytes(16).toString("hex");

    await prisma.$transaction([
      prisma.cpaUnlock.create({
        data: {
          userId: String(user_id),
          network: "cpx",
          status: "approved",
          transactionId: String(trans_id),
          payout: amount_usd ? Number(amount_usd) : 0,
          token,
          leadIp: ip_click ? String(ip_click) : null,
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

    return res.status(200).send("OK");
  } catch (error) {
    console.error("CPX Postback Error:", error);
    return res.status(500).send("Server error");
  }
}
