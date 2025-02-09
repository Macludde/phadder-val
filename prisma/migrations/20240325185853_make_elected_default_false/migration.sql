/*
  Warnings:

  - Made the column `elected` on table `ApplicantPosition` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ApplicantPosition" ALTER COLUMN "elected" SET NOT NULL,
ALTER COLUMN "elected" SET DEFAULT false;
