<script lang="ts">
  import { enhance } from "$app/forms";
  import * as Card from "$lib/components/ui/card";

  let defaultTime = "2024-03-18T09:00:00";
  let showOnlyToday = false;

  export let data;
</script>

<p>Default time</p>
<input type="datetime-local" bind:value={defaultTime} class="mb-8" />
<p>Show only today</p>
<input type="checkbox" bind:checked={showOnlyToday} class="mb-8" />

<ol class="flex flex-col gap-2">
  {#each data.interviewers as interviewer (interviewer.name)}
    <li>
      <Card.Root>
        <Card.Header>
          <Card.Title>
            {interviewer.name}
          </Card.Title>
        </Card.Header>
        <Card.Content class="flex flex-col gap-4">
          {#each interviewer.cantInterview as block (block.id)}
            {#if !showOnlyToday || block.startTime.getDate() === new Date(defaultTime).getDate()}
              <section class="flex gap-4">
                <form
                  use:enhance={() => {
                    return async ({ update }) => {
                      update({ reset: false });
                    };
                  }}
                  action="?/updateCantInterview"
                  method="post"
                >
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
                  <button type="submit">Update</button>
                </form>
                <form use:enhance action="?/removeCantInterview" method="post">
                  <input type="hidden" name="id" value={block.id} />
                  <button type="submit">Remove block</button>
                </form>
              </section>
            {/if}
          {/each}
          <form
            use:enhance={() => {
              return async ({ update }) => {
                update({ reset: false });
              };
            }}
            action="?/addCantInterview"
            method="post"
          >
            <input
              type="hidden"
              name="interviewerName"
              value={interviewer.name}
            />
            <input type="datetime-local" name="startTime" value={defaultTime} />
            <input type="datetime-local" name="endTime" value={defaultTime} />
            <button type="submit">Add block</button>
          </form>
        </Card.Content>
      </Card.Root>
    </li>
  {/each}
</ol>
