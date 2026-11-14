import type { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "~/server/requestAuth";
import { cpxUnlock } from "./cpxUnlock";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const session = await getServerAuthSession({ req, res });
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // 🔒 CPX ONLY (MyLead disabled for now)
  const result = await cpxUnlock(session.user.id);
  return res.status(200).json(result);
}
