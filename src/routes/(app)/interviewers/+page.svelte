<script lang="ts">
  import { enhance } from "$app/forms";
  import * as Card from "$lib/components/ui/card";
  import Button from "@/components/ui/button/button.svelte";
  import { AppleIcon } from "lucide-svelte";
  import Interview from "./Interview.svelte";

  export let data;

  $: interviewsByDate = data.interviews.reduce(
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

<div class="flex gap-1">
  <section>
    <h2 class="text-3xl font-bold">Intervjuer</h2>
    <ol class="flex flex-col gap-2">
      {#each Object.entries(interviewsByDateTime) as [date, interviewsByTime] (date)}
        <li class="text-2xl font-bold">
          {date.slice(8)}
        </li>
        <li>
          <ol class="flex flex-col gap-4 pl-10">
            {#each Object.values(interviewsByTime) as interviews (interviews[0].id)}
              <li>
                <ol class="flex flex-wrap gap-1">
                  {#each interviews as interview (interview.id)}
                    <li>
                      <Interview {interview} interviewers={data.interviewers} />
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
