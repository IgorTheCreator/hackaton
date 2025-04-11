/*
  Warnings:

  - You are about to drop the column `tasks` on the `Project` table. All the data in the column will be lost.
  - Added the required column `type` to the `Achievment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Achievment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purpose_amount` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AchievmentType" AS ENUM ('money', 'co2');

-- AlterTable
ALTER TABLE "Achievment" ADD COLUMN     "type" "AchievmentType" NOT NULL,
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "tasks",
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "purpose_amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "co2_economy" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "name" TEXT DEFAULT 'Незнакомец',
ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "project_id" TEXT,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
