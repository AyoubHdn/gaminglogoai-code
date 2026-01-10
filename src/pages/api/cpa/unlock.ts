import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { cpxUnlock } from "./cpxUnlock";
import { myleadUnlock } from "./myleadUnlock";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.id;

  // 1️⃣ Pending override
  const pending = await prisma.cpaUnlock.findFirst({
    where: { userId, status: "pending" },
    orderBy: { createdAt: "desc" },
  });

  if (pending) {
    if (pending.network === "cpx") {
      return res.status(200).json(await cpxUnlock(userId));
    }
    return res.status(200).json(await myleadUnlock(userId));
  }

  // 2️⃣ Round robin
  const next = await prisma.$transaction(async (tx) => {
    const state = await tx.cpaSwitch.findUnique({ where: { id: 1 } });
    if (!state) throw new Error("CpaSwitch missing");

    const n = state.lastUsed === "cpx" ? "mylead" : "cpx";

    await tx.cpaSwitch.update({
      where: { id: 1 },
      data: { lastUsed: n },
    });

    return n;
  });

  // 3️⃣ Create unlock
  const result =
    next === "cpx"
      ? await cpxUnlock(userId)
      : await myleadUnlock(userId);

  return res.status(200).json(result);
}
