<script lang="ts">
  import { enhance } from "$app/forms";
  import * as Card from "$lib/components/ui/card";
  import Button from "@/components/ui/button/button.svelte";

  export let data;
  let startTime = "2024-03-18T10:00";
  $: endTime = (() => {
    let time = new Date(startTime + ":00Z");
    time = new Date(time.getTime() + 45 * 60 * 1000); // add 45 mmin

    return time.toISOString().slice(0, -5);
  })();
  let onlySameDay = false;
  let edit = false;
  $: interviewsByDate = data.interviews
    .filter(
      (i) =>
        !onlySameDay ||
        i.startTime.toISOString().slice(0, 10) === startTime.slice(0, 10),
    )
    .reduce(
      (acc, interview) => {
        const key = interview.startTime.toISOString().slice(0, 10);
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(interview);
        return acc;
      },
      {} as Record<string, typeof data.interviews>,
    );
  $: interviewsByDateTime = Object.entries(interviewsByDate).reduce(
    (acc, [day, interviews]) => {
      if (!acc[day]) {
        acc[day] = {};
      }
      acc[day] = interviews.reduce(
        (acc, interview) => {
          const key = interview.startTime.toISOString().slice(11, 16);
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(interview);
          return acc;
        },
        {} as Record<string, typeof data.interviews>,
      );
      return acc;
    },
    {} as Record<string, Record<string, typeof data.interviews>>,
  );
</script>

<p>Redigera?</p>
<input type="checkbox" bind:checked={edit} />

{#if edit}
  <p>
    Totalt: {data.interviews.length}. Antal som kan intervjus: {data.interviews
      .length * 3}
  </p>
  <p>Visa samma dag</p>
  <input type="checkbox" bind:checked={onlySameDay} />

  <div class="my-10">
    <form
      action="?/addInterview"
      method="POST"
      use:enhance={() => {
        return async ({ update }) => {
          update({ reset: false });
        };
      }}
      class="flex gap-2 items-end"
    >
      <div class="flex flex-col gap-1">
        <label for="amount">Antal</label>
        <input type="number" name="amount" placeholder="Antal intervjuer" />
      </div>
      <div class="flex flex-col gap-1">
        <label for="startTime">Start</label>
        <input type="datetime-local" name="startTime" bind:value={startTime} />
      </div>
      <div class="flex flex-col gap-1">
        <label for="endTime">Slut</label>
        <input type="datetime-local" name="endTime" value={endTime} />
      </div>
      <Button type="submit">Skapa</Button>
    </form>
  </div>
{:else}
  <section class="my-10 flex flex-col gap-2">
    <p>{data.applicantsWithoutInterview.length} utan intervju</p>
    {#if data.applicantsWithoutInterview.length < 20}
      {data.applicantsWithoutInterview.map((a) => a.name).join(", ")}
    {/if}
    <p>
      {data.applicantsWithoutInterviewUnfinished.length} utan intervju som inte är
      markerade klara
    </p>
    <form method="POST" action="?/populate" use:enhance>
      <Button type="submit">Populera</Button>
    </form>
    <form method="POST" action="?/clear" use:enhance>
      <Button type="submit">Clear</Button>
    </form>
  </section>
{/if}

<div class="flex gap-1">
  <section>
    <h2 class="text-3xl font-bold">Intervjuer</h2>
    <ol class="flex flex-col gap-2">
      {#each Object.entries(interviewsByDateTime) as [date, interviewsByTime] (date)}
        <li class="text-2xl font-bold">
          {date.slice(8)} ({Object.values(interviewsByTime).flatMap((i) => i)
            .length * 3}, {Object.values(interviewsByTime)
            .flatMap((i) => i)
            .flatMap((i) => i.applicants).length})
        </li>
        <li>
          <ol class="flex flex-col gap-1 pl-10">
            {#each Object.values(interviewsByTime) as interviews (interviews[0].id)}
              <li>
                <ol class="flex flex-wrap gap-1">
                  {#each interviews as interview (interview.id)}
                    <li>
                      <Card.Root>
                        <Card.Header>
                          <Card.Title>
                            {interview.startTime.toISOString().slice(11, 16)}
                            <!-- - {interview.endTime.toISOString().slice(11, 16)} -->
                          </Card.Title>
                        </Card.Header>
                        <Card.Content class="flex flex-col gap-4">
                          <ol>
                            {#each interview.applicants as applicant (applicant.id)}
                              <li class="flex flex-col">
                                <span>
                                  {applicant.name} ({applicant.year})
                                </span>
                                <span class="opacity-50">
                                  {applicant.ApplicantPosition.map(
                                    (position) => position.position,
                                  ).join(", ")}
                                </span>
                              </li>
                            {/each}
                          </ol>
                          <form
                            action="?/removeInterview"
                            use:enhance
                            method="POST"
                          >
                            <input
                              type="hidden"
                              name="id"
                              value={interview.id}
                            />
                            <Button type="submit">Ta bort</Button>
                          </form>
                        </Card.Content>
                      </Card.Root>
                    </li>
                  {/each}
                </ol>
              </li>
            {/each}
          </ol>
        </li>
      {/each}
    </ol>
  </section>
</div>
