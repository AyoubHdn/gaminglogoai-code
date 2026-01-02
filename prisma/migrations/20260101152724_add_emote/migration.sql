-- CreateTable
CREATE TABLE "Emote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "style" TEXT,
    "imageKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Emote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Emote" ADD CONSTRAINT "Emote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
