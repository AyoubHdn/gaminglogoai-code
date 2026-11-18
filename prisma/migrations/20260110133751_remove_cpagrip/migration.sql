/*
  Warnings:

  - The values [cpagrip] on the enum `CpaNetwork` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CpaNetwork_new" AS ENUM ('mylead', 'cpx');
ALTER TABLE "User" ALTER COLUMN "lastCpaNetwork" TYPE "CpaNetwork_new" USING ("lastCpaNetwork"::text::"CpaNetwork_new");
ALTER TABLE "CpaUnlock" ALTER COLUMN "network" TYPE "CpaNetwork_new" USING ("network"::text::"CpaNetwork_new");
ALTER TABLE "Offer" ALTER COLUMN "network" TYPE "CpaNetwork_new" USING ("network"::text::"CpaNetwork_new");
ALTER TABLE "CpaSwitch" ALTER COLUMN "lastUsed" TYPE "CpaNetwork_new" USING ("lastUsed"::text::"CpaNetwork_new");
ALTER TYPE "CpaNetwork" RENAME TO "CpaNetwork_old";
ALTER TYPE "CpaNetwork_new" RENAME TO "CpaNetwork";
DROP TYPE "CpaNetwork_old";
COMMIT;
