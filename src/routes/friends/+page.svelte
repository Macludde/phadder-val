<script lang="ts">
  import Button from "@/components/ui/button/button.svelte";
  import Combobox from "@/components/ui/combobox.svelte";
  import ApplicantRow from "./ApplicantRow.svelte";

  export let data;

  $: applicantOptions = data.applicants.map((applicant) => ({
    label: applicant.name,
    value: applicant.id.toString(),
  }));
</script>

<ol class="flex flex-col gap-2 items-stretch">
  {#each data.applicants as applicant (applicant.id)}
    <li>
      <ApplicantRow {applicant} {applicantOptions} />
    </li>
  {/each}
</ol>
