/**
 * 04168.js — 前端代码算法题 20 道（设计题 / LRU / 数据结构）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. LRUCache(capacity)
class LRUCache {
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
      const first = this.map.keys().next().value;
      this.map.delete(first);
    }
  }
}

// 2. RandomizedSet：O(1) 插入删除随机取。
class RandomizedSet {
  constructor() {
    this.arr = [];
    this.idx = new Map();
  }
  insert(val) {
    if (this.idx.has(val)) return false;
    this.idx.set(val, this.arr.length);
    this.arr.push(val);
    return true;
  }
  remove(val) {
    if (!this.idx.has(val)) return false;
    const i = this.idx.get(val);
    const last = this.arr[this.arr.length - 1];
    this.arr[i] = last;
    this.idx.set(last, i);
    this.arr.pop();
    this.idx.delete(val);
    return true;
  }
  getRandom() {
    return this.arr[(Math.random() * this.arr.length) | 0];
  }
}

// 3. MyHashMap：简单链地址哈希。
class MyHashMap {
  constructor() {
    this.buckets = Array.from({ length: 1009 }, () => []);
  }
  _h(key) {
    return key % 1009;
  }
  put(key, value) {
    const b = this.buckets[this._h(key)];
    const f = b.find((x) => x[0] === key);
    if (f) f[1] = value;
    else b.push([key, value]);
  }
  get(key) {
    const b = this.buckets[this._h(key)];
    const f = b.find((x) => x[0] === key);
    return f ? f[1] : -1;
  }
  remove(key) {
    const b = this.buckets[this._h(key)];
    const i = b.findIndex((x) => x[0] === key);
    if (i >= 0) b.splice(i, 1);
  }
}

// 4. MyCalendar：无重叠预订。
class MyCalendar {
  constructor() {
    this.booked = [];
  }
  book(start, end) {
    for (const [s, e] of this.booked) {
      if (Math.max(s, start) < Math.min(e, end)) return false;
    }
    this.booked.push([start, end]);
    return true;
  }
}

// 5. MyCalendarTwo：最多双重预订。
class MyCalendarTwo {
  constructor() {
    this.once = [];
    this.twice = [];
  }
  book(start, end) {
    for (const [s, e] of this.twice) {
      if (Math.max(s, start) < Math.min(e, end)) return false;
    }
    for (const [s, e] of this.once) {
      const a = Math.max(s, start);
      const b = Math.min(e, end);
      if (a < b) this.twice.push([a, b]);
    }
    this.once.push([start, end]);
    return true;
  }
}

// 6. RangeModule：区间增删查。
class RangeModule {
  constructor() {
    this.ranges = [];
  }
  _merge() {
    this.ranges.sort((a, b) => a[0] - b[0]);
    const m = [];
    for (const [l, r] of this.ranges) {
      if (!m.length || l > m[m.length - 1][1]) m.push([l, r]);
      else m[m.length - 1][1] = Math.max(m[m.length - 1][1], r);
    }
    this.ranges = m;
  }
  addRange(left, right) {
    this.ranges.push([left, right]);
    this._merge();
  }
  queryRange(left, right) {
    for (const [l, r] of this.ranges) {
      if (l <= left && right <= r) return true;
    }
    return false;
  }
  removeRange(left, right) {
    const next = [];
    for (const [l, r] of this.ranges) {
      if (r <= left || l >= right) next.push([l, r]);
      else {
        if (l < left) next.push([l, left]);
        if (r > right) next.push([right, r]);
      }
    }
    this.ranges = next;
  }
}

// 7. SnapshotArray
class SnapshotArray {
  constructor(length) {
    this.snapId = 0;
    this.data = Array.from({ length }, () => [[0, 0]]);
  }
  set(index, val) {
    const row = this.data[index];
    if (row[row.length - 1][0] === this.snapId) row[row.length - 1][1] = val;
    else row.push([this.snapId, val]);
  }
  snap() {
    this.snapId += 1;
    return this.snapId - 1;
  }
  get(index, snap_id) {
    const row = this.data[index];
    let lo = 0;
    let hi = row.length - 1;
    let ans = 0;
    while (lo <= hi) {
      const m = (lo + hi) >> 1;
      if (row[m][0] <= snap_id) {
        ans = row[m][1];
        lo = m + 1;
      } else hi = m - 1;
    }
    return ans;
  }
}

// 8. AllOne：O(1) 全 1 结构（简化：Map + 桶双向链表略，此处用 Map 计数 + 取最值）。
class AllOne {
  constructor() {
    this.cnt = new Map();
  }
  inc(key) {
    this.cnt.set(key, (this.cnt.get(key) || 0) + 1);
  }
  dec(key) {
    const v = this.cnt.get(key) - 1;
    if (v === 0) this.cnt.delete(key);
    else this.cnt.set(key, v);
  }
  getMaxKey() {
    let best = '';
    let m = -Infinity;
    for (const [k, v] of this.cnt) {
      if (v > m || (v === m && k < best)) {
        m = v;
        best = k;
      }
    }
    return best;
  }
  getMinKey() {
    let best = '';
    let m = Infinity;
    for (const [k, v] of this.cnt) {
      if (v < m || (v === m && k < best)) {
        m = v;
        best = k;
      }
    }
    return best;
  }
}

// 9. MovingAverage(size)
class MovingAverage {
  constructor(size) {
    this.n = size;
    this.q = [];
    this.sum = 0;
  }
  next(val) {
    this.q.push(val);
    this.sum += val;
    if (this.q.length > this.n) this.sum -= this.q.shift();
    return this.sum / this.q.length;
  }
}

// 10. HitCounter：5 分钟内命中（秒级时间戳）。
class HitCounter {
  constructor() {
    this.q = [];
  }
  hit(timestamp) {
    this.q.push(timestamp);
  }
  getHits(timestamp) {
    while (this.q.length && timestamp - this.q[0] >= 300) this.q.shift();
    return this.q.length;
  }
}

// 11. MedianFinder：见 04161，此处提供简化版仅接口占位。
class MedianFinderSimple {
  constructor() {
    this.arr = [];
  }
  addNum(n) {
    this.arr.push(n);
    this.arr.sort((a, b) => a - b);
  }
  findMedian() {
    const m = this.arr.length >> 1;
    return this.arr.length % 2 ? this.arr[m] : (this.arr[m - 1] + this.arr[m]) / 2;
  }
}

// 12. WordDictionary：通配符搜索。
class WordDictionary {
  constructor() {
    this.root = {};
  }
  addWord(word) {
    let n = this.root;
    for (const c of word) {
      if (!n[c]) n[c] = {};
      n = n[c];
    }
    n.end = true;
  }
  search(word) {
    const dfs = (node, i) => {
      if (i === word.length) return !!node.end;
      const c = word[i];
      if (c === '.') {
        for (const k of Object.keys(node)) {
          if (k !== 'end' && dfs(node[k], i + 1)) return true;
        }
        return false;
      }
      if (!node[c]) return false;
      return dfs(node[c], i + 1);
    };
    return dfs(this.root, 0);
  }
}

// 13. TrieNode 前缀树 + 统计。
class TrieWithCount {
  constructor() {
    this.root = { pass: 0, end: 0, next: {} };
  }
  insert(word) {
    let n = this.root;
    if (!n.pass) n.pass = 0;
    n.pass += 1;
    for (const c of word) {
      if (!n.next[c]) n.next[c] = { pass: 0, end: 0, next: {} };
      n = n.next[c];
      n.pass += 1;
    }
    n.end += 1;
  }
  countWordsEqualTo(word) {
    let n = this.root;
    for (const c of word) {
      if (!n.next[c]) return 0;
      n = n.next[c];
    }
    return n.end;
  }
  countWordsStartingWith(pre) {
    let n = this.root;
    for (const c of pre) {
      if (!n.next[c]) return 0;
      n = n.next[c];
    }
    return n.pass || 0;
  }
}

// 14. StockSpanner：见 04163，此处精简。
class StockSpannerShort {
  constructor() {
    this.st = [];
  }
  next(price) {
    let span = 1;
    while (this.st.length && this.st[this.st.length - 1][0] <= price) span += this.st.pop()[1];
    this.st.push([price, span]);
    return span;
  }
}

// 15. ZigzagIterator
class ZigzagIterator {
  constructor(v1, v2) {
    this.q = [];
    v1.forEach((x) => this.q.push([0, x]));
    v2.forEach((x) => this.q.push([1, x]));
    this.i = 0;
  }
  next() {
    const item = this.q[this.i];
    this.i += 1;
    return item[1];
  }
  hasNext() {
    return this.i < this.q.length;
  }
}

// 16. PeekingIterator（数组模拟）
class PeekingIterator {
  constructor(arr) {
    this.arr = arr;
    this.i = 0;
  }
  peek() {
    return this.arr[this.i];
  }
  next() {
    return this.arr[this.i++];
  }
  hasNext() {
    return this.i < this.arr.length;
  }
}

// 17. BSTIterator：BST 中序迭代器。
class BSTIterator {
  constructor(root) {
    this.st = [];
    this._left(root);
  }
  _left(node) {
    while (node) {
      this.st.push(node);
      node = node.left;
    }
  }
  next() {
    const n = this.st.pop();
    this._left(n.right);
    return n.val;
  }
  hasNext() {
    return this.st.length > 0;
  }
}

// 18. SummaryRanges：有序数组转区间字符串。
function summaryRanges(nums) {
  const ans = [];
  let i = 0;
  while (i < nums.length) {
    const s = nums[i];
    let j = i;
    while (j + 1 < nums.length && nums[j + 1] === nums[j] + 1) j += 1;
    if (s === nums[j]) ans.push(String(s));
    else ans.push(`${s}->${nums[j]}`);
    i = j + 1;
  }
  return ans;
}

// 19. Codec：二叉树层序序列化（LeetCode 风格）。
function serializeLevel(root) {
  if (!root) return '[]';
  const q = [root];
  const out = [];
  while (q.length) {
    const n = q.shift();
    if (!n) {
      out.push('null');
      continue;
    }
    out.push(String(n.val));
    q.push(n.left);
    q.push(n.right);
  }
  while (out.length > 1 && out[out.length - 1] === 'null') out.pop();
  return `[${out.join(',')}]`;
}

// 20. deserializeLevel(data)：解析层序字符串。
function deserializeLevel(data) {
  if (data === '[]' || !data) return null;
  const parts = data.slice(1, -1).split(',');
  if (!parts[0] || parts[0] === 'null') return null;
  const root = { val: +parts[0], left: null, right: null };
  const q = [root];
  let i = 1;
  while (q.length && i < parts.length) {
    const n = q.shift();
    const l = parts[i++];
    const r = parts[i++];
    if (l && l !== 'null') {
      n.left = { val: +l, left: null, right: null };
      q.push(n.left);
    }
    if (r && r !== 'null') {
      n.right = { val: +r, left: null, right: null };
      q.push(n.right);
    }
  }
  return root;
}

module.exports = {
  LRUCache,
  RandomizedSet,
  MyHashMap,
  MyCalendar,
  MyCalendarTwo,
  RangeModule,
  SnapshotArray,
  AllOne,
  MovingAverage,
  HitCounter,
  MedianFinderSimple,
  WordDictionary,
  TrieWithCount,
  StockSpannerShort,
  ZigzagIterator,
  PeekingIterator,
  BSTIterator,
  summaryRanges,
  serializeLevel,
  deserializeLevel,
};
