/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `isBanned` on the `users` table. All the data in the column will be lost.
  - Added the required column `expires_at` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_userId_fkey";

-- AlterTable
ALTER TABLE "refresh_tokens" DROP COLUMN "expiresAt",
DROP COLUMN "userId",
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isBanned",
ADD COLUMN     "is_bunned" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "tasks" TEXT[],
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "esgId" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Esg" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Esg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievment" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievment" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "achievment_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAchievment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_esgId_fkey" FOREIGN KEY ("esgId") REFERENCES "Esg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievment" ADD CONSTRAINT "UserAchievment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievment" ADD CONSTRAINT "UserAchievment_achievment_id_fkey" FOREIGN KEY ("achievment_id") REFERENCES "Achievment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
