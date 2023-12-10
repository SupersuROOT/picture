/*******************************************

注：此为本人自用的quantumult x重写脚本
2023.12.10 1

********************************************

[rewrite_local]

^https:\/\/www\.zhixue\.com\/appteacher\/home\/uniteLogin url script-response-body https://raw.githubusercontent.com/SupersuROOT/picture/main/hide.js

[mitm]

hostname = www.zhixue.com

*******************************************/
var body = $response.body;
var obj = JSON.parse(body);

if (obj.result && obj.result.user && obj.result.user.hasOwnProperty("name")) {
    obj.result.user["name"] = "匿名";
}
if (obj.result && obj.result.user && obj.result.user.userInfo && obj.result.user.userInfo.hasOwnProperty("loginName")) {
    obj.result.user.userInfo["loginName"] = "edc20201314";
}

body = JSON.stringify(obj);
$done({body});

