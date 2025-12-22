/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
    amount_local,
    ip_click,
    hash,
  } = req.query;

  // 1️⃣ Validate required fields
  if (!user_id || !trans_id || !amount_usd) {
    return res.status(400).send("Missing required parameters");
  }

  // 2️⃣ (Optional but recommended) validate hash
  if (process.env.CPX_SECRET) {
    const expected = crypto
      .createHash("md5")
      .update(`${trans_id}-${process.env.CPX_SECRET}`)
      .digest("hex");

    if (hash !== expected) {
      return res.status(403).send("Invalid hash");
    }
  }

  // 3️⃣ Find latest pending CPX unlock
  let unlock = await prisma.cpaUnlock.findFirst({
    where: {
      userId: String(user_id),
      network: "cpx",
      status: "pending",
    },
    orderBy: { createdAt: "desc" },
  });

  // 4️⃣ If no pending unlock exists (TEST POSTBACK case)
  if (!unlock) {
    unlock = await prisma.cpaUnlock.create({
      data: {
        userId: String(user_id),
        network: "cpx",
        status: "approved",
        transactionId: String(trans_id),
        payout: Number(amount_usd),
        leadIp: String(ip_click),
        token: crypto.randomBytes(16).toString("hex"),
        approvedAt: new Date(),
      },
    });
  } else {
    // 5️⃣ Update existing unlock
    if (String(status) === "1") {
      await prisma.cpaUnlock.update({
        where: { id: unlock.id },
        data: {
          status: "approved",
          transactionId: String(trans_id),
          payout: Number(amount_usd),
          leadIp: String(ip_click),
          approvedAt: new Date(),
        },
      });
    } else if (String(status) === "2") {
      await prisma.cpaUnlock.update({
        where: { id: unlock.id },
        data: {
          status: "rejected",
        },
      });
    }
  }

  return res.status(200).send("OK");
}
