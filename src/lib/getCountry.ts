// lib/getCountry.ts
import type { NextApiRequest } from "next";

export function getCountry(req: NextApiRequest): string {
  return (
    (req.headers["x-vercel-ip-country"] as string) ||
    "US"
  );
}
