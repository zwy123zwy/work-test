const questions = [
  { id: 1, title: '实现前端测速器', prompt: '采集关键性能指标。', starter: 'function collectTiming() {\n  // TODO\n}', answer: '标准解法：读取 performance.getEntriesByType("navigation")，计算 DNS、TCP、TTFB、DOMReady、load 等阶段耗时并标准化输出。', focus: ['Performance API'] },
  { id: 2, title: '采集 FCP/LCP', prompt: '封装 PerformanceObserver。', starter: 'function observePaint() {\n  // TODO\n}', answer: '标准解法：PerformanceObserver 监听 paint 和 largest-contentful-paint；分别收集 FCP/LCP，页面隐藏时上报最终值。', focus: ['Web Vitals'] },
  { id: 3, title: '实现 CLS 统计', prompt: '收集布局偏移。', starter: 'function observeCLS() {\n  // TODO\n}', answer: '标准解法：PerformanceObserver 监听 layout-shift；仅累计非 recentInput 的 entry 值，页面隐藏前输出累积结果。', focus: ['稳定性指标'] },
  { id: 4, title: '长任务监控', prompt: '记录超过 50ms 任务。', starter: 'function observeLongTask() {\n  // TODO\n}', answer: '标准解法：PerformanceObserver 监听 longtask，提取 duration、startTime 和 attribution，定位主线程卡顿来源。', focus: ['Long Task'] },
  { id: 5, title: '资源加载错误采集', prompt: '采集 img/script/link 错误。', starter: 'function monitorResourceError(report) {\n  // TODO\n}', answer: '标准解法：window.addEventListener("error", handler, true)；捕获阶段监听资源节点加载失败，并上报 tagName、src/href。', focus: ['异常监控'] },
  { id: 6, title: 'JS 运行时错误采集', prompt: '覆盖 Promise 错误。', starter: 'function monitorJSError(report) {\n  // TODO\n}', answer: '标准解法：同步错误用 window.onerror，异步未处理错误用 unhandledrejection；上报 message、stack、页面信息。', focus: ['错误监控'] },
  { id: 7, title: '接口耗时统计', prompt: '包装 fetch/XHR。', starter: 'function wrapFetch(fetchImpl) {\n  // TODO\n}', answer: '标准解法：请求前记录 startTime，请求结束或失败时计算耗时；慢请求单独标记，上报 url、method、status、duration。', focus: ['请求监控'] },
  { id: 8, title: '白屏检测', prompt: '判断首屏是否异常。', starter: 'function detectBlankScreen() {\n  // TODO\n}', answer: '标准解法：在首屏采样多个关键点，判断这些点上命中的 DOM 是否始终是 html/body 等根元素；若关键点缺少业务节点可判定疑似白屏。', focus: ['稳定性分析'] },
  { id: 9, title: '首屏图片预加载', prompt: '优先加载关键资源。', starter: 'function preloadHeroImages(urls) {\n  // TODO\n}', answer: '标准解法：在文档头插入 preload link 或创建 Image 对象提前拉取；只预取首屏核心资源，避免抢占过多带宽。', focus: ['加载优化'] },
  { id: 10, title: '资源优先级调度', prompt: '首屏与次屏分层。', starter: 'function scheduleAssets(assets) {\n  // TODO\n}', answer: '标准解法：按 critical、nearby、idle 分组；关键资源立即加载，次屏资源在 load 后拉取，低优先级资源放到 requestIdleCallback。', focus: ['调度策略'] },
  { id: 11, title: '分页缓存策略', prompt: '返回列表页秒开。', starter: 'function createPageCache() {\n  // TODO\n}', answer: '标准解法：把列表页数据按查询参数缓存到内存或 sessionStorage，回退时先回填缓存再后台静默刷新。', focus: ['数据缓存'] },
  { id: 12, title: '慢网搜索优化', prompt: '保留上次结果。', starter: 'function createSearchState() {\n  // TODO\n}', answer: '标准解法：新请求期间不清空旧结果，只展示 loading 提示；请求返回后再整体替换；过期请求结果直接丢弃。', focus: ['体验优化'] },
  { id: 13, title: '图片压缩上传', prompt: '浏览器端压缩。', starter: 'async function compressImage(file) {\n  // TODO\n}', answer: '标准解法：FileReader 读图，Canvas 按目标尺寸和质量重新绘制，再转 Blob 上传；大图注意按需旋转和压缩率控制。', focus: ['Canvas'] },
  { id: 14, title: '大对象分片处理', prompt: '切片到空闲时间。', starter: 'function chunkProcess(list, handler) {\n  // TODO\n}', answer: '标准解法：一次只处理一批数据，剩余任务放进 requestIdleCallback 或 setTimeout 继续执行，避免长时间阻塞主线程。', focus: ['任务切片'] },
  { id: 15, title: 'web worker 任务分发', prompt: '复杂计算移到 worker。', starter: 'function runInWorker(task) {\n  // TODO\n}', answer: '标准解法：主线程创建 Worker，把任务参数 postMessage 过去；worker 完成后回传结果；多任务可维护请求 id 做响应匹配。', focus: ['多线程'] },
  { id: 16, title: '内存泄漏辅助器', prompt: '标记未清理点。', starter: 'function createLeakInspector() {\n  // TODO\n}', answer: '标准解法：封装 addEventListener、setInterval 等入口，登记创建来源；组件卸载时核对是否成对清理，发现残留就报警。', focus: ['稳定性工程'] },
  { id: 17, title: '骨架屏切换', prompt: '避免闪烁。', starter: 'function switchSkeleton(state) {\n  // TODO\n}', answer: '标准解法：骨架和真实内容做最小时长控制；真实内容准备完成后用淡入切换，避免骨架一闪而过。', focus: ['视觉稳定性'] },
  { id: 18, title: '离线缓存策略', prompt: '结合 Service Worker。', starter: 'function registerSW() {\n  // TODO\n}', answer: '标准解法：静态资源用 cache-first，接口可用 stale-while-revalidate；版本升级时清理旧缓存。', focus: ['PWA'] },
  { id: 19, title: '预渲染页面判定', prompt: '识别适合 prerender 的页面。', starter: 'function shouldPrerender(page) {\n  // TODO\n}', answer: '标准解法：内容稳定、SEO 敏感、交互少的页面优先 prerender；高实时性和强个性化页面不适合。', focus: ['SEO 与性能'] },
  { id: 20, title: '性能上报采样', prompt: '高流量按比例上报。', starter: 'function shouldSample(rate) {\n  // TODO\n}', answer: '标准解法：使用稳定随机或 userId hash 做采样判定；核心错误和严重性能劣化可强制全量上报。', focus: ['监控成本'] },
];

module.exports = questions;
