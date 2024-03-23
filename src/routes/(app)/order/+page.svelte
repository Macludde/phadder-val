<script lang="ts">
  import { Button } from "@/components/ui/button";
  import { enhance } from "$app/forms";

  export let data;
</script>

<form use:enhance action="?/setSingles" method="POST">
  <Button type="submit">Order singles</Button>
</form>
<ol>
  {#each data.applicants as applicant (applicant.id)}
    <li class="flex gap-4">
      {applicant.name}
      <p>
        {applicant.applicantOrderReason}
      </p>
      <div class="flex flex-col gap-2">
        {#each applicant.ApplicantPosition as position ((position.applicantId, position.position))}
          <form method="post" action="?/setOrder" use:enhance>
            <p>{position.position}</p>
            <input
              type="hidden"
              name="applicantId"
              value={position.applicantId}
            />
            <input type="hidden" name="position" value={position.position} />
            <input
              type="number"
              name="order"
              value={position.order}
              on:input={(event) => {
                event.target.form.submit();
              }}
            />
            <button type="submit">Set order</button>
          </form>
        {/each}
      </div>
    </li>
  {/each}
</ol>
