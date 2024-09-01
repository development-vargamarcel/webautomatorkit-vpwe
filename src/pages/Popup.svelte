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
      browser.scripting.executeScript({
        target: { tabId: activeTab.id },
        args: [],
        func: () => {
          console.log("hello");
        },
      });
    }
  }
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
