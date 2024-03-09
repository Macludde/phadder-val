import { prismaClient } from "$lib";
import type { Actions } from "./$types";

export const load = async () => {
  const applicantsWithoutBlocks = await prismaClient.applicant.findMany({
    where: {
      cantInterviewReason: {
        not: null,
      },
    },
    include: {
      cantInterview: true,
    },
    orderBy: {
      cantInterviewFinished: "desc",
    },
  });

  return {
    applicants: applicantsWithoutBlocks,
  };
};

export const actions: Actions = {
  setBlock: async ({ request }) => {
    const data = await request.formData();
    const startTime = new Date((data.get("startTime") as string) + "Z");
    const endTime = new Date((data.get("endTime") as string) + "Z");
    if (data.get("id")) {
      await prismaClient.timeRange.update({
        where: {
          id: parseInt(data.get("id") as string),
        },
        data: {
          startTime,
          endTime,
        },
      });
    } else {
      await prismaClient.timeRange.create({
        data: {
          applicantId: parseInt(data.get("applicantId") as string),
          startTime,
          endTime,
        },
      });
    }
  },
  finish: async ({ request }) => {
    const data = await request.formData();
    await prismaClient.applicant.update({
      where: {
        id: parseInt(data.get("id") as string),
      },
      data: {
        cantInterviewFinished: true,
      },
    });
  },
};
