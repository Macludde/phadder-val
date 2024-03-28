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
const seedPerson = async (
  prisma: Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0],
  personRow: string,
) => {
  const values = personRow.split("\t");
  const roles =
    values[5].length > 0
      ? values[5].split(", ").map((role) => rolesToEnum[role])
      : undefined;
  const missions =
    values[7].length > 0
      ? values[7].split(", ").map((mission) => missionsToEnum[mission])
      : [];
  console.log(values.slice(13));
  const friend1Name = values[13] ?? "";
  const friend2Name = values[14] ?? "";
  const friend1 =
    friend1Name.length > 0
      ? await prisma.applicant.findFirst({
          where: {
            name: friend1Name,
          },
        })
      : null;
  const friend2 =
    friend2Name.length > 0
      ? await prisma.applicant.findFirst({
          where: {
            name: friend2Name,
          },
        })
      : null;
  return await prisma.applicant.create({
    data: {
      hasAnsweredExtraForm: true,
      appliedAt: new Date(values[0]),
      name: values[1],
      email: values[2].toLowerCase(),
      phoneNumber: values[3] ? values[3] : null,
      year: parseInt(values[4]),
      applicantOrderReason: values[6] ? values[6] : null,
      cantInterviewReason: values[9] ? values[9] : null,
      otherInfo: values[10] ? values[10] : null,
      friend1: friend1
        ? {
            connect: {
              id: friend1.id,
            },
          }
        : undefined,
      friend2: friend2
        ? {
            connect: {
              id: friend2.id,
            },
          }
        : undefined,
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
  try {
    await prisma.$transaction(async (p) => {
      for (const line of lines) {
        await seedPerson(p, line);
      }
    });
    // clear file
    fs.writeFileSync(path.resolve(__dirname, "./data/new.tsv"), "");
  } catch (e) {
    throw e;
  }
};
const evaluationPostToPosition: Record<string, Position> = {
  Grupp: Position.Group,
  Uppdrag: Position.Mission,
  Huvud: Position.Head,
  Intisgrupp: Position.InternationalGroup,
  Intishuvud: Position.InternationalHead,
  Intisuppdrag: Position.InternationalMission,
  Plugg: Position.Study,
};

const seedEvaluation = async (
  prisma: Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0],
  evaluationRow: string,
) => {
  const values = evaluationRow.split("\t");
  const name = values[0];
  const position = values[1];
  const score = values[2]?.trim() ? parseInt(values[2].trim()) : null;
  const comment = values[3]?.trim() ? values[3].trim() : null;
  const flags = values[4]?.trim() ? values[4].trim() : null;
  const wantOtherMissions = values[5]?.trim() ? values[5].trim() : null;
  const year = values[6]?.trim() ? parseInt(values[6].trim()) : null;
  const programme = values[7]?.trim() ? values[7].trim() : null;
  const applicant = await prisma.applicant.findFirst({
    where: {
      name: {
        contains: name,
      },
    },
  });
  if (!applicant) {
    throw new Error(`Could not find applicant with name ${name}`);
  }
  console.log(name, position);
  await prisma.applicant.update({
    where: {
      id: applicant.id,
    },
    data: {
      ApplicantPosition: {
        update: {
          where: {
            position_applicantId: {
              applicantId: applicant.id,
              position: evaluationPostToPosition[position],
            },
          },
          data: {
            score,
            comment,
            flags,
            canTakeOtherMissions: wantOtherMissions,
          },
        },
      },
      ...(programme
        ? {
            programme,
          }
        : {}),
    },
  });
};

const seedEvaluations = async (prisma: PrismaClient) => {
  const file = fs.readFileSync(
    path.resolve(__dirname, "./data/evaluations.tsv"),
  );

  const tsv = file.toString();
  const lines = tsv.split("\n");
  try {
    await prisma.$transaction(async (p) => {
      for (const line of lines) {
        await seedEvaluation(p, line);
      }
    });
  } catch (e) {
    throw e;
  }
};

export async function seed() {
  // await seedNewInterviews(prismaClient);
  await seedEvaluations(prismaClient);
  // await seedInterviewer(prismaClient);
  //   await seedPeople(prismaClient);
}
