/**
 * 020501 高难度算法题（2026-02-05）
 * 难度：Hard / 面试压轴
 */

// ==================== 1. 接雨水 ====================
// 给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。
// 思路：双指针，每格雨水 = min(左侧最大, 右侧最大) - 当前高度

function trap(height) {
  let left = 0, right = height.length - 1;
  let maxL = 0, maxR = 0, sum = 0;
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
console.log(trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])); // 6


// ==================== 2. 最长有效括号 ====================
// 给定只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号子串的长度。

function longestValidParentheses(s) {
  let max = 0;
  const stack = [-1];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') stack.push(i);
    else {
      stack.pop();
      if (stack.length === 0) stack.push(i);
      else max = Math.max(max, i - stack[stack.length - 1]);
    }
  }
  return max;
}
console.log(longestValidParentheses(')()())')); // 4


// ==================== 3. 合并 K 个升序链表 ====================
// 给你一个链表数组，每个链表都是升序排列。将所有链表合并到一个升序链表中。

function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function mergeKLists(lists) {
  const mergeTwo = (a, b) => {
    const dummy = new ListNode(0);
    let p = dummy;
    while (a && b) {
      if (a.val <= b.val) { p.next = a; a = a.next; }
      else { p.next = b; b = b.next; }
      p = p.next;
    }
    p.next = a || b;
    return dummy.next;
  };
  if (!lists.length) return null;
  let step = 1;
  while (step < lists.length) {
    for (let i = 0; i < lists.length - step; i += step * 2) {
      lists[i] = mergeTwo(lists[i], lists[i + step]);
    }
    step *= 2;
  }
  return lists[0];
}


// ==================== 4. 二叉树的序列化与反序列化 ====================
// 设计算法实现二叉树的序列化与反序列化。不限制你的序列化逻辑，只需保证二叉树可被还原。

function serialize(root) {
  const res = [];
  const dfs = (node) => {
    if (!node) { res.push('N'); return; }
    res.push(String(node.val));
    dfs(node.left);
    dfs(node.right);
  };
  dfs(root);
  return res.join(',');
}

function deserialize(data) {
  const arr = data.split(',');
  let i = 0;
  const dfs = () => {
    if (arr[i] === 'N') { i++; return null; }
    const node = { val: parseInt(arr[i++], 10), left: null, right: null };
    node.left = dfs();
    node.right = dfs();
    return node;
  };
  return dfs();
}


// ==================== 5. LFU 缓存 ====================
// 实现 LFU：get/put O(1)。当容量满时，淘汰访问频率最低的；频率相同时淘汰最久未使用的。

class LFUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.minFreq = 0;
    this.keyToVal = new Map();
    this.keyToFreq = new Map();
    this.freqToKeys = new Map();
  }
  _updateFreq(key) {
    const freq = this.keyToFreq.get(key);
    const keys = this.freqToKeys.get(freq);
    keys.delete(key);
    if (keys.size === 0) {
      this.freqToKeys.delete(freq);
      if (this.minFreq === freq) this.minFreq++;
    }
    const newFreq = freq + 1;
    this.keyToFreq.set(key, newFreq);
    if (!this.freqToKeys.has(newFreq)) this.freqToKeys.set(newFreq, new Set());
    this.freqToKeys.get(newFreq).add(key);
  }
  get(key) {
    if (!this.cap || !this.keyToVal.has(key)) return -1;
    this._updateFreq(key);
    return this.keyToVal.get(key);
  }
  put(key, value) {
    if (this.cap === 0) return;
    if (this.keyToVal.has(key)) {
      this.keyToVal.set(key, value);
      this._updateFreq(key);
      return;
    }
    if (this.keyToVal.size >= this.cap) {
      const keys = this.freqToKeys.get(this.minFreq);
      const evict = keys.values().next().value;
      keys.delete(evict);
      if (keys.size === 0) this.freqToKeys.delete(this.minFreq);
      this.keyToVal.delete(evict);
      this.keyToFreq.delete(evict);
    }
    this.keyToVal.set(key, value);
    this.keyToFreq.set(key, 1);
    if (!this.freqToKeys.has(1)) this.freqToKeys.set(1, new Set());
    this.freqToKeys.get(1).add(key);
    this.minFreq = 1;
  }
}


// ==================== 6. 滑动窗口最大值 ====================
// 给定数组和 k，返回每个长度为 k 的滑动窗口中的最大值。要求 O(n)。

function maxSlidingWindow(nums, k) {
  const q = [];
  const res = [];
  for (let i = 0; i < nums.length; i++) {
    while (q.length && nums[q[q.length - 1]] <= nums[i]) q.pop();
    q.push(i);
    if (q[0] <= i - k) q.shift();
    if (i >= k - 1) res.push(nums[q[0]]);
  }
  return res;
}
console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)); // [3, 3, 5, 5, 6, 7]


// ==================== 7. 最小覆盖子串 ====================
// 给定字符串 s、t，在 s 里找出包含 t 所有字符的最小子串。不存在返回 ''。

function minWindow(s, t) {
  const need = {};
  for (const c of t) need[c] = (need[c] || 0) + 1;
  let needCount = t.length;
  let start = 0, len = Infinity;
  let left = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (need[c] !== undefined) {
      if (need[c] > 0) needCount--;
      need[c]--;
    }
    while (needCount === 0) {
      if (right - left + 1 < len) {
        len = right - left + 1;
        start = left;
      }
      const lc = s[left];
      if (need[lc] !== undefined) {
        need[lc]++;
        if (need[lc] > 0) needCount++;
      }
      left++;
    }
  }
  return len === Infinity ? '' : s.slice(start, start + len);
}
console.log(minWindow('ADOBECODEBANC', 'ABC')); // "BANC"


// ==================== 8. 编辑距离（Levenshtein） ====================
// 将 word1 转换成 word2 所使用的最少单字符操作数（插入、删除、替换）。

function minDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}
console.log(minDistance('horse', 'ros')); // 3


// ==================== 9. 正则表达式匹配 ====================
// 实现支持 '.' 和 '*' 的正则匹配。'.' 匹配任意单字符，'*' 匹配零个或多个前一元素。

function isMatch(s, p) {
  const m = s.length, n = p.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 2; j <= n; j += 2) {
    if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2];
  }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (p[j - 1] === '*') {
        dp[i][j] = dp[i][j - 2] ||
          (dp[i - 1][j] && (s[i - 1] === p[j - 2] || p[j - 2] === '.'));
      } else {
        dp[i][j] = dp[i - 1][j - 1] && (s[i - 1] === p[j - 1] || p[j - 1] === '.');
      }
    }
  }
  return dp[m][n];
}
console.log(isMatch('aab', 'c*a*b')); // true


// ==================== 10. 寻找两个正序数组的中位数 ====================
// 给定两个大小分别为 m、n 的正序数组，找出并返回中位数。要求 O(log(m+n))。

function findMedianSortedArrays(nums1, nums2) {
  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);
  const m = nums1.length, n = nums2.length;
  let lo = 0, hi = m;
  while (lo <= hi) {
    const i = (lo + hi) >> 1;
    const j = ((m + n + 1) >> 1) - i;
    const L1 = i === 0 ? -Infinity : nums1[i - 1];
    const R1 = i === m ? Infinity : nums1[i];
    const L2 = j === 0 ? -Infinity : nums2[j - 1];
    const R2 = j === n ? Infinity : nums2[j];
    if (L1 <= R2 && L2 <= R1) {
      const leftMax = Math.max(L1, L2);
      if ((m + n) % 2) return leftMax;
      return (leftMax + Math.min(R1, R2)) / 2;
    }
    if (L1 > R2) hi = i - 1;
    else lo = i + 1;
  }
}


// ==================== 11. 缺失的第一个正数 ====================
// 给你未排序的整数数组，找出其中没有出现的最小的正整数。要求 O(n) 时间、O(1) 空间。

function firstMissingPositive(nums) {
  const n = nums.length;
  for (let i = 0; i < n; i++) {
    while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      [nums[nums[i] - 1], nums[i]] = [nums[i], nums[nums[i] - 1]];
    }
  }
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) return i + 1;
  }
  return n + 1;
}
console.log(firstMissingPositive([3, 4, -1, 1])); // 2


// ==================== 12. 戳气球 ====================
// 有 n 个气球，nums[i] 表示第 i 个气球的分数。戳破 i 获得 nums[i-1]*nums[i]*nums[i+1]，边界为 1。求最大得分。

function maxCoins(nums) {
  const a = [1, ...nums, 1];
  const n = a.length;
  const dp = Array(n).fill(0).map(() => Array(n).fill(0));
  for (let len = 2; len < n; len++) {
    for (let i = 0; i + len < n; i++) {
      const j = i + len;
      for (let k = i + 1; k < j; k++) {
        dp[i][j] = Math.max(dp[i][j], a[i] * a[k] * a[j] + dp[i][k] + dp[k][j]);
      }
    }
  }
  return dp[0][n - 1];
}


// ==================== 13. 单词拆分 II ====================
// 给定非空字符串 s 和单词字典 wordDict，在 s 中添加空格构成句子，使每个单词都在字典中。返回所有可能句子。

function wordBreakII(s, wordDict) {
  const set = new Set(wordDict);
  const memo = new Map();
  function dfs(start) {
    if (start === s.length) return [''];
    if (memo.has(start)) return memo.get(start);
    const res = [];
    for (let end = start + 1; end <= s.length; end++) {
      const w = s.slice(start, end);
      if (set.has(w)) {
        const rest = dfs(end);
        for (const r of rest) res.push(w + (r ? ' ' + r : ''));
      }
    }
    memo.set(start, res);
    return res;
  }
  return dfs(0);
}


// ==================== 14. 数据流中位数 ====================
// 支持 addNum 和 findMedian，设计数据结构使 findMedian O(1)。

class MedianFinder {
  constructor() {
    this.small = []; // 大顶堆，存较小一半
    this.large = []; // 小顶堆，存较大一半
  }
  addNum(num) {
    if (this.small.length === 0 || num <= -this.small[0]) {
      this.small.push(-num);
      this._heapUp(this.small, true);
    } else {
      this.large.push(num);
      this._heapUp(this.large, false);
    }
    if (this.small.length > this.large.length + 1) {
      this.large.push(-this._heapPop(this.small));
      this._heapUp(this.large, false);
    } else if (this.large.length > this.small.length) {
      this.small.push(-this._heapPop(this.large));
      this._heapUp(this.small, true);
    }
  }
  _heapUp(arr, isMax) {
    let i = arr.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      const cmp = isMax ? arr[p] >= arr[i] : arr[p] <= arr[i];
      if (cmp) break;
      [arr[p], arr[i]] = [arr[i], arr[p]];
      i = p;
    }
  }
  _heapPop(arr) {
    const top = arr[0];
    arr[0] = arr.pop();
    let i = 0, n = arr.length;
    while (true) {
      let c = i * 2 + 1;
      if (c >= n) break;
      if (c + 1 < n && arr[c + 1] > arr[c]) c++;
      if (arr[i] >= arr[c]) break;
      [arr[i], arr[c]] = [arr[c], arr[i]];
      i = c;
    }
    return top;
  }
  findMedian() {
    if (this.small.length > this.large.length) return -this.small[0];
    return (-this.small[0] + this.large[0]) / 2;
  }
}


// ==================== 15. 实现 Trie（前缀树）支持模糊搜索 ====================
// 实现 insert、search、startsWith；并支持 search 中 '.' 可匹配任意字母。

class TrieNode {
  constructor() {
    this.children = {};
    this.isEnd = false;
  }
}
class WordDictionary {
  constructor() { this.root = new TrieNode(); }
  addWord(word) {
    let node = this.root;
    for (const c of word) {
      if (!node.children[c]) node.children[c] = new TrieNode();
      node = node.children[c];
    }
    node.isEnd = true;
  }
  search(word, node = this.root, i = 0) {
    if (i === word.length) return node.isEnd;
    const c = word[i];
    if (c === '.') {
      for (const key of Object.keys(node.children)) {
        if (this.search(word, node.children[key], i + 1)) return true;
      }
      return false;
    }
    if (!node.children[c]) return false;
    return this.search(word, node.children[c], i + 1);
  }
}
