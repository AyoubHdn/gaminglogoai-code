/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

  console.log("CPA UNLOCK ENTRY", { userId });

  // 1️⃣ Pending override
  const pending = await prisma.cpaUnlock.findFirst({
    where: { userId, status: "pending" },
    orderBy: { createdAt: "desc" },
  });

  if (pending) {
    console.log("CPA UNLOCK REUSE", pending.network);

    if (pending.network === "cpx") {
      const r = await fetch(`${process.env.NEXTAUTH_URL}/api/cpa/cpx/unlock`, {
        method: "POST",
        headers: { cookie: req.headers.cookie ?? "" },
      });

      const data = await r.json();
      return res.status(200).json(data);
    }

    if (pending.network === "mylead") {
      const r = await fetch(`${process.env.NEXTAUTH_URL}/api/cpa/mylead/unlock`, {
        method: "POST",
        headers: { cookie: req.headers.cookie ?? "" },
      });

      const data = await r.json();
      return res.status(200).json(data);
    }
  }

  // 2️⃣ Round-robin
  const nextNetwork = await prisma.$transaction(async (tx) => {
    const state = await tx.cpaSwitch.findUnique({ where: { id: 1 } });
    if (!state) throw new Error("CpaSwitch missing");

    const next = state.lastUsed === "cpx" ? "mylead" : "cpx";

    await tx.cpaSwitch.update({
      where: { id: 1 },
      data: { lastUsed: next },
    });

    return next;
  });

  console.log("CPA UNLOCK NEW NETWORK", nextNetwork);

  // 3️⃣ Call correct unlock internally
  const endpoint =
    nextNetwork === "cpx"
      ? "/api/cpa/cpx/unlock"
      : "/api/cpa/mylead/unlock";

  const r = await fetch(`${process.env.NEXTAUTH_URL}${endpoint}`, {
    method: "POST",
    headers: { cookie: req.headers.cookie ?? "" },
  });

  const data = await r.json();
  return res.status(200).json(data);
}
