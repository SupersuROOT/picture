# 闪动校园净化脚本

这是按 Reqable 当前已有记录制作的 Quantumult X 响应净化脚本。抓包对应闪动校园 iOS 8.7.0（build 2）；分析时只使用了接口路径与响应结构，没有把令牌、请求头、设备标识或个人资料写入文件。

配置组织方式参考了墨鱼的哔哩哔哩净化资源；AI 视频、快手、1rtb 与福袋广告的精准拦截路径参考了 [fmz200 / 奶思规则的修正版](https://gist.github.com/wxs0625/5916630f6f8d8499375a8542cb0c7df4)。本脚本新增的 UI 结构净化均来自本次 Reqable 实际响应。

## 默认净化内容

- 首页功能入口只保留“运动”和“学习”；隐藏吃饭、鲜花、生活、品牌、商城、空间、搭子。
- 隐藏首页商品推荐位、首页横幅、广告弹窗、运动页活动弹窗和校园页横幅。
- 关闭应用返回的广告总开关、开屏广告、聚合广告与商城开关。
- 移除“省钱”动态分类、广告任务和外链拉新任务；保留跑步、计步等正常任务。
- 移除游戏入口并清除底栏红点。
- 精准拦截 AI 视频、快手广告请求、1rtb 广告请求及福袋广告请求；不封锁 `api.huachenjie.com` 整个域名。
- 不修改日常考勤、在线选课、体质测试、理论考试、体测成绩、学校活动、场馆预约等学校资源接口。

## 本地使用（推荐先测试）

1. 把 `ShanDongXiaoYuan.js` 复制到 `iCloud Drive/Quantumult X/Scripts` 或“我的 iPhone/Quantumult X/Scripts”。
2. 将 `ShanDongXiaoYuan.local.conf` 中 `[rewrite_local]` 下的规则合并到现有配置的同名段落；将 `hostname` 中的域名合并到现有 `[mitm]` 段落。不要在主配置里重复创建同名段落。
3. 确认 Quantumult X 的 MITM 证书已安装并受信任，然后启用重写。
4. 强制退出闪动校园后重新打开。若旧栏目仍在，清除应用缓存后再试。

## 极简模式

脚本默认使用稳妥模式。若还想隐藏校园动态、任务中心、“我的”扩展入口和元宇宙扩展入口，把脚本顶部改为：

```javascript
MINIMAL_MODE: true
```

## GitHub 与一键导入

- GitHub 目录：<https://github.com/SupersuROOT/picture/tree/main/QuantumultX/ShanDongXiaoYuan>
- 远程配置：<https://raw.githubusercontent.com/SupersuROOT/picture/main/QuantumultX/ShanDongXiaoYuan/ShanDongXiaoYuan.remote.conf>
- [Quantumult X 一键导入](https://quantumult.app/x/open-app/add-resource?remote-resource=%7B%22rewrite_remote%22%3A%5B%22https%3A%2F%2Fraw.githubusercontent.com%2FSupersuROOT%2Fpicture%2Fmain%2FQuantumultX%2FShanDongXiaoYuan%2FShanDongXiaoYuan.remote.conf%2C%20tag%3D%E9%97%AA%E5%8A%A8%E6%A0%A1%E5%9B%AD%E5%87%80%E5%8C%96%40SupersuROOT%2C%20update-interval%3D86400%2C%20opt-parser%3Dfalse%2C%20enabled%3Dtrue%22%5D%7D)

以上内容发布在公开仓库中，但不包含任何抓包正文、身份数据、令牌或设备标识。

## 已按抓包验证的响应接口

- `/run-front/ad/getAdConfig`
- `/run-front/ad/getAadPositionAgencyConfig`
- `/run-front/common/getConfig`
- `/run-front/api/common/getCommonConfig`
- `/run-front/home/homePage/config`
- `/run-front/home/promoSlots/config`
- `/run-front/home/getAdPopup`
- `/run-front/home/sports/getPopup`
- `/run-front/api/home/activityEntry`
- `/run-front/common/bottom-bar/redDot`
- `/run-front/api/tasks/available/list`
- `/run-front/api/works/category/list`
- `/run-front/api/user/cs/index`

脚本仅对 JSON 响应中已确认的字段做定点修改；解析失败或响应结构不符合预期时会原样放行。
