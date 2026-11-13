import assert from "node:assert/strict";
import test from "node:test";
import postgres from "postgres";
import { PrismaClient } from "@prisma/client";
import type { AdapterAccount } from "next-auth/adapters";

import { createRemoteGamingAuthDbService } from "../../../src/server/authDbService.ts";
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

void test("a real database failure crosses the auth Worker boundary without fallback", async () => {
  const closed = postgres(testUrl, { prepare: false });
  await closed.end({ timeout: 1 });
  const handler = createDbRpcHandler((query, values) =>
    closed.unsafe(query, values as never[]),
  );
  const adapter = createRemoteNextAuthAdapter({
    fetch(input: RequestInfo | URL, init?: RequestInit) {
      return handler(new Request(input, init));
    },
  });
  await assert.rejects(
    adapter.getUser("closed-connection-user"),
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

void test("remote NextAuth adapter crosses the Worker RPC and PostgreSQL boundary", async (t) => {
  const prefix =
    "auth-rpc-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  const binding = createWorkerBinding();
  const adapter = createRemoteNextAuthAdapter(binding);
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

    await t.test(
      "existing CUID users remain accessible through the remote adapter",
      async () => {
        const legacyUser = await prisma.user.create({
          data: { email: `${prefix}-legacy@example.test` },
        });
        assert.match(legacyUser.id, /^c[a-z0-9]+$/);
        assert.equal((await adapter.getUser(legacyUser.id))?.id, legacyUser.id);
        const legacySession = await adapter.createSession({
          sessionToken: `${prefix}-legacy-session`,
          userId: legacyUser.id,
          expires,
        });
        assert.equal(
          (await adapter.getSessionAndUser(legacySession.sessionToken))?.user
            .id,
          legacyUser.id,
        );
      },
    );

    await t.test(
      "profile writes cannot overwrite paid credit state",
      async () => {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            gamingCredits: 37,
            gamingPlan: "Pro",
            hasPurchasedCredits: true,
          },
        });
        const forgedUpdate = {
          id: user.id,
          name: "Protected buyer",
          gamingCredits: 999999,
          gamingPlan: "Elite",
          hasPurchasedCredits: false,
        };
        await adapter.updateUser(forgedUpdate);
        const response = await binding.fetch("https://gaming-db.test/rpc", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            operation: "auth.updateUser",
            input: { ...forgedUpdate, gamingCredits: -100, gamingPlan: "None" },
          }),
        });
        assert.equal(response.status, 200);
        const paid = await prisma.user.findUniqueOrThrow({
          where: { id: user.id },
        });
        assert.equal(paid.gamingCredits, 37);
        assert.equal(paid.gamingPlan, "Pro");
        assert.equal(paid.hasPurchasedCredits, true);

        const rawId = `${prefix}-raw-created`;
        const created = await binding.fetch("https://gaming-db.test/rpc", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            operation: "auth.createUser",
            input: {
              id: rawId,
              email: `${prefix}-raw@example.test`,
              gamingCredits: 999999,
              gamingPlan: "Elite",
              hasPurchasedCredits: true,
            },
          }),
        });
        assert.equal(created.status, 200);
        const defaults = await prisma.user.findUniqueOrThrow({
          where: { id: rawId },
        });
        assert.equal(defaults.gamingCredits, 1);
        assert.equal(defaults.gamingPlan, "None");
        assert.equal(defaults.hasPurchasedCredits, false);

        const profile = await createRemoteGamingAuthDbService(
          binding,
        ).getUserForMautic(user.id);
        assert.equal(profile?.gamingCredits, 37);
        assert.equal(profile?.gamingPlan, "Pro");
        assert.equal(
          await createRemoteGamingAuthDbService(binding).getUserForMautic(
            `${prefix}-missing`,
          ),
          null,
        );
      },
    );

    await t.test(
      "nullable profiles and missing records retain their contracts",
      async () => {
        const verifiedAt = new Date("2026-11-01T12:34:56.000Z");
        const verified = await adapter.updateUser({
          id: user.id,
          name: null,
          image: null,
          emailVerified: verifiedAt,
        });
        assert.equal(verified.name, null);
        assert.equal(verified.image, null);
        assert.ok(verified.emailVerified instanceof Date);
        assert.deepEqual(verified.emailVerified, verifiedAt);
        const unverified = await adapter.updateUser({
          id: user.id,
          emailVerified: null,
        });
        assert.equal(unverified.emailVerified, null);
        assert.equal(await adapter.getUser(`${prefix}-missing`), null);
        assert.equal(
          await adapter.getUserByEmail(`${prefix}-missing@example.test`),
          null,
        );
        assert.equal(
          await adapter.updateSession({
            sessionToken: `${prefix}-missing-session`,
            expires,
          }),
          null,
        );
        await assert.rejects(
          adapter.updateUser({ id: `${prefix}-missing`, name: "Missing" }),
        );
      },
    );

    await t.test(
      "concurrent Google account linking preserves the actual winner",
      async () => {
        const raceAccount = {
          type: "oauth" as const,
          provider: "google",
          providerAccountId: `${prefix}-race-account`,
        };
        const outcomes = await Promise.allSettled([
          adapter.linkAccount({ ...raceAccount, userId: user.id }),
          adapter.linkAccount({ ...raceAccount, userId: secondUser.id }),
        ]);
        const winners = outcomes.filter(
          (outcome) => outcome.status === "fulfilled",
        );
        const losers = outcomes.filter(
          (outcome) => outcome.status === "rejected",
        );
        assert.equal(winners.length, 1);
        assert.equal(losers.length, 1);
        const winner = winners[0];
        assert.ok(winner && winner.status === "fulfilled");
        const loser = losers[0];
        assert.ok(loser && loser.status === "rejected");
        assert.match(String(loser.reason), /AUTH_ACCOUNT_OWNERSHIP_CONFLICT/);
        const storedAccount = await prisma.account.findUniqueOrThrow({
          where: {
            provider_providerAccountId: {
              provider: raceAccount.provider,
              providerAccountId: raceAccount.providerAccountId,
            },
          },
        });
        assert.equal(storedAccount.userId, winner.value.userId);
        const retry = await adapter.linkAccount({
          ...raceAccount,
          userId: winner.value.userId,
        });
        assert.equal(retry.userId, winner.value.userId);
        assert.equal(await prisma.account.count({ where: raceAccount }), 1);
        await adapter.unlinkAccount(raceAccount);
        assert.equal(await adapter.getUserByAccount(raceAccount), null);
      },
    );

    await t.test(
      "session update preserves ownership and deletion revokes lookup",
      async () => {
        const attemptedTransfer = {
          sessionToken: session.sessionToken,
          userId: secondUser.id,
          expires: newExpiry,
        };
        const retained = await adapter.updateSession(attemptedTransfer);
        assert.equal(retained?.userId, user.id);
        await adapter.deleteSession(session.sessionToken);
        assert.equal(
          await adapter.getSessionAndUser(session.sessionToken),
          null,
        );
        await adapter.deleteSession(session.sessionToken);
        assert.equal(
          await prisma.session.count({
            where: { sessionToken: session.sessionToken },
          }),
          0,
        );
      },
    );

    await t.test(
      "unlink and delete remove only the intended account and user",
      async () => {
        await adapter.unlinkAccount(account);
        assert.equal(await adapter.getUserByAccount(account), null);
        await adapter.unlinkAccount(account);
        const secondAccount = {
          userId: secondUser.id,
          type: "oauth" as const,
          provider: "google",
          providerAccountId: `${prefix}-second-account`,
        };
        await adapter.linkAccount(secondAccount);
        const secondSession = await adapter.createSession({
          sessionToken: `${prefix}-second-session`,
          userId: secondUser.id,
          expires,
        });
        await adapter.deleteUser(secondUser.id);
        assert.equal(await adapter.getUser(secondUser.id), null);
        assert.equal(await adapter.getUserByEmail(secondUser.email), null);
        assert.equal(await adapter.getUserByAccount(secondAccount), null);
        assert.equal(
          await adapter.getSessionAndUser(secondSession.sessionToken),
          null,
        );
        assert.equal(
          await prisma.account.count({ where: { userId: secondUser.id } }),
          0,
        );
        assert.equal(
          await prisma.session.count({ where: { userId: secondUser.id } }),
          0,
        );
        assert.equal((await adapter.getUser(user.id))?.id, user.id);
        await adapter.deleteUser(user.id);
        assert.equal(await adapter.getUser(user.id), null);
      },
    );
  } finally {
    try {
      // Auth creates UUID IDs; use the unique synthetic email namespace for cleanup.
      // This also covers an insert whose response was lost before the ID was observed.
      await prisma.verificationToken.deleteMany({
        where: { identifier: { startsWith: prefix } },
      });
      await prisma.user.deleteMany({
        where: { email: { startsWith: prefix } },
      });
      assert.equal(
        await prisma.user.count({ where: { email: { startsWith: prefix } } }),
        0,
      );
      assert.equal(
        await prisma.account.count({
          where: { providerAccountId: { startsWith: prefix } },
        }),
        0,
      );
      assert.equal(
        await prisma.session.count({
          where: { sessionToken: { startsWith: prefix } },
        }),
        0,
      );
      assert.equal(
        await prisma.verificationToken.count({
          where: { identifier: { startsWith: prefix } },
        }),
        0,
      );
    } finally {
      await sql.end({ timeout: 1 });
      await prisma.$disconnect();
    }
  }
});
