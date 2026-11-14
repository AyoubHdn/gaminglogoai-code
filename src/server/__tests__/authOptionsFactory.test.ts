import assert from "node:assert/strict";
import test from "node:test";
import type { Adapter } from "next-auth/adapters";

import { createGamingAuthOptions } from "../authOptionsFactory.ts";

void test("auth options keep Mautic synchronization outside the adapter boundary", async () => {
  const syncCalls: Array<Record<string, unknown>> = [];
  const adapter: Adapter = {
    getUser: () =>
      Promise.resolve({
        id: "user-1",
        email: "user@example.test",
        name: "Test User",
        image: null,
        emailVerified: null,
      }),
  };
  const options = createGamingAuthOptions({
    adapter,
    clientId: "ci-google-client",
    clientSecret: "ci-google-secret",
    secret: "ci-nextauth-secret",
    getUserForMautic: () =>
      Promise.resolve({
        id: "user-1",
        email: "user@example.test",
        name: "Test User",
        gamingCredits: 7,
        gamingPlan: "Starter",
      }),
    syncUserToMautic: (input) => {
      syncCalls.push(input);
      return Promise.resolve();
    },
  });

  assert.equal(options.session?.strategy, "database");
  assert.equal(
    options.cookies?.sessionToken?.name,
    "__Secure-next-auth.session-token",
  );
  assert.ok(options.events?.signIn);
  assert.ok(options.events?.createUser);

  await options.events.signIn({
    user: { id: "user-1", email: "user@example.test" },
    account: null,
  });
  await options.events.createUser({
    user: { id: "new-user", email: "new@example.test", name: null },
  });

  assert.deepEqual(syncCalls, [
    {
      email: "user@example.test",
      name: "Test User",
      brand_specific_credits: 7,
      brand_specific_plan: "Starter",
    },
    {
      email: "new@example.test",
      name: null,
      brand_specific_credits: 1,
      brand_specific_plan: "None",
    },
  ]);
});

void test("auth redirects reject lookalike domains and preserve same-origin destinations", async () => {
  const options = createGamingAuthOptions({
    adapter: {},
    clientId: "ci-google-client",
    clientSecret: "ci-google-secret",
    secret: "ci-nextauth-secret",
    getUserForMautic: () => Promise.resolve(null),
    syncUserToMautic: () => Promise.resolve(),
  });
  const redirect = options.callbacks?.redirect;
  assert.ok(redirect);
  const baseUrl = "https://gaminglogoai.com";
  const sameOrigin = baseUrl + "/name-logo-generator?from=login";
  assert.equal(await redirect({ url: sameOrigin, baseUrl }), sameOrigin);
  for (const url of [
    "https://gaminglogoai.com.attacker.invalid/path",
    "https://gaminglogoai.com@attacker.invalid/path",
    "http://gaminglogoai.com/path",
    "https://attacker.invalid",
    "not a URL",
    "/relative-path",
  ]) {
    assert.equal(await redirect({ url, baseUrl }), baseUrl);
  }
});

void test("session handling preserves the database user id and secure cookie", async () => {
  const options = createGamingAuthOptions({
    adapter: {},
    clientId: "ci-google-client",
    clientSecret: "ci-google-secret",
    secret: "ci-nextauth-secret",
    getUserForMautic: () => Promise.resolve(null),
    syncUserToMautic: () => Promise.resolve(),
  });
  const sessionCallback = options.callbacks?.session;
  assert.ok(sessionCallback);
  const session = await sessionCallback({
    session: {
      user: {
        id: "stale-session-user",
        name: "Test User",
        email: "user@example.test",
        image: null,
      },
      expires: new Date(0).toISOString(),
    },
    user: {
      id: "database-user-1",
      email: "user@example.test",
      name: "Test User",
      image: null,
      emailVerified: null,
    },
    token: {},
    newSession: false,
    trigger: "update",
  } as Parameters<typeof sessionCallback>[0]);
  const sessionUser = session.user as { id?: string } | undefined;
  assert.equal(sessionUser?.id, "database-user-1");
  assert.equal(options.session?.strategy, "database");
  const sessionCookie = options.cookies?.sessionToken as unknown as {
    options?: { httpOnly?: boolean; secure?: boolean };
  };
  assert.equal(sessionCookie.options?.httpOnly, true);
  assert.equal(sessionCookie.options?.secure, true);
});
