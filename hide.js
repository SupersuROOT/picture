/*******************************************

注：此为本人自用的quantumult x重写脚本
2023.12.10 3

********************************************

[rewrite_local]

^https:\/\/www\.zhixue\.com\/appteacher\/home\/uniteLogin url script-response-body https://raw.githubusercontent.com/SupersuROOT/picture/main/hide.js

[mitm]

hostname = www.zhixue.com

*******************************************/
var body = $response.body;
var obj = JSON.parse(body);

if (obj.result && obj.result.user && obj.result.user.hasOwnProperty("name")) {
    obj.result.user["name"] = "none";
}
if (obj.result && obj.result.user && obj.result.user.userInfo && obj.result.user.userInfo.hasOwnProperty("loginName")) {
    obj.result.user.userInfo["loginName"] = "edc202072630";
}
if (obj.result && obj.result.user && obj.result.user.userInfo && obj.result.user.userInfo.school && obj.result.user.userInfo.school.hasOwnProperty("schoolName")) {
    obj.result.user.userInfo.school["schoolName"] = "石柱第一初级中学";
}

body = JSON.stringify(obj);
$done({body});

