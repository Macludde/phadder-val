import { prismaClient } from "$lib";
import type { Actions } from "./$types";
import { populateOneInterview, populateOnePerson } from "./populateInterviews";

export const load = async () => {
  const interviews = await prismaClient.interview.findMany({
    include: {
      applicants: {
        include: {
          ApplicantPosition: true,
        },
      },
      interviewers: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });
  const applicantsWithoutInterview = await prismaClient.applicant.findMany({
    where: {
      interview: null,
      OR: [{ cantInterviewReason: null }, { cantInterviewFinished: true }],
    },
  });
  const applicantsWithoutInterviewUnfinished =
    await prismaClient.applicant.findMany({
      where: {
        interview: null,
        AND: [
          {
            cantInterviewReason: {
              not: null,
            },
          },
          { cantInterviewFinished: null },
        ],
      },
    });
  return {
    interviews,
    interviewers: await prismaClient.interviewer.findMany(),
    applicantsWithoutInterview,
    applicantsWithoutInterviewUnfinished,
  };
};

export const actions: Actions = {
  addInterview: async ({ request }) => {
    const data = await request.formData();
    const startTime = new Date((data.get("startTime") as string) + "Z");
    const endTime = new Date((data.get("endTime") as string) + "Z");
    console.log(startTime);
    const amount = parseInt(data.get("amount") as string);
    await prismaClient.interview.createMany({
      data: Array(amount).fill({
        startTime,
        endTime,
      }),
    });
  },
  removeInterview: async ({ request }) => {
    const data = await request.formData();
    await prismaClient.interview.delete({
      where: {
        id: parseInt(data.get("id") as string),
      },
    });
  },
  clear: async () => {
    await prismaClient.applicant.updateMany({
      where: {
        interviewLocked: false,
      },
      data: {
        interviewId: null,
      },
    });
  },
  removePersonFromInterview: async ({ request }) => {
    const data = await request.formData();
    await prismaClient.$transaction(async (prisma) => {
      const interview = await prisma.interview.findFirst({
        where: {
          applicants: {
            some: {
              id: parseInt(data.get("id") as string),
            },
          },
        },
      });
      if (!interview) {
        throw new Error("Interview not found");
      }
      await prisma.applicant.update({
        where: {
          id: parseInt(data.get("id") as string),
        },
        data: {
          cantInterview: {
            create: {
              isTemp: true,
              startTime: interview.startTime,
              endTime: interview.endTime,
            },
          },
        },
      });
      await prisma.applicant.update({
        where: {
          id: parseInt(data.get("id") as string),
        },
        data: {
          interviewId: null,
        },
      });
    });
  },
  populate: async () => {
    let done = false;
    let startAt = new Date();
    while (!done) {
      const res = await populateOneInterview(startAt);
      if (typeof res === "boolean") {
        if (res === false) {
          done = true;
          break;
        }
      } else {
        startAt = res;
      }
    }
  },
  populatePeople: async () => {
    let done = false;
    let banned: number[] = [];
    while (!done) {
      const res = await populateOnePerson(banned);
      if (typeof res === "boolean") {
        if (res === false) {
          done = true;
          break;
        }
      } else {
        banned.push(res);
      }
    }
  },
};
