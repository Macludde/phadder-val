import { prismaClient } from "$lib";

type Mail = {
  applicantId: number;
  time: Date;
  location: string | undefined;
  mailto: string;
  name: string;
  subject: string;
  body: string;
};
const readableTime = (time: Date) => {
  return `${time.toISOString().slice(11, 16)}`;
};

const weekdays = [
  "söndagen",
  "måndagen",
  "tisdagen",
  "onsdagen",
  "torsdagen",
  "fredagen",
  "lördagen",
];

export const load = async () => {
  const interviews = await prismaClient.interview.findMany({
    include: {
      applicants: {
        where: {
          hasSentInterviewMail: false,
        },
      },
      interviewers: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });
  let mails: Mail[] = [];
  for (let interview of interviews) {
    const base = {
      subject: "Din phadderintervju",
      time: interview.startTime,
      location: interview.location ?? undefined,
      // location: "Utskott",
      body: "",
    };

    mails = [
      ...mails,
      ...interview.applicants.map((applicant) => ({
        ...base,
        applicantId: applicant.id,
        mailto: applicant.email,
        name: applicant.name,
      })),
    ];
  }
  mails = mails.map((mail) => ({
    ...mail,
    body: `Hej ${mail.name.trim()}!

Nu har vi spikat tid för din intervju. Den kommer att äga rum ${weekdays[mail.time.getDay()]} ${mail.time.getDate()}e mars kl ${readableTime(mail.time)} i ${
      mail.location === "Utskott"
        ? "Utskott. Det ligger på andra våningen, i högra mittenkorridoren (nära Alfa-Beta-Gamma rummen). Vi kommer lägga upp en video hur man hittar dit på vårt instagram @staben2024"
        : mail.location
    }. Vi ser fram emot att träffa dig!

Vi har lagt denna tiden utanför den/dem tider du skrev i din ansökan att du inte kunde. Om du nu vet att du ABSOLUT inte kan denna tid, svara på detta mail så ska vi se om det går att byta. Men först och främst hade vi uppskattat om du kunde flytta det som krockar då vi försöker sammanställa ett stort antal intervjuer.

Intervjun kommer vara ca 30 minuter lång och ni kommer vara tre personer på varje intervju. Försök gärna vara där någon minut eller två innan för vi har ett tajt schema, och intervjun kommer att börja ${readableTime(mail.time)} (..).

Mvh,
Phaddervalberedningen
      `,
  }));
  return {
    mails,
  };
};

export const actions = {
  hide: async ({ request }) => {
    const data = await request.formData();
    const id = Number.parseInt(data.get("id") as string);
    const applicant = await prismaClient.applicant.findUnique({
      where: {
        id,
      },
    });
    console.log("Sending mail to: ", applicant?.name, id);
    await prismaClient.applicant.update({
      where: {
        id,
      },
      data: {
        interviewLocked: true,
        hasSentInterviewMail: true,
      },
    });
  },
};
