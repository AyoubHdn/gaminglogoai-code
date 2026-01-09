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
  const protocol =
    (req.headers["x-forwarded-proto"] as string) ?? "https";

  const host = req.headers.host;
  const url = req.url;

  const fullUrl = `${protocol}://${host}${url}`;

  const localHash = crypto
    .createHmac("sha256", securityKey)
    .update(fullUrl)
    .digest("hex");

  const remoteHash = req.headers["x-mylead-security-hash"];

  // 🔴 TEMP DEBUG LOGS (IMPORTANT)
  console.log("MYLEAD DEBUG");
  console.log("Full URL:", fullUrl);
  console.log("Local hash:", localHash);
  console.log("Remote hash:", remoteHash);
  console.log("Headers:", req.headers);
  console.log("Query:", req.query);

  if (typeof remoteHash !== "string") {
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
    console.log("⚠️ MYLEAD HASH BYPASSED FOR TEST");
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

  const isApproved =
    status === "approved" ||
    status === "0";

  if (!isApproved) {
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
      transactionId:
        typeof transaction_id === "string"
          ? transaction_id
          : null,

      payout:
        typeof payout_decimal === "string"
          ? Number(payout_decimal)
          : null,

      currency:
        typeof currency === "string"
          ? currency
          : null,

      offerId:
        typeof destination_program_id === "string"
          ? destination_program_id
          : null,

      offerName:
        typeof destination_program_name === "string"
          ? destination_program_name
          : null,

      country:
        typeof country_code === "string"
          ? country_code
          : null,

      leadIp:
        typeof ip === "string"
          ? ip
          : null,

      approvedAt: new Date(),
    },
  }),
]);

  return res.status(200).send("OK");
}
