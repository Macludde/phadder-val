-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "programme" TEXT;

-- AlterTable
ALTER TABLE "ApplicantPosition" ADD COLUMN     "canTakeOtherMissions" TEXT,
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "flags" TEXT,
ADD COLUMN     "score" INTEGER;
