/*
  Warnings:

  - The values [Biodiversity] on the enum `ProjectType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProjectType_new" AS ENUM ('TreePlanting', 'WaterCleanup', 'RenewableEnergy', 'WasteRecycling', 'Other');
ALTER TABLE "Project" ALTER COLUMN "type" TYPE "ProjectType_new" USING ("type"::text::"ProjectType_new");
ALTER TYPE "ProjectType" RENAME TO "ProjectType_old";
ALTER TYPE "ProjectType_new" RENAME TO "ProjectType";
DROP TYPE "ProjectType_old";
COMMIT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "water_cleaned" DOUBLE PRECISION NOT NULL DEFAULT 0;
