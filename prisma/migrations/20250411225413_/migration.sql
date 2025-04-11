/*
  Warnings:

  - You are about to drop the column `tasks` on the `Project` table. All the data in the column will be lost.
  - Added the required column `end_date` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "tasks",
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "co2_economy" SET DEFAULT 0,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "rating" SET DEFAULT 0;

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
