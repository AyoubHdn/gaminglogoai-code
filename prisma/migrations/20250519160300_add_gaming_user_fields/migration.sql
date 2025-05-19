/*
  Warnings:

  - You are about to drop the column `gamingCredits` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gamingPlan` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "gamingCredits",
DROP COLUMN "gamingPlan",
ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'None';
