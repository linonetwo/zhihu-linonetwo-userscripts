// ==UserScript==
// @name                自动屏蔽知乎三无用户的评论
// @description:zh-CN   自动屏蔽无头像、无贡献、不友善用户的评论（目前仅实现头像检测，贡献检测太耗流量、基于 SoLiD 的云黑名单还在实验中）
// @author linonetwo
// @namespace           https://onetwo.ren/
// @match               *://*.zhihu.com/*
// @grant none
// @version             0.1
// @homepageURL         https://github.com/linonetwo/zhihu-linonetwo-userscripts
// @supportURL          https://github.com/linonetwo/zhihu-linonetwo-userscripts/issues
// @license             MIT
// @icon                https://pic1.zhimg.com/2e33f063f1bd9221df967219167b5de0_m.jpg
// @run-at 		        document-start
// @date                04/10/2019
// @modified            04/10/2019
// ==/UserScript==

const userscriptautocollapsed = 'userscriptautocollapsed';
const 默认头像的URL = 'https://pic4.zhimg.com/da8e974dc_s.jpg';
const 检查间隔毫秒 = 250;

const 给评论列表加上事件监听器 = () => {
    // 轮询直到评论列表加载完毕
    const intervalHandler = setInterval(() => {
        const 评论列表 = document.querySelector('div.CommentListV2');
        if (评论列表) {
            clearInterval(intervalHandler);
            自动隐藏没有头像的用户的评论();
            评论列表.addEventListener('mousemove', throttle(自动隐藏没有头像的用户的评论, 检查间隔毫秒));
            评论列表.addEventListener('scroll', throttle(自动隐藏没有头像的用户的评论, 检查间隔毫秒));
        }
    }, 检查间隔毫秒);
}

function 给评论按钮加上事件监听器以便给评论列表加上事件监听器() {
  [...document.querySelectorAll('button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel')] // 知乎的图片放在 figure 里面
    .filter(按钮 => 按钮.innerText.includes('评论'))
    .forEach(评论按钮 => 评论按钮.addEventListener('click', 给评论列表加上事件监听器, { passive : true }));
};

function 自动隐藏没有头像的用户的评论() {
  [...document.querySelectorAll('ul.NestComment'), ...document.querySelectorAll('li.NestComment--child')] // 选择每条评论
    .filter(评论 => {
      if (评论.dataset[userscriptautocollapsed]) return false;

      const 头像 = 评论.querySelector('img.Avatar');
      if (头像 && 头像.src === 默认头像的URL) return true;
    })
    .forEach(评论 => {
      评论.dataset[userscriptautocollapsed] = true;
      评论.style = "display: none;";
    });
};


// 知乎会延迟加载内容，所以当滚动页面的时候再检查一次
// From: https://www.sitepoint.com/throttle-scroll-events/
function throttle(fn, wait) {
  var time = Date.now();
  return function() {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  }
}

给评论按钮加上事件监听器以便给评论列表加上事件监听器();
setTimeout(() => window.addEventListener('scroll', throttle(给评论按钮加上事件监听器以便给评论列表加上事件监听器, 检查间隔毫秒), { passive : true }), 1);
