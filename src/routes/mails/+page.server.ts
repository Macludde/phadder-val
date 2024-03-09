import { prismaClient } from "@/index";
import { Mission, Position } from "@prisma/client";

export const load = async () => {
  const fullCount = await prismaClient.applicant.count();
  const nonMission = await prismaClient.applicant.findMany({
    where: {
      AND: [
        {
          ApplicantPosition: {
            none: {
              position: {
                in: [Position.Mission, Position.InternationalMission],
              },
            },
          },
        },
        {
          ApplicantPosition: {
            some: {
              position: {
                in: [
                  Position.Group,
                  Position.Head,
                  Position.InternationalGroup,
                  Position.InternationalHead,
                ],
              },
            },
          },
        },
      ],
    },
  });
  const missionCount = await prismaClient.applicant.count({
    where: {
      ApplicantPosition: {
        some: {
          OR: [
            {
              position: Position.Mission,
            },
            {
              position: Position.InternationalMission,
            },
          ],
        },
      },
    },
  });
  const missionNonSpex = await prismaClient.applicant.findMany({
    where: {
      ApplicantPosition: {
        some: {
          OR: [
            {
              position: Position.Mission,
            },
            {
              position: Position.InternationalMission,
            },
          ],
        },
      },
      NOT: {
        preferredMissions: {
          has: Mission.Nollespex,
        },
      },
    },
  });
  const missionAndSpex = await prismaClient.applicant.findMany({
    where: {
      ApplicantPosition: {
        some: {
          OR: [
            {
              position: Position.Mission,
            },
            {
              position: Position.InternationalMission,
            },
          ],
        },
      },
      preferredMissions: {
        has: Mission.Nollespex,
      },
    },
  });
  return {
    nonMission,
    missionNonSpex,
    missionAndSpex,
    fullCount,
    missionCount,
  };
};
