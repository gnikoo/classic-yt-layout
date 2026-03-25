/**
 * YouTube Classic Volume — popup.js
 * Sends toggle messages via background.js (which relays to the content script).
 */

const toggle       = document.getElementById('enableToggle');
const statusDot    = document.getElementById('statusDot');
const statusText   = document.getElementById('statusText');
const reloadNotice = document.getElementById('reloadNotice');
const reloadBtn    = document.getElementById('reloadBtn');

function setStatus(enabled) {
  if (enabled) {
    statusDot.classList.add('active');
    statusText.classList.add('active');
    statusText.textContent = 'Active — volume button is on the left';
  } else {
    statusDot.classList.remove('active');
    statusText.classList.remove('active');
    statusText.textContent = "Disabled — using YouTube's default layout";
  }
}

function isYouTubeWatchTab(tab) {
  return tab && tab.url && tab.url.includes('youtube.com/watch');
}

/* ── Init ── */
browser.storage.local.get({ enabled: true }).then(({ enabled }) => {
  toggle.checked = enabled;
  setStatus(enabled);
});

/* ── Toggle ── */
toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  setStatus(enabled);

  // Persist the setting
  browser.storage.local.set({ enabled });

  // Send message to background, which relays to the content script
  browser.runtime.sendMessage({ type: 'SET_ENABLED', enabled })
    .catch(() => {});

  // Check if we're on a YouTube watch page — if not, show reload hint
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (!isYouTubeWatchTab(tabs[0])) {
      reloadNotice.classList.add('visible');
    }
  });
});

/* ── Reload button ── */
reloadBtn.addEventListener('click', () => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs[0]) {
      browser.tabs.reload(tabs[0].id);
      window.close();
    }
  });
});
