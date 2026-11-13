import type {
  Adapter,
  AdapterAccount,
  AdapterUser,
} from "next-auth/adapters";

import { createRemoteGamingAuthDbService } from "./authDbService.ts";
import type { DbServiceBinding } from "./dbService";

/** Worker-safe adapter: it only depends on the DB service binding and next-auth types. */
export function createRemoteNextAuthAdapter(
  binding: DbServiceBinding | undefined,
): Adapter {
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
