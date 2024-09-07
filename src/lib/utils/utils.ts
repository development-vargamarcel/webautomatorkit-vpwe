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
  CD.wait = (ms) => new Promise((r) => setTimeout(r, ms));
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
        const args = argsString ? argsString.split(' ') : null
        console.log({ args })
        console.log({ previousActionResult, isFirstAction });
        await CD.wait(
          CD.addRelativeError(
            step.waitTimeBeforeEachMainSelectorAndAction,
            config.errorPercentage,
          ),
        );
        let currentActionResult: any
        if (args) {
          currentActionResult = CD.actions[action](...args)
        } else {
          currentActionResult = CD.actions[action](previousActionResult)
        }
        console.log({ currentActionResult, action });
        previousActionOfLastPairResult = currentActionResult
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
    return previousActionOfLastPairResult
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
  CD.handleStep = async (step) => {
    console.log({ step });
    await CD.wait(
      CD.addRelativeError(
        config.waitTimeBeforeEachStep,
        config.errorPercentage,
      ),
    );
    await CD.handleActions(step);

    const shouldRepeatStep = await CD.handleActions(step, step.repeatStepCondition)
    console.log({ shouldRepeatStep })
    if (shouldRepeatStep) {
      await CD.handleStep(step)
    }
  }
  for (const step of steps) {
    await CD.handleStep(step)
  }
};
export const moveMouseToElement = (element) => {
  // Helper function to simulate smooth mouse movement
  const moveMouse = (x1, y1, x2, y2, steps, step = 0) => {
    if (step > steps) return;

    // Calculate current position
    const progress = step / steps;
    const currentX = x1 + (x2 - x1) * progress + Math.random() * 10 - 5; // Add some randomness
    const currentY = y1 + (y2 - y1) * progress + Math.random() * 10 - 5;

    // Dispatch mousemove event
    const event = new MouseEvent('mousemove', {
      clientX: currentX,
      clientY: currentY,
      bubbles: true
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

export function addRelativeError(milliseconds, errorPercentage = 70) {
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
}

const getPreciseType = (value) => {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
};
export const parseAll = (json) => {
  return JSON.parse(json, function (key, value) {
    if (typeof value === "string" &&
      value.startsWith("/Function(") &&
      value.endsWith(")/")) {
      value = value.substring(10, value.length - 2);
      return (0, eval)("(" + value + ")");
    }
    return value;
  });
}
export const stringToJs = (string) => {
  if (getPreciseType(string) !== "string") {
    console.warn(`expectig string but got ${getPreciseType(string)},will use it as is.If object,you do not need this function,maybe this function was run previously.`, { string });
    return string;
  }
  if (string.includes('/Function') && string.includes(')/')) {
    return parseAll(string);
  }
  return new Function(`return ${string}`)();
};

export const objectToSourceCode = (obj) => {
  // Check if the input is an object
  if (typeof obj !== 'object' || obj === null) {
    throw new Error('Input must be an object');
  }

  // Helper function to convert functions to strings
  function functionToString(fn) {
    return fn.toString();
  }

  // Recursively convert the object to source code
  function convertObjectToSourceCode(obj) {
    if (typeof obj === 'function') {
      return functionToString(obj);
    }

    if (Array.isArray(obj)) {
      return '[' + obj.map(convertObjectToSourceCode).join(', ') + ']';
    }

    if (typeof obj === 'object') {
      return (
        '{' +
        Object.entries(obj)
          .map(([key, value]) => {
            if (key.includes('-')) {
              key = `'${key}'`
            }
            return `${key}: ${convertObjectToSourceCode(value)}`
          })
          .join(', ') +
        '}'
      );
    }

    // All other types are converted to string literals
    return JSON.stringify(obj);
  }

  return convertObjectToSourceCode(obj);
}

export const utils = {
  injectScript: injectScript,
  moveMouseToElement: moveMouseToElement,
  addRelativeError: addRelativeError
}
const testStrictEquals = (text) => {
  1 === 1;
  return 1 === 1;
};

console.log(testStrictEquals, testStrictEquals('ds'));