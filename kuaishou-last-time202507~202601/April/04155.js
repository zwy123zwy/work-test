/**
 * 04155.js — 前端代码算法题 20 道（动态规划）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

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

function minCostClimbingStairs(cost) {
  let a = 0;
  let b = 0;
  for (let i = 2; i <= cost.length; i += 1) {
    const c = Math.min(b + cost[i - 1], a + cost[i - 2]);
    a = b;
    b = c;
  }
  return b;
}

function rob(nums) {
  let pre2 = 0;
  let pre1 = 0;
  for (const x of nums) {
    const cur = Math.max(pre1, pre2 + x);
    pre2 = pre1;
    pre1 = cur;
  }
  return pre1;
}

function robCircle(nums) {
  if (nums.length === 1) return nums[0];
  const run = (arr) => {
    let pre2 = 0;
    let pre1 = 0;
    for (const x of arr) {
      const cur = Math.max(pre1, pre2 + x);
      pre2 = pre1;
      pre1 = cur;
    }
    return pre1;
  };
  return Math.max(run(nums.slice(1)), run(nums.slice(0, -1)));
}

function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (const c of coins) {
    for (let a = c; a <= amount; a += 1) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

function change(amount, coins) {
  const dp = Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const c of coins) {
    for (let a = c; a <= amount; a += 1) dp[a] += dp[a - c];
  }
  return dp[amount];
}

function uniquePaths(m, n) {
  const dp = Array(n).fill(1);
  for (let i = 1; i < m; i += 1) {
    for (let j = 1; j < n; j += 1) dp[j] += dp[j - 1];
  }
  return dp[n - 1];
}

function uniquePathsWithObstacles(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const dp = Array(n).fill(0);
  dp[0] = grid[0][0] === 1 ? 0 : 1;
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (grid[i][j] === 1) dp[j] = 0;
      else if (j > 0) dp[j] += dp[j - 1];
    }
  }
  return dp[n - 1];
}

function minPathSum(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const dp = Array(n).fill(Infinity);
  dp[0] = 0;
  for (let i = 0; i < m; i += 1) {
    dp[0] += grid[i][0];
    for (let j = 1; j < n; j += 1) dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];
  }
  return dp[n - 1];
}

function numDecodings(s) {
  if (!s || s[0] === '0') return 0;
  let a = 1;
  let b = 1;
  for (let i = 2; i <= s.length; i += 1) {
    let c = 0;
    if (s[i - 1] !== '0') c += b;
    const two = Number(s.slice(i - 2, i));
    if (two >= 10 && two <= 26) c += a;
    a = b;
    b = c;
  }
  return b;
}

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

function lengthOfLIS(nums) {
  const tails = [];
  for (const x of nums) {
    let l = 0;
    let r = tails.length;
    while (l < r) {
      const m = (l + r) >> 1;
      if (tails[m] < x) l = m + 1;
      else r = m;
    }
    tails[l] = x;
  }
  return tails.length;
}

function findLengthOfLCIS(nums) {
  if (!nums.length) return 0;
  let cur = 1;
  let ans = 1;
  for (let i = 1; i < nums.length; i += 1) {
    cur = nums[i] > nums[i - 1] ? cur + 1 : 1;
    ans = Math.max(ans, cur);
  }
  return ans;
}

function maxSubArray(nums) {
  let best = nums[0];
  let cur = nums[0];
  for (let i = 1; i < nums.length; i += 1) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}

function maxProduct(nums) {
  let mx = nums[0];
  let mn = nums[0];
  let ans = nums[0];
  for (let i = 1; i < nums.length; i += 1) {
    const x = nums[i];
    if (x < 0) [mx, mn] = [mn, mx];
    mx = Math.max(x, mx * x);
    mn = Math.min(x, mn * x);
    ans = Math.max(ans, mx);
  }
  return ans;
}

function canPartition(nums) {
  const sum = nums.reduce((a, b) => a + b, 0);
  if (sum % 2) return false;
  const target = sum / 2;
  const dp = Array(target + 1).fill(false);
  dp[0] = true;
  for (const x of nums) {
    for (let j = target; j >= x; j -= 1) dp[j] = dp[j] || dp[j - x];
  }
  return dp[target];
}

function findTargetSumWays(nums, target) {
  const sum = nums.reduce((a, b) => a + b, 0);
  if (Math.abs(target) > sum || (sum + target) % 2) return 0;
  const bag = (sum + target) / 2;
  const dp = Array(bag + 1).fill(0);
  dp[0] = 1;
  for (const x of nums) {
    for (let j = bag; j >= x; j -= 1) dp[j] += dp[j - x];
  }
  return dp[bag];
}

function numSquares(n) {
  const dp = Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= n; i += 1) {
    for (let j = 1; j * j <= i; j += 1) dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
  }
  return dp[n];
}

function integerBreak(n) {
  const dp = Array(n + 1).fill(0);
  dp[2] = 1;
  for (let i = 3; i <= n; i += 1) {
    for (let j = 1; j < i; j += 1) {
      dp[i] = Math.max(dp[i], j * (i - j), j * dp[i - j]);
    }
  }
  return dp[n];
}

function countBits(n) {
  const dp = Array(n + 1).fill(0);
  for (let i = 1; i <= n; i += 1) dp[i] = dp[i >> 1] + (i & 1);
  return dp;
}

module.exports = {
  climbStairs,
  minCostClimbingStairs,
  rob,
  robCircle,
  coinChange,
  change,
  uniquePaths,
  uniquePathsWithObstacles,
  minPathSum,
  numDecodings,
  wordBreak,
  lengthOfLIS,
  findLengthOfLCIS,
  maxSubArray,
  maxProduct,
  canPartition,
  findTargetSumWays,
  numSquares,
  integerBreak,
  countBits,
};
