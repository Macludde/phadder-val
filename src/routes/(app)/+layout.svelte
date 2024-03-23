<script>
  import "../app.css";
</script>

<main class="container py-10">
  <nav class="mb-10 flex gap-4">
    <a href="/" class="underline hover:no-underline">Hem</a>
    <a href="/interviewers" class="underline hover:no-underline">Intervjuare</a>
    <a href="/interviews" class="underline hover:no-underline">Intervjuer</a>
    <a href="/order" class="underline hover:no-underline">Order</a>
    <a href="/cantinterview" class="underline hover:no-underline">Kan inte</a>
    <a href="/mails" class="underline hover:no-underline">Mail</a>
    <a href="/interviewmails" class="underline hover:no-underline"
      >Intervju mail</a
    >
    <a href="/friends" class="underline hover:no-underline">Vänner</a>
    <a href="/documents" class="underline hover:no-underline">Dokument</a>
  </nav>
  <slot />
</main>
