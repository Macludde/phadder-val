<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "@/components/ui/button/button.svelte";
  import Combobox from "@/components/ui/combobox.svelte";
  import type { Applicant } from "@prisma/client";

  export let applicant: Applicant;
  export let applicantOptions: any;

  let friend1: string = applicant.friend1Id?.toString();
  let friend2: string = applicant.friend2Id?.toString();
</script>

<section>
  <h1>{applicant.name}</h1>
  <form
    action="?/addFriends"
    method="post"
    use:enhance
    class="flex flex-row gap-1"
  >
    <input type="hidden" name="id" value={applicant.id} />
    <Combobox options={applicantOptions} bind:value={friend1} />
    <input type="hidden" name="friend1" value={Number.parseInt(friend1)} />
    <Combobox options={applicantOptions} bind:value={friend2} />
    <input type="hidden" name="friend2" value={Number.parseInt(friend2)} />
    <Button type="submit">Accept</Button>
  </form>
</section>
