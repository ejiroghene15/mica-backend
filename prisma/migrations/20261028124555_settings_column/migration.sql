/*
  Warnings:

  - You are about to drop the column `dailyCheckInReminder` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `journalPromptReminder` on the `settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "settings" DROP COLUMN "dailyCheckInReminder",
DROP COLUMN "journalPromptReminder",
ADD COLUMN     "dailyCheckIn" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "journalPrompt" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
