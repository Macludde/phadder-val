import { prismaClient } from "$lib";
import {
  Position,
  Mission,
  InterviewerRole,
  PrismaClient,
} from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rolesToEnum: Record<string, Position> = {
  Grupphadder: Position.Group,
  Uppdragsphadder: Position.Mission,
  Huvudphadder: Position.Head,
  Intisgrupphadder: Position.InternationalGroup,
  Intishuvudphadder: Position.InternationalHead,
  Intisuppdragsphadder: Position.InternationalMission,
  Pluggphadder: Position.Study,
};
const missionsToEnum: Record<string, Mission> = {
  Regatta: Mission.Regatta,
  Lådbil: Mission.Ladbil,
  Cheer: Mission.Cheer,
  Waterloo: Mission.Waterloo,
  Ballongistapult: Mission.Ballongistapult,
  Øverphøshinderbanan: Mission.Oph,
  FlyING: Mission.Flying,
  Nollespex: Mission.Nollespex,
  Showdown: Mission.Showdown,
  "Något nytt uppdrag": Mission.New,
};
const seedPerson = (prisma: PrismaClient, personRow: string) => {
  const values = personRow.split("\t");
  const roles =
    values[5].length > 0
      ? values[5].split(", ").map((role) => rolesToEnum[role])
      : undefined;
  const missions =
    values[7].length > 0
      ? values[7].split(", ").map((mission) => missionsToEnum[mission])
      : [];
  return prisma.applicant.create({
    data: {
      appliedAt: new Date(values[0]),
      name: values[1],
      email: values[2].toLowerCase(),
      phoneNumber: values[3] ? values[3] : null,
      year: parseInt(values[4]),
      applicantOrderReason: values[6] ? values[6] : null,
      cantInterviewReason: values[9] ? values[9] : null,
      otherInfo: values[10] ? values[10] : null,
      ApplicantPosition: roles
        ? {
            createMany: {
              data: roles.map((role) => ({
                position: role,
              })),
            },
          }
        : undefined,
      preferredMissions: missions,
    },
  });
};

const seedPeople = async (prisma: PrismaClient) => {
  return;
  const file = fs.readFileSync(path.resolve(__dirname, "./data/responses.tsv"));

  const tsv = file.toString();
  const lines = tsv.split("\n");
  // await prisma.applicantPosition.deleteMany({});
  // await prisma.applicant.deleteMany({});
  for (const line of lines.slice(1)) {
    await seedPerson(prisma, line);
  }
};

const seedNewInterviews = async (prisma: PrismaClient) => {
  const file = fs.readFileSync(path.resolve(__dirname, "./data/new.tsv"));

  const tsv = file.toString();
  const lines = tsv.split("\n");
  for (const line of lines) {
    await seedPerson(prisma, line);
  }
  // clear file
  fs.writeFileSync(path.resolve(__dirname, "./data/new.tsv"), "");
};

const seedInterviewer = async (prisma: PrismaClient) => {
  return;
  await prisma.interviewer.createMany({
    data: [
      {
        name: "Ludvig",
        role: InterviewerRole.Stab,
        electionFamiliarity: 3,
      },
      {
        name: "Moa",
        role: InterviewerRole.Stab,
        electionFamiliarity: 3,
      },
      {
        name: "Märta",
        role: InterviewerRole.Stab,
        electionFamiliarity: 3,
      },
      {
        name: "Rilde",
        role: InterviewerRole.Stab,
        electionFamiliarity: 3,
      },
      {
        name: "Loke",
        role: InterviewerRole.Stab,
        electionFamiliarity: 3,
      },
      {
        name: "Rasmus",
        role: InterviewerRole.Stab,
        electionFamiliarity: 3,
      },
      {
        name: "Thyra",
        role: InterviewerRole.Opepp,
        electionFamiliarity: 2,
      },
      {
        name: "Sasha",
        role: InterviewerRole.Opepp,
        electionFamiliarity: 2,
      },
      {
        name: "Klara",
        role: InterviewerRole.Pepp,
        electionFamiliarity: 2,
      },
      {
        name: "Gusch",
        role: InterviewerRole.Pepp,
        electionFamiliarity: 2,
      },
      {
        name: "Linn",
        role: InterviewerRole.Pepp,
        electionFamiliarity: 1,
      },
      {
        name: "Lola",
        role: InterviewerRole.Pepp,
        electionFamiliarity: 1,
      },
      {
        name: "Axel",
        role: InterviewerRole.Pepp,
        electionFamiliarity: 1,
      },
      {
        name: "Casper",
        role: InterviewerRole.Pepp,
        electionFamiliarity: 1,
      },
      {
        name: "Emil",
        role: InterviewerRole.Pepp,
        electionFamiliarity: 3,
      },
      {
        name: "Jakob",
        role: InterviewerRole.Pepp,
        electionFamiliarity: 1,
      },
      {
        name: "Wilma",
        role: InterviewerRole.Pepp,
        electionFamiliarity: 1,
      },
    ],
  });
};

const seedInterviewTimes = async (prisma: PrismaClient) => {};

export async function seed() {
  await seedNewInterviews(prismaClient);
  // await seedInterviewer(prismaClient);
  //   await seedPeople(prismaClient);
}
