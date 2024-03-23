import { prismaClient } from "@/index";

export const load = async () => {
  const applicants = await prismaClient.applicant.findMany({
    include: {
      ApplicantPosition: true,
    },
  });
  const dupedApplicantsWithPosition = applicants.flatMap((applicant) =>
    applicant.ApplicantPosition.map((pos) => ({
      ...applicant,
      ApplicantPosition: pos,
    })),
  );
  return {
    applicants: dupedApplicantsWithPosition,
  };
};
