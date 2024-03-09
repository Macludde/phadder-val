import {
  Position,
  type Applicant,
  type ApplicantPosition,
} from "@prisma/client";

export type ApplicantWithPositions = Applicant & {
  ApplicantPosition: ApplicantPosition[];
};

const includesGroupQuestions = (pos: Position[]) =>
  pos.includes(Position.Group) || pos.includes(Position.InternationalGroup);

const includesMissionQuestions = (pos: Position[]) =>
  pos.includes(Position.Mission) || pos.includes(Position.InternationalMission);

const includesInternationalQuestions = (pos: Position[]) =>
  pos.includes(Position.InternationalGroup) ||
  pos.includes(Position.InternationalHead) ||
  pos.includes(Position.InternationalMission);

export const similarity = (
  a: ApplicantWithPositions,
  b: ApplicantWithPositions,
): number => {
  let score = 0;
  // age similarity (-10000 -> 100)
  if (a.year === b.year) {
    score += 100;
  } else if (
    (a.year === 22 && b.year === 21) ||
    (a.year === 21 && b.year === 22)
  ) {
    score += 100;
  } else if (a.year <= 20 && b.year <= 20) {
    score += 100;
  } else {
    score -= 10000; // should not match at all
  }

  // position similarity (-30 -> 26)
  let positionScore = 0;
  const aPos = a.ApplicantPosition.map((p) => p.position);
  const bPos = b.ApplicantPosition.map((p) => p.position);
  if (includesGroupQuestions(aPos) && includesGroupQuestions(bPos))
    positionScore += 10;
  if (includesMissionQuestions(aPos) && includesMissionQuestions(bPos))
    positionScore += 12;
  if (
    includesInternationalQuestions(aPos) &&
    includesInternationalQuestions(bPos)
  )
    positionScore -= 30;
  if (aPos.includes(Position.Study) && bPos.includes(Position.Study)) {
    if (aPos.length === 1 && bPos.length === 1)
      return 100000; // only study
    else if (aPos.length === 1 || bPos.length === 1)
      return -10000; // should not match at all
    else positionScore += 4;
  }
  score += positionScore;
  return score;
};

export const similarityWithAll = (
  a: ApplicantWithPositions,
  b: ApplicantWithPositions[],
) => {
  // sum of all similarities
  return b.reduce((acc, val) => acc + similarity(a, val), 0);
};
