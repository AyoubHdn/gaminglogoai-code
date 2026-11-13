import assert from "node:assert/strict";
import test from "node:test";
import postgres from "postgres";
import { PrismaClient } from "@prisma/client";
import type { AdapterAccount } from "next-auth/adapters";

import { createRemoteNextAuthAdapter } from "../../../src/server/remoteNextAuthAdapter.ts";
import { createDbRpcHandler } from "./index.ts";

const testUrl = process.env.GAMING_DB_SERVICE_TEST_DATABASE_URL;
if (!testUrl)
  throw new Error("GAMING_DB_SERVICE_TEST_DATABASE_URL is required");
const parsed = new URL(testUrl);
if (
  !["127.0.0.1", "localhost", "[::1]"].includes(parsed.hostname) ||
  parsed.port !== "5432" ||
  parsed.pathname !== "/gaminglogoai_ci" ||
  parsed.search ||
  parsed.hash
) {
  throw new Error(
    "Only disposable localhost gaminglogoai_ci PostgreSQL is allowed",
  );
}

const prisma = new PrismaClient({ datasources: { db: { url: testUrl } } });
const sql = postgres(testUrl, { prepare: false });

void test("remote auth adapter fails closed without a binding", () => {
  assert.throws(
    () => createRemoteNextAuthAdapter(undefined),
    /binding is required/,
  );
});

void test("remote auth errors do not fall back to Prisma", async () => {
  const adapter = createRemoteNextAuthAdapter({
    fetch: () =>
      Promise.resolve(
        new Response(
          JSON.stringify({ ok: false, error: { code: "DB_READ_FAILED" } }),
          {
            status: 500,
            headers: { "content-type": "application/json" },
          },
        ),
      ),
  });
  await assert.rejects(
    Promise.resolve(adapter.getUser("missing")),
    /DB_READ_FAILED/,
  );
});

function createWorkerBinding() {
  const handler = createDbRpcHandler((query, values) =>
    sql.unsafe(query, values as never[]),
  );
  return {
    fetch(input: RequestInfo | URL, init?: RequestInit) {
      return handler(new Request(input, init));
    },
  };
}

void test("remote NextAuth adapter crosses the Worker RPC and PostgreSQL boundary", async () => {
  const prefix =
    "auth-rpc-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  const adapter = createRemoteNextAuthAdapter(createWorkerBinding());
  const createUser = adapter.createUser;
  const getUser = adapter.getUser;
  const getUserByEmail = adapter.getUserByEmail;
  const getUserByAccount = adapter.getUserByAccount;
  const updateUser = adapter.updateUser;
  const linkAccount = adapter.linkAccount;
  const createSession = adapter.createSession;
  const getSessionAndUser = adapter.getSessionAndUser;
  const updateSession = adapter.updateSession;
  const createVerificationToken = adapter.createVerificationToken;
  const useVerificationToken = adapter.useVerificationToken;
  try {
    const user = await createUser({
      email: `${prefix}@example.test`,
      name: null,
      image: null,
      emailVerified: null,
    });
    const stored = await prisma.user.findUnique({ where: { id: user.id } });
    assert.equal(stored?.gamingCredits, 1);
    assert.equal(stored?.gamingPlan, "None");
    assert.equal(stored?.hasPurchasedCredits, false);
    assert.deepEqual(await getUser(user.id), user);
    assert.deepEqual(await getUserByEmail(user.email), user);
    assert.equal(
      await getUserByAccount({ provider: "google", providerAccountId: prefix }),
      null,
    );

    const account: AdapterAccount = {
      id: `${prefix}-account`,
      userId: user.id,
      type: "oauth" as const,
      provider: "google",
      providerAccountId: prefix,
    };
    assert.deepEqual(await linkAccount(account), {
      ...account,
      refresh_token: undefined,
      access_token: undefined,
      expires_at: undefined,
      token_type: undefined,
      scope: undefined,
      id_token: undefined,
      session_state: undefined,
    });
    assert.deepEqual(await getUserByAccount(account), user);

    const updated = await updateUser({
      id: user.id,
      name: "Updated",
      image: "https://img.test/a",
    });
    assert.equal(updated.name, "Updated");
    assert.equal(updated.image, "https://img.test/a");
    assert.equal(
      (await prisma.user.findUnique({ where: { id: user.id } }))?.gamingCredits,
      1,
    );

    const expires = new Date("2030-01-01T00:00:00.000Z");
    const session = await createSession({
      sessionToken: `${prefix}-session`,
      userId: user.id,
      expires,
    });
    assert.deepEqual(await getSessionAndUser(session.sessionToken), {
      session,
      user: updated,
    });
    const newExpiry = new Date("2030-02-01T00:00:00.000Z");
    assert.equal(
      (
        await updateSession({
          sessionToken: session.sessionToken,
          expires: newExpiry,
        })
      )?.expires.getTime(),
      newExpiry.getTime(),
    );
    assert.equal(await getSessionAndUser(`${prefix}-missing`), null);

    const token = await createVerificationToken({
      identifier: `${prefix}-identifier`,
      token: `${prefix}-token`,
      expires,
    });
    assert.ok(token);
    const consumed = await Promise.all([
      useVerificationToken({
        identifier: token.identifier,
        token: token.token,
      }),
      useVerificationToken({
        identifier: token.identifier,
        token: token.token,
      }),
    ]);
    assert.equal(consumed.filter((value) => value !== null).length, 1);
    assert.equal(consumed.filter((value) => value === null).length, 1);
    assert.equal(
      await useVerificationToken({
        identifier: token.identifier,
        token: token.token,
      }),
      null,
    );

    const secondUser = await createUser({
      email: `${prefix}-second@example.test`,
      name: "Second",
      image: null,
      emailVerified: null,
    });
    await assert.rejects(
      linkAccount({ ...account, userId: secondUser.id }),
      /AUTH_ACCOUNT_OWNERSHIP_CONFLICT/,
    );
    assert.equal(
      (
        await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: "google",
              providerAccountId: prefix,
            },
          },
        })
      )?.userId,
      user.id,
    );
  } finally {
    await prisma.user.deleteMany({ where: { id: { startsWith: prefix } } });
    await sql.end({ timeout: 1 });
    await prisma.$disconnect();
  }
});
