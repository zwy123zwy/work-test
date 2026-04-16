/**
 * 04163.js — 前端代码算法题 20 道（单调栈 / 单调队列）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. dailyTemperatures(T)：几天后更暖和。
function dailyTemperatures(T) {
  const n = T.length;
  const ans = Array(n).fill(0);
  const st = [];
  for (let i = 0; i < n; i += 1) {
    while (st.length && T[i] > T[st[st.length - 1]]) {
      const j = st.pop();
      ans[j] = i - j;
    }
    st.push(i);
  }
  return ans;
}

// 2. nextGreaterElement(findNums, nums)：下一个更大元素。
function nextGreaterElement(findNums, nums) {
  const map = new Map();
  const st = [];
  for (const x of nums) {
    while (st.length && x > st[st.length - 1]) map.set(st.pop(), x);
    st.push(x);
  }
  while (st.length) map.set(st.pop(), -1);
  return findNums.map((x) => map.get(x));
}

// 3. nextGreaterElementsII(nums)：循环数组下一个更大。
function nextGreaterElementsII(nums) {
  const n = nums.length;
  const ans = Array(n).fill(-1);
  const st = [];
  for (let i = 0; i < 2 * n; i += 1) {
    const x = nums[i % n];
    while (st.length && x > nums[st[st.length - 1]]) {
      ans[st.pop()] = x;
    }
    if (i < n) st.push(i);
  }
  return ans;
}

// 4. largestRectangleArea(heights)：柱状图最大矩形。
function largestRectangleArea(heights) {
  const st = [];
  let ans = 0;
  for (let i = 0; i <= heights.length; i += 1) {
    const h = i === heights.length ? 0 : heights[i];
    while (st.length && h < heights[st[st.length - 1]]) {
      const j = st.pop();
      const H = heights[j];
      const L = st.length ? st[st.length - 1] : -1;
      ans = Math.max(ans, H * (i - L - 1));
    }
    st.push(i);
  }
  return ans;
}

// 5. trap(height)：接雨水。
function trap(height) {
  let l = 0;
  let r = height.length - 1;
  let lm = 0;
  let rm = 0;
  let ans = 0;
  while (l < r) {
    if (height[l] < height[r]) {
      lm = Math.max(lm, height[l]);
      ans += lm - height[l];
      l += 1;
    } else {
      rm = Math.max(rm, height[r]);
      ans += rm - height[r];
      r -= 1;
    }
  }
  return ans;
}

// 6. maximalRectangle(matrix)：全 1 最大矩形。
function maximalRectangle(matrix) {
  if (!matrix.length) return 0;
  const m = matrix.length;
  const n = matrix[0].length;
  const h = Array(n).fill(0);
  let ans = 0;
  const hist = (heights) => {
    const st = [];
    for (let i = 0; i <= heights.length; i += 1) {
      const cur = i === heights.length ? 0 : heights[i];
      while (st.length && cur < heights[st[st.length - 1]]) {
        const j = st.pop();
        const H = heights[j];
        const L = st.length ? st[st.length - 1] : -1;
        ans = Math.max(ans, H * (i - L - 1));
      }
      st.push(i);
    }
  };
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      h[j] = matrix[i][j] === '1' ? h[j] + 1 : 0;
    }
    hist(h);
  }
  return ans;
}

// 7. OnlineStockSpan：每日价格跨度。
class StockSpanner {
  constructor() {
    this.st = [];
  }
  next(price) {
    let span = 1;
    while (this.st.length && this.st[this.st.length - 1][0] <= price) {
      span += this.st.pop()[1];
    }
    this.st.push([price, span]);
    return span;
  }
}

// 8. asteroidCollision(asteroids)：同向碰撞。
function asteroidCollision(asteroids) {
  const st = [];
  for (const a of asteroids) {
    let alive = true;
    while (alive && a < 0 && st.length && st[st.length - 1] > 0) {
      const t = st[st.length - 1];
      if (t < -a) st.pop();
      else if (t === -a) {
        st.pop();
        alive = false;
      } else alive = false;
    }
    if (alive) st.push(a);
  }
  return st;
}

// 9. removeKdigits(num, k)：删 k 位最小数字串。
function removeKdigits(num, k) {
  const st = [];
  for (const c of num) {
    while (k > 0 && st.length && st[st.length - 1] > c) {
      st.pop();
      k -= 1;
    }
    st.push(c);
  }
  while (k-- > 0) st.pop();
  let s = st.join('').replace(/^0+/, '');
  return s || '0';
}

// 10. decodeString(s)：编码串解码。
function decodeString(s) {
  const st = [];
  let num = 0;
  let cur = '';
  for (const c of s) {
    if (c >= '0' && c <= '9') num = num * 10 + (+c);
    else if (c === '[') {
      st.push([cur, num]);
      cur = '';
      num = 0;
    } else if (c === ']') {
      const [prev, k] = st.pop();
      cur = prev + cur.repeat(k);
    } else cur += c;
  }
  return cur;
}

// 11. exclusiveTime(n, logs)：独占时间（格式 id:start|end:timestamp）。
function exclusiveTime(n, logs) {
  const ans = Array(n).fill(0);
  const st = [];
  for (const log of logs) {
    const li = log.lastIndexOf(':');
    const t = +log.slice(li + 1);
    const head = log.slice(0, li);
    const hi = head.lastIndexOf(':');
    const id = +head.slice(0, hi);
    const typ = head.slice(hi + 1);
    if (typ === 'start') {
      if (st.length) ans[st[st.length - 1].id] += t - st[st.length - 1].t;
      st.push({ id, t });
    } else {
      const top = st.pop();
      ans[id] += t - top.t + 1;
      if (st.length) st[st.length - 1].t = t + 1;
    }
  }
  return ans;
}

// 12. scoreOfParentheses(S)：括号串分数。
function scoreOfParentheses(S) {
  const st = [0];
  for (const c of S) {
    if (c === '(') st.push(0);
    else {
      const v = st.pop();
      st[st.length - 1] += Math.max(2 * v, 1);
    }
  }
  return st[0];
}

// 13. minStack：O(1) 取最小值。
class MinStack {
  constructor() {
    this.st = [];
    this.minSt = [];
  }
  push(x) {
    this.st.push(x);
    if (!this.minSt.length || x <= this.minSt[this.minSt.length - 1]) this.minSt.push(x);
  }
  pop() {
    const x = this.st.pop();
    if (x === this.minSt[this.minSt.length - 1]) this.minSt.pop();
    return x;
  }
  top() {
    return this.st[this.st.length - 1];
  }
  getMin() {
    return this.minSt[this.minSt.length - 1];
  }
}

// 14. maxSlidingWindow(nums, k)：窗口最大值（单调队列）。
function maxSlidingWindow(nums, k) {
  const dq = [];
  const res = [];
  for (let i = 0; i < nums.length; i += 1) {
    while (dq.length && dq[0] <= i - k) dq.shift();
    while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
    dq.push(i);
    if (i >= k - 1) res.push(nums[dq[0]]);
  }
  return res;
}

// 15. shortestSubarray(nums, k)：和至少 k 的最短子数组（单调队列 + 前缀和）。
function shortestSubarray(nums, k) {
  const n = nums.length;
  const pre = Array(n + 1).fill(0);
  for (let i = 0; i < n; i += 1) pre[i + 1] = pre[i] + nums[i];
  const dq = [];
  let ans = Infinity;
  for (let j = 0; j <= n; j += 1) {
    while (dq.length && pre[j] - pre[dq[0]] >= k) {
      ans = Math.min(ans, j - dq.shift());
    }
    while (dq.length && pre[j] <= pre[dq[dq.length - 1]]) dq.pop();
    dq.push(j);
  }
  return ans === Infinity ? -1 : ans;
}

// 16. sumSubarrayMins(arr)：所有子数组最小值之和。
function sumSubarrayMins(arr) {
  const mod = 1e9 + 7;
  const n = arr.length;
  const left = Array(n);
  const right = Array(n);
  const st = [];
  for (let i = 0; i < n; i += 1) {
    while (st.length && arr[st[st.length - 1]] > arr[i]) st.pop();
    left[i] = st.length ? i - st[st.length - 1] - 1 : i;
    st.push(i);
  }
  st.length = 0;
  for (let i = n - 1; i >= 0; i -= 1) {
    while (st.length && arr[st[st.length - 1]] >= arr[i]) st.pop();
    right[i] = st.length ? st[st.length - 1] - i - 1 : n - i - 1;
    st.push(i);
  }
  let ans = 0;
  for (let i = 0; i < n; i += 1) ans = (ans + arr[i] * (left[i] + 1) * (right[i] + 1)) % mod;
  return ans;
}

// 17. carFleet(target, position, speed)：车队数。
function carFleet(target, position, speed) {
  const n = position.length;
  const idx = Array.from({ length: n }, (_, i) => i);
  idx.sort((a, b) => position[a] - position[b]);
  let fleets = 0;
  let cur = 0;
  for (let k = n - 1; k >= 0; k -= 1) {
    const i = idx[k];
    const t = (target - position[i]) / speed[i];
    if (t > cur) {
      fleets += 1;
      cur = t;
    }
  }
  return fleets;
}

// 18. NestedIterator：嵌套列表迭代器（栈展开数组）。
class NestedIterator {
  constructor(nestedList) {
    this.st = [];
    for (let i = nestedList.length - 1; i >= 0; i -= 1) this.st.push(nestedList[i]);
  }
  hasNext() {
    this._flatten();
    return this.st.length > 0;
  }
  next() {
    this._flatten();
    return this.st.pop();
  }
  _flatten() {
    while (this.st.length && Array.isArray(this.st[this.st.length - 1])) {
      const arr = this.st.pop();
      for (let i = arr.length - 1; i >= 0; i -= 1) this.st.push(arr[i]);
    }
  }
}

// 19. validateStackSequences(pushed, popped)：是否合法出栈序列。
function validateStackSequences(pushed, popped) {
  const st = [];
  let j = 0;
  for (const x of pushed) {
    st.push(x);
    while (st.length && st[st.length - 1] === popped[j]) {
      st.pop();
      j += 1;
    }
  }
  return j === popped.length;
}

// 20. longestValidParentheses(s)：最长有效括号。
function longestValidParentheses(s) {
  const st = [-1];
  let ans = 0;
  for (let i = 0; i < s.length; i += 1) {
    if (s[i] === '(') st.push(i);
    else {
      st.pop();
      if (!st.length) st.push(i);
      else ans = Math.max(ans, i - st[st.length - 1]);
    }
  }
  return ans;
}

module.exports = {
  dailyTemperatures,
  nextGreaterElement,
  nextGreaterElementsII,
  largestRectangleArea,
  trap,
  maximalRectangle,
  StockSpanner,
  asteroidCollision,
  removeKdigits,
  decodeString,
  exclusiveTime,
  scoreOfParentheses,
  MinStack,
  maxSlidingWindow,
  shortestSubarray,
  sumSubarrayMins,
  carFleet,
  NestedIterator,
  validateStackSequences,
  longestValidParentheses,
};
