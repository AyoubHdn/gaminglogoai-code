import type { Icon, PrismaClient } from "@prisma/client";

export type GamingDbService = {
  getCredits(userId: string): Promise<number | null>;
  getHasPurchasedCredits(userId: string): Promise<boolean | null>;
  getSavedIcons(userId: string): Promise<Icon[]>;
  getEmoteBases(userId: string): Promise<Icon[]>;
  getCommunityIcons(limit?: number): Promise<Icon[]>;
};

export type GamingPrismaClient = Pick<PrismaClient, "user" | "icon">;

export type DbServiceOperation =
  | "user.getCredits"
  | "user.getHasPurchasedCredits"
  | "icons.getSavedIcons"
  | "icons.getEmoteBases"
  | "icons.getCommunityIcons";

export type DbServiceBinding = {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
};

type RpcEnvelope = { ok: true; data: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseIcon(value: unknown): Icon {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    (value.prompt !== null && typeof value.prompt !== "string") ||
    (value.userId !== null && typeof value.userId !== "string") ||
    (value.imageKey !== null && typeof value.imageKey !== "string") ||
    typeof value.createdAt !== "string"
  ) {
    throw new Error("Remote DB returned an invalid icon");
  }
  const createdAt = new Date(value.createdAt);
  if (Number.isNaN(createdAt.getTime())) {
    throw new Error("Remote DB returned an invalid icon date");
  }
  return {
    id: value.id,
    prompt: value.prompt,
    userId: value.userId,
    imageKey: value.imageKey,
    createdAt,
  };
}

function parseIconList(value: unknown): Icon[] {
  if (!Array.isArray(value)) throw new Error("Remote DB returned a non-list");
  return value.map(parseIcon);
}

function parseRpcEnvelope(value: unknown): RpcEnvelope {
  if (!isRecord(value) || value.ok !== true || !("data" in value)) {
    throw new Error("Remote DB returned an invalid response");
  }
  return { ok: true, data: value.data };
}

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
          imageKey: `emotes/base/${userId}/`,
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

export function createRemoteGamingDbService(
  binding: DbServiceBinding | undefined,
): GamingDbService {
  if (!binding) {
    throw new Error("Remote DB service binding is required");
  }

  async function call(
    operation: DbServiceOperation,
    input: Record<string, unknown>,
  ): Promise<unknown> {
    const response = await binding.fetch("https://gaming-db.internal/rpc", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ operation, input }),
    });
    const body: unknown = await response.json();
    if (!response.ok) {
      throw new Error("Remote DB service request failed");
    }
    return parseRpcEnvelope(body).data;
  }

  return {
    async getCredits(userId) {
      const value = await call("user.getCredits", { userId });
      if (value !== null && typeof value !== "number") {
        throw new Error("Remote DB returned an invalid credits value");
      }
      return value;
    },

    async getHasPurchasedCredits(userId) {
      const value = await call("user.getHasPurchasedCredits", { userId });
      if (value !== null && typeof value !== "boolean") {
        throw new Error("Remote DB returned an invalid purchase flag");
      }
      return value;
    },

    async getSavedIcons(userId) {
      return parseIconList(await call("icons.getSavedIcons", { userId }));
    },

    async getEmoteBases(userId) {
      return parseIconList(await call("icons.getEmoteBases", { userId }));
    },

    async getCommunityIcons(limit = 50) {
      return parseIconList(await call("icons.getCommunityIcons", { limit }));
    },
  };
}

export function createGamingDbService(options: {
  backend?: "prisma" | "service";
  prisma: GamingPrismaClient;
  binding?: DbServiceBinding;
}): GamingDbService {
  if (options.backend === "service") {
    return createRemoteGamingDbService(options.binding);
  }
  return createPrismaDbService(options.prisma);
}
