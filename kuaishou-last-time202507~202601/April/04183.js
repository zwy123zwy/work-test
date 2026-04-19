/**
 * 04183.js
 * 题目 + 函数骨架 + 标准答案
 */

const questions = [
  { id: 1, title: '实现 EventEmitter', prompt: '支持 on、off、once、emit。', starter: 'class EventEmitter {\n  // TODO\n}', answer: '标准解法：events 用 Map<string, Set<fn>> 存储；on 注册，off 删除，once 用包装函数执行后自删，emit 复制订阅列表后逐个触发避免遍历期被修改。', focus: ['发布订阅'] },
  { id: 2, title: '实现事件代理', prompt: '父节点代理子节点点击。', starter: 'function delegate(root, selector, type, handler) {\n  // TODO\n}', answer: '标准解法：在 root 上监听 type，事件触发后从 event.target 向上冒泡查找匹配 selector 的节点，找到后用该节点作为 this 执行 handler。', focus: ['事件冒泡'] },
  { id: 3, title: '实现 getType', prompt: '准确识别常见类型。', starter: 'function getType(value) {\n  // TODO\n}', answer: '标准解法：null 单独返回 null；其余使用 Object.prototype.toString.call(value).slice(8, -1).toLowerCase()。', focus: ['类型判断'] },
  { id: 4, title: '解析 queryString', prompt: 'URL 参数转对象。', starter: 'function parseQueryString(url) {\n  // TODO\n}', answer: '标准解法：取 ? 后面的查询串，按 & 切分，再按 = 切键值；decodeURIComponent 解码；同名键可合并为数组。', focus: ['URL 处理'] },
  { id: 5, title: '对象转 queryString', prompt: '支持数组值。', starter: 'function stringifyQuery(obj) {\n  // TODO\n}', answer: '标准解法：遍历对象；普通值输出 key=value，数组值重复输出多个同名参数；统一 encodeURIComponent 编码。', focus: ['参数序列化'] },
  { id: 6, title: '实现图片懒加载', prompt: '基于 IntersectionObserver。', starter: 'function lazyLoadImages(selector) {\n  // TODO\n}', answer: '标准解法：创建 IntersectionObserver；元素进入视口时把 data-src 赋给 src，加载后 unobserve；不支持时退化为滚动监听。', focus: ['性能优化'] },
  { id: 7, title: '实现复制文本', prompt: '优先 Clipboard API。', starter: 'async function copyText(text) {\n  // TODO\n}', answer: '标准解法：优先 navigator.clipboard.writeText；失败时创建 textarea 选中并 document.execCommand("copy")；最后清理临时节点。', focus: ['兼容性'] },
  { id: 8, title: '批量测量布局', prompt: '减少回流。', starter: 'function measureBatch(nodes) {\n  // TODO\n}', answer: '标准解法：把所有读取布局的操作放在一帧内集中执行，统一调用 getBoundingClientRect 收集结果，再在下一阶段做写入，避免读写交替导致强制回流。', focus: ['重排重绘'] },
  { id: 9, title: '拖拽排序', prompt: '列表项位置重排。', starter: 'function sortable(listEl) {\n  // TODO\n}', answer: '标准解法：mousedown 记录起点和目标元素；mousemove 计算位移并插入占位元素；mouseup 确认位置并清理状态。移动端可改为 pointer 事件。', focus: ['拖拽交互'] },
  { id: 10, title: '实现虚拟列表', prompt: '仅渲染可视区。', starter: 'function createVirtualList({ itemHeight, data, container }) {\n  // TODO\n}', answer: '标准解法：根据 scrollTop 计算 startIndex/endIndex；渲染 data.slice(start, end)；外层撑起总高度，内层用 translateY 把可视区列表顶到正确位置。', focus: ['大列表性能'] },
  { id: 11, title: '实现简易 diffDom', prompt: '比较新旧节点。', starter: 'function diff(oldNode, newNode) {\n  // TODO\n}', answer: '标准解法：先比较类型和 key，不同则整节点替换；相同则更新 props，再递归比较 children；文本节点则比较文本内容。', focus: ['渲染机制'] },
  { id: 12, title: '封装 delegate 工具', prompt: '按选择器代理事件。', starter: 'function createDelegate(root) {\n  // TODO\n}', answer: '标准解法：返回 on(selector, type, handler) 接口；内部复用事件冒泡查找逻辑；一个 root + type 最好只挂一个原生监听器。', focus: ['工具封装'] },
  { id: 13, title: '动态加载 script', prompt: '返回 Promise。', starter: 'function preloadScript(src) {\n  // TODO\n}', answer: '标准解法：创建 script 节点并设置 src；load 时 resolve，error 时 reject；为避免重复加载可用 Map 记录 src -> Promise。', focus: ['资源加载'] },
  { id: 14, title: '空闲预取队列', prompt: '空闲时拉取资源。', starter: 'function createPrefetchQueue() {\n  // TODO\n}', answer: '标准解法：维护待预取队列，使用 requestIdleCallback 在空闲切片中逐个插入 link rel="prefetch" 或发起 fetch；没有 requestIdleCallback 时退化为 setTimeout。', focus: ['空闲调度'] },
  { id: 15, title: '首次进入视口触发', prompt: '元素只触发一次。', starter: 'function onceVisible(el, callback) {\n  // TODO\n}', answer: '标准解法：IntersectionObserver 监听元素进入视口，首次 isIntersecting 为 true 时执行 callback，并立即 unobserve。', focus: ['观察器'] },
  { id: 16, title: '禁止 body 滚动', prompt: '弹窗打开时锁定背景。', starter: 'function bodyScrollLock(locked) {\n  // TODO\n}', answer: '标准解法：记录当前 scrollTop；锁定时给 body 设置 position: fixed、top 负偏移和 width:100%；解锁时恢复样式并 scrollTo 原位置。', focus: ['移动端兼容'] },
  { id: 17, title: '实现 hash 路由', prompt: '支持 beforeEach。', starter: 'class HashRouter {\n  // TODO\n}', answer: '标准解法：监听 hashchange 和 load；push 通过 location.hash 更新路径；beforeEach 维护守卫数组，切换前串行执行守卫决定是否放行。', focus: ['路由原理'] },
  { id: 18, title: '实现 history 路由监听', prompt: '封装 pushState/replaceState。', starter: 'class HistoryRouter {\n  // TODO\n}', answer: '标准解法：重写 history.pushState 和 replaceState，在调用原方法后主动派发自定义事件；同时监听 popstate；路由变化统一通知订阅者。', focus: ['history API'] },
  { id: 19, title: '实现埋点 SDK 核心', prompt: '自动采集点击和停留时长。', starter: 'class TrackingSDK {\n  // TODO\n}', answer: '标准解法：点击埋点通过事件代理采集 data-track；页面停留时长通过进入时间与 beforeunload/pagehide 时间差计算；统一批量缓存后上报。', focus: ['采集设计'] },
  { id: 20, title: '实现崩溃页检测', prompt: '基于心跳或 iframe。', starter: 'function detectCrash(report) {\n  // TODO\n}', answer: '标准解法：周期性心跳更新时间戳；如果页面恢复时发现心跳长时间中断且非正常离开，可判定曾经崩溃；复杂场景可借助同源 iframe 保活做对照探测。', focus: ['稳定性'] },
];

module.exports = questions;
