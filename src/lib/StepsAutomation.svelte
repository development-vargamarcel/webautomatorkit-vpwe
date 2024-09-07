<script>
  import { addRelativeError } from "./utils/utils";
  import { moveMouseToElement } from "./utils/utils";
  const errorPercentage = 70;
  const steps = [
    {
      name: "clickOnConnect",
      waitTimeBeforeEachMainSelectorAndAction: 1000,
      waitTimeAfterEachMainSelectorAndAction: 1000,
      waitTimeBetweenMainSelectorsAndActions: 1000,
      waitTimeAfterRevealingMoreSelectors: 1000,
      actionToRunBeforeMainSelectorsAndActions: ``,
      actionToRunAfterMainSelectorsAndActions: ``,
      shouldRerunUntilNoSelectorsFound: true,
      forceStopCondition: `[aria-label="limit reached"]::checkSelectorExists`,
      mainSelectorsAndActions: `[aria-label="Connect"]::getNode>click`,
      selectorsAndActionsToRevealMoreSelectors: `[aria-label="Next"]::getNode>click
      [aria-label="Connect"]::getNode>getNearestScrollableParent>scrollToBottom
      jumpToBottomOfPage`,
    },
  ];

  const obstacles = [
    {
      name: "clickOnObstacles",
      waitTimeBeforeEachMainSelectorAndAction: 1000,
      waitTimeAfterEachMainSelectorAndAction: 1000,
      waitTimeBetweenMainSelectorsAndActions: 1000,
      actionToRunBeforeMainSelectorsAndActions: ``,
      actionToRunAfterMainSelectorsAndActions: ``,
      shouldRerunUntilNoSelectorsFound: true,
      mainSelectorsAndActions: `[aria-label="Send now"]::getNode>click,
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
      const node = document.querySelector(selector);
      moveMouseToElement(node);
      return node;
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
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const handleActions = async (step) => {
    const [selector, actions] = step.mainSelectorsAndActions.split("::");
    const actionsToPerform = actions.split(">");
    let previousActionResult;
    let isFirstAction = true;
    for (const action of actionsToPerform) {
      console.log({ previousActionResult, isFirstAction });
      await wait(
        addRelativeError(
          step.waitTimeBeforeEachMainSelectorAndAction,
          errorPercentage,
        ),
      );
      previousActionResult = actions[action](
        isFirstAction ? selector : previousActionResult,
      );
      isFirstAction = false;
      await wait(
        addRelativeError(
          step.waitTimeAfterEachMainSelectorAndAction,
          errorPercentage,
        ),
      );
    }
  };
  const runSteps = (steps) => {
    steps.forEach((step) => {
      handleActions(step);
    });
  };
</script>

<button
  on:click={() => {
    runSteps(steps);
  }}>Run Steps</button
>
