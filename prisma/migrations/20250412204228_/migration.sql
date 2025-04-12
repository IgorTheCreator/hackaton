/*
  Warnings:

  - You are about to drop the column `co2Reduced` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `co2_economy` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "co2Reduced",
DROP COLUMN "co2_economy",
ADD COLUMN     "co2_reduced" DOUBLE PRECISION NOT NULL DEFAULT 0;
