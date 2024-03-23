<script lang="ts">
  import { enhance } from "$app/forms";

  export let data;
</script>

{#each data.mails as mail}
  {@const link = `mailto:${mail.mailto}?subject=${mail.subject}&body=${encodeURIComponent(mail.body)}`}
  <div class="my-4">
    <form action="?/hide" method="post" use:enhance>
      <input type="hidden" name="id" value={mail.applicantId} />
      <a
        href={link}
        on:click={(e) => {
          // submit form
          e.currentTarget.closest("form")?.requestSubmit();
        }}>{link}</a
      >
    </form>
  </div>
{/each}
