<script lang="ts">
  import Counter from "../lib/Counter.svelte";
  import browser from "webextension-polyfill";

  async function executeScriptInActiveTab() {
    const tabs = await browser?.tabs.query({
      active: true,
      currentWindow: true,
    });
    const activeTab = tabs[0];
    if (activeTab?.id) {
      console.log({ tabs }, "activeTab?.id", activeTab?.id);

      const res = await browser.tabs.executeScript(activeTab.id, {
        code: `console.log('hello');`,
      });

      console.log({ res });
    }
  }

  // Call the function
  // executeScriptInActiveTab();
</script>

<button on:click={executeScriptInActiveTab}>inject</button>
<div>
  <img src="/icon-with-shadow.svg" alt="" />
  <h1>vite-plugin-web-extension</h1>
  <p>
    Template: <code>svelte-ts</code>
  </p>
</div>
<div>
  <Counter />
</div>

<style>
</style>
