import { prismaClient } from "$lib";
import { seed } from "$lib/seed";
import { seedFriends } from "@/friends";
import type { Actions } from "./$types";
const days = [18, 19, 20, 21, 22, 23, 24];
export const load = async () => {
  const numberOfApplicants = await prismaClient.applicant.count();
  const applicantsByPosition = await prismaClient.applicantPosition.groupBy({
    by: "position",
    _count: {
      applicantId: true,
    },
  });

  const yetToBeAssignedInterview = await prismaClient.applicant.count({
    where: {
      interviewId: null,
    },
  });
  const applicantsWhoCanInterviewPerDay = await Promise.all(
    days.map((day) =>
      prismaClient.applicant.count({
        where: {
          cantInterviewFinished: true,
          interviewId: null,
          cantInterview: {
            none: {
              startTime: {
                lte: new Date(`2024-03-${day}T09:00:00Z`),
              },
              endTime: {
                gte: new Date(`2024-03-${day}T19:00:00Z`),
              },
            },
          },
        },
      }),
    ),
  );
  const applicantsWhoCanOnlyInterviewPerDay = await Promise.all(
    days.flatMap((day) =>
      prismaClient.applicant.findMany({
        where: {
          cantInterviewFinished: true,
          interviewId: null,
          AND: days
            .filter((d) => d !== day)
            .map((day) => ({
              cantInterview: {
                some: {
                  startTime: {
                    lte: new Date(`2024-03-${day}T00:00:00Z`),
                  },
                  endTime: {
                    gte: new Date(`2024-03-${day + 1}T00:00:00Z`),
                  },
                },
              },
            })),
        },
      }),
    ),
  );

  return {
    numberOfApplicants,
    yetToBeAssignedInterview,
    applicantsWhoCanInterviewPerDay,
    applicantsWhoCanOnlyInterviewPerDay,
    applicantsByPosition,
  };
};

export const actions: Actions = {
  seed: async () => {
    await seed();
    return { status: "ok" };
  },
  seedFriends: async () => {
    try {
      await seedFriends();
    } catch (e) {
      console.error(e);
    }
    return { status: "ok" };
  },
};
