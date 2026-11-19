import {
  ConditionalCheckFailedException,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  type AttributeValue,
} from "@aws-sdk/client-dynamodb";
import { randomUUID } from "node:crypto";
import type {
  GenerationExecutionRequest,
  GenerationExecutionResult,
} from "../../../src/server/generation/contract.ts";
import type { ExecutorConfig } from "./config.ts";

export type ExecutionRecord = {
  executionKey: string;
  userId: string;
  requestId: string;
  fingerprint: string;
  model: string;
  status: "running" | "completed" | "failed" | "ambiguous";
  ownerToken?: string;
  outputIds?: string[];
  reason?: string;
  updatedAt: number;
};

export type BeginExecution =
  | { kind: "new"; ownerToken: string }
  | { kind: "completed"; outputIds: string[] }
  | { kind: "failed"; certainty: "definitive"; reason: string }
  | { kind: "ambiguous" };

export interface ExecutionStore {
  begin(input: GenerationExecutionRequest): Promise<BeginExecution>;
  complete(
    input: GenerationExecutionRequest,
    ownerToken: string,
  ): Promise<void>;
  fail(
    input: GenerationExecutionRequest,
    ownerToken: string,
    result: Extract<GenerationExecutionResult, { status: "failed" }>,
  ): Promise<void>;
}

function key(input: GenerationExecutionRequest, scope: string): string {
  return `${scope}:${input.userId}:${input.requestId}`;
}

function stringValue(value: AttributeValue | undefined): string | undefined {
  return value && "S" in value ? value.S : undefined;
}

function fromItem(item: Record<string, AttributeValue>): ExecutionRecord {
  const status = stringValue(item.status);
  if (
    !status ||
    (status !== "running" &&
      status !== "completed" &&
      status !== "failed" &&
      status !== "ambiguous")
  )
    throw new Error("EXECUTION_RECORD_INVALID");
  const outputIds = stringValue(item.outputIds);
  return {
    executionKey: stringValue(item.executionKey) ?? "",
    userId: stringValue(item.userId) ?? "",
    requestId: stringValue(item.requestId) ?? "",
    fingerprint: stringValue(item.fingerprint) ?? "",
    model: stringValue(item.model) ?? "",
    status,
    ownerToken: stringValue(item.ownerToken),
    outputIds: outputIds ? JSON.parse(outputIds) as string[] : undefined,
    reason: stringValue(item.reason),
    updatedAt: Number(stringValue(item.updatedAt) ?? 0),
  };
}

function assertIdentity(record: ExecutionRecord, input: GenerationExecutionRequest) {
  if (
    record.userId !== input.userId ||
    record.requestId !== input.requestId ||
    record.fingerprint !== input.fingerprint ||
    record.model !== input.model
  )
    throw new Error("EXECUTION_CONFLICT");
}

export class DynamoExecutionStore implements ExecutionStore {
  private readonly client: DynamoDBClient;
  private readonly config: ExecutorConfig;
  constructor(config: ExecutorConfig) {
    this.config = config;
    this.client = new DynamoDBClient({ region: config.awsRegion });
  }

  async begin(input: GenerationExecutionRequest): Promise<BeginExecution> {
    const executionKey = key(input, this.config.executionScope);
    const ownerToken = randomUUID();
    const now = Date.now();
    try {
      await this.client.send(
        new PutItemCommand({
          TableName: this.config.executionTable,
          Item: {
            executionKey: { S: executionKey },
            userId: { S: input.userId },
            requestId: { S: input.requestId },
            fingerprint: { S: input.fingerprint },
            model: { S: input.model },
            status: { S: "running" },
            ownerToken: { S: ownerToken },
            updatedAt: { N: String(now) },
            expiresAt: { N: String(Math.floor(now / 1000) + 7 * 24 * 60 * 60) },
          },
          ConditionExpression: "attribute_not_exists(executionKey)",
        }),
      );
      return { kind: "new", ownerToken };
    } catch (error) {
      if (!(error instanceof ConditionalCheckFailedException)) throw error;
      const existing = await this.client.send(
        new GetItemCommand({
          TableName: this.config.executionTable,
          Key: { executionKey: { S: executionKey } },
          ConsistentRead: true,
        }),
      );
      if (!existing.Item) return { kind: "ambiguous" };
      const record = fromItem(existing.Item);
      assertIdentity(record, input);
      if (record.status === "completed" && record.outputIds)
        return { kind: "completed", outputIds: record.outputIds };
      if (record.status === "failed")
        return {
          kind: "failed",
          certainty: "definitive",
          reason: record.reason ?? "execution-failed",
        };
      return { kind: "ambiguous" };
    }
  }

  async complete(input: GenerationExecutionRequest, ownerToken: string) {
    await this.client.send(
      new UpdateItemCommand({
        TableName: this.config.executionTable,
        Key: { executionKey: { S: key(input, this.config.executionScope) } },
        UpdateExpression:
          "SET #status=:completed, outputIds=:outputIds, updatedAt=:updatedAt REMOVE ownerToken",
        ConditionExpression: "#status=:running AND ownerToken=:ownerToken",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: {
          ":completed": { S: "completed" },
          ":running": { S: "running" },
          ":ownerToken": { S: ownerToken },
          ":outputIds": { S: JSON.stringify(input.plannedOutputIds) },
          ":updatedAt": { N: String(Date.now()) },
        },
      }),
    );
  }

  async fail(
    input: GenerationExecutionRequest,
    ownerToken: string,
    result: Extract<GenerationExecutionResult, { status: "failed" }>,
  ) {
    await this.client.send(
      new UpdateItemCommand({
        TableName: this.config.executionTable,
        Key: { executionKey: { S: key(input, this.config.executionScope) } },
        UpdateExpression:
          "SET #status=:status, reason=:reason, updatedAt=:updatedAt REMOVE ownerToken",
        ConditionExpression: "#status=:running AND ownerToken=:ownerToken",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: {
          ":status": { S: result.certainty === "definitive" ? "failed" : "ambiguous" },
          ":running": { S: "running" },
          ":ownerToken": { S: ownerToken },
          ":reason": { S: result.reason },
          ":updatedAt": { N: String(Date.now()) },
        },
      }),
    );
  }
}

export class MemoryExecutionStore implements ExecutionStore {
  readonly records = new Map<string, ExecutionRecord>();
  private readonly scope: string;
  constructor(scope: string) {
    this.scope = scope;
  }
  async begin(input: GenerationExecutionRequest): Promise<BeginExecution> {
    const executionKey = key(input, this.scope);
    const current = this.records.get(executionKey);
    if (!current) {
      const ownerToken = randomUUID();
      this.records.set(executionKey, {
        executionKey,
        userId: input.userId,
        requestId: input.requestId,
        fingerprint: input.fingerprint,
        model: input.model,
        status: "running",
        ownerToken,
        updatedAt: Date.now(),
      });
      return { kind: "new", ownerToken };
    }
    assertIdentity(current, input);
    if (current.status === "completed" && current.outputIds)
      return { kind: "completed", outputIds: current.outputIds };
    if (current.status === "failed")
      return { kind: "failed", certainty: "definitive", reason: current.reason ?? "failed" };
    return { kind: "ambiguous" };
  }
  async complete(input: GenerationExecutionRequest, ownerToken: string) {
    const record = this.records.get(key(input, this.scope));
    if (!record || record.ownerToken !== ownerToken || record.status !== "running")
      throw new Error("EXECUTION_OWNERSHIP_LOST");
    record.status = "completed";
    record.outputIds = [...input.plannedOutputIds];
    record.ownerToken = undefined;
    record.updatedAt = Date.now();
  }
  async fail(
    input: GenerationExecutionRequest,
    ownerToken: string,
    result: Extract<GenerationExecutionResult, { status: "failed" }>,
  ) {
    const record = this.records.get(key(input, this.scope));
    if (!record || record.ownerToken !== ownerToken || record.status !== "running")
      throw new Error("EXECUTION_OWNERSHIP_LOST");
    record.status = result.certainty === "definitive" ? "failed" : "ambiguous";
    record.reason = result.reason;
    record.ownerToken = undefined;
    record.updatedAt = Date.now();
  }
}
