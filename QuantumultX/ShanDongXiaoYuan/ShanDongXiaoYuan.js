/**
 * 闪动校园净化（Quantumult X）
 *
 * 适配依据：Reqable 中闪动校园 8.7.0（iOS）的现有抓包记录。
 * 目标：关闭广告开关、移除首页商业入口/商品推荐位/弹窗/校园动态，
 *       隐藏“本校”底栏入口，并过滤广告与外链拉新任务；
 *       不修改跑步、考勤、选课、体测等业务数据。
 *
 * 将 MINIMAL_MODE 改为 true 可进一步隐藏社交、任务及“我的”扩展入口。
 */

var SDXY_OPTIONS = {
  MINIMAL_MODE: false,
  HIDE_CAMPUS_FEED: true,
  HIDE_SCHOOL_TAB: true,
  KEEP_HOME_ENTRIES: ["运动", "学习"],
  REMOVE_WORK_CATEGORIES: ["省钱"],
  REMOVE_TASK_TYPES: [9, 10]
};

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function sameValue(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function setValue(target, key, value, actions, label) {
  if (!isObject(target) || sameValue(target[key], value)) return false;
  target[key] = value;
  actions.push(label || key);
  return true;
}

function filterArray(target, key, predicate, actions, label) {
  if (!isObject(target) || !Array.isArray(target[key])) return false;
  var next = target[key].filter(predicate);
  if (next.length === target[key].length) return false;
  target[key] = next;
  actions.push(label || key);
  return true;
}

function requestPath(url) {
  return String(url || "")
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/[?#].*$/, "");
}

function disableAdConfig(data, actions) {
  var changed = false;
  changed = setValue(data, "openScreenAdSwitch", false, actions, "关闭开屏广告") || changed;
  changed = setValue(data, "bambooMallSwitch", false, actions, "关闭竹子商城广告") || changed;
  changed = setValue(data, "openFlag", false, actions, "关闭广告总开关") || changed;
  changed = setValue(data, "compliance", false, actions, "关闭广告合规位") || changed;
  if (Array.isArray(data.adInfoList)) {
    for (var i = 0; i < data.adInfoList.length; i += 1) {
      var item = data.adInfoList[i];
      if (!isObject(item)) continue;
      if (item.openFlag !== false) {
        item.openFlag = false;
        changed = true;
      }
      if (item.adType !== 0) {
        item.adType = 0;
        changed = true;
      }
    }
    if (changed) actions.push("关闭全部广告位");
  }
  return changed;
}

function disableAgencyAdConfig(data, actions) {
  var changed = false;
  changed = setValue(data, "adSwitch", false, actions, "关闭聚合广告") || changed;
  changed = setValue(data, "bambooMallSwitch", false, actions, "关闭商城广告") || changed;
  changed = setValue(data, "adPositionList", [], actions, "清空广告位") || changed;
  return changed;
}

function cleanCommonConfig(data, options, actions) {
  var changed = false;
  changed = setValue(data, "mallSwitch", false, actions, "隐藏商城") || changed;
  changed = setValue(data, "buddyEnable", false, actions, "隐藏搭子") || changed;
  changed = setValue(data, "dedicatedSupportSwitch", false, actions, "隐藏专属客服推广") || changed;

  if (options.HIDE_CAMPUS_FEED) {
    changed = setValue(data, "collegeWorksSwitch", false, actions, "隐藏校园新鲜事") || changed;
  }
  if (options.HIDE_SCHOOL_TAB) {
    changed = setValue(data, "mySchoolEnable", false, actions, "隐藏本校底栏入口") || changed;
  }

  changed = filterArray(
    data,
    "liveEntryList",
    function (item) {
      var url = isObject(item) ? String(item.url || "") : "";
      return !(isObject(item) && (item.entryType === 19 || /moxigame\.cn/i.test(url)));
    },
    actions,
    "移除游戏入口"
  ) || changed;

  if (Array.isArray(data.homeMetaEntryList)) {
    for (var i = 0; i < data.homeMetaEntryList.length; i += 1) {
      var entry = data.homeMetaEntryList[i];
      if (isObject(entry) && entry.entryType === 19 && entry.switchFlag !== false) {
        entry.switchFlag = false;
        changed = true;
      }
    }
    if (changed && actions.indexOf("关闭游戏入口开关") === -1) {
      actions.push("关闭游戏入口开关");
    }
  }

  if (options.MINIMAL_MODE) {
    changed = setValue(data, "collegeWorksSwitch", false, actions, "隐藏校园动态") || changed;
    changed = setValue(data, "liveEntryList", [], actions, "隐藏发现页扩展入口") || changed;
    changed = setValue(data, "myEntryList", [], actions, "隐藏我的页面扩展入口") || changed;
    changed = setValue(data, "taskDisplayCount", 0, actions, "隐藏任务栏目") || changed;
    if (Array.isArray(data.homeMetaEntryList)) {
      for (var j = 0; j < data.homeMetaEntryList.length; j += 1) {
        if (isObject(data.homeMetaEntryList[j])) {
          data.homeMetaEntryList[j].switchFlag = false;
        }
      }
      actions.push("关闭元宇宙扩展入口");
      changed = true;
    }
  }
  return changed;
}

function cleanHomePage(data, options, actions) {
  var changed = false;
  var keep = options.KEEP_HOME_ENTRIES || [];
  changed = filterArray(
    data,
    "functionEntries",
    function (item) {
      return isObject(item) && keep.indexOf(item.name) !== -1 && item.isShow !== false;
    },
    actions,
    "首页仅保留运动与学习"
  ) || changed;
  changed = setValue(data, "hasSeaview", false, actions, "隐藏首页横幅") || changed;
  return changed;
}

function cleanTasks(data, options, actions) {
  var changed = false;
  if (options.MINIMAL_MODE) {
    return setValue(data, "list", [], actions, "隐藏全部任务");
  }
  var blocked = options.REMOVE_TASK_TYPES || [];
  changed = filterArray(
    data,
    "list",
    function (item) {
      return !isObject(item) || blocked.indexOf(item.taskType) === -1;
    },
    actions,
    "移除广告与外链推广任务"
  ) || changed;
  return changed;
}

function cleanWorksFeed(data, actions) {
  var changed = false;
  changed = setValue(data, "list", [], actions, "清空校园新鲜事内容") || changed;
  changed = setValue(data, "total", 0, actions, "清零动态数量") || changed;
  changed = setValue(data, "hasNext", false, actions, "关闭动态翻页") || changed;
  changed = setValue(data, "empty", true, actions, "标记动态为空") || changed;
  changed = setValue(data, "totalPage", 0, actions, "清零动态页数") || changed;
  return changed;
}

function purify(url, body, options) {
  var source = typeof body === "string" ? body : "";
  var root;
  try {
    root = JSON.parse(source);
  } catch (error) {
    return { body: source, changed: false, actions: ["响应不是有效 JSON"] };
  }

  if (!isObject(root) || !isObject(root.data)) {
    return { body: source, changed: false, actions: ["响应缺少 data 对象"] };
  }

  var data = root.data;
  var path = requestPath(url);
  var actions = [];
  var changed = false;

  if (path === "/run-front/ad/getAdConfig") {
    changed = disableAdConfig(data, actions) || changed;
  } else if (path === "/run-front/ad/getAadPositionAgencyConfig") {
    changed = disableAgencyAdConfig(data, actions) || changed;
  } else if (path === "/run-front/common/getConfig") {
    changed = setValue(data, "shopSwitch", false, actions, "隐藏商店") || changed;
    changed = setValue(data, "mallSwitch", false, actions, "隐藏商城") || changed;
    if (options.MINIMAL_MODE) {
      changed = setValue(data, "taskEnable", false, actions, "隐藏任务中心") || changed;
      changed = setValue(data, "dailySignEnable", false, actions, "隐藏每日签到") || changed;
    }
  } else if (path === "/run-front/api/common/getCommonConfig") {
    changed = cleanCommonConfig(data, options, actions) || changed;
  } else if (path === "/run-front/home/homePage/config") {
    changed = cleanHomePage(data, options, actions) || changed;
  } else if (path === "/run-front/home/promoSlots/config") {
    changed = setValue(data, "promoSlots", [], actions, "清空首页商品推荐位") || changed;
  } else if (path === "/run-front/home/getAdPopup") {
    changed = setValue(data, "hasPopup", false, actions, "关闭首页广告弹窗") || changed;
  } else if (path === "/run-front/home/sports/getPopup") {
    changed = setValue(data, "activityPopupFlag", false, actions, "关闭运动页活动弹窗") || changed;
  } else if (path === "/run-front/api/home/activityEntry") {
    changed = setValue(data, "activityShowFlag", false, actions, "隐藏活动入口") || changed;
  } else if (path === "/run-front/common/bottom-bar/redDot") {
    var redDotKeys = Object.keys(data);
    for (var k = 0; k < redDotKeys.length; k += 1) {
      changed = setValue(data, redDotKeys[k], false, actions, "清除底栏红点") || changed;
    }
  } else if (path === "/run-front/api/tasks/available/list") {
    changed = cleanTasks(data, options, actions) || changed;
  } else if (
    path === "/run-front/api/works/recommend/list" ||
    path === "/run-front/api/works/recommend/pool/list"
  ) {
    if (options.HIDE_CAMPUS_FEED) {
      changed = cleanWorksFeed(data, actions) || changed;
    }
  } else if (path === "/run-front/api/works/category/list") {
    if (options.MINIMAL_MODE) {
      changed = setValue(data, "list", [], actions, "隐藏动态分类") || changed;
    } else {
      var removedCategories = options.REMOVE_WORK_CATEGORIES || [];
      changed = filterArray(
        data,
        "list",
        function (item) {
          return !isObject(item) || removedCategories.indexOf(item.categoryName) === -1;
        },
        actions,
        "移除推广分类"
      ) || changed;
    }
  } else if (path === "/run-front/api/user/cs/index") {
    changed = setValue(data, "bannerList", [], actions, "清空校园页横幅") || changed;
  }

  return {
    body: changed ? JSON.stringify(root) : source,
    changed: changed,
    actions: actions
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    SDXY_OPTIONS: SDXY_OPTIONS,
    requestPath: requestPath,
    purify: purify
  };
}

if (
  typeof $done === "function" &&
  typeof $request !== "undefined" &&
  typeof $response !== "undefined"
) {
  var output = purify($request.url, $response.body, SDXY_OPTIONS);
  if (typeof console !== "undefined" && output.actions.length) {
    console.log("[闪动校园净化] " + output.actions.join("、"));
  }
  $done(output.changed ? { body: output.body } : {});
}
