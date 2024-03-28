<script lang="ts">
  import {
    Position,
    type Applicant,
    type ApplicantPosition,
  } from "@prisma/client";
  import { onMount } from "svelte";

  export let applicant: Applicant & {
    ApplicantPosition: ApplicantPosition;
    friend1?: Applicant | null;
    friend2?: Applicant | null;
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
  // $: imageUrl = `public/people/${applicant.name.trim()}.jpg`;
  $: imageUrl = `public/people/${applicant.name.trim()}.webp`;
  let doesImageExist = true;

  // check if image exists
  onMount(async () => {
    try {
      const response = await fetch(imageUrl);
      // doesImageExist = response.ok;
    } catch (error) {
      console.error(error);
    }
  });
</script>

{#if doesImageExist}
  <div
    class="w-[calc(33.33333333%-2.6666666667px)] aspect-[1/1.414] overflow-hidden flex flex-col text-black"
  >
    <div class="relative flex-1">
      <div
        class="absolute inset-0 person-image w-full h-full bg-blue-500"
        style={`background-image: url("${imageUrl}")`}
      />

      <h1 class="absolute bg-white px-1 py-0.5 rounded-md top-1 left-1">
        {applicant.name.trim()}
      </h1>
      <h2 class="absolute bg-white px-1 py-0.5 rounded-md top-7 left-1">
        {applicant.programme ?? "?"}{applicant.year}
      </h2>

      <h4
        class="absolute bg-white px-1 py-0.5 rounded-md text-lg font-bold top-1 right-1"
      >
        {applicant.ApplicantPosition.score}
      </h4>
      <h3 class="absolute bg-white px-1 py-0.5 rounded-md top-7 right-1">
        {positionName[applicant.ApplicantPosition.position]}
        <span
          >({applicant.ApplicantPosition.order}{(applicant.ApplicantPosition
            .order ?? 0) <= 2
            ? "a"
            : "e"} prio)</span
        >
      </h3>

      {#if applicant.friend1 || applicant.friend2}
        <div class="absolute bottom-1 left-1 flex flex-col items-start text-sm">
          <span class="bg-white px-1 py-[1px] rounded-md">Önskar:</span>
          {#if applicant.friend1}
            <p class="bg-white px-1 py-[1px] rounded-md -mt-1">
              {applicant.friend1.name}
            </p>
          {/if}
          {#if applicant.friend2}
            <p class="bg-white px-1 py-[1px] rounded-md -mt-1">
              {applicant.friend2.name}
            </p>
          {/if}
        </div>
      {/if}
    </div>
    <div class="p-2 text-black bg-white flex text-sm">
      <div>
        <span>
          Kommentar:
          {applicant.ApplicantPosition.comment ?? "Ingen kommentar"}
        </span>
        {#if applicant.ApplicantPosition.flags}
          <span class="text-red-400 font-semibold">
            Flaggor:
            {applicant.ApplicantPosition.flags}
          </span>
        {/if}
        {#if applicant.ApplicantPosition.position === Position.Mission}
          <br />
          <span>
            Önskade uppdrag: {applicant.preferredMissions.join(", ")}. Kan ta
            andra: {applicant.ApplicantPosition.canTakeOtherMissions}
          </span>
        {/if}
      </div>
    </div>
  </div>

  <style>
    .person-image {
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }
  </style>
{/if}
