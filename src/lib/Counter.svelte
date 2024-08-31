<script>
  class Counter {
    count = $state(0);

    increment() {
      this.count++;
    }
  }

  const counter = new Counter();
</script>

svelte 5 counter
<button onclick={() => counter.increment()}>
  clicks: {counter.count}
</button>
