/*
  Warnings:

  - You are about to drop the column `certifications` on the `Esg` table. All the data in the column will be lost.
  - You are about to drop the column `data_source` on the `Esg` table. All the data in the column will be lost.
  - You are about to drop the column `ethics_compliance` on the `Esg` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `Esg` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Esg" DROP COLUMN "certifications",
DROP COLUMN "data_source",
DROP COLUMN "ethics_compliance",
DROP COLUMN "verified";
