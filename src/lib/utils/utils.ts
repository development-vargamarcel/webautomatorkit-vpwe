import browser from "webextension-polyfill";

export async function injectScript(func: () => void, args?: any[], target?: any) {
  const tabs = await browser?.tabs.query({
    active: true,
    currentWindow: true,
  });
  const activeTab = tabs[0];
  if (activeTab?.id) {
    console.log({ tabs }, "activeTab?.id", activeTab?.id);
    browser.scripting.executeScript({
      target: target ?? { tabId: activeTab.id },
      args: args,
      func: func,
    });
  }
}
export const runSteps = async (steps, config, obstacles) => {

  ////////////////////////////////////////
  const CD: any = {
    test: "",
    testfn: function () { },
  };
  CD.actions = {
    markNodeWithClass: (className, node) => {
      console.log({
        node,
        className
      })
      if (node && typeof className === 'string') {
        node.classList.add(className);
      } else {
        console.warn('Invalid node or class name');
      }
      return node
    },
    deleteNode: (node) => {
      console.log({ node })
      if (node && node.parentNode) {
        node.parentNode.removeChild(node);
      }
      return node
    },
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
      if (!text) {
        console.warn('not valid text value')
        return
      }
      return Array.from(document.querySelectorAll("*")).find((el) => {
        if (!el) {
          console.warn('no element found')
          return
        }
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
  CD.wait = (ms) => new Promise((r) => {
    console.log(`waiting for ${ms} ms`)
    return setTimeout(r, ms)
  });
  CD.addRelativeError = (milliseconds, errorPercentageMax = 70) => {
    function getRandomNumber(min, max) {
      return Math.random() * (max - min) + min;
    }
    const errorPercentage = getRandomNumber(0, errorPercentageMax)
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
  CD.handleActions = async (step, actionsToHandle) => {
    const selectorAndActionPairs = CD.getSelectorAndActionPairs(
      actionsToHandle || step.mainSelectorsAndActions,
    );
    let previousActionOfLastPairResult;

    console.log({ selectorAndActionPairs });
    for (const selectorAndActionPair of selectorAndActionPairs) {
      const actionsToPerform = selectorAndActionPair.split(">");
      let previousActionResult;
      let isFirstAction = true;
      for (const actionAndArgs of actionsToPerform) {
        const [action, argsString] = actionAndArgs.split('|')
        const args = argsString ? argsString.split(',') : []
        console.log({ args })
        console.log({ previousActionResult, isFirstAction });
        await CD.wait(
          CD.addRelativeError(
            step.waitTimeBeforeEachMainSelectorAndAction,
            config.errorPercentageMax,
          ),
        );

        let currentActionResult: any = CD.actions[action](...args, previousActionResult)

        console.log({ currentActionResult, action });
        previousActionOfLastPairResult = currentActionResult
        previousActionResult = currentActionResult;
        isFirstAction = false;
        await CD.wait(
          CD.addRelativeError(
            step.waitTimeAfterEachMainSelectorAndAction,
            config.errorPercentageMax,
          ),
        );
      }
    }
    console.info({ previousActionOfLastPairResult })
    return previousActionOfLastPairResult
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
  ///// delete this
  function printMessage() {
    setInterval(() => {
      if (CD.getPreciseType(window.counter) == 'undefined') {
        window.counter = 0
      } else {
        window.counter = window.counter + 1
      }
      console.info("Printing every 500 milliseconds", window?.counter);
    }, 500); // 500 milliseconds interval
  }
  CD.waitUntil = async (conditionFunction, timeout = 300, maxRetries = 10) => {
    let retries = 0;

    // Use a while loop to continuously check the condition
    while (!conditionFunction()) {
      if (retries >= maxRetries) {
        throw new Error("Condition not met within the allowed retries.");
      }
      retries++;

      // Wait for the specified timeout before checking again
      await new Promise((resolve) => setTimeout(resolve, timeout));
    }
  }
  // Run the function in a separate context
  // printMessage();
  //////
  ////////////////////////////////////////

  console.log("window.CD", CD);
  CD.handleStep = async (step) => {
    console.log({ step });
    await CD.wait(
      CD.addRelativeError(
        config.waitTimeBeforeEachStep,
        config.errorPercentageMax,
      ),
    );
    await CD.handleActions(step);

    let shouldRepeatStep = await CD.handleActions(step, step.repeatStepCondition)
    console.log('shouldRepeatStep 1', { shouldRepeatStep })
    if (shouldRepeatStep) {
      await CD.handleStep(step)
    } else {
      console.log('should not repeat')
      const selectorsAndActionsToRevealMoreSelectorsRESULT = await CD.handleActions(step, step.selectorsAndActionsToRevealMoreSelectors)
      console.log('qwert', selectorsAndActionsToRevealMoreSelectorsRESULT)

      await CD.wait(
        CD.addRelativeError(
          step.waitTimeAfterRevealingMoreSelectors,
          config.errorPercentageMax,
        ),
      );
      console.log('waited')

      //await CD.waitUntil(() => {
      // return CD.handleActions(step, step.repeatStepCondition)
      // })
      // console.log('waitUntil finished', CD.handleActions(step, step.repeatStepCondition))

      shouldRepeatStep = await CD.handleActions(step, step.repeatStepCondition)
      console.log('shouldRepeatStep 2', { shouldRepeatStep })
      if (shouldRepeatStep) {
        await CD.handleStep(step)
      }
    }
  }
  for (const step of steps) {
    await CD.handleStep(step)
  }


};
