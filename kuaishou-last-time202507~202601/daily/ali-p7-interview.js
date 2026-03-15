// 阿里P7前端常见面试代码题
// 1. 实现防抖函数 debounce
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 2. 实现节流函数 throttle
function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last > delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// 3. 深拷贝 deepClone
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (map.has(obj)) return map.get(obj);
  let clone = Array.isArray(obj) ? [] : {};
  map.set(obj, clone);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], map);
    }
  }
  return clone;
}

// 4. 实现Promise.all
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    let results = [];
    let count = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(res => {
        results[i] = res;
        count++;
        if (count === promises.length) resolve(results);
      }, reject);
    });
  });
}

// 5. LRU缓存
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}

// 6. 数组扁平化 flat
function flat(arr) {
  return arr.reduce((acc, cur) => {
    return acc.concat(Array.isArray(cur) ? flat(cur) : cur);
  }, []);
}

// 7. 实现EventEmitter
class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(event, fn) {
    (this.events[event] = this.events[event] || []).push(fn);
  }
  off(event, fn) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(f => f !== fn);
  }
  emit(event, ...args) {
    (this.events[event] || []).forEach(fn => fn(...args));
  }
}

// 8. 实现虚拟DOM diff算法（简化版）
function diff(oldTree, newTree) {
  // 这里只给出结构，具体实现可参考React源码
  // ...existing code...
}

// 9. 实现函数柯里化 curry
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...next) {
        return curried.apply(this, args.concat(next));
      };
    }
  };
}

// 10. 实现异步并发控制（如限制并发数）
function asyncPool(limit, tasks, callback) {
  let i = 0;
  let active = 0;
  let results = [];
  return new Promise(resolve => {
    function next() {
      if (i === tasks.length && active === 0) return resolve(results);
      while (active < limit && i < tasks.length) {
        const cur = i++;
        active++;
        tasks[cur]().then(res => {
          results[cur] = res;
          active--;
          next();
        });
      }
    }
    next();
  }).then(callback);
}

// 更多题目可补充，如二叉树遍历、手写Redux、手写React等。
