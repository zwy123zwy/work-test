/**
 * 0411.js — 前端代码算法题 20 道（数组 / 矩阵 / 区间 / 单调栈 / 哈希堆）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. sortColors(nums)：荷兰国旗，原地将 0、1、2 排序。
// 答：三指针 low/mid/high，mid 遇 0 与 low 换，遇 2 与 high 换。
function sortColors(nums) {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low += 1;
      mid += 1;
    } else if (nums[mid] === 1) {
      mid += 1;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high -= 1;
    }
  }
}

// 2. rotate(nums, k)：向右旋转 k 位（原地）。
// 答：k %= n；反转 [0,n-1]、[0,k-1]、[k,n-1]。
function rotate(nums, k) {
  const n = nums.length;
  if (n === 0) return;
  k %= n;
  const rev = (l, r) => {
    while (l < r) {
      [nums[l], nums[r]] = [nums[r], nums[l]];
      l += 1;
      r -= 1;
    }
  };
  rev(0, n - 1);
  rev(0, k - 1);
  rev(k, n - 1);
}

// 3. maxSubArray(nums)：最大子数组和（Kadane）。
// 答：cur = max(x, cur+x)，ans 取 max。
function maxSubArray(nums) {
  let cur = nums[0];
  let ans = nums[0];
  for (let i = 1; i < nums.length; i += 1) {
    cur = Math.max(nums[i], cur + nums[i]);
    ans = Math.max(ans, cur);
  }
  return ans;
}

// 4. productExceptSelf(nums)：除自身外乘积（不用除法）。
// 答：左积数组 × 右积一次遍历。
function productExceptSelf(nums) {
  const n = nums.length;
  const res = Array(n).fill(1);
  let p = 1;
  for (let i = 0; i < n; i += 1) {
    res[i] = p;
    p *= nums[i];
  }
  p = 1;
  for (let i = n - 1; i >= 0; i -= 1) {
    res[i] *= p;
    p *= nums[i];
  }
  return res;
}

// 5. spiralOrder(matrix)：螺旋顺序返回矩阵元素。
// 答：四边界 top/bottom/left/right，向里收缩。
function spiralOrder(matrix) {
  if (!matrix.length) return [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;
  const res = [];
  while (top <= bottom && left <= right) {
    for (let j = left; j <= right; j += 1) res.push(matrix[top][j]);
    top += 1;
    for (let i = top; i <= bottom; i += 1) res.push(matrix[i][right]);
    right -= 1;
    if (top <= bottom) {
      for (let j = right; j >= left; j -= 1) res.push(matrix[bottom][j]);
      bottom -= 1;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i -= 1) res.push(matrix[i][left]);
      left += 1;
    }
  }
  return res;
}

// 6. setZeroes(matrix)：若某格为 0，则整行整列置 0（原地，O(1) 额外）。
// 答：首行首列作标记，先扫内部，再处理首行首列。
function setZeroes(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  let row0 = false;
  let col0 = false;
  for (let j = 0; j < n; j += 1) if (matrix[0][j] === 0) row0 = true;
  for (let i = 0; i < m; i += 1) if (matrix[i][0] === 0) col0 = true;
  for (let i = 1; i < m; i += 1) {
    for (let j = 1; j < n; j += 1) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;
        matrix[0][j] = 0;
      }
    }
  }
  for (let i = 1; i < m; i += 1) {
    if (matrix[i][0] === 0) {
      for (let j = 1; j < n; j += 1) matrix[i][j] = 0;
    }
  }
  for (let j = 1; j < n; j += 1) {
    if (matrix[0][j] === 0) {
      for (let i = 1; i < m; i += 1) matrix[i][j] = 0;
    }
  }
  if (row0) for (let j = 0; j < n; j += 1) matrix[0][j] = 0;
  if (col0) for (let i = 0; i < m; i += 1) matrix[i][0] = 0;
}

// 7. merge(intervals)：合并重叠区间。
// 答：按左端排序，依次合并。
function merge(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const res = [intervals[0].slice()];
  for (let i = 1; i < intervals.length; i += 1) {
    const cur = intervals[i];
    const last = res[res.length - 1];
    if (cur[0] <= last[1]) last[1] = Math.max(last[1], cur[1]);
    else res.push(cur.slice());
  }
  return res;
}

// 8. insert(intervals, newInterval)：插入新区间并合并。
// 答：一次遍历：左侧、重叠合并、右侧。
function insert(intervals, newInterval) {
  const [ns, ne] = newInterval;
  const res = [];
  let i = 0;
  const n = intervals.length;
  while (i < n && intervals[i][1] < ns) {
    res.push(intervals[i].slice());
    i += 1;
  }
  let s = ns;
  let e = ne;
  while (i < n && intervals[i][0] <= e) {
    s = Math.min(s, intervals[i][0]);
    e = Math.max(e, intervals[i][1]);
    i += 1;
  }
  res.push([s, e]);
  while (i < n) {
    res.push(intervals[i].slice());
    i += 1;
  }
  return res;
}

// 9. search(nums, target)：旋转有序数组中搜索（无重复）。
// 答：二分，判断哪半有序再判 target 是否在其中。
function search(nums, target) {
  let l = 0;
  let r = nums.length - 1;
  while (l <= r) {
    const mid = (l + r) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[l] <= nums[mid]) {
      if (target >= nums[l] && target < nums[mid]) r = mid - 1;
      else l = mid + 1;
    } else {
      if (target > nums[mid] && target <= nums[r]) l = mid + 1;
      else r = mid - 1;
    }
  }
  return -1;
}

// 10. findMin(nums)：旋转有序数组最小值（可含重复）。
// 答：二分，与右端比较缩区间。
function findMin(nums) {
  let l = 0;
  let r = nums.length - 1;
  while (l < r) {
    const mid = (l + r) >> 1;
    if (nums[mid] > nums[r]) l = mid + 1;
    else if (nums[mid] < nums[r]) r = mid;
    else r -= 1;
  }
  return nums[l];
}

// 11. findKthLargest(nums, k)：第 k 大（快选）。
// 答：partition 随机/取中，缩范围。
function findKthLargest(nums, k) {
  const target = nums.length - k;
  const swap = (i, j) => {
    const t = nums[i];
    nums[i] = nums[j];
    nums[j] = t;
  };
  const partition = (lo, hi) => {
    const pivot = nums[hi];
    let i = lo;
    for (let j = lo; j < hi; j += 1) {
      if (nums[j] <= pivot) {
        swap(i, j);
        i += 1;
      }
    }
    swap(i, hi);
    return i;
  };
  let lo = 0;
  let hi = nums.length - 1;
  while (true) {
    const p = partition(lo, hi);
    if (p === target) return nums[p];
    if (p < target) lo = p + 1;
    else hi = p - 1;
  }
}

// 12. topKFrequent(nums, k)：出现频率前 k 的元素。
// 答：哈希计数 + 桶排序或最小堆（此处桶）。
function topKFrequent(nums, k) {
  const cnt = new Map();
  for (const x of nums) cnt.set(x, (cnt.get(x) || 0) + 1);
  const buckets = Array(nums.length + 1).fill(null).map(() => []);
  for (const [num, c] of cnt) buckets[c].push(num);
  const res = [];
  for (let i = buckets.length - 1; i >= 1 && res.length < k; i -= 1) {
    for (const x of buckets[i]) {
      res.push(x);
      if (res.length === k) return res;
    }
  }
  return res;
}

// 13. groupAnagrams(strs)：字母异位词分组。
// 答：排序作 key 或 26 维计数作 key。
function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return Array.from(map.values());
}

// 14. evalRPN(tokens)：逆波兰表达式求值。
// 答：栈遇运算符弹两数。
function evalRPN(tokens) {
  const st = [];
  const op = new Set(['+', '-', '*', '/']);
  for (const t of tokens) {
    if (!op.has(t)) {
      st.push(Number(t));
      continue;
    }
    const b = st.pop();
    const a = st.pop();
    if (t === '+') st.push(a + b);
    else if (t === '-') st.push(a - b);
    else if (t === '*') st.push(a * b);
    else st.push(Math.trunc(a / b));
  }
  return st.pop();
}

// 15. dailyTemperatures(temperatures)：每日温度等几天更暖。
// 答：单调递减栈存下标。
function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const res = Array(n).fill(0);
  const st = [];
  for (let i = 0; i < n; i += 1) {
    while (st.length && temperatures[i] > temperatures[st[st.length - 1]]) {
      const j = st.pop();
      res[j] = i - j;
    }
    st.push(i);
  }
  return res;
}

// 16. largestRectangleArea(heights)：柱状图最大矩形。
// 答：单调递增栈 + 哨兵 0。
function largestRectangleArea(heights) {
  const h = [0, ...heights, 0];
  const st = [0];
  let ans = 0;
  for (let i = 1; i < h.length; i += 1) {
    while (h[i] < h[st[st.length - 1]]) {
      const top = st.pop();
      ans = Math.max(ans, h[top] * (i - st[st.length - 1] - 1));
    }
    st.push(i);
  }
  return ans;
}

// 17. MinStack：支持 O(1) min 的栈。
// 答：辅助栈同步最小值。
class MinStack {
  constructor() {
    this.st = [];
    this.minSt = [];
  }

  push(val) {
    this.st.push(val);
    if (this.minSt.length === 0 || val <= this.minSt[this.minSt.length - 1]) {
      this.minSt.push(val);
    }
  }

  pop() {
    const v = this.st.pop();
    if (v === this.minSt[this.minSt.length - 1]) this.minSt.pop();
    return v;
  }

  top() {
    return this.st[this.st.length - 1];
  }

  getMin() {
    return this.minSt[this.minSt.length - 1];
  }
}

// 18. isValid(s)：括号是否合法。
// 答：栈配对。
function isValid(s) {
  const map = { ')': '(', ']': '[', '}': '{' };
  const st = [];
  for (const ch of s) {
    if (ch === '(' || ch === '[' || ch === '{') st.push(ch);
    else if (map[ch]) {
      if (!st.length || st.pop() !== map[ch]) return false;
    }
  }
  return st.length === 0;
}

// 19. simplifyPath(path)：Unix 绝对路径规范化。
// 答：按 / 分割，栈处理 .、..、段名。
function simplifyPath(path) {
  const parts = path.split('/').filter(Boolean);
  const st = [];
  for (const p of parts) {
    if (p === '.' || p === '') continue;
    if (p === '..') {
      if (st.length) st.pop();
    } else st.push(p);
  }
  return `/${st.join('/')}`;
}

// 20. exist(board, word)：二维网格是否存在 word 路径（相邻格，不重复用同一格）。
// 答：DFS + 回溯，原地标记访问。
function exist(board, word) {
  const m = board.length;
  const n = board[0].length;
  const dfs = (i, j, k) => {
    if (k === word.length) return true;
    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== word[k]) return false;
    const tmp = board[i][j];
    board[i][j] = '#';
    const ok =
      dfs(i + 1, j, k + 1) ||
      dfs(i - 1, j, k + 1) ||
      dfs(i, j + 1, k + 1) ||
      dfs(i, j - 1, k + 1);
    board[i][j] = tmp;
    return ok;
  };
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (dfs(i, j, 0)) return true;
    }
  }
  return false;
}

module.exports = {
  sortColors,
  rotate,
  maxSubArray,
  productExceptSelf,
  spiralOrder,
  setZeroes,
  merge,
  insert,
  search,
  findMin,
  findKthLargest,
  topKFrequent,
  groupAnagrams,
  evalRPN,
  dailyTemperatures,
  largestRectangleArea,
  MinStack,
  isValid,
  simplifyPath,
  exist,
};
