/**
 * 0418.js - 携程前端面试常见手写题 20 道（JS 基础 / 异步 / 浏览器）
 * 参考公开携程前端面经里高频出现的 Promise、节流防抖、手写原生方法、JSON.stringify、懒加载等题型整理。
 */

// 1. debounce(fn, wait)：防抖
function debounce(fn, wait = 300) {
  let timer = null;
  return function debounced(...args) {
    const ctx = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(ctx, args);
    }, wait);
  };
}

// 2. throttle(fn, wait)：节流
function throttle(fn, wait = 300) {
  let lastTime = 0;
  let timer = null;
  return function throttled(...args) {
    const ctx = this;
    const now = Date.now();
    const remain = wait - (now - lastTime);
    if (remain <= 0) {
      clearTimeout(timer);
      timer = null;
      lastTime = now;
      fn.apply(ctx, args);
    } else if (!timer) {
      timer = setTimeout(() => {
        lastTime = Date.now();
        timer = null;
        fn.apply(ctx, args);
      }, remain);
    }
  };
}

// 3. deepClone(value)：深拷贝，支持循环引用
function deepClone(value, cache = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (cache.has(value)) return cache.get(value);
  if (value instanceof Date) return new Date(value);
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);

  const result = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  cache.set(value, result);

  Reflect.ownKeys(value).forEach((key) => {
    result[key] = deepClone(value[key], cache);
  });

  return result;
}

// 4. flattenUniqueSorted(arr)：数组拍平、去重、升序
function flattenUniqueSorted(arr) {
  const flat = [];

  function dfs(list) {
    for (const item of list) {
      if (Array.isArray(item)) dfs(item);
      else flat.push(item);
    }
  }

  dfs(arr);
  return [...new Set(flat)].sort((a, b) => a - b);
}

// 5. arrayToTree(list)：数组转树
function arrayToTree(list) {
  const map = new Map();
  const roots = [];

  for (const item of list) {
    map.set(item.id, { ...item, children: [] });
  }

  for (const item of list) {
    const node = map.get(item.id);
    if (item.parentId == null) {
      roots.push(node);
    } else {
      const parent = map.get(item.parentId);
      if (parent) parent.children.push(node);
    }
  }

  return roots;
}

// 6. treeToArray(tree)：树转数组
function treeToArray(tree) {
  const result = [];

  function dfs(nodes, parentId = null) {
    for (const node of nodes) {
      const { children = [], ...rest } = node;
      result.push({ ...rest, parentId });
      if (children.length) dfs(children, node.id);
    }
  }

  dfs(tree);
  return result;
}

// 7. myCall(fn, context, ...args)：手写 call
function myCall(fn, context, ...args) {
  const ctx = context == null ? globalThis : Object(context);
  const key = Symbol('fn');
  ctx[key] = fn;
  const result = ctx[key](...args);
  delete ctx[key];
  return result;
}

// 8. myApply(fn, context, args)：手写 apply
function myApply(fn, context, args = []) {
  const ctx = context == null ? globalThis : Object(context);
  const key = Symbol('fn');
  ctx[key] = fn;
  const result = ctx[key](...args);
  delete ctx[key];
  return result;
}

// 9. myBind(fn, context, ...presetArgs)：手写 bind
function myBind(fn, context, ...presetArgs) {
  function bound(...laterArgs) {
    const isNew = this instanceof bound;
    const thisArg = isNew ? this : context;
    return fn.apply(thisArg, presetArgs.concat(laterArgs));
  }

  bound.prototype = Object.create(fn.prototype);
  return bound;
}

// 10. myNew(Ctor, ...args)：手写 new
function myNew(Ctor, ...args) {
  const instance = Object.create(Ctor.prototype);
  const result = Ctor.apply(instance, args);
  return result !== null && (typeof result === 'object' || typeof result === 'function')
    ? result
    : instance;
}

// 11. myInstanceof(obj, Ctor)：手写 instanceof
function myInstanceof(obj, Ctor) {
  if (obj == null || (typeof obj !== 'object' && typeof obj !== 'function')) return false;
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === Ctor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

// 12. curry(fn)：函数柯里化
function curry(fn, ...args) {
  return function curried(...rest) {
    const allArgs = args.concat(rest);
    if (allArgs.length >= fn.length) return fn.apply(this, allArgs);
    return curry(fn, ...allArgs);
  };
}

// 13. compose(...fns)：函数组合
function compose(...fns) {
  if (!fns.length) return (value) => value;
  return function composed(initialValue) {
    return fns.reduceRight((acc, fn) => fn(acc), initialValue);
  };
}

// 14. promiseAll(promises)：手写 Promise.all
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const list = Array.from(promises);
    if (!list.length) {
      resolve([]);
      return;
    }

    const result = Array(list.length);
    let done = 0;

    list.forEach((item, index) => {
      Promise.resolve(item).then(
        (value) => {
          result[index] = value;
          done += 1;
          if (done === list.length) resolve(result);
        },
        (error) => reject(error),
      );
    });
  });
}

// 15. promiseRace(promises)：手写 Promise.race
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    for (const item of promises) {
      Promise.resolve(item).then(resolve, reject);
    }
  });
}

// 16. promiseAllSettled(promises)：手写 Promise.allSettled
function promiseAllSettled(promises) {
  return new Promise((resolve) => {
    const list = Array.from(promises);
    if (!list.length) {
      resolve([]);
      return;
    }

    const result = Array(list.length);
    let done = 0;

    list.forEach((item, index) => {
      Promise.resolve(item).then(
        (value) => {
          result[index] = { status: 'fulfilled', value };
        },
        (reason) => {
          result[index] = { status: 'rejected', reason };
        },
      ).finally(() => {
        done += 1;
        if (done === list.length) resolve(result);
      });
    });
  });
}

// 17. asyncPool(limit, tasks)：并发控制
async function asyncPool(limit, tasks) {
  const result = [];
  const executing = [];

  for (const task of tasks) {
    const p = Promise.resolve().then(task);
    result.push(p);

    if (limit <= tasks.length) {
      const e = p.finally(() => {
        const index = executing.indexOf(e);
        if (index >= 0) executing.splice(index, 1);
      });
      executing.push(e);
      if (executing.length >= limit) await Promise.race(executing);
    }
  }

  return Promise.all(result);
}

// 18. jsonStringify(value)：简化版 JSON.stringify
function jsonStringify(value) {
  if (value === null) return 'null';

  const type = typeof value;
  if (type === 'number') return Number.isFinite(value) ? String(value) : 'null';
  if (type === 'boolean') return String(value);
  if (type === 'string') return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  if (type === 'undefined' || type === 'function' || type === 'symbol') return undefined;

  if (Array.isArray(value)) {
    const arr = value.map((item) => {
      const res = jsonStringify(item);
      return res === undefined ? 'null' : res;
    });
    return `[${arr.join(',')}]`;
  }

  const pairs = [];
  for (const key of Object.keys(value)) {
    const val = jsonStringify(value[key]);
    if (val !== undefined) pairs.push(`"${key}":${val}`);
  }
  return `{${pairs.join(',')}}`;
}

// 19. parseQueryString(url)：解析 URL 查询参数
function parseQueryString(url) {
  const query = url.split('?')[1] || '';
  if (!query) return {};

  return query.split('&').reduce((acc, pair) => {
    if (!pair) return acc;
    const [rawKey, rawVal = ''] = pair.split('=');
    const key = decodeURIComponent(rawKey);
    const value = decodeURIComponent(rawVal);

    if (acc[key] === undefined) acc[key] = value;
    else if (Array.isArray(acc[key])) acc[key].push(value);
    else acc[key] = [acc[key], value];

    return acc;
  }, {});
}

// 20. lazyLoad(images, preload)：图片懒加载核心逻辑
function lazyLoad(images, preload = 0) {
  const list = Array.from(images || []);
  const load = () => {
    const viewHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
    for (const img of list) {
      if (!img || img.dataset.loaded === 'true') continue;
      const rect = img.getBoundingClientRect();
      if (rect.top <= viewHeight + preload) {
        const realSrc = img.dataset.src;
        if (realSrc) {
          img.src = realSrc;
          img.dataset.loaded = 'true';
        }
      }
    }
  };

  load();
  return load;
}

module.exports = {
  debounce,
  throttle,
  deepClone,
  flattenUniqueSorted,
  arrayToTree,
  treeToArray,
  myCall,
  myApply,
  myBind,
  myNew,
  myInstanceof,
  curry,
  compose,
  promiseAll,
  promiseRace,
  promiseAllSettled,
  asyncPool,
  jsonStringify,
  parseQueryString,
  lazyLoad,
};
