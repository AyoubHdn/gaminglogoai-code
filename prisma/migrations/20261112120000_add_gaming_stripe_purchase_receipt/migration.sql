-- Additive: no backfill or change to existing users/credits.
CREATE TABLE "GamingStripePurchase" (
  "id" TEXT NOT NULL,
  "stripeSessionId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "credits" INTEGER NOT NULL,
  "plan" "Plan" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "GamingStripePurchase_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "GamingStripePurchase_pack_check" CHECK (
    ("plan" = 'Starter' AND "credits" = 20) OR
    ("plan" = 'Pro' AND "credits" = 50) OR
    ("plan" = 'Elite' AND "credits" = 100)
  )
);
CREATE UNIQUE INDEX "GamingStripePurchase_stripeSessionId_key"
  ON "GamingStripePurchase"("stripeSessionId");
CREATE INDEX "GamingStripePurchase_userId_createdAt_idx"
  ON "GamingStripePurchase"("userId", "createdAt");
ALTER TABLE "GamingStripePurchase" ADD CONSTRAINT "GamingStripePurchase_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
