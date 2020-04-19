chrome.webNavigation.onHistoryStateUpdated.addListener((e) => {
  chrome.tabs.sendMessage(e.tabId, { action: "pageChange" });
});
