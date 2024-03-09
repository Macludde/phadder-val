import { prismaClient } from "$lib";
import type { Actions } from "./$types";

export const load = async () => {
  const interviewers = await prismaClient.interviewer.findMany({
    include: {
      cantInterview: true,
    },
  });
  return {
    interviewers,
  };
};

export const actions: Actions = {
  addCantInterview: async ({ request }) => {
    const data = await request.formData();
    const interviewerName = data.get("interviewerName") as string;
    const startTime = new Date((data.get("startTime") as string) + "Z");
    const endTime = new Date((data.get("endTime") as string) + "Z");
    await prismaClient.interviewer.update({
      where: {
        name: interviewerName,
      },
      data: {
        cantInterview: {
          create: {
            startTime,
            endTime,
          },
        },
      },
    });
  },
  updateCantInterview: async ({ request }) => {
    const data = await request.formData();
    const id = Number.parseInt(data.get("id") as string);
    const startTime = new Date((data.get("startTime") as string) + "Z");
    const endTime = new Date((data.get("endTime") as string) + "Z");
    await prismaClient.timeRange.update({
      where: {
        id,
      },
      data: {
        startTime,
        endTime,
      },
    });
  },
  removeCantInterview: async ({ request }) => {
    const data = await request.formData();
    const id = Number.parseInt(data.get("id") as string);
    await prismaClient.timeRange.delete({
      where: {
        id,
      },
    });
  },
};
