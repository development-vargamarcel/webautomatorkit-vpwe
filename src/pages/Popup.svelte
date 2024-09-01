<script lang="ts">
  import Counter from "../lib/Counter.svelte";
  import browser from "webextension-polyfill";
  import StepsAutomation from "../lib/StepsAutomation.svelte";

  const scriptToInject = () => {
    console.log("hello");
  };

  async function injectScript(func: () => void, args?: any[], target?: any) {
    const tabs = await browser?.tabs.query({
      active: true,
      currentWindow: true,
    });
    const activeTab = tabs[0];
    if (activeTab?.id) {
      console.log({ tabs }, "activeTab?.id", activeTab?.id);
      browser.scripting.executeScript({
        target: target ?? { tabId: activeTab.id },
        args: args,
        func: func,
      });
    }
  }

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
