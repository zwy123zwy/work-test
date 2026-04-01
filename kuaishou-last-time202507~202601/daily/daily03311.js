/**
 * daily03311.js — 滴滴常考：JS 基础 + 异步 + this（20题）
 * 含场景设计题（AI 应用补充设计）
 */

const { withSolutions } = require('./daily0329-utils.js');

const sectionMeta = {
  section: 3311,
  file: 'daily03311.js',
  title: '滴滴常考：JS 基础与异步',
  count: 20,
};

const questionBank = [
  { id: '3311.1', section: 3311, type: 'output', title: 'var 提升', prompt: '输出顺序？', code: 'console.log(a); var a = 1;', answerOutput: 'undefined', answer: 'var 仅声明提升，赋值不提升。', answerCode: null },
  { id: '3311.2', section: 3311, type: 'output', title: 'let 暂时性死区', prompt: '会发生什么？', code: 'console.log(a); let a = 1;', answerOutput: 'ReferenceError', answer: 'let 在声明前不可访问。', answerCode: null },
  { id: '3311.3', section: 3311, type: 'implement', title: '手写 debounce', prompt: '实现防抖函数。', code: null, answer: '用定时器覆盖前一次调用。', answerCode: 'function debounce(fn, wait){ let t; return function(...args){ clearTimeout(t); t=setTimeout(()=>fn.apply(this,args), wait); }; }' },
  { id: '3311.4', section: 3311, type: 'implement', title: '手写 throttle', prompt: '实现节流函数。', code: null, answer: '记录上次执行时间，间隔内忽略。', answerCode: 'function throttle(fn, wait){ let last=0; return function(...args){ const now=Date.now(); if(now-last>=wait){ last=now; fn.apply(this,args);} }; }' },
  {
    id: '3311.5',
    section: 3311,
    type: 'design',
    title: '场景设计：AI 搜索建议',
    prompt: '设计一个 AI 搜索建议输入框，要求不卡顿、少请求、可中断过时请求。',
    code: null,
    designThinking:
      '1) 输入层：debounce（如 200–300ms）合并 keystroke，避免每字符打接口。\n' +
      '2) 请求层：每次新请求前 AbortController.abort 上一次，避免乱序覆盖。\n' +
      '3) 缓存层：Map<query, {items,ts}> TTL 缓存；空 query 不请求。\n' +
      '4) 降级层：网络失败展示本地热词/历史；骨架屏占位。\n' +
      '5) AI 补充：可选轻量纠错/同义词扩展（可异步、低优先级），不阻塞主路径。',
    answer: '核心方案：输入防抖 + AbortController 取消过时请求 + 本地缓存 + 最近热词兜底 + 错误降级。AI 补充：离线关键词纠错与同义词扩展。',
    answerCode: null,
  },
  { id: '3311.6', section: 3311, type: 'output', title: 'Promise 微任务', prompt: '输出顺序？', code: "console.log(1); Promise.resolve().then(()=>console.log(2)); console.log(3);", answerOutput: '1 3 2', answer: '同步代码先执行，再执行微任务。', answerCode: null },
  { id: '3311.7', section: 3311, type: 'output', title: 'setTimeout 与 Promise', prompt: '输出顺序？', code: "setTimeout(()=>console.log('t'),0); Promise.resolve().then(()=>console.log('p')); console.log('s');", answerOutput: 's p t', answer: '微任务优先于下一轮宏任务。', answerCode: null },
  { id: '3311.8', section: 3311, type: 'implement', title: '手写 Promise.all', prompt: '实现 Promise.all。', code: null, answer: '下标回填 + 完成计数 + 任一失败即 reject。', answerCode: null },
  { id: '3311.9', section: 3311, type: 'judge', title: '箭头函数 this', prompt: '箭头函数能否被 call 改 this？', code: null, answerOutput: '不能', answer: '箭头函数 this 词法绑定，call/apply/bind 无法改写。', answerCode: null },
  {
    id: '3311.10',
    section: 3311,
    type: 'design',
    title: '场景设计：AI 客服分流',
    prompt: '设计 AI 客服前端分流，包含人工兜底。',
    code: null,
    designThinking:
      '1) 分类：调用意图/情绪接口（或规则）得到 label + confidence。\n' +
      '2) 策略：confidence>阈值走 AI 自动回复；否则走「澄清问题」或转人工队列。\n' +
      '3) 人工兜底：按钮常驻「转人工」；高敏/投诉关键词直转。\n' +
      '4) 合规：展示前脱敏手机号/地址；日志不落敏感明文。\n' +
      '5) AI 补充：低置信度时先问 1–2 个澄清问题再答，减少误分流。',
    answer: '方案：意图识别 -> 置信度阈值分流；低置信度/情绪异常直接转人工；会话上下文脱敏；请求链路埋点。AI 补充：引入澄清问题策略减少误分流。',
    answerCode: null,
  },
  { id: '3311.11', section: 3311, type: 'implement', title: '手写 compose', prompt: 'compose(f,g,h)(x)=f(g(h(x)))', code: null, answer: 'reduceRight 实现。', answerCode: 'const compose=(...fns)=>(x)=>fns.reduceRight((v,fn)=>fn(v),x);' },
  { id: '3311.12', section: 3311, type: 'output', title: '对象赋值引用', prompt: 'a.x = a = {n:2} 后 a.x/b.x？', code: null, answerOutput: 'a.x 为 undefined，b.x 为 {n:2}', answer: '成员访问先取引用对象，变量 a 后续指向新对象。', answerCode: null },
  { id: '3311.13', section: 3311, type: 'implement', title: '手写 flat', prompt: '实现 flat(arr, depth)。', code: null, answer: '递归 reduce + depth 终止条件。', answerCode: null },
  { id: '3311.14', section: 3311, type: 'output', title: 'for + setTimeout', prompt: 'var 与 let 输出差异？', code: null, answerOutput: 'var: 3,3,3; let: 0,1,2', answer: 'let 是块级作用域，每轮独立绑定。', answerCode: null },
  {
    id: '3311.15',
    section: 3311,
    type: 'design',
    title: '场景设计：AI 打字机效果',
    prompt: '流式输出时如何稳定渲染并自动滚动？',
    code: null,
    designThinking:
      '1) 流式缓冲：SSE/fetch reader 收到 chunk 追加到 buffer。\n' +
      '2) 渲染调度：requestAnimationFrame 或每 N ms 批量 flush 到 DOM，避免每 token 强制同步布局。\n' +
      '3) 长列表：虚拟列表只挂载可视区消息，历史消息懒加载。\n' +
      '4) 滚动：仅当用户已在底部附近（阈值如 80px）才 auto-scroll；上滑则置 paused。\n' +
      '5) AI 补充：根据 token 到达速率动态调 N，避免快时速慢都卡顿。',
    answer: '分批渲染（rAF/时间片）、虚拟列表、接近底部才自动滚动、用户上滑则暂停自动滚动。AI 补充：基于 token 速率动态调节批次。',
    answerCode: null,
  },
  { id: '3311.16', section: 3311, type: 'implement', title: '手写 sleep', prompt: '实现 sleep(ms)。', code: null, answer: '返回一个延迟 resolve 的 Promise。', answerCode: 'const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));' },
  { id: '3311.17', section: 3311, type: 'judge', title: '深拷贝误区', prompt: 'JSON 深拷贝是否可靠？', code: null, answerOutput: '不完全可靠', answer: '会丢失函数、undefined、Symbol；Date/Map/Set 处理异常；循环引用报错。', answerCode: null },
  { id: '3311.18', section: 3311, type: 'implement', title: '手写 new', prompt: '实现 myNew。', code: null, answer: '创建对象并链接原型，执行构造函数，按返回值规则返回。', answerCode: null },
  { id: '3311.19', section: 3311, type: 'output', title: 'Promise 错误传递', prompt: 'then 抛错后走哪？', code: null, answerOutput: '走后续 catch', answer: 'throw 会把链路状态变为 rejected。', answerCode: null },
  {
    id: '3311.20',
    section: 3311,
    type: 'design',
    title: '场景设计：AI 推荐解释性',
    prompt: '设计“推荐理由”前端展示，避免误导。',
    code: null,
    designThinking:
      '1) 数据契约：后端返回 explain:{type,fields,confidence,sourceIds}，前端只展示结构化字段。\n' +
      '2) UI：理由折叠/展开；无来源时显示「推测」标签而非事实陈述。\n' +
      '3) 交互：「不感兴趣/反馈理由」上报，用于纠偏。\n' +
      '4) 合规：不展示可识别个人信息作为理由。\n' +
      '5) AI 补充：模板化句式 + 风险词过滤，禁止编造具体订单号/姓名。',
    answer: '展示可解释字段（最近行为、相似用户维度）、可信度标签、可关闭/纠错入口。AI 补充：理由模板+风险词过滤，减少“幻觉解释”。',
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

