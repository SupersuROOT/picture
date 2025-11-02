/*******************************************

注：此为本人自用的quantumult x重写脚本
2025.11.2 1

********************************************

[rewrite_local]

^https?:\/\/middle-school\.china-qzxy\.cn\/guardian\/recharge\/getSavePackage url script-response-body https://raw.githubusercontent.com/SupersuROOT/picture/main/watercard.js

[mitm]

hostname = middle-school.china-qzxy.cn

*******************************************/

;(function () {
  'use strict';
  let body = $response?.body || '';
  let obj;

  // 🔧 配置区 — 直接在这里添加或调整要修改的配置项
  const CONFIGS = [
    { id: 271, saveMoney: 50, giveMoney: 10000 },
    { id: 272, saveMoney: 100, giveMoney: 20000 },
    // 你可以继续往下加更多 ID
    // { id: 273, saveMoney: 200, giveMoney: 40000 },
  ];

  try {
    obj = JSON.parse(body);

    if (obj?.data && Array.isArray(obj.data)) {
      CONFIGS.forEach(cfg => {
        let target = obj.data.find(item => item.saveConfigId === cfg.id);
        if (target) {
          target.saveMoney = cfg.saveMoney;
          target.giveMoney = cfg.giveMoney;
          console.log(`✅ 已修改 ID ${cfg.id}: save=${cfg.saveMoney}, give=${cfg.giveMoney}`);
        } else {
          console.log(`⚠️ 未找到 ID ${cfg.id}`);
        }
      });
    } else {
      console.log('⚠️ 返回数据格式不符预期');
    }

    $done({ body: JSON.stringify(obj) });
  } catch (e) {
    console.log('❌ 脚本出错: ' + e);
    $done({ body });
  }
})();
