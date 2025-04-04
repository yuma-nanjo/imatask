/*
  Warnings:

  - Added the required column `hashedPassword` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- Add columns
ALTER TABLE "User" ADD COLUMN "hashedPassword" TEXT DEFAULT 'placeholder';
ALTER TABLE "User" ADD COLUMN "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "twoFactorSecret" TEXT;
ALTER TABLE "User" ADD COLUMN "twoFactorBackupCodes" TEXT;

-- Update existing users
UPDATE "User" SET "hashedPassword" = 'placeholder' WHERE "hashedPassword" IS NULL;

-- Make hashedPassword required
ALTER TABLE "User" ALTER COLUMN "hashedPassword" SET NOT NULL;
