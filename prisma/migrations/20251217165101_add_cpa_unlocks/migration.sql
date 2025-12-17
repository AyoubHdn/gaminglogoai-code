-- CreateEnum
CREATE TYPE "CpaStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "CpaNetwork" AS ENUM ('mylead');

-- CreateTable
CREATE TABLE "CpaUnlock" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "network" "CpaNetwork" NOT NULL,
    "status" "CpaStatus" NOT NULL DEFAULT 'pending',
    "offerId" TEXT,
    "offerName" TEXT,
    "transactionId" TEXT,
    "payout" DOUBLE PRECISION,
    "currency" TEXT,
    "country" TEXT,
    "leadIp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),

    CONSTRAINT "CpaUnlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CpaUnlock_token_key" ON "CpaUnlock"("token");

-- AddForeignKey
ALTER TABLE "CpaUnlock" ADD CONSTRAINT "CpaUnlock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
