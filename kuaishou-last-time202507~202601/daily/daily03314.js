/**
 * daily03314.js — 滴滴常考：浏览器、网络、工程实践（20题）
 * 含场景设计题（AI 应用补充设计）
 */

const { withSolutions } = require('./daily0329-utils.js');

const sectionMeta = {
  section: 3314,
  file: 'daily03314.js',
  title: '滴滴常考：浏览器与工程实践',
  count: 20,
};

const questionBank = [
  { id: '3314.1', section: 3314, type: 'judge', title: '重排与重绘', prompt: 'transform/opacity 会触发回流吗？', code: null, answerOutput: '通常不会触发布局回流', answer: '多为合成层变化，性能更好。', answerCode: null },
  { id: '3314.2', section: 3314, type: 'output', title: '事件捕获冒泡', prompt: '父子都绑定 click，默认顺序？', code: null, answerOutput: '捕获阶段父->子，冒泡阶段子->父', answer: '默认 addEventListener 第三个参数 false 监听冒泡。', answerCode: null },
  { id: '3314.3', section: 3314, type: 'implement', title: '手写 EventEmitter', prompt: '实现 on/off/emit/once。', code: null, answer: '用 Map<event, Set<fn>> 管理监听器。', answerCode: null },
  { id: '3314.4', section: 3314, type: 'implement', title: '并发请求池', prompt: '实现 limitRequest(urls, limit)。', code: null, answer: '固定 worker 数，消费共享索引。', answerCode: null },
  {
    id: '3314.5',
    section: 3314,
    type: 'design',
    title: '场景设计：AI 请求链路监控',
    prompt: '前端如何定位“回答慢/失败”问题？',
    code: null,
    designThinking:
      '1) 埋点：PerformanceNavigationTiming + fetch 各阶段（DNS/TCP/TTFB）。\n' +
      '2) 流式：首字节时间、首 token 时间、tokens/s。\n' +
      '3) 业务：modelId、region、重试次数、错误码分类。\n' +
      '4) 可视化：瀑布图 + 同会话对比。\n' +
      '5) AI 补充：对错误 message 聚类打标签，辅助定位是网关还是模型。',
    answer: '记录 DNS/TCP/TTFB/流式首包/首 token 时间、模型耗时、重试次数。AI 补充：异常样本自动聚类定位根因。',
    answerCode: null,
  },
  { id: '3314.6', section: 3314, type: 'judge', title: '缓存策略', prompt: '强缓存与协商缓存区别？', code: null, answerOutput: '强缓存命中不发请求；协商缓存会发请求校验（304）', answer: '常用 Cache-Control + ETag/Last-Modified。', answerCode: null },
  { id: '3314.7', section: 3314, type: 'implement', title: '手写深比较', prompt: '实现 deepEqual(a,b)。', code: null, answer: '递归比较类型、键数量和值（含数组/对象）。', answerCode: null },
  { id: '3314.8', section: 3314, type: 'output', title: '跨域预检', prompt: '什么请求会触发 OPTIONS 预检？', code: null, answerOutput: '非简单请求', answer: '方法/头/Content-Type 超出简单请求范围会预检。', answerCode: null },
  { id: '3314.9', section: 3314, type: 'implement', title: '手写 query 解析', prompt: '把 ?a=1&b=2&a=3 解析成对象。', code: null, answer: 'URLSearchParams + 多值合并数组。', answerCode: null },
  {
    id: '3314.10',
    section: 3314,
    type: 'design',
    title: '场景设计：AI 多端一致性',
    prompt: 'Web/H5/小程序如何共享会话状态？',
    code: null,
    designThinking:
      '1) 单一数据源：会话以 server 为准，端上只缓存。\n' +
      '2) 同步：版本号 + 增量消息列表；拉取时若 version 冲突则全量拉。\n' +
      '3) 冲突：同 id 消息以 updatedAt 最大为准；删除用 tombstone。\n' +
      '4) 小程序：storage 限额，用分页 + 摘要。\n' +
      '5) AI 补充：长上下文用服务端摘要向量，多端只同步摘要 id。',
    answer: '统一会话 API、版本号、增量同步、冲突按时间戳合并。AI 补充：上下文摘要同步降低带宽。',
    answerCode: null,
  },
  { id: '3314.11', section: 3314, type: 'implement', title: '手写对象拍平', prompt: '实现 flattenObject。', code: null, answer: 'DFS 拼接路径，叶子赋值。', answerCode: null },
  { id: '3314.12', section: 3314, type: 'judge', title: 'Service Worker', prompt: 'SW 能拦截哪些请求？', code: null, answerOutput: '同作用域下受控页面的网络请求', answer: '需 HTTPS，首次安装激活后生效。', answerCode: null },
  { id: '3314.13', section: 3314, type: 'implement', title: '手写 URL 拼接', prompt: '实现 appendQuery(url, params)。', code: null, answer: '保留 hash，拼接并编码 query。', answerCode: null },
  { id: '3314.14', section: 3314, type: 'output', title: 'requestIdleCallback', prompt: '适合放关键渲染任务吗？', code: null, answerOutput: '不适合', answer: '更适合低优先级任务，关键路径应避免依赖空闲回调。', answerCode: null },
  {
    id: '3314.15',
    section: 3314,
    type: 'design',
    title: '场景设计：AI 内容安全前端兜底',
    prompt: '服务端审核前，前端做什么？',
    code: null,
    designThinking:
      '1) 输入时：本地敏感词高亮（不阻断打字）。\n' +
      '2) 提交前：规则命中弹窗二次确认或禁止提交。\n' +
      '3) 文件：前端校验类型/大小；图片可加客户端模糊检测（弱）。\n' +
      '4) 体验：说明拦截原因与修改建议。\n' +
      '5) AI 补充：轻量 toxicity 评分（异步），仅提示不强制。',
    answer: '本地规则初筛、敏感词高亮、提交前二次确认。AI 补充：上下文风险评分提示用户改写。',
    answerCode: null,
  },
  { id: '3314.16', section: 3314, type: 'implement', title: '手写 once 函数', prompt: '函数仅执行一次。', code: null, answer: '闭包 flag 记录执行状态。', answerCode: 'function once(fn){ let done=false, ret; return function(...args){ if(done) return ret; done=true; ret=fn.apply(this,args); return ret; }; }' },
  { id: '3314.17', section: 3314, type: 'judge', title: 'SSE vs WebSocket', prompt: 'AI 流式输出更常用哪个？', code: null, answerOutput: '单向推送场景常用 SSE', answer: 'SSE 简单、兼容 HTTP；双向实时交互更适合 WebSocket。', answerCode: null },
  { id: '3314.18', section: 3314, type: 'implement', title: '手写重试请求', prompt: '实现 fetchWithRetry(url, n)。', code: null, answer: '循环重试，指数退避更稳。', answerCode: null },
  { id: '3314.19', section: 3314, type: 'output', title: 'HTTP2 多路复用', prompt: '是否彻底消除了队头阻塞？', code: null, answerOutput: '应用层缓解，TCP 层仍可能阻塞', answer: 'HTTP/2 解决连接级并发，底层丢包仍影响同连接流。', answerCode: null },
  {
    id: '3314.20',
    section: 3314,
    type: 'design',
    title: '场景设计：AI 大模型失败降级',
    prompt: '回答失败时如何兜底不影响体验？',
    code: null,
    designThinking:
      '1) 分类：网络超时 / 429 / 5xx / 内容审核拦截，分别提示。\n' +
      '2) 降级链：自动重试（指数退避）→ 备用模型 → 检索增强短答 → 模板兜底文案。\n' +
      '3) 状态：保留用户输入与 sessionId，支持一键重试。\n' +
      '4) 人工：长时间失败提供工单/客服入口。\n' +
      '5) AI 补充：失败样本脱敏入库供离线分析，不展示给用户。',
    answer: '按错误类型降级：重试->备用模型->模板答案->人工入口；保留用户输入与上下文。AI 补充：失败样本回灌训练。',
    answerCode: null,
  },
];

const questions = withSolutions(questionBank);

function getById(id) {
  return questions.find((q) => q.id === id) || null;
}

module.exports = {
  sectionMeta,
  questions,
  total: questions.length,
  getById,
};

