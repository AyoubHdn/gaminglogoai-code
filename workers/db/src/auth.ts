import type { DbQuery } from "./index.ts";

export type AuthOperation =
  | "auth.getUserForMautic"
  | "auth.createUser"
  | "auth.getUser"
  | "auth.getUserByEmail"
  | "auth.getUserByAccount"
  | "auth.updateUser"
  | "auth.deleteUser"
  | "auth.linkAccount"
  | "auth.unlinkAccount"
  | "auth.createSession"
  | "auth.getSessionAndUser"
  | "auth.updateSession"
  | "auth.deleteSession"
  | "auth.createVerificationToken"
  | "auth.useVerificationToken";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isAuthOperation(value: string): value is AuthOperation {
  return (
    value === "auth.getUserForMautic" ||
    value === "auth.createUser" ||
    value === "auth.getUser" ||
    value === "auth.getUserByEmail" ||
    value === "auth.getUserByAccount" ||
    value === "auth.updateUser" ||
    value === "auth.deleteUser" ||
    value === "auth.linkAccount" ||
    value === "auth.unlinkAccount" ||
    value === "auth.createSession" ||
    value === "auth.getSessionAndUser" ||
    value === "auth.updateSession" ||
    value === "auth.deleteSession" ||
    value === "auth.createVerificationToken" ||
    value === "auth.useVerificationToken"
  );
}

function inputRecord(input: unknown): Record<string, unknown> {
  if (!isRecord(input)) throw new Error("Invalid auth input");
  return input;
}

function stringInput(input: Record<string, unknown>, name: string): string {
  const value = input[name];
  if (typeof value !== "string" || value.length === 0)
    throw new Error(`Invalid ${name}`);
  return value;
}

function nullableStringInput(
  input: Record<string, unknown>,
  name: string,
): string | null {
  const value = input[name];
  if (value === undefined || value === null) return null;
  if (typeof value !== "string") throw new Error(`Invalid ${name}`);
  return value;
}

function dateInput(input: Record<string, unknown>, name: string): string {
  const value = input[name];
  if (typeof value !== "string" || Number.isNaN(new Date(value).getTime())) {
    throw new Error(`Invalid ${name}`);
  }
  return value;
}

function nullableDateInput(
  input: Record<string, unknown>,
  name: string,
): string | null {
  const value = input[name];
  if (value === undefined || value === null) return null;
  if (typeof value !== "string" || Number.isNaN(new Date(value).getTime())) {
    throw new Error(`Invalid ${name}`);
  }
  return value;
}

function userColumns(): string {
  return '"id", "name", "email", "emailVerified", "image"';
}

function accountColumns(): string {
  return '"id", "userId", "type", "provider", "providerAccountId", "refresh_token", "access_token", "expires_at", "token_type", "scope", "id_token", "session_state"';
}

function sessionColumns(): string {
  return '"sessionToken", "userId", "expires"';
}

function verificationColumns(): string {
  return '"identifier", "token", "expires"';
}

function sessionUserColumns(): string {
  return [
    's."sessionToken" AS "sessionToken"',
    's."userId" AS "sessionUserId"',
    's."expires" AS "sessionExpires"',
    'u."id" AS "userId"',
    'u."name" AS "userName"',
    'u."email" AS "userEmail"',
    'u."emailVerified" AS "userEmailVerified"',
    'u."image" AS "userImage"',
  ].join(", ");
}

function serializeDate(value: unknown): string {
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) throw new Error("Invalid database date");
  return date.toISOString();
}

function serializeNullableString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") throw new Error("Invalid database string");
  return value;
}

function serializeUser(row: Record<string, unknown>): Record<string, unknown> {
  if (typeof row.id !== "string" || typeof row.email !== "string") {
    throw new Error("Invalid database user");
  }
  return {
    id: row.id,
    name: serializeNullableString(row.name),
    email: row.email,
    emailVerified:
      row.emailVerified === null ? null : serializeDate(row.emailVerified),
    image: serializeNullableString(row.image),
  };
}

function serializeAccount(
  row: Record<string, unknown>,
): Record<string, unknown> {
  for (const name of [
    "id",
    "userId",
    "type",
    "provider",
    "providerAccountId",
  ]) {
    if (typeof row[name] !== "string")
      throw new Error("Invalid database account");
  }
  return {
    id: row.id,
    userId: row.userId,
    type: row.type,
    provider: row.provider,
    providerAccountId: row.providerAccountId,
    refresh_token: serializeNullableString(row.refresh_token),
    access_token: serializeNullableString(row.access_token),
    expires_at:
      row.expires_at === null || row.expires_at === undefined
        ? null
        : row.expires_at,
    token_type: serializeNullableString(row.token_type),
    scope: serializeNullableString(row.scope),
    id_token: serializeNullableString(row.id_token),
    session_state: serializeNullableString(row.session_state),
  };
}

function serializeSession(
  row: Record<string, unknown>,
): Record<string, unknown> {
  if (typeof row.sessionToken !== "string" || typeof row.userId !== "string") {
    throw new Error("Invalid database session");
  }
  return {
    sessionToken: row.sessionToken,
    userId: row.userId,
    expires: serializeDate(row.expires),
  };
}

function serializeVerification(
  row: Record<string, unknown>,
): Record<string, unknown> {
  if (typeof row.identifier !== "string" || typeof row.token !== "string") {
    throw new Error("Invalid database verification token");
  }
  return {
    identifier: row.identifier,
    token: row.token,
    expires: serializeDate(row.expires),
  };
}

export async function dispatchAuth(
  operation: AuthOperation,
  rawInput: unknown,
  query: DbQuery,
): Promise<unknown> {
  const input = inputRecord(rawInput);
  switch (operation) {
    case "auth.getUserForMautic": {
      const rows = await query(
        'SELECT "id", "name", "email", "gamingCredits", "gamingPlan" FROM "User" WHERE "id" = $1 LIMIT 1',
        [stringInput(input, "id")],
      );
      const row = rows[0];
      if (!row) return null;
      if (
        typeof row.id !== "string" ||
        typeof row.email !== "string" ||
        typeof row.gamingCredits !== "number" ||
        typeof row.gamingPlan !== "string"
      ) {
        throw new Error("Invalid database auth profile");
      }
      return {
        id: row.id,
        name: serializeNullableString(row.name),
        email: row.email,
        gamingCredits: row.gamingCredits,
        gamingPlan: row.gamingPlan,
      };
    }
    case "auth.createUser": {
      const id = stringInput(input, "id");
      const rows = await query(
        `INSERT INTO "User" ("id", "name", "email", "emailVerified", "image", "gamingCredits", "gamingPlan", "hasPurchasedCredits")
         VALUES ($1, $2, $3, $4, $5, 1, 'None', false)
         RETURNING ${userColumns()}`,
        [
          id,
          nullableStringInput(input, "name"),
          stringInput(input, "email"),
          nullableDateInput(input, "emailVerified"),
          nullableStringInput(input, "image"),
        ],
      );
      if (!rows[0]) throw new Error("User was not created");
      return serializeUser(rows[0]);
    }
    case "auth.getUser": {
      const rows = await query(
        `SELECT ${userColumns()} FROM "User" WHERE "id" = $1 LIMIT 1`,
        [stringInput(input, "id")],
      );
      return rows[0] ? serializeUser(rows[0]) : null;
    }
    case "auth.getUserByEmail": {
      const rows = await query(
        `SELECT ${userColumns()} FROM "User" WHERE "email" = $1 LIMIT 1`,
        [stringInput(input, "email")],
      );
      return rows[0] ? serializeUser(rows[0]) : null;
    }
    case "auth.getUserByAccount": {
      const account = inputRecord(input.account);
      const rows = await query(
        `SELECT u.${userColumns().replaceAll(", ", ", u.").replace('"id"', '"id"')} FROM "User" u
         INNER JOIN "Account" a ON a."userId" = u."id"
         WHERE a."provider" = $1 AND a."providerAccountId" = $2 LIMIT 1`,
        [
          stringInput(account, "provider"),
          stringInput(account, "providerAccountId"),
        ],
      );
      return rows[0] ? serializeUser(rows[0]) : null;
    }
    case "auth.updateUser": {
      const fields: Array<[string, unknown]> = [];
      for (const field of [
        "name",
        "email",
        "emailVerified",
        "image",
      ] as const) {
        if (field in input && input[field] !== undefined) {
          fields.push([
            field,
            field === "emailVerified"
              ? nullableDateInput(input, field)
              : field === "email"
                ? stringInput(input, field)
                : nullableStringInput(input, field),
          ]);
        }
      }
      const id = stringInput(input, "id");
      if (fields.length === 0) {
        const rows = await query(
          `SELECT ${userColumns()} FROM "User" WHERE "id" = $1`,
          [id],
        );
        if (!rows[0]) throw new Error("User not found");
        return serializeUser(rows[0]);
      }
      const assignments = fields
        .map(([field], index) => `"${field}" = $${index + 2}`)
        .join(", ");
      const rows = await query(
        `UPDATE "User" SET ${assignments} WHERE "id" = $1 RETURNING ${userColumns()}`,
        [id, ...fields.map(([, value]) => value)],
      );
      if (!rows[0]) throw new Error("User not found");
      return serializeUser(rows[0]);
    }
    case "auth.deleteUser":
      await query('DELETE FROM "User" WHERE "id" = $1', [
        stringInput(input, "id"),
      ]);
      return null;
    case "auth.linkAccount": {
      const account = inputRecord(input.account);
      const userId = stringInput(account, "userId");
      const provider = stringInput(account, "provider");
      const providerAccountId = stringInput(account, "providerAccountId");
      const rows = await query(
        `INSERT INTO "Account" (${accountColumns()})
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT ("provider", "providerAccountId") DO NOTHING
         RETURNING ${accountColumns()}`,
        [
          typeof account.id === "string" ? account.id : crypto.randomUUID(),
          userId,
          stringInput(account, "type"),
          provider,
          providerAccountId,
          nullableStringInput(account, "refresh_token"),
          nullableStringInput(account, "access_token"),
          account.expires_at ?? null,
          nullableStringInput(account, "token_type"),
          nullableStringInput(account, "scope"),
          nullableStringInput(account, "id_token"),
          nullableStringInput(account, "session_state"),
        ],
      );
      if (rows[0]) return serializeAccount(rows[0]);
      const existing = await query(
        `SELECT ${accountColumns()} FROM "Account" WHERE "provider" = $1 AND "providerAccountId" = $2 LIMIT 1`,
        [provider, providerAccountId],
      );
      if (!existing[0])
        throw new Error("Account link conflict could not be resolved");
      if (existing[0].userId !== userId)
        throw new Error("AUTH_ACCOUNT_OWNERSHIP_CONFLICT");
      return serializeAccount(existing[0]);
    }
    case "auth.unlinkAccount":
      await query(
        'DELETE FROM "Account" WHERE "provider" = $1 AND "providerAccountId" = $2',
        [
          stringInput(input, "provider"),
          stringInput(input, "providerAccountId"),
        ],
      );
      return null;
    case "auth.createSession": {
      const rows = await query(
        `INSERT INTO "Session" ("sessionToken", "userId", "expires") VALUES ($1, $2, $3)
         RETURNING ${sessionColumns()}`,
        [
          stringInput(input, "sessionToken"),
          stringInput(input, "userId"),
          dateInput(input, "expires"),
        ],
      );
      if (!rows[0]) throw new Error("Session was not created");
      return serializeSession(rows[0]);
    }
    case "auth.getSessionAndUser": {
      const rows = await query(
        `SELECT ${sessionUserColumns()} FROM "Session" s
         INNER JOIN "User" u ON u."id" = s."userId"
         WHERE s."sessionToken" = $1 LIMIT 1`,
        [stringInput(input, "sessionToken")],
      );
      const row = rows[0];
      if (!row) return null;
      return {
        session: serializeSession({
          sessionToken: row.sessionToken,
          userId: row.sessionUserId,
          expires: row.sessionExpires,
        }),
        user: serializeUser({
          id: row.userId,
          name: row.userName,
          email: row.userEmail,
          emailVerified: row.userEmailVerified,
          image: row.userImage,
        }),
      };
    }
    case "auth.updateSession": {
      const sessionToken = stringInput(input, "sessionToken");
      const rows =
        input.expires === undefined
          ? await query(
              `SELECT ${sessionColumns()} FROM "Session" WHERE "sessionToken" = $1`,
              [sessionToken],
            )
          : await query(
              `UPDATE "Session" SET "expires" = $2 WHERE "sessionToken" = $1 RETURNING ${sessionColumns()}`,
              [sessionToken, dateInput(input, "expires")],
            );
      return rows[0] ? serializeSession(rows[0]) : null;
    }
    case "auth.deleteSession":
      await query('DELETE FROM "Session" WHERE "sessionToken" = $1', [
        stringInput(input, "sessionToken"),
      ]);
      return null;
    case "auth.createVerificationToken": {
      const rows = await query(
        `INSERT INTO "VerificationToken" ("identifier", "token", "expires") VALUES ($1, $2, $3)
         ON CONFLICT ("identifier", "token") DO UPDATE SET "expires" = EXCLUDED."expires"
         RETURNING ${verificationColumns()}`,
        [
          stringInput(input, "identifier"),
          stringInput(input, "token"),
          dateInput(input, "expires"),
        ],
      );
      if (!rows[0]) throw new Error("Verification token was not created");
      return serializeVerification(rows[0]);
    }
    case "auth.useVerificationToken": {
      const rows = await query(
        `DELETE FROM "VerificationToken" WHERE "identifier" = $1 AND "token" = $2
         RETURNING ${verificationColumns()}`,
        [stringInput(input, "identifier"), stringInput(input, "token")],
      );
      return rows[0] ? serializeVerification(rows[0]) : null;
    }
  }
  throw new Error("Unsupported auth operation");
}
