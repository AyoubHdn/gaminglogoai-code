/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
    return res.status(405).end("Method not allowed");
  }

  // 1️⃣ Require login
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // 2️⃣ Prevent multiple pending unlocks
  const existing = await prisma.cpaUnlock.findFirst({
    where: {
      userId: session.user.id,
      network: "cpx",
      status: "pending",
    },
  });

  if (existing) {
    return res.status(400).json({
      error: "You already have a pending survey",
    });
  }

  // 3️⃣ Create unlock record
  const token = crypto.randomUUID();

  await prisma.cpaUnlock.create({
    data: {
      userId: session.user.id,
      token,
      network: "cpx",
      status: "pending",
    },
  });

  // 4️⃣ Build CPX redirect URL
  const redirectUrl =
    `https://offers.cpx-research.com/index.php` +
    `?app_id=${process.env.CPX_APP_ID}` +
    `&ext_user_id=${session.user.id}` +
    `&subid_1=gaminglogoai`;

  return res.status(200).json({ redirectUrl });
}
