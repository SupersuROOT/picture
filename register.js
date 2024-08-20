/*******************************************

注：此为本人自用的quantumult x重写脚本
2023.8.6

********************************************

[rewrite_local]

^(http|https)://[^.]+\.eyijiao\.com/wechat/bind-auth-sms\.action(\?.*)?$ url script-response-body https://raw.githubusercontent.com/SupersuROOT/picture/main/register.js

[mitm]

hostname = *.eyijiao.com

*******************************************/

// 使用 document.querySelector 或者其他的 DOM 操作方法来找到目标元素
var element = document.querySelector('span.register[v-if="isRegister"]');

// 如果找到了匹配的元素
if (element) {
    // 移除 v-if 属性
    element.removeAttribute('v-if');
    
    // 确保保留其他属性
    element.setAttribute('class', 'register');
    element.setAttribute('@click', 'register');
    
    // 设置文本内容
    element.textContent = '没账号，去注册！';
}
