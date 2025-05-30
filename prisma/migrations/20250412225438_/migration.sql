-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "EsgRatingCategory" AS ENUM ('A', 'B', 'C', 'D');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('donation', 'refill');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('TreePlanting', 'WaterCleanup', 'RenewableEnergy', 'WasteRecycling', 'Biodiversity', 'Other');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT DEFAULT 'Незнакомец',
    "level" INTEGER NOT NULL DEFAULT 0,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "treesSaved" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "co2_reduced" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "plasticReduced" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_bunned" BOOLEAN NOT NULL DEFAULT false,
    "achievments" TEXT[],
    "balance" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "user_agent" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "type" "ProjectType" NOT NULL,
    "location" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "goal_funding" INTEGER NOT NULL,
    "current_funding" INTEGER NOT NULL DEFAULT 0,
    "end_date" TIMESTAMP(3) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialMedia" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "project_id" TEXT,

    CONSTRAINT "SocialMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "project_id" TEXT,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Esg" (
    "id" TEXT NOT NULL,
    "ratingDate" TIMESTAMP(3) NOT NULL,
    "project_id" TEXT NOT NULL,
    "overall_score" DOUBLE PRECISION,
    "environmental_score" DOUBLE PRECISION,
    "social_score" DOUBLE PRECISION,
    "governance_score" DOUBLE PRECISION,
    "rating_category" "EsgRatingCategory",
    "co2_reduction" DOUBLE PRECISION,
    "trees_planted" INTEGER,
    "water_saved" DOUBLE PRECISION,
    "waste_recycled" DOUBLE PRECISION,
    "land_restored" DOUBLE PRECISION,
    "renewable_energy_used" BOOLEAN NOT NULL DEFAULT false,
    "water_minimized" BOOLEAN NOT NULL DEFAULT false,
    "biodiversity_impact" TEXT,
    "jobs_created" INTEGER,
    "community_engagement" INTEGER,
    "resource_access" TEXT,
    "education_programs" INTEGER,
    "financial_transparency" BOOLEAN NOT NULL DEFAULT false,
    "regular_reports" BOOLEAN NOT NULL DEFAULT false,
    "risk_management" BOOLEAN NOT NULL DEFAULT false,
    "stakeholder_engagement" BOOLEAN NOT NULL DEFAULT false,
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
    "projectId" TEXT,
    "type" "TransactionType" NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Esg_project_id_key" ON "Esg"("project_id");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMedia" ADD CONSTRAINT "SocialMedia_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Esg" ADD CONSTRAINT "Esg_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
