/**
 * 04142.js — 前端代码算法题 20 道（字符串 / 哈希 / 堆 / 二分）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. groupAnagrams(strs)：字母异位词分组。
function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return [...map.values()];
}

// 2. isValid(s)：有效括号。
function isValid(s) {
  const map = new Map([
    [')', '('],
    [']', '['],
    ['}', '{'],
  ]);
  const st = [];
  for (const ch of s) {
    if (map.has(ch)) {
      if (st.pop() !== map.get(ch)) return false;
    } else {
      st.push(ch);
    }
  }
  return st.length === 0;
}

// 3. simplifyPath(path)：Unix 路径简化。
function simplifyPath(path) {
  const parts = path.split('/');
  const st = [];
  for (const p of parts) {
    if (!p || p === '.') continue;
    if (p === '..') st.pop();
    else st.push(p);
  }
  return `/${st.join('/')}`;
}

// 4. evalRPN(tokens)：逆波兰表达式求值。
function evalRPN(tokens) {
  const st = [];
  for (const t of tokens) {
    if (t === '+' || t === '-' || t === '*' || t === '/') {
      const b = st.pop();
      const a = st.pop();
      if (t === '+') st.push(a + b);
      if (t === '-') st.push(a - b);
      if (t === '*') st.push(a * b);
      if (t === '/') st.push((a / b) | 0);
    } else {
      st.push(Number(t));
    }
  }
  return st[0];
}

// 5. largestRectangleArea(heights)：柱状图最大矩形面积。
function largestRectangleArea(heights) {
  const arr = [0, ...heights, 0];
  const st = [];
  let ans = 0;
  for (let i = 0; i < arr.length; i += 1) {
    while (st.length && arr[i] < arr[st[st.length - 1]]) {
      const h = arr[st.pop()];
      const w = i - st[st.length - 1] - 1;
      ans = Math.max(ans, h * w);
    }
    st.push(i);
  }
  return ans;
}

// 6. kthLargest(nums, k)：数组第 k 大元素。
function kthLargest(nums, k) {
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}

// 7. searchMatrix(matrix, target)：每行有序且行首大于上一行行尾的矩阵查找。
function searchMatrix(matrix, target) {
  const m = matrix.length;
  const n = matrix[0].length;
  let lo = 0;
  let hi = m * n - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const v = matrix[(mid / n) | 0][mid % n];
    if (v === target) return true;
    if (v < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}

// 8. searchInsert(nums, target)：有序数组插入位置。
function searchInsert(nums, target) {
  let lo = 0;
  let hi = nums.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// 9. findPeakElement(nums)：寻找峰值元素下标。
function findPeakElement(nums) {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[mid + 1]) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// 10. minEatingSpeed(piles, h)：Koko 吃香蕉最小速度。
function minEatingSpeed(piles, h) {
  let lo = 1;
  let hi = Math.max(...piles);
  const hours = (k) => piles.reduce((sum, p) => sum + Math.ceil(p / k), 0);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (hours(mid) <= h) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

// 11. findKthPositive(arr, k)：第 k 个缺失的正整数。
function findKthPositive(arr, k) {
  let cur = 1;
  let i = 0;
  while (k > 0) {
    if (i < arr.length && arr[i] === cur) i += 1;
    else k -= 1;
    if (k === 0) return cur;
    cur += 1;
  }
  return cur;
}

// 12. frequencySort(s)：按字符出现频率降序排列。
function frequencySort(s) {
  const map = new Map();
  for (const ch of s) map.set(ch, (map.get(ch) || 0) + 1);
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([ch, cnt]) => ch.repeat(cnt))
    .join('');
}

// 13. longestConsecutive(nums)：最长连续序列长度。
function longestConsecutive(nums) {
  const set = new Set(nums);
  let ans = 0;
  for (const x of set) {
    if (set.has(x - 1)) continue;
    let y = x;
    while (set.has(y + 1)) y += 1;
    ans = Math.max(ans, y - x + 1);
  }
  return ans;
}

// 14. firstUniqChar(s)：首个不重复字符下标。
function firstUniqChar(s) {
  const cnt = new Map();
  for (const ch of s) cnt.set(ch, (cnt.get(ch) || 0) + 1);
  for (let i = 0; i < s.length; i += 1) {
    if (cnt.get(s[i]) === 1) return i;
  }
  return -1;
}

// 15. checkInclusion(s1, s2)：s2 是否包含 s1 的排列。
function checkInclusion(s1, s2) {
  if (s1.length > s2.length) return false;
  const need = Array(26).fill(0);
  const win = Array(26).fill(0);
  const base = 'a'.charCodeAt(0);
  for (const ch of s1) need[ch.charCodeAt(0) - base] += 1;
  for (let i = 0; i < s2.length; i += 1) {
    win[s2.charCodeAt(i) - base] += 1;
    if (i >= s1.length) win[s2.charCodeAt(i - s1.length) - base] -= 1;
    if (need.every((v, idx) => v === win[idx])) return true;
  }
  return false;
}

// 16. partitionLabels(s)：划分尽可能多片段，每个字母只出现在一个片段。
function partitionLabels(s) {
  const last = {};
  for (let i = 0; i < s.length; i += 1) last[s[i]] = i;
  const ans = [];
  let start = 0;
  let end = 0;
  for (let i = 0; i < s.length; i += 1) {
    end = Math.max(end, last[s[i]]);
    if (i === end) {
      ans.push(end - start + 1);
      start = i + 1;
    }
  }
  return ans;
}

// 17. carFleet(target, position, speed)：车队数量。
function carFleet(target, position, speed) {
  const cars = position.map((p, i) => [p, (target - p) / speed[i]]);
  cars.sort((a, b) => a[0] - b[0]);
  let fleets = 0;
  let cur = 0;
  for (let i = cars.length - 1; i >= 0; i -= 1) {
    const t = cars[i][1];
    if (t > cur) {
      fleets += 1;
      cur = t;
    }
  }
  return fleets;
}

// 18. minMeetingRooms(intervals)：最少会议室数。
function minMeetingRooms(intervals) {
  if (!intervals.length) return 0;
  const starts = intervals.map((x) => x[0]).sort((a, b) => a - b);
  const ends = intervals.map((x) => x[1]).sort((a, b) => a - b);
  let used = 0;
  let j = 0;
  for (let i = 0; i < starts.length; i += 1) {
    if (starts[i] < ends[j]) used += 1;
    else j += 1;
  }
  return used;
}

// 19. intervalIntersection(firstList, secondList)：区间交集。
function intervalIntersection(firstList, secondList) {
  const res = [];
  let i = 0;
  let j = 0;
  while (i < firstList.length && j < secondList.length) {
    const lo = Math.max(firstList[i][0], secondList[j][0]);
    const hi = Math.min(firstList[i][1], secondList[j][1]);
    if (lo <= hi) res.push([lo, hi]);
    if (firstList[i][1] < secondList[j][1]) i += 1;
    else j += 1;
  }
  return res;
}

// 20. trapRainWater(heightMap)：二维接雨水。
// 答：边界入最小堆，逐层向内扩展，低洼处补水。
function trapRainWater(heightMap) {
  const m = heightMap.length;
  const n = heightMap[0].length;
  if (m <= 2 || n <= 2) return 0;

  const seen = Array.from({ length: m }, () => Array(n).fill(false));
  const heap = [];
  const push = (item) => {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p][0] <= heap[i][0]) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  };
  const pop = () => {
    if (heap.length === 1) return heap.pop();
    const top = heap[0];
    heap[0] = heap.pop();
    let i = 0;
    while (true) {
      let smallest = i;
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      if (l < heap.length && heap[l][0] < heap[smallest][0]) smallest = l;
      if (r < heap.length && heap[r][0] < heap[smallest][0]) smallest = r;
      if (smallest === i) break;
      [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
      i = smallest;
    }
    return top;
  };

  for (let i = 0; i < m; i += 1) {
    push([heightMap[i][0], i, 0]);
    push([heightMap[i][n - 1], i, n - 1]);
    seen[i][0] = true;
    seen[i][n - 1] = true;
  }
  for (let j = 1; j < n - 1; j += 1) {
    push([heightMap[0][j], 0, j]);
    push([heightMap[m - 1][j], m - 1, j]);
    seen[0][j] = true;
    seen[m - 1][j] = true;
  }

  let water = 0;
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  while (heap.length) {
    const [h, x, y] = pop();
    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= m || ny < 0 || ny >= n || seen[nx][ny]) continue;
      seen[nx][ny] = true;
      const nh = heightMap[nx][ny];
      if (nh < h) water += h - nh;
      push([Math.max(h, nh), nx, ny]);
    }
  }
  return water;
}

module.exports = {
  groupAnagrams,
  isValid,
  simplifyPath,
  evalRPN,
  largestRectangleArea,
  kthLargest,
  searchMatrix,
  searchInsert,
  findPeakElement,
  minEatingSpeed,
  findKthPositive,
  frequencySort,
  longestConsecutive,
  firstUniqChar,
  checkInclusion,
  partitionLabels,
  carFleet,
  minMeetingRooms,
  intervalIntersection,
  trapRainWater,
};
