/*
  Warnings:

  - You are about to drop the column `offerId` on the `CpaUnlock` table. All the data in the column will be lost.
  - You are about to drop the column `offerName` on the `CpaUnlock` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[network,externalId]` on the table `Offer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `conversion` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OfferConversion" AS ENUM ('install', 'survey', 'single_opt_in', 'complete_task', 'register');

-- AlterEnum
ALTER TYPE "CpaNetwork" ADD VALUE 'cpagrip';

-- DropIndex
DROP INDEX "Offer_network_active_idx";

-- AlterTable
ALTER TABLE "CpaUnlock" DROP COLUMN "offerId",
DROP COLUMN "offerName",
ADD COLUMN     "offerExternalId" TEXT,
ADD COLUMN     "offerTitle" TEXT;

-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "conversion" "OfferConversion" NOT NULL,
ADD COLUMN     "dailyCap" INTEGER,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "CpaUnlock_token_idx" ON "CpaUnlock"("token");

-- CreateIndex
CREATE INDEX "Offer_network_active_priority_idx" ON "Offer"("network", "active", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "Offer_network_externalId_key" ON "Offer"("network", "externalId");
