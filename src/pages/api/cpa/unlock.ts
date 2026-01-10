import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

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

  // 1️⃣ CHECK FOR EXISTING PENDING UNLOCK (MOST IMPORTANT)
  const pending = await prisma.cpaUnlock.findFirst({
    where: {
      userId,
      status: "pending",
    },
    orderBy: { createdAt: "desc" },
  });

  if (pending) {
    // 🔁 Reuse SAME network
    if (pending.network === "cpx") {
      return res.redirect(307, "/api/cpa/cpx/unlock");
    }

    if (pending.network === "mylead") {
      return res.redirect(307, "/api/cpa/mylead/unlock");
    }
  }

  // 2️⃣ NO PENDING → APPLY ROUND-ROBIN
  const nextNetwork = await prisma.$transaction(async (tx) => {
    const state = await tx.cpaSwitch.findUnique({
      where: { id: 1 },
    });

    if (!state) {
      throw new Error("CpaSwitch not initialized");
    }

    const next =
      state.lastUsed === "cpx" ? "mylead" : "cpx";

    await tx.cpaSwitch.update({
      where: { id: 1 },
      data: { lastUsed: next },
    });

    return next;
  });

  // 3️⃣ REDIRECT TO CHOSEN NETWORK
  if (nextNetwork === "cpx") {
    return res.redirect(307, "/api/cpa/cpx/unlock");
  }

  return res.redirect(307, "/api/cpa/mylead/unlock");
}