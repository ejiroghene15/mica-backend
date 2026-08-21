-- CreateTable
CREATE TABLE "settings" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "dailyCheckInReminder" BOOLEAN NOT NULL DEFAULT true,
    "journalPromptReminder" BOOLEAN NOT NULL DEFAULT true,
    "appLock" BOOLEAN NOT NULL DEFAULT false,
    "hidePreviews" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "settings_userId_key" ON "settings"("userId");

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
