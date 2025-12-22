import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const unlock = await prisma.cpaUnlock.findFirst({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!unlock) {
    return res.status(404).json({ error: "No unlock found" });
  }

  return res.json({
    status: unlock.status,            // pending | approved | rejected
    payout: unlock.payout ?? 0,
    approvedAt: unlock.approvedAt,
  });
}
