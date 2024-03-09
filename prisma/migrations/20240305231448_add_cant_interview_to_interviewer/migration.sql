-- AlterTable
ALTER TABLE "TimeRange" ADD COLUMN     "interviewerName" TEXT,
ALTER COLUMN "applicantId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TimeRange" ADD CONSTRAINT "TimeRange_interviewerName_fkey" FOREIGN KEY ("interviewerName") REFERENCES "Interviewer"("name") ON DELETE SET NULL ON UPDATE CASCADE;
