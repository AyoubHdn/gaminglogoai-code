/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// pages/api/cpa/offer.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { getCountry } from "~/lib/getCountry";
import { selectBestOffer } from "~/lib/selectOffer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { device, os } = req.query;

  if (!device || !os) {
    return res.status(400).json({ error: "Missing device info" });
  }

  const country = getCountry(req);

  const offers = await prisma.offer.findMany({
    where: { active: true },
  });

  const offer = selectBestOffer(
    offers,
    country,
    device as string,
    os as string
  );

  return res.status(200).json({
    country,
    offer,
  });
}
