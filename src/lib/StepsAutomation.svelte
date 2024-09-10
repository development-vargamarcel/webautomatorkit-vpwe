<script>
  import { injectScript, runSteps } from "./utils/utils";

  const config = {
    errorPercentage: 70,
    waitTimeBeforeEachStep: 1000,
    obstaclesToCheckInTheBackgroundwaitTimeBetween: 200,
  };

  const steps = [
    {
      name: "clickOnConnect",
      waitTimeBeforeEachMainSelectorAndAction: 2000,
      waitTimeBetweenMainSelectorsAndActions: 2000,
      waitTimeAfterEachMainSelectorAndAction: 2000,
      waitTimeAfterRevealingMoreSelectors: 5000,
      actionToRunBeforeMainSelectorsAndActions: ``,
      actionToRunAfterMainSelectorsAndActions: ``,
      repeatStepCondition: `getNodeWithText|Connect`,
      shouldRerunUntilNoSelectorsFound: true,
      forceStopCondition: `getNodeWithText|limit reached,`,
      mainSelectorsAndActions: `getNodeWithText|Connect>markNodeWithClass|deleteThisOne>getNearestButton>click>getNode|.deleteThisOne>deleteNode`,
      selectorsAndActionsToRevealMoreSelectors: `getNodeWithText|Next>click`,
    },
  ];
  //
  // getNodeWithText|Connect>getNearestScrollableParent>scrollToBottom
  // jumpToBottomOfPage
  const obstaclesToCheckInTheBackground = [];
  const obstacles = [
    {
      name: "clickOnObstacles",
      waitTimeBeforeEachMainSelectorAndAction: 500,
      waitTimeAfterEachMainSelectorAndAction: 500,
      waitTimeBetweenMainSelectorsAndActions: 500,
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
