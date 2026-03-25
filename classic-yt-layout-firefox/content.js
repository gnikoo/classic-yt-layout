/**
 * YouTube Classic Volume — content.js v3.0.0 (Firefox)
 * Lean rewrite: patch once, minimal observation.
 */
(function () {
  'use strict';

  var patched = false;
  var retryTimer = null;
  var retryCount = 0;
  var MAX_RETRIES = 60; // 30 seconds at 500ms intervals
  var bodyWatcher = null;
  var overlayWatcher = null;

  /* ── Helpers ── */

  function getOverlay() {
    return document.querySelector('#player-control-overlay.new-controls');
  }

  function reapplyFlex() {
    var contentEl = document.querySelector('.player-controls-content');
    if (contentEl) {
      contentEl.style.setProperty('display', 'flex', 'important');
      contentEl.style.setProperty('flex-direction', 'column', 'important');
      contentEl.style.setProperty('justify-content', 'space-between', 'important');
      contentEl.style.setProperty('height', '100%', 'important');
    }
    // Also force bottom controls to static so they stay below the progress bar
    var bc = document.querySelector('player-bottom-controls');
    if (bc) {
      bc.style.setProperty('position', 'static', 'important');
      bc.style.setProperty('display', 'flex', 'important');
    }
    // Force bottom rows to static too
    document.querySelectorAll('.player-controls-bottom').forEach(function(el) {
      el.style.setProperty('position', 'static', 'important');
    });
  }

  /* ── OLD desktop player ── */

  function patchDesktop() {
    var controls = document.querySelector(
      '.html5-video-player:not(.ytp-miniplayer-ui) .ytp-chrome-controls'
    );
    if (!controls) return false;
    var left  = controls.querySelector('.ytp-left-controls');
    var right = controls.querySelector('.ytp-right-controls');
    if (!left || !right) return false;
    if (left.querySelector('.ytp-volume-area, .ytp-mute-button')) return true;
    var muteBtn     = right.querySelector('.ytp-mute-button');
    var volumePanel = right.querySelector('.ytp-volume-panel');
    if (!muteBtn && !volumePanel) return false;
    var insertAfter = left.querySelector('.ytp-next-button') ||
                      left.querySelector('.ytp-play-button');
    if (!insertAfter) return false;
    var wrapper = document.createElement('span');
    wrapper.className = 'ytp-volume-area ytcv-moved';
    if (muteBtn)     wrapper.appendChild(muteBtn);
    if (volumePanel) wrapper.appendChild(volumePanel);
    left.insertBefore(wrapper, insertAfter.nextSibling);
    document.body.classList.add('ytcv-active');
    return true;
  }

  /* ── NEW delhi player ── */

  function applyInlineStyles(overlay) {
    // Apply all critical layout styles inline so they survive ytcv-active
    // removal AND the fadein class being added to the overlay by YouTube

    // player-controls-content flex column
    var contentEl = overlay.querySelector('.player-controls-content');
    if (contentEl) {
      contentEl.style.setProperty('display', 'flex', 'important');
      contentEl.style.setProperty('flex-direction', 'column', 'important');
      contentEl.style.setProperty('justify-content', 'space-between', 'important');
      contentEl.style.setProperty('height', '100%', 'important');
    }

    // player-bottom-controls row
    var bc = overlay.querySelector('player-bottom-controls');
    if (bc) {
      bc.style.setProperty('position', 'static', 'important');
      bc.style.setProperty('display', 'flex', 'important');
      bc.style.setProperty('flex-direction', 'row', 'important');
      bc.style.setProperty('align-items', 'center', 'important');
      bc.style.setProperty('justify-content', 'space-between', 'important');
      bc.style.setProperty('width', '100%', 'important');
      bc.style.setProperty('padding', '0 8px 8px 8px', 'important');
      bc.style.setProperty('box-sizing', 'border-box', 'important');
    }

    // Both bottom rows
    overlay.querySelectorAll('.player-controls-bottom').forEach(function(el) {
      el.style.setProperty('position', 'static', 'important');
      el.style.setProperty('display', 'inline-flex', 'important');
      el.style.setProperty('align-items', 'center', 'important');
    });
  }

  function patchNewPlayer(overlay) {
    var topRight    = overlay.querySelector('.player-controls-top-right');
    var bottomLeft  = overlay.querySelector('.player-controls-bottom-left');
    var bottomRight = overlay.querySelector('.player-controls-bottom-right');
    if (!topRight || !bottomLeft || !bottomRight) return false;

    var trChildren = [...topRight.children];
    var volumeEl   = trChildren[0];
    var ccEl       = trChildren[1];
    var settingsEl = trChildren[2];
    if (!volumeEl || volumeEl.tagName !== 'VOLUME-CONTROLS') return false;

    var timerEl      = bottomLeft.querySelector('player-time-display');
    var fullscreenEl = bottomRight.querySelector('.ytwPlayerBottomControlsFullscreenButtonWrapper');

    // Volume → bottom-left before timer
    volumeEl.classList.add('ytcv-moved', 'ytcv-vol');
    bottomLeft.insertBefore(volumeEl, timerEl || null);

    // Play/pause → bottom-left before volume
    var middleButtons = overlay.querySelector('.player-controls-middle-core-buttons');
    var playDiv = middleButtons && [...middleButtons.children][1];
    if (playDiv) {
      playDiv.classList.add('ytcv-moved', 'ytcv-play');
      bottomLeft.insertBefore(playDiv, volumeEl);
    }

    // CC → bottom-right before fullscreen
    if (ccEl) {
      ccEl.classList.add('ytcv-moved', 'ytcv-cc');
      bottomRight.insertBefore(ccEl, fullscreenEl || null);
    }

    // Settings → bottom-right before fullscreen
    if (settingsEl) {
      settingsEl.classList.add('ytcv-moved', 'ytcv-settings');
      bottomRight.insertBefore(settingsEl, fullscreenEl || null);
    }

    // Share + Watch Later → top-right (deferred)
    function moveActions() {
      if (topRight.querySelector('.ytcv-action')) return;
      var engBtns = overlay.querySelector('.action-menu-engagement-buttons-wrapper');
      if (!engBtns) return;
      var btns = [...engBtns.querySelectorAll(':scope > ytm-slim-metadata-button-renderer')];
      if (!btns.length) return;
      btns.forEach(function(el) {
        el.classList.add('ytcv-moved', 'ytcv-action');
        topRight.appendChild(el);
      });
    }
    [0, 800, 2000].forEach(function(d) { setTimeout(moveActions, d); });

    // Hide fullscreen-action-menu via JS
    var fam = overlay.querySelector('.fullscreen-action-menu');
    if (fam) {
      fam.style.setProperty('display', 'none', 'important');
      fam.style.setProperty('pointer-events', 'none', 'important');
    }

    reapplyFlex();
    document.body.classList.add('ytcv-active');

    // Apply critical position styles inline so they survive ytcv-active removal
    applyInlineStyles(overlay);

    return true;
  }

  /* ── Main patch ── */

  function tryPatch() {
    if (patched) return;
    if (patchDesktop()) { patched = true; retryCount = 0; startWatchers(); return; }
    var overlay = getOverlay();
    if (overlay && patchNewPlayer(overlay)) { patched = true; retryCount = 0; startWatchers(); return; }
    retryCount++;
    if (retryCount <= MAX_RETRIES) {
      clearTimeout(retryTimer);
      retryTimer = setTimeout(tryPatch, 500);
    } else {
      // Gave up after 30s — reset counter so a future navigation can try again
      retryCount = 0;
    }
  }

  /* ── Minimal watchers ── */

  var restoringActive = false;
  function restoreActive() {
    if (restoringActive) return;
    restoringActive = true;
    if (!document.body.classList.contains('ytcv-active')) {
      document.body.classList.add('ytcv-active');
    }
    reapplyFlex();
    var fam = document.querySelector('.fullscreen-action-menu');
    if (fam) {
      fam.style.setProperty('display', 'none', 'important');
      fam.style.setProperty('pointer-events', 'none', 'important');
    }
    // Reset lock and do a final check in case YouTube removed it again
    setTimeout(function() {
      restoringActive = false;
      // Final check — YouTube sometimes removes it a second time
      if (patched && !document.body.classList.contains('ytcv-active')) {
        document.body.classList.add('ytcv-active');
        reapplyFlex();
      }
    }, 50);
  }

  function startWatchers() {
    // Watch body class — restore ytcv-active if YouTube removes it
    bodyWatcher = new MutationObserver(function() {
      restoreActive();
    });
    bodyWatcher.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Watch overlay class — re-apply inline styles when fadein is added
    var overlay = getOverlay();
    if (overlay) {
      var overlayClassWatcher = new MutationObserver(function() {
        // Re-apply inline styles immediately when overlay class changes (e.g. fadein added)
        applyInlineStyles(overlay);
        setTimeout(restoreActive, 50);
      });
      overlayClassWatcher.observe(overlay, {
        attributes: true,
        attributeFilter: ['class']
      });
    }

    // Watch overlay direct children only
    var overlay = getOverlay();
    if (overlay) {
      overlayWatcher = new MutationObserver(function() {
        var fam = overlay.querySelector('.fullscreen-action-menu');
        if (fam && fam.style.display !== 'none') {
          fam.style.setProperty('display', 'none', 'important');
          fam.style.setProperty('pointer-events', 'none', 'important');
        }
        var topRight = overlay.querySelector('.player-controls-top-right');
        if (topRight && !topRight.querySelector('.ytcv-action')) {
          var engBtns = overlay.querySelector('.action-menu-engagement-buttons-wrapper');
          if (engBtns) {
            [...engBtns.querySelectorAll(':scope > ytm-slim-metadata-button-renderer')]
              .forEach(function(el) {
                el.classList.add('ytcv-moved', 'ytcv-action');
                topRight.appendChild(el);
              });
          }
        }
      });
      overlayWatcher.observe(overlay, { childList: true, subtree: false });
    }
  }

  /* ── SPA navigation + iframe reload detection ── */

  var lastUrl = location.href;

  function resetAndRetry() {
    patched = false;
    retryCount = 0;
    document.body.classList.remove('ytcv-active');
    if (bodyWatcher)    { bodyWatcher.disconnect();    bodyWatcher = null; }
    if (overlayWatcher) { overlayWatcher.disconnect(); overlayWatcher = null; }
    clearTimeout(retryTimer);
    retryTimer = setTimeout(tryPatch, 700);
  }

  function onUrlChange() {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      resetAndRetry();
    }
  }
  var _push = history.pushState.bind(history);
  history.pushState = function() { _push.apply(this, arguments); onUrlChange(); };
  window.addEventListener('popstate', onUrlChange);

  // When the iframe page is about to unload (cytube changing the video),
  // reset state so we're ready to re-patch the incoming page
  window.addEventListener('beforeunload', function() {
    patched = false;
    clearTimeout(retryTimer);
    if (bodyWatcher)    { bodyWatcher.disconnect();    bodyWatcher = null; }
    if (overlayWatcher) { overlayWatcher.disconnect(); overlayWatcher = null; }
  });

  /* ── Messages (Firefox uses browser.*) ── */
  browser.runtime.onMessage.addListener(function(msg) {
    if (msg.type === 'SET_ENABLED') {
      if (msg.enabled) { patched = false; tryPatch(); }
      else {
        patched = false;
        document.body.classList.remove('ytcv-active');
        if (bodyWatcher)    { bodyWatcher.disconnect();    bodyWatcher = null; }
        if (overlayWatcher) { overlayWatcher.disconnect(); overlayWatcher = null; }
      }
    }
  });

  /* ── Early body watcher (before patch completes) ── */
  var earlyBodyWatcher = new MutationObserver(function() {
    if (patched) restoreActive();
  });
  earlyBodyWatcher.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });

  /* ── Boot ── */
  browser.storage.local.get({ enabled: true }).then(function(result) {
    if (result.enabled) tryPatch();
  });

})();
