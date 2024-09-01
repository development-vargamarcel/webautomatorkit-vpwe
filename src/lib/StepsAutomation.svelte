<script>
  const steps = [
    {
      name: "clickOnConnect",
      waitTimeBeforeClick: 1000,
      waitTimeAfterClick: 1000,
      waitTimeBetweenClicks: 1000,
      waitTimeAfterrevealingMoreSelectors: 1000,
      actionToRunBeforeClick: ``,
      actionToRunAfterClick: ``,
      shouldRerunUntilNoSelectorsFound: true,
      forceStopCondition: `[aria-label="limit reached"]::check:exists`,
      selectorsAndActions: ['[aria-label="Connect"]::click'],
      revealMoreSelectorsMethod: `[aria-label="Next"]::click/jump:bottomOfPage`,
    },
  ];

  const obstacles = [
    {
      name: "clickOnObstacles",
      waitTimeBeforeClick: 1000,
      waitTimeAfterClick: 1000,
      waitTimeBetweenClicks: 1000,
      actionToRunBeforeClick: ``,
      actionToRunAfterClick: ``,
      shouldRerunUntilNoSelectorsFound: true,
      selectorsAndActions: [
        '[aria-label="Send now"]::click',
        '[aria-label="Send without a note"]::click',
        '[aria-label="Got it"]::click',
        ".ip-fuse-limit-alert__header.t-20.t-black.ph4::reload",
      ],
    },
  ];
  const runSteps = (steps, obstacles) => {};
</script>

<button
  on:click={() => {
    runSteps(steps);
  }}>Run Steps</button
>
