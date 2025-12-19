/*
  Warnings:

  - You are about to drop the column `offerExternalId` on the `CpaUnlock` table. All the data in the column will be lost.
  - You are about to drop the column `offerTitle` on the `CpaUnlock` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CpaUnlock" DROP CONSTRAINT "CpaUnlock_userId_fkey";

-- DropIndex
DROP INDEX "CpaUnlock_token_idx";

-- DropIndex
DROP INDEX "CpaUnlock_userId_status_idx";

-- AlterTable
ALTER TABLE "CpaUnlock" DROP COLUMN "offerExternalId",
DROP COLUMN "offerTitle",
ADD COLUMN     "offerId" TEXT,
ADD COLUMN     "offerName" TEXT;

-- AddForeignKey
ALTER TABLE "CpaUnlock" ADD CONSTRAINT "CpaUnlock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
