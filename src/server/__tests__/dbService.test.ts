import assert from "node:assert/strict";
import test from "node:test";

import type { Icon, PrismaClient } from "@prisma/client";

import { createPrismaDbService } from "../dbService.ts";

function createFakePrisma() {
  const calls: Array<{ model: string; args: unknown }> = [];
  const icon = {
    async findMany(args: unknown) {
      calls.push({ model: "icon", args });
      return [] as Icon[];
    },
  };
  const user = {
    async findUnique(args: unknown) {
      calls.push({ model: "user", args });
      const select = (args as { select?: Record<string, boolean> }).select;
      if (select?.gamingCredits) return { gamingCredits: 7 };
      if (select?.hasPurchasedCredits) return { hasPurchasedCredits: true };
      return null;
    },
  };

  return {
    client: { user, icon } as unknown as PrismaClient,
    calls,
  };
}

test("typed DB boundary preserves protected credit and purchase reads", async () => {
  const fake = createFakePrisma();
  const service = createPrismaDbService(fake.client);

  assert.equal(await service.getCredits("user-1"), 7);
  assert.equal(await service.getHasPurchasedCredits("user-1"), true);

  assert.deepEqual(fake.calls.map((call) => call.model), ["user", "user"]);
});

test("typed DB boundary preserves saved, emote-base, and community read scopes", async () => {
  const fake = createFakePrisma();
  const service = createPrismaDbService(fake.client);

  await service.getSavedIcons("user-1");
  await service.getEmoteBases("user-1");
  await service.getCommunityIcons(50);

  const iconCalls = fake.calls.filter((call) => call.model === "icon");
  assert.equal(iconCalls.length, 3);
  assert.deepEqual(
    iconCalls.map((call) => (call.args as { where?: unknown }).where),
    [
      { userId: "user-1" },
      {
        userId: "user-1",
        prompt: { startsWith: "EmoteBase:" },
        imageKey: { startsWith: "emotes/base/user-1/" },
      },
      undefined,
    ],
  );
  assert.equal(
    (iconCalls[2]?.args as { take?: number }).take,
    50,
  );
});
