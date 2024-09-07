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