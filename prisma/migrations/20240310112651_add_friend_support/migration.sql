-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "friend1Id" INTEGER,
ADD COLUMN     "friend2Id" INTEGER;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_friend1Id_fkey" FOREIGN KEY ("friend1Id") REFERENCES "Applicant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_friend2Id_fkey" FOREIGN KEY ("friend2Id") REFERENCES "Applicant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
