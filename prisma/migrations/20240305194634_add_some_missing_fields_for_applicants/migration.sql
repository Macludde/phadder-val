/*
  Warnings:

  - Added the required column `appliedAt` to the `Applicant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "applicantOrderReason" TEXT,
ADD COLUMN     "appliedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ApplicantPosition" ALTER COLUMN "order" DROP NOT NULL;
