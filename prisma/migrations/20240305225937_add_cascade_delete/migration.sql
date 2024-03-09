-- DropForeignKey
ALTER TABLE "ApplicantPosition" DROP CONSTRAINT "ApplicantPosition_applicantId_fkey";

-- DropForeignKey
ALTER TABLE "TimeRange" DROP CONSTRAINT "TimeRange_applicantId_fkey";

-- AddForeignKey
ALTER TABLE "ApplicantPosition" ADD CONSTRAINT "ApplicantPosition_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeRange" ADD CONSTRAINT "TimeRange_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
