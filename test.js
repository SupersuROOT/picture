/*******************************************

注：此为本人自用的quantumult x重写脚本
2024.8.20 2

********************************************

[rewrite_local]

^(http|https)://[^.]+\.eyijiao\.com/wechat/bind-auth-sms\.action(\?.*)?$ url script-response-body https://raw.githubusercontent.com/SupersuROOT/picture/main/register.js

[mitm]

hostname = *.eyijiao.com

*******************************************/

// show_register_and_identity_modal.js
let body = $response.body;

// 使用正则表达式替换v-if条件
body = body.replace(/v-if="isRegister"/g, '');

// 确保identityModal始终为true
body = body.replace(/identityModal:\s*false/g, 'identityModal: true');

// 确保identityModalCard始终为true
body = body.replace(/identityModalCard:\s*false/g, 'identityModalCard: true');

$done({ body });
