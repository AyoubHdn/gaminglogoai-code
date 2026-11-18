/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
// lib/selectOffer.ts
import { Offer } from "@prisma/client";

export function selectBestOffer(
  offers: Offer[],
  country: string,
  device: string,
  os: string
): Offer | null {
  const eligible = offers.filter((o) => {
    if (!o.active) return false;
    if (o.device !== device) return false;
    if (o.os !== "any" && o.os !== os) return false;
    if (o.countries.length > 0 && !o.countries.includes(country))
      return false;
    return true;
  });

  if (eligible.length === 0) return null;

  const sorted = eligible.sort((a, b) => a.priority - b.priority);
  return sorted[0] ?? null;
}
