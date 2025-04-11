/*
  Warnings:

  - You are about to drop the column `esgId` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[project_id]` on the table `Esg` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ratingDate` to the `Esg` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EsgRatingCategory" AS ENUM ('A', 'B', 'C', 'D');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('TreePlanting', 'WaterCleanup', 'RenewableEnergy', 'WasteRecycling', 'Biodiversity', 'Other');

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_esgId_fkey";

-- AlterTable
ALTER TABLE "Esg" ADD COLUMN     "biodiversity_impact" TEXT,
ADD COLUMN     "certifications" TEXT,
ADD COLUMN     "co2_reduction" DOUBLE PRECISION,
ADD COLUMN     "community_engagement" INTEGER,
ADD COLUMN     "data_source" TEXT,
ADD COLUMN     "education_programs" INTEGER,
ADD COLUMN     "environmental_score" DOUBLE PRECISION,
ADD COLUMN     "ethics_compliance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "financial_transparency" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "governance_score" DOUBLE PRECISION,
ADD COLUMN     "jobs_created" INTEGER,
ADD COLUMN     "land_restored" DOUBLE PRECISION,
ADD COLUMN     "overall_score" DOUBLE PRECISION,
ADD COLUMN     "ratingDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "rating_category" "EsgRatingCategory",
ADD COLUMN     "regular_reports" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "renewable_energy_used" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resource_access" TEXT,
ADD COLUMN     "risk_management" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "social_score" DOUBLE PRECISION,
ADD COLUMN     "stakeholder_engagement" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trees_planted" INTEGER,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "waste_recycled" DOUBLE PRECISION,
ADD COLUMN     "water_minimized" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "water_saved" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "esgId",
ADD COLUMN     "current_amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "type" "ProjectType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Esg_project_id_key" ON "Esg"("project_id");

-- AddForeignKey
ALTER TABLE "Esg" ADD CONSTRAINT "Esg_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
