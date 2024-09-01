import browser from "webextension-polyfill";

console.log("Hello from the background!");

browser.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed:", details);
});
browser?.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
  const activeTab = tabs[0];
  if (activeTab?.id) {
    console.log({ tabs }, "activeTab?.id", activeTab?.id);
    console.log("aa", browser.tabs.dsds);
    browser.tabs
      .executeScript(activeTab.id, {
        code: `console.log('hello');`,
      })
      .then((res) => {
        console.log({ res });
      });
  }
});