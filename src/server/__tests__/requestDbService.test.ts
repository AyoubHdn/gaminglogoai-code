import assert from "node:assert/strict";
import test from "node:test";
import { createRequestGamingDbService } from "../requestDbService.ts";
import type { DbServiceBinding, GamingDbService } from "../dbService.ts";
import { shouldWatermarkPurchaseStatus } from "../watermarkPolicy.ts";

async function withBackend<T>(
  backend: string | undefined,
  callback: () => Promise<T>,
): Promise<T> {
  const previous = process.env.DB_READS_BACKEND;
  if (backend === undefined) delete process.env.DB_READS_BACKEND;
  else process.env.DB_READS_BACKEND = backend;
  try {
    return await callback();
  } finally {
    if (previous === undefined) delete process.env.DB_READS_BACKEND;
    else process.env.DB_READS_BACKEND = previous;
  }
}

function binding(value: unknown, status = 200) {
  const calls: unknown[] = [];
  const service: DbServiceBinding = {
    async fetch(_input, init) {
      calls.push(JSON.parse(String(init?.body)) as unknown);
      return new Response(JSON.stringify({ ok: true, data: value }), {
        status,
        headers: { "content-type": "application/json" },
      });
    },
  };
  return { service, calls };
}

void test("request reads default to the Vercel Prisma service", async () => {
  const prisma = {} as GamingDbService;
  let loads = 0;
  await withBackend(undefined, async () => {
    assert.equal(
      await createRequestGamingDbService({
        getPrismaDbService: () => {
          loads++;
          return Promise.resolve(prisma);
        },
        getCloudflareRuntime: () =>
          Promise.reject(new Error("Unexpected context access")),
      }),
      prisma,
    );
  });
  assert.equal(loads, 1);
});

void test("service reads reject unsupported selectors, missing bindings and context failures without Prisma", async () => {
  let prismaLoads = 0;
  const dependencies = {
    getPrismaDbService: () => {
      prismaLoads++;
      return Promise.reject(new Error("No Prisma fallback"));
    },
    getCloudflareRuntime: () => Promise.resolve({}),
  };
  await withBackend("unexpected", async () => {
    await assert.rejects(
      createRequestGamingDbService(dependencies),
      /Unsupported DB_READS_BACKEND/,
    );
  });
  await withBackend("service", async () => {
    await assert.rejects(
      createRequestGamingDbService(dependencies),
      /binding is required/,
    );
    await assert.rejects(
      createRequestGamingDbService({
        ...dependencies,
        getCloudflareRuntime: () =>
          Promise.reject(new Error("Context unavailable")),
      }),
      /Context unavailable/,
    );
    await assert.rejects(
      createRequestGamingDbService({
        ...dependencies,
        getCloudflareRuntime: () =>
          Promise.resolve({ DB_SERVICE: {} as DbServiceBinding }),
      }),
      /binding is required/,
    );
  });
  assert.equal(prismaLoads, 0);
});

void test("separate requests retain their own service bindings and remote failures never fall back", async () => {
  const first = binding(7),
    second = binding(29),
    failed = binding(null, 503);
  let prismaLoads = 0;
  const getPrismaDbService = () => {
    prismaLoads++;
    return Promise.reject(new Error("No Prisma fallback"));
  };
  await withBackend("service", async () => {
    const [a, b, unavailable] = await Promise.all(
      [first, second, failed].map((fixture) =>
        createRequestGamingDbService({
          getPrismaDbService,
          getCloudflareRuntime: () =>
            Promise.resolve({ DB_SERVICE: fixture.service }),
        }),
      ),
    );
    assert.ok(a && b && unavailable);
    assert.equal(await a.getCredits("first-user"), 7);
    assert.equal(await b.getCredits("second-user"), 29);
    await assert.rejects(
      unavailable.getCredits("first-user"),
      /request failed/,
    );
  });
  assert.equal(prismaLoads, 0);
  assert.deepEqual(first.calls, [
    { operation: "user.getCredits", input: { userId: "first-user" } },
  ]);
  assert.deepEqual(second.calls, [
    { operation: "user.getCredits", input: { userId: "second-user" } },
  ]);
});

void test("watermark policy preserves purchased-only exemption without native image code", () => {
  assert.equal(shouldWatermarkPurchaseStatus(true), false);
  for (const value of [false, null, undefined])
    assert.equal(shouldWatermarkPurchaseStatus(value), true);
});
