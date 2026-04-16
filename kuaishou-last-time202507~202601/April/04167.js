/**
 * 04167.js — 前端代码算法题 20 道（贪心 / 区间 / 调度）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. eraseOverlapIntervals(intervals)：最少删除使区间不重叠。
function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let end = -Infinity;
  let keep = 0;
  for (const [s, e] of intervals) {
    if (s >= end) {
      keep += 1;
      end = e;
    }
  }
  return intervals.length - keep;
}

// 2. findMinArrowShots(points)：引爆气球最少箭。
function findMinArrowShots(points) {
  if (!points.length) return 0;
  points.sort((a, b) => a[1] - b[1]);
  let ans = 1;
  let end = points[0][1];
  for (let i = 1; i < points.length; i += 1) {
    if (points[i][0] > end) {
      ans += 1;
      end = points[i][1];
    }
  }
  return ans;
}

// 3. canJump(nums)：能否跳到最后。
function canJump(nums) {
  let reach = 0;
  for (let i = 0; i < nums.length; i += 1) {
    if (i > reach) return false;
    reach = Math.max(reach, i + nums[i]);
  }
  return true;
}

// 4. jump(nums)：跳到最后最少步数。
function jump(nums) {
  let steps = 0;
  let end = 0;
  let far = 0;
  for (let i = 0; i < nums.length - 1; i += 1) {
    far = Math.max(far, i + nums[i]);
    if (i === end) {
      steps += 1;
      end = far;
    }
  }
  return steps;
}

// 5. merge(intervals)：合并重叠区间。
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

// 6. insertInterval(intervals, newInterval)：插入新区间。
function insertInterval(intervals, newInterval) {
  const res = [];
  let i = 0;
  const n = intervals.length;
  while (i < n && intervals[i][1] < newInterval[0]) res.push(intervals[i++]);
  const cur = newInterval.slice();
  while (i < n && intervals[i][0] <= cur[1]) {
    cur[0] = Math.min(cur[0], intervals[i][0]);
    cur[1] = Math.max(cur[1], intervals[i][1]);
    i += 1;
  }
  res.push(cur);
  while (i < n) res.push(intervals[i++]);
  return res;
}

// 7. meetingRoomsII(intervals)：最少会议室数。
function meetingRoomsII(intervals) {
  const starts = intervals.map((x) => x[0]).sort((a, b) => a - b);
  const ends = intervals.map((x) => x[1]).sort((a, b) => a - b);
  let i = 0;
  let j = 0;
  let rooms = 0;
  let ans = 0;
  const n = intervals.length;
  while (i < n) {
    if (starts[i] < ends[j]) {
      rooms += 1;
      ans = Math.max(ans, rooms);
      i += 1;
    } else {
      rooms -= 1;
      j += 1;
    }
  }
  return ans;
}

// 8. partitionLabels(S)：划分尽可能多的段，每字母只出现在一段。
function partitionLabels(S) {
  const last = {};
  for (let i = 0; i < S.length; i += 1) last[S[i]] = i;
  const ans = [];
  let j = 0;
  let anchor = 0;
  for (let i = 0; i < S.length; i += 1) {
    j = Math.max(j, last[S[i]]);
    if (i === j) {
      ans.push(i - anchor + 1);
      anchor = i + 1;
    }
  }
  return ans;
}

// 9. reconstructQueue(people)：按 h,k 排队。
function reconstructQueue(people) {
  people.sort((a, b) => (b[0] - a[0]) || (a[1] - b[1]));
  const ans = [];
  for (const p of people) ans.splice(p[1], 0, p);
  return ans;
}

// 10. assignCookies(g, s)：最多满足多少孩子。
function assignCookies(g, s) {
  g.sort((a, b) => a - b);
  s.sort((a, b) => a - b);
  let i = 0;
  let j = 0;
  while (i < g.length && j < s.length) {
    if (s[j] >= g[i]) {
      i += 1;
      j += 1;
    } else j += 1;
  }
  return i;
}

// 11. maxProfitII(prices)：无限次买卖最大利润。
function maxProfitII(prices) {
  let ans = 0;
  for (let i = 1; i < prices.length; i += 1) {
    if (prices[i] > prices[i - 1]) ans += prices[i] - prices[i - 1];
  }
  return ans;
}

// 12. maxProfitWithFee(prices, fee)：含手续费。
function maxProfitWithFee(prices, fee) {
  let hold = -Infinity;
  let cash = 0;
  for (const p of prices) {
    hold = Math.max(hold, cash - p);
    cash = Math.max(cash, hold + p - fee);
  }
  return cash;
}

// 13. maxProfitCooldown(prices)：卖出后一天冷却。
function maxProfitCooldown(prices) {
  let hold = -Infinity;
  let cash = 0;
  let prev = 0;
  for (const p of prices) {
    const tmp = cash;
    cash = Math.max(cash, hold + p);
    hold = Math.max(hold, prev - p);
    prev = tmp;
  }
  return cash;
}

// 14. candy(ratings)：最少糖果数。
function candy(ratings) {
  const n = ratings.length;
  const c = Array(n).fill(1);
  for (let i = 1; i < n; i += 1) if (ratings[i] > ratings[i - 1]) c[i] = c[i - 1] + 1;
  for (let i = n - 2; i >= 0; i -= 1) if (ratings[i] > ratings[i + 1]) c[i] = Math.max(c[i], c[i + 1] + 1);
  return c.reduce((a, b) => a + b, 0);
}

// 15. removeDuplicateLetters(s)：最小字典序去重子序列。
function removeDuplicateLetters(s) {
  const last = {};
  for (let i = 0; i < s.length; i += 1) last[s[i]] = i;
  const st = [];
  const seen = new Set();
  for (let i = 0; i < s.length; i += 1) {
    const c = s[i];
    if (seen.has(c)) continue;
    while (st.length && c < st[st.length - 1] && last[st[st.length - 1]] > i) {
      seen.delete(st.pop());
    }
    st.push(c);
    seen.add(c);
  }
  return st.join('');
}

// 16. monotoneIncreasingDigits(N)：小于等于 N 的最大单调递增数。
function monotoneIncreasingDigits(N) {
  const s = String(N).split('').map(Number);
  let i = 1;
  while (i < s.length && s[i] >= s[i - 1]) i += 1;
  if (i < s.length) {
    while (i > 0 && s[i] < s[i - 1]) {
      s[i - 1] -= 1;
      i -= 1;
    }
    for (let j = i + 1; j < s.length; j += 1) s[j] = 9;
  }
  return +s.join('');
}

// 17. videoStitching(clips, T)：最小区间覆盖 [0,T]。
function videoStitching(clips, T) {
  clips.sort((a, b) => a[0] - b[0]);
  let ans = 0;
  let i = 0;
  let cur = 0;
  const n = clips.length;
  while (cur < T) {
    let far = cur;
    while (i < n && clips[i][0] <= cur) {
      far = Math.max(far, clips[i][1]);
      i += 1;
    }
    if (far === cur) return -1;
    ans += 1;
    cur = far;
  }
  return ans;
}

// 18. leastInterval(tasks, n)：任务调度最短时间。
function leastInterval(tasks, n) {
  const cnt = {};
  for (const t of tasks) cnt[t] = (cnt[t] || 0) + 1;
  const vals = Object.values(cnt);
  const max = Math.max(...vals);
  const numMax = vals.filter((v) => v === max).length;
  return Math.max(tasks.length, (max - 1) * (n + 1) + numMax);
}

// 19. advantageCount(A, B)：A 重排使对 B 的优势数最多。
function advantageCount(A, B) {
  const idx = B.map((_, i) => i);
  idx.sort((a, b) => B[a] - B[b]);
  A.sort((a, b) => a - b);
  const ans = Array(A.length);
  let lo = 0;
  let hi = A.length - 1;
  for (let k = B.length - 1; k >= 0; k -= 1) {
    const i = idx[k];
    if (A[hi] > B[i]) {
      ans[i] = A[hi];
      hi -= 1;
    } else {
      ans[i] = A[lo];
      lo += 1;
    }
  }
  return ans;
}

// 20. maxChunksToSorted(arr)：最多块数各自排序后整体有序。
function maxChunksToSorted(arr) {
  let ans = 0;
  let mx = 0;
  for (let i = 0; i < arr.length; i += 1) {
    mx = Math.max(mx, arr[i]);
    if (mx === i) ans += 1;
  }
  return ans;
}

module.exports = {
  eraseOverlapIntervals,
  findMinArrowShots,
  canJump,
  jump,
  merge,
  insertInterval,
  meetingRoomsII,
  partitionLabels,
  reconstructQueue,
  assignCookies,
  maxProfitII,
  maxProfitWithFee,
  maxProfitCooldown,
  candy,
  removeDuplicateLetters,
  monotoneIncreasingDigits,
  videoStitching,
  leastInterval,
  advantageCount,
  maxChunksToSorted,
};
