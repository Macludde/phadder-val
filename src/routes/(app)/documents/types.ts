import {
  Position,
  type Applicant,
  type ApplicantPosition,
  type Interview,
  type Interviewer,
} from "@prisma/client";
import * as fs from "fs";
import { Document, Paragraph, TextRun, Packer, SectionType } from "docx";

export type InterviewWithRest = Interview & {
  applicants: (Applicant & {
    ApplicantPosition: ApplicantPosition[];
    index: number;
  })[];
  interviewers: Interviewer[];
};

export type Question = {
  text: string;
  requirements?: string[];
};
export type Section = {
  title: string;
  questions: Question[];
  requirements: (applicant: InterviewWithRest["applicants"][number]) => boolean;
};
