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

if (obj.hasOwnProperty("name")) {
    obj["name"] = "匿名";
}
if (obj.hasOwnProperty("loginName")) {
    obj["loginName"] = "edc20201314";
}

body = JSON.stringify(obj);
$done({body});
