/**
 * daily03313-full-code.js
 * 3313 题「implement」算法完整参考实现
 */

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

module.exports = {
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
};
