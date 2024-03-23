import { Paragraph, TextRun } from "docx";
import type { InterviewWithRest, Question, Section } from "./types";

const question = (
  { text, requirements }: Question,
  people: InterviewWithRest["applicants"],
) =>
  new Paragraph({
    children: [
      new TextRun({
        text,
        break: 1,
      }),
      ...(requirements
        ? [
            new TextRun({
              text: requirements.join(", "),
              break: 1,
              italics: true,
            }),
          ]
        : []),
      ...people
        .map((p) => p.name)
        .map(
          (name) =>
            new TextRun({
              text: `        ${name}`,
              break: 1,
            }),
        ),
      // new TextRun({
      //   text: `\t${people.map((p) => p.name).join("\n\t")}`,
      //   break: 1,

      // }),
    ],
  });

export const section = (
  { title, questions }: Section,
  applicants: InterviewWithRest["applicants"],
) =>
  applicants.length > 0
    ? [
        new Paragraph({
          children: [
            new TextRun({
              text: title,
              size: 24,
              bold: true,
              break: 2,
            }),
          ],
        }),
        ...questions.map((q, i) => {
          const res = question({ ...q }, applicants);
          applicants.push(applicants.shift()!);
          return res;
        }),
      ]
    : [];
