-- CreateEnum
CREATE TYPE "OfferDevice" AS ENUM ('mobile', 'desktop');

-- CreateEnum
CREATE TYPE "OfferOS" AS ENUM ('android', 'ios', 'windows', 'mac', 'any');

-- CreateEnum
CREATE TYPE "OfferType" AS ENUM ('CPI', 'PPI');

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "network" "CpaNetwork" NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "payout" DOUBLE PRECISION,
    "currency" TEXT,
    "device" "OfferDevice" NOT NULL,
    "os" "OfferOS" NOT NULL,
    "type" "OfferType" NOT NULL,
    "countries" TEXT[],
    "priority" INTEGER NOT NULL DEFAULT 100,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Offer_network_active_idx" ON "Offer"("network", "active");

-- CreateIndex
CREATE INDEX "CpaUnlock_userId_status_idx" ON "CpaUnlock"("userId", "status");
