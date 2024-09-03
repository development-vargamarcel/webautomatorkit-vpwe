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