/*
  Warnings:

  - Made the column `created_at` on table `refresh_tokens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `refresh_tokens` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "refresh_tokens" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;
