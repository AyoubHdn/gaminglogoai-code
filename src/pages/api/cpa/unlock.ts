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

  console.log("CPA UNLOCK ENTRY", {
    userId,
  });

  const pending = await prisma.cpaUnlock.findFirst({
    where: { userId, status: "pending" },
    orderBy: { createdAt: "desc" },
  });

  console.log("CPA UNLOCK PENDING", pending);

  if (pending) {
    console.log("CPA UNLOCK REUSING NETWORK", pending.network);

    if (pending.network === "cpx") {
      return res.redirect(307, "/api/cpa/cpx/unlock");
    }

    if (pending.network === "mylead") {
      return res.redirect(307, "/api/cpa/mylead/unlock");
    }
  }

  // Round robin
  const nextNetwork = await prisma.$transaction(async (tx) => {
    
  const state = await tx.cpaSwitch.findUnique({
    where: { id: 1 },
  });

  if (!state) {
    throw new Error("CpaSwitch row is missing");
  }

console.log("CPA SWITCH STATE", state);

const next =
  state.lastUsed === "cpx" ? "mylead" : "cpx";

    await tx.cpaSwitch.update({
      where: { id: 1 },
      data: { lastUsed: next },
    });

    console.log("CPA SWITCH NEXT", next);

    return next;
  });

  console.log("CPA UNLOCK FINAL NETWORK", nextNetwork);

  // 3️⃣ REDIRECT TO CHOSEN NETWORK
  if (nextNetwork === "cpx") {
    return res.redirect(307, "/api/cpa/cpx/unlock");
  }

  return res.redirect(307, "/api/cpa/mylead/unlock");
}