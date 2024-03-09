<script lang="ts">
  import { Button } from "@/components/ui/button";

  export let data;
</script>

<div class="flex flex-col gap-4">
  <section>
    <h1 class="text-3xl">Phadderval</h1>

    <p>
      {data.numberOfApplicants} applicants
      {data.yetToBeAssignedInterview} yet to be assigned interview
    </p>
  </section>

  <section>
    <h2 class="text-xl">Per position</h2>
    {#each data.applicantsByPosition as position}
      <p>
        {position.position}: {position._count.applicantId} pers
      </p>
    {/each}
  </section>

  <section>
    <h2 class="text-xl">Kan hela dagen</h2>
    {#each data.applicantsWhoCanInterviewPerDay as count, day}
      <p>
        {18 + day}: {count} pers
      </p>
    {/each}
  </section>

  <section>
    <h2 class="text-xl">Kan bara</h2>
    {#each data.applicantsWhoCanOnlyInterviewPerDay as applicants, day}
      <p>
        {18 + day}: {applicants.length} pers:
        {#each applicants as applicant}
          {applicant.name}{", "}
        {/each}
      </p>
    {/each}
  </section>

  <form action="?/seed" method="post">
    <Button type="submit">Seed data</Button>
  </form>
</div>
