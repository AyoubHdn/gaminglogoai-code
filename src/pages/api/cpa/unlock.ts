// src/pages/api/cpa/unlock.ts
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

  console.log("=== CPA ROUTER START ===");
  console.log("USER", userId);

  // 1️⃣ Pending check
  console.log("CHECKING PENDING…");
  const pending = await prisma.cpaUnlock.findFirst({
    where: { userId, status: "pending" },
    orderBy: { createdAt: "desc" },
  });
  console.log("PENDING RESULT", pending);

  // 2️⃣ If pending
  if (pending) {
    console.log("USING PENDING NETWORK", pending.network);
    console.log("PENDING TOKEN", pending.token);

    if (pending.network === "mylead") {
      const url = `https://price-low.eu/a/OYkMMu2BVWcrAvB?ml_sub1=${pending.token}`;
      console.log("RETURNING MYLEAD URL", url);
      return res.status(200).json({ redirectUrl: url });
    }

    const url =
      `https://offers.cpx-research.com/index.php` +
      `?app_id=${process.env.CPX_APP_ID}` +
      `&ext_user_id=${userId}` +
      `&subid_1=gaminglogoai`;

    console.log("RETURNING CPX URL", url);
    return res.status(200).json({ redirectUrl: url });
  }

  // 3️⃣ No pending → switch
  console.log("NO PENDING, SWITCHING…");
  const next = await prisma.$transaction(async (tx) => {
    const state = await tx.cpaSwitch.findUnique({ where: { id: 1 } });
    console.log("SWITCH STATE", state);

    if (!state) throw new Error("CpaSwitch missing");

    const n = state.lastUsed === "cpx" ? "mylead" : "cpx";
    console.log("SWITCH NEXT", n);

    await tx.cpaSwitch.update({
      where: { id: 1 },
      data: { lastUsed: n },
    });

    return n;
  });

  console.log("FINAL NETWORK", next);

  // 4️⃣ Create new unlock
  const result =
    next === "mylead"
      ? await myleadUnlock(userId)
      : await cpxUnlock(userId);

  console.log("CREATED UNLOCK", result);

  console.log("=== CPA ROUTER END ===");

  return res.status(200).json(result);

}
