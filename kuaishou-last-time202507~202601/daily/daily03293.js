/**
 * daily03293.js — 专题三：React、Hooks、性能、状态 10 题
 * 每题含 solution（完整答案）
 * 用法：const { questions, sectionMeta, getById } = require('./daily03293.js');
 */

const { withSolutions } = require('./daily0329-utils.js');

const sectionMeta = {
  section: 3,
  file: 'daily03293.js',
  title: 'React、Hooks、性能、状态',
  count: 10,
};

const questionBank = [
  {
    id: '3.1',
    section: 3,
    type: 'output',
    title: 'useEffect 与 count',
    prompt: 'effect 里打印的 count？',
    code: `function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(count);
    setCount(1);
  }, []);
  return null;
}`,
    answerOutput: '0\n（仅首次 effect 打印一次；依赖 [] 不变则不再执行该 effect）',
    answer: '首次 effect 时 count 为 0；依赖 [] 不变则 effect 不再重复（仅答首次打印 0）。',
    answerCode: null,
  },
  {
    id: '3.2',
    section: 3,
    type: 'implement',
    title: 'usePrevious',
    prompt: '返回上一次渲染的 value',
    code: null,
    answer: 'ref 存上一次的值，useEffect 提交后更新。',
    answerCode: `function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}`,
  },
  {
    id: '3.3',
    section: 3,
    type: 'judge',
    title: 'useMemo 与子组件',
    prompt: 'useMemo 能否单独避免子组件重渲染？',
    code: null,
    answerOutput: '不能。useMemo 只缓存本组件的计算结果；子组件是否重渲染取决于其 props/state，需 React.memo + 引用稳定的 props 或 useCallback 等配合。',
    answer: '不能单靠 useMemo；需 React.memo + 稳定 props 或 useCallback 等。',
    answerCode: null,
  },
  {
    id: '3.4',
    section: 3,
    type: 'implement',
    title: 'Context + useReducer',
    prompt: 'Provider 透传 state 与 dispatch',
    code: null,
    answer: 'createContext + useReducer + useMemo 包 value。',
    answerCode: `// const Ctx = createContext(null);
// function Provider({ reducer, initialState, children }) {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const value = useMemo(() => ({ state, dispatch }), [state]);
//   return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
// }`,
  },
  {
    id: '3.5',
    section: 3,
    type: 'output',
    title: '连续 setState',
    prompt: '点击后 n 显示？',
    code: `function X() {
  const [n, setN] = useState(0);
  const click = () => {
    setN(n + 1);
    setN(n + 1);
    setN(n + 1);
  };
  return <button onClick={click}>{n}</button>;
}`,
    answerOutput: '1（三次 setN 基于同一闭包 n，批处理合并为 n 从 0 变为 1）',
    answer: '三次基于同一闭包 n，批量合并为一次更新，结果 1。',
    answerCode: null,
  },
  {
    id: '3.6',
    section: 3,
    type: 'implement',
    title: 'useUpdateEffect',
    prompt: '跳过首次，仅在依赖变化时执行',
    code: null,
    answer: 'useRef 标记是否首次。',
    answerCode: `function useUpdateEffect(effect, deps) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    return effect();
  }, deps);
}`,
  },
  {
    id: '3.7',
    section: 3,
    type: 'judge',
    title: 'key',
    prompt: 'key 作用？索引作 key 风险？',
    code: null,
    answerOutput:
      'key：帮助 React 识别列表项身份、稳定复用 DOM。索引作 key：列表重排/插入时节点与状态错配、动画/表单状态错乱。',
    answer: '标识节点身份；索引在重排时导致状态错用、动画异常。',
    answerCode: null,
  },
  {
    id: '3.8',
    section: 3,
    type: 'implement',
    title: 'combineReducers',
    prompt: '输入输出与伪代码',
    code: null,
    answer: '多 slice reducer 合成 state 各字段。',
    answerCode: `function combineReducers(reducers) {
  const keys = Object.keys(reducers);
  return (state = {}, action) => {
    const next = {};
    keys.forEach((k) => (next[k] = reducers[k](state[k], action)));
    return next;
  };
}`,
  },
  {
    id: '3.9',
    section: 3,
    type: 'output',
    title: '批处理',
    prompt: 'useEffect 内多次 setState 渲染次数？',
    code: null,
    answerOutput: '通常 1 次渲染（React 18 在同一 effect 内批处理多次 setState；具体以版本与场景为准）。',
    answer: 'React 18 同 effect 内多次 setState 通常批处理为一次渲染（以版本为准）。',
    answerCode: null,
  },
  {
    id: '3.10',
    section: 3,
    type: 'implement',
    title: 'useLocalStorage',
    prompt: 'state 与 localStorage 同步',
    code: null,
    answer: 'useState 懒初始化读 localStorage；useEffect 写回。',
    answerCode: `function useLocalStorage(key, initial) {
  const [v, setV] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(v));
  }, [key, v]);
  return [v, setV];
}`,
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
