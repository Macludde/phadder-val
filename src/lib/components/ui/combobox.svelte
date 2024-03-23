<script lang="ts">
  import Check from "lucide-svelte/icons/check";
  import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
  import * as Command from "./command";
  import * as Popover from "./popover";
  import { Button } from "./button";
  import { cn } from "$lib/utils";
  import { tick } from "svelte";

  export let options: {
    label: string;
    value: string;
  }[] = [];

  export let onChange: () => void | undefined;

  let open = false;
  export let value = "";

  $: selectedValue =
    options.find((f) => f.value === value)?.label ?? "INGET...";

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
</script>

<Popover.Root bind:open let:ids>
  <Popover.Trigger asChild let:builder>
    <Button
      builders={[builder]}
      variant="outline"
      role="combobox"
      aria-expanded={open}
      class="w-[200px] justify-between flex-1"
    >
      {selectedValue}
      <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0 h-52">
    <Command.Root>
      <Command.Input placeholder="Search..." />
      <Command.Empty>Not found.</Command.Empty>
      <Command.Group>
        {#each options as option}
          <Command.Item
            value={option.label}
            onSelect={(currentValue) => {
              value =
                options.find((f) => f.label === currentValue)?.value ?? "";
              closeAndFocusTrigger(ids.trigger);
              onChange();
            }}
          >
            <Check
              class={cn(
                "mr-2 h-4 w-4",
                value !== option.value && "text-transparent",
              )}
            />
            {option.label}
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
