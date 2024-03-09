import { prismaClient } from "@/index";
import type { Interviewer } from "@prisma/client";

const days = [18, 19, 20, 21, 22, 23] as const;
const interviewTimes = [
  ["09:00", "09:45"],
  ["09:15", "10:00"],
  ["09:30", "10:15"],
  ["09:45", "10:30"],
  ["10:00", "10:45"],
  ["10:15", "11:00"],
  ["10:30", "11:15"],
  ["10:45", "11:30"],
  ["11:00", "11:45"],
  ["11:15", "12:00"],
  ["11:30", "12:15"],
  // lunch
  ["13:00", "13:45"],
  ["13:15", "14:00"],
  ["13:30", "14:15"],
  ["13:45", "14:30"],
  ["14:00", "14:45"],
  ["14:15", "15:00"],
  ["14:30", "15:15"],
  ["14:45", "15:30"],
  ["15:00", "15:45"],
  ["15:15", "16:00"],
  ["15:30", "16:15"],
  ["15:45", "16:30"],
  ["16:00", "16:45"],
  ["16:15", "17:00"],
] as const;

const possibleInterviewTimes = async () => {
  const possibleInterviews = await Promise.all(
    days.flatMap((day) =>
      interviewTimes.map(async ([startTime, endTime]) => {
        const start = new Date(`2024-03-${day}T${startTime}:00Z`);
        const end = new Date(`2024-03-${day}T${endTime}:00Z`);
        const availableInterviewers = await prismaClient.interviewer.findMany({
          include: {
            cantInterview: true,
          },
          where: {
            cantInterview: {
              every: {
                OR: [
                  {
                    AND: [
                      // Interview ends before new interview starts
                      {
                        startTime: {
                          lt: start,
                        },
                      },
                      {
                        endTime: {
                          lt: start,
                        },
                      },
                    ],
                  },
                  {
                    AND: [
                      // Interview starts after new interview ends
                      {
                        startTime: {
                          gt: end,
                        },
                      },
                      {
                        endTime: {
                          gt: end,
                        },
                      },
                    ],
                  },
                ],
              },
            },
          },
        });
        return {
          start: new Date(`2024-03-${day}T${startTime}:00`),
          end: new Date(`2024-03-${day}T${endTime}:00`),
          availableInterviewers,
          maxConcurrently: Math.min(
            Math.floor(availableInterviewers.length / 3),
            availableInterviewers.filter((i) => i.role !== "Pepp").length,
          ),
        };
      }),
    ),
  );
  return possibleInterviews;
};

export const calcInterviewTimes = async () => {
  const possibleInterviews = await possibleInterviewTimes();
  return possibleInterviews;
};
