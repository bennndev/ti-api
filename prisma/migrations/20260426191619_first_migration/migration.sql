/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User_Group` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SessionEndReason" AS ENUM ('completed', 'abandoned', 'crashed', 'timeout', 'user_exit');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ABANDONED');

-- DropForeignKey
ALTER TABLE "Activity_Log" DROP CONSTRAINT "Activity_Log_userId_fkey";

-- DropForeignKey
ALTER TABLE "Email" DROP CONSTRAINT "Email_userId_fkey";

-- DropForeignKey
ALTER TABLE "Phone" DROP CONSTRAINT "Phone_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_orgId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropForeignKey
ALTER TABLE "User_Group" DROP CONSTRAINT "User_Group_userId_fkey";

-- AlterTable
ALTER TABLE "Activity_Log" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Email" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Group_Experience" ADD COLUMN     "endReason" "SessionEndReason",
ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "totalTimeSeconds" INTEGER;

-- AlterTable
ALTER TABLE "Phone" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "email" VARCHAR(255) NOT NULL,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "image" VARCHAR(255),
ADD COLUMN     "name" VARCHAR(100),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "orgId" DROP NOT NULL,
ALTER COLUMN "roleId" DROP NOT NULL,
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "documentType" DROP NOT NULL,
ALTER COLUMN "documentNumber" DROP NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "User_Group" DROP CONSTRAINT "User_Group_pkey",
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_Group_pkey" PRIMARY KEY ("userId", "groupId");

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "password" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevicePin" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "pin" VARCHAR(6) NOT NULL,
    "deviceId" VARCHAR(100),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DevicePin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Addressable" (
    "id" SERIAL NOT NULL,
    "experienceId" INTEGER NOT NULL,
    "bundleUrl" VARCHAR(500) NOT NULL,
    "version" VARCHAR(20) NOT NULL,
    "sizeMb" DOUBLE PRECISION NOT NULL,
    "catalogUrl" VARCHAR(500) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Addressable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score_Event" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "experienceId" INTEGER NOT NULL,
    "sessionId" VARCHAR(100) NOT NULL,
    "eventId" VARCHAR(50) NOT NULL,
    "label" VARCHAR(100),
    "scoreDelta" DOUBLE PRECISION NOT NULL,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XR_Session" (
    "id" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,
    "experienceId" INTEGER NOT NULL,
    "deviceType" VARCHAR(50),
    "platform" VARCHAR(100),
    "ipAddress" VARCHAR(45),
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "XR_Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_providerId_accountId_key" ON "Account"("providerId", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_value_key" ON "VerificationToken"("value");

-- CreateIndex
CREATE INDEX "VerificationToken_identifier_idx" ON "VerificationToken"("identifier");

-- CreateIndex
CREATE INDEX "DevicePin_userId_idx" ON "DevicePin"("userId");

-- CreateIndex
CREATE INDEX "DevicePin_pin_idx" ON "DevicePin"("pin");

-- CreateIndex
CREATE INDEX "DevicePin_expiresAt_idx" ON "DevicePin"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Addressable_experienceId_key" ON "Addressable"("experienceId");

-- CreateIndex
CREATE INDEX "Addressable_experienceId_idx" ON "Addressable"("experienceId");

-- CreateIndex
CREATE INDEX "Score_Event_groupId_experienceId_idx" ON "Score_Event"("groupId", "experienceId");

-- CreateIndex
CREATE INDEX "Score_Event_sessionId_idx" ON "Score_Event"("sessionId");

-- CreateIndex
CREATE INDEX "XR_Session_groupId_idx" ON "XR_Session"("groupId");

-- CreateIndex
CREATE INDEX "XR_Session_experienceId_idx" ON "XR_Session"("experienceId");

-- CreateIndex
CREATE INDEX "XR_Session_status_idx" ON "XR_Session"("status");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevicePin" ADD CONSTRAINT "DevicePin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Addressable" ADD CONSTRAINT "Addressable_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Group" ADD CONSTRAINT "User_Group_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score_Event" ADD CONSTRAINT "Score_Event_groupId_experienceId_fkey" FOREIGN KEY ("groupId", "experienceId") REFERENCES "Group_Experience"("groupId", "experienceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XR_Session" ADD CONSTRAINT "XR_Session_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XR_Session" ADD CONSTRAINT "XR_Session_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Phone" ADD CONSTRAINT "Phone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity_Log" ADD CONSTRAINT "Activity_Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
