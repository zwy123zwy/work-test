/**
 * 04161.js — 前端代码算法题 20 道（堆 / 优先队列 / TopK）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. findKthLargest(nums, k)：第 k 大元素（快排划分思路）。
function findKthLargest(nums, k) {
  const target = nums.length - k;
  const swap = (a, b) => {
    [nums[a], nums[b]] = [nums[b], nums[a]];
  };
  const part = (lo, hi) => {
    const p = nums[hi];
    let i = lo;
    for (let j = lo; j < hi; j += 1) {
      if (nums[j] <= p) {
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
    const m = part(lo, hi);
    if (m === target) return nums[m];
    if (m < target) lo = m + 1;
    else hi = m - 1;
  }
}

// 2. topKFrequent(nums, k)：出现频率前 k 高的数（桶 / 小顶堆思路用数组模拟频次桶）。
function topKFrequent(nums, k) {
  const freq = new Map();
  for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1);
  const buckets = [];
  for (const [num, c] of freq) {
    if (!buckets[c]) buckets[c] = [];
    buckets[c].push(num);
  }
  const ans = [];
  for (let c = buckets.length - 1; c >= 0 && ans.length < k; c -= 1) {
    if (buckets[c]) ans.push(...buckets[c]);
  }
  return ans.slice(0, k);
}

// 3. kClosest(points, k)：离原点最近的 k 个点（按距离平方，快选）。
function kClosest(points, k) {
  const dist = (p) => p[0] * p[0] + p[1] * p[1];
  const swap = (a, b) => {
    [points[a], points[b]] = [points[b], points[a]];
  };
  const part = (lo, hi) => {
    const p = dist(points[hi]);
    let i = lo;
    for (let j = lo; j < hi; j += 1) {
      if (dist(points[j]) <= p) {
        swap(i, j);
        i += 1;
      }
    }
    swap(i, hi);
    return i;
  };
  let lo = 0;
  let hi = points.length - 1;
  const t = k - 1;
  while (true) {
    const m = part(lo, hi);
    if (m === t) return points.slice(0, k);
    if (m < t) lo = m + 1;
    else hi = m - 1;
  }
}

// 4. mergeKLists(lists)：k 个升序链表合并（分治）。
function mergeKLists(lists) {
  if (!lists.length) return null;
  const mergeTwo = (a, b) => {
    const dummy = { next: null };
    let t = dummy;
    while (a && b) {
      if (a.val <= b.val) {
        t.next = a;
        a = a.next;
      } else {
        t.next = b;
        b = b.next;
      }
      t = t.next;
    }
    t.next = a || b;
    return dummy.next;
  };
  const mergeRange = (l, r) => {
    if (l === r) return lists[l];
    const m = (l + r) >> 1;
    return mergeTwo(mergeRange(l, m), mergeRange(m + 1, r));
  };
  return mergeRange(0, lists.length - 1);
}

// 5. nthUglyNumber(n)：只含因子 2,3,5 的第 n 个丑数。
function nthUglyNumber(n) {
  const dp = [1];
  let i2 = 0;
  let i3 = 0;
  let i5 = 0;
  for (let i = 1; i < n; i += 1) {
    const next = Math.min(dp[i2] * 2, dp[i3] * 3, dp[i5] * 5);
    dp.push(next);
    if (next === dp[i2] * 2) i2 += 1;
    if (next === dp[i3] * 3) i3 += 1;
    if (next === dp[i5] * 5) i5 += 1;
  }
  return dp[n - 1];
}

// 6. lastStoneWeight(stones)：每次取最大两个相碰，返回最后重量。
function lastStoneWeight(stones) {
  const heap = [...stones];
  const siftDown = (i) => {
    const n = heap.length;
    while (true) {
      let m = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      if (l < n && heap[l] > heap[m]) m = l;
      if (r < n && heap[r] > heap[m]) m = r;
      if (m === i) break;
      [heap[i], heap[m]] = [heap[m], heap[i]];
      i = m;
    }
  };
  const siftUp = (i) => {
    while (i > 0) {
      const p = ((i - 1) / 2) | 0;
      if (heap[p] >= heap[i]) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  };
  const pop = () => {
    const top = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length) siftDown(0);
    return top;
  };
  const push = (x) => {
    heap.push(x);
    siftUp(heap.length - 1);
  };
  while (heap.length > 1) {
    const a = pop();
    const b = pop();
    if (a !== b) push(a - b);
  }
  return heap.length ? heap[0] : 0;
}

// 7. reorganizeString(s)：重排使相邻字符不同，不行返回 ""。
function reorganizeString(s) {
  const cnt = new Map();
  for (const c of s) cnt.set(c, (cnt.get(c) || 0) + 1);
  const maxHeap = [];
  for (const [c, n] of cnt) maxHeap.push({ c, n });
  maxHeap.sort((a, b) => b.n - a.n);
  if (maxHeap[0].n > ((s.length + 1) / 2) | 0) return '';
  const res = Array(s.length);
  let idx = 0;
  for (const { c, n } of maxHeap) {
    for (let k = 0; k < n; k += 1) {
      if (idx >= s.length) idx = 1;
      res[idx] = c;
      idx += 2;
    }
  }
  return res.join('');
}

// 8. furthestBuilding(heights, bricks, ladders)：最远建筑。
function furthestBuilding(heights, bricks, ladders) {
  const pq = [];
  const push = (x) => {
    pq.push(x);
    let i = pq.length - 1;
    while (i > 0) {
      const p = ((i - 1) / 2) | 0;
      if (pq[p] <= pq[i]) break;
      [pq[p], pq[i]] = [pq[i], pq[p]];
      i = p;
    }
  };
  const pop = () => {
    const top = pq[0];
    const last = pq.pop();
    if (!pq.length) return top;
    pq[0] = last;
    let i = 0;
    while (true) {
      let m = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      if (l < pq.length && pq[l] < pq[m]) m = l;
      if (r < pq.length && pq[r] < pq[m]) m = r;
      if (m === i) break;
      [pq[i], pq[m]] = [pq[m], pq[i]];
      i = m;
    }
    return top;
  };
  for (let i = 0; i < heights.length - 1; i += 1) {
    const diff = heights[i + 1] - heights[i];
    if (diff <= 0) continue;
    push(diff);
    if (pq.length > ladders) {
      bricks -= pop();
      if (bricks < 0) return i;
    }
  }
  return heights.length - 1;
}

// 9. kthSmallest(matrix, k)：有序矩阵中第 k 小（二分答案）。
function kthSmallest(matrix, k) {
  const n = matrix.length;
  let lo = matrix[0][0];
  let hi = matrix[n - 1][n - 1];
  const countLE = (mid) => {
    let c = 0;
    let j = n - 1;
    for (let i = 0; i < n; i += 1) {
      while (j >= 0 && matrix[i][j] > mid) j -= 1;
      c += j + 1;
    }
    return c;
  };
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (countLE(mid) < k) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// 10. swimInWater(grid)：最小时间游到右下角（Dijkstra）。
function swimInWater(grid) {
  const n = grid.length;
  const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));
  dist[0][0] = grid[0][0];
  const heap = [[grid[0][0], 0, 0]];
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const push = (t, i, j) => {
    heap.push([t, i, j]);
    let x = heap.length - 1;
    while (x > 0) {
      const p = ((x - 1) / 2) | 0;
      if (heap[p][0] <= heap[x][0]) break;
      [heap[p], heap[x]] = [heap[x], heap[p]];
      x = p;
    }
  };
  const pop = () => {
    const top = heap[0];
    const last = heap.pop();
    if (!heap.length) return top;
    heap[0] = last;
    let i = 0;
    while (true) {
      let m = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
      if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
      if (m === i) break;
      [heap[i], heap[m]] = [heap[m], heap[i]];
      i = m;
    }
    return top;
  };
  while (heap.length) {
    const [t, i, j] = pop();
    if (i === n - 1 && j === n - 1) return t;
    if (t > dist[i][j]) continue;
    for (const [di, dj] of dirs) {
      const ni = i + di;
      const nj = j + dj;
      if (ni < 0 || ni >= n || nj < 0 || nj >= n) continue;
      const nt = Math.max(t, grid[ni][nj]);
      if (nt < dist[ni][nj]) {
        dist[ni][nj] = nt;
        push(nt, ni, nj);
      }
    }
  }
  return dist[n - 1][n - 1];
}

// 11. findMaximizedCapital(k, w, profits, capital)：最多 k 个项目最大收益。
function findMaximizedCapital(k, w, profits, capital) {
  const n = profits.length;
  const idx = Array.from({ length: n }, (_, i) => i);
  idx.sort((a, b) => capital[a] - capital[b]);
  const maxH = [];
  const push = (x) => {
    maxH.push(x);
    let i = maxH.length - 1;
    while (i > 0) {
      const p = ((i - 1) / 2) | 0;
      if (maxH[p] >= maxH[i]) break;
      [maxH[p], maxH[i]] = [maxH[i], maxH[p]];
      i = p;
    }
  };
  const pop = () => {
    const top = maxH[0];
    const last = maxH.pop();
    if (!maxH.length) return top;
    maxH[0] = last;
    let i = 0;
    while (true) {
      let m = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      if (l < maxH.length && maxH[l] > maxH[m]) m = l;
      if (r < maxH.length && maxH[r] > maxH[m]) m = r;
      if (m === i) break;
      [maxH[i], maxH[m]] = [maxH[m], maxH[i]];
      i = m;
    }
    return top;
  };
  let j = 0;
  for (let round = 0; round < k; round += 1) {
    while (j < n && capital[idx[j]] <= w) {
      push(profits[idx[j]]);
      j += 1;
    }
    if (!maxH.length) break;
    w += pop();
  }
  return w;
}

// 12. frequencySort(s)：按字符出现次数降序输出字符串。
function frequencySort(s) {
  const cnt = new Map();
  for (const c of s) cnt.set(c, (cnt.get(c) || 0) + 1);
  return [...cnt.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([c, n]) => c.repeat(n))
    .join('');
}

// 13. connectSticks(sticks)：合并棍子最小代价。
function connectSticks(sticks) {
  const h = [...sticks];
  const heapify = () => {
    for (let i = ((h.length - 2) / 2) | 0; i >= 0; i -= 1) sift(i);
  };
  const sift = (i) => {
    while (true) {
      let m = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      if (l < h.length && h[l] < h[m]) m = l;
      if (r < h.length && h[r] < h[m]) m = r;
      if (m === i) break;
      [h[i], h[m]] = [h[m], h[i]];
      i = m;
    }
  };
  const pop = () => {
    const top = h[0];
    h[0] = h[h.length - 1];
    h.pop();
    sift(0);
    return top;
  };
  const push = (x) => {
    h.push(x);
    let i = h.length - 1;
    while (i > 0) {
      const p = ((i - 1) / 2) | 0;
      if (h[p] <= h[i]) break;
      [h[p], h[i]] = [h[i], h[p]];
      i = p;
    }
  };
  heapify();
  let cost = 0;
  while (h.length > 1) {
    const a = pop();
    const b = pop();
    const c = a + b;
    cost += c;
    push(c);
  }
  return cost;
}

// 14. smallestRange(nums)：k 个有序数组的最小范围覆盖每列至少一个数。
function smallestRange(nums) {
  const heap = [];
  let max = -Infinity;
  let range = Infinity;
  let ans = [0, 0];
  const push = (arrIdx, elIdx) => {
    const v = nums[arrIdx][elIdx];
    heap.push({ arrIdx, elIdx, v });
    let i = heap.length - 1;
    while (i > 0) {
      const p = ((i - 1) / 2) | 0;
      if (heap[p].v <= heap[i].v) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
    max = Math.max(max, v);
  };
  const pop = () => {
    const top = heap[0];
    const last = heap.pop();
    if (!heap.length) return top;
    heap[0] = last;
    let i = 0;
    while (true) {
      let m = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      if (l < heap.length && heap[l].v < heap[m].v) m = l;
      if (r < heap.length && heap[r].v < heap[m].v) m = r;
      if (m === i) break;
      [heap[i], heap[m]] = [heap[m], heap[i]];
      i = m;
    }
    return top;
  };
  for (let i = 0; i < nums.length; i += 1) push(i, 0);
  while (heap.length === nums.length) {
    const { arrIdx, elIdx, v } = pop();
    if (max - v < range) {
      range = max - v;
      ans = [v, max];
    }
    if (elIdx + 1 < nums[arrIdx].length) push(arrIdx, elIdx + 1);
    else break;
  }
  return ans;
}

// 15. getSkyline(buildings)：天际线（建筑覆盖 [L, R) 的离散关键点扫描）。
function getSkyline(buildings) {
  const xs = new Set();
  for (const [L, R] of buildings) {
    xs.add(L);
    xs.add(R);
  }
  const sorted = [...xs].sort((a, b) => a - b);
  const res = [];
  let prev = -1;
  for (const x of sorted) {
    let h = 0;
    for (const [L, R, hh] of buildings) {
      if (L <= x && x < R) h = Math.max(h, hh);
    }
    if (h !== prev) {
      res.push([x, h]);
      prev = h;
    }
  }
  return res;
}

// 16. MedianFinder：数据流中位数（small 为存负数的 min-heap 表示较大半，large 为 min-heap 表示较小半）。
class MedianFinder {
  constructor() {
    this.small = [];
    this.large = [];
  }
  addNum(num) {
    this._pushSmall(-num);
    this._pushLarge(-this._popSmall());
    if (this.large.length > this.small.length) {
      this._pushSmall(-this._popLarge());
    }
  }
  findMedian() {
    if (this.small.length > this.large.length) return -this.small[0];
    return (-this.small[0] + this.large[0]) / 2;
  }
  _pushLarge(x) {
    this.large.push(x);
    let i = this.large.length - 1;
    while (i > 0) {
      const p = ((i - 1) / 2) | 0;
      if (this.large[p] <= this.large[i]) break;
      [this.large[p], this.large[i]] = [this.large[i], this.large[p]];
      i = p;
    }
  }
  _popLarge() {
    const top = this.large[0];
    this.large[0] = this.large[this.large.length - 1];
    this.large.pop();
    let i = 0;
    while (true) {
      let m = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      if (l < this.large.length && this.large[l] < this.large[m]) m = l;
      if (r < this.large.length && this.large[r] < this.large[m]) m = r;
      if (m === i) break;
      [this.large[i], this.large[m]] = [this.large[m], this.large[i]];
      i = m;
    }
    return top;
  }
  _pushSmall(x) {
    this.small.push(x);
    let i = this.small.length - 1;
    while (i > 0) {
      const p = ((i - 1) / 2) | 0;
      if (this.small[p] <= this.small[i]) break;
      [this.small[p], this.small[i]] = [this.small[i], this.small[p]];
      i = p;
    }
  }
  _popSmall() {
    const top = this.small[0];
    this.small[0] = this.small[this.small.length - 1];
    this.small.pop();
    let i = 0;
    while (true) {
      let m = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      if (l < this.small.length && this.small[l] < this.small[m]) m = l;
      if (r < this.small.length && this.small[r] < this.small[m]) m = r;
      if (m === i) break;
      [this.small[i], this.small[m]] = [this.small[m], this.small[i]];
      i = m;
    }
    return top;
  }
}

// 17. kSmallestPairs(nums1, nums2, k)：和最小的 k 对。
function kSmallestPairs(nums1, nums2, k) {
  if (!nums1.length || !nums2.length || k === 0) return [];
  const heap = [];
  const push = (i, j) => {
    const sum = nums1[i] + nums2[j];
    heap.push({ i, j, sum });
    let x = heap.length - 1;
    while (x > 0) {
      const p = ((x - 1) / 2) | 0;
      if (heap[p].sum <= heap[x].sum) break;
      [heap[p], heap[x]] = [heap[x], heap[p]];
      x = p;
    }
  };
  const pop = () => {
    const top = heap[0];
    const last = heap.pop();
    if (!heap.length) return top;
    heap[0] = last;
    let i = 0;
    while (true) {
      let m = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      if (l < heap.length && heap[l].sum < heap[m].sum) m = l;
      if (r < heap.length && heap[r].sum < heap[m].sum) m = r;
      if (m === i) break;
      [heap[i], heap[m]] = [heap[m], heap[i]];
      i = m;
    }
    return top;
  };
  push(0, 0);
  const ans = [];
  while (heap.length && ans.length < k) {
    const { i, j } = pop();
    ans.push([nums1[i], nums2[j]]);
    if (j + 1 < nums2.length) push(i, j + 1);
    if (j === 0 && i + 1 < nums1.length) push(i + 1, 0);
  }
  return ans;
}

// 18. assignTasks(servers, tasks)：最少下标且空闲服务器分配任务。
function assignTasks(servers, tasks) {
  const free = [];
  const busy = [];
  const pushFree = (w, i) => {
    free.push([w, i]);
    let x = free.length - 1;
    while (x > 0) {
      const p = ((x - 1) / 2) | 0;
      if (free[p][0] < free[x][0] || (free[p][0] === free[x][0] && free[p][1] <= free[x][1])) break;
      [free[p], free[x]] = [free[x], free[p]];
      x = p;
    }
  };
  const popFree = () => {
    const top = free[0];
    const last = free.pop();
    if (!free.length) return top;
    free[0] = last;
    let i = 0;
    while (true) {
      let m = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      if (l < free.length && (free[l][0] < free[m][0] || (free[l][0] === free[m][0] && free[l][1] < free[m][1])))
        m = l;
      if (r < free.length && (free[r][0] < free[m][0] || (free[r][0] === free[m][0] && free[r][1] < free[m][1])))
        m = r;
      if (m === i) break;
      [free[i], free[m]] = [free[m], free[i]];
      i = m;
    }
    return top;
  };
  const pushBusy = (t, w, i) => {
    busy.push([t, w, i]);
    let x = busy.length - 1;
    while (x > 0) {
      const p = ((x - 1) / 2) | 0;
      if (busy[p][0] <= busy[x][0]) break;
      [busy[p], busy[x]] = [busy[x], busy[p]];
      x = p;
    }
  };
  const popBusy = () => {
    const top = busy[0];
    const last = busy.pop();
    if (!busy.length) return top;
    busy[0] = last;
    let i = 0;
    while (true) {
      let m = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      if (l < busy.length && busy[l][0] < busy[m][0]) m = l;
      if (r < busy.length && busy[r][0] < busy[m][0]) m = r;
      if (m === i) break;
      [busy[i], busy[m]] = [busy[m], busy[i]];
      i = m;
    }
    return top;
  };
  servers.forEach((w, i) => pushFree(w, i));
  const ans = [];
  for (let t = 0; t < tasks.length; t += 1) {
    while (busy.length && busy[0][0] <= t) {
      const [, w, i] = popBusy();
      pushFree(w, i);
    }
    const [w, i] = popFree();
    ans.push(i);
    pushBusy(t + tasks[t], w, i);
  }
  return ans;
}

// 19. minimumEffortPath(heights)：最小体力消耗路径。
function minimumEffortPath(heights) {
  const m = heights.length;
  const n = heights[0].length;
  const dist = Array.from({ length: m }, () => Array(n).fill(Infinity));
  dist[0][0] = 0;
  const heap = [[0, 0, 0]];
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const push = (e, i, j) => {
    heap.push([e, i, j]);
    let x = heap.length - 1;
    while (x > 0) {
      const p = ((x - 1) / 2) | 0;
      if (heap[p][0] <= heap[x][0]) break;
      [heap[p], heap[x]] = [heap[x], heap[p]];
      x = p;
    }
  };
  const pop = () => {
    const top = heap[0];
    const last = heap.pop();
    if (!heap.length) return top;
    heap[0] = last;
    let i = 0;
    while (true) {
      let m = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
      if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
      if (m === i) break;
      [heap[i], heap[m]] = [heap[m], heap[i]];
      i = m;
    }
    return top;
  };
  while (heap.length) {
    const [e, i, j] = pop();
    if (e > dist[i][j]) continue;
    if (i === m - 1 && j === n - 1) return e;
    for (const [di, dj] of dirs) {
      const ni = i + di;
      const nj = j + dj;
      if (ni < 0 || ni >= m || nj < 0 || nj >= n) continue;
      const ne = Math.max(e, Math.abs(heights[ni][nj] - heights[i][j]));
      if (ne < dist[ni][nj]) {
        dist[ni][nj] = ne;
        push(ne, ni, nj);
      }
    }
  }
  return dist[m - 1][n - 1];
}

// 20. maxEvents(events)：最多参加的活动数（end 排序 + 小顶堆）。
function maxEvents(events) {
  events.sort((a, b) => a[0] - b[0]);
  const heap = [];
  let i = 0;
  const n = events.length;
  let day = 1;
  let ans = 0;
  const push = (x) => {
    heap.push(x);
    let j = heap.length - 1;
    while (j > 0) {
      const p = ((j - 1) / 2) | 0;
      if (heap[p] <= heap[j]) break;
      [heap[p], heap[j]] = [heap[j], heap[p]];
      j = p;
    }
  };
  const pop = () => {
    const top = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    let j = 0;
    while (true) {
      let m = j;
      const l = j * 2 + 1;
      const r = j * 2 + 2;
      if (l < heap.length && heap[l] < heap[m]) m = l;
      if (r < heap.length && heap[r] < heap[m]) m = r;
      if (m === j) break;
      [heap[j], heap[m]] = [heap[m], heap[j]];
      j = m;
    }
    return top;
  };
  const lastDay = Math.max(...events.map((e) => e[1]));
  for (day = 1; day <= lastDay; day += 1) {
    while (i < n && events[i][0] <= day) {
      push(events[i][1]);
      i += 1;
    }
    while (heap.length && heap[0] < day) pop();
    if (heap.length) {
      pop();
      ans += 1;
    }
  }
  return ans;
}

module.exports = {
  findKthLargest,
  topKFrequent,
  kClosest,
  mergeKLists,
  nthUglyNumber,
  lastStoneWeight,
  reorganizeString,
  furthestBuilding,
  kthSmallest,
  swimInWater,
  findMaximizedCapital,
  frequencySort,
  connectSticks,
  smallestRange,
  getSkyline,
  MedianFinder,
  kSmallestPairs,
  assignTasks,
  minimumEffortPath,
  maxEvents,
};
