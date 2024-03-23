import { prismaClient } from "$lib";
import type { Actions } from "./$types";

export const load = async () => {
  const interviewers = await prismaClient.interviewer.findMany({});
  const interviews = await prismaClient.interview.findMany({
    include: {
      interviewers: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });
  return {
    interviewers,
    interviews,
  };
};

export const actions: Actions = {
  assignToInterviewer: async ({ request }) => {
    const data = await request.formData();
    const interviewerName = data.get("interviewerName") as string;
    const interviewId = Number.parseInt(data.get("interviewId") as string);
    await prismaClient.interview.update({
      where: {
        id: interviewId,
      },
      data: {
        interviewers: {
          connect: {
            name: interviewerName,
          },
        },
      },
    });
  },
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
