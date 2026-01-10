-- CreateTable
CREATE TABLE "CpaSwitch" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "lastUsed" "CpaNetwork" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CpaSwitch_pkey" PRIMARY KEY ("id")
);
