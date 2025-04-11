/*
  Warnings:

  - Added the required column `type` to the `Achievment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Achievment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purpose_amount` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `co2_economy` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AchievmentType" AS ENUM ('money', 'co2');

-- AlterTable
ALTER TABLE "Achievment" ADD COLUMN     "type" "AchievmentType" NOT NULL,
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "purpose_amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "co2_economy" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "rating" INTEGER NOT NULL;
