<script>
  import { injectScript, runSteps } from "./utils/utils";

  const config = {
    errorPercentage: 70,
    waitTimeBeforeEachStep: 1000,
  };

  const steps = [
    {
      name: "clickOnConnect",
      waitTimeBeforeEachMainSelectorAndAction: 1000,
      waitTimeBetweenMainSelectorsAndActions: 1000,
      waitTimeAfterEachMainSelectorAndAction: 1000,
      waitTimeAfterRevealingMoreSelectors: 1000,
      actionToRunBeforeMainSelectorsAndActions: ``,
      actionToRunAfterMainSelectorsAndActions: ``,
      repeatStepCondition: `getNodeWithText|Connect`,
      shouldRerunUntilNoSelectorsFound: true,
      forceStopCondition: `checkSelectorExists|[aria-label="limit reached"]`,
      mainSelectorsAndActions: `getNodeWithText|Connect>markNodeWithClass|deleteThisOne>getNearestButton>click>getNode|.deleteThisOne>deleteNode`,
      selectorsAndActionsToRevealMoreSelectors: `getNode|[aria-label="Next"]>click
      getNode|[aria-label="Connect"]>getNearestScrollableParent>scrollToBottom
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
      mainSelectorsAndActions: `getNode|[aria-label="Send now"]>click,
        getNode|[aria-label="Send without a note"]>click,
        getNode|[aria-label="Got it"]>click,
        pageReload|.ip-fuse-limit-alert__header.t-20.t-black.ph4,
      `,
    },
  ];
  ////
  const testStrictEquals = (text) => {
    1 === 1;
    return 1 === 1;
  };

  console.log(testStrictEquals, testStrictEquals("ds"));

  ////
</script>

<button
  on:click={() => {
    console.log("injected");
    injectScript(runSteps, [steps, config, obstacles]);
  }}>inject script</button
>
