import crypto from "crypto";
import { prisma } from "~/server/db";

export async function cpxUnlock(userId: string) {
  const token = crypto.randomUUID();

  await prisma.cpaUnlock.create({
    data: {
      userId,
      token,
      network: "cpx",
      status: "pending",
    },
  });

  const redirectUrl =
    `https://offers.cpx-research.com/index.php` +
    `?app_id=${process.env.CPX_APP_ID}` +
    `&ext_user_id=${userId}` +
    `&subid_1=gaminglogoai`;

  return { redirectUrl };
}
