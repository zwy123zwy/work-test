const questions = [
  { id: 1, title: '实现 expect', prompt: '支持 toBe/toEqual。', starter: 'function expect(received) {\n  // TODO\n}', answer: '标准解法：返回断言对象；toBe 做严格相等比较，toEqual 走深比较；失败时抛出可读错误信息。', focus: ['测试框架原理'] },
  { id: 2, title: '实现 mockFn', prompt: '记录调用信息。', starter: 'function mockFn(impl) {\n  // TODO\n}', answer: '标准解法：包装原函数，调用时把参数、返回值、this 和调用次数写入 mock.calls/mock.results。', focus: ['Mock 能力'] },
  { id: 3, title: '实现定时器 mock', prompt: '支持快进时间。', starter: 'function createFakeTimers() {\n  // TODO\n}', answer: '标准解法：接管 setTimeout/setInterval，内部维护按触发时间排序的任务队列；advanceTimersByTime 时依次执行到期任务。', focus: ['单元测试'] },
  { id: 4, title: '实现接口 mock server', prompt: '根据路由返回测试数据。', starter: 'function createMockServer(routes) {\n  // TODO\n}', answer: '标准解法：按 method + path 匹配 handler，命中后返回 mock 数据；支持延迟和错误码模拟，方便联调。', focus: ['联调效率'] },
  { id: 5, title: '实现快照比较器', prompt: '比对渲染结果。', starter: 'function toMatchSnapshot(value, snapshot) {\n  // TODO\n}', answer: '标准解法：把 value 序列化为稳定字符串，与快照文本比对；不一致时输出 diff 片段。', focus: ['回归测试'] },
  { id: 6, title: '校验测试用例生成器', prompt: '按规则批量生成输入。', starter: 'function generateCases(rules) {\n  // TODO\n}', answer: '标准解法：从 required、min/max、pattern 等规则推导边界值和非法值样本，形成输入输出用例集。', focus: ['测试数据'] },
  { id: 7, title: '错误码映射校验器', prompt: '检查是否都有处理。', starter: 'function validateErrorCodes(codes, handlers) {\n  // TODO\n}', answer: '标准解法：遍历后端错误码清单，核对前端映射表是否包含全部关键码，缺失时输出告警。', focus: ['异常覆盖'] },
  { id: 8, title: '构建后资源检查', prompt: '扫描 404 和缺失引用。', starter: 'function inspectAssets(manifest) {\n  // TODO\n}', answer: '标准解法：遍历 HTML/CSS/JS 中引用的资源路径，校验产物目录是否存在对应文件，并检查引用关系是否闭合。', focus: ['发布前校验'] },
  { id: 9, title: '路由死链扫描器', prompt: '找出冲突路径。', starter: 'function scanRoutes(routes) {\n  // TODO\n}', answer: '标准解法：标准化所有路径后检测重复定义、无法到达的重定向和无处理的 404 场景。', focus: ['质量保障'] },
  { id: 10, title: 'bundle 体积阈值告警', prompt: '超限阻断发布。', starter: 'function checkBundleSize(stats, limits) {\n  // TODO\n}', answer: '标准解法：读取构建产物体积，与阈值比对；超限时输出最大文件列表并返回失败状态。', focus: ['性能守门'] },
  { id: 11, title: '灰度配置校验', prompt: '确保可回滚。', starter: 'function validateGrayConfig(config) {\n  // TODO\n}', answer: '标准解法：校验比例区间、目标版本存在性、回滚配置完整性和冲突策略，防止非法灰度进入线上。', focus: ['发布安全'] },
  { id: 12, title: '页面冒烟脚本', prompt: '检查核心元素可用。', starter: 'async function smoke(pages) {\n  // TODO\n}', answer: '标准解法：自动打开关键页面，等待首屏渲染后检查标题、主要按钮、接口结果和控制台错误。', focus: ['E2E 思路'] },
  { id: 13, title: '埋点校验器', prompt: '检查事件是否完整发送。', starter: 'function verifyTrack(logs, requiredEvents) {\n  // TODO\n}', answer: '标准解法：按页面流程核对必需埋点、字段完整性和触发次数；缺失或重复都标记为失败。', focus: ['数据质量'] },
  { id: 14, title: '可访问性扫描器', prompt: '检测图片 alt 和 label。', starter: 'function scanA11y(html) {\n  // TODO\n}', answer: '标准解法：解析 DOM，检查 img 是否缺 alt、input 是否关联 label、按钮是否有可访问名称。', focus: ['A11y'] },
  { id: 15, title: '配置回滚器', prompt: '异常时回退到上一版。', starter: 'function rollbackConfig(current, history) {\n  // TODO\n}', answer: '标准解法：保留配置版本快照，发现线上异常时切回最近稳定版本并记录回滚原因和时间。', focus: ['运维保障'] },
  { id: 16, title: '发布窗口锁', prompt: '高峰期禁止风险发布。', starter: 'function canRelease(now, policy) {\n  // TODO\n}', answer: '标准解法：结合时间窗口、节假日和业务峰值策略判断是否允许发布；紧急修复可走白名单通道。', focus: ['流程控制'] },
  { id: 17, title: '变更影响分析器', prompt: '推断受影响页面。', starter: 'function analyzeImpact(changedFiles, dependencyGraph) {\n  // TODO\n}', answer: '标准解法：基于依赖图从改动文件向上回溯引用页面和模块，输出影响范围用于测试和灰度决策。', focus: ['风险识别'] },
  { id: 18, title: '接口契约检查器', prompt: '比对 mock 与真实响应。', starter: 'function diffSchema(mockSchema, realSchema) {\n  // TODO\n}', answer: '标准解法：递归比较字段存在性、类型和可空性，输出新增、缺失和类型不一致列表。', focus: ['联调质量'] },
  { id: 19, title: '异常日志聚合摘要', prompt: '按版本和页面聚类。', starter: 'function summarizeErrors(logs) {\n  // TODO\n}', answer: '标准解法：按 message + stack + page + version 聚类，统计次数、影响用户数和首次/最近发生时间。', focus: ['线上排障'] },
  { id: 20, title: '发布后巡检脚本', prompt: '检查健康页和关键接口。', starter: 'async function patrol(targets) {\n  // TODO\n}', answer: '标准解法：发布完成后自动请求健康页、关键 API 和静态资源 URL，校验状态码、响应时间和内容关键字。', focus: ['发布闭环'] },
];

module.exports = questions;
