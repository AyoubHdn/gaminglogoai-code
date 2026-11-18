import NextAuth from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { createRequestAuthOptions } from "~/server/requestAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await NextAuth(req, res, await createRequestAuthOptions());
}
