import type {
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";
import type { PrismaClient } from "@prisma/client";

import type { DbServiceBinding } from "./dbService";

export type GamingAuthDbService = {
  getUserForMautic(id: string): Promise<GamingAuthProfile | null>;
  createUser(user: Omit<AdapterUser, "id">): Promise<AdapterUser>;
  getUser(id: string): Promise<AdapterUser | null>;
  getUserByEmail(email: string): Promise<AdapterUser | null>;
  getUserByAccount(account: {
    provider: string;
    providerAccountId: string;
  }): Promise<AdapterUser | null>;
  updateUser(
    user: Partial<AdapterUser> & Pick<AdapterUser, "id">,
  ): Promise<AdapterUser>;
  deleteUser(id: string): Promise<void>;
  linkAccount(account: AdapterAccount): Promise<AdapterAccount>;
  unlinkAccount(provider: string, providerAccountId: string): Promise<void>;
  createSession(
    sessionToken: string,
    userId: string,
    expires: Date,
  ): Promise<AdapterSession>;
  getSessionAndUser(sessionToken: string): Promise<{
    session: AdapterSession;
    user: AdapterUser;
  } | null>;
  updateSession(
    session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">,
  ): Promise<AdapterSession | null>;
  deleteSession(sessionToken: string): Promise<void>;
  createVerificationToken(token: VerificationToken): Promise<VerificationToken>;
  useVerificationToken(
    identifier: string,
    token: string,
  ): Promise<VerificationToken | null>;
};

export type GamingAuthProfile = {
  id: string;
  email: string;
  name: string | null;
  gamingCredits: number;
  gamingPlan: string;
};

export type GamingPrismaAuthClient = Pick<PrismaClient, "user">;

type RpcEnvelope = { ok: true; data: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseRpcEnvelope(value: unknown): RpcEnvelope {
  if (!isRecord(value) || value.ok !== true || !("data" in value)) {
    throw new Error("Remote DB returned an invalid response");
  }
  return { ok: true, data: value.data };
}

function nullableString(value: unknown, field: string): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string")
    throw new Error(`Remote DB returned invalid ${field}`);
  return value;
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Remote DB returned invalid ${field}`);
  }
  return value;
}

function parseDate(value: unknown, field: string): Date {
  if (typeof value !== "string")
    throw new Error(`Remote DB returned invalid ${field}`);
  const date = new Date(value);
  if (Number.isNaN(date.getTime()))
    throw new Error(`Remote DB returned invalid ${field}`);
  return date;
}

function nullableDate(value: unknown, field: string): Date | null {
  if (value === null || value === undefined) return null;
  return parseDate(value, field);
}

function parseUser(value: unknown): AdapterUser {
  if (!isRecord(value)) throw new Error("Remote DB returned invalid auth user");
  return {
    id: requiredString(value.id, "user id"),
    email: requiredString(value.email, "user email"),
    name: nullableString(value.name, "user name"),
    image: nullableString(value.image, "user image"),
    emailVerified: nullableDate(value.emailVerified, "user emailVerified"),
  };
}

function parseAuthProfile(value: unknown): GamingAuthProfile {
  if (!isRecord(value))
    throw new Error("Remote DB returned invalid auth profile");
  if (
    typeof value.id !== "string" ||
    typeof value.email !== "string" ||
    typeof value.gamingCredits !== "number" ||
    typeof value.gamingPlan !== "string"
  ) {
    throw new Error("Remote DB returned invalid auth profile");
  }
  return {
    id: value.id,
    email: value.email,
    name: nullableString(value.name, "profile name"),
    gamingCredits: value.gamingCredits,
    gamingPlan: value.gamingPlan,
  };
}

export function createPrismaGamingAuthDbService(
  prisma: GamingPrismaAuthClient,
): Pick<GamingAuthDbService, "getUserForMautic"> {
  return {
    async getUserForMautic(id) {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          gamingCredits: true,
          gamingPlan: true,
        },
      });
      if (!user?.email) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        gamingCredits: user.gamingCredits,
        gamingPlan: user.gamingPlan,
      };
    },
  };
}

type ParsedAccount = AdapterAccount & {
  id: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
};

function parseAccount(value: unknown): ParsedAccount {
  if (!isRecord(value))
    throw new Error("Remote DB returned invalid auth account");
  const accountType = value.type;
  if (
    accountType !== "email" &&
    accountType !== "oauth" &&
    accountType !== "credentials"
  ) {
    throw new Error("Remote DB returned invalid account type");
  }
  return {
    id: requiredString(value.id, "account id"),
    userId: requiredString(value.userId, "account userId"),
    type: accountType,
    provider: requiredString(value.provider, "account provider"),
    providerAccountId: requiredString(
      value.providerAccountId,
      "account providerAccountId",
    ),
    refresh_token: nullableString(value.refresh_token, "account refresh_token"),
    access_token: nullableString(value.access_token, "account access_token"),
    expires_at: typeof value.expires_at === "number" ? value.expires_at : null,
    token_type: nullableString(value.token_type, "account token_type"),
    scope: nullableString(value.scope, "account scope"),
    id_token: nullableString(value.id_token, "account id_token"),
    session_state: nullableString(value.session_state, "account session_state"),
  };
}

function parseSession(value: unknown): AdapterSession {
  if (!isRecord(value))
    throw new Error("Remote DB returned invalid auth session");
  return {
    sessionToken: requiredString(value.sessionToken, "session token"),
    userId: requiredString(value.userId, "session userId"),
    expires: parseDate(value.expires, "session expires"),
  };
}

function parseVerificationToken(value: unknown): VerificationToken {
  if (!isRecord(value))
    throw new Error("Remote DB returned invalid verification token");
  return {
    identifier: requiredString(value.identifier, "verification identifier"),
    token: requiredString(value.token, "verification token"),
    expires: parseDate(value.expires, "verification expires"),
  };
}

function createUserId(): string {
  return crypto.randomUUID();
}

export function createRemoteGamingAuthDbService(
  binding: DbServiceBinding | undefined,
): GamingAuthDbService {
  if (!binding) throw new Error("Remote DB service binding is required");
  const serviceBinding = binding;

  async function call(
    operation: string,
    input: Record<string, unknown>,
  ): Promise<unknown> {
    const response = await serviceBinding.fetch(
      "https://gaming-db.internal/rpc",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ operation, input }),
      },
    );
    const body: unknown = await response.json();
    if (!response.ok) {
      const code =
        isRecord(body) &&
        isRecord(body.error) &&
        typeof body.error.code === "string"
          ? body.error.code
          : "UNKNOWN";
      throw new Error(`Remote DB service request failed: ${code}`);
    }
    return parseRpcEnvelope(body).data;
  }

  return {
    getUserForMautic(id) {
      return call("auth.getUserForMautic", { id }).then((value) =>
        value === null ? null : parseAuthProfile(value),
      );
    },
    createUser(user) {
      return call("auth.createUser", {
        id: createUserId(),
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
      }).then(parseUser);
    },
    getUser(id) {
      return call("auth.getUser", { id }).then((value) =>
        value === null ? null : parseUser(value),
      );
    },
    getUserByEmail(email) {
      return call("auth.getUserByEmail", { email }).then((value) =>
        value === null ? null : parseUser(value),
      );
    },
    getUserByAccount(account) {
      return call("auth.getUserByAccount", { account }).then((value) =>
        value === null ? null : parseUser(value),
      );
    },
    updateUser(user) {
      return call("auth.updateUser", {
        id: user.id,
        ...(user.name !== undefined ? { name: user.name } : {}),
        ...(user.email !== undefined ? { email: user.email } : {}),
        ...(user.emailVerified !== undefined
          ? { emailVerified: user.emailVerified }
          : {}),
        ...(user.image !== undefined ? { image: user.image } : {}),
      }).then(parseUser);
    },
    deleteUser(id) {
      return call("auth.deleteUser", { id }).then(() => undefined);
    },
    linkAccount(account) {
      return call("auth.linkAccount", { account }).then(parseAccount);
    },
    unlinkAccount(provider, providerAccountId) {
      return call("auth.unlinkAccount", { provider, providerAccountId }).then(
        () => undefined,
      );
    },
    createSession(sessionToken, userId, expires) {
      return call("auth.createSession", { sessionToken, userId, expires }).then(
        parseSession,
      );
    },
    getSessionAndUser(sessionToken) {
      return call("auth.getSessionAndUser", { sessionToken }).then((value) => {
        if (value === null) return null;
        if (!isRecord(value) || !("session" in value) || !("user" in value)) {
          throw new Error("Remote DB returned invalid session/user");
        }
        return {
          session: parseSession(value.session),
          user: parseUser(value.user),
        };
      });
    },
    updateSession(session) {
      return call("auth.updateSession", {
        sessionToken: session.sessionToken,
        ...(session.expires !== undefined ? { expires: session.expires } : {}),
      }).then((value) => (value === null ? null : parseSession(value)));
    },
    deleteSession(sessionToken) {
      return call("auth.deleteSession", { sessionToken }).then(() => undefined);
    },
    createVerificationToken(token) {
      return call("auth.createVerificationToken", {
        identifier: token.identifier,
        token: token.token,
        expires: token.expires,
      }).then(parseVerificationToken);
    },
    useVerificationToken(identifier, token) {
      return call("auth.useVerificationToken", { identifier, token }).then(
        (value) => (value === null ? null : parseVerificationToken(value)),
      );
    },
  };
}
