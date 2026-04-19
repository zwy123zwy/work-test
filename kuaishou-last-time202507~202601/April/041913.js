const questions = [
  { id: 1, title: '实现 fetch 封装器', prompt: '统一超时和错误处理。', starter: 'function createHttpClient(options) {\n  // TODO\n}', answer: '标准解法：外层包装 fetch，请求前注入 headers，请求中 race 超时，请求后统一解析 code/status 并抛出业务错误。', focus: ['请求层设计'] },
  { id: 2, title: '实现请求拦截器链', prompt: '支持前后统一扩展。', starter: 'class HttpClient {\n  // TODO\n}', answer: '标准解法：维护 requestInterceptors 和 responseInterceptors 数组，请求执行前后按洋葱或队列顺序串联 Promise。', focus: ['中间件模式'] },
  { id: 3, title: '实现 token 自动刷新', prompt: '401 时只刷新一次。', starter: 'function attachRefresh(client) {\n  // TODO\n}', answer: '标准解法：遇到 401 时若没有 refreshPromise 则发起刷新；后续 401 请求等待同一个 refreshPromise；刷新成功后重放原请求。', focus: ['并发控制'] },
  { id: 4, title: '实现接口签名', prompt: '根据时间戳生成签名。', starter: 'function sign(params, secret) {\n  // TODO\n}', answer: '标准解法：对参数按键名排序后拼接，再与 timestamp、nonce 和 secret 组合，做 HMAC/MD5 签名，输出 sign 字段。', focus: ['安全基础'] },
  { id: 5, title: '防重复提交', prompt: '短时间只保留一次。', starter: 'function preventRepeatSubmit(fn) {\n  // TODO\n}', answer: '标准解法：执行期间加锁，完成前忽略重复点击；若要求幂等，可结合请求指纹和后端幂等键。', focus: ['幂等处理'] },
  { id: 6, title: '实现 XSS 过滤器', prompt: '对白名单标签放行。', starter: 'function sanitizeHTML(html) {\n  // TODO\n}', answer: '标准解法：优先使用成熟库；若手写则用 DOMParser 解析后按标签和属性白名单过滤，移除 script、事件属性和 javascript: 协议。', focus: ['安全'] },
  { id: 7, title: 'HTML 转义函数', prompt: '转义危险字符。', starter: 'function escapeHTML(str) {\n  // TODO\n}', answer: '标准解法：把 &, <, >, ", \' 分别替换成 HTML 实体，避免用户输入直接进入 innerHTML。', focus: ['输出编码'] },
  { id: 8, title: 'CSRF token 注入', prompt: '请求头自动带 token。', starter: 'function injectCsrf(config) {\n  // TODO\n}', answer: '标准解法：从 cookie/meta 中读取 csrfToken，在同源写操作请求上自动加到 header；服务端再做校验。', focus: ['鉴权安全'] },
  { id: 9, title: '文件上传类型校验', prompt: '校验 mime、后缀和文件头。', starter: 'async function validateFile(file) {\n  // TODO\n}', answer: '标准解法：先校验 accept 和扩展名，再读取文件前几个字节比对魔数；三层都通过才允许上传。', focus: ['上传安全'] },
  { id: 10, title: '下载链接防盗链', prompt: '附加短时签名。', starter: 'function createDownloadURL(path, secret) {\n  // TODO\n}', answer: '标准解法：把资源路径、过期时间和用户标识拼接后签名，生成带 exp 和 sign 的下载链接，到期自动失效。', focus: ['资源安全'] },
  { id: 11, title: '权限码校验函数', prompt: '支持 allOf/oneOf。', starter: 'function hasPermission(userPerms, rules) {\n  // TODO\n}', answer: '标准解法：allOf 要求所有权限都命中，oneOf 要求至少命中一个；统一把权限存成 Set 以便 O(1) 判断。', focus: ['权限模型'] },
  { id: 12, title: '跨域白名单判断', prompt: '根据 origin 决定放行。', starter: 'function allowOrigin(origin, whitelist) {\n  // TODO\n}', answer: '标准解法：精确匹配或按预定义通配规则匹配 origin；命中才返回 Access-Control-Allow-Origin。', focus: ['CORS'] },
  { id: 13, title: '请求降噪日志器', prompt: '过滤高频低价值日志。', starter: 'function shouldReport(log) {\n  // TODO\n}', answer: '标准解法：按错误码、接口、采样率和时间窗口去重，重复出现的同类 4xx 只保留摘要和计数。', focus: ['日志治理'] },
  { id: 14, title: '断网重连提示', prompt: '恢复网络后重试。', starter: 'function monitorNetwork() {\n  // TODO\n}', answer: '标准解法：监听 online/offline，断网时提示并暂停可重试请求，恢复后按队列顺序重放。', focus: ['网络容错'] },
  { id: 15, title: 'WebSocket 心跳保活', prompt: '断开后退避重连。', starter: 'function createSocket(url) {\n  // TODO\n}', answer: '标准解法：定时发送 ping，超时未收到 pong 视为断链并关闭重连；重连间隔采用指数退避避免雪崩。', focus: ['长连接稳定性'] },
  { id: 16, title: 'SSE 订阅器', prompt: '自动恢复连接。', starter: 'function createSSE(url) {\n  // TODO\n}', answer: '标准解法：使用 EventSource 建立连接；error 时根据业务场景重建；服务端若支持 last-event-id，可从断点继续。', focus: ['实时通信'] },
  { id: 17, title: '断点续传方案', prompt: '记录分片状态。', starter: 'function createResumeDownload(meta) {\n  // TODO\n}', answer: '标准解法：把文件切分成区块并记录已完成区间，重新开始时仅请求缺失区块；前端合并或交给浏览器下载。', focus: ['文件传输'] },
  { id: 18, title: '多租户请求头注入', prompt: '带上租户标识。', starter: 'function attachTenant(config, tenantId) {\n  // TODO\n}', answer: '标准解法：从当前租户上下文读取 tenantId，统一注入 header；切换租户时同步刷新缓存和请求上下文。', focus: ['B 端业务'] },
  { id: 19, title: '客户端限流器', prompt: '同接口单位时间限次。', starter: 'function rateLimitRequest(fn, limit, windowMs) {\n  // TODO\n}', answer: '标准解法：维护时间窗口内调用时间戳队列，超出限制则直接拒绝或延迟执行；常见实现有滑动窗口和令牌桶。', focus: ['保护后端'] },
  { id: 20, title: '敏感信息脱敏', prompt: '手机号、邮箱统一脱敏。', starter: 'function mask(value, type) {\n  // TODO\n}', answer: '标准解法：按不同类型定义规则，例如手机号保留前三后四，邮箱保留首尾和域名，身份证保留前后若干位。', focus: ['数据安全'] },
];

module.exports = questions;
