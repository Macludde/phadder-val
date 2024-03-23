import {
  Position,
  type Applicant,
  type ApplicantPosition,
  type Interview,
  type Interviewer,
} from "@prisma/client";
import * as fs from "fs";
import { Document, Paragraph, TextRun, Packer, SectionType } from "docx";
import type { Section } from "./types";

export const sections: Section[] = [
  {
    title: "Allmänna frågor",
    questions: [
      { text: "Vad heter du, och vilken klass går du i?" },
      { text: "Varför söker du phadder?" },
      { text: "Vad har du för tidigare engagemang?" },
      {
        text: "Kommer du göra något annat utöver plugg under nollningen? Isåfall, hur skulle du kombinera det med phadderrollen?",
      },
      {
        text: "Vad har du för styrkor i en grupp och vilka egenskaper hos andra skulle komplettera dig?",
        requirements: ["Självinsikt"],
      },
    ],
    requirements: () => true,
  },
  {
    title: "Alla förutom Plugg",
    questions: [
      {
        text: "Vad är din bild av en phadders roll?",
        requirements: ["Förståelse för postens innebörd", "alla"],
      },
      {
        text: "Hur mycket tid tror du att phadderrollen kommer ta?",
        requirements: ["Förståelse för postens innebörd"],
      },
      {
        text: "När tycker du att det är okej för en phadder att åka hem under en dag på nollningen?",
        requirements: ["Förståelse för postens innebörd", "Ansvarstagande"],
      },
      {
        text: "Flera av era nollor slutar dyka upp på nollningen och gruppen påverkas av detta. Vad skulle du göra i den situationen?",
        requirements: [
          "Kommunikationsförmåga",
          "Ansvarstagande",
          "Respektfull och omtänksam",
          "Samarbetsvillig",
        ],
      },
      {
        text: "När anser du det är rimligt att ha en nykter phadder närvarande och varför?",
        requirements: [
          "Förståelse för postens innebörd",
          "Ansvarstagande",
          "Samarbetsvillig",
        ],
      },
      {
        text: "Hur tänker du kring sammanhållningen mellan er phaddrar i phaddergruppen?",
        requirements: ["Passion", "Samarbetsvillig", "Kommunikationsförmåga"],
      },
    ],
    requirements: (a) =>
      a.ApplicantPosition.length >= 2 ||
      (a.ApplicantPosition.length > 0 &&
        a.ApplicantPosition[0].position !== Position.Study),
  },
  {
    title: "CASE",
    questions: [
      {
        text: "Du är på ett nollningsevent. Några av dina medphaddrar har dykt upp mindre och mindre på grund av otagg och trötthet. Även idag har de sagt att de inte kommer dyka upp. Vad skulle du göra i den situationen?",
        requirements: [
          "Kommunikationsförmåga",
          "Ansvarstagande",
          "Samarbetsvillig",
          "Respektfull och omtänksam",
        ],
      },
      {
        text: "Du har en medphadder som är väldigt engagerad och taggad, men som på varje sittning och fest blir väldigt full. Du märker att nollorna blir obekväma. Vad skulle du göra i den situationen?",
        requirements: [
          "Kommunikationsförmåga",
          "Ansvarstagande",
          "Samarbetsvillig",
          "Respektfull och omtänksam",
        ],
      },
      {
        text: "Du märker att en n0lla på de senaste evenemangen börjat stå mer för sig själv och inte verkar vara en del av gruppen. Vad gör du i den situationen?",
        requirements: ["Respektfull och omtänksam", "Ansvarstagande"],
      },
    ],
    requirements: (a) =>
      a.ApplicantPosition.length >= 2 ||
      (a.ApplicantPosition.length > 0 &&
        a.ApplicantPosition[0].position !== Position.Study),
  },
  {
    title: "Uppdrag",
    questions: [
      {
        text: "Ni har ju fyllt i de uppdragen ni skulle kunna tänka er. Om ni inte skulle få plats i något av de uppdragen, vill du då inte vara uppdragsphadder alls eller vill du bli placerad i ett annat uppdrag?",
      },
      {
        text: "Era uppdragsnollor är otaggade och uppdraget riskerar att inte bli klart i tid. Vad gör du?",
        requirements: [
          "Passion",
          "Kommunikationsförmåga",
          "Samarbetsvillig",
          "Ansvarstagande",
          "Respektfull och omtänksam",
        ],
      },
      {
        text: "Era nollor är taggade men du märker att det är svårt för alla att delta i uppdraget, och även komma till tals i gruppen. Vad skulle du göra i den situationen?",
        requirements: [
          "Kommunikationsförmåga",
          "Ansvarstagande",
          "Passion för nollorna",
        ],
      },
    ],
    requirements: (a) =>
      a.ApplicantPosition.some(
        (p) =>
          p.position === Position.Mission ||
          p.position === Position.InternationalMission,
      ),
  },
  {
    title: "Internationell",
    questions: [
      {
        text: "Vad tycker du skiljer en internationell-phadder från en vanlig phadder i ansvar och uppgifter?",
        requirements: [
          "Förståelse för postens innebörd",
          "Ansvarstagande",
          "Passion",
        ],
      },
    ],
    requirements: (a) =>
      a.ApplicantPosition.some(
        (p) =>
          p.position === Position.InternationalGroup ||
          p.position === Position.InternationalHead ||
          p.position === Position.InternationalMission,
      ),
  },
  {
    title: "Pluggphadder",
    questions: [
      {
        text: "Vilka egenskaper har du som du anser är fördelaktiga som pluggphadder?",
        requirements: ["Självinsikt", "Förståelse för postens innebörd"],
      },
      {
        text: "Hur anser du att en pluggphadder bör agera under en studiekväll?",
        requirements: ["Förståelse för postens innebörd", "Ansvarstagande"],
      },
    ],
    requirements: (a) =>
      a.ApplicantPosition.some((p) => p.position === Position.Study),
  },
  {
    title: "Avslutande frågor (ställ till alla)",
    questions: [
      { text: "Vad kan just du bidra med som phadder?" },
      {
        text: "Är det något utöver frågorna du vill tillägga? Ditt svar här kommer inte gå in i din bedömning.",
      },
    ],
    requirements: () => true,
  },
];
