/**
 * daily03292.js — 专题二：异步、事件循环、Promise、工程向 10 题
 * 每题含 solution（完整答案，见 daily0329-utils.js）
 * 用法：const { questions, sectionMeta, getById } = require('./daily03292.js');
 */

const { withSolutions } = require('./daily0329-utils.js');

const sectionMeta = {
  section: 2,
  file: 'daily03292.js',
  title: '异步、事件循环、Promise、工程向',
  count: 10,
};

const questionBank = [
  {
    id: '2.1',
    section: 2,
    type: 'output',
    title: '微任务顺序',
    prompt: '完整输出顺序？',
    code: `console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
queueMicrotask(() => console.log(4));
console.log(5);`,
    answerOutput: '1\n5\n3\n4\n2',
    answer: '同步 1、5；微任务 3、4（按入队顺序，环境可能略有差异）；宏任务 2 → 常见 1 5 3 4 2。',
    answerCode: null,
  },
  {
    id: '2.2',
    section: 2,
    type: 'implement',
    title: 'Promise.all',
    prompt: '全部成功 resolve 数组，任一失败 reject。',
    code: null,
    answer: '计数 + 下标回填结果。',
    answerCode: `function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const arr = Array.from(iterable);
    if (arr.length === 0) return resolve([]);
    const res = [];
    let count = 0;
    arr.forEach((p, i) => {
      Promise.resolve(p).then(
        (v) => {
          res[i] = v;
          count++;
          if (count === arr.length) resolve(res);
        },
        reject
      );
    });
  });
}`,
  },
  {
    id: '2.3',
    section: 2,
    type: 'output',
    title: 'async/await',
    prompt: '输出顺序？',
    code: `async function a() {
  console.log('a1');
  await Promise.resolve();
  console.log('a2');
}
console.log('s');
a();
console.log('e');`,
    answerOutput: 's\na1\ne\na2',
    answer: 's a1 e（同步），然后微任务 a2 → 完整顺序 s → a1 → e → a2。',
    answerCode: null,
  },
  {
    id: '2.4',
    section: 2,
    type: 'implement',
    title: 'pMapLimit',
    prompt: '并发上限 limit，顺序与 items 一致。',
    code: null,
    answer: 'worker 池 + 共享索引 i。',
    answerCode: `async function pMapLimit(items, limit, mapper) {
  const ret = [];
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      ret[idx] = await mapper(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return ret;
}`,
  },
  {
    id: '2.5',
    section: 2,
    type: 'output',
    title: 'setInterval',
    prompt: '先打印什么？宏任务特点？',
    code: `let i = 0;
const id = setInterval(() => {
  console.log(i++);
  if (i > 2) clearInterval(id);
}, 0);
console.log('x');`,
    answerOutput: 'x\n0\n1\n2\n（先同步打印 x，再宏任务多次回调；i 自增到 >2 时 clearInterval）',
    answer: '先同步 x；setInterval 为宏任务，回调晚于同步；具体次数与 clearInterval 时机有关。',
    answerCode: null,
  },
  {
    id: '2.6',
    section: 2,
    type: 'implement',
    title: 'retry',
    prompt: 'fn 返回 Promise，失败重试最多 times 次。',
    code: null,
    answer: 'for 循环 try/catch，最后 throw 最后一次错误。',
    answerCode: `async function retry(fn, times) {
  let err;
  for (let i = 0; i < times; i++) {
    try {
      return await fn();
    } catch (e) {
      err = e;
    }
  }
  throw err;
}`,
  },
  {
    id: '2.7',
    section: 2,
    type: 'output',
    title: 'fetch 与 then',
    prompt: '顺序（then 为微任务）',
    code: `console.log(1);
fetch('/').then(() => console.log(2));
console.log(3);`,
    answerOutput: '1\n3\n2\n（2 在微任务；若 fetch 失败则可能不打印 2）',
    answer: '1 3 同步，2 在微任务 → 1 3 2。',
    answerCode: null,
  },
  {
    id: '2.8',
    section: 2,
    type: 'implement',
    title: 'debounce',
    prompt: '防抖',
    code: null,
    answer: 'clearTimeout + setTimeout。',
    answerCode: `function debounce(fn, wait) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}`,
  },
  {
    id: '2.9',
    section: 2,
    type: 'output',
    title: 'rAF vs setTimeout',
    prompt: 'S、R、T 大致顺序？',
    code: `setTimeout(() => console.log('T'), 0);
requestAnimationFrame(() => console.log('R'));
console.log('S');`,
    answerOutput: 'S\n（随后 R、T 顺序依赖浏览器调度：通常先同步 S，再在下一帧或宏任务队列中出现 R 与 T）',
    answer: '先 S；R 与 T 与浏览器帧/宏任务批次有关，面试说明 rAF 贴近渲染、setTimeout 为宏任务即可。',
    answerCode: null,
  },
  {
    id: '2.10',
    section: 2,
    type: 'implement',
    title: 'JSON.stringify 子集',
    prompt: '对象、数组、字符串、数字、布尔、null',
    code: null,
    answer: '递归拼接，字符串转义引号。',
    answerCode: `function jsonStringify(val) {
  if (val === null) return 'null';
  const t = typeof val;
  if (t === 'number' || t === 'boolean') return String(val);
  if (t === 'string') return '"' + val.replace(/"/g, '\\"') + '"';
  if (Array.isArray(val)) return '[' + val.map(jsonStringify).join(',') + ']';
  if (t === 'object') {
    const keys = Object.keys(val);
    return '{' + keys.map((k) => '"' + k + '":' + jsonStringify(val[k])).join(',') + '}';
  }
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
