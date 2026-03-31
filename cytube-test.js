(function() {

  var css = document.createElement('style');
  css.textContent = [
    '.oep-overlay {',
    '  position: fixed; pointer-events: none; z-index: 2147483647;',
    '  overflow: hidden;',
    '}',

    '.oep-bar {',
    '  position: absolute; bottom: 0; left: 0; right: 0; height: 36px;',
    '  display: flex; align-items: center; background: rgba(0,0,0,0.9);',
    '  pointer-events: auto; padding: 0 4px; box-sizing: border-box;',
    '  font: 11px Roboto,Arial,sans-serif; color: #ddd;',
    '  transition: opacity 0.3s; opacity: 0;',
    '}',
    '.oep-overlay:hover .oep-bar, .oep-overlay.paused .oep-bar { opacity: 1; }',

    '.oep-bar .bar-btn {',
    '  background: none; border: none; color: #fff; cursor: pointer;',
    '  padding: 0 6px; height: 36px; display: flex; align-items: center;',
    '  justify-content: center; opacity: 0.9;',
    '}',
    '.oep-bar .bar-btn:hover { opacity: 1; }',
    '.oep-bar .bar-btn svg { width: 22px; height: 22px; fill: #fff; }',
    '.oep-bar .bar-spacer { flex: 1; }',
    '.oep-bar .bar-time { font-size: 11px; padding: 0 8px; white-space: nowrap; color: #ddd; }',

    '.oep-bar .bar-vol-wrap { display: flex; align-items: center; height: 36px; }',
    '.oep-bar .bar-vol-slider {',
    '  width: 0; opacity: 0; transition: width 0.2s, opacity 0.2s;',
    '  cursor: pointer; accent-color: #f00; margin: 0; height: 4px;',
    '}',
    '.oep-bar .bar-vol-wrap:hover .bar-vol-slider { width: 52px; opacity: 1; }',

    '.oep-seek {',
    '  position: absolute; bottom: 36px; left: 0; right: 0; height: 3px;',
    '  pointer-events: auto; cursor: pointer; background: rgba(255,255,255,0.25);',
    '  transition: height 0.1s, opacity 0.3s; opacity: 0;',
    '}',
    '.oep-overlay:hover .oep-seek, .oep-overlay.paused .oep-seek { opacity: 1; }',
    '.oep-seek:hover { height: 5px; }',
    '.oep-seek .seek-played {',
    '  height: 100%; background: #f00; position: relative; pointer-events: none;',
    '}',
    '.oep-seek .seek-played::after {',
    '  content: ""; position: absolute; right: -6px; top: 50%; transform: translateY(-50%);',
    '  width: 12px; height: 12px; border-radius: 50%; background: #f00;',
    '  opacity: 0; transition: opacity 0.1s;',
    '}',
    '.oep-seek:hover .seek-played::after { opacity: 1; }',

    '.oep-top {',
    '  position: absolute; top: 0; left: 0; right: 0;',
    '  display: flex; align-items: center;',
    '  background: linear-gradient(rgba(0,0,0,0.7), transparent);',
    '  pointer-events: auto; padding: 8px 12px; box-sizing: border-box; gap: 8px;',
    '  opacity: 0; transition: opacity 0.3s;',
    '}',
    '.oep-overlay:hover .oep-top, .oep-overlay.paused .oep-top { opacity: 1; }',
    '.oep-top .top-avatar { width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0; }',
    '.oep-top .top-text { display: flex; flex-direction: column; overflow: hidden; gap: 1px; }',
    '.oep-top .top-title {',
    '  color: #fff; font: 500 13px Roboto,Arial,sans-serif;',
    '  text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;',
    '}',
    '.oep-top .top-title:hover { text-decoration: underline; }',
    '.oep-top .top-channel { color: #aaa; font: 11px Roboto,Arial,sans-serif; text-decoration: none; }',
    '.oep-top .top-channel:hover { color: #fff; }',

    '.oep-menu {',
    '  position: absolute; bottom: 36px; right: 0;',
    '  background: rgba(28,28,28,0.97); border-radius: 4px;',
    '  padding: 6px 0; min-width: 160px;',
    '  box-shadow: 0 2px 8px rgba(0,0,0,0.5);',
    '  display: none; pointer-events: auto;',
    '  font: 12px Roboto,Arial,sans-serif; color: #eee;',
    '}',
    '.oep-menu.open { display: block; }',
    '.oep-menu .menu-section { padding: 4px 12px 2px; color: #aaa; font-size: 10px; text-transform: uppercase; }',
    '.oep-menu .menu-item {',
    '  padding: 6px 16px; cursor: pointer; display: flex;',
    '  justify-content: space-between; align-items: center;',
    '}',
    '.oep-menu .menu-item:hover { background: rgba(255,255,255,0.1); }',
    '.oep-menu .menu-item.active { color: #f00; }',
    '.oep-menu .menu-divider { border-top: 1px solid rgba(255,255,255,0.1); margin: 4px 0; }'
  ].join('\n');
  document.head.appendChild(css);

  var SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  var QUALITIES = ['hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny', 'auto'];
  var QUALITY_LABELS = {
    'hd2160': '2160p', 'hd1440': '1440p', 'hd1080': '1080p', 'hd720': '720p',
    'large': '480p', 'medium': '360p', 'small': '240p', 'tiny': '144p', 'auto': 'Auto'
  };

  function svgIcon(pathD) {
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    var path = document.createElementNS(ns, 'path');
    path.setAttribute('d', pathD);
    svg.appendChild(path);
    return svg;
  }

  var P = {
    play:       'M8 5v14l11-7z',
    pause:      'M6 19h4V5H6v14zm8-14v14h4V5h-4z',
    volOn:      'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z',
    volOff:     'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z',
    cc:         'M18 11h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm-6.5 0H10v-.5H8v3h2V13h1.5v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1v1zM19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V6h14v12z',
    settings:   'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
    fullscreen: 'M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z'
  };

  function makeBtn(pathD, label, onClick) {
    var btn = document.createElement('button');
    btn.className = 'bar-btn';
    btn.setAttribute('aria-label', label);
    btn.appendChild(svgIcon(pathD));
    btn.addEventListener('click', onClick);
    return btn;
  }

  function formatTime(s) {
    if (!s || isNaN(s)) return '0:00';
    s = Math.floor(s);
    var m = Math.floor(s / 60);
    s = s % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function YTControl(iframe) {
    this.iframe = iframe;
    this.state = -1;
    this.currentTime = 0;
    this.duration = 0;
    this.volume = 100;
    this.muted = false;
    this.speed = 1;
    this.quality = 'auto';
    this.availableQualities = [];
    this._cbs = {};
    var self = this;

    window.addEventListener('message', function (e) {
      if (e.source !== self.iframe.contentWindow) return;
      var d;
      try { d = JSON.parse(e.data); } catch (err) { return; }

      if (d.event === 'onStateChange') {
        self.state = d.info;
        self._fire('stateChange');
      }
      if (d.event === 'infoDelivery' && d.info) {
        if (typeof d.info.currentTime === 'number') self.currentTime = d.info.currentTime;
        if (typeof d.info.duration === 'number') self.duration = d.info.duration;
        if (typeof d.info.volume === 'number') self.volume = d.info.volume;
        if (typeof d.info.muted === 'boolean') self.muted = d.info.muted;
        if (typeof d.info.playbackRate === 'number') self.speed = d.info.playbackRate;
        if (typeof d.info.playbackQuality === 'string') self.quality = d.info.playbackQuality;
        if (Array.isArray(d.info.availableQualityLevels) && d.info.availableQualityLevels.length) {
          self.availableQualities = d.info.availableQualityLevels;
        }
        self._fire('update');
      }
    });

    this._cmd('addEventListener', 'onStateChange');
  }

  YTControl.prototype._cmd = function (func, arg) {
    try {
      this.iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command', func: func, args: arg !== undefined ? [arg] : []
      }), '*');
    } catch (e) {}
  };

  YTControl.prototype.play       = function () { this._cmd('playVideo'); };
  YTControl.prototype.pause      = function () { this._cmd('pauseVideo'); };
  YTControl.prototype.seekTo     = function (t) { this._cmd('seekTo', t); };
  YTControl.prototype.setVolume  = function (v) { this._cmd('setVolume', v); };
  YTControl.prototype.mute_      = function () { this._cmd('mute'); };
  YTControl.prototype.unMute     = function () { this._cmd('unMute'); };
  YTControl.prototype.setSpeed   = function (r) { this._cmd('setPlaybackRate', r); };
  YTControl.prototype.setQuality = function (q) { this._cmd('setPlaybackQuality', q); };

  YTControl.prototype.on = function (e, fn) {
    if (!this._cbs[e]) this._cbs[e] = [];
    this._cbs[e].push(fn);
  };
  YTControl.prototype._fire = function (e) {
    var fns = this._cbs[e] || [];
    for (var i = 0; i < fns.length; i++) fns[i]();
  };

  function extractVideoId(url) {
    if (!url) return null;
    var m = url.match(/youtube\.com\/embed\/([^?&#]+)/);
    return m ? m[1] : null;
  }

  function fetchVideoInfo(videoId, cb) {
    fetch('https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=' + videoId + '&format=json')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        cb({ title: d.title, author: d.author_name, authorUrl: d.author_url, thumbnail: d.thumbnail_url });
      })
      .catch(function () { cb({}); });
  }

  function setupOverlay(iframe) {
    if (iframe.dataset.oepDone) return;
    iframe.dataset.oepDone = '1';

    var yt = new YTControl(iframe);

    var overlay = document.createElement('div');
    overlay.className = 'oep-overlay';
    document.body.appendChild(overlay);

    function positionOverlay() {
      var r = iframe.getBoundingClientRect();
      overlay.style.top    = (r.top  + window.scrollY) + 'px';
      overlay.style.left   = (r.left + window.scrollX) + 'px';
      overlay.style.width  = r.width  + 'px';
      overlay.style.height = r.height + 'px';
    }
    positionOverlay();
    window.addEventListener('resize', positionOverlay);
    window.addEventListener('scroll', positionOverlay);

    // Reposition when cytube resizes the video panel
    new ResizeObserver(positionOverlay).observe(iframe);

    // Remove overlay when iframe is removed from DOM (video change)
    new MutationObserver(function () {
      if (!document.contains(iframe)) {
        overlay.remove();
      }
    }).observe(document.body, { childList: true, subtree: true });

    // --- Top bar ---
    var topBar = document.createElement('div');
    topBar.className = 'oep-top';
    var videoId = extractVideoId(iframe.src);
    if (videoId) {
      fetchVideoInfo(videoId, function (info) {
        if (info.thumbnail) {
          var av = document.createElement('img');
          av.src = info.thumbnail;
          av.className = 'top-avatar';
          topBar.insertBefore(av, topBar.firstChild);
        }
        var txt = document.createElement('div');
        txt.className = 'top-text';
        if (info.title) {
          var t = document.createElement('a');
          t.className = 'top-title';
          t.textContent = info.title;
          t.href = 'https://www.youtube.com/watch?v=' + videoId;
          t.target = '_blank';
          txt.appendChild(t);
        }
        if (info.author) {
          var c = document.createElement('a');
          c.className = 'top-channel';
          c.textContent = info.author;
          if (info.authorUrl) { c.href = info.authorUrl; c.target = '_blank'; }
          txt.appendChild(c);
        }
        topBar.appendChild(txt);
      });
    }
    overlay.appendChild(topBar);

    // --- Seek bar ---
    var seekWrap = document.createElement('div');
    seekWrap.className = 'oep-seek';
    var seekPlayed = document.createElement('div');
    seekPlayed.className = 'seek-played';
    seekWrap.appendChild(seekPlayed);

    var seeking = false;
    seekWrap.addEventListener('mousedown', function (e) { seeking = true; doSeek(e); });
    document.addEventListener('mousemove', function (e) { if (seeking) doSeek(e); });
    document.addEventListener('mouseup', function () { seeking = false; });

    function doSeek(e) {
      if (!yt.duration) return;
      var r = seekWrap.getBoundingClientRect();
      var pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      yt.seekTo(pct * yt.duration);
      seekPlayed.style.width = (pct * 100) + '%';
    }
    overlay.appendChild(seekWrap);

    // --- Settings menu ---
    var menu = document.createElement('div');
    menu.className = 'oep-menu';

    function buildMenu() {
      menu.innerHTML = '';

      var speedSection = document.createElement('div');
      speedSection.className = 'menu-section';
      speedSection.textContent = 'Speed';
      menu.appendChild(speedSection);

      SPEEDS.forEach(function (spd) {
        var item = document.createElement('div');
        item.className = 'menu-item' + (yt.speed === spd ? ' active' : '');
        item.textContent = spd === 1 ? 'Normal' : spd + 'x';
        item.addEventListener('click', function () {
          yt.setSpeed(spd);
          yt.speed = spd;
          buildMenu();
        });
        menu.appendChild(item);
      });

      var div = document.createElement('div');
      div.className = 'menu-divider';
      menu.appendChild(div);

      var qualSection = document.createElement('div');
      qualSection.className = 'menu-section';
      qualSection.textContent = 'Quality';
      menu.appendChild(qualSection);

      var qualitiesToShow = yt.availableQualities.length ? yt.availableQualities : QUALITIES;
      qualitiesToShow.forEach(function (q) {
        if (!QUALITY_LABELS[q]) return;
        var item = document.createElement('div');
        item.className = 'menu-item' + (yt.quality === q ? ' active' : '');
        item.textContent = QUALITY_LABELS[q];
        item.addEventListener('click', function () {
          yt.setQuality(q);
          yt.quality = q;
          buildMenu();
        });
        menu.appendChild(item);
      });
    }

    buildMenu();
    overlay.appendChild(menu);

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && e.target !== settingsBtn) {
        menu.classList.remove('open');
      }
    });

    // --- Control bar ---
    var bar = document.createElement('div');
    bar.className = 'oep-bar';

    var playBtn = makeBtn(P.play, 'Play', function () {
      if (yt.state === 1) yt.pause(); else yt.play();
    });
    bar.appendChild(playBtn);

    var volWrap = document.createElement('div');
    volWrap.className = 'bar-vol-wrap';
    var volBtn = makeBtn(P.volOn, 'Volume', function () {
      if (yt.muted) yt.unMute(); else yt.mute_();
    });
    volWrap.appendChild(volBtn);

    var volSlider = document.createElement('input');
    volSlider.type = 'range';
    volSlider.className = 'bar-vol-slider';
    volSlider.min = '0'; volSlider.max = '100'; volSlider.value = '100';
    volSlider.addEventListener('input', function () {
      var v = parseInt(volSlider.value, 10);
      yt.setVolume(v);
      if (v === 0) yt.mute_(); else yt.unMute();
    });
    volWrap.appendChild(volSlider);
    bar.appendChild(volWrap);

    var timeEl = document.createElement('span');
    timeEl.className = 'bar-time';
    bar.appendChild(timeEl);

    var sp = document.createElement('div');
    sp.className = 'bar-spacer';
    bar.appendChild(sp);

    bar.appendChild(makeBtn(P.cc, 'Captions', function () {
      yt._cmd('toggleCaptions');
    }));

    var settingsBtn = makeBtn(P.settings, 'Settings', function (e) {
      e.stopPropagation();
      buildMenu();
      menu.classList.toggle('open');
    });
    bar.appendChild(settingsBtn);

    // Close menu when clicking outside — declared after settingsBtn so reference is valid
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && e.target !== settingsBtn) {
        menu.classList.remove('open');
      }
    });

    bar.appendChild(makeBtn(P.fullscreen, 'Full screen', function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else iframe.requestFullscreen();
    }));

    overlay.appendChild(bar);

    // --- State sync ---
    yt.on('update', function () {
      timeEl.textContent = formatTime(yt.currentTime) + ' / ' + formatTime(yt.duration);
      if (!seeking && yt.duration) {
        seekPlayed.style.width = ((yt.currentTime / yt.duration) * 100) + '%';
      }
      volSlider.value = String(yt.volume);
      var oldV = volBtn.querySelector('svg');
      if (oldV) volBtn.removeChild(oldV);
      volBtn.appendChild(svgIcon(yt.muted ? P.volOff : P.volOn));
    });

    yt.on('stateChange', function () {
      var oldP = playBtn.querySelector('svg');
      if (oldP) playBtn.removeChild(oldP);
      playBtn.appendChild(svgIcon(yt.state === 1 ? P.pause : P.play));
      if (yt.state === 1) overlay.classList.remove('paused');
      else overlay.classList.add('paused');
    });
  }

  function processIframes() {
    var iframes = document.querySelectorAll('iframe[src*="youtube.com/embed"]');
    for (var i = 0; i < iframes.length; i++) setupOverlay(iframes[i]);
  }

  $(function () {
    processIframes();
    new MutationObserver(processIframes).observe(document.body, { childList: true, subtree: false });
  });


})();
