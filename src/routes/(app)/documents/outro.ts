import { Paragraph, TextRun } from "docx";

export const outro = new Paragraph({
  children: [
    new TextRun({
      text: "EFTER INTERVJUN",
      break: 1,
      bold: true,
      size: 18,
    }),
    new TextRun({
      text: "Vår nominering kommer komma ut 26e mars. Vi kommer meddela alla via mail om de har blivit nominerade eller inte. ",
      break: 1,
    }),
    new TextRun({
      text: `Nomineringen kommer därefter skickas in som handling till nästkommande styrelsemötet. Datum för detta möte är 2:a april. Om man har några åsikter om valet så är alla välkomna dit för att få sin röst hörd. `,
      break: 1,
    }),
  ],
});
