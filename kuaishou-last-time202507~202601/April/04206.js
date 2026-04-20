// 04206 - 算法专题（含参考答案）

// 问题1：实现二分查找
function solution_04206_1(arr, target) {
  let l = 0;
  let r = arr.length - 1;
  while (l <= r) {
    const m = (l + r) >> 1;
    if (arr[m] === target) return m;
    if (arr[m] < target) l = m + 1;
    else r = m - 1;
  }
  return -1;
}

// 问题2：实现快速排序
function solution_04206_2(arr) {
  if (arr.length <= 1) return arr.slice();
  const [p, ...rest] = arr;
  const left = rest.filter((x) => x < p);
  const right = rest.filter((x) => x >= p);
  return [...solution_04206_2(left), p, ...solution_04206_2(right)];
}

// 问题3：实现归并排序
function solution_04206_3(arr) {
  if (arr.length <= 1) return arr.slice();
  const mid = arr.length >> 1;
  const left = solution_04206_3(arr.slice(0, mid));
  const right = solution_04206_3(arr.slice(mid));
  const res = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    res.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return [...res, ...left.slice(i), ...right.slice(j)];
}

// 问题4：实现堆排序
function solution_04206_4(arr) {
  const a = arr.slice();
  const heapify = (i, n) => {
    let largest = i;
    const l = i * 2 + 1;
    const r = i * 2 + 2;
    if (l < n && a[l] > a[largest]) largest = l;
    if (r < n && a[r] > a[largest]) largest = r;
    if (largest !== i) {
      [a[i], a[largest]] = [a[largest], a[i]];
      heapify(largest, n);
    }
  };
  for (let i = (a.length >> 1) - 1; i >= 0; i -= 1) heapify(i, a.length);
  for (let i = a.length - 1; i > 0; i -= 1) {
    [a[0], a[i]] = [a[i], a[0]];
    heapify(0, i);
  }
  return a;
}

// 问题5：实现冒泡排序
function solution_04206_5(arr) {
  const a = arr.slice();
  for (let i = 0; i < a.length; i += 1) {
    for (let j = 0; j < a.length - i - 1; j += 1) {
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
    }
  }
  return a;
}

// 问题6：实现选择排序
function solution_04206_6(arr) {
  const a = arr.slice();
  for (let i = 0; i < a.length; i += 1) {
    let min = i;
    for (let j = i + 1; j < a.length; j += 1) if (a[j] < a[min]) min = j;
    [a[i], a[min]] = [a[min], a[i]];
  }
  return a;
}

// 问题7：实现插入排序
function solution_04206_7(arr) {
  const a = arr.slice();
  for (let i = 1; i < a.length; i += 1) {
    const cur = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > cur) {
      a[j + 1] = a[j];
      j -= 1;
    }
    a[j + 1] = cur;
  }
  return a;
}

// 问题8：实现计数排序
function solution_04206_8(arr) {
  if (!arr.length) return [];
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const cnt = Array(max - min + 1).fill(0);
  arr.forEach((x) => {
    cnt[x - min] += 1;
  });
  const res = [];
  cnt.forEach((n, i) => {
    while (n--) res.push(i + min);
  });
  return res;
}

// 问题9：实现拓扑排序
function solution_04206_9(n, edges) {
  const graph = Array.from({ length: n }, () => []);
  const indeg = Array(n).fill(0);
  edges.forEach(([u, v]) => {
    graph[u].push(v);
    indeg[v] += 1;
  });
  const q = [];
  indeg.forEach((d, i) => {
    if (d === 0) q.push(i);
  });
  const res = [];
  while (q.length) {
    const u = q.shift();
    res.push(u);
    for (const v of graph[u]) {
      indeg[v] -= 1;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return res.length === n ? res : [];
}

// 问题10：实现 BFS
function solution_04206_10(graph, start) {
  const visited = new Set([start]);
  const q = [start];
  const res = [];
  while (q.length) {
    const cur = q.shift();
    res.push(cur);
    for (const nxt of graph[cur] || []) {
      if (!visited.has(nxt)) {
        visited.add(nxt);
        q.push(nxt);
      }
    }
  }
  return res;
}

// 问题11：实现 DFS
function solution_04206_11(graph, start) {
  const visited = new Set();
  const res = [];
  const dfs = (u) => {
    visited.add(u);
    res.push(u);
    for (const v of graph[u] || []) if (!visited.has(v)) dfs(v);
  };
  dfs(start);
  return res;
}

// 问题12：实现最短路径 Dijkstra
function solution_04206_12(graph, start) {
  const dist = {};
  const visited = new Set();
  Object.keys(graph).forEach((k) => {
    dist[k] = Infinity;
  });
  dist[start] = 0;
  while (visited.size < Object.keys(graph).length) {
    let u = null;
    let min = Infinity;
    for (const node of Object.keys(graph)) {
      if (!visited.has(node) && dist[node] < min) {
        min = dist[node];
        u = node;
      }
    }
    if (u == null) break;
    visited.add(u);
    for (const [v, w] of graph[u]) {
      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    }
  }
  return dist;
}

// 问题13：实现并查集 UnionFind
class solution_04206_13 {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = Array(n).fill(1);
  }
  find(x) {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(a, b) {
    let pa = this.find(a);
    let pb = this.find(b);
    if (pa === pb) return false;
    if (this.rank[pa] < this.rank[pb]) [pa, pb] = [pb, pa];
    this.parent[pb] = pa;
    this.rank[pa] += this.rank[pb];
    return true;
  }
}

// 问题14：实现 LRU 缓存
class solution_04206_14 {
  constructor(capacity) {
    this.cap = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
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

// 问题15：实现最小栈 MinStack
class solution_04206_15 {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }
  push(x) {
    this.stack.push(x);
    const min = this.minStack.length ? Math.min(this.minStack[this.minStack.length - 1], x) : x;
    this.minStack.push(min);
  }
  pop() {
    this.minStack.pop();
    return this.stack.pop();
  }
  top() {
    return this.stack[this.stack.length - 1];
  }
  getMin() {
    return this.minStack[this.minStack.length - 1];
  }
}

// 问题16：实现单调栈 nextGreaterElement
function solution_04206_16(nums) {
  const res = Array(nums.length).fill(-1);
  const st = [];
  for (let i = 0; i < nums.length; i += 1) {
    while (st.length && nums[st[st.length - 1]] < nums[i]) {
      const idx = st.pop();
      res[idx] = nums[i];
    }
    st.push(i);
  }
  return res;
}

// 问题17：实现滑动窗口最小覆盖子串
function solution_04206_17(s, t) {
  const need = {};
  for (const ch of t) need[ch] = (need[ch] || 0) + 1;
  let missing = t.length;
  let left = 0;
  let start = 0;
  let minLen = Infinity;
  for (let right = 0; right < s.length; right += 1) {
    const ch = s[right];
    if (need[ch] > 0) missing -= 1;
    need[ch] = (need[ch] || 0) - 1;
    while (missing === 0) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        start = left;
      }
      const lch = s[left++];
      need[lch] = (need[lch] || 0) + 1;
      if (need[lch] > 0) missing += 1;
    }
  }
  return minLen === Infinity ? '' : s.slice(start, start + minLen);
}

// 问题18：实现反转链表
function solution_04206_18(head) {
  let prev = null;
  let cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}

// 问题19：实现链表环检测
function solution_04206_19(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// 问题20：实现二叉树层序遍历
function solution_04206_20(root) {
  if (!root) return [];
  const q = [root];
  const res = [];
  while (q.length) {
    const size = q.length;
    const level = [];
    for (let i = 0; i < size; i += 1) {
      const node = q.shift();
      level.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    res.push(level);
  }
  return res;
}
