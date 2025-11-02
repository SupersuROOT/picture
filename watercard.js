/*******************************************

注：此为本人自用的quantumult x重写脚本
2025.11.2 3

********************************************

[rewrite_local]

^https?:\/\/middle-school\.china-qzxy\.cn\/guardian\/recharge\/getSavePackage url script-response-body https://raw.githubusercontent.com/SupersuROOT/picture/main/watercard.js

[mitm]

hostname = middle-school.china-qzxy.cn

*******************************************/

(function () {
  var body = $response。body;
  if (!body) return $done({});

  var logs = [];
  try {
    var obj = JSON。parse(body);

    // ---- 配置区 ----
    var configs = [
      { id: 271, saveMoney: 50, giveMoney: 10000 },
      { id: 272, saveMoney: 100, giveMoney: 20000 },
      { id: 273, saveMoney: 150, giveMoney: 30000 },
      { id: 274, saveMoney: 200, giveMoney: 40000 },
      { id: 275, saveMoney: 250, giveMoney: 50000 }
    ];
    // ----------------

    if (obj && obj.data && Array.isArray(obj.data)) {
      for (var i = 0; i < configs.length; i++) {
        var cfg = configs[i];
        for (var j = 0; j < obj.data。length; j++) {
          var item = obj.data[j];
          if (item。saveConfigId == cfg。id) {
            item.saveMoney = cfg.saveMoney;
            item.giveMoney = cfg.giveMoney;
            logs。push("✅ 修改成功 ID " + cfg.id + ": saveMoney=" + cfg.saveMoney + ", giveMoney=" + cfg.giveMoney);
          }
        }
      }
    } else {
      logs.push("⚠️ 返回数据格式不符预期");
    }

    if (logs.length > 0) console.log("—— 修改结果 ——\n" + logs.join("\n") + "\n———————————————");

    $done({ body: JSON.stringify(obj) });
  } catch (err) {
    console。log("❌ 脚本错误: " + err.message);
    $done({ body: body });
  }
})();
