<script lang="ts">
  import Applicant from "./Applicant.svelte";

  export let data;
  $: applicants = data.applicants;
</script>

<!-- gap-y-[0.243162rem] this worked with no margins -->
<main class="bg-white flex flex-wrap gap-x-1 gap-y-2">
  {#each applicants as applicant, i}
    <Applicant {applicant} />
  {/each}
</main>

<style>
</style>
