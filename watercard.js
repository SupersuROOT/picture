/*******************************************

注：此为本人自用的quantumult x重写脚本
2025.11.2 5

********************************************

[rewrite_local]

^https?:\/\/middle-school\.china-qzxy\.cn\/guardian\/recharge\/getSavePackage(\?.*)? url script-response-body https://raw.githubusercontent.com/SupersuROOT/picture/main/watercard.js

[mitm]

hostname = middle-school.china-qzxy.cn

*******************************************/

const modifyList = [
  { id: 271, saveMoney: 50, giveMoney: 20000 },
  { id: 272, saveMoney: 100, giveMoney: 20000 },
  { id: 273, saveMoney: 1500, giveMoney: 20000 },
  { id: 274, saveMoney: 1000, giveMoney: 20000 },
  { id: 275, saveMoney: 10000, giveMoney: 20000 },
  // 可以继续添加更多
  // { id: 273, saveMoney: 150, giveMoney: 30000 },
];

// 🧠 主逻辑
let body = $response.body;
try {
  let obj = JSON.parse(body);

  if (obj && Array.isArray(obj.data)) {
    for (let item of obj.data) {
      const match = modifyList.find(m => m.id === item.saveConfigId);
      if (match) {
        item.saveMoney = match.saveMoney;
        item.giveMoney = match.giveMoney;
        console.log(`✅ 修改成功 ID=${match.id} → saveMoney=${match.saveMoney}, giveMoney=${match.giveMoney}`);
      }
    }
  }

  body = JSON.stringify(obj);
} catch (e) {
  console.log("❌ JSON 解析失败：" + e);
}

$done({ body });
