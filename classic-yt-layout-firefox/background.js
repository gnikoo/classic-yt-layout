/**
 * YouTube Classic Volume — background.js
 *
 * Relays SET_ENABLED messages from popup.js to the active YouTube tab's
 * content script. In MV2, popups cannot send messages directly to content
 * scripts via tabs.sendMessage without a background page acting as a bridge.
 */

browser.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'SET_ENABLED') {
    // Find the active YouTube tab and forward the message
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const tab = tabs[0];
      if (tab && tab.url && tab.url.includes('youtube.com')) {
        browser.tabs.sendMessage(tab.id, msg).catch(() => {
          // Tab may not have the content script yet — ignore
        });
      }
    });
  }
});
