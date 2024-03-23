<script lang="ts">
  import { Button } from "@/components/ui/Button";
  import { enhance } from "$app/forms";

  export let data;
</script>

<ol class="flex flex-col gap-8">
  {#each data.applicants as applicant (applicant.id)}
    <li class="flex gap-4">
      {applicant.name}
      {applicant.cantInterviewFinished ?? "Not finished"}
      <p>
        {applicant.cantInterviewReason}
      </p>
      <div class="flex flex-col gap-2">
        {#each applicant.cantInterview as block (block.id)}
          <form method="post" action="?/setBlock" use:enhance>
            <input type="hidden" name="id" value={block.id} />
            <input
              type="datetime-local"
              name="startTime"
              value={block.startTime.toISOString().slice(0, -5)}
            />
            <input
              type="datetime-local"
              name="endTime"
              value={block.endTime.toISOString().slice(0, -5)}
            />
            <Button type="submit">Update block</Button>
          </form>
        {/each}
        <div class="flex gap-8">
          <form method="post" action="?/setBlock" use:enhance>
            <input type="hidden" name="applicantId" value={applicant.id} />
            <input type="hidden" name="startTime" value="2024-03-18T00:00:00" />
            <input type="hidden" name="endTime" value="2024-03-18T00:00:00" />
            <Button type="submit">Add block</Button>
          </form>
          <form method="post" action="?/finish" use:enhance>
            <input type="hidden" name="id" value={applicant.id} />
            <Button type="submit">Finish</Button>
          </form>
        </div>
      </div>
    </li>
  {/each}
</ol>
