import type { Icon, PrismaClient } from "@prisma/client";

export type GamingDbService = {
  getCredits(userId: string): Promise<number | null>;
  getHasPurchasedCredits(userId: string): Promise<boolean | null>;
  getSavedIcons(userId: string): Promise<Icon[]>;
  getEmoteBases(userId: string): Promise<Icon[]>;
  getCommunityIcons(limit?: number): Promise<Icon[]>;
};

export type GamingPrismaClient = Pick<PrismaClient, "user" | "icon">;

export function createPrismaDbService(
  prisma: GamingPrismaClient,
): GamingDbService {
  return {
    async getCredits(userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { gamingCredits: true },
      });
      return user?.gamingCredits ?? null;
    },

    async getHasPurchasedCredits(userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { hasPurchasedCredits: true },
      });
      return user?.hasPurchasedCredits ?? null;
    },

    getSavedIcons(userId) {
      return prisma.icon.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
    },

    getEmoteBases(userId) {
      return prisma.icon.findMany({
        where: {
          userId,
          prompt: { startsWith: "EmoteBase:" },
          imageKey: { startsWith: `emotes/base/${userId}/` },
        },
        orderBy: { createdAt: "desc" },
      });
    },

    getCommunityIcons(limit = 50) {
      return prisma.icon.findMany({
        take: Math.min(Math.max(limit, 1), 100),
        orderBy: { createdAt: "desc" },
      });
    },
  };
}
