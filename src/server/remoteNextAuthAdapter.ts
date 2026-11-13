import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";

import { createRemoteGamingAuthDbService } from "./authDbService.ts";
import type { DbServiceBinding } from "./dbService";

type RemoteNextAuthAdapterMethods = {
  createUser: (user: Omit<AdapterUser, "id">) => Promise<AdapterUser>;
  getUser: (id: string) => Promise<AdapterUser | null>;
  getUserByEmail: (email: string) => Promise<AdapterUser | null>;
  getUserByAccount: (
    account: Pick<AdapterAccount, "provider" | "providerAccountId">,
  ) => Promise<AdapterUser | null>;
  updateUser: (
    user: Partial<AdapterUser> & Pick<AdapterUser, "id">,
  ) => Promise<AdapterUser>;
  deleteUser: (id: string) => Promise<void>;
  linkAccount: (account: AdapterAccount) => Promise<AdapterAccount>;
  unlinkAccount: (
    account: Pick<AdapterAccount, "provider" | "providerAccountId">,
  ) => Promise<void>;
  createSession: (session: {
    sessionToken: string;
    userId: string;
    expires: Date;
  }) => Promise<AdapterSession>;
  getSessionAndUser: (sessionToken: string) => Promise<{
    session: AdapterSession;
    user: AdapterUser;
  } | null>;
  updateSession: (
    session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">,
  ) => Promise<AdapterSession | null>;
  deleteSession: (sessionToken: string) => Promise<void>;
  createVerificationToken: (
    token: VerificationToken,
  ) => Promise<VerificationToken>;
  useVerificationToken: (input: {
    identifier: string;
    token: string;
  }) => Promise<VerificationToken | null>;
};

export type GamingRemoteNextAuthAdapter = Omit<
  Adapter,
  keyof RemoteNextAuthAdapterMethods
> &
  RemoteNextAuthAdapterMethods;

/** Worker-safe adapter: it only depends on the DB service binding and next-auth types. */
export function createRemoteNextAuthAdapter(
  binding: DbServiceBinding | undefined,
): GamingRemoteNextAuthAdapter {
  const db = createRemoteGamingAuthDbService(binding);
  return {
    createUser: (user: Omit<AdapterUser, "id">) => db.createUser(user),
    getUser: (id) => db.getUser(id),
    getUserByEmail: (email) => db.getUserByEmail(email),
    getUserByAccount: (
      account: Pick<AdapterAccount, "provider" | "providerAccountId">,
    ) => db.getUserByAccount(account),
    updateUser: (user) => db.updateUser(user),
    deleteUser: (id) => db.deleteUser(id),
    linkAccount: (account: AdapterAccount) => db.linkAccount(account),
    unlinkAccount: ({
      provider,
      providerAccountId,
    }: {
      provider: string;
      providerAccountId: string;
    }) => db.unlinkAccount(provider, providerAccountId),
    createSession: (session) =>
      db.createSession(session.sessionToken, session.userId, session.expires),
    getSessionAndUser: (sessionToken) => db.getSessionAndUser(sessionToken),
    updateSession: (session) => db.updateSession(session),
    deleteSession: (sessionToken) => db.deleteSession(sessionToken),
    createVerificationToken: (token) => db.createVerificationToken(token),
    useVerificationToken: ({ identifier, token }) =>
      db.useVerificationToken(identifier, token),
  };
}
