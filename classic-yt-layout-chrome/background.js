/**
 * YouTube Classic Volume — background.js (MV3 service worker)
 * Relays SET_ENABLED messages from popup to active tab.
 */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'SET_ENABLED') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab && tab.url && tab.url.includes('youtube.com')) {
        chrome.tabs.sendMessage(tab.id, msg, () => {
          chrome.runtime.lastError; // suppress error
        });
      }
    });
  }
});
