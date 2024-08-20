/*******************************************

注：此为本人自用的quantumult x重写脚本
2023.8.6

********************************************

[rewrite_local]

^(http|https)://[^.]+\.eyijiao\.com/wechat/bind-auth-sms\.action(\?.*)?$ url script-response-body https://raw.githubusercontent.com/SupersuROOT/picture/main/register.js

[mitm]

hostname = *.eyijiao.com

*******************************************/

// 获取所有带有 v-if 和 v-show 属性的元素
const elementsWithVIf = document.querySelectorAll('[v-if]');
const elementsWithVShow = document.querySelectorAll('[v-show]');

// 移除所有 v-if 属性并显示元素
elementsWithVIf.forEach(element => {
    element.removeAttribute('v-if');
    element.style.display = 'block';
});

// 移除所有 v-show 属性并显示元素
elementsWithVShow.forEach(element => {
    element.removeAttribute('v-show');
    element.style.display = 'block';
});
