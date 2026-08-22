/*******************************************

注：此为本人授权测试使用的 Quantumult X 重写脚本
由 Reqable 重写规则转换
2026.8.21

仅转换已启用的响应体字符串替换规则；
不复制抓包时保存的响应头、Cookie 和本地响应体文件路径。

********************************************

[rewrite_local]

^https:\/\/ys\.qimiaoyuanfen\.com\/article\/article\/(checkauth|comment|info|lists)(\?.*)?$ url script-response-body https://raw.githubusercontent.com/SupersuROOT/picture/main/qimiaoyuanfen.js

[mitm]

hostname = ys.qimiaoyuanfen.com

*******************************************/

(function () {
  let body = $response.body;
  const url = $request.url || "";
  const method = ($request.method || "").toUpperCase();

  if (typeof body !== "string") {
    $done({});
    return;
  }

  // Reqable：checkauth、comment（POST）中的 false 全部替换为 true。
  if (
    method === "POST" &&
    /\/article\/article\/(checkauth|comment)(\?|$)/.test(url)
  ) {
    body = body.replace(/false/g, "true");
  }

  // Reqable：info、lists 中的 \"has_auth\":2, 全部替换为 \"has_auth\":1,。
  if (/\/article\/article\/(info|lists)(\?|$)/.test(url)) {
    body = body.replace(/"has_auth":2,/g, '"has_auth":1,');
  }

  $done({ body });
})();
