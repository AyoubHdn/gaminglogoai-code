import assert from "node:assert/strict";
import test from "node:test";

import { createRemoteGamingDbService } from "../dbService.ts";

function createBinding(body: unknown, status = 200) {
  const requests: Request[] = [];
  return {
    requests,
    binding: {
      fetch(input: RequestInfo | URL, init?: RequestInit) {
        requests.push(new Request(input, init));
        return Promise.resolve(
          new Response(JSON.stringify(body), {
            status,
            headers: { "content-type": "application/json" },
          }),
        );
      },
    },
  };
}

void test("remote service fails closed without a service binding", () => {
  assert.throws(() => createRemoteGamingDbService(undefined), /binding is required/);
});

void test("remote service preserves operation inputs and dates at the RPC boundary", async () => {
  const { binding, requests } = createBinding({
    ok: true,
    data: [{
      id: "icon-1",
      prompt: "logo",
      userId: "user-1",
      imageKey: "icons/icon-1.webp",
      createdAt: "2026-11-12T00:00:00.000Z",
    }],
  });
  const service = createRemoteGamingDbService(binding);
  const icons = await service.getSavedIcons("user-1");

  assert.equal(icons[0]?.createdAt.toISOString(), "2026-11-12T00:00:00.000Z");
  const request = requests[0];
  assert.ok(request);
  const requestBody: unknown = await request.json();
  assert.deepEqual(requestBody, {
    operation: "icons.getSavedIcons",
    input: { userId: "user-1" },
  });
});

void test("remote service preserves missing-user and bounded public reads", async () => {
  const credits = createBinding({ ok: true, data: null });
  const service = createRemoteGamingDbService(credits.binding);
  assert.equal(await service.getCredits("missing-user"), null);

  const publicIcons = createBinding({ ok: true, data: [] });
  const publicService = createRemoteGamingDbService(publicIcons.binding);
  assert.deepEqual(await publicService.getCommunityIcons(500), []);
  const publicBody: unknown = await publicIcons.requests[0]?.json();
  assert.deepEqual(publicBody, {
    operation: "icons.getCommunityIcons",
    input: { limit: 500 },
  });
});

void test("remote service rejects malformed response envelopes", async () => {
  const { binding } = createBinding({ ok: true, data: [{ id: "missing-fields" }] });
  const service = createRemoteGamingDbService(binding);
  await assert.rejects(service.getSavedIcons("user-1"), /invalid icon/);
});
