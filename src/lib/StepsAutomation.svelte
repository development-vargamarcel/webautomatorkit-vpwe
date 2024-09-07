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
      forceStopCondition: `[aria-label="limit reached"]::checkSelectorExists`,
      selectorsAndActions: `[aria-label="Connect"]::getNode>click`,
      selectorsAndActionsToRevealMoreSelectors: `[aria-label="Next"]::getNode>click
      [aria-label="Connect"]::getNode>getNearestScrollableParent>scrollToBottom
      jumpToBottomOfPage`,
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
      selectorsAndActions: `[aria-label="Send now"]::getNode>click,
        [aria-label="Send without a note"]::getNode>click,
        [aria-label="Got it"]::getNode>click,
        .ip-fuse-limit-alert__header.t-20.t-black.ph4::pageReload,
      `,
    },
  ];

  const actions = {
    click: (node) => {
      node.click();
    },
    pageReload: () => {
      location.reload();
    },
    jumpToBottomOfPage: () => {
      window.scrollTo(0, document.body.scrollHeight);
    },
    checkSelectorExists: (selector) => {
      return document.querySelector(selector) !== null;
    },
    getNode: (selector) => {
      return document.querySelector(selector);
    },
    getNearestScrollableParent: (node) => {
      if (node == null) {
        return null;
      }

      if (node.scrollHeight > node.clientHeight) {
        return node;
      } else {
        return this.getNearestScrollableParent(node.parentNode);
      }
    },
    scrollToBottom: (nodes) => {
      if (getPreciseType(nodes) !== "Array") {
        nodes = [nodes];
      }

      nodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          node.scrollTop = node.scrollHeight;
        } else {
          console.warn("One of the items is not a valid HTML element:", node);
        }
      });
    },
  };
  const getPreciseType = (value) => {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
  };
  const handleActions = (actionsAndSelectors) => {
    const [selector, actions] = actionsAndSelectors.split("::");
    const actionsToPerform = actions.split(">");
    let previousActionResult;
    let isFirstAction = true;
    actionsToPerform.forEach((selector, action) => {
      previousActionResult = actions[action](
        isFirstAction ? selector : previousActionResult,
      );
      isFirstAction = false;
    });
  };
</script>

<button
  on:click={() => {
    runSteps(steps);
  }}>Run Steps</button
>
