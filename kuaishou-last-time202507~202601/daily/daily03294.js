/**
 * daily03294.js — 专题四：算法与手写数据结构（前端高频）10 题
 * 每题含 solution（完整答案）
 * 用法：const { questions, sectionMeta, getById } = require('./daily03294.js');
 */

const { withSolutions } = require('./daily0329-utils.js');

const sectionMeta = {
  section: 4,
  file: 'daily03294.js',
  title: '算法与手写数据结构（前端高频）',
  count: 10,
};

const questionBank = [
  {
    id: '4.1',
    section: 4,
    type: 'implement',
    title: 'flatten',
    prompt: '嵌套数组打平一层或指定深度',
    code: null,
    answer: 'reduce 递归展开；depth 为 0 时返回浅拷贝。',
    answerCode: `function flat(arr, depth = 1) {
  if (depth <= 0) return arr.slice();
  return arr.reduce(
    (acc, cur) => acc.concat(Array.isArray(cur) ? flat(cur, depth - 1) : cur),
    []
  );
}`,
  },
  {
    id: '4.2',
    section: 4,
    type: 'output',
    title: '快排 partition',
    prompt: '[3,1,4,1,5] 以 3 为 pivot 一次划分（口述）',
    code: '// 数组 [3,1,4,1,5] 以第一个元素为 pivot',
    answerOutput:
      '无唯一答案。示例：将 <3 放左侧、≥3 放右侧，如 [1,1] 与 [3,4,5] 或 [1,1,3] 与 [4,5]（依 Lomuto/Hoare 实现而定）。',
    answer: '小于 pivot 左、大于等于右，结果不唯一；考察 partition 思路。',
    answerCode: null,
  },
  {
    id: '4.3',
    section: 4,
    type: 'implement',
    title: 'LRUCache',
    prompt: 'get/put O(1) 均摊',
    code: null,
    answer: 'ES6 Map 按插入顺序：get/put 时先删再 set 把 key 移到“最近使用”；超容量删除 map.keys().next().value。',
    answerCode: `class LRUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const v = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, v);
    return v;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.cap) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
  }
}`,
  },
  {
    id: '4.4',
    section: 4,
    type: 'implement',
    title: '对称二叉树',
    prompt: '递归或迭代',
    code: null,
    answer: '比较左子与右子镜像。',
    answerCode: `function isSymmetric(root) {
  function eq(a, b) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.val === b.val && eq(a.left, b.right) && eq(a.right, b.left);
  }
  return root ? eq(root.left, root.right) : true;
}`,
  },
  {
    id: '4.5',
    section: 4,
    type: 'output',
    title: 'Array.sort',
    prompt: '[1,2,3].sort() 与 [1,11,2].sort()',
    code: null,
    answerOutput: '[1,2,3].sort() → [1,2,3]（默认字典序恰好与数值一致）；[1,11,2].sort() → [1,11,2]（按字符串比，非数值大小）。',
    answer: '默认按字符串字典序；[1,11,2] 不是数值序，需 (a,b)=>a-b。',
    answerCode: null,
  },
  {
    id: '4.6',
    section: 4,
    type: 'implement',
    title: 'deepClone',
    prompt: '对象/数组，WeakMap 处理循环引用',
    code: null,
    answer: '递归 + map 记录已拷贝对象。',
    answerCode: `function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (map.has(obj)) return map.get(obj);
  if (Array.isArray(obj)) {
    const c = [];
    map.set(obj, c);
    obj.forEach((v, i) => (c[i] = deepClone(v, map)));
    return c;
  }
  const c = {};
  map.set(obj, c);
  for (const k of Object.keys(obj)) c[k] = deepClone(obj[k], map);
  return c;
}`,
  },
  {
    id: '4.7',
    section: 4,
    type: 'implement',
    title: '二分查找',
    prompt: '有序数组找 target，无则 -1',
    code: null,
    answer: '双指针 mid。',
    answerCode: `function binarySearch(arr, t) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === t) return mid;
    if (arr[mid] < t) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
  },
  {
    id: '4.8',
    section: 4,
    type: 'output',
    title: 'JSON 深拷贝缺陷',
    prompt: 'JSON.parse(JSON.stringify(obj)) 举 3 类问题',
    code: null,
    answerOutput:
      '示例：① 丢失 undefined / 函数 / Symbol；② 循环引用抛错；③ Date 变成字符串、Map/Set 等无法序列化。',
    answer: 'undefined/函数/Symbol/循环引用；Date 变字符串；Map/Set 等。',
    answerCode: null,
  },
  {
    id: '4.9',
    section: 4,
    type: 'implement',
    title: 'throttle',
    prompt: 'leading 节流',
    code: null,
    answer: '记录 last 时间戳。',
    answerCode: `function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}`,
  },
  {
    id: '4.10',
    section: 4,
    type: 'implement',
    title: 'listToTree',
    prompt: '扁平 id/parentId → 树 children',
    code: null,
    answer: 'Map 建节点再挂父子。',
    answerCode: `function listToTree(list) {
  const map = new Map();
  list.forEach((n) => map.set(n.id, { ...n, children: [] }));
  const roots = [];
  list.forEach((n) => {
    const node = map.get(n.id);
    if (n.parentId == null) roots.push(node);
    else map.get(n.parentId)?.children.push(node);
  });
  return roots;
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
