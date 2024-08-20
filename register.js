/*******************************************

注：此为本人自用的quantumult x重写脚本
2023.8.6

********************************************

[rewrite_local]

^(http|https)://[^.]+\.eyijiao\.com/wechat/bind-auth-sms\.action(\?.*)?$ url script-response-body https://raw.githubusercontent.com/SupersuROOT/picture/main/register.js

[mitm]

hostname = *.eyijiao.com

*******************************************/

// show_register_button.js
let body = $response.body;

// 使用正则表达式替换v-if条件
body = body.replace(/v-if="isRegister"/g, '');

$done({ body });
