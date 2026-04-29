/**
 * YouTube Classic Volume — content.js v3.0.0 (Firefox)
 * Lean rewrite: patch once, minimal observation.
 */
(function () {
  'use strict';

  var patched = false;
  var retryTimer = null;
  var retryCount = 0;
  var MAX_RETRIES = 120; // 60 seconds at 500ms intervals
  var bodyWatcher = null;
  var overlayWatcher = null;

  /* ── Helpers ── */

  function getOverlay() {
    // Works for both youtube.com and youtube-nocookie.com embeds
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

    // player-bottom-controls wrapper — pin to bottom via margin-top auto
    var bcWrap = overlay.querySelector('.player-controls-content > div:has(> player-bottom-controls)');
    if (bcWrap) {
      bcWrap.style.setProperty('margin-top', 'auto', 'important');
      bcWrap.style.setProperty('flex-shrink', '0', 'important');
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

    // Volume must exist as the minimum signal the player is ready
    if (!volumeEl || volumeEl.tagName !== 'VOLUME-CONTROLS') return false;

    // If CC or settings are missing, player isn't fully ready yet — retry
    if (!ccEl || !settingsEl) return false;

    // Play button must also be present
    var middleButtons = overlay.querySelector('.player-controls-middle-core-buttons');
    var playDiv = middleButtons && [...middleButtons.children][1];
    if (!playDiv) return false;

    var timerEl      = bottomLeft.querySelector('player-time-display');
    var fullscreenEl = bottomRight.querySelector('.ytwPlayerBottomControlsFullscreenButtonWrapper');

    // All elements confirmed present — move them all at once

    // Volume → bottom-left before timer
    if (!bottomLeft.querySelector('volume-controls.ytcv-vol')) {
      volumeEl.classList.add('ytcv-moved', 'ytcv-vol');
      bottomLeft.insertBefore(volumeEl, timerEl || null);
    }

    // Play/pause → bottom-left before volume
    if (!bottomLeft.querySelector('div.ytcv-play')) {
      playDiv.classList.add('ytcv-moved', 'ytcv-play');
      var volInLeft = bottomLeft.querySelector('volume-controls.ytcv-vol');
      bottomLeft.insertBefore(playDiv, volInLeft || timerEl || null);
    }

    // CC → bottom-right before fullscreen
    if (!bottomRight.querySelector('.ytcv-cc')) {
      ccEl.classList.add('ytcv-moved', 'ytcv-cc');
      bottomRight.insertBefore(ccEl, fullscreenEl || null);
    }

    // Settings → bottom-right before fullscreen
    if (!bottomRight.querySelector('.ytcv-settings')) {
      settingsEl.classList.add('ytcv-moved', 'ytcv-settings');
      bottomRight.insertBefore(settingsEl, fullscreenEl || null);
    }

    // Check all critical moves completed — if not, retry
    var allMoved =
      bottomLeft.querySelector('volume-controls.ytcv-vol') &&
      bottomLeft.querySelector('div.ytcv-play') &&
      bottomRight.querySelector('.ytcv-cc') &&
      bottomRight.querySelector('.ytcv-settings');
    if (!allMoved) return false;

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

  var overlayWatcherInner = null;

  function isStillPatched() {
    return !!document.querySelector(
      '.player-controls-bottom-left volume-controls.ytcv-vol'
    );
  }

  function tryPatch() {
    // Allow re-patch if YouTube has redrawn the controls
    if (patched && isStillPatched()) return;
    if (!isStillPatched()) patched = false;

    // Try desktop player first
    if (patchDesktop()) { patched = true; retryCount = 0; startWatchers(); return; }

    // Try new delhi player
    var overlay = getOverlay();
    if (overlay) {
      if (patchNewPlayer(overlay)) {
        patched = true;
        retryCount = 0;
        if (overlayWatcherInner) { overlayWatcherInner.disconnect(); overlayWatcherInner = null; }
        startWatchers();
        return;
      }
      // Overlay exists but elements not ready yet — keep polling
      retryCount++;
      if (retryCount <= MAX_RETRIES) {
        clearTimeout(retryTimer);
        var interval = retryCount <= 10 ? 300 : 500;
        retryTimer = setTimeout(tryPatch, interval);
      } else {
        retryCount = 0;
      }
      return;
    }

    // Overlay doesn't exist yet — set up a MutationObserver to watch for it
    // rather than polling blindly. This fires at the exact moment it appears.
    if (!overlayWatcherInner) {
      overlayWatcherInner = new MutationObserver(function() {
        var ov = getOverlay();
        if (!ov) return;
        // Overlay appeared — disconnect and attempt patch
        overlayWatcherInner.disconnect();
        overlayWatcherInner = null;
        clearTimeout(retryTimer);
        retryCount = 0;
        // Small delay to let player finish populating children
        retryTimer = setTimeout(tryPatch, 100);
      });
      overlayWatcherInner.observe(document.body, { childList: true, subtree: true });
    }
  }

  /* ── Minimal watchers ── */

  var restoringActive = false;
  function restoreActive() {
    // Only restore ytcv-active if the patch has fully completed
    // Prevents CSS rules applying before DOM moves are done
    if (!patched) return;
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

    // Watch player container directly for control rebuilds
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
        // If YouTube rebuilt the controls, re-patch
        if (!isStillPatched()) {
          patched = false;
          clearTimeout(retryTimer);
          retryTimer = setTimeout(tryPatch, 100);
        }
      });
      // Watch the overlay with subtree:true to catch internal control rebuilds
      overlayWatcher.observe(overlay, { childList: true, subtree: true });
    }
  }

  /* ── SPA navigation + iframe reload detection ── */

  var lastUrl = location.href;

  function resetAndRetry() {
    patched = false;
    retryCount = 0;
    document.body.classList.remove('ytcv-active');
    if (bodyWatcher)        { bodyWatcher.disconnect();        bodyWatcher = null; }
    if (overlayWatcher)     { overlayWatcher.disconnect();     overlayWatcher = null; }
    if (overlayWatcherInner){ overlayWatcherInner.disconnect(); overlayWatcherInner = null; }
    clearTimeout(retryTimer);
    retryTimer = setTimeout(tryPatch, 200);
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
    retryCount = 0;
    clearTimeout(retryTimer);
    if (bodyWatcher)        { bodyWatcher.disconnect();        bodyWatcher = null; }
    if (overlayWatcher)     { overlayWatcher.disconnect();     overlayWatcher = null; }
    if (overlayWatcherInner){ overlayWatcherInner.disconnect(); overlayWatcherInner = null; }
  });

  // Also watch for the iframe being replaced by cytube — start patching immediately
  // when a new YouTube embed iframe appears in the DOM
  new MutationObserver(function(mutations) {
    for (var i = 0; i < mutations.length; i++) {
      var nodes = mutations[i].addedNodes;
      for (var j = 0; j < nodes.length; j++) {
        var node = nodes[j];
        if (node.nodeType !== 1) continue;
        var iframe = node.tagName === 'IFRAME' ? node : node.querySelector && node.querySelector('iframe[src*="youtube.com/embed"]');
        if (iframe && iframe.src && (iframe.src.includes('youtube.com/embed') || iframe.src.includes('youtube-nocookie.com/embed'))) {
          patched = false;
          retryCount = 0;
          clearTimeout(retryTimer);
          retryTimer = setTimeout(tryPatch, 200);
          return;
        }
      }
    }
  }).observe(document.body, { childList: true, subtree: true });

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

  // Safety net — check every 5 seconds in case watchers were lost
  setInterval(function() {
    if (patched && isStillPatched()) {
      restoreActive();
      return;
    }
    // Controls gone or never patched — try again
    patched = false;
    if (!overlayWatcherInner) {
      tryPatch();
    }
  }, 5000);

  /* ── Boot ── */
  browser.storage.local.get({ enabled: true }).then(function(result) {
    if (result.enabled) tryPatch();
  });

})();
