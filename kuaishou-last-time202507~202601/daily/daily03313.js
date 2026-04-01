/**
 * daily03313.js — 滴滴常考：算法与手写实现（20题）
 * 含场景设计题（AI 应用补充设计）
 */

const { withSolutions } = require('./daily0329-utils.js');

const sectionMeta = {
  section: 3313,
  file: 'daily03313.js',
  title: '滴滴常考：算法与数据结构',
  count: 20,
};

const questionBank = [
  { id: '3313.1', section: 3313, type: 'implement', title: '两数之和', prompt: 'O(n) 实现 twoSum。', code: null, answer: '哈希表记录已遍历数字与下标。', answerCode: null },
  { id: '3313.2', section: 3313, type: 'implement', title: '反转链表', prompt: '迭代反转单链表。', code: null, answer: 'prev/curr/next 三指针。', answerCode: null },
  { id: '3313.3', section: 3313, type: 'implement', title: '二叉树层序遍历', prompt: '返回每层节点值。', code: null, answer: '队列 BFS。', answerCode: null },
  { id: '3313.4', section: 3313, type: 'output', title: 'sort 默认行为', prompt: '[2,11,3].sort() 输出？', code: null, answerOutput: '[11,2,3]', answer: '默认按字符串字典序排序。', answerCode: null },
  {
    id: '3313.5',
    section: 3313,
    type: 'design',
    title: '场景设计：AI 热点榜单去重',
    prompt: '实时流入话题，如何稳定排序并去重？',
    code: null,
    designThinking:
      '1) 归一：URL 解码、大小写、去空格；可选 SimHash/embedding 判近重复。\n' +
      '2) 主键：canonicalId = hash(归一后文本)。\n' +
      '3) 计分：score = 热度 * e^(-λ*时间差) 做时间衰减。\n' +
      '4) TopK：小顶堆维护 K 条，流式更新。\n' +
      '5) AI 补充：同义话题合并（需异步聚类服务），前端展示代表词。',
    answer: '哈希去重 + 小顶堆维护 TopK + 时间衰减分。AI 补充：语义归一化同义话题聚类。',
    answerCode: null,
  },
  { id: '3313.6', section: 3313, type: 'implement', title: 'LRU 缓存', prompt: '实现 LRU get/put。', code: null, answer: 'Map 保序，访问后删再插。', answerCode: null },
  { id: '3313.7', section: 3313, type: 'implement', title: '数组转树', prompt: 'listToTree。', code: null, answer: 'Map 建节点，二次遍历挂载 children。', answerCode: null },
  { id: '3313.8', section: 3313, type: 'implement', title: '岛屿数量', prompt: 'grid 统计岛屿个数。', code: null, answer: 'DFS/BFS 染色访问。', answerCode: null },
  { id: '3313.9', section: 3313, type: 'output', title: '快速幂复杂度', prompt: 'pow(x,n) 快速幂时间复杂度？', code: null, answerOutput: 'O(log n)', answer: '每次指数折半。', answerCode: null },
  {
    id: '3313.10',
    section: 3313,
    type: 'design',
    title: '场景设计：AI 召回排序链路',
    prompt: '设计前端可观测的“召回-粗排-精排”调试面板。',
    code: null,
    designThinking:
      '1) 三段 Tab：召回列表（id+粗分）→ 粗排 TopN → 精排 TopK，每段显示耗时与条数。\n' +
      '2) 对比：支持两次请求 diff（A/B 实验）。\n' +
      '3) 回放：保存 requestId，一键复现同 query。\n' +
      '4) 权限：调试面板仅白名单环境开启。\n' +
      '5) AI 补充：精排行内展示特征贡献条（需后端返回 shap 或近似）。',
    answer: '分阶段展示候选数量、耗时、命中率；支持按 query 回放。AI 补充：展示特征贡献解释。',
    answerCode: null,
  },
  { id: '3313.11', section: 3313, type: 'implement', title: '最长无重复子串', prompt: '滑动窗口实现。', code: null, answer: '窗口右扩，重复时左移并更新下标。', answerCode: null },
  { id: '3313.12', section: 3313, type: 'implement', title: '合并区间', prompt: 'merge intervals。', code: null, answer: '按起点排序后线性合并。', answerCode: null },
  { id: '3313.13', section: 3313, type: 'implement', title: '有效括号', prompt: '判断括号字符串是否合法。', code: null, answer: '栈匹配左右括号。', answerCode: null },
  { id: '3313.14', section: 3313, type: 'implement', title: '二分查找', prompt: '返回目标下标或 -1。', code: null, answer: '双指针缩区间。', answerCode: null },
  {
    id: '3313.15',
    section: 3313,
    type: 'design',
    title: '场景设计：AI 推荐实验平台',
    prompt: '多算法 A/B 测试如何前端落地？',
    code: null,
    designThinking:
      '1) 分桶：用户 id + 实验 id 哈希到 bucket，写入本地 session。\n' +
      '2) 埋点：曝光/点击/转化带 experimentId + variantId。\n' +
      '3) 灰度：远程配置开关，支持按城市/版本放量。\n' +
      '4) 归因：转化窗口内最后一次曝光胜出或多触点模型（与数据同学对齐）。\n' +
      '5) AI 补充：冷启动用户提高探索比例（bandit 策略由服务端下发）。',
    answer: '实验分桶、曝光埋点、转化归因、灰度开关。AI 补充：根据人群特征自动分配探索流量。',
    answerCode: null,
  },
  { id: '3313.16', section: 3313, type: 'implement', title: 'topK 高频元素', prompt: '返回出现频率前 K 高元素。', code: null, answer: '哈希计数 + 堆或桶排序。', answerCode: null },
  { id: '3313.17', section: 3313, type: 'implement', title: '归并排序', prompt: '实现 mergeSort。', code: null, answer: '分治 + 有序合并。', answerCode: null },
  { id: '3313.18', section: 3313, type: 'judge', title: '稳定排序', prompt: 'JS sort 是否稳定？', code: null, answerOutput: '现代主流引擎基本稳定（ES2019 后要求稳定）', answer: '面试可说明“规范已要求稳定，旧环境需谨慎”。', answerCode: null },
  { id: '3313.19', section: 3313, type: 'implement', title: '最小栈', prompt: '支持 getMin 的栈。', code: null, answer: '主栈 + 辅助最小栈。', answerCode: null },
  {
    id: '3313.20',
    section: 3313,
    type: 'design',
    title: '场景设计：AI 风险词过滤',
    prompt: '在流式回答中如何边输出边审核？',
    code: null,
    designThinking:
      '1) 缓冲：维护滑动窗口字符串（或 token 缓冲），够一定长度再扫描。\n' +
      '2) 引擎：Trie/AC 自动机匹配敏感词；命中即停止向 UI 继续 append。\n' +
      '3) 策略：替换为 *** 或整段撤回；严重级别可中断 SSE。\n' +
      '4) 人审：高风险写入队列，附上下文片段。\n' +
      '5) AI 补充：结合上下文 NER 降低「断章取义」误杀（需异步复核）。',
    answer: '分片检测、命中后截断替换、人工复核队列。AI 补充：上下文感知降低误杀。',
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

