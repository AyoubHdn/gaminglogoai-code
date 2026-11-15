/* eslint-disable @typescript-eslint/require-await -- Async test doubles implement promise-returning interfaces. */
import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { PrismaClient } from "@prisma/client";
import { createDbRpcHandler } from "./index.ts";
import {
  createPrismaGenerationDbService,
  createRemoteGenerationDbService,
} from "../../../src/server/generation/dbService.ts";
import {
  prepareLogoRequest,
  type LogoRequest,
} from "../../../src/server/generation/contract.ts";
import { runLogoGeneration } from "../../../src/server/generation/runLogo.ts";
import type {
  GenerationQuery,
  GenerationTransaction,
} from "../../../src/server/generation/sqlService.ts";

const url = process.env.GAMING_DB_SERVICE_TEST_DATABASE_URL;
if (!url) throw new Error("GAMING_DB_SERVICE_TEST_DATABASE_URL is required");
const target = new URL(url);
if (
  target.protocol !== "postgresql:" ||
  target.hostname !== "127.0.0.1" ||
  target.port !== "5432" ||
  target.pathname !== "/gaminglogoai_ci" ||
  target.search ||
  target.hash
)
  throw new Error(
    "Only disposable localhost gaminglogoai_ci PostgreSQL is allowed",
  );
const sql = postgres(url, { prepare: false });
const prisma = new PrismaClient({ datasources: { db: { url } } });
const transaction: GenerationTransaction = (action) =>
  sql
    .begin(async (tx) => ({
      result: await action((query, values) =>
        tx.unsafe(query, values as never[]),
      ),
    }))
    .then(({ result }) => result);
function remote(customTransaction = transaction, lostOperation = "") {
  const handler = createDbRpcHandler(
    (query, values) => sql.unsafe(query, values as never[]),
    customTransaction,
  );
  let lost = false;
  return createRemoteGenerationDbService({
    async fetch(input, init) {
      const request = new Request(input, init);
      const operation: unknown = (
        (await request.clone().json()) as { operation: unknown }
      ).operation;
      const response = await handler(request);
      if (!lost && operation === lostOperation && response.ok) {
        lost = true;
        throw new Error("simulated lost committed response");
      }
      return response;
    },
  });
}
const prefix = "generation-ci-" + randomUUID();
let counter = 0;
async function user(credits = 10, buyer = false) {
  const id = prefix + "-" + counter++;
  await prisma.user.create({
    data: { id, gamingCredits: credits, hasPurchasedCredits: buyer },
  });
  return id;
}
function request(
  userId: string,
  patch: Partial<LogoRequest> = {},
): LogoRequest {
  return {
    userId,
    requestId: randomUUID(),
    prompt: "staging test logo",
    numberOfImages: 1,
    model: "flux-schnell",
    aspectRatio: "1:1",
    ...patch,
  };
}
async function credits(userId: string) {
  return (await prisma.user.findUniqueOrThrow({ where: { id: userId } }))
    .gamingCredits;
}
async function saved(userId: string) {
  return prisma.icon.count({ where: { userId } });
}
async function state(input: LogoRequest) {
  const [row] =
    await sql`SELECT state FROM "GamingGenerationRequest" WHERE "userId"=${input.userId} AND "requestId"=${input.requestId}`;
  const value: unknown = row?.state;
  return value;
}

void test("generation ledger: Prisma and actual Worker RPC with disposable PostgreSQL", async (t) => {
  try {
    for (const backend of ["prisma", "worker"] as const) {
      const service =
        backend === "prisma"
          ? createPrismaGenerationDbService(prisma)
          : remote();
      await t.test(
        backend +
          ": concurrent duplicate charges once; complete and replay once; completed never refunded",
        async () => {
          const id = await user(10, true);
          const input = request(id, { model: "flux-dev", numberOfImages: 2 });
          const responses = await Promise.all(
            Array.from({ length: 4 }, () => service.reserveLogo(input)),
          );
          assert.equal(responses.filter((r) => r.acquired).length, 1);
          assert.equal(await credits(id), 6);
          assert.equal(responses[0]?.shouldWatermark, false);
          assert.equal(await saved(id), 0);
          await Promise.all([
            service.completeLogo(input),
            service.completeLogo(input),
          ]);
          assert.equal(await saved(id), 2);
          assert.equal(await service.refundLogo(input), "completed");
          assert.equal(await credits(id), 6);
          const replay = await service.reserveLogo(input);
          assert.equal(replay.acquired, false);
          assert.equal(replay.state, "completed");
          assert.deepEqual(replay.icons, responses[0]?.icons);
        },
      );
      await t.test(
        backend +
          ": competing requests cannot overspend; refunds are single-use",
        async () => {
          const id = await user(1);
          const a = request(id);
          const b = request(id);
          const results = await Promise.allSettled([
            service.reserveLogo(a),
            service.reserveLogo(b),
          ]);
          assert.equal(
            results.filter((r) => r.status === "fulfilled").length,
            1,
          );
          assert.equal(await credits(id), 0);
          const winner = results[0]?.status === "fulfilled" ? a : b;
          await Promise.all([
            service.refundLogo(winner),
            service.refundLogo(winner),
            service.refundLogo(winner),
          ]);
          assert.equal(await credits(id), 1);
          assert.equal(await saved(id), 0);
          assert.equal((await service.reserveLogo(winner)).state, "refunded");
          await assert.rejects(
            service.completeLogo(winner),
            /GENERATION_ALREADY_REFUNDED/,
          );
        },
      );
      await t.test(
        backend +
          ": ownership, fingerprint conflict, missing users and no phantom refunds",
        async () => {
          const a = await user();
          const b = await user();
          const input = request(a);
          await service.reserveLogo(input);
          await assert.rejects(
            service.reserveLogo({ ...input, prompt: "different" }),
            /GENERATION_REQUEST_CONFLICT/,
          );
          await assert.rejects(
            service.reserveLogo({ ...input, model: "flux-dev" }),
            /GENERATION_REQUEST_CONFLICT/,
          );
          await assert.rejects(
            service.refundLogo({ ...input, userId: b }),
            /GENERATION_NOT_FOUND/,
          );
          await assert.rejects(
            service.completeLogo({ ...input, userId: b }),
            /GENERATION_NOT_FOUND/,
          );
          await assert.rejects(
            service.reserveLogo(request(prefix + "-missing")),
            /GENERATION_USER_NOT_FOUND/,
          );
          assert.equal(await credits(a), 9);
          assert.equal(await credits(b), 10);
          await service.reserveLogo({ ...input, userId: b });
          assert.notEqual(
            (await prepareLogoRequest(input)).icons[0]?.id,
            (await prepareLogoRequest({ ...input, userId: b })).icons[0]?.id,
          );
        },
      );
      await t.test(
        backend + ": completion/refund race has one consistent terminal result",
        async () => {
          const id = await user();
          const input = request(id);
          await service.reserveLogo(input);
          await Promise.allSettled([
            service.completeLogo(input),
            service.refundLogo(input),
          ]);
          const final = await state(input);
          assert.ok(final === "completed" || final === "refunded");
          assert.equal(await credits(id), final === "completed" ? 9 : 10);
          assert.equal(await saved(id), final === "completed" ? 1 : 0);
        },
      );
    }
    await t.test(
      "Worker rejects generation when a real transaction boundary is unavailable",
      async () => {
        const handler = createDbRpcHandler(async () => {
          throw new Error("must not query");
        });
        const response = await handler(
          new Request("https://gaming-db.internal/rpc", {
            method: "POST",
            body: JSON.stringify({
              operation: "generation.reserveLogo",
              input: request(await user()),
            }),
          }),
        );
        assert.equal(response.status, 500);
      },
    );
    await t.test(
      "transaction rollback undoes charge when reservation insert fails",
      async () => {
        const id = await user();
        const input = request(id);
        const failing: GenerationTransaction = (action) =>
          transaction((query) =>
            action((text, values) => {
              if (text.startsWith('INSERT INTO "GamingGenerationRequest"'))
                throw new Error("injected ledger failure");
              return query(text, values);
            }),
          );
        await assert.rejects(remote(failing).reserveLogo(input));
        assert.equal(await credits(id), 10);
        assert.equal(await state(input), undefined);
      },
    );
    await t.test(
      "failed second icon insert rolls back all icons, then refund restores credits once",
      async () => {
        const id = await user();
        const input = request(id, { numberOfImages: 2 });
        await remote().reserveLogo(input);
        const failSecond: GenerationTransaction = (action) =>
          transaction((query) => {
            let inserts = 0;
            const failingQuery: GenerationQuery = (text, values) => {
              if (text.startsWith('INSERT INTO "Icon"') && ++inserts === 2)
                throw new Error("injected second icon failure");
              return query(text, values);
            };
            return action(failingQuery);
          });
        await assert.rejects(remote(failSecond).completeLogo(input));
        assert.equal(await saved(id), 0);
        assert.equal(await state(input), "reserved");
        await remote().refundLogo(input);
        assert.equal(await credits(id), 10);
      },
    );
    await t.test(
      "orchestration failure refunds the real balance without saved icons or Mautic",
      async () => {
        for (const failure of ["provider", "upload"] as const) {
          const id = await user();
          const input = request(id);
          let syncs = 0;
          await assert.rejects(
            runLogoGeneration(input, {
              service: remote(),
              generate() {
                return failure === "provider"
                  ? Promise.reject(new Error("synthetic provider failure"))
                  : Promise.resolve(["synthetic"]);
              },
              upload() {
                return Promise.reject(new Error("synthetic upload failure"));
              },
              sync() {
                syncs++;
                return Promise.resolve();
              },
            }),
          );
          assert.equal(await credits(id), 10);
          assert.equal(await saved(id), 0);
          assert.equal(await state(input), "refunded");
          assert.equal(syncs, 0);
        }
      },
    );
    await t.test(
      "successful new-path orchestration saves owned icons and preserves watermark status",
      async () => {
        const id = await user();
        const input = request(id, { numberOfImages: 2 });
        const uploaded: string[] = [];
        const completed = await runLogoGeneration(input, {
          service: remote(),
          generate() {
            return Promise.resolve(["first", "second"]);
          },
          upload(icon, image, shouldWatermark) {
            assert.equal(shouldWatermark, true);
            assert.ok(image);
            uploaded.push(icon.id);
            return Promise.resolve();
          },
        });
        assert.equal(completed.state, "completed");
        assert.equal(await credits(id), 8);
        const icons = await prisma.icon.findMany({ where: { userId: id } });
        assert.deepEqual(icons.map((icon) => icon.id).sort(), uploaded.sort());
        assert.ok(
          icons.every(
            (icon) => icon.prompt === input.prompt && icon.imageKey === null,
          ),
        );
      },
    );
    await t.test(
      "lost completion response cannot cause a refund or duplicate generation on replay",
      async () => {
        const id = await user();
        const input = request(id);
        let calls = 0;
        const service = remote(transaction, "generation.completeLogo");
        const dependencies = {
          service,
          async generate() {
            calls++;
            return ["synthetic"];
          },
          async upload() {},
        };
        await assert.rejects(
          runLogoGeneration(input, dependencies),
          /lost committed response/,
        );
        assert.equal(await credits(id), 9);
        assert.equal(await saved(id), 1);
        assert.equal(await state(input), "completed");
        assert.equal(
          (await runLogoGeneration(input, dependencies)).state,
          "completed",
        );
        assert.equal(calls, 1);
        assert.equal(await credits(id), 9);
      },
    );
    await t.test(
      "lost reservation response makes no provider call and preserves charge for reconciliation",
      async () => {
        const id = await user();
        const input = request(id);
        let calls = 0;
        await assert.rejects(
          runLogoGeneration(input, {
            service: remote(transaction, "generation.reserveLogo"),
            async generate() {
              calls++;
              return ["synthetic"];
            },
            async upload() {},
          }),
          /lost committed response/,
        );
        assert.equal(calls, 0);
        assert.equal(await state(input), "reserved");
        assert.equal(await credits(id), 9);
        await remote().refundLogo(input);
        assert.equal(await credits(id), 10);
      },
    );
    await t.test(
      "lost refund response and repeated refund never over-credit",
      async () => {
        const id = await user();
        const input = request(id);
        const service = remote(transaction, "generation.refundLogo");
        await service.reserveLogo(input);
        await assert.rejects(
          service.refundLogo(input),
          /lost committed response/,
        );
        assert.equal(await service.refundLogo(input), "refunded");
        assert.equal(await credits(id), 10);
      },
    );
    await t.test(
      "malformed RPC amounts rejected before touching any user",
      async () => {
        const id = await user();
        await assert.rejects(
          remote().reserveLogo(request(id, { numberOfImages: 0 })),
          /GENERATION_BAD_INPUT/,
        );
        assert.equal(await credits(id), 10);
      },
    );
  } finally {
    await sql`DELETE FROM "GamingGenerationRequest" WHERE "userId" LIKE ${prefix + "%"}`;
    await prisma.icon.deleteMany({ where: { userId: { startsWith: prefix } } });
    await prisma.user.deleteMany({ where: { id: { startsWith: prefix } } });
    await sql.end({ timeout: 1 });
    await prisma.$disconnect();
  }
});
