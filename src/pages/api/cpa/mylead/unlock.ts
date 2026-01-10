/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /api/cpa/mylead/unlock.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { prisma } from "~/server/db";
import { authOptions } from "~/server/auth";
import { myleadUnlock } from "../myleadUnlock";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Prevent multiple pending unlocks
  const pending = await prisma.cpaUnlock.findFirst({
    where: {
      userId: session.user.id,
      status: "pending",
    },
  });

  if (pending) {
    return res.status(400).json({
      error: "You already have a pending unlock",
    });
  }

  const result = await myleadUnlock(session.user.id);
  return res.status(200).json(result);
}

