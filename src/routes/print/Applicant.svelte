<script lang="ts">
  import {
    Position,
    type Applicant,
    type ApplicantPosition,
  } from "@prisma/client";

  export let applicant: Applicant & {
    ApplicantPosition: ApplicantPosition;
  };

  const positionName = {
    [Position.Group]: "Grupp",
    [Position.Head]: "Huvud",
    [Position.Mission]: "Uppdrag",
    [Position.InternationalGroup]: "IntisGrupp",
    [Position.InternationalHead]: "IntisHuvud",
    [Position.InternationalMission]: "IntisUppdrag",
    [Position.Study]: "Plugg",
  };
</script>

<div class="w-1/2 aspect-[1.414/1] relative bg-blue-500">
  <!-- <img
    src="/people/{applicant.name.trim()}.jpg"
    alt={applicant.name}
    class="absolute inset-0"
  /> -->
  <h1 class="absolute bottom-0 left-0">{applicant.name.trim()}</h1>
  <!-- <h1 class="absolute">{applicant.programme}{applicant.year}</h2> -->
  <h2 class="absolute bottom-0 right-0">D{applicant.year}</h2>
  <h3 class="absolute top-0 left-0">
    {positionName[applicant.ApplicantPosition.position]}
    <span>({applicant.ApplicantPosition.order})</span>
  </h3>
  <!-- <h4 class="absolute">{applicant.ApplicantPosition.score}</h4> -->
  <h4 class="absolute top-0 right-0">{4}</h4>
</div>
