/**
 * daily03312.js — 滴滴常考：React + Hooks + 状态管理（20题）
 * 含场景设计题（AI 应用补充设计）
 */

const { withSolutions } = require('./daily0329-utils.js');

const sectionMeta = {
  section: 3312,
  file: 'daily03312.js',
  title: '滴滴常考：React 与工程化',
  count: 20,
};

const questionBank = [
  { id: '3312.1', section: 3312, type: 'judge', title: 'useEffect 依赖', prompt: '依赖数组为空时 effect 行为？', code: null, answerOutput: '仅挂载后执行一次（严格模式开发可能双调用）', answer: '生产环境通常仅一次；含 cleanup 的 effect 在卸载时清理。', answerCode: null },
  { id: '3312.2', section: 3312, type: 'implement', title: 'usePrevious', prompt: '实现 usePrevious。', code: null, answer: 'useRef 保存上次值，useEffect 更新。', answerCode: null },
  { id: '3312.3', section: 3312, type: 'implement', title: 'useDebouncedValue', prompt: '实现值防抖 Hook。', code: null, answer: 'state + effect + clearTimeout。', answerCode: null },
  { id: '3312.4', section: 3312, type: 'output', title: 'setState 批处理', prompt: '同事件内三次 setN(n+1) 结果？', code: null, answerOutput: '通常 +1', answer: '闭包中的 n 相同；可用函数式更新 setN(v=>v+1) 得到 +3。', answerCode: null },
  { id: '3312.5', section: 3312, type: 'design', title: '场景设计：AI 会话列表性能', prompt: '消息量 10w 条，如何保持可交互？', code: null, answer: '虚拟列表、分段渲染、消息归档、懒加载、图片占位。AI 补充：按语义分块折叠历史对话。', answerCode: null },
  { id: '3312.6', section: 3312, type: 'implement', title: '简易 Redux createStore', prompt: '实现 getState/dispatch/subscribe。', code: null, answer: 'state 闭包保存，dispatch 通知订阅者快照。', answerCode: null },
  { id: '3312.7', section: 3312, type: 'implement', title: 'combineReducers', prompt: '实现 combineReducers。', code: null, answer: '遍历 reducer map 合并 nextState。', answerCode: null },
  { id: '3312.8', section: 3312, type: 'judge', title: 'key 作用', prompt: '为什么不推荐 index 作为 key？', code: null, answerOutput: '重排时可能错复用状态', answer: '插入/删除/排序会导致 UI 和状态错位。', answerCode: null },
  { id: '3312.9', section: 3312, type: 'output', title: 'useMemo 误区', prompt: 'useMemo 能单独阻止子组件重渲染吗？', code: null, answerOutput: '不能', answer: '需配合 React.memo 且 props 引用稳定。', answerCode: null },
  { id: '3312.10', section: 3312, type: 'design', title: '场景设计：AI 多模型切换', prompt: '前端如何实现模型切换与降级？', code: null, answer: '模型能力矩阵、超时与熔断、失败自动回退、会话级配置。AI 补充：根据问题类型自动推荐模型。', answerCode: null },
  { id: '3312.11', section: 3312, type: 'implement', title: 'useEvent', prompt: '实现稳定回调且拿到最新 fn。', code: null, answer: 'ref 存最新 fn + 空依赖 useCallback。', answerCode: null },
  { id: '3312.12', section: 3312, type: 'implement', title: 'useLocalStorage', prompt: '实现本地持久化 Hook。', code: null, answer: '懒初始化读取 + effect 写回。', answerCode: null },
  { id: '3312.13', section: 3312, type: 'output', title: '父子渲染顺序', prompt: '父更新时子是否一定重渲染？', code: null, answerOutput: '不一定', answer: 'React.memo + 稳定 props 可跳过。', answerCode: null },
  { id: '3312.14', section: 3312, type: 'implement', title: '手写 useMount', prompt: '仅挂载执行一次。', code: null, answer: 'useEffect(fn, [])。', answerCode: null },
  { id: '3312.15', section: 3312, type: 'design', title: '场景设计：AI 结果可信度展示', prompt: '前端如何展示“可能不准确”？', code: null, answer: '答案旁显示置信度/引用来源/复核按钮。AI 补充：对无来源回答加风险标识。', answerCode: null },
  { id: '3312.16', section: 3312, type: 'implement', title: '手写 useWhyDidYouUpdate', prompt: '记录 props 变化。', code: null, answer: 'useRef 保存 prevProps，对比后打印差异。', answerCode: null },
  { id: '3312.17', section: 3312, type: 'judge', title: 'Context 性能', prompt: 'Context 值变化会影响谁？', code: null, answerOutput: '所有消费该 Context 的组件', answer: '可拆分 context 或 selector 化降低无效更新。', answerCode: null },
  { id: '3312.18', section: 3312, type: 'implement', title: 'useThrottleFn', prompt: '实现节流版回调 Hook。', code: null, answer: 'useRef 保存时间戳和 timer，返回稳定函数。', answerCode: null },
  { id: '3312.19', section: 3312, type: 'output', title: 'StrictMode', prompt: '开发环境 effect 为什么执行两次？', code: null, answerOutput: '为暴露副作用问题', answer: '严格模式会做额外调用检查，不是生产行为。', answerCode: null },
  { id: '3312.20', section: 3312, type: 'design', title: '场景设计：AI 编辑器自动补全', prompt: '如何避免补全闪烁与“抢光标”？', code: null, answer: '基于光标锚点插入、请求去重、延迟展示、用户输入优先。AI 补充：多候选排序与撤销链一致性。', answerCode: null },
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

