-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gamingCredits" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "gamingPlan" "Plan" NOT NULL DEFAULT 'None';
