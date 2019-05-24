// ==UserScript==
// @author        Linonetwo
// @name          Skip tampermonkey page
// @namespace     https://github.com/linonetwo
// @description   Automatically redirects tampermonkey page to openuserjs.
// @version       1.0
// @grant         none
// @run-at        document-start
// @include       https://www.tampermonkey.net/scripts.php
// @icon          https://www.tampermonkey.net/images/icon.png
// @license       MIT
// ==/UserScript==

const url = window.location.href;
const regex = /^https?:\/\/(?:www\.)?tampermonkey\.net\/scripts\.php/i;
const match = url.match(regex);

if (match) {
    window.location.href = 'https://openuserjs.org/';
}
