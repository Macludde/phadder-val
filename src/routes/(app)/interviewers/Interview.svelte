<script lang="ts">
  import { enhance } from "$app/forms";
  import * as Card from "$lib/components/ui/card";
  import Button from "@/components/ui/button/button.svelte";
  import { AppleIcon } from "lucide-svelte";

  import type { Interview, Interviewer } from "@prisma/client";
  import Combobox from "@/components/ui/combobox.svelte";

  export let interview: Interview & {
    interviewers: Interviewer[];
  };
  export let interviewers: Interviewer[];

  $: options = interviewers.map((i) => ({
    label: i.name,
    value: i.name,
  }));

  let interviewerName = "";

  let form: HTMLFormElement;
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>
      {interview.startTime.toISOString().slice(11, 16)}
    </Card.Title>
    <Card.Description>
      {interview.location}
    </Card.Description>
  </Card.Header>
  <Card.Content class="flex flex-col gap-4">
    <ol>
      {#each interview.interviewers as interviewer}
        <li>{interviewer.name}</li>
      {/each}
    </ol>

    <form
      bind:this={form}
      action="?/assignToInterviewer"
      method="post"
      use:enhance
      class="flex flex-row gap-1"
    >
      <input type="hidden" name="interviewId" value={interview.id} />
      <Combobox
        {options}
        bind:value={interviewerName}
        onChange={() => {
          setTimeout(() => {
            form.requestSubmit();
          }, 100);
        }}
      />
      <input type="hidden" name="interviewerName" value={interviewerName} />
      <Button type="submit">Accept</Button>
    </form>
  </Card.Content>
</Card.Root>
