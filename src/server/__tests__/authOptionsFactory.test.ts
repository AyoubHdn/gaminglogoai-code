import assert from "node:assert/strict";
import test from "node:test";
import type { Adapter } from "next-auth/adapters";

import { createGamingAuthOptions } from "../authOptionsFactory.ts";

void test("auth options keep Mautic synchronization outside the adapter boundary", async () => {
  const syncCalls: Array<Record<string, unknown>> = [];
  const adapter: Adapter = {
    getUser: async () => ({
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
    getUserForMautic: async () => ({
      id: "user-1",
      email: "user@example.test",
      name: "Test User",
      gamingCredits: 7,
      gamingPlan: "Starter",
    }),
    syncUserToMautic: async (input) => {
      syncCalls.push(input);
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
