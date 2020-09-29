// ==UserScript==
// @name         funny mud pee
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fuck off everything you don't wanna see in a html
// @author       Xiaochuan Sun
// @match        https://twitter.com/*
// @match        https://www.google.com/*
// @match        https://stackoverflow.com/*
// @match        https://*.stackexchange.com/*
// @match        https://*.mathoverflow.net/*
// @match        https://*.serverfault.com/*
// @match        https://*.askubuntu.com/*
// @match        https://*.superuser.com/*
// @match        https://*.zhihu.com/*
// @match        https://*.quora.com/*
// @match        https://*.baidu.com/*
// @match        https://*.github.com/*
// @match        https://*.youtube.com/*
// @run-at       document-start
// ==/UserScript==

function isStackOverflow(url) {
    if (url.includes("stackoverflow.com")) return true;
    if (url.includes("stackexchange.com")) return true;
    if (url.includes("mathoverflow.net")) return true;
    if (url.includes("serverfault.com")) return true;
    if (url.includes("askubuntu.com")) return true;
    if (url.includes("superuser.com")) return true;
    return false;
}

function fuck() {
    'use strict';

    var url = document.URL;
    var all = document.getElementsByTagName("*");

    for (var i=0, max=all.length; i < max; i++) {

        try {

            var elem = all[i];
            var nmsl = false, tmp;

            if (elem == null) continue;

            //twitter check
            if (url.includes("twitter.com")) {
                var sima_tag_twitter = ["时间线：当前趋势", "推荐关注", "搜索和发现"];
                tmp = elem.getAttribute("aria-label");
                if (typeof(tmp) == "string") {
                    if (sima_tag_twitter.includes(tmp)) nmsl = true;
                }
            }

            //google check
            if (url.includes("google.com")) {
                if (elem.id == "botstuff") nmsl = true;
                var sima_text_google = ["用户还搜索了", "其他用户还问了以下问题"];
                tmp = elem.innerText;
                if (typeof(tmp) == "string") {
                    if (sima_text_google.includes(tmp)) {
                        elem = elem.parentElement;
                        nmsl = true;
                    }
                }
            }

            //stackoverflow check
            if (isStackOverflow(url)) {
                tmp = elem.id;
                if (typeof(tmp) == "string") {
                    if (tmp == "sidebar") nmsl = true;
                    if (tmp.includes("google_ads_iframe")) nmsl = true; //ad
                }
            }

            //zhihu check
            if (url.includes("zhihu.com")) {
                if (url.includes("people")) {//personal page
                    tmp = elem.getAttribute("data-za-extra-module");
                    if (typeof(tmp) == "string") {
                        if (tmp.includes("\"type\":\"Question\"")) nmsl = true;
                        if (tmp.includes("\"type\":\"Answer\"")) nmsl = true;
                    }
                }
                tmp = elem.getAttribute("role");
                if (typeof(tmp) == "string") {
                    if (tmp.includes("navigation")) nmsl = true;
                    if (tmp.includes("search")) nmsl = true;
                }
                tmp = elem.className;
                if (typeof(tmp) == "string") {
                    if (tmp.includes("Recommendations-Main")) nmsl = true;
                    if (tmp.includes("sticky")) nmsl = true;
                }
            }

            //quora check
            if (url.includes("quora.com")) {
                tmp = elem.innerText;
                if (typeof(tmp) == "string") {
                    if (tmp == "Related Questions" || tmp == "Related Spaces") {
                        for (var u = 1; u <= 5; u++) elem = elem.parentElement;
                        nmsl = true;
                    }
                }
            }

            //baidu check
            if (url.includes("baidu.com")) {
                tmp = elem.className;
                if (typeof(tmp) == "string") {
                    var sima_class_baidu = ["s_tab_inner", "question-number-text-chain", "task-list-button", "jump-top-box", "content-box", "channel grid", "c-container"];
                    if (sima_class_baidu.includes(tmp)) nmsl = true;
                    if (tmp.includes("s-hotsearch")) nmsl = true;
                    if (tmp.includes("recommend")) nmsl = true;
                    if (tmp.includes("grid-r")) nmsl = true;
                    if (tmp.includes("wgt-related")) nmsl = true;
                    if (tmp.includes("wgt-union-bottom")) nmsl = true;
                    if (tmp.includes("wgt-bottom-union")) nmsl = true;
                    if (tmp.includes("wgt-ads")) nmsl = true;
                }
                tmp = elem.id;
                if (typeof(tmp) == "string") {
                    var sima_id_baidu = ["s-top-left", "content_right", "rs", "right-billboard"];
                    if (sima_id_baidu.includes(tmp)) nmsl = true;
                }
                tmp = elem.getAttribute("data-tuiguang");
                if (typeof(tmp) == "string" && tmp != null) {
                    if (elem.innerText == "广告") {
                        for (var v = 1; v <= 5; v++) elem = elem.parentElement;
                        nmsl = true;
                        alert('nmsl');
                    }
                }
                tmp = elem.getAttribute("tpl");
                if (typeof(tmp) == "string" && tmp != null) {
                    if (tmp == "recommend_list") nmsl = true;
                }
            }

            //github check
            if (url.includes("github.com")) {
                tmp = elem.className;
                if (typeof(tmp) == "string") {
                    if (tmp.includes("py-2 my-2")) nmsl = true;
                }
            }

            //youtube check
            if (url.includes("youtube.com")) {
                tmp = elem.id;
                if (typeof(tmp) == "string") {
                    var sima_id_youtube = ["masthead-ad", "items"];
                    if (sima_id_youtube.includes(tmp)) nmsl = true;
                }
                tmp = elem.className;
                if (typeof(tmp) == "string") {
                    if (tmp.includes("ytd-watch-next-secondary-results-renderer")) nmsl = true;
                }
            }

            if (nmsl) elem.innerHTML = "";
        }

        catch(err) {
            alert("Error: " + err.message);
        }
    }
}

function restoreGlobalAPI(name) { //处理百度封MutationObserver的问题
    if (window[name]) return;
    var iframe = document.createElement('iframe');
    iframe.width = iframe.height = 0;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
     window[name] = iframe.contentWindow[name];
    iframe.remove();
}
restoreGlobalAPI('MutationObserver');

window.onload = fuck();

const config = { attributes: true, childList: true, subtree: true, characterData: true };
const observer = new MutationObserver(fuck);
observer.observe(document.documentElement, config);
