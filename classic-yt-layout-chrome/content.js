/**
 * YouTube Classic Volume — content.js v3.0.0 (Firefox)
 * Lean rewrite: patch once, minimal observation.
 */
(function () {
  'use strict';

  // Inject CSS inline — CSP blocks external stylesheets in cross-origin iframes
  (function() {
    if (document.getElementById('ytcv-styles')) return;
    try {
      var style = document.createElement('style');
      style.id = 'ytcv-styles';
      style.textContent = "/*\n * Classic YT Layout \u2014 volume-fix.css v3.3.3\n */\n\n/* \u2500\u2500 OLD desktop player \u2500\u2500 */\nbody.ytcv-active .ytp-right-controls .ytp-mute-button:not(.ytcv-moved *),\nbody.ytcv-active .ytp-right-controls .ytp-volume-panel:not(.ytcv-moved *) {\n  display: none !important;\n}\nbody.ytcv-active span.ytp-volume-area.ytcv-moved {\n  display: inline-flex !important;\n  align-items: center !important;\n  position: static !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  vertical-align: middle !important;\n}\n\n/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n   NEW DELHI PLAYER\n   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\n\n/* Hide elements we don't need */\nbody.ytcv-active .quick-actions-wrapper,\nbody.ytcv-active player-middle-controls {\n  display: none !important;\n}\n\n/* Hide fullscreen-action-menu which blocks button clicks */\nbody.ytcv-active .fullscreen-action-menu,\nbody.ytcv-active div.fullscreen-action-menu,\n#player-control-overlay.ytcv-active .fullscreen-action-menu,\n.new-controls .fullscreen-action-menu {\n  display: none !important;\n  pointer-events: none !important;\n}\n\n/* Hide original share/watch-later in fullscreen menu */\nbody.ytcv-active .action-menu-engagement-buttons-wrapper\n  > ytm-slim-metadata-button-renderer:not(.ytcv-action) {\n  display: none !important;\n}\n\n/* player-controls-content: flex column, covers all overlay class states */\nbody.ytcv-active .player-controls-content,\nbody.ytcv-active #player-control-overlay.fadein .player-controls-content,\nbody.ytcv-active #player-control-overlay.fadein.fullscreen-controls-always-on .player-controls-content,\n#player-control-overlay.fadein .player-controls-content {\n  display: flex !important;\n  flex-direction: column !important;\n  justify-content: space-between !important;\n  height: 100% !important;\n}\n\nbody.ytcv-active .player-controls-content > div:has(> player-top-controls) {\n  flex-shrink: 0 !important;\n}\n\nbody.ytcv-active .player-controls-content > div:has(> yt-progress-bar) {\n  flex-shrink: 0 !important;\n  width: 100% !important;\n}\n\nbody.ytcv-active .player-controls-content > div:has(> player-bottom-controls) {\n  margin-top: auto !important;\n  flex-shrink: 0 !important;\n  padding-top: 8px !important;\n}\n\n/* Bottom controls row \u2014 consolidated, no duplicate */\nbody.ytcv-active player-bottom-controls,\nbody.ytcv-active #player-control-overlay.fadein player-bottom-controls {\n  position: static !important;\n  display: flex !important;\n  flex-direction: row !important;\n  align-items: center !important;\n  justify-content: space-between !important;\n  width: 100% !important;\n  padding: 0 8px 8px 8px !important;\n  box-sizing: border-box !important;\n}\n\nbody.ytcv-active .player-controls-bottom {\n  position: static !important;\n  display: inline-flex !important;\n  align-items: center !important;\n}\n\n/* \u2500\u2500 top-right: Share + Watch Later \u2500\u2500 */\nbody.ytcv-active .player-controls-top-right {\n  display: inline-flex !important;\n  align-items: center !important;\n  gap: 4px !important;\n}\n\nbody.ytcv-active .player-controls-top-right .ytcv-action {\n  display: inline-flex !important;\n  visibility: visible !important;\n  background: none !important;\n  border-radius: 0 !important;\n}\n\nbody.ytcv-active .player-controls-top-right .ytcv-action ytm-button-renderer {\n  display: inline-flex !important;\n  background: none !important;\n  border-radius: 0 !important;\n}\n\nbody.ytcv-active .player-controls-top-right .ytcv-action button {\n  display: inline-flex !important;\n  visibility: visible !important;\n  opacity: 1 !important;\n  pointer-events: auto !important;\n  background: none !important;\n  border-radius: 0 !important;\n  width: auto !important;\n  height: auto !important;\n  min-width: unset !important;\n  min-height: unset !important;\n  padding: 4px !important;\n}\n\n/* \u2500\u2500 bottom-left: play + volume + timer \u2500\u2500 */\nbody.ytcv-active .player-controls-bottom-left {\n  display: inline-flex !important;\n  align-items: center !important;\n  gap: 4px !important;\n  flex: 1 !important;\n  justify-content: flex-start !important;\n}\n\nbody.ytcv-active div.ytcv-play {\n  display: inline-flex !important;\n  align-items: center !important;\n  flex-shrink: 0 !important;\n  position: static !important;\n  transform: none !important;\n}\n\nbody.ytcv-active volume-controls.ytcv-vol {\n  display: inline-flex !important;\n  align-items: center !important;\n  position: static !important;\n  top: auto !important;\n  right: auto !important;\n  left: auto !important;\n  transform: none !important;\n  margin: 0 !important;\n  flex-shrink: 0 !important;\n  flex-grow: 0 !important;\n  align-self: center !important;\n}\n\n/* Volume container \u2014 expands when slider is visible to push timer right */\nbody.ytcv-active volume-controls.ytcv-vol\n  .ytdVolumeControlsVolumeControlsContainer {\n  display: inline-flex !important;\n  flex-direction: row !important;\n  align-items: center !important;\n  gap: 0 !important;\n  padding-right: 8px !important;\n  position: static !important;\n  width: 48px !important;\n  height: 48px !important;\n  max-height: 48px !important;\n  overflow: visible !important;\n  transition: width 0.2s linear !important;\n}\n\nbody.ytcv-active volume-controls.ytcv-vol\n  .ytdVolumeControlsVolumeControlsContainer:has(.ytdVolumeControlsSliderContainerExpanded) {\n  width: 108px !important;\n}\n\n/* Slider container base */\nbody.ytcv-active volume-controls.ytcv-vol\n  .ytdVolumeControlsSliderContainer {\n  display: inline-flex !important;\n  align-items: center !important;\n  overflow: hidden !important;\n  transform: none !important;\n  writing-mode: horizontal-tb !important;\n  position: static !important;\n  flex-shrink: 0 !important;\n  height: 18px !important;\n}\n\n/* Vertical-specific: kill downward animation */\nbody.ytcv-active volume-controls.ytcv-vol\n  .ytdVolumeControlsSliderContainerVertical {\n  margin-top: 0 !important;\n  transition: visibility 0.3s linear, opacity 0.3s linear, width 0.3s linear !important;\n}\n\n/* Expanded state */\nbody.ytcv-active volume-controls.ytcv-vol\n  .ytdVolumeControlsSliderContainerExpanded,\nbody.ytcv-active volume-controls.ytcv-vol\n  .ytdVolumeControlsSliderContainerVerticalExpanded {\n  width: 60px !important;\n  overflow: visible !important;\n}\n\n/* Range input */\nbody.ytcv-active volume-controls.ytcv-vol\n  .ytdVolumeControlsNativeSlider {\n  writing-mode: horizontal-tb !important;\n  direction: ltr !important;\n  width: 60px !important;\n  height: 3px !important;\n  transform: none !important;\n  rotate: none !important;\n  cursor: pointer !important;\n  -webkit-appearance: slider-horizontal !important;\n  appearance: auto !important;\n  position: static !important;\n}\n\n/* Timer \u2014 shrinks to content size, slides right when slider expands */\nbody.ytcv-active player-time-display {\n  position: static !important;\n  display: inline-flex !important;\n  align-items: center !important;\n  flex-shrink: 1 !important;\n  white-space: nowrap !important;\n  overflow: hidden !important;\n  width: auto !important;\n  max-width: max-content !important;\n  flex-basis: auto !important;\n  margin-left: 0 !important;\n  transition: margin-left 0.2s linear !important;\n}\n\nbody.ytcv-active player-time-display > div {\n  width: auto !important;\n  flex-shrink: 1 !important;\n}\n\nbody.ytcv-active .player-controls-bottom-left:has(.ytdVolumeControlsSliderContainerExpanded)\n  player-time-display {\n  margin-left: 60px !important;\n}\n\n/* \u2500\u2500 bottom-right: CC + Settings + Fullscreen \u2500\u2500 */\nbody.ytcv-active .player-controls-bottom-right {\n  display: inline-flex !important;\n  align-items: center !important;\n  gap: 2px !important;\n  flex-shrink: 0 !important;\n}\n\nbody.ytcv-active .player-controls-bottom-right .ytcv-cc,\nbody.ytcv-active .player-controls-bottom-right .ytcv-settings {\n  display: inline-flex !important;\n  align-items: center !important;\n  position: static !important;\n  visibility: visible !important;\n}\n\n/* Hide moved elements when controls autohide (fadein removed) */\nbody.ytcv-active #player-control-overlay:not(.fadein) .ytcv-action,\nbody.ytcv-active #player-control-overlay:not(.fadein) .ytcv-cc,\nbody.ytcv-active #player-control-overlay:not(.fadein) .ytcv-settings {\n  display: none !important;\n  visibility: hidden !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n}\n\n/* \u2500\u2500 Disabled state \u2500\u2500 */\nbody.ytcv-disabled .ytp-right-controls .ytp-mute-button,\nbody.ytcv-disabled .ytp-right-controls .ytp-volume-panel,\nbody.ytcv-disabled .action-menu-engagement-buttons-wrapper\n  ytm-slim-metadata-button-renderer,\nbody.ytcv-disabled .quick-actions-wrapper,\nbody.ytcv-disabled player-middle-controls {\n  display: inline-flex !important;\n}\nbody.ytcv-disabled .player-controls-content {\n  display: block !important;\n}\nbody.ytcv-disabled player-bottom-controls {\n  position: absolute !important;\n}\n";
      (document.head || document.documentElement).appendChild(style);
    } catch(e) {}
  })();

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
  chrome.runtime.onMessage.addListener(function(msg) {
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
  chrome.storage.local.get({ enabled: true }).then(function(result) {
    if (result.enabled) tryPatch();
  });

})();
