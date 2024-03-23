import { Document, Packer, SectionType } from "docx";
import * as fs from "fs";
import type { InterviewWithRest } from "./types";
import { info } from "./info";
import { intro } from "./intro";
import { sections } from "./data";
import { section } from "./sections";
import { outro } from "./outro";

export const generateDocument = async (
  interview: InterviewWithRest,
  location: string,
) => {
  let applicants = interview.applicants.map((a, i) => ({
    ...a,
    index: i,
  }));
  const doc = new Document({
    styles: {
      default: {
        document: {
          paragraph: {},
          run: {
            font: "Arial",
            size: 16,
          },
        },
      },
    },
    title: `Phadderintervju ${interview.startTime.getDate()}e kl ${interview.startTime.toISOString().slice(11, 16)} i ${interview.location}`,
    sections: [
      {
        properties: {
          type: SectionType.CONTINUOUS,
        },
        children: [info(interview), intro],
      },
      ...sections.map((s) => {
        const validApplicants = applicants.filter(s.requirements);
        const val = {
          properties: {
            type: SectionType.CONTINUOUS,
          },
          children: section(s, validApplicants),
        };
        if (validApplicants.length === 0) return val;
        else if (validApplicants.length === applicants.length) {
          // shift applicants question count % 3 time
          for (let j = 0; j < s.questions.length % applicants.length; j++) {
            applicants.push(applicants.shift()!);
          }
        } else if (validApplicants.length === applicants.length - 1) {
          applicants = [
            ...applicants.filter((a) => !s.requirements(a)),
            ...validApplicants,
          ];
        }
        return val;
      }),
      {
        properties: {
          type: SectionType.CONTINUOUS,
        },
        children: [outro],
      },
    ],
  });

  // Used to export the file into a .docx file
  Packer.toBuffer(doc).then((buffer) => {
    fs.mkdirSync(`documents/${location}`, { recursive: true });
    fs.writeFileSync(`documents/${location}/Frågor.docx`, buffer);
    fs.writeFileSync(`documents/${location}/Antecknare 1.docx`, buffer);
    fs.writeFileSync(`documents/${location}/Antecknare 2.docx`, buffer);
  });
};
