<script>
  let count = 0;

  function increment() {
    count += 1;
  }
</script>

test
<button on:click={increment}>
  clicks: {count}
</button>
