import { prismaClient } from "@/index.js";
import { generateDocument } from "./generate.js";
import type { InterviewWithRest } from "./types.js";

const weekdays = [
  "Söndag",
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lördag",
];
export const actions = {
  generate: async () => {
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
    for (let interview of interviews) {
      generateDocument(
        interview as InterviewWithRest,
        `${weekdays[interview.startTime.getDay()]}/${interview.location} kl ${interview.startTime.toISOString().slice(11, 16).replace(":", " ")}`,
      );
    }
  },
};
