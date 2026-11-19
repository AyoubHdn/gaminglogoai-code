import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import {
  CreateTableCommand,
  DeleteTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  GetItemCommand,
  ListTablesCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";
import {
  prepareLogoRequest,
  type GenerationExecutionRequest,
} from "../../../src/server/generation/contract.ts";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { createGenerationExecutorHandler } from "../src/handler.ts";
import { signExecutorBody } from "../src/hmac.ts";
import {
  DynamoExecutionStore,
} from "../src/store.ts";
import type { ExecutorConfig } from "../src/config.ts";
import type { ExecutorPipeline } from "../src/pipeline.ts";

const endpointValue = process.env.DYNAMODB_LOCAL_ENDPOINT;
if (!endpointValue) throw new Error("DYNAMODB_LOCAL_ENDPOINT is required");
const endpoint = new URL(endpointValue);
if (
  endpoint.protocol !== "http:" ||
  endpoint.hostname !== "localhost" ||
  endpoint.port !== "8000" ||
  endpoint.pathname !== "/" ||
  endpoint.search ||
  endpoint.hash
)
  throw new Error("DYNAMODB_LOCAL_ENDPOINT must be http://127.0.0.1:8000/");

const tableName = `gaminglogoai-executor-ci-${randomUUID().replaceAll("-", "").slice(0, 16)}`;
const scope = "gaminglogoai-staging-ci";
const config: ExecutorConfig = {
  replicateApiToken: "fixture-only",
  hmacSecret: "fixture-executor-secret",
  executionScope: scope,
  executionTable: tableName,
  awsRegion: "us-east-1",
  bucketName: "fixture-only",
};

const testClients = new Set<DynamoDBClient>();

function createClient(): DynamoDBClient {
  return new DynamoDBClient({
    endpoint: endpoint.toString(),
    region: config.awsRegion,
    credentials: {
      accessKeyId: "fakeMyKeyId",
      secretAccessKey: "fakeSecretAccessKey",
    },
    maxAttempts: 1,
    requestHandler: new NodeHttpHandler({
      connectionTimeout: 1500,
      socketTimeout: 1500,
    }),
  });
}

function createStore(): DynamoExecutionStore {
  const client = createClient();
  testClients.add(client);
  return new DynamoExecutionStore(config, { client });
}

async function requestFor(
  userId: string,
  executionScope = scope,
  requestId = randomUUID(),
): Promise<GenerationExecutionRequest> {
  const raw = {
    userId,
    requestId,
    prompt: "synthetic logo",
    model: "flux-schnell" as const,
    numberOfImages: 1,
    aspectRatio: "1:1" as const,
  };
  const prepared = await prepareLogoRequest(raw);
  return {
    ...raw,
    executionScope,
    fingerprint: prepared.fingerprint,
    shouldWatermark: false,
    plannedOutputIds: prepared.icons.map((icon) => icon.id),
  };
}

function signedEvent(input: GenerationExecutionRequest) {
  const body = JSON.stringify(input);
  const timestamp = String(Date.now());
  return {
    body,
    headers: {
      "x-generation-executor-timestamp": timestamp,
      "x-generation-executor-signature": signExecutorBody(
        config.hmacSecret,
        timestamp,
        body,
      ),
    },
  };
}

async function createTable(client: DynamoDBClient): Promise<void> {
  await client.send(
    new CreateTableCommand({
      TableName: tableName,
      BillingMode: "PAY_PER_REQUEST",
      AttributeDefinitions: [{ AttributeName: "executionKey", AttributeType: "S" }],
      KeySchema: [{ AttributeName: "executionKey", KeyType: "HASH" }],
    }),
  );
  for (let attempt = 0; attempt < 20; attempt++) {
    const result = await client.send(
      new DescribeTableCommand({ TableName: tableName }),
    );
    if (result.Table?.TableStatus === "ACTIVE") return;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error("DynamoDB Local table did not become ACTIVE");
}

async function waitForSignedSdkReadiness(): Promise<void> {
  for (let attempt = 0; attempt < 30; attempt++) {
    const client = createClient();
    try {
      await client.send(new ListTablesCommand({}));
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      client.destroy();
    }
  }
  throw new Error("DynamoDB Local AWS SDK readiness timeout");
}

async function expectNew(store: DynamoExecutionStore, input: GenerationExecutionRequest) {
  const result = await store.begin(input);
  assert.equal(result.kind, "new");
  return result.ownerToken;
}

test("DynamoExecutionStore and handler use durable DynamoDB Local state", async (t) => {
  await waitForSignedSdkReadiness();
  const admin = createClient();
  await createTable(admin);
  t.after(async () => {
    try {
      await admin.send(new DeleteTableCommand({ TableName: tableName }));
    } finally {
      for (const client of testClients) client.destroy();
      testClients.clear();
      admin.destroy();
    }
  });

  await t.test("concurrent same-key claims acquire exactly once", async () => {
    const input = await requestFor("account-a");
    const results = await Promise.all(
      Array.from({ length: 8 }, () => createStore().begin(input)),
    );
    assert.equal(results.filter((result) => result.kind === "new").length, 1);
    assert.equal(results.filter((result) => result.kind === "ambiguous").length, 7);
  });

  await t.test("accounts and scopes remain isolated", async () => {
    const requestId = randomUUID();
    const accountA = await requestFor("account-a", scope, requestId);
    const accountB = await requestFor("account-b", scope, requestId);
    const otherScope = await requestFor("account-a", "other-scope", requestId);
    assert.equal((await createStore().begin(accountA)).kind, "new");
    assert.equal((await createStore().begin(accountB)).kind, "new");
    assert.equal((await createStore().begin(otherScope)).kind, "new");
  });

  await t.test("conflicting fingerprints and owner tokens are rejected", async () => {
    const input = await requestFor("conflict-account");
    const ownerToken = await expectNew(createStore(), input);
    await assert.rejects(
      createStore().begin({ ...input, fingerprint: "different-fingerprint" }),
      /EXECUTION_CONFLICT/,
    );
    await assert.rejects(createStore().complete(input, "wrong-owner"));
    await assert.rejects(
      createStore().fail(input, "wrong-owner", {
        status: "failed",
        certainty: "definitive",
        reason: "provider",
      }),
    );
    await createStore().complete(input, ownerToken);
  });

  await t.test("completed output IDs replay across new clients and handlers", async () => {
    const input = await requestFor("handler-account");
    let providerCalls = 0;
    let uploadCalls = 0;
    const pipeline: ExecutorPipeline = {
      async generate() {
        providerCalls++;
        return ["fixture-image"];
      },
      async upload() {
        uploadCalls++;
      },
    };
    const first = createGenerationExecutorHandler({
      config,
      store: createStore(),
      pipeline,
    });
    const event = signedEvent(input);
    assert.equal((await first(event)).statusCode, 200);
    const restarted = createGenerationExecutorHandler({
      config,
      store: createStore(),
      pipeline,
    });
    const replay = await restarted(event);
    assert.equal(replay.statusCode, 200);
    assert.match(replay.body, /completed/);
    assert.equal(providerCalls, 1);
    assert.equal(uploadCalls, 1);
  });

  await t.test("running, ambiguous, definitive failures and lost responses persist safely", async () => {
    const running = await requestFor("running-account");
    const runningResult = await createStore().begin(running);
    assert.equal(runningResult.kind, "new");
    assert.equal((await createStore().begin(running)).kind, "ambiguous");

    const ambiguous = await requestFor("ambiguous-account");
    const ambiguousOwner = await expectNew(createStore(), ambiguous);
    await createStore().fail(ambiguous, ambiguousOwner, {
      status: "failed",
      certainty: "ambiguous",
      reason: "storage",
    });
    assert.equal((await createStore().begin(ambiguous)).kind, "ambiguous");

    const definitive = await requestFor("definitive-account");
    const definitiveOwner = await expectNew(createStore(), definitive);
    await createStore().fail(definitive, definitiveOwner, {
      status: "failed",
      certainty: "definitive",
      reason: "provider",
    });
    assert.deepEqual(await createStore().begin(definitive), {
      kind: "failed",
      certainty: "definitive",
      reason: "provider",
    });

    const lostClaim = await requestFor("lost-claim-account");
    await createStore().begin(lostClaim);
    assert.equal((await createStore().begin(lostClaim)).kind, "ambiguous");

    const lostCompletion = await requestFor("lost-completion-account");
    const owner = await expectNew(createStore(), lostCompletion);
    await createStore().complete(lostCompletion, owner);
    assert.equal((await createStore().begin(lostCompletion)).kind, "completed");
  });

  await t.test("numeric timestamps and output IDs round-trip", async () => {
    const input = await requestFor("round-trip-account");
    const owner = await expectNew(createStore(), input);
    const item = await admin.send(
      new GetItemCommand({
        TableName: tableName,
        Key: {
          executionKey: { S: `${scope}:${input.userId}:${input.requestId}` },
        },
        ConsistentRead: true,
      }),
    );
    assert.match(item.Item?.updatedAt?.N ?? "", /^\d+$/);
    assert.match(item.Item?.expiresAt?.N ?? "", /^\d+$/);
    await createStore().complete(input, owner);
    const replay = await createStore().begin(input);
    assert.deepEqual(replay, {
      kind: "completed",
      outputIds: input.plannedOutputIds,
    });
  });

  await t.test("corrupt numeric data fails closed before provider execution", async () => {
    const input = await requestFor("corrupt-account");
    const executionKey = `${scope}:${input.userId}:${input.requestId}`;
    await admin.send(
      new PutItemCommand({
        TableName: tableName,
        Item: {
          executionKey: { S: executionKey },
          userId: { S: input.userId },
          requestId: { S: input.requestId },
          fingerprint: { S: input.fingerprint },
          model: { S: input.model },
          status: { S: "running" },
          ownerToken: { S: "corrupt-owner" },
          updatedAt: { S: "not-a-number" },
          expiresAt: { N: "9999999999" },
        },
      }),
    );
    let calls = 0;
    const handler = createGenerationExecutorHandler({
      config,
      store: createStore(),
      pipeline: {
        async generate() {
          calls++;
          return ["unexpected"];
        },
        async upload() {
          calls++;
        },
      },
    });
    const response = await handler(signedEvent(input));
    assert.equal(response.statusCode, 503);
    assert.equal(calls, 0);
  });
});
