<script lang="ts">
  export let data;
  $: (() => {
    const previous = new Set();

    data.nonMission.forEach((a) => {
      if (previous.has(a.email) || previous.has(a.name)) {
        console.error("Duplicate found:", a.name, a.email);
      }
      previous.add(a.name);
      previous.add(a.email);
    });
    data.missionNonSpex.forEach((a) => {
      if (previous.has(a.email) || previous.has(a.name)) {
        console.error("Duplicate found:", a.name, a.email);
      }
      previous.add(a.name);
      previous.add(a.email);
    });
    data.missionAndSpex.forEach((a) => {
      if (previous.has(a.email) || previous.has(a.name)) {
        console.error("Duplicate found:", a.name, a.email);
      }
      previous.add(a.name);
      previous.add(a.email);
    });
  })();
</script>

<p>
  {data.fullCount} totalt<br />
  {data.nonMission.length} utan uppdrag<br />
  {data.missionCount} bl.a uppdrag<br />
  {data.missionNonSpex.length} uppdrag utan spex<br />
  {data.missionAndSpex.length} uppdrag med spex<br />
</p>

<p class="mt-10">Utan uppdrag</p>
{data.nonMission.map((a) => a.email).join(", ")}
<p class="mt-10">Med uppdrag utan spex</p>
{data.missionNonSpex.map((a) => a.email).join(", ")}
<p class="mt-10">Uppdrag och spex</p>
{data.missionAndSpex.map((a) => a.email).join(", ")}
