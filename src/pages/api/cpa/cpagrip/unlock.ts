/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  // 1️⃣ Get logged-in user
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).send("Unauthorized");
  }

  // 2️⃣ Select an active CPAGrip offer (simple version)
  const offer = await prisma.offer.findFirst({
    where: {
      active: true,
      network: "cpagrip", // IMPORTANT
    },
    orderBy: {
      priority: "asc",
    },
  });

  if (!offer) {
    return res.status(404).send("No offer available");
  }

  // 3️⃣ Create secure tracking token
  const token = crypto.randomUUID();

    await prisma.cpaUnlock.create({
    data: {
        userId: session.user.id,
        token,
        network: "cpagrip",
        status: "pending",
        offerId: offer.externalId,
        offerName: offer.title,
    },
    });

  // 4️⃣ Build CPAGrip redirect URL
  // Replace BASE_TRACKING_URL with real CPAGrip tracking link
  const redirectUrl = `${process.env.CPAGRIP_TRACKING_BASE_URL}&tracking_id=${token}`;

  // 5️⃣ Return redirect URL to frontend
  return res.status(200).json({ redirectUrl });
}
