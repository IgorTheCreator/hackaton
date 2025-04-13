/*
  Warnings:

  - You are about to drop the column `achievments` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `progress` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "achievments",
DROP COLUMN "progress",
ADD COLUMN     "badges" TEXT[],
ADD COLUMN     "level_progress" INTEGER NOT NULL DEFAULT 0;
