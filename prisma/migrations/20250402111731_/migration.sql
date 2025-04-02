/*
  Warnings:

  - Made the column `expiresAt` on table `refresh_tokens` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "refresh_tokens" ALTER COLUMN "expiresAt" SET NOT NULL;
