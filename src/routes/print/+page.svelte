<script lang="ts">
  import Applicant from "./Applicant.svelte";

  export let data;
  $: applicants = data.applicants;
</script>

<main class="flex flex-wrap bg-slate-700">
  {#each applicants as applicant}
    <Applicant {applicant} />
  {/each}
</main>
