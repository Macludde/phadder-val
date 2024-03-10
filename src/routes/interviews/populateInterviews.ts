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
                  lt: freeInterview?.startTime, // could be lte, but give people margin to go to interview
                },
              },
              {
                startTime: {
                  gt: freeInterview?.endTime, // could be gte
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
    } else if (bestScore < -1000) {
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

export const populateOnePerson = async (bannedApplicants?: number[]) => {
  const applicant = await prismaClient.applicant.findFirst({
    where: {
      id: bannedApplicants
        ? {
            notIn: bannedApplicants,
          }
        : undefined,
      interviewId: null,
      OR: [{ cantInterviewReason: null }, { cantInterviewFinished: true }],
    },
    include: {
      ApplicantPosition: true,
      cantInterview: true,
    },
  });
  if (!applicant) {
    return false;
  }
  const possibleInterviews = await prismaClient.interview.findMany({
    where: {
      AND: applicant.cantInterview.map((cant) => ({
        OR: [
          {
            endTime: {
              lt: cant.startTime, // gte should work, but might as well give people some leeway
            },
          },
          {
            startTime: {
              gt: cant.endTime, // gte should work, but might as well give people some leeway
            },
          },
        ],
      })),
    },
    include: {
      applicants: {
        include: {
          ApplicantPosition: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });
  const freeIntervies = possibleInterviews.filter(
    (interview) => interview.applicants.length < 3,
  );
  if (freeIntervies.length === 0) {
    return applicant.id; // couldn't find a free interview, do manually and ban applicant for now
  }
  let best = null;
  let bestScore = -1;
  for (const interview of freeIntervies) {
    const score = similarityWithAll(applicant, interview.applicants);
    if (score > bestScore) {
      bestScore = score;
      best = interview;
    }
  }
  if (!best) {
    return applicant.id;
  } else if (bestScore < -100) {
    return applicant.id;
  }
  await prismaClient.applicant.update({
    where: {
      id: applicant.id,
    },
    data: {
      interviewId: best.id,
    },
  });
  return true;
};
