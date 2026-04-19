const questions = [
  { id: 1, title: '实现 Koa compose', prompt: '支持洋葱模型。', starter: 'function compose(middlewares) {\n  // TODO\n}', answer: '标准解法：返回接收 context 的函数，通过 dispatch(i) 递归调用第 i 个中间件，并把 dispatch(i+1) 作为 next 传入。', focus: ['Node 中间件'] },
  { id: 2, title: '实现简易路由器', prompt: '支持 GET/POST 和动态路由。', starter: 'class Router {\n  // TODO\n}', answer: '标准解法：注册路由时把 method/path/handler 存表；请求到来时按 method 匹配，再用正则或 path-to-regexp 解析动态参数。', focus: ['服务端基础'] },
  { id: 3, title: '请求日志中间件', prompt: '记录耗时和 traceId。', starter: 'async function logger(ctx, next) {\n  // TODO\n}', answer: '标准解法：请求进入时记录开始时间和 traceId，await next() 后计算耗时并输出 method、path、status、duration。', focus: ['观测性'] },
  { id: 4, title: '统一错误处理中间件', prompt: '规范响应结构。', starter: 'async function errorHandler(ctx, next) {\n  // TODO\n}', answer: '标准解法：try/catch 包裹下游逻辑，捕获后设置标准响应体 { code, message, data }，并按错误级别记录日志。', focus: ['稳定性'] },
  { id: 5, title: '参数校验层', prompt: '校验 query/body/params。', starter: 'function validate(schema) {\n  // TODO\n}', answer: '标准解法：把请求参数送入 schema 校验器，失败时抛 400 错误并附带字段级错误信息，成功后可返回清洗后的数据。', focus: ['输入校验'] },
  { id: 6, title: 'BFF 聚合接口', prompt: '并发请求多个后端。', starter: 'async function aggregate(ctx) {\n  // TODO\n}', answer: '标准解法：用 Promise.all 并发请求下游接口，再按前端页面需要拼装字段；部分可降级的下游可用 allSettled。', focus: ['服务聚合'] },
  { id: 7, title: '接口结果缓存', prompt: '热点接口直接命中。', starter: 'function createServerCache() {\n  // TODO\n}', answer: '标准解法：key 通常由 URL + 参数构成，缓存响应体和过期时间；命中则直接返回，未命中才访问下游。', focus: ['服务端缓存'] },
  { id: 8, title: '熔断降级中间件', prompt: '下游异常时返回兜底。', starter: 'function withBreaker(service) {\n  // TODO\n}', answer: '标准解法：统计失败率和超时次数，超过阈值进入 open 状态；打开期间直接走 fallback，冷却后半开探测。', focus: ['容灾'] },
  { id: 9, title: 'SSR 数据注水', prompt: '服务端数据注入页面。', starter: 'function renderPage(appHtml, data) {\n  // TODO\n}', answer: '标准解法：把 data 序列化后挂到 HTML 中如 window.__INITIAL_DATA__；客户端 hydration 时读取该数据初始化 store。', focus: ['同构渲染'] },
  { id: 10, title: 'SSR 重复请求消除', prompt: '客户端接管时不再拉数。', starter: 'function getInitialData(key) {\n  // TODO\n}', answer: '标准解法：客户端首次优先读取注水数据并打 consumed 标记；后续同 key 请求再走真实接口。', focus: ['水合优化'] },
  { id: 11, title: 'cookie 与 session 解析', prompt: '封装读写。', starter: 'function parseCookie(cookie) {\n  // TODO\n}', answer: '标准解法：cookie 字符串按 ; 切分为键值对；session 层通常用 sessionId 关联服务端存储，读写时设置 httpOnly/secure/sameSite。', focus: ['登录态管理'] },
  { id: 12, title: '文件上传服务', prompt: '支持分片合并。', starter: 'async function uploadChunk(ctx) {\n  // TODO\n}', answer: '标准解法：每个分片按 fileHash + chunkIndex 存储，全部分片完成后触发 merge；秒传通过 fileHash 查询服务端是否已有完整文件。', focus: ['上传链路'] },
  { id: 13, title: '服务端代理层', prompt: '转发请求并注入公共头。', starter: 'async function proxy(ctx) {\n  // TODO\n}', answer: '标准解法：读取前端请求，转发到目标服务并透传 method/body/query；附加 traceId、租户等公共头，回写下游响应。', focus: ['BFF 常见能力'] },
  { id: 14, title: '任务队列消费器', prompt: '定时执行同步任务。', starter: 'async function consume(queue) {\n  // TODO\n}', answer: '标准解法：从队列按顺序拉任务执行，成功确认 ack，失败可按重试策略重新入队或落死信。', focus: ['异步任务'] },
  { id: 15, title: '灰度请求转发', prompt: '部分用户请求转新服务。', starter: 'function chooseBackend(userId) {\n  // TODO\n}', answer: '标准解法：对 userId 做稳定 hash 后按灰度比例选择旧版或新版下游；便于回滚且保证同用户路由稳定。', focus: ['发布策略'] },
  { id: 16, title: 'SSR 模板缓存', prompt: '热点 HTML 片段缓存。', starter: 'function cacheTemplate(key, render) {\n  // TODO\n}', answer: '标准解法：对不强依赖用户态的页面片段做短时缓存，命中直接返回 HTML，失效后再重渲染。', focus: ['SSR 性能'] },
  { id: 17, title: 'stream 文件下载', prompt: '避免内存暴涨。', starter: 'function sendFile(ctx, filePath) {\n  // TODO\n}', answer: '标准解法：使用 fs.createReadStream 管道到响应体，设置 Content-Type 和 Content-Disposition，错误时中断流并返回合适状态码。', focus: ['流处理'] },
  { id: 18, title: 'CLI 发布脚本', prompt: '自动检查和构建。', starter: 'async function release() {\n  // TODO\n}', answer: '标准解法：串行执行检查、测试、构建、产物校验和发布命令；每步失败立即退出并输出摘要。', focus: ['自动化'] },
  { id: 19, title: '健康检查接口', prompt: '检查依赖服务。', starter: 'async function healthCheck() {\n  // TODO\n}', answer: '标准解法：检查进程自身状态、数据库/缓存/下游服务可达性和版本信息，输出整体状态与明细。', focus: ['运维友好'] },
  { id: 20, title: 'traceId 透传链路', prompt: '贯穿上下游。', starter: 'function attachTraceId(ctx, next) {\n  // TODO\n}', answer: '标准解法：请求入口生成或读取 traceId，写入 ctx 和响应头，调用下游时继续透传，便于全链路排障。', focus: ['链路追踪'] },
];

module.exports = questions;
