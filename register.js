/*******************************************

注：此为本人自用的quantumult x重写脚本
2023.8.6

********************************************

[rewrite_local]

^(http|https)://[^.]+\.eyijiao\.com/wechat/bind-auth-sms\.action(\?.*)?$ url script-response-body https://raw.githubusercontent.com/SupersuROOT/picture/main/register.js

[mitm]

hostname = *.eyijiao.com

*******************************************/

// 使用 document.querySelectorAll 获取所有具有指定类名的 span 元素
var elements = document.querySelectorAll('span.register');

// 遍历所有匹配的元素
elements.forEach(function(element) {
    // 检查元素是否具有 v-if 属性并且其值为 "isRegister"
    if (element.hasAttribute('v-if') && element.getAttribute('v-if') === 'isRegister') {
        // 移除 v-if 属性
        element.removeAttribute('v-if');
        
        // 确保保留其他属性
        element.setAttribute('class', 'register');
        element.setAttribute('@click', 'register');
        
        // 设置文本内容
        element.textContent = '没账号，去注册！';
    }
});
