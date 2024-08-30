<script lang="ts">
  console.log("Hello from the popup!");
  let count = 0;

  function increment() {
    count += 1;
  }
</script>

<button on:click={increment}>
  clicks: {count}
</button>
<div>
  <img src="/icon-with-shadow.svg" alt="" />
  <h1>vite-plugin-web-extension</h1>
  <p>
    Template: <code>svelte-ts</code>
  </p>
</div>

<style>
</style>
