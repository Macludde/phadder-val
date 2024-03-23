<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "@/components/ui/button/button.svelte";
</script>

<form method="post" action="?/generate" use:enhance>
  <Button type="submit">Generera</Button>
</form>
