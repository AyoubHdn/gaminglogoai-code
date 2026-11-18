/*
  Warnings:

  - You are about to drop the `Emote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Emote" DROP CONSTRAINT "Emote_userId_fkey";

-- AlterTable
ALTER TABLE "Icon" ADD COLUMN     "imageKey" TEXT;

-- DropTable
DROP TABLE "Emote";
