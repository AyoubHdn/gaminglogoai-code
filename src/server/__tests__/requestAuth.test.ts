import assert from "node:assert/strict";
import test from "node:test";

import {
  requireAuthDbBinding,
  selectAuthBackend,
  type AuthRuntime,
} from "../authRuntime.ts";

void test("trusted backend defaults to Prisma and ignores client-shaped input", () => {
  const runtime: AuthRuntime = { DB_AUTH_BACKEND: undefined };
  assert.equal(selectAuthBackend(runtime), "prisma");
  assert.equal(selectAuthBackend({ DB_AUTH_BACKEND: "service" }), "service");
});

void test("unsupported backend is rejected before a database is selected", () => {
  assert.throws(
    () => selectAuthBackend({ DB_AUTH_BACKEND: "remote-from-header" }),
    /Unsupported DB_AUTH_BACKEND/,
  );
});

void test("service mode fails closed without its request-scoped binding", () => {
  assert.throws(
    () => requireAuthDbBinding({ DB_AUTH_BACKEND: "service" }),
    /DB_SERVICE binding is required/,
  );
});

void test("service mode returns the exact request-scoped binding", () => {
  const binding = {
    fetch: () => Promise.resolve(new Response(JSON.stringify({ ok: true, data: null }))),
  };
  assert.equal(
    requireAuthDbBinding({ DB_AUTH_BACKEND: "service", DB_SERVICE: binding }),
    binding,
  );
});
