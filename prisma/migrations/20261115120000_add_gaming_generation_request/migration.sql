-- Additive only. Apply to disposable CI first; no live execution is part of this change.
CREATE TABLE "GamingGenerationRequest" (
    "userId" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "creditCost" INTEGER NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'reserved',
    "icons" JSONB NOT NULL,
    "shouldWatermark" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GamingGenerationRequest_pkey" PRIMARY KEY ("userId", "requestId"),
    CONSTRAINT "GamingGenerationRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GamingGenerationRequest_cost_check" CHECK ("creditCost" BETWEEN 1 AND 20),
    CONSTRAINT "GamingGenerationRequest_state_check" CHECK ("state" IN ('reserved', 'completed', 'refunded')),
    CONSTRAINT "GamingGenerationRequest_icons_check" CHECK (jsonb_typeof("icons")='array' AND jsonb_array_length("icons") BETWEEN 1 AND 10)
);
CREATE INDEX "GamingGenerationRequest_state_createdAt_idx" ON "GamingGenerationRequest"("state", "createdAt");
-- Access only through the trusted DB connection, never the Supabase anonymous API.
ALTER TABLE "GamingGenerationRequest" ENABLE ROW LEVEL SECURITY;
