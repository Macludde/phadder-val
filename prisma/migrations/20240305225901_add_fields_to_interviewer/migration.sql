/*
  Warnings:

  - Added the required column `electionFamiliarity` to the `Interviewer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Interviewer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InterviewerRole" AS ENUM ('Stab', 'Opepp', 'Pepp');

-- AlterTable
ALTER TABLE "Interviewer" ADD COLUMN     "electionFamiliarity" INTEGER NOT NULL,
ADD COLUMN     "role" "InterviewerRole" NOT NULL;
