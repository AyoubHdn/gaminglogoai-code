/* eslint-disable @typescript-eslint/require-await -- Async test doubles implement promise-returning interfaces. */
import assert from "node:assert/strict";
import test from "node:test";
import { createRemoteGenerationDbService } from "../generation/dbService.ts";
import { createRequestGenerationDbService } from "../generation/requestService.ts";
import {
  GenerationError,
  prepareLogoRequest,
  type GenerationDbService,
  type GenerationReservation,
} from "../generation/contract.ts";
import { runLogoGeneration } from "../generation/runLogo.ts";

const input = {
  userId: "account-a",
  requestId: "0d3291ec-71f2-47db-9170-7a087b573bd5",
  prompt: "logo",
  model: "flux-schnell" as const,
  numberOfImages: 1,
  aspectRatio: "1:1",
};
async function fixture() {
  const { icons } = await prepareLogoRequest(input);
  const reservation: GenerationReservation = {
    acquired: true,
    state: "reserved",
    icons,
    shouldWatermark: true,
    credits: 9,
    email: null,
    name: null,
  };
  const events: string[] = [];
  const service: GenerationDbService = {
    async reserveLogo() {
      events.push("reserve");
      return reservation;
    },
    async completeLogo() {
      events.push("complete");
      return "completed";
    },
    async refundLogo() {
      events.push("refund");
      return "refunded";
    },
  };
  const dependencies = {
    service,
    async generate() {
      events.push("generate");
      return ["base64"];
    },
    async upload() {
      events.push("upload");
    },
    async sync() {
      events.push("sync");
    },
  };
  return { reservation, events, service, dependencies };
}
void test("generation validates integer counts, price, normalized keys and deterministic ownership", async () => {
  const a = await prepareLogoRequest(input);
  assert.equal(a.cost, 1);
  assert.equal(
    (
      await prepareLogoRequest({
        ...input,
        model: "flux-dev",
        numberOfImages: 10,
      })
    ).cost,
    20,
  );
  assert.deepEqual(a.icons, (await prepareLogoRequest(input)).icons);
  assert.notEqual(
    a.icons[0]?.id,
    (await prepareLogoRequest({ ...input, userId: "account-b" })).icons[0]?.id,
  );
  for (const patch of [
    { numberOfImages: 1.5 },
    { numberOfImages: 0 },
    { numberOfImages: 11 },
    { prompt: "" },
    { model: "unknown" },
    { requestId: "bad" },
    { aspectRatio: "bad" },
  ]) {
    await assert.rejects(
      prepareLogoRequest({ ...input, ...patch }),
      /GENERATION_BAD_INPUT/,
    );
  }
});
void test("provider, uploads, atomic completion, then best-effort Mautic", async () => {
  const f = await fixture();
  f.dependencies.sync = async () => {
    f.events.push("sync");
    throw new Error("mautic offline");
  };
  assert.equal(
    (await runLogoGeneration(input, f.dependencies)).state,
    "completed",
  );
  assert.deepEqual(f.events, [
    "reserve",
    "generate",
    "upload",
    "complete",
    "sync",
  ]);
});
void test("duplicate completed request returns saved result without provider/upload/sync", async () => {
  const f = await fixture();
  Object.assign(f.reservation, { acquired: false, state: "completed" });
  assert.equal(
    (await runLogoGeneration(input, f.dependencies)).state,
    "completed",
  );
  assert.deepEqual(f.events, ["reserve"]);
});
void test("pending and refunded duplicates never run provider or refund", async () => {
  for (const state of ["reserved", "refunded"] as const) {
    const f = await fixture();
    Object.assign(f.reservation, { acquired: false, state });
    await assert.rejects(
      runLogoGeneration(input, f.dependencies),
      GenerationError,
    );
    assert.deepEqual(f.events, ["reserve"]);
  }
});
void test("ambiguous reservation stops with no provider/refund or fallback", async () => {
  const f = await fixture();
  f.service.reserveLogo = async () => {
    throw new Error("lost response");
  };
  await assert.rejects(
    runLogoGeneration(input, f.dependencies),
    /lost response/,
  );
  assert.deepEqual(f.events, []);
});
void test("provider error and output count mismatch refund once without creating icons", async () => {
  for (const reason of ["provider", "count"] as const) {
    const f = await fixture();
    f.dependencies.generate = async () => {
      f.events.push("generate");
      if (reason === "provider") throw new Error("provider failed");
      return [];
    };
    await assert.rejects(runLogoGeneration(input, f.dependencies));
    assert.deepEqual(f.events, ["reserve", "generate", "refund"]);
  }
});
void test("all uploads settle before refund, no completion on partial upload", async () => {
  const f = await fixture();
  const two = { ...input, numberOfImages: 2 };
  f.reservation.icons = (await prepareLogoRequest(two)).icons;
  f.dependencies.generate = async () => ["a", "b"];
  let count = 0;
  f.dependencies.upload = async () => {
    if (++count === 1) throw new Error("S3 failed");
    await new Promise((resolve) => setTimeout(resolve, 10));
    f.events.push("last-upload-settled");
  };
  await assert.rejects(runLogoGeneration(two, f.dependencies), /upload failed/);
  assert.deepEqual(f.events, ["reserve", "last-upload-settled", "refund"]);
});
void test("missing remote binding and malformed response fail closed", async () => {
  assert.throws(
    () => createRemoteGenerationDbService(undefined),
    /binding is required/,
  );
  for (const body of [
    { ok: true, data: {} },
    { ok: false, error: { code: "DB_READ_FAILED" } },
  ]) {
    const service = createRemoteGenerationDbService({
      async fetch() {
        return new Response(JSON.stringify(body));
      },
    });
    await assert.rejects(service.reserveLogo(input));
  }
});
void test("backend selection is server-only, defaults to unchanged legacy and isolates request bindings", async () => {
  const previous = process.env.DB_GENERATION_BACKEND;
  try {
    delete process.env.DB_GENERATION_BACKEND;
    assert.equal(await createRequestGenerationDbService(), null);
    process.env.DB_GENERATION_BACKEND = "prisma";
    const f = await fixture();
    assert.equal(
      await createRequestGenerationDbService({
        async getPrismaService() {
          return f.service;
        },
      }),
      f.service,
    );
    process.env.DB_GENERATION_BACKEND = "unsupported";
    await assert.rejects(createRequestGenerationDbService(), /Unsupported/);
    process.env.DB_GENERATION_BACKEND = "service";
    await assert.rejects(
      createRequestGenerationDbService({
        async getCloudflareRuntime() {
          return {};
        },
      }),
      /binding is required/,
    );
    await assert.rejects(
      createRequestGenerationDbService({
        async getCloudflareRuntime() {
          throw new Error("no runtime");
        },
      }),
      /no runtime/,
    );
    const calls: string[] = [];
    for (const account of ["first", "second"]) {
      const service = await createRequestGenerationDbService({
        async getCloudflareRuntime() {
          return {
            DB_SERVICE: {
              async fetch() {
                calls.push(account);
                return new Response(
                  JSON.stringify({ ok: true, data: f.reservation }),
                );
              },
            },
          };
        },
      });
      assert.ok(service);
      await service.reserveLogo(input);
    }
    assert.deepEqual(calls, ["first", "second"]);
  } finally {
    if (previous === undefined) delete process.env.DB_GENERATION_BACKEND;
    else process.env.DB_GENERATION_BACKEND = previous;
  }
});
