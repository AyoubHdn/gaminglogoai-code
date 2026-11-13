import { dispatchAuth, isAuthOperation, type AuthOperation } from "./auth.ts";

type DbRow = Record<string, unknown>;
export type DbQuery = (
  query: string,
  values: unknown[],
) => Promise<ReadonlyArray<DbRow>>;

type WorkerEnv = {
  HYPERDRIVE?: {
    connectionString?: string;
  };
};

type ReadOperation =
  | "user.getCredits"
  | "user.getHasPurchasedCredits"
  | "icons.getSavedIcons"
  | "icons.getEmoteBases"
  | "icons.getCommunityIcons";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function stringInput(input: unknown, name: string): string {
  const field = isRecord(input) ? input[name] : undefined;
  if (typeof field !== "string" || field.length === 0) {
    throw new Error("Invalid " + name);
  }
  return field;
}

function limitInput(input: unknown): number {
  if (!isRecord(input) || input.limit === undefined) return 50;
  if (typeof input.limit !== "number" || !Number.isInteger(input.limit)) {
    throw new Error("Invalid limit");
  }
  return Math.min(Math.max(input.limit, 1), 100);
}

function serializeIcons(
  rows: ReadonlyArray<DbRow>,
): Array<Record<string, unknown>> {
  return rows.map((row) => {
    if (
      typeof row.id !== "string" ||
      (row.prompt !== null && typeof row.prompt !== "string") ||
      (row.userId !== null && typeof row.userId !== "string") ||
      (row.imageKey !== null && typeof row.imageKey !== "string")
    ) {
      throw new Error("Invalid icon row");
    }
    const date =
      row.createdAt instanceof Date
        ? row.createdAt
        : new Date(String(row.createdAt));
    if (Number.isNaN(date.getTime())) throw new Error("Invalid icon date");
    return {
      id: row.id,
      prompt: row.prompt,
      userId: row.userId,
      imageKey: row.imageKey,
      createdAt: date.toISOString(),
    };
  });
}

async function dispatch(
  operation: ReadOperation | AuthOperation,
  input: unknown,
  query: DbQuery,
): Promise<unknown> {
  if (isAuthOperation(operation)) return dispatchAuth(operation, input, query);
  switch (operation) {
    case "user.getCredits": {
      const userId = stringInput(input, "userId");
      const rows = await query(
        'SELECT "gamingCredits" FROM "User" WHERE "id" = $1 LIMIT 1',
        [userId],
      );
      return rows[0]?.gamingCredits ?? null;
    }
    case "user.getHasPurchasedCredits": {
      const userId = stringInput(input, "userId");
      const rows = await query(
        'SELECT "hasPurchasedCredits" FROM "User" WHERE "id" = $1 LIMIT 1',
        [userId],
      );
      return rows[0]?.hasPurchasedCredits ?? null;
    }
    case "icons.getSavedIcons": {
      const userId = stringInput(input, "userId");
      const rows = await query(
        'SELECT "id", "prompt", "userId", "imageKey", "createdAt" FROM "Icon" WHERE "userId" = $1 ORDER BY "createdAt" DESC',
        [userId],
      );
      return serializeIcons(rows);
    }
    case "icons.getEmoteBases": {
      const userId = stringInput(input, "userId");
      const rows = await query(
        'SELECT "id", "prompt", "userId", "imageKey", "createdAt" FROM "Icon" WHERE "userId" = $1 AND "prompt" LIKE $2 AND "imageKey" LIKE $3 ORDER BY "createdAt" DESC',
        [userId, "EmoteBase:%", "emotes/base/" + userId + "/%"],
      );
      return serializeIcons(rows);
    }
    case "icons.getCommunityIcons": {
      const limit = limitInput(input);
      const rows = await query(
        'SELECT "id", "prompt", "userId", "imageKey", "createdAt" FROM "Icon" ORDER BY "createdAt" DESC LIMIT $1',
        [limit],
      );
      return serializeIcons(rows);
    }
    default:
      throw new Error("Unsupported DB operation");
  }
}

export function createDbRpcHandler(query: DbQuery) {
  return async (request: Request): Promise<Response> => {
    if (request.method !== "POST" || new URL(request.url).pathname !== "/rpc") {
      return json({ ok: false, error: { code: "NOT_FOUND" } }, 404);
    }

    try {
      const body: unknown = await request.json();
      if (!isRecord(body) || typeof body.operation !== "string") {
        return json({ ok: false, error: { code: "BAD_REQUEST" } }, 400);
      }
      const data = await dispatch(
        body.operation as ReadOperation | AuthOperation,
        body.input,
        query,
      );
      return json({ ok: true, data });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "AUTH_ACCOUNT_OWNERSHIP_CONFLICT"
      ) {
        return json(
          { ok: false, error: { code: "AUTH_ACCOUNT_OWNERSHIP_CONFLICT" } },
          409,
        );
      }
      return json({ ok: false, error: { code: "DB_READ_FAILED" } }, 500);
    }
  };
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    if (!env.HYPERDRIVE?.connectionString) {
      return json({ ok: false, error: { code: "DB_BINDING_MISSING" } }, 503);
    }

    const { default: postgres } = await import("postgres");
    const sql = postgres(env.HYPERDRIVE.connectionString, { prepare: false });
    const handler = createDbRpcHandler((query, values) =>
      sql.unsafe(query, values as never[]),
    );
    try {
      return await handler(request);
    } finally {
      await sql.end({ timeout: 1 }).catch(() => undefined);
    }
  },
};
