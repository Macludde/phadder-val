import { Paragraph, TextRun } from "docx";
import type { InterviewWithRest } from "./types";

export const info = (interview: InterviewWithRest) =>
  new Paragraph({
    children: [
      new TextRun({
        text: "Info",
        size: 24,
        bold: true,
        break: 1,
      }),
      new TextRun({
        text: "Folk som ska bli intervjuade.",
        break: 1,
      }),
      ...interview.applicants.flatMap((a) => [
        new TextRun({
          text: `${a.name} ${a.phoneNumber ?? "Inget telefonnummer"}`,
          break: 2,
        }),
        new TextRun({
          text: a.ApplicantPosition.map((p) => p.position).join(", "),
          break: 1,
          italics: true,
          // color: "#eeeeee",
        }),
      ]),
      new TextRun({
        text: "Tid: ",
        bold: true,
        break: 2,
      }),
      new TextRun({
        text: `${interview.startTime.getDate()}e kl ${interview.startTime.toISOString().slice(11, 16)}`,
      }),
      new TextRun({
        text: "Plats: ",
        bold: true,
        break: 1,
      }),
      new TextRun({
        text: interview.location ?? "Okänd plats",
      }),
    ],
  });
