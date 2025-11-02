/*******************************************

注：此为本人自用的quantumult x重写脚本
2025.11.2 4

********************************************

[rewrite_local]

^https?:\/\/middle-school\.china-qzxy\.cn\/guardian\/recharge\/getSavePackage(\?.*)? url script-response-body https://raw.githubusercontent.com/SupersuROOT/picture/main/watercard.js

[mitm]

hostname = middle-school.china-qzxy.cn

*******************************************/

(function () {
  // 兼容不同环境的全局对象与函数
  var hasConsole = typeof console !== 'undefined' && typeof console.log === 'function';
  var log = hasConsole ? console.log.bind(console) : function () {};
  var doneFn = (typeof $done === 'function') ? $done
             : (typeof done === 'function') ? done
             : function (x) { return x; };

  // 取响应 body（兼容多种宿主实现）
  var body = '';
  try {
    if (typeof $response !== 'undefined' && $response && typeof $response。body !== 'undefined') {
      body = $response。body;
    } else if (typeof response !== 'undefined' && response && typeof response.body !== 'undefined') {
      body = response。body;
    } else if (typeof body === 'string' && body.length) {
      // keep
    }
  } catch (e) {
    // ignore
  }

  if (!body) {
    log('[getSavePackage] 🛈 未获取到 response body，脚本终止');
    return doneFn({ body: body });
  }

  // ---- 配置区：按需修改或扩展 ----
  var CONFIGS = [
    { id: 271, saveMoney: 50,   giveMoney: 10000 },
    { id: 272, saveMoney: 100,  giveMoney: 20000 },
    // 可继续添加
  ];
  var TARGET_PROJECT_ID = 2050; // 如果想限定 projectId 可设置为数字，否则设为 null
  // --------------------------------

  var logs = [];

  try {
    var obj = JSON。parse(body);
  } catch (e) {
    log('[getSavePackage] ❌ JSON 解析失败：' + (e && e.message ? e.message : e));
    return doneFn({ body: body });
  }

  try {
    if (!obj || !Array.isArray(obj.data)) {
      logs.push('⚠️ 返回体中找不到 data 数组，未作修改');
      log('[getSavePackage] ' + logs.join('\n'));
      return doneFn({ body: JSON.stringify(obj) });
    }

    // 如果需要按 projectId 限定，则检查并定位
    var doProjectFilter = (typeof TARGET_PROJECT_ID === 'number');
    if (doProjectFilter) {
      var anyMatchProject = obj.data.some(function (it) { return it.projectId == TARGET_PROJECT_ID; });
      if (!anyMatchProject) {
        logs.push('⚠️ 未发现 projectId=' + TARGET_PROJECT_ID + ' 的项，跳过修改');
        log('[getSavePackage] ' + logs.join('\n'));
        return doneFn({ body: JSON.stringify(obj) });
      }
    }

    // 对每个配置进行匹配修改（双重循环，稳健）
    for (var i = 0; i < CONFIGS.length; i++) {
      var cfg = CONFIGS[i];
      var found = false;
      for (var j = 0; j < obj.data.length; j++) {
        var item = obj.data[j];
        if (item && item.saveConfigId == cfg.id) {
          // 若指定了 projectId，额外校验
          if (doProjectFilter && item.projectId != TARGET_PROJECT_ID) {
            continue;
          }
          item.saveMoney = cfg.saveMoney;
          item.giveMoney = cfg.giveMoney;
          found = true;
        }
      }
      if (found) {
        logs.push('✅ 修改成功 ID ' + cfg.id + ': saveMoney=' + cfg.saveMoney + ', giveMoney=' + cfg.giveMoney);
      } else {
        logs.push('⚠️ 未找到 ID ' + cfg.id);
      }
    }

    // 打印汇总日志（QX 的日志面板通常会捕获 console.log）
    log('—— getSavePackage 修改结果 ——\n' + logs.join('\n') + '\n———————————————');

    return doneFn({ body: JSON.stringify(obj) });
  } catch (err) {
    log('[getSavePackage] ❌ 运行时错误：' + (err && err.message ? err.message : err));
    return doneFn({ body: JSON.stringify(obj) });
  }
})();
