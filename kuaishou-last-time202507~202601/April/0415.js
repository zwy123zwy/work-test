/**
 * 0415.js — 前端代码算法题 20 道（滑动窗口 / 双指针 / 矩阵 / 贪心）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. characterReplacement(s, k)：至多换 k 次后最长全同子串。
function characterReplacement(s, k) {
  const cnt = new Map();
  let left = 0;
  let maxFreq = 0;
  let ans = 0;
  for (let right = 0; right < s.length; right += 1) {
    const c = s[right];
    cnt.set(c, (cnt.get(c) || 0) + 1);
    maxFreq = Math.max(maxFreq, cnt.get(c));
    while (right - left + 1 - maxFreq > k) {
      const lc = s[left];
      cnt.set(lc, cnt.get(lc) - 1);
      left += 1;
    }
    ans = Math.max(ans, right - left + 1);
  }
  return ans;
}

// 2. lengthOfLongestSubstringKDistinct(s, k)：至多 k 种字符的最长子串长度。
function lengthOfLongestSubstringKDistinct(s, k) {
  if (k === 0) return 0;
  const cnt = new Map();
  let left = 0;
  let ans = 0;
  for (let right = 0; right < s.length; right += 1) {
    const c = s[right];
    cnt.set(c, (cnt.get(c) || 0) + 1);
    while (cnt.size > k) {
      const lc = s[left];
      cnt.set(lc, cnt.get(lc) - 1);
      if (cnt.get(lc) === 0) cnt.delete(lc);
      left += 1;
    }
    ans = Math.max(ans, right - left + 1);
  }
  return ans;
}

// 3. fruitIntoBaskets(fruits)：至多两种水果，最长连续采摘长度。
function fruitIntoBaskets(fruits) {
  const cnt = new Map();
  let left = 0;
  let ans = 0;
  for (let right = 0; right < fruits.length; right += 1) {
    const t = fruits[right];
    cnt.set(t, (cnt.get(t) || 0) + 1);
    while (cnt.size > 2) {
      const lt = fruits[left];
      cnt.set(lt, cnt.get(lt) - 1);
      if (cnt.get(lt) === 0) cnt.delete(lt);
      left += 1;
    }
    ans = Math.max(ans, right - left + 1);
  }
  return ans;
}

// 4. maxConsecutiveOnesIII(nums, k)：至多把 k 个 0 翻成 1，最长连续 1。
function maxConsecutiveOnesIII(nums, k) {
  let left = 0;
  let zeros = 0;
  let ans = 0;
  for (let right = 0; right < nums.length; right += 1) {
    if (nums[right] === 0) zeros += 1;
    while (zeros > k) {
      if (nums[left] === 0) zeros -= 1;
      left += 1;
    }
    ans = Math.max(ans, right - left + 1);
  }
  return ans;
}

// 5. maxSlidingWindow(nums, k)：长度 k 的滑动窗口最大值（单调双端队列思路用数组模拟下标）。
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

// 6. minSubArrayLen(target, nums)：和 ≥ target 的最短连续子数组长度。
function minSubArrayLen(target, nums) {
  let sum = 0;
  let left = 0;
  let ans = Infinity;
  for (let right = 0; right < nums.length; right += 1) {
    sum += nums[right];
    while (sum >= target) {
      ans = Math.min(ans, right - left + 1);
      sum -= nums[left];
      left += 1;
    }
  }
  return ans === Infinity ? 0 : ans;
}

// 7. maxArea(height)：盛最多水的容器（双指针）。
function maxArea(height) {
  let l = 0;
  let r = height.length - 1;
  let ans = 0;
  while (l < r) {
    const h = Math.min(height[l], height[r]);
    ans = Math.max(ans, h * (r - l));
    if (height[l] < height[r]) l += 1;
    else r -= 1;
  }
  return ans;
}

// 8. threeSum(nums)：和为 0 的不重复三元组。
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i += 1) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1;
    let r = nums.length - 1;
    while (l < r) {
      const s = nums[i] + nums[l] + nums[r];
      if (s === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        l += 1;
        r -= 1;
        while (l < r && nums[l] === nums[l - 1]) l += 1;
        while (l < r && nums[r] === nums[r + 1]) r -= 1;
      } else if (s < 0) l += 1;
      else r -= 1;
    }
  }
  return res;
}

// 9. sortColors(nums)：原地三色排序 0,1,2（荷兰国旗）。
function sortColors(nums) {
  let p0 = 0;
  let p2 = nums.length - 1;
  let i = 0;
  while (i <= p2) {
    if (nums[i] === 0) {
      [nums[p0], nums[i]] = [nums[i], nums[p0]];
      p0 += 1;
      i += 1;
    } else if (nums[i] === 2) {
      [nums[p2], nums[i]] = [nums[i], nums[p2]];
      p2 -= 1;
    } else {
      i += 1;
    }
  }
  return nums;
}

// 10. trap(height)：接雨水（双指针）。
function trap(height) {
  let l = 0;
  let r = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let ans = 0;
  while (l < r) {
    if (height[l] < height[r]) {
      leftMax = Math.max(leftMax, height[l]);
      ans += leftMax - height[l];
      l += 1;
    } else {
      rightMax = Math.max(rightMax, height[r]);
      ans += rightMax - height[r];
      r -= 1;
    }
  }
  return ans;
}

// 11. nextPermutation(nums)：下一个字典序排列，原地。
function nextPermutation(nums) {
  let i = nums.length - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i -= 1;
  if (i >= 0) {
    let j = nums.length - 1;
    while (nums[j] <= nums[i]) j -= 1;
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  let l = i + 1;
  let r = nums.length - 1;
  while (l < r) {
    [nums[l], nums[r]] = [nums[r], nums[l]];
    l += 1;
    r -= 1;
  }
  return nums;
}

// 12. rotate(matrix)：n×n 图像顺时针 90°，原地。
function rotate(matrix) {
  const n = matrix.length;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  for (let i = 0; i < n; i += 1) matrix[i].reverse();
  return matrix;
}

// 13. spiralOrder(matrix)：顺时针螺旋遍历。
function spiralOrder(matrix) {
  if (!matrix.length) return [];
  const res = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;
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

// 14. setZeroes(matrix)：若某格为 0 则整行整列变 0，O(1) 额外空间。
function setZeroes(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  let row0 = false;
  let col0 = false;
  for (let j = 0; j < n; j += 1) {
    if (matrix[0][j] === 0) row0 = true;
  }
  for (let i = 0; i < m; i += 1) {
    if (matrix[i][0] === 0) col0 = true;
  }
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
  if (row0) {
    for (let j = 0; j < n; j += 1) matrix[0][j] = 0;
  }
  if (col0) {
    for (let i = 0; i < m; i += 1) matrix[i][0] = 0;
  }
  return matrix;
}

// 15. gameOfLife(board)：生命游戏，原地。
function gameOfLife(board) {
  const m = board.length;
  const n = board[0].length;
  const dirs = [-1, 0, 1];
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      let live = 0;
      for (const di of dirs) {
        for (const dj of dirs) {
          if (di === 0 && dj === 0) continue;
          const ni = i + di;
          const nj = j + dj;
          if (ni >= 0 && ni < m && nj >= 0 && nj < n && (board[ni][nj] & 1) === 1) {
            live += 1;
          }
        }
      }
      if (board[i][j] === 1 && (live === 2 || live === 3)) board[i][j] = 3;
      if (board[i][j] === 0 && live === 3) board[i][j] = 2;
    }
  }
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      board[i][j] >>= 1;
    }
  }
  return board;
}

// 16. canJump(nums)：能否跳到最后。
function canJump(nums) {
  let reach = 0;
  for (let i = 0; i < nums.length; i += 1) {
    if (i > reach) return false;
    reach = Math.max(reach, i + nums[i]);
  }
  return true;
}

// 17. jump(nums)：跳到最后的最少步数。
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

// 18. canCompleteCircuit(gas, cost)：能否绕环一周。
function canCompleteCircuit(gas, cost) {
  let total = 0;
  let tank = 0;
  let start = 0;
  for (let i = 0; i < gas.length; i += 1) {
    const g = gas[i] - cost[i];
    total += g;
    tank += g;
    if (tank < 0) {
      start = i + 1;
      tank = 0;
    }
  }
  return total >= 0 ? start : -1;
}

// 19. eraseOverlapIntervals(intervals)：最少删除多少个区间使其余不重叠。
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

// 20. findMinArrowShots(points)：引爆所有气球所需最少箭数。
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

module.exports = {
  characterReplacement,
  lengthOfLongestSubstringKDistinct,
  fruitIntoBaskets,
  maxConsecutiveOnesIII,
  maxSlidingWindow,
  minSubArrayLen,
  maxArea,
  threeSum,
  sortColors,
  trap,
  nextPermutation,
  rotate,
  spiralOrder,
  setZeroes,
  gameOfLife,
  canJump,
  jump,
  canCompleteCircuit,
  eraseOverlapIntervals,
  findMinArrowShots,
};
