import { prismaClient } from "@/index";

export const load = async () => {
  const pagination = 4;
  const applicants = await prismaClient.applicant.findMany({
    where: {
      interviewId: {
        not: null,
      },
      name: {
        in: [
          "Emil Helander",
          "Nils Klemming Nordenskiöld",
          "Tilda Fredriksson",
          "Gustaf Jonson Stamfält",
          "Märta Fiddeli Fahlborg",
          "Wilma Wiberg",
          "Alexander Anvin",
          "Sebastian Sandelius",
          "David Andersson",
          "Tristan Farkas",
          "Karl Sellergren",
          "Olivia Bjursten",
          "Cimon Behzad ",
          "Ellen Persson",
          "Emil Schough",
          "Jacob Johansson",
          "Jakob Silverio",
          "Linda Metzger",
          "Lisa Clevestam",
          "Ludwig Gehlsdorf",
          "Philip Nielsen",
          "Samuel Esfandyari",
        ],
      },
    },
    include: {
      friend1: true,
      friend2: true,
      ApplicantPosition: {
        where: {
          score: {
            gt: 1,
          },
        },
      },
    },
  });
  const dupedApplicantsWithPosition = applicants.flatMap((applicant) =>
    applicant.ApplicantPosition.map((pos) => ({
      ...applicant,
      ApplicantPosition: pos,
    })),
  );
  dupedApplicantsWithPosition.sort((a, b) => {
    const position = a.ApplicantPosition.position.localeCompare(
      b.ApplicantPosition.position,
      "sv-SE",
    );
    if (position !== 0) {
      return position;
    }
    return (b.ApplicantPosition.score ?? 0) - (a.ApplicantPosition.score ?? 0);
  });
  return {
    applicants: dupedApplicantsWithPosition.slice(
      pagination * 9,
      pagination * 9 + 9,
    ),
  };
};
