/**
 * daily0331-full-code.js
 * 03311~03314 所有「implement」题的完整参考实现（可直接复制使用）
 */

// =========================
// 3311.x
// =========================

function debounce(fn, wait) {
  let t = null;
  return function debounced(...args) {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function throttle(fn, wait) {
  let last = 0;
  return function throttled(...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const arr = Array.from(iterable);
    if (arr.length === 0) return resolve([]);
    const ret = new Array(arr.length);
    let done = 0;
    arr.forEach((p, i) => {
      Promise.resolve(p).then(
        (v) => {
          ret[i] = v;
          done += 1;
          if (done === arr.length) resolve(ret);
        },
        (e) => reject(e)
      );
    });
  });
}

const compose = (...fns) => (x) => fns.reduceRight((v, fn) => fn(v), x);

function flat(arr, depth = 1) {
  if (depth <= 0) return arr.slice();
  return arr.reduce((acc, cur) => acc.concat(Array.isArray(cur) ? flat(cur, depth - 1) : cur), []);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function myNew(Ctor, ...args) {
  if (typeof Ctor !== 'function') throw new TypeError('Ctor must be function');
  const obj = Object.create(Ctor.prototype);
  const ret = Ctor.apply(obj, args);
  return ret && (typeof ret === 'object' || typeof ret === 'function') ? ret : obj;
}

// =========================
// 3312.x (React Hooks / Redux)
// =========================

// 需 React 环境
// import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

function usePreviousFactory(React) {
  const { useEffect, useRef } = React;
  return function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };
}

function useDebouncedValueFactory(React) {
  const { useEffect, useState } = React;
  return function useDebouncedValue(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const id = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
  };
}

function createStore(reducer, preloadedState) {
  let state = preloadedState;
  let listeners = [];
  function getState() {
    return state;
  }
  function subscribe(listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }
  function dispatch(action) {
    state = reducer(state, action);
    listeners.slice().forEach((l) => l());
    return action;
  }
  dispatch({ type: '@@redux/INIT' });
  return { getState, dispatch, subscribe };
}

function combineReducers(reducers) {
  const keys = Object.keys(reducers);
  return (state = {}, action) => {
    const next = {};
    let changed = false;
    for (const k of keys) {
      const prevSlice = state[k];
      const nextSlice = reducers[k](prevSlice, action);
      next[k] = nextSlice;
      if (nextSlice !== prevSlice) changed = true;
    }
    return changed ? next : state;
  };
}

function useEventFactory(React) {
  const { useCallback, useRef } = React;
  return function useEvent(fn) {
    const ref = useRef(fn);
    ref.current = fn;
    return useCallback((...args) => ref.current(...args), []);
  };
}

function useLocalStorageFactory(React) {
  const { useEffect, useState } = React;
  return function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
      try {
        const raw = localStorage.getItem(key);
        return raw == null ? initialValue : JSON.parse(raw);
      } catch {
        return initialValue;
      }
    });

    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
  };
}

function useMountFactory(React) {
  const { useEffect } = React;
  return function useMount(fn) {
    useEffect(() => fn(), []);
  };
}

function useWhyDidYouUpdateFactory(React) {
  const { useEffect, useRef } = React;
  return function useWhyDidYouUpdate(name, props) {
    const prev = useRef(props);
    useEffect(() => {
      const keys = Object.keys({ ...prev.current, ...props });
      const changed = {};
      keys.forEach((k) => {
        if (prev.current[k] !== props[k]) {
          changed[k] = { from: prev.current[k], to: props[k] };
        }
      });
      if (Object.keys(changed).length > 0) {
        // eslint-disable-next-line no-console
        console.log('[why-did-you-update]', name, changed);
      }
      prev.current = props;
    });
  };
}

function useThrottleFnFactory(React) {
  const { useCallback, useEffect, useRef } = React;
  return function useThrottleFn(fn, wait) {
    const fnRef = useRef(fn);
    fnRef.current = fn;
    const lastRef = useRef(0);
    const timerRef = useRef(null);

    useEffect(() => () => timerRef.current && clearTimeout(timerRef.current), []);

    return useCallback((...args) => {
      const now = Date.now();
      const remain = wait - (now - lastRef.current);
      if (remain <= 0) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        lastRef.current = now;
        fnRef.current(...args);
      } else if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          lastRef.current = Date.now();
          fnRef.current(...args);
        }, remain);
      }
    }, [wait]);
  };
}

// =========================
// 3313.x 算法
// =========================

function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i];
    if (map.has(need)) return [map.get(need), i];
    map.set(nums[i], i);
  }
  return [];
}

function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}

function levelOrder(root) {
  if (!root) return [];
  const q = [root];
  const ans = [];
  while (q.length) {
    const size = q.length;
    const layer = [];
    for (let i = 0; i < size; i += 1) {
      const node = q.shift();
      layer.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    ans.push(layer);
  }
  return ans;
}

class LRUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.cap) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
  }
}

function listToTree(list) {
  const map = new Map();
  list.forEach((item) => map.set(item.id, { ...item, children: [] }));
  const roots = [];
  list.forEach((item) => {
    const node = map.get(item.id);
    if (item.parentId == null) roots.push(node);
    else if (map.has(item.parentId)) map.get(item.parentId).children.push(node);
  });
  return roots;
}

function numIslands(grid) {
  if (!grid.length) return 0;
  const m = grid.length;
  const n = grid[0].length;
  let count = 0;
  const dfs = (i, j) => {
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] !== '1') return;
    grid[i][j] = '0';
    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  };
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (grid[i][j] === '1') {
        count += 1;
        dfs(i, j);
      }
    }
  }
  return count;
}

function lengthOfLongestSubstring(s) {
  const map = new Map();
  let left = 0;
  let ans = 0;
  for (let right = 0; right < s.length; right += 1) {
    const ch = s[right];
    if (map.has(ch) && map.get(ch) >= left) left = map.get(ch) + 1;
    map.set(ch, right);
    ans = Math.max(ans, right - left + 1);
  }
  return ans;
}

function mergeIntervals(intervals) {
  if (intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);
  const ret = [intervals[0]];
  for (let i = 1; i < intervals.length; i += 1) {
    const last = ret[ret.length - 1];
    const cur = intervals[i];
    if (cur[0] <= last[1]) last[1] = Math.max(last[1], cur[1]);
    else ret.push(cur);
  }
  return ret;
}

function isValidParentheses(s) {
  const stack = [];
  const map = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') stack.push(ch);
    else {
      if (stack.pop() !== map[ch]) return false;
    }
  }
  return stack.length === 0;
}

function binarySearch(arr, target) {
  let l = 0;
  let r = arr.length - 1;
  while (l <= r) {
    const mid = (l + r) >> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  return -1;
}

function topKFrequent(nums, k) {
  const freq = new Map();
  nums.forEach((x) => freq.set(x, (freq.get(x) || 0) + 1));
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map((x) => x[0]);
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr.slice();
  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const out = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) out.push(left[i++]);
    else out.push(right[j++]);
  }
  return out.concat(left.slice(i), right.slice(j));
}

class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }
  push(x) {
    this.stack.push(x);
    if (!this.minStack.length || x <= this.minStack[this.minStack.length - 1]) this.minStack.push(x);
  }
  pop() {
    const x = this.stack.pop();
    if (x === this.minStack[this.minStack.length - 1]) this.minStack.pop();
    return x;
  }
  top() {
    return this.stack[this.stack.length - 1];
  }
  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}

// =========================
// 3314.x 浏览器 / 工程
// =========================

class EventEmitter {
  constructor() {
    this.events = new Map();
  }
  on(type, fn) {
    if (!this.events.has(type)) this.events.set(type, new Set());
    this.events.get(type).add(fn);
    return this;
  }
  off(type, fn) {
    if (!this.events.has(type)) return this;
    this.events.get(type).delete(fn);
    return this;
  }
  once(type, fn) {
    const wrap = (...args) => {
      this.off(type, wrap);
      fn(...args);
    };
    this.on(type, wrap);
    return this;
  }
  emit(type, ...args) {
    if (!this.events.has(type)) return false;
    [...this.events.get(type)].forEach((fn) => fn(...args));
    return true;
  }
}

async function limitRequest(tasks, limit) {
  const ret = new Array(tasks.length);
  let idx = 0;
  const workers = new Array(Math.min(limit, tasks.length)).fill(0).map(async () => {
    while (idx < tasks.length) {
      const i = idx++;
      ret[i] = await tasks[i]();
    }
  });
  await Promise.all(workers);
  return ret;
}

function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a == null || b == null) return false;
  if (typeof a !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) {
    if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
    if (!deepEqual(a[k], b[k])) return false;
  }
  return true;
}

function parseQuery(url) {
  const query = url.includes('?') ? url.split('?')[1].split('#')[0] : url;
  const sp = new URLSearchParams(query);
  const out = {};
  for (const [k, v] of sp.entries()) {
    if (Object.prototype.hasOwnProperty.call(out, k)) {
      out[k] = Array.isArray(out[k]) ? [...out[k], v] : [out[k], v];
    } else out[k] = v;
  }
  return out;
}

function flattenObject(obj, prefix = '', out = {}) {
  if (obj == null || typeof obj !== 'object') {
    out[prefix] = obj;
    return out;
  }
  const entries = Array.isArray(obj) ? obj.map((v, i) => [String(i), v]) : Object.entries(obj);
  entries.forEach(([k, v]) => {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v != null && typeof v === 'object') flattenObject(v, path, out);
    else out[path] = v;
  });
  return out;
}

function appendQuery(url, params) {
  const [baseAndQuery, hash = ''] = url.split('#');
  const [base, query = ''] = baseAndQuery.split('?');
  const sp = new URLSearchParams(query);
  Object.keys(params).forEach((k) => {
    const v = params[k];
    if (Array.isArray(v)) {
      sp.delete(k);
      v.forEach((item) => sp.append(k, String(item)));
    } else {
      sp.set(k, String(v));
    }
  });
  const q = sp.toString();
  return `${base}${q ? `?${q}` : ''}${hash ? `#${hash}` : ''}`;
}

function once(fn) {
  let done = false;
  let ret;
  return function wrapped(...args) {
    if (done) return ret;
    done = true;
    ret = fn.apply(this, args);
    return ret;
  };
}

async function fetchWithRetry(url, n, options = {}) {
  let lastErr;
  for (let i = 0; i < n; i += 1) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (e) {
      lastErr = e;
      const backoff = Math.min(1000 * 2 ** i, 8000);
      await sleep(backoff);
    }
  }
  throw lastErr;
}

module.exports = {
  // 3311
  debounce,
  throttle,
  promiseAll,
  compose,
  flat,
  sleep,
  myNew,

  // 3312 factories
  usePreviousFactory,
  useDebouncedValueFactory,
  createStore,
  combineReducers,
  useEventFactory,
  useLocalStorageFactory,
  useMountFactory,
  useWhyDidYouUpdateFactory,
  useThrottleFnFactory,

  // 3313
  twoSum,
  reverseList,
  levelOrder,
  LRUCache,
  listToTree,
  numIslands,
  lengthOfLongestSubstring,
  mergeIntervals,
  isValidParentheses,
  binarySearch,
  topKFrequent,
  mergeSort,
  MinStack,

  // 3314
  EventEmitter,
  limitRequest,
  deepEqual,
  parseQuery,
  flattenObject,
  appendQuery,
  once,
  fetchWithRetry,
};

