-- CreateEnum
CREATE TYPE "Position" AS ENUM ('Group', 'Mission', 'Study', 'Head', 'InternationalGroup', 'InternationalHead', 'InternationalMission');

-- CreateEnum
CREATE TYPE "Mission" AS ENUM ('Cheer', 'Ladbil', 'Ballongistapult', 'Regatta', 'Nollespex', 'Showdown', 'Flying', 'Waterloo', 'Oph', 'New');

-- CreateTable
CREATE TABLE "Applicant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "phoneNumber" TEXT,
    "preferredMissions" "Mission"[],
    "interviewId" INTEGER,
    "otherInfo" TEXT,
    "cantInterviewReason" TEXT,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicantPosition" (
    "position" "Position" NOT NULL,
    "applicantId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ApplicantPosition_pkey" PRIMARY KEY ("position","applicantId")
);

-- CreateTable
CREATE TABLE "TimeRange" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "applicantId" INTEGER NOT NULL,

    CONSTRAINT "TimeRange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interviewer" (
    "name" TEXT NOT NULL,

    CONSTRAINT "Interviewer_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_InterviewToInterviewer" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_InterviewToInterviewer_AB_unique" ON "_InterviewToInterviewer"("A", "B");

-- CreateIndex
CREATE INDEX "_InterviewToInterviewer_B_index" ON "_InterviewToInterviewer"("B");

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicantPosition" ADD CONSTRAINT "ApplicantPosition_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeRange" ADD CONSTRAINT "TimeRange_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterviewToInterviewer" ADD CONSTRAINT "_InterviewToInterviewer_A_fkey" FOREIGN KEY ("A") REFERENCES "Interview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterviewToInterviewer" ADD CONSTRAINT "_InterviewToInterviewer_B_fkey" FOREIGN KEY ("B") REFERENCES "Interviewer"("name") ON DELETE CASCADE ON UPDATE CASCADE;
