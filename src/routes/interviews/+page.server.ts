import { prismaClient } from "$lib";
import type { Actions } from "./$types";
import { populateOneInterview } from "./populateInterviews";

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
      data: {
        interviewId: null,
      },
    });
  },
  populate: async () => {
    let done = false;
    let startAt = undefined;
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
};
