# Classic YT Layout

A browser extension that restores the classic YouTube video player layout, reverting the 2025/2026 UI change that moved the volume control and rearranged player buttons.

## What it does

YouTube's new "delhi" mobile player moves the volume control to the top-right and rearranges the player controls. This extension restores the classic layout:

- **Bottom-left:** Play/pause, volume, timestamp
- **Bottom-right:** CC, settings, fullscreen
- **Top-right:** Share, Watch Later

The extension only activates when the new player layout is detected — if you're already getting the old layout, it does nothing.

## Installation

### Firefox
1. Download `classic-yt-layout-firefox.zip`
2. Go to `about:debugging` → **This Firefox** → **Load Temporary Add-on**
3. Select the zip file

For permanent installation without signing, go to `about:config` and set `xpinstall.signatures.required` to `false`, then install via `about:addons` → **Install Add-on From File**.

### Brave
1. Download `classic-yt-layout-brave.zip` and unzip it
2. Go to `brave://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the unzipped folder

### Chrome
1. Download `classic-yt-layout-chrome.zip` and unzip it
2. Go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the unzipped folder

## Usage

The extension activates automatically when the new YouTube player layout is detected on embedded YouTube videos. A toggle in the extension popup lets you enable or disable it without uninstalling.

## Compatibility

- Firefox 109+
- Brave (any recent version)
- Chrome (any recent version supporting Manifest V3)

## License

[CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/) — Free for personal use. No commercial use. No redistribution of modified versions without permission.

Copyright (c) 2026 gnik0074
