import {
  GenerationError,
  parseGenerationKey,
  parseIcons,
  parseReservation,
  parseState,
  prepareLogoRequest,
  type GenerationDbService,
  type GenerationKey,
} from "./contract.ts";

type Row = Record<string, unknown>;
export type GenerationQuery = (
  sql: string,
  values: unknown[],
) => Promise<ReadonlyArray<Row>>;
/** All statements in the callback MUST share one transaction/connection. */
export type GenerationTransaction = <T>(
  action: (query: GenerationQuery) => Promise<T>,
) => Promise<T>;

async function lockUser(query: GenerationQuery, userId: string): Promise<Row> {
  const [user] = await query(
    'SELECT "gamingCredits", "hasPurchasedCredits", "email", "name" FROM "User" WHERE "id"=$1 FOR UPDATE',
    [userId],
  );
  if (!user) throw new GenerationError("GENERATION_USER_NOT_FOUND");
  return user;
}
async function getRequest(query: GenerationQuery, key: GenerationKey) {
  const [row] = await query(
    'SELECT * FROM "GamingGenerationRequest" WHERE "userId"=$1 AND "requestId"=$2',
    [key.userId, key.requestId],
  );
  return row;
}
function reservation(row: Row, user: Row, acquired: boolean) {
  return parseReservation({
    acquired,
    state: row.state,
    icons: row.icons,
    shouldWatermark: row.shouldWatermark,
    credits: user.gamingCredits,
    email: user.email,
    name: user.name,
  });
}

export function createSqlGenerationDbService(
  transaction: GenerationTransaction,
): GenerationDbService {
  return {
    async reserveLogo(value) {
      const { input, fingerprint, icons, cost } =
        await prepareLogoRequest(value);
      return transaction(async (query) => {
        // Same lock order for reserve/complete/refund serializes a user's balance changes.
        const user = await lockUser(query, input.userId);
        const existing = await getRequest(query, input);
        if (existing) {
          if (
            existing.fingerprint !== fingerprint ||
            existing.creditCost !== cost
          )
            throw new GenerationError("GENERATION_REQUEST_CONFLICT");
          return reservation(existing, user, false);
        }
        const [charged] = await query(
          'UPDATE "User" SET "gamingCredits"="gamingCredits"-$2 WHERE "id"=$1 AND "gamingCredits">=$2 RETURNING "gamingCredits"',
          [input.userId, cost],
        );
        if (!charged)
          throw new GenerationError("GENERATION_INSUFFICIENT_CREDITS");
        const [row] = await query(
          'INSERT INTO "GamingGenerationRequest" ("userId","requestId","fingerprint","creditCost","icons","shouldWatermark") VALUES ($1,$2,$3,$4,$5::text::jsonb,$6) RETURNING *',
          [
            input.userId,
            input.requestId,
            fingerprint,
            cost,
            JSON.stringify(icons),
            user.hasPurchasedCredits !== true,
          ],
        );
        if (!row) throw new Error("Generation reservation insert failed");
        return reservation(row, { ...user, ...charged }, true);
      });
    },
    async completeLogo(value) {
      const key = parseGenerationKey(value);
      return transaction(async (query) => {
        await lockUser(query, key.userId);
        const row = await getRequest(query, key);
        if (!row) throw new GenerationError("GENERATION_NOT_FOUND");
        const state = parseState(row.state);
        if (state === "completed") return state;
        if (state === "refunded")
          throw new GenerationError("GENERATION_ALREADY_REFUNDED");
        for (const icon of parseIcons(row.icons)) {
          await query(
            'INSERT INTO "Icon" ("id","userId","prompt","imageKey") VALUES ($1,$2,$3,$4) RETURNING "id"',
            [icon.id, key.userId, icon.prompt, icon.imageKey],
          );
        }
        await query(
          'UPDATE "GamingGenerationRequest" SET "state"=\'completed\',"updatedAt"=CURRENT_TIMESTAMP WHERE "userId"=$1 AND "requestId"=$2 RETURNING "state"',
          [key.userId, key.requestId],
        );
        return "completed";
      });
    },
    async refundLogo(value) {
      const key = parseGenerationKey(value);
      return transaction(async (query) => {
        await lockUser(query, key.userId);
        const row = await getRequest(query, key);
        if (!row) throw new GenerationError("GENERATION_NOT_FOUND");
        const state = parseState(row.state);
        if (state !== "reserved") return state;
        await query(
          'UPDATE "User" SET "gamingCredits"="gamingCredits"+$2 WHERE "id"=$1 RETURNING "gamingCredits"',
          [key.userId, row.creditCost],
        );
        await query(
          'UPDATE "GamingGenerationRequest" SET "state"=\'refunded\',"updatedAt"=CURRENT_TIMESTAMP WHERE "userId"=$1 AND "requestId"=$2 RETURNING "state"',
          [key.userId, key.requestId],
        );
        return "refunded";
      });
    },
  };
}
