/**
 * 0208 阿里 P6 级面试题（20 道）
 * 日期：2026-02-08
 * 难度：Medium-Hard，覆盖算法、手写、设计、工程化
 * 规则：仅题干与约束，个人完成后再补充解答与测试用例。
 */

// ==================== 1. 接雨水（Hard） ====================
// 给定 n 个非负整数表示柱子高度，计算能接多少雨水。
// 要求：O(n) 时间，O(1) 空间（双指针）
function trap(height) {
  let left = 0, right = height.length - 1, maxL = 0, maxR = 0, sum = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      maxL = Math.max(maxL, height[left]);
      sum += maxL - height[left];
      left++;
    } else {
      maxR = Math.max(maxR, height[right]);
      sum += maxR - height[right];
      right--;
    }
  }
  return sum;
}

// ==================== 2. 最长递增子序列（Medium） ====================
// 给定整数数组 nums，返回最长严格递增子序列的长度。
// 要求：O(n²) 或 O(n log n) 均可，说明思路
function lengthOfLIS(nums) {
  if (!nums.length) return 0;
  const dp = Array(nums.length).fill(1);
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
    }
  }
  return Math.max(...dp);
}

// ==================== 3. 字符串解码（Medium） ====================
// 给定 s = "3[a2[c]]"，解码为 "accaccacc"。保证输入合法。
// 输入：编码字符串，支持嵌套 k[encoded_string]
// 输出：解码后字符串
function decodeString(s) {
  const stack = [];
  let cur = '', num = 0;
  for (const c of s) {
    if (c >= '0' && c <= '9') num = num * 10 + +c;
    else if (c === '[') {
      stack.push([cur, num]);
      cur = '';
      num = 0;
    } else if (c === ']') {
      const [prev, repeat] = stack.pop();
      cur = prev + cur.repeat(repeat);
    } else cur += c;
  }
  return cur;
}

// ==================== 4. 手写 Promise.race ====================
// 实现 Promise.race(promises)，返回最先 resolve/reject 的结果。
// 要求：空数组时 Promise 永远 pending
function promiseRace(promises) {
  if (!promises.length) return new Promise(() => {});
  return new Promise((resolve, reject) => {
    promises.forEach(p => Promise.resolve(p).then(resolve, reject));
  });
}

// ==================== 5. 手写带取消的 Promise ====================
// 实现 createCancelablePromise(executor)，返回 { promise, cancel }。
// cancel() 调用后 promise 永久 pending 或 reject，后续 resolve/reject 无效。
function createCancelablePromise(executor) {
  let cancelled = false;
  const promise = new Promise((resolve, reject) => {
    executor(
      v => { if (!cancelled) resolve(v); },
      e => { if (!cancelled) reject(e); }
    );
  });
  return {
    promise,
    cancel: () => { cancelled = true; }
  };
}

// ==================== 6. 手写 compose（中间件洋葱模型） ====================
// 实现 compose([f1, f2, f3])(ctx)，按洋葱模型执行：f1 入→f2 入→f3 入→f3 出→f2 出→f1 出。
// 每个中间件为 (ctx, next) => { ... await next(); ... }
function compose(middlewares) {
  return (ctx) => {
    let i = 0;
    const next = () => {
      if (i >= middlewares.length) return Promise.resolve();
      return middlewares[i++](ctx, next);
    };
    return next();
  };
}

// ==================== 7. 实现请求重试封装 ====================
// 实现 retry(fn, options)：maxRetries、delay、backoff（指数退避）、retryCondition(err)。
// 返回一个函数，调用时执行 fn，失败则按策略重试。
function retry(fn, options = {}) {
  const { maxRetries = 3, delay = 1000, backoff = 1, retryCondition = () => true } = options;
  return async function (...args) {
    let lastErr;
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn.apply(this, args);
      } catch (e) {
        lastErr = e;
        if (i === maxRetries || !retryCondition(e)) throw e;
        await new Promise(r => setTimeout(r, delay * Math.pow(backoff, i)));
      }
    }
    throw lastErr;
  };
}

// ==================== 8. LRU 缓存带过期时间 ====================
// 在 LRU 基础上，每个 key 可设置 ttl（毫秒），过期自动淘汰。
// 接口：get(key)、put(key, value, ttl?)、支持全局 defaultTtl。
class LRUCacheWithTTL {
  constructor(capacity, defaultTtl = Infinity) {
    this.cap = capacity;
    this.defaultTtl = defaultTtl;
    this.map = new Map();
  }
  get(key) {
    const item = this.map.get(key);
    if (!item) return -1;
    if (Date.now() > item.expireAt) {
      this.map.delete(key);
      return -1;
    }
    this.map.delete(key);
    this.map.set(key, item);
    return item.value;
  }
  put(key, value, ttl = this.defaultTtl) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, { value, expireAt: Date.now() + ttl });
    if (this.map.size > this.cap) this.map.delete(this.map.keys().next().value);
  }
}

// ==================== 9. 异步任务调度器（支持优先级） ====================
// Scheduler(concurrency)，add(task, priority?)。priority 高先执行；同优先级按添加顺序。
// 要求：同时运行数不超过 concurrency，支持 add 返回 Promise 在任务完成时 resolve。
class PriorityScheduler {
  constructor(concurrency) {
    this.limit = concurrency;
    this.running = 0;
    this.queue = [];
  }
  add(task, priority = 0) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, priority, resolve, reject });
      this.queue.sort((a, b) => b.priority - a.priority);
      this.run();
    });
  }
  run() {
    if (this.running >= this.limit || !this.queue.length) return;
    const { task, resolve, reject } = this.queue.shift();
    this.running++;
    Promise.resolve(task()).then(resolve, reject).finally(() => {
      this.running--;
      this.run();
    });
  }
}

// ==================== 10. 虚拟列表核心逻辑 ====================
// 给定列表总高度 totalHeight、可视高度 viewHeight、每项高度 itemHeight（或动态高度函数），
// 实现 getVisibleRange(scrollTop) 返回 [startIndex, endIndex]，用于只渲染可见项。
function createVirtualList(totalHeight, viewHeight, itemHeight) {
  const getHeight = typeof itemHeight === 'function' ? itemHeight : () => itemHeight;
  const count = Math.ceil(totalHeight / (typeof itemHeight === 'number' ? itemHeight : 50));
  return {
    getVisibleRange(scrollTop) {
      let h = 0, start = 0, end = 0;
      for (let i = 0; i < count; i++) {
        const ih = getHeight(i);
        if (h + ih > scrollTop && start === 0) start = i;
        if (h < scrollTop + viewHeight) end = i;
        h += ih;
      }
      return [start, end];
    }
  };
}
// 简化版：固定 itemHeight 时 start = floor(scrollTop/itemHeight), end = start + ceil(viewHeight/itemHeight)

// ==================== 11. 实现 flatten + 指定深度 ====================
// flatten(arr, depth)：depth=1 拍平一层，depth=Infinity 全部拍平。
// 要求：不改变原数组，支持 depth 参数。
function flatten(arr, depth = 1) {
  if (depth <= 0) return arr;
  return arr.reduce((acc, item) =>
    acc.concat(Array.isArray(item) ? flatten(item, depth - 1) : item), []);
}

// ==================== 12. 二叉树的右视图 ====================
// 给定根节点，返回从右侧能看到的节点值数组（每层最右边节点）。
// 输入：二叉树 root
// 输出：number[]
function rightSideView(root) {
  if (!root) return [];
  const res = [];
  const queue = [root];
  while (queue.length) {
    const len = queue.length;
    for (let i = 0; i < len; i++) {
      const node = queue.shift();
      if (i === len - 1) res.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return res;
}

// ==================== 13. 最小栈（O(1) getMin） ====================
// 实现栈的 push、pop、top、getMin，getMin 在 O(1) 内返回当前栈中最小元素。
class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }
  push(x) {
    this.stack.push(x);
    this.minStack.push(this.minStack.length ? Math.min(this.minStack[this.minStack.length - 1], x) : x);
  }
  pop() {
    this.minStack.pop();
    return this.stack.pop();
  }
  top() { return this.stack[this.stack.length - 1]; }
  getMin() { return this.minStack[this.minStack.length - 1]; }
}

// ==================== 14. 实现 EventEmitter 支持 once + 通配符 ====================
// 在 on/emit/off 基础上：once(event, cb)；支持 emit('*') 触发所有监听，或 event 为 'user:*' 时匹配 user:login、user:logout。
class EventEmitterEx {
  constructor() { this.events = {}; }
  on(event, cb) {
    (this.events[event] ??= []).push({ cb, once: false });
    return this;
  }
  once(event, cb) {
    (this.events[event] ??= []).push({ cb, once: true });
    return this;
  }
  off(event, cb) {
    if (!cb) delete this.events[event];
    else this.events[event] = (this.events[event] || []).filter(e => e.cb !== cb);
    return this;
  }
  _match(pattern, name) {
    if (pattern === '*') return true;
    if (pattern.endsWith('*')) return name.startsWith(pattern.slice(0, -1));
    return pattern === name;
  }
  emit(event, ...args) {
    const toRun = [];
    for (const [pat, list] of Object.entries(this.events)) {
      if (this._match(pat, event) || pat === '*') toRun.push(...list.map(x => ({ ...x, pat })));
    }
    toRun.forEach(({ cb, once, pat }) => {
      cb(...args);
      if (once) this.off(pat, cb);
    });
  }
}

// ==================== 15. 手写 Object.is ====================
// 实现 Object.is(a, b)。需正确处理 NaN === NaN、+0 与 -0 不相等。
function objectIs(a, b) {
  if (a === b) return 1 / a === 1 / b; // +0 -0
  return a !== a && b !== b; // NaN
}

// ==================== 16. 路径总和 III（前缀和） ====================
// 给定二叉树和 targetSum，求路径和等于 targetSum 的路径数量。路径不必从根开始、不必在叶结束。
// 要求：O(n) 时间，说明前缀和思路。
function pathSum(root, targetSum) {
  const prefix = new Map();
  prefix.set(0, 1);
  let count = 0;
  function dfs(node, cur) {
    if (!node) return;
    cur += node.val;
    count += prefix.get(cur - targetSum) || 0;
    prefix.set(cur, (prefix.get(cur) || 0) + 1);
    dfs(node.left, cur);
    dfs(node.right, cur);
    prefix.set(cur, prefix.get(cur) - 1);
  }
  dfs(root, 0);
  return count;
}

// ==================== 17. 最长重复子数组（DP） ====================
// 给定两个整数数组 A、B，返回两数组中公共的、长度最长的子数组的长度。
// 子数组连续。要求：O(m*n) 时间。
function findLength(A, B) {
  const m = A.length, n = B.length;
  const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  let max = 0;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (A[i - 1] === B[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      max = Math.max(max, dp[i][j]);
    }
  }
  return max;
}

// ==================== 18. 实现 Scheduler：每隔固定时间执行一个任务 ====================
// add(fn)：添加任务到队列。队列中的任务每隔 delay 毫秒执行一个，同一时刻最多执行一个。
// 【批改】原实现 run() 一次性 forEach 执行全部，未体现「每隔 delay」。正确：每次取一个执行，setTimeout(delay) 后再取下一个。

class Scheduler {
  constructor(delay) {
    this.delay = delay;
    this.queue = [];
    this.running = false;
  }
  add(fn) {
    this.queue.push(fn);
    if (!this.running) this.run();
  }
  run() {
    if (this.queue.length === 0) {
      this.running = false;
      return;
    }
    this.running = true;
    const fn = this.queue.shift();
    fn();
    setTimeout(() => this.run(), this.delay);
  }
}

// ==================== 19. 扁平化嵌套对象 ====================
// flattenObject({ a: 1, b: { c: 2, d: { e: 3 } } }) => { 'a': 1, 'b.c': 2, 'b.d.e': 3 }。
// 支持自定义分隔符，考虑数组：{ a: [1, { b: 2 }] } 的展开规则需约定。

// 【批改】基本正确。建议：hasOwnProperty 用 call 防 Object.create(null)；支持自定义分隔符
function flattenObject(obj, sep = '.') {
  const result = {};
  function flatten(o, prefix = '') {
    for (const key in o) {
      if (!Object.prototype.hasOwnProperty.call(o, key)) continue;
      const newKey = prefix ? `${prefix}${sep}${key}` : key;
      if (o[key] !== null && typeof o[key] === 'object') {
        flatten(o[key], newKey); // 数组按索引展开 a.0, a.1
      } else {
        result[newKey] = o[key];
      }
    }
  }
  flatten(obj);
  return result;
}

// ==================== 20. 实现简易版 Vue 响应式（reactive + effect） ====================
// 实现 reactive(obj) 返回代理对象；effect(fn) 注册副作用，当 reactive 中依赖变化时自动重新执行 fn。
// 要求：基于 Proxy，支持嵌套对象，避免重复收集、避免无限循环。
const targetMap = new WeakMap();
const proxyCache = new WeakMap();
let activeEffect = null;

function reactive(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (proxyCache.has(obj)) return proxyCache.get(obj);
  const proxy = new Proxy(obj, {
    get(target, key) {
      const res = Reflect.get(target, key);
      if (activeEffect) {
        let deps = targetMap.get(target) || new Map();
        if (!targetMap.has(target)) targetMap.set(target, deps);
        let dep = deps.get(key) || new Set();
        if (!deps.has(key)) deps.set(key, dep);
        dep.add(activeEffect);
      }
      return typeof res === 'object' && res !== null ? reactive(res) : res;
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value);
      const deps = targetMap.get(target)?.get(key);
      deps?.forEach(fn => fn());
      return res;
    }
  });
  if (!targetMap.has(obj)) targetMap.set(obj, new Map());
  proxyCache.set(obj, proxy);
  return proxy;
}

function effect(fn) {
  activeEffect = fn;
  fn();
  activeEffect = null;
}

// ==================== 测试用例 ====================
function arrToTree(arr, i = 0) {
  if (i >= arr.length || arr[i] == null) return null;
  return { val: arr[i], left: arrToTree(arr, 2 * i + 1), right: arrToTree(arr, 2 * i + 2) };
}

function assert(cond, msg) {
  if (!cond) throw new Error('Assert failed: ' + msg);
}

async function runTests() {
  // 1
  assert(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]) === 6, 'trap');
  assert(trap([4, 2, 0, 3, 2, 5]) === 9, 'trap2');

  // 2
  assert(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]) === 4, 'lengthOfLIS');
  assert(lengthOfLIS([1, 3, 6, 7, 9, 4, 10, 5, 6]) === 6, 'lengthOfLIS2');

  // 3
  assert(decodeString('3[a2[c]]') === 'accaccacc', 'decodeString');
  assert(decodeString('2[abc]3[cd]ef') === 'abcabccdcdcdef', 'decodeString2');

  // 4
  const first = await promiseRace([
    new Promise(r => setTimeout(() => r(1), 100)),
    new Promise(r => setTimeout(() => r(2), 50))
  ]);
  assert(first === 2, 'promiseRace');

  // 5
  const { promise, cancel } = createCancelablePromise(r => setTimeout(() => r(1), 50));
  let resolved = false;
  promise.then(() => { resolved = true; });
  cancel();
  await new Promise(r => setTimeout(r, 100));
  assert(!resolved, 'cancelablePromise cancel before resolve');

  // 6
  const order = [];
  await compose([
    async (ctx, next) => { order.push('1-in'); await next(); order.push('1-out'); },
    async (ctx, next) => { order.push('2-in'); await next(); order.push('2-out'); },
    async (ctx, next) => { order.push('3-in'); await next(); order.push('3-out'); }
  ])({});
  assert(JSON.stringify(order) === '["1-in","2-in","3-in","3-out","2-out","1-out"]', 'compose');

  // 7
  let tries = 0;
  const retried = retry(() => { tries++; if (tries < 2) throw new Error('retry'); return 42; }, { maxRetries: 2, delay: 0 });
  assert(await retried() === 42 && tries === 2, 'retry');

  // 8
  const lru = new LRUCacheWithTTL(2, 10000);
  lru.put('a', 1);
  lru.put('b', 2);
  assert(lru.get('a') === 1, 'LRU');
  lru.put('c', 3);
  assert(lru.get('b') === -1, 'LRU evict');

  // 9
  const sch = new PriorityScheduler(2);
  const r1 = sch.add(() => Promise.resolve(1), 0);
  const r2 = sch.add(() => Promise.resolve(2), 1);
  assert((await r2) === 2 && (await r1) === 1, 'PriorityScheduler');

  // 10
  const vl = createVirtualList(1000, 200, 50);
  const [s, e] = vl.getVisibleRange(100);
  assert(s >= 0 && e >= s, 'virtualList');

  // 11
  assert(JSON.stringify(flatten([1, [2, [3, 4]]], 1)) === '[1,2,[3,4]]', 'flatten depth1');
  assert(JSON.stringify(flatten([1, [2, [3, 4]]], Infinity)) === '[1,2,3,4]', 'flatten Infinity');

  // 12
  const tree = arrToTree([1, 2, 3, null, 5, null, 4]);
  assert(JSON.stringify(rightSideView(tree)) === '[1,3,4]', 'rightSideView');

  // 13
  const ms = new MinStack();
  ms.push(-2); ms.push(0); ms.push(-3);
  assert(ms.getMin() === -3, 'MinStack');
  ms.pop();
  assert(ms.getMin() === -2, 'MinStack2');

  // 14
  const ee = new EventEmitterEx();
  let n = 0;
  ee.on('e', () => n++);
  ee.once('o', () => n += 10);
  ee.emit('e');
  ee.emit('o');
  ee.emit('o');
  assert(n === 11, 'EventEmitterEx'); // on('e')*1 + once('o')*10

  // 15
  assert(objectIs(NaN, NaN) === true, 'objectIs NaN');
  assert(objectIs(0, -0) === false, 'objectIs +0 -0');
  assert(objectIs(1, 1) === true, 'objectIs 1 1');

  // 16
  const tree2 = arrToTree([10, 5, -3, 3, 2, null, 11, 3, -2, null, 1]);
  assert(pathSum(tree2, 8) === 3, 'pathSum');

  // 17
  assert(findLength([1, 2, 3, 2, 1], [3, 2, 1, 4, 7]) === 3, 'findLength');

  // 18
  const sched = new Scheduler(100);
  const seq = [];
  sched.add(() => seq.push(1));
  sched.add(() => seq.push(2));
  await new Promise(r => setTimeout(r, 250));
  assert(seq[0] === 1 && seq[1] === 2, 'Scheduler');

  // 19
  assert(JSON.stringify(flattenObject({ a: 1, b: { c: 2, d: { e: 3 } } })) === '{"a":1,"b.c":2,"b.d.e":3}', 'flattenObject');
  assert(flattenObject({ a: [1, { b: 2 }] })['a.1.b'] === 2, 'flattenObject array');

  // 20
  const state = reactive({ count: 0 });
  let effectCount = 0;
  effect(() => { state.count; effectCount++; });
  state.count = 1;
  assert(effectCount === 2, 'reactive effect');

  console.log('✅ 全部 20 题测试通过');
}

if (typeof require !== 'undefined' && require.main === module) {
  runTests().catch(e => { console.error(e); process.exit(1); });
}
