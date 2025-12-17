/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /pages/api/cpa/mylead/postback.ts

import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { prisma } from "~/server/db";

function verifyMyLeadHash(
  req: NextApiRequest,
  securityKey: string
): boolean {
  // Detect protocol correctly behind Vercel / proxies
  const protocol =
    (req.headers["x-forwarded-proto"] as string) ?? "https";

  const host = req.headers.host;
  if (!host) return false;

  // FULL URL exactly as MyLead sent it
  const fullUrl = `${protocol}://${host}${req.url}`;

  const localHash = crypto
    .createHmac("sha256", securityKey)
    .update(fullUrl)
    .digest("hex");

  const remoteHash = req.headers["x-mylead-security-hash"];

  if (!remoteHash || typeof remoteHash !== "string") {
    return false;
  }

  return localHash === remoteHash;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  // 1️⃣ Verify MyLead security hash
  const isValid = verifyMyLeadHash(
    req,
    process.env.MYLEAD_SECURITY_KEY!
  );

  if (!isValid) {
    return res.status(403).send("Invalid signature");
  }

  const {
    lead_status,
    ml_sub1,
    payout_decimal,
    currency,
    offer_id,
    offer_name,
    transaction_id,
    country,
    lead_ip,
  } = req.query;

  // 2️⃣ Only process approved leads
  if (lead_status !== "approved") {
    return res.status(200).send("Ignored");
  }

  if (!ml_sub1 || typeof ml_sub1 !== "string") {
    return res.status(400).send("Missing token");
  }

  // 3️⃣ Find unlock record
  const unlock = await prisma.cpaUnlock.findUnique({
    where: { token: ml_sub1 },
    include: { user: true },
  });

  if (!unlock) {
    return res.status(200).send("Unknown token");
  }

  // 4️⃣ Prevent double crediting
  if (unlock.status === "approved") {
    return res.status(200).send("Already processed");
  }

  // 5️⃣ Atomic update (credit + mark approved)
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
        payout:
          typeof payout_decimal === "string"
            ? Number(payout_decimal)
            : null,
        currency:
          typeof currency === "string" ? currency : null,
        offerId:
          typeof offer_id === "string" ? offer_id : null,
        offerName:
          typeof offer_name === "string" ? offer_name : null,
        transactionId:
          typeof transaction_id === "string"
            ? transaction_id
            : null,
        country:
          typeof country === "string" ? country : null,
        leadIp:
          typeof lead_ip === "string" ? lead_ip : null,
        approvedAt: new Date(),
      },
    }),
  ]);

  return res.status(200).send("OK");
}
