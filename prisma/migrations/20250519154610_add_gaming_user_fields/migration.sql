/*
  Warnings:

  - You are about to drop the column `credits` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `plan` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "credits",
DROP COLUMN "plan",
ADD COLUMN     "gamingCredits" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "gamingPlan" "Plan" NOT NULL DEFAULT 'None';
