import type { Adapter } from "next-auth/adapters";

import { createRemoteGamingAuthDbService } from "./authDbService";
import type { DbServiceBinding } from "./dbService";

/** Worker-safe adapter: it only depends on the DB service binding and next-auth types. */
export function createRemoteNextAuthAdapter(
  binding: DbServiceBinding | undefined,
): Adapter {
  const db = createRemoteGamingAuthDbService(binding);
  return {
    createUser: db.createUser,
    getUser: db.getUser,
    getUserByEmail: db.getUserByEmail,
    getUserByAccount: db.getUserByAccount,
    updateUser: db.updateUser,
    deleteUser: db.deleteUser,
    linkAccount: db.linkAccount,
    unlinkAccount: ({
      provider,
      providerAccountId,
    }: {
      provider: string;
      providerAccountId: string;
    }) => db.unlinkAccount(provider, providerAccountId),
    createSession: (session) =>
      db.createSession(session.sessionToken, session.userId, session.expires),
    getSessionAndUser: db.getSessionAndUser,
    updateSession: db.updateSession,
    deleteSession: db.deleteSession,
    createVerificationToken: db.createVerificationToken,
    useVerificationToken: ({ identifier, token }) =>
      db.useVerificationToken(identifier, token),
  };
}
