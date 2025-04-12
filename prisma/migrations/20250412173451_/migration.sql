/*
  Warnings:

  - You are about to drop the column `balance` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `Achievment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAchievment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserAchievment" DROP CONSTRAINT "UserAchievment_achievment_id_fkey";

-- DropForeignKey
ALTER TABLE "UserAchievment" DROP CONSTRAINT "UserAchievment_user_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "balance",
DROP COLUMN "rating",
ADD COLUMN     "achievments" TEXT[],
ADD COLUMN     "co2Reduced" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "plasticReduced" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "treesSaved" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Achievment";

-- DropTable
DROP TABLE "UserAchievment";

-- DropEnum
DROP TYPE "AchievmentType";
