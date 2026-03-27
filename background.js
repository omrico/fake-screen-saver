chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'activate') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('screensaver.html')
    }, (tab) => {
      sendResponse({ success: true });
    });
    return true;
  }
});
