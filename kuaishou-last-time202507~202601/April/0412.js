/**
 * 0412.js — 前端代码算法题 20 道（回溯 / 网格与树形 DP / 贪心 / 计数 DP）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. subsets(nums)：所有子集（无重复元素）。
// 答：回溯或位掩码；此处回溯。
function subsets(nums) {
  const res = [];
  const path = [];
  const dfs = (start) => {
    res.push(path.slice());
    for (let i = start; i < nums.length; i += 1) {
      path.push(nums[i]);
      dfs(i + 1);
      path.pop();
    }
  };
  dfs(0);
  return res;
}

// 2. permute(nums)：全排列（无重复）。
// 答：回溯 + visited。
function permute(nums) {
  const res = [];
  const path = [];
  const used = Array(nums.length).fill(false);
  const dfs = () => {
    if (path.length === nums.length) {
      res.push(path.slice());
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

// 3. combinationSum(candidates, target)：和为 target 的组合，数字可无限次用。
// 答：回溯，排序后从 index 开始避免重复集合顺序。
function combinationSum(candidates, target) {
  candidates.sort((a, b) => a - b);
  const res = [];
  const path = [];
  const dfs = (start, sum) => {
    if (sum === target) {
      res.push(path.slice());
      return;
    }
    if (sum > target) return;
    for (let i = start; i < candidates.length; i += 1) {
      path.push(candidates[i]);
      dfs(i, sum + candidates[i]);
      path.pop();
    }
  };
  dfs(0, 0);
  return res;
}

// 4. combinationSum2(candidates, target)：每个数字只能用一次，组合不重复。
// 答：排序，同层相同值跳过。
function combinationSum2(candidates, target) {
  candidates.sort((a, b) => a - b);
  const res = [];
  const path = [];
  const dfs = (start, sum) => {
    if (sum === target) {
      res.push(path.slice());
      return;
    }
    if (sum > target) return;
    for (let i = start; i < candidates.length; i += 1) {
      if (i > start && candidates[i] === candidates[i - 1]) continue;
      path.push(candidates[i]);
      dfs(i + 1, sum + candidates[i]);
      path.pop();
    }
  };
  dfs(0, 0);
  return res;
}

// 5. generateParentheses(n)：生成 n 对合法括号所有字符串。
// 答：回溯，左括号 < n，右括号 < 左括号数。
function generateParentheses(n) {
  const res = [];
  const dfs = (s, open, close) => {
    if (s.length === 2 * n) {
      res.push(s);
      return;
    }
    if (open < n) dfs(`${s}(`, open + 1, close);
    if (close < open) dfs(`${s})`, open, close + 1);
  };
  dfs('', 0, 0);
  return res;
}

// 6. letterCombinations(digits)：手机九宫格字母组合。
// 答：回溯或迭代队列。
function letterCombinations(digits) {
  if (!digits) return [];
  const map = ['', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz'];
  const res = [];
  const path = [];
  const dfs = (idx) => {
    if (idx === digits.length) {
      res.push(path.join(''));
      return;
    }
    const letters = map[Number(digits[idx])];
    for (const ch of letters) {
      path.push(ch);
      dfs(idx + 1);
      path.pop();
    }
  };
  dfs(0);
  return res;
}

// 7. numTrees(n)：1..n 互异值能组成多少棵不同 BST。
// 答：卡特兰 dp[i] = sum(dp[j-1]*dp[i-j])。
function numTrees(n) {
  const dp = Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;
  for (let i = 2; i <= n; i += 1) {
    for (let j = 1; j <= i; j += 1) {
      dp[i] += dp[j - 1] * dp[i - j];
    }
  }
  return dp[n];
}

// 8. rob(nums)：打家劫舍，相邻不能偷，非环形。
// 答：dp[i]=max(dp[i-1], nums[i]+dp[i-2])。
function rob(nums) {
  if (!nums.length) return 0;
  if (nums.length === 1) return nums[0];
  let a = nums[0];
  let b = Math.max(nums[0], nums[1]);
  for (let i = 2; i < nums.length; i += 1) {
    const c = Math.max(b, a + nums[i]);
    a = b;
    b = c;
  }
  return b;
}

// 9. uniquePaths(m, n)：网格从左上到右下路径数（只能下/右）。
// 答：组合 C 或 DP。
function uniquePaths(m, n) {
  const dp = Array(n).fill(1);
  for (let i = 1; i < m; i += 1) {
    for (let j = 1; j < n; j += 1) {
      dp[j] += dp[j - 1];
    }
  }
  return dp[n - 1];
}

// 10. minPathSum(grid)：最小路径和。
// 答：原地或滚动 DP。
function minPathSum(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const dp = Array(n).fill(0);
  dp[0] = grid[0][0];
  for (let j = 1; j < n; j += 1) dp[j] = dp[j - 1] + grid[0][j];
  for (let i = 1; i < m; i += 1) {
    dp[0] += grid[i][0];
    for (let j = 1; j < n; j += 1) {
      dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];
    }
  }
  return dp[n - 1];
}

// 11. wordBreak(s, wordDict)：能否切分为词典中的词。
// 答：DP[i] 表示 s[0..i) 是否可拆。
function wordBreak(s, wordDict) {
  const set = new Set(wordDict);
  const dp = Array(s.length + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= s.length; i += 1) {
    for (let j = 0; j < i; j += 1) {
      if (dp[j] && set.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[s.length];
}

// 12. maxProfit(prices)：最多一笔买卖的最大利润。
// 答：维护最低买入价。
function maxProfit(prices) {
  let minP = Infinity;
  let ans = 0;
  for (const p of prices) {
    minP = Math.min(minP, p);
    ans = Math.max(ans, p - minP);
  }
  return ans;
}

// 13. canJump(nums)：能否跳到最后（nums[i] 为步长上限）。
// 答：贪心维护最远可达。
function canJump(nums) {
  let reach = 0;
  for (let i = 0; i < nums.length; i += 1) {
    if (i > reach) return false;
    reach = Math.max(reach, i + nums[i]);
    if (reach >= nums.length - 1) return true;
  }
  return true;
}

// 14. jump(nums)：跳到末尾最少步数（保证可达）。
// 答：贪心：当前步覆盖范围内选下一步最远。
function jump(nums) {
  if (nums.length <= 1) return 0;
  let jumps = 0;
  let curEnd = 0;
  let farthest = 0;
  for (let i = 0; i < nums.length - 1; i += 1) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === curEnd) {
      jumps += 1;
      curEnd = farthest;
    }
  }
  return jumps;
}

// 15. maxProduct(nums)：乘积最大子数组。
// 答：同时维护 curMax/curMin（负负得正）。
function maxProduct(nums) {
  let maxP = nums[0];
  let minP = nums[0];
  let ans = nums[0];
  for (let i = 1; i < nums.length; i += 1) {
    const x = nums[i];
    const t1 = maxP * x;
    const t2 = minP * x;
    maxP = Math.max(x, t1, t2);
    minP = Math.min(x, t1, t2);
    ans = Math.max(ans, maxP);
  }
  return ans;
}

// 16. longestCommonSubsequence(text1, text2)：最长公共子序列长度。
// 答：二维 DP。
function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

// 17. maximalSquare(matrix)：全为 1 的最大正方形面积。
// 答：dp[i][j] = min(左、上、左上)+1。
function maximalSquare(matrix) {
  if (!matrix.length) return 0;
  const m = matrix.length;
  const n = matrix[0].length;
  let side = 0;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (matrix[i - 1][j - 1] === '1') {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
        side = Math.max(side, dp[i][j]);
      }
    }
  }
  return side * side;
}

// 18. numSquares(n)：和为 n 的完全平方数最少个数。
// 答：BFS 或 DP：dp[i]=min(dp[i-j*j]+1)。
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

// 19. coinChange2(amount, coins)：凑成 amount 的组合数（顺序无关，硬币可重复）。
// 答：外层硬币，内层金额，避免排列重复计数。
function coinChange2(amount, coins) {
  const dp = Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const c of coins) {
    for (let i = c; i <= amount; i += 1) {
      dp[i] += dp[i - c];
    }
  }
  return dp[amount];
}

// 20. findTargetSumWays(nums, target)：在数前加 ± 使和为 target 的方案数。
// 答：转化为子集和 P：(sum+P)-(sum-P)=target => P=(target+sum)/2，0-1 背包计数。
function findTargetSumWays(nums, target) {
  const sum = nums.reduce((a, b) => a + b, 0);
  if ((target + sum) % 2 !== 0 || target > sum || target < -sum) return 0;
  const P = (target + sum) >> 1;
  if (P < 0) return 0;
  const dp = Array(P + 1).fill(0);
  dp[0] = 1;
  for (const x of nums) {
    for (let s = P; s >= x; s -= 1) {
      dp[s] += dp[s - x];
    }
  }
  return dp[P];
}

module.exports = {
  subsets,
  permute,
  combinationSum,
  combinationSum2,
  generateParentheses,
  letterCombinations,
  numTrees,
  rob,
  uniquePaths,
  minPathSum,
  wordBreak,
  maxProfit,
  canJump,
  jump,
  maxProduct,
  longestCommonSubsequence,
  maximalSquare,
  numSquares,
  coinChange2,
  findTargetSumWays,
};
