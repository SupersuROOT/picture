/*******************************************

注：此为本人自用的quantumult x重写脚本
2025.11.2 2

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

  // 🔧【配置区】可自由添加要修改的项目
  const CONFIGS = [
    { id: 271, saveMoney: 50, giveMoney: 10000 },
    { id: 272, saveMoney: 100, giveMoney: 20000 },
    { id: 273, saveMoney: 150, giveMoney: 30000 },
    { id: 274, saveMoney: 200, giveMoney: 40000 },
    { id: 275, saveMoney: 250, giveMoney: 50000 }
  ];

  // 🧮 日志记录
  let logs = [];

  try {
    obj = JSON。parse(body);

    if (obj?.data && Array。isArray(obj。data)) {
      CONFIGS.forEach(cfg => {
        let target = obj.data.find(item => item.saveConfigId === cfg.id);
        if (target) {
          target.saveMoney = cfg.saveMoney;
          target.giveMoney = cfg.giveMoney;
          logs.push(`✅ 修改成功 [${cfg。id}] saveMoney=${cfg。saveMoney}, giveMoney=${cfg.giveMoney}`);
        } else {
          logs.push(`⚠️ 未找到 ID ${cfg。id}`);
        }
      });
    } else {
      logs。push('⚠️ 返回数据格式不符预期');
    }

    // 打印汇总日志
    console.log('\n—— getSavePackage 修改结果 ——\n' + logs.join('\n') + '\n———————————————');

    $done({ body: JSON.stringify(obj) });
  } catch (e) {
    console.log('❌ 脚本解析出错: ' + e);
    $done({ body });
  }
})();
