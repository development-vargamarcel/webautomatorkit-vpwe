<script>
  import { injectScript } from "./utils/utils";

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
      shouldRerunUntilNoSelectorsFound: true,
      forceStopCondition: `[aria-label="limit reached"]::checkSelectorExists`,
      mainSelectorsAndActions: `Connect::getNodeWithText>getNearestButton>click`,
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
  ////
  const testStrictEquals = (text) => {
    1 === 1;
    return 1 === 1;
  };

  console.log(testStrictEquals, testStrictEquals("ds"));

  ////
  const runSteps = async (steps, config, obstacles) => {
    ////////////////////////////////////////
    const CD = {
      test: "",
      testfn: function () {},
    };
    CD.actions = {
      click: (node) => {
        node.click();
        return node;
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
        console.log("getNode", { selector, node });
        // CD.moveMouseToElement(node);
        return node;
      },
      getNodeWithText: (text) => {
        return Array.from(document.querySelectorAll("*")).find((el) => {
          const elText = el.textContent.trim();
          return elText === text;
        });
      },

      // Function to find the nearest descendant button of a given element
      getNearestButton: (element) => {
        return element.querySelector("button");
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
        if (CD.getPreciseType(nodes) !== "Array") {
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
    CD.getPreciseType = (value) => {
      return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
    };
    CD.wait = (ms) => new Promise((r) => setTimeout(r, ms));
    CD.handleActions = async (step) => {
      const selectorAndActionPairs = CD.getSelectorAndActionPairs(
        step.mainSelectorsAndActions,
      );
      console.log({ selectorAndActionPairs });
      for (const selectorAndActionPair of selectorAndActionPairs) {
        const [selector, actions] = selectorAndActionPair.split("::");
        const actionsToPerform = actions.split(">");
        let previousActionResult;
        let isFirstAction = true;
        for (const action of actionsToPerform) {
          console.log({ previousActionResult, isFirstAction });
          await CD.wait(
            CD.addRelativeError(
              step.waitTimeBeforeEachMainSelectorAndAction,
              config.errorPercentage,
            ),
          );
          const currentActionResult = CD.actions[action](
            isFirstAction ? selector : previousActionResult,
          );
          console.log({ currentActionResult, action });
          previousActionResult = currentActionResult;
          isFirstAction = false;
          await CD.wait(
            CD.addRelativeError(
              step.waitTimeAfterEachMainSelectorAndAction,
              config.errorPercentage,
            ),
          );
        }
      }
    };
    CD.addRelativeError = (milliseconds, errorPercentage = 70) => {
      // Convert the percentage error into a decimal
      const errorDecimal = errorPercentage / 100;

      // Calculate the relative error amount
      const errorAmount = milliseconds * errorDecimal;

      // Generate a random sign (+ or -) to apply the error randomly
      const sign = Math.random() < 0.5 ? -1 : 1;

      // Apply the error amount to the original milliseconds
      const result = milliseconds + sign * errorAmount;

      // Return the final result, rounded to the nearest integer
      return Math.round(result);
    };
    CD.moveMouseToElement = (element) => {
      if (!element) {
        console.log("please provide a valid element");
        return;
      }
      // Helper function to simulate smooth mouse movement
      const moveMouse = (x1, y1, x2, y2, steps, step = 0) => {
        if (step > steps) return;

        // Calculate current position
        const progress = step / steps;
        const currentX = x1 + (x2 - x1) * progress + Math.random() * 10 - 5; // Add some randomness
        const currentY = y1 + (y2 - y1) * progress + Math.random() * 10 - 5;

        // Dispatch mousemove event
        const event = new MouseEvent("mousemove", {
          clientX: currentX,
          clientY: currentY,
          bubbles: true,
        });
        document.dispatchEvent(event);

        // Move to the next step
        setTimeout(() => moveMouse(x1, y1, x2, y2, steps, step + 1), 20);
      };

      // Get the element's position and size
      const rect = element.getBoundingClientRect();
      const startX = window.innerWidth / 2;
      const startY = window.innerHeight / 2;
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;

      // Start the mouse movement
      moveMouse(startX, startY, targetX, targetY, 50);
    };
    CD.getSelectorAndActionPairs = (selectorsAndActions) => {
      return selectorsAndActions.split("\n");
    };
    ////////////////////////////////////////

    console.log("window.CD", CD);
    for (const step of steps) {
      console.log({ step });
      await CD.wait(
        CD.addRelativeError(
          config.waitTimeBeforeEachStep,
          config.errorPercentage,
        ),
      );
      console.log("starting ", { step });
      CD.handleActions(step);
    }
  };
</script>

<button
  on:click={() => {
    console.log("injected");
    injectScript(runSteps, [steps, config, obstacles]);
  }}>inject script</button
>
