/**
 * 04141.js — 前端代码算法题 20 道（二叉树 / 回溯 / 基础图搜索）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. inorderTraversal(root)：二叉树中序遍历（左-根-右）。
function inorderTraversal(root) {
  const res = [];
  const dfs = (node) => {
    if (!node) return;
    dfs(node.left);
    res.push(node.val);
    dfs(node.right);
  };
  dfs(root);
  return res;
}

// 2. levelOrder(root)：二叉树层序遍历。
function levelOrder(root) {
  if (!root) return [];
  const res = [];
  const q = [root];
  while (q.length) {
    const size = q.length;
    const layer = [];
    for (let i = 0; i < size; i += 1) {
      const node = q.shift();
      layer.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    res.push(layer);
  }
  return res;
}

// 3. maxDepth(root)：二叉树最大深度。
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// 4. isSymmetric(root)：是否镜像对称。
function isSymmetric(root) {
  const check = (a, b) => {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.val === b.val && check(a.left, b.right) && check(a.right, b.left);
  };
  return check(root, root);
}

// 5. pathSum(root, targetSum)：根到叶子路径和等于目标值。
function pathSum(root, targetSum) {
  const res = [];
  const path = [];
  const dfs = (node, sum) => {
    if (!node) return;
    path.push(node.val);
    const nextSum = sum + node.val;
    if (!node.left && !node.right && nextSum === targetSum) {
      res.push([...path]);
    }
    dfs(node.left, nextSum);
    dfs(node.right, nextSum);
    path.pop();
  };
  dfs(root, 0);
  return res;
}

// 6. permute(nums)：全排列。
function permute(nums) {
  const res = [];
  const used = Array(nums.length).fill(false);
  const path = [];
  const dfs = () => {
    if (path.length === nums.length) {
      res.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i += 1) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      dfs();
      path.pop();
      used[i] = false;
    }
  };
  dfs();
  return res;
}

// 7. subsets(nums)：求幂集。
function subsets(nums) {
  const res = [];
  const path = [];
  const dfs = (idx) => {
    if (idx === nums.length) {
      res.push([...path]);
      return;
    }
    dfs(idx + 1);
    path.push(nums[idx]);
    dfs(idx + 1);
    path.pop();
  };
  dfs(0);
  return res;
}

// 8. combinationSum(candidates, target)：可重复选取数字使和为 target。
function combinationSum(candidates, target) {
  const res = [];
  const path = [];
  const dfs = (start, remain) => {
    if (remain === 0) {
      res.push([...path]);
      return;
    }
    if (remain < 0) return;
    for (let i = start; i < candidates.length; i += 1) {
      path.push(candidates[i]);
      dfs(i, remain - candidates[i]);
      path.pop();
    }
  };
  dfs(0, target);
  return res;
}

// 9. exist(board, word)：矩阵中是否存在单词路径。
function exist(board, word) {
  const m = board.length;
  const n = board[0].length;
  const dfs = (i, j, k) => {
    if (k === word.length) return true;
    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== word[k]) return false;
    const ch = board[i][j];
    board[i][j] = '#';
    const ok =
      dfs(i + 1, j, k + 1) ||
      dfs(i - 1, j, k + 1) ||
      dfs(i, j + 1, k + 1) ||
      dfs(i, j - 1, k + 1);
    board[i][j] = ch;
    return ok;
  };
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (dfs(i, j, 0)) return true;
    }
  }
  return false;
}

// 10. numSquares(n)：最少完全平方数数量。
function numSquares(n) {
  const dp = Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= n; i += 1) {
    for (let j = 1; j * j <= i; j += 1) {
      dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
    }
  }
  return dp[n];
}

// 11. minPathSum(grid)：网格最小路径和（只能右/下）。
function minPathSum(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const dp = Array.from({ length: m }, () => Array(n).fill(0));
  dp[0][0] = grid[0][0];
  for (let i = 1; i < m; i += 1) dp[i][0] = dp[i - 1][0] + grid[i][0];
  for (let j = 1; j < n; j += 1) dp[0][j] = dp[0][j - 1] + grid[0][j];
  for (let i = 1; i < m; i += 1) {
    for (let j = 1; j < n; j += 1) {
      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
    }
  }
  return dp[m - 1][n - 1];
}

// 12. uniquePaths(m, n)：m*n 网格从左上到右下路径数。
function uniquePaths(m, n) {
  const dp = Array(n).fill(1);
  for (let i = 1; i < m; i += 1) {
    for (let j = 1; j < n; j += 1) {
      dp[j] += dp[j - 1];
    }
  }
  return dp[n - 1];
}

// 13. floodFill(image, sr, sc, color)：图像渲染。
function floodFill(image, sr, sc, color) {
  const old = image[sr][sc];
  if (old === color) return image;
  const m = image.length;
  const n = image[0].length;
  const dfs = (i, j) => {
    if (i < 0 || i >= m || j < 0 || j >= n || image[i][j] !== old) return;
    image[i][j] = color;
    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  };
  dfs(sr, sc);
  return image;
}

// 14. orangesRotting(grid)：腐烂橘子最少分钟数。
function orangesRotting(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const q = [];
  let fresh = 0;
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (grid[i][j] === 2) q.push([i, j]);
      if (grid[i][j] === 1) fresh += 1;
    }
  }
  let mins = 0;
  while (q.length && fresh > 0) {
    const size = q.length;
    for (let k = 0; k < size; k += 1) {
      const [x, y] = q.shift();
      const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= m || ny < 0 || ny >= n || grid[nx][ny] !== 1) continue;
        grid[nx][ny] = 2;
        fresh -= 1;
        q.push([nx, ny]);
      }
    }
    mins += 1;
  }
  return fresh === 0 ? mins : -1;
}

// 15. canPartition(nums)：是否能分成和相等的两个子集。
function canPartition(nums) {
  const sum = nums.reduce((a, b) => a + b, 0);
  if (sum % 2) return false;
  const target = sum / 2;
  const dp = Array(target + 1).fill(false);
  dp[0] = true;
  for (const x of nums) {
    for (let j = target; j >= x; j -= 1) {
      dp[j] = dp[j] || dp[j - x];
    }
  }
  return dp[target];
}

// 16. dailyTemperatures(temperatures)：下一个更高温度等待天数。
function dailyTemperatures(temperatures) {
  const st = [];
  const ans = Array(temperatures.length).fill(0);
  for (let i = 0; i < temperatures.length; i += 1) {
    while (st.length && temperatures[i] > temperatures[st[st.length - 1]]) {
      const idx = st.pop();
      ans[idx] = i - idx;
    }
    st.push(i);
  }
  return ans;
}

// 17. topKFrequent(nums, k)：出现频率前 k 高元素。
function topKFrequent(nums, k) {
  const map = new Map();
  for (const x of nums) map.set(x, (map.get(x) || 0) + 1);
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map((item) => item[0]);
}

// 18. merge(intervals)：合并重叠区间。
function merge(intervals) {
  if (intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);
  const res = [intervals[0]];
  for (let i = 1; i < intervals.length; i += 1) {
    const cur = intervals[i];
    const last = res[res.length - 1];
    if (cur[0] <= last[1]) last[1] = Math.max(last[1], cur[1]);
    else res.push(cur);
  }
  return res;
}

// 19. eraseOverlapIntervals(intervals)：最少移除区间数使剩余互不重叠。
function eraseOverlapIntervals(intervals) {
  if (!intervals.length) return 0;
  intervals.sort((a, b) => a[1] - b[1]);
  let cnt = 1;
  let end = intervals[0][1];
  for (let i = 1; i < intervals.length; i += 1) {
    if (intervals[i][0] >= end) {
      cnt += 1;
      end = intervals[i][1];
    }
  }
  return intervals.length - cnt;
}

// 20. climbStairs(n)：每次爬 1 或 2 级台阶方案数。
function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1;
  let b = 2;
  for (let i = 3; i <= n; i += 1) {
    const c = a + b;
    a = b;
    b = c;
  }
  return b;
}

module.exports = {
  inorderTraversal,
  levelOrder,
  maxDepth,
  isSymmetric,
  pathSum,
  permute,
  subsets,
  combinationSum,
  exist,
  numSquares,
  minPathSum,
  uniquePaths,
  floodFill,
  orangesRotting,
  canPartition,
  dailyTemperatures,
  topKFrequent,
  merge,
  eraseOverlapIntervals,
  climbStairs,
};
