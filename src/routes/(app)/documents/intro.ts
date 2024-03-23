import { Paragraph, TextRun } from "docx";

export const intro = new Paragraph({
  children: [
    new TextRun({
      text: "Presentera er! Säg vem som frågar och vem som antecknar.",
      break: 1,
    }),
    new TextRun({
      text: "TA KORT!! Fråga om det är okej.",
      break: 1,
    }),
    new TextRun({
      text: `Lägg dem i samma mapp med exakta namn på personen, alltså "Ludvig Svedberg.png" typ.`,
      italics: true,
    }),
    new TextRun({
      text: `Ni kommer få turas om vem som svarar på frågan först, vi kommer att säga vems tur det är.`,
      break: 1,
    }),
    new TextRun({
      text: `Svara på frågorna i den post som du har prioriterat högst, om du har en annan åsikt i en annan roll så får du gärna säga det.`,
      break: 1,
    }),
    new TextRun({
      text: `Om något är oklart eller det något ni inte förstår så är det bara att fråga.`,
      break: 1,
    }),
    new TextRun({
      text: `Själva intervjun får max ta 30 minuter. Vi kommer kanske behöva avbryta ibland på grund av tidsbrist, bara så ni vet om det!`,
      break: 1,
    }),
  ],
});
