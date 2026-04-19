/**
 * 04181.js
 * 题目 + 函数骨架 + 可执行参考答案
 */

const questions = [
  {
    id: 1,
    title: '实现 debounce',
    prompt: '支持 leading、trailing、cancel、flush。',
    starter: `function debounce(fn, wait = 300, options = {}) {
  // TODO
}`,
    solution: `function debounce(fn, wait = 300, options = {}) {
  let timer = null;
  let lastArgs = null;
  let lastThis = null;
  let result;
  const leading = !!options.leading;
  const trailing = options.trailing !== false;

  function invoke() {
    result = fn.apply(lastThis, lastArgs);
    lastArgs = lastThis = null;
    return result;
  }

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;
    const shouldCallNow = leading && !timer;

    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (trailing && lastArgs) invoke();
    }, wait);

    if (shouldCallNow) return invoke();
    return result;
  }

  debounced.cancel = function cancel() {
    clearTimeout(timer);
    timer = null;
    lastArgs = lastThis = null;
  };

  debounced.flush = function flush() {
    if (!timer || !lastArgs) return result;
    clearTimeout(timer);
    timer = null;
    return invoke();
  };

  return debounced;
}`,
    focus: ['闭包', '定时器', '边界处理'],
  },
  {
    id: 2,
    title: '实现 throttle',
    prompt: '同时支持时间戳版和定时器版。',
    starter: `function throttle(fn, wait = 300, options = {}) {
  // TODO
}`,
    solution: `function throttle(fn, wait = 300, options = {}) {
  let timer = null;
  let lastInvokeTime = 0;
  let lastArgs = null;
  let lastThis = null;
  const leading = options.leading !== false;
  const trailing = options.trailing !== false;

  function invoke(time) {
    lastInvokeTime = time;
    const res = fn.apply(lastThis, lastArgs);
    lastArgs = lastThis = null;
    return res;
  }

  return function throttled(...args) {
    const now = Date.now();
    if (!lastInvokeTime && !leading) lastInvokeTime = now;

    const remain = wait - (now - lastInvokeTime);
    lastArgs = args;
    lastThis = this;

    if (remain <= 0 || remain > wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      return invoke(now);
    }

    if (!timer && trailing) {
      timer = setTimeout(() => {
        timer = null;
        invoke(Date.now());
      }, remain);
    }
  };
}`,
    focus: ['节流', '时间窗口'],
  },
  {
    id: 3,
    title: '手写 call',
    prompt: '考虑原始值上下文。',
    starter: `function myCall(fn, context, ...args) {
  // TODO
}`,
    solution: `function myCall(fn, context, ...args) {
  const ctx = context == null ? globalThis : Object(context);
  const key = Symbol('fn');
  ctx[key] = fn;
  const result = ctx[key](...args);
  delete ctx[key];
  return result;
}`,
    focus: ['this', '隐式装箱'],
  },
  {
    id: 4,
    title: '手写 apply',
    prompt: '兼容空参数数组。',
    starter: `function myApply(fn, context, args = []) {
  // TODO
}`,
    solution: `function myApply(fn, context, args = []) {
  const ctx = context == null ? globalThis : Object(context);
  const key = Symbol('fn');
  ctx[key] = fn;
  const result = ctx[key](...args);
  delete ctx[key];
  return result;
}`,
    focus: ['this', '参数展开'],
  },
  {
    id: 5,
    title: '手写 bind',
    prompt: '支持 new 优先级。',
    starter: `function myBind(fn, context, ...presetArgs) {
  // TODO
}`,
    solution: `function myBind(fn, context, ...presetArgs) {
  function bound(...laterArgs) {
    const isNew = this instanceof bound;
    const thisArg = isNew ? this : context;
    return fn.apply(thisArg, [...presetArgs, ...laterArgs]);
  }
  bound.prototype = Object.create(fn.prototype);
  return bound;
}`,
    focus: ['原型链', '偏函数'],
  },
  {
    id: 6,
    title: '实现 myNew',
    prompt: '模拟 new 流程。',
    starter: `function myNew(Ctor, ...args) {
  // TODO
}`,
    solution: `function myNew(Ctor, ...args) {
  const instance = Object.create(Ctor.prototype);
  const result = Ctor.apply(instance, args);
  return result !== null && (typeof result === 'object' || typeof result === 'function')
    ? result
    : instance;
}`,
    focus: ['new', '构造函数'],
  },
  {
    id: 7,
    title: '实现 instanceOf',
    prompt: '沿原型链查找。',
    starter: `function myInstanceOf(obj, Ctor) {
  // TODO
}`,
    solution: `function myInstanceOf(obj, Ctor) {
  if (obj == null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return false;
  }
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === Ctor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}`,
    focus: ['原型链'],
  },
  {
    id: 8,
    title: '实现 deepClone',
    prompt: '支持循环引用和特殊对象。',
    starter: `function deepClone(value, cache = new WeakMap()) {
  // TODO
}`,
    solution: `function deepClone(value, cache = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (cache.has(value)) return cache.get(value);
  if (value instanceof Date) return new Date(value);
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);
  if (value instanceof Map) {
    const result = new Map();
    cache.set(value, result);
    value.forEach((v, k) => result.set(deepClone(k, cache), deepClone(v, cache)));
    return result;
  }
  if (value instanceof Set) {
    const result = new Set();
    cache.set(value, result);
    value.forEach((v) => result.add(deepClone(v, cache)));
    return result;
  }
  const result = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  cache.set(value, result);
  Reflect.ownKeys(value).forEach((key) => {
    result[key] = deepClone(value[key], cache);
  });
  return result;
}`,
    focus: ['递归', 'WeakMap'],
  },
  {
    id: 9,
    title: '实现 flatten',
    prompt: '支持指定深度。',
    starter: `function flatten(arr, depth = Infinity) {
  // TODO
}`,
    solution: `function flatten(arr, depth = Infinity) {
  const result = [];
  function dfs(list, level) {
    for (const item of list) {
      if (Array.isArray(item) && level > 0) dfs(item, level - 1);
      else result.push(item);
    }
  }
  dfs(arr, depth);
  return result;
}`,
    focus: ['递归', '数组处理'],
  },
  {
    id: 10,
    title: '实现对象数组去重',
    prompt: '按 key 去重并保留最后一次。',
    starter: `function uniqueBy(list, key) {
  // TODO
}`,
    solution: `function uniqueBy(list, key) {
  const map = new Map();
  for (const item of list) {
    map.set(item[key], item);
  }
  return [...map.values()];
}`,
    focus: ['Map', '数据去重'],
  },
  {
    id: 11,
    title: '实现 compose',
    prompt: '函数从右向左执行。',
    starter: `function compose(...fns) {
  // TODO
}`,
    solution: `function compose(...fns) {
  return function composed(...args) {
    if (fns.length === 0) return args[0];
    let index = fns.length - 1;
    let result = fns[index](...args);
    while (--index >= 0) {
      result = fns[index](result);
    }
    return result;
  };
}`,
    focus: ['函数式编程'],
  },
  {
    id: 12,
    title: '实现 pipe',
    prompt: '函数从左向右执行。',
    starter: `function pipe(...fns) {
  // TODO
}`,
    solution: `function pipe(...fns) {
  return function piped(...args) {
    if (fns.length === 0) return args[0];
    let result = fns[0](...args);
    for (let i = 1; i < fns.length; i += 1) {
      result = fns[i](result);
    }
    return result;
  };
}`,
    focus: ['函数组合'],
  },
  {
    id: 13,
    title: '实现 curry',
    prompt: '支持不定长参数。',
    starter: `function curry(fn) {
  // TODO
}`,
    solution: `function curry(fn) {
  function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...restArgs) => curried(...args, ...restArgs);
  }
  return curried;
}`,
    focus: ['闭包', '柯里化'],
  },
  {
    id: 14,
    title: '实现 partial',
    prompt: '预置部分参数。',
    starter: `function partial(fn, ...presetArgs) {
  // TODO
}`,
    solution: `function partial(fn, ...presetArgs) {
  return function partiallyApplied(...laterArgs) {
    return fn.apply(this, [...presetArgs, ...laterArgs]);
  };
}`,
    focus: ['偏函数'],
  },
  {
    id: 15,
    title: '实现 Object.is',
    prompt: '保持与原生一致。',
    starter: `function objectIs(a, b) {
  // TODO
}`,
    solution: `function objectIs(a, b) {
  if (a === b) return a !== 0 || 1 / a === 1 / b;
  return a !== a && b !== b;
}`,
    focus: ['NaN', '-0'],
  },
  {
    id: 16,
    title: '实现 assign',
    prompt: '忽略原型属性。',
    starter: `function myAssign(target, ...sources) {
  // TODO
}`,
    solution: `function myAssign(target, ...sources) {
  if (target == null) throw new TypeError('Cannot convert undefined or null to object');
  const to = Object(target);
  for (const source of sources) {
    if (source == null) continue;
    for (const key of Reflect.ownKeys(source)) {
      if (Object.prototype.propertyIsEnumerable.call(source, key)) {
        to[key] = source[key];
      }
    }
  }
  return to;
}`,
    focus: ['对象拷贝'],
  },
  {
    id: 17,
    title: '实现 entries/fromEntries',
    prompt: '不依赖原生实现。',
    starter: `function myEntries(obj) {
  // TODO
}
function myFromEntries(entries) {
  // TODO
}`,
    solution: `function myEntries(obj) {
  const result = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result.push([key, obj[key]]);
    }
  }
  return result;
}

function myFromEntries(entries) {
  const result = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}`,
    focus: ['对象遍历'],
  },
  {
    id: 18,
    title: '数组转树',
    prompt: '扁平列表转层级树。',
    starter: `function arrayToTree(list) {
  // TODO
}`,
    solution: `function arrayToTree(list) {
  const map = new Map();
  const roots = [];
  for (const item of list) {
    map.set(item.id, { ...item, children: [] });
  }
  for (const item of list) {
    const node = map.get(item.id);
    if (item.parentId == null) roots.push(node);
    else if (map.has(item.parentId)) map.get(item.parentId).children.push(node);
  }
  return roots;
}`,
    focus: ['树结构', 'Map'],
  },
  {
    id: 19,
    title: '树转数组',
    prompt: '输出 parentId。',
    starter: `function treeToArray(tree) {
  // TODO
}`,
    solution: `function treeToArray(tree) {
  const result = [];
  function dfs(nodes, parentId = null) {
    for (const node of nodes) {
      const { children = [], ...rest } = node;
      result.push({ ...rest, parentId });
      dfs(children, node.id);
    }
  }
  dfs(tree);
  return result;
}`,
    focus: ['DFS', '数据还原'],
  },
  {
    id: 20,
    title: '实现千分位格式化',
    prompt: '兼容负数和小数。',
    starter: `function formatThousands(input) {
  // TODO
}`,
    solution: `function formatThousands(input) {
  const str = String(input);
  const negative = str.startsWith('-') ? '-' : '';
  const raw = negative ? str.slice(1) : str;
  const parts = raw.split('.');
  const intPart = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
  return negative + intPart + (parts[1] ? '.' + parts[1] : '');
}`,
    focus: ['字符串处理'],
  },
];

module.exports = questions;
