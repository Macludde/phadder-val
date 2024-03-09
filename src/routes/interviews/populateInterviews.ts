import { prismaClient } from "@/index";
import { similarityWithAll, type ApplicantWithPositions } from "./similarity";

export const populateOneInterview = async (startAt?: Date) => {
  const freeInterview = await prismaClient.interview.findFirst({
    where: {
      startTime: startAt
        ? {
            gt: startAt || new Date(),
          }
        : undefined,
      applicants: {
        none: {},
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });
  if (!freeInterview) {
    return false;
  }
  const picked: ApplicantWithPositions[] = [];
  const findBestFreePerson = async () => {
    const possibleApplicants = await prismaClient.applicant.findMany({
      where: {
        interviewId: null,
        OR: [{ cantInterviewReason: null }, { cantInterviewFinished: true }],
        cantInterview: {
          every: {
            OR: [
              {
                endTime: {
                  lt: freeInterview?.startTime,
                },
              },
              {
                startTime: {
                  gt: freeInterview?.endTime,
                },
              },
            ],
          },
        },
        id: {
          notIn: picked.map((p) => p.id),
        },
      },
      orderBy: {
        ApplicantPosition: {
          _count: "desc",
        },
      },
      include: {
        ApplicantPosition: true,
      },
    });
    let best = null;
    let bestScore = -1;
    for (const applicant of possibleApplicants) {
      const score = similarityWithAll(applicant, picked);
      if (score > bestScore) {
        bestScore = score;
        best = applicant;
      }
    }
    if (!best) {
      return null;
    } else if (bestScore < -100) {
      return null;
    }
    return best;
  };
  let next = await findBestFreePerson();
  if (!next) {
    const remainingApplicants = await prismaClient.applicant.count({
      where: {
        interviewId: null,
        OR: [{ cantInterviewReason: null }, { cantInterviewFinished: true }],
        id: {
          notIn: picked.map((p) => p.id),
        },
      },
    });
    if (remainingApplicants === 0) return false;
    return freeInterview.startTime;
  }
  picked.push(next);
  for (let i = 0; i < 2; i++) {
    next = await findBestFreePerson();
    if (!next) break;
    picked.push(next);
  }
  await prismaClient.applicant.updateMany({
    where: {
      id: {
        in: picked.map((p) => p.id),
      },
    },
    data: {
      interviewId: freeInterview?.id,
    },
  });
  return true;
};
