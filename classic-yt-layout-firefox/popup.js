/**
 * Classic YT Layout — popup.js v3.4.3
 */

var STORE_URL_FIREFOX = 'https://addons.mozilla.org/en-US/firefox/addon/classic-yt-layout/';
var STORE_URL_CHROME  = 'https://chromewebstore.google.com/detail/classic-yt-layout/jaghmoncmdnkhninmjjhegapgmpecejj';

// Set rate button URL based on browser
var rateBtn = document.getElementById('rateBtn');
if (typeof browser !== 'undefined') {
  rateBtn.href = STORE_URL_FIREFOX;
} else {
  rateBtn.href = STORE_URL_CHROME;
}
