<script lang="ts">
  import Counter from "../lib/Counter.svelte";
  import browser from "webextension-polyfill";
  import StepsAutomation from "../lib/StepsAutomation.svelte";
  import { injectScript } from "../lib/utils/utils";

  const scriptToInject = () => {
    console.log("hello");
  };

  const handleClick = () => {
    injectScript(scriptToInject, []);
  };
</script>

<button on:click={handleClick}>inject</button>
<div>
  <StepsAutomation />
</div>
<div>
  <Counter />
</div>

<style>
</style>
