-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "hasAnsweredExtraForm" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasSentExtraFormMail" BOOLEAN NOT NULL DEFAULT false;
