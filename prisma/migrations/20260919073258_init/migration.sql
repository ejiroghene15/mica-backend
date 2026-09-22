/*
  Warnings:

  - You are about to drop the `check_ins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mica_layers` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('work', 'relationships', 'health', 'money', 'rest', 'myself');

-- DropForeignKey
ALTER TABLE "check_ins" DROP CONSTRAINT "check_ins_userId_fkey";

-- DropForeignKey
ALTER TABLE "mica_layers" DROP CONSTRAINT "mica_layers_checkInId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "onboarding_complete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "resetPasswordExpiry" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "check_ins";

-- DropTable
DROP TABLE "mica_layers";

-- CreateTable
CREATE TABLE "layers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emotion" "MoodKey" NOT NULL,
    "intensity" INTEGER NOT NULL,
    "category" "Category" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "layers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "layers" ADD CONSTRAINT "layers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
