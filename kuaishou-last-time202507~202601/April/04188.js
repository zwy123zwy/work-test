const questions = [
  { id: 1, title: '价格日历数据转换', prompt: '后端数据转月视图。', starter: 'function buildPriceCalendar(list) {\n  // TODO\n}', answer: '标准解法：把日期列表转成 date -> price 的 Map，再按月份日历格子补齐空白天，输出周视图二维数组。', focus: ['数据建模'] },
  { id: 2, title: '酒店列表筛选器', prompt: '支持多条件筛选排序。', starter: 'function filterHotels(list, filters) {\n  // TODO\n}', answer: '标准解法：先按条件链式过滤，再根据排序字段和方向统一排序；复杂筛选建议把规则封装为 predicates 数组。', focus: ['组合过滤'] },
  { id: 3, title: '航班列表缓存层', prompt: '相同条件命中缓存。', starter: 'function createFlightCache() {\n  // TODO\n}', answer: '标准解法：查询参数序列化为 key，Map 存 data + expireAt；命中且未过期直接返回，否则重新请求并刷新缓存。', focus: ['缓存策略'] },
  { id: 4, title: '请求去重器', prompt: '相同接口并发只发一次。', starter: 'function dedupeRequest(fetcher) {\n  // TODO\n}', answer: '标准解法：用 key -> Promise 的 Map 管理进行中的请求；重复调用复用同一个 Promise，settle 后删除。', focus: ['请求合并'] },
  { id: 5, title: '接口熔断器', prompt: '连续失败后快速失败。', starter: 'function createCircuitBreaker(task) {\n  // TODO\n}', answer: '标准解法：closed/open/half-open 三态；失败次数超阈值进入 open，冷却期后进入 half-open 做一次探测，成功恢复 closed。', focus: ['稳定性设计'] },
  { id: 6, title: '降级兜底策略', prompt: '主接口失败时回退。', starter: 'async function requestWithFallback(primary, fallback) {\n  // TODO\n}', answer: '标准解法：先调主接口，失败或超时则切 fallback；必要时记录降级标志，避免页面无感知地使用脏数据。', focus: ['容灾'] },
  { id: 7, title: '城市搜索索引', prompt: '支持拼音与别名。', starter: 'function buildCityIndex(cities) {\n  // TODO\n}', answer: '标准解法：为每个城市预生成中文、全拼、首字母、英文别名等检索键，统一 lowerCase 后放入倒排索引。', focus: ['搜索体验'] },
  { id: 8, title: '最近浏览记录管理', prompt: '分类并限制容量。', starter: 'function createRecentStore(limit) {\n  // TODO\n}', answer: '标准解法：按业务模块维护数组或 Map；插入时先删除旧项再头插，超限则截断；同步到 localStorage。', focus: ['本地存储'] },
  { id: 9, title: '登录态续期器', prompt: 'token 快过期自动刷新。', starter: 'function createTokenRefresher() {\n  // TODO\n}', answer: '标准解法：解析 token 过期时间，设置提前刷新阈值；多个请求同时触发刷新时复用同一个 refreshPromise；刷新失败统一登出。', focus: ['鉴权流程'] },
  { id: 10, title: '购物车价格联动', prompt: '商品、优惠变化实时重算。', starter: 'function calcCart(cart, coupons, benefits) {\n  // TODO\n}', answer: '标准解法：先汇总商品总价，再按规则顺序应用优惠券、权益、立减和运费；最终输出明细项和总价，保证计算链路可追踪。', focus: ['状态派生'] },
  { id: 11, title: '订单倒计时', prompt: '切后台回来仍准确。', starter: 'function createCountdown(endTime) {\n  // TODO\n}', answer: '标准解法：不要递减本地秒数，改为每次用 endTime - Date.now() 计算剩余时间；页面隐藏恢复后自动校正。', focus: ['时间同步'] },
  { id: 12, title: '埋点批量上报器', prompt: '支持缓存和补发。', starter: 'function createTracker() {\n  // TODO\n}', answer: '标准解法：事件先进入队列，达到条数或时间阈值批量发送；pagehide/beforeunload 用 sendBeacon 补发；失败时本地暂存重试。', focus: ['监控链路'] },
  { id: 13, title: '广告曝光统计', prompt: '同一资源只统计一次。', starter: 'function trackExposure(elements) {\n  // TODO\n}', answer: '标准解法：IntersectionObserver 观察广告位，首次进入视口且满足展示阈值时上报，并把资源 id 记入 Set 防重复。', focus: ['视口检测'] },
  { id: 14, title: '优惠券可用性计算器', prompt: '判断可用状态。', starter: 'function validateCoupon(coupon, cart) {\n  // TODO\n}', answer: '标准解法：先校验时间范围和状态，再校验门槛、商品范围、互斥关系和用户身份；输出可用/不可用及具体原因。', focus: ['规则引擎'] },
  { id: 15, title: '搜索建议排序', prompt: '综合热度和个性化。', starter: 'function rankSuggestions(items, ctx) {\n  // TODO\n}', answer: '标准解法：定义多维得分，如前缀匹配、热度、历史点击、实验权重，统一加权后排序；得分相同按原始权威顺序兜底。', focus: ['排序策略'] },
  { id: 16, title: '骨架屏控制器', prompt: '超过阈值才展示。', starter: 'function withSkeleton(task, delay = 200) {\n  // TODO\n}', answer: '标准解法：启动任务同时开延迟定时器；若任务在 delay 内完成则不展示骨架，超出 delay 才显示，结束后再隐藏。', focus: ['体验优化'] },
  { id: 17, title: '页面级数据预取', prompt: 'hover 卡片预拉详情。', starter: 'function prefetchOnHover(el, fetcher) {\n  // TODO\n}', answer: '标准解法：mouseenter 时延迟短暂触发预取，避免误触；请求结果放入缓存，真正进入详情页直接命中。', focus: ['预取'] },
  { id: 18, title: '多 Tab 登录同步', prompt: '一处退出全局退出。', starter: 'function syncLogout() {\n  // TODO\n}', answer: '标准解法：退出时写 localStorage 特定键；其余 Tab 监听 storage 事件，检测到该键变化后同步清理登录态并跳转。', focus: ['storage 事件'] },
  { id: 19, title: '本地草稿箱', prompt: '表单自动保存并恢复。', starter: 'function createDraftStore(key) {\n  // TODO\n}', answer: '标准解法：表单值变更后防抖写 localStorage/IndexedDB，进入页面时尝试恢复；提交成功后清理草稿。', focus: ['容错体验'] },
  { id: 20, title: '灰度发布判断器', prompt: '按用户 id 命中灰度。', starter: 'function inGray(userId, ratio) {\n  // TODO\n}', answer: '标准解法：对 userId 做稳定 hash，取模映射到 0-99 或 0-9999 区间，小于灰度比例则命中，保证同一用户稳定落在同一桶。', focus: ['发布策略'] },
];

module.exports = questions;
