/**
 * 0206 算法面试题（20 道）
 * 日期：2026-02-06
 */

// ==================== 1. 三数之和 ====================
// 给定数组 nums，找出所有和为 0 的三元组 [a,b,c]，且不重复。

function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let lo = i + 1, hi = nums.length - 1;
    while (lo < hi) {
      const sum = nums[i] + nums[lo] + nums[hi];
      if (sum === 0) {
        res.push([nums[i], nums[lo], nums[hi]]);
        while (lo < hi && nums[lo] === nums[lo + 1]) lo++;
        while (lo < hi && nums[hi] === nums[hi - 1]) hi--;
        lo++; hi--;
      } else if (sum < 0) lo++;
      else hi--;
    }
  }
  return res;
}
console.log(threeSum([-1, 0, 1, 2, -1, -4])); // [[-1,-1,2],[-1,0,1]]


// ==================== 2. 全排列 ====================
// 给定不含重复数字的数组，返回其所有可能的全排列。

function permute(nums) {
  const res = [];
  const path = [];
  const used = new Set();
  function dfs() {
    if (path.length === nums.length) {
      res.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used.has(i)) continue;
      used.add(i); path.push(nums[i]);
      dfs();
      used.delete(i); path.pop();
    }
  }
  dfs();
  return res;
}
console.log(permute([1, 2, 3]).length); // 6


// ==================== 3. 子集 ====================
// 给定不含重复元素的数组，返回所有可能子集（幂集）。

function subsets(nums) {
  const res = [];
  const path = [];
  function dfs(start) {
    res.push([...path]);
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);
      dfs(i + 1);
      path.pop();
    }
  }
  dfs(0);
  return res;
}
console.log(subsets([1, 2, 3]).length); // 8


// ==================== 4. 岛屿数量 ====================
// 二维网格 '1' 陆地 '0' 水，计算岛屿数量（上下左右相连为同一岛）。

function numIslands(grid) {
  if (!grid.length) return 0;
  const rows = grid.length, cols = grid[0].length;
  let count = 0;
  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') return;
    grid[r][c] = '0';
    dfs(r - 1, c); dfs(r + 1, c); dfs(r, c - 1); dfs(r, c + 1);
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') { count++; dfs(r, c); }
    }
  }
  return count;
}
console.log(numIslands([['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']])); // 3


// ==================== 5. 买卖股票最佳时机 I ====================
// 给定每日股价，最多完成一笔交易（买一次卖一次），求最大利润。

function maxProfit(prices) {
  let min = Infinity, profit = 0;
  for (const p of prices) {
    min = Math.min(min, p);
    profit = Math.max(profit, p - min);
  }
  return profit;
}
console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5


// ==================== 6. 最大子数组和（Kadane） ====================
// 给定整数数组，找和最大的连续子数组，返回其和。

function maxSubArray(nums) {
  let cur = nums[0], max = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    max = Math.max(max, cur);
  }
  return max;
}
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6


// ==================== 7. 合并区间 ====================
// 以 intervals[i] = [start, end] 表示区间，合并所有重叠区间。

function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const res = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = res[res.length - 1];
    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      res.push(intervals[i]);
    }
  }
  return res;
}
console.log(mergeIntervals([[1,3],[2,6],[8,10],[15,18]])); // [[1,6],[8,10],[15,18]]


// ==================== 8. 旋转数组 ====================
// 将数组向右旋转 k 步（原地，O(1) 空间）。

function rotate(nums, k) {
  k %= nums.length;
  const reverse = (l, r) => {
    while (l < r) { [nums[l], nums[r]] = [nums[r], nums[l]]; l++; r--; }
  };
  reverse(0, nums.length - 1);
  reverse(0, k - 1);
  reverse(k, nums.length - 1);
  return nums;
}


// ==================== 9. 删除链表倒数第 N 个节点 ====================
// 给定头节点与 n，删除倒数第 n 个节点，返回头节点。

function removeNthFromEnd(head, n) {
  const dummy = { next: head };
  let fast = dummy, slow = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next;
  while (fast) { fast = fast.next; slow = slow.next; }
  slow.next = slow.next.next;
  return dummy.next;
}


// ==================== 10. 字母异位词分组 ====================
// 给定字符串数组，将字母异位词分到同一组（可任意顺序）。

function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = [...s].sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return [...map.values()];
}
console.log(groupAnagrams(['eat','tea','tan','ate','nat','bat']));


// ==================== 11. 有效的数独 ====================
// 9x9 数独棋盘，判断是否有效（行/列/3x3 宫内 1-9 不重复，空格为 '.'）。

function isValidSudoku(board) {
  const rows = Array(9).fill(0).map(() => ({}));
  const cols = Array(9).fill(0).map(() => ({}));
  const boxes = Array(9).fill(0).map(() => ({}));
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const ch = board[r][c];
      if (ch === '.') continue;
      const bi = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      if (rows[r][ch] || cols[c][ch] || boxes[bi][ch]) return false;
      rows[r][ch] = cols[c][ch] = boxes[bi][ch] = true;
    }
  }
  return true;
}


// ==================== 12. 矩阵置零 ====================
// 若 matrix[i][j]===0，则将该行该列全部置 0。要求 O(1) 空间（用第一行/列做标记）。

function setZeroes(matrix) {
  const m = matrix.length, n = matrix[0].length;
  let col0 = false;
  for (let i = 0; i < m; i++) {
    if (matrix[i][0] === 0) col0 = true;
    for (let j = 1; j < n; j++) {
      if (matrix[i][j] === 0) matrix[i][0] = matrix[0][j] = 0;
    }
  }
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 1; j--) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) matrix[i][j] = 0;
    }
    if (col0) matrix[i][0] = 0;
  }
}


// ==================== 13. 旋转图像 ====================
// 将 n×n 矩阵顺时针旋转 90 度，原地。

function rotateMatrix(matrix) {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  for (let i = 0; i < n; i++) matrix[i].reverse();
  return matrix;
}


// ==================== 14. 字符串相乘 ====================
// 给定两个非负整数字符串 num1、num2，返回乘积的字符串（不能直接用 BigInt 或转数字）。

function multiply(num1, num2) {
  if (num1 === '0' || num2 === '0') return '0';
  const m = num1.length, n = num2.length;
  const arr = Array(m + n).fill(0);
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const mul = +num1[i] * +num2[j];
      const p1 = i + j, p2 = i + j + 1;
      const sum = mul + arr[p2];
      arr[p2] = sum % 10;
      arr[p1] += Math.floor(sum / 10);
    }
  }
  let i = 0;
  while (arr[i] === 0) i++;
  return arr.slice(i).join('');
}
console.log(multiply('123', '456')); // "56088"


// ==================== 15. 跳跃游戏 ====================
// 数组 nums[i] 表示从下标 i 最多可跳的步数，判断能否从下标 0 跳到最后一个下标。

function canJump(nums) {
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
    if (maxReach >= nums.length - 1) return true;
  }
  return true;
}
console.log(canJump([2, 3, 1, 1, 4])); // true


// ==================== 16. 螺旋矩阵 ====================
// 给定 m×n 矩阵，按螺旋顺序返回所有元素。

function spiralOrder(matrix) {
  if (!matrix.length) return [];
  const res = [];
  let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) res.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) res.push(matrix[r][right]);
    right--;
    if (top <= bottom) for (let c = right; c >= left; c--) res.push(matrix[bottom][c]);
    bottom--;
    if (left <= right) for (let r = bottom; r >= top; r--) res.push(matrix[r][left]);
    left++;
  }
  return res;
}
console.log(spiralOrder([[1,2,3],[4,5,6],[7,8,9]])); // [1,2,3,6,9,8,7,4,5]


// ==================== 17. 不同路径 ====================
// m×n 网格，从左上角到右下角，每次只能向右或向下，共有多少条不同路径？

function uniquePaths(m, n) {
  const dp = Array(m).fill(0).map(() => Array(n).fill(1));
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  return dp[m - 1][n - 1];
}
console.log(uniquePaths(3, 7)); // 28


// ==================== 18. 最小路径和 ====================
// 二维网格填满非负整数，从左上到右下，路径和为经过数字之和，求最小路径和。

function minPathSum(grid) {
  const m = grid.length, n = grid[0].length;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (i === 0 && j === 0) continue;
      if (i === 0) grid[i][j] += grid[i][j - 1];
      else if (j === 0) grid[i][j] += grid[i - 1][j];
      else grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);
    }
  }
  return grid[m - 1][n - 1];
}


// ==================== 19. 爬楼梯 ====================
// 每次可爬 1 或 2 阶，到第 n 阶有多少种不同方法？

function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}
console.log(climbStairs(4)); // 5


// ==================== 20. 罗马数字转整数 ====================
// 罗马数字 I,V,X,L,C,D,M 对应 1,5,10,50,100,500,1000；小数字在大数字前表示减法。将罗马数字转为整数。

function romanToInt(s) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let sum = 0;
  for (let i = 0; i < s.length; i++) {
    const v = map[s[i]];
    if (i < s.length - 1 && v < map[s[i + 1]]) sum -= v;
    else sum += v;
  }
  return sum;
}
console.log(romanToInt('MCMXCIV')); // 1994
