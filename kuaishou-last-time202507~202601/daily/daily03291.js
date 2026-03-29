/**
 * daily03291.js — 专题一：JavaScript 核心（作用域、this、原型、类型）10 题
 * 每题含：answer、answerCode（若有）、answerOutput（输出题）、solution（完整答案合并）
 * 用法：const { questions, sectionMeta, getById } = require('./daily03291.js');
 */

const { withSolutions } = require('./daily0329-utils.js');

/** @typedef {'output' | 'implement' | 'judge'} Daily0329Type */

const sectionMeta = {
  section: 1,
  file: 'daily03291.js',
  title: 'JavaScript 核心（作用域、this、原型、类型）',
  count: 10,
};

const questionBank = [
  {
    id: '1.1',
    section: 1,
    type: 'output',
    title: 'var 提升与作用域',
    prompt: '下面打印顺序与最终外层 a 的值？',
    code: `var a = 1;
function f() {
  console.log(a);
  var a = 2;
  console.log(a);
}
f();
console.log(a);`,
    answerOutput: 'undefined\n2\n1',
    answer:
      'f 内第一个 log(a) 为 undefined（变量提升未赋值）；第二个为 2；外层 log(a) 为 1（函数内 var a 为局部变量）。',
    answerCode: null,
  },
  {
    id: '1.2',
    section: 1,
    type: 'implement',
    title: 'myInstanceof',
    prompt: '实现 myInstanceof(left, right)，判断 left 原型链上是否出现 right.prototype。',
    code: null,
    answer: '沿 __proto__ / Object.getPrototypeOf 向上查找直至 null。',
    answerCode: `function myInstanceof(left, right) {
  let p = Object.getPrototypeOf(left);
  while (p) {
    if (p === right.prototype) return true;
    p = Object.getPrototypeOf(p);
  }
  return false;
}`,
  },
  {
    id: '1.3',
    section: 1,
    type: 'output',
    title: '严格模式 this',
    prompt: '严格模式下输出？',
    code: `'use strict';
const o = { x: 1, m() { return this.x; } };
const g = o.m;
console.log(o.m());
console.log(g());`,
    answerOutput: '1\n（第二行：TypeError，严格模式下 g() 的 this 为 undefined，无法读 x）',
    answer: 'o.m() → 1；g() → TypeError（严格模式独立调用 this 为 undefined）。',
    answerCode: null,
  },
  {
    id: '1.4',
    section: 1,
    type: 'implement',
    title: 'Object.create polyfill',
    prompt: '实现 Object.create(proto)，proto 为对象或 null。',
    code: null,
    answer: '空构造函数 F，F.prototype = proto，return new F()。',
    answerCode: `function myCreate(proto) {
  if (proto !== null && typeof proto !== 'object' && typeof proto !== 'function') {
    throw new TypeError();
  }
  function F() {}
  F.prototype = proto;
  return new F();
}`,
  },
  {
    id: '1.5',
    section: 1,
    type: 'output',
    title: '类型与加法',
    prompt: '以下输出？注意 {} + [] 在语句开头可能被解析为代码块。',
    code: `console.log(typeof null);
console.log([] + []);
console.log([] + {});
console.log({} + []);`,
    answerOutput:
      "object\n\n[object Object]\n（第 4 行依解析：{} 在句首可能被当成块语句，常见打印 0；若在表达式中则为 '[object Object]0'）",
    answer:
      "typeof null → 'object'；[]+[] → ''；[]+{} → '[object Object]'；{}+[] 在表达式位置常见为 0 或 '[object Object]0'（与解析有关）。",
    answerCode: null,
  },
  {
    id: '1.6',
    section: 1,
    type: 'implement',
    title: '浅拷贝',
    prompt: '实现 shallowCopy(obj)。',
    code: null,
    answer: '数组 slice/展开；对象展开或 Object.assign。',
    answerCode: `function shallowCopy(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.slice();
  return { ...obj };
}`,
  },
  {
    id: '1.7',
    section: 1,
    type: 'output',
    title: '引用与重新赋值',
    prompt: '打印结果？',
    code: `let x = { n: 1 };
const y = x;
x = { n: 2 };
console.log(y.n);
x.n = 3;
console.log(y.n);`,
    answerOutput: '1\n1',
    answer: '第一次：1（y 仍指向旧对象）；第二次：1（y 与新的 x 无关）。',
    answerCode: null,
  },
  {
    id: '1.8',
    section: 1,
    type: 'implement',
    title: 'flat 简化版',
    prompt: '实现 flat(arr, depth)。',
    code: null,
    answer: 'reduce + 递归或迭代。',
    answerCode: `function flat(arr, depth = 1) {
  if (depth <= 0) return arr.slice();
  return arr.reduce(
    (acc, cur) => acc.concat(Array.isArray(cur) ? flat(cur, depth - 1) : cur),
    []
  );
}`,
  },
  {
    id: '1.9',
    section: 1,
    type: 'output',
    title: 'Promise 与宏微任务',
    prompt: '输出顺序？',
    code: `Promise.resolve().then(() => console.log('A'));
console.log('B');
setTimeout(() => console.log('C'), 0);
Promise.resolve().then(() => console.log('D'));
console.log('E');`,
    answerOutput: 'B\nE\nA\nD\nC',
    answer: '同步 B、E；微任务 A、D；宏任务 C → 打印顺序 B E A D C。',
    answerCode: null,
  },
  {
    id: '1.10',
    section: 1,
    type: 'implement',
    title: 'compose',
    prompt: 'compose(f,g,h)(x) === f(g(h(x)))',
    code: null,
    answer: 'reduceRight 从右向左执行。',
    answerCode: `function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
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
  /** 单题完整答案：questions[i].solution */
};
