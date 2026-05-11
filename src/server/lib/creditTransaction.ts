import { TRPCError } from "@trpc/server";

import { prisma } from "../db";

export async function withCreditTransaction<T>(
  userId: string,
  amount: number,
  fn: () => Promise<T>
): Promise<T> {
  if (amount <= 0) {
    return fn();
  }

  const { count } = await prisma.$transaction((tx) =>
    tx.user.updateMany({
      where: {
        id: userId,
        gamingCredits: {
          gte: amount,
        },
      },
      data: {
        gamingCredits: {
          decrement: amount,
        },
      },
    })
  );

  if (count <= 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Not enough credits",
    });
  }

  try {
    return await fn();
  } catch (error) {
    await prisma.$transaction((tx) =>
      tx.user.update({
        where: {
          id: userId,
        },
        data: {
          gamingCredits: {
            increment: amount,
          },
        },
      })
    );

    throw error;
  }
}
