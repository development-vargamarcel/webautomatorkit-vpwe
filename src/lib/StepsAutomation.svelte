<script>
  import { injectScript, runSteps } from "./utils/utils";

  const config = {
    errorPercentageMax: 70,
    waitTimeBeforeEachStep: 1000,
    obstaclesToCheckInTheBackgroundWaitTimeBetween: 1000,
  };

  const steps = [
    {
      name: "clickOnConnect",
      waitTimeBeforeEachMainSelectorAndAction: 500,
      waitTimeBetweenMainSelectorsAndActions: 500,
      waitTimeAfterEachMainSelectorAndAction: 500,
      waitTimeAfterRevealingMoreSelectors: 2000,
      actionToRunBeforeMainSelectorsAndActions: ``,
      actionToRunAfterMainSelectorsAndActions: ``,
      repeatStepCondition: `getNodeWithText|Message`,
      shouldRerunUntilNoSelectorsFound: true,
      forceStopCondition: `getNodeWithText|limit reached,`,
      mainSelectorsAndActions: `getNodeWithText|Message>markNodeWithClass|deleteThisOne>getNearestButton>click>getNode|.deleteThisOne>deleteNode`,
      selectorsAndActionsToRevealMoreSelectors: `getNodeWithText|Next>click`,
    },
  ];
  //
  // getNodeWithText|Connect>getNearestScrollableParent>scrollToBottom
  // jumpToBottomOfPage
  // const obstaclesToCheckInTheBackground = [];
  const obstacles = [
    {
      name: "clickOnObstacles",
      waitTimeBeforeEachMainSelectorAndAction: 0,
      waitTimeAfterEachMainSelectorAndAction: 0,
      waitTimeBetweenMainSelectorsAndActions: 0,
      actionToRunBeforeMainSelectorsAndActions: ``,
      actionToRunAfterMainSelectorsAndActions: ``,
      shouldRerunUntilNoSelectorsFound: true,
      mainSelectorsAndActions: `getNode|[aria-label="Dismiss"]>markNodeWithClass|deleteThisOne>click>getNode|.deleteThisOne>deleteNode
getNode|[aria-label="Send now"]>click
getNodeWithText|Send without a note>click
getNode|[aria-label="Got it"]>click
pageReload|.ip-fuse-limit-alert__header.t-20.t-black.ph4`,
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
