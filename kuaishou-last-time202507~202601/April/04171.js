/**
 * 04171.js — 前端代码算法题 20 道（动态规划 · 一维 / 经典线性 DP）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. climbStairs(n)：每次 1 或 2 阶，到达 n 阶方案数。
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

// 2. minCostClimbingStairs(cost)：可从下标 0 或 1 出发，付 cost[i] 离开 i，到达顶部最少花费。
function minCostClimbingStairs(cost) {
  let a = cost[0];
  let b = cost[1];
  for (let i = 2; i < cost.length; i += 1) {
    const c = cost[i] + Math.min(a, b);
    a = b;
    b = c;
  }
  return Math.min(a, b);
}

// 3. rob(nums)：不相邻打劫，最大金额。
function rob(nums) {
  if (!nums.length) return 0;
  if (nums.length === 1) return nums[0];
  let p0 = 0;
  let p1 = 0;
  for (const x of nums) {
    const cur = Math.max(p1, p0 + x);
    p0 = p1;
    p1 = cur;
  }
  return p1;
}

// 4. robCircular(nums)：首尾不能同时抢。
function robCircular(nums) {
  if (nums.length === 1) return nums[0];
  const linear = (a) => {
    let p0 = 0;
    let p1 = 0;
    for (const x of a) {
      const cur = Math.max(p1, p0 + x);
      p0 = p1;
      p1 = cur;
    }
    return p1;
  };
  return Math.max(linear(nums.slice(0, -1)), linear(nums.slice(1)));
}

// 5. coinChange(coins, amount)：最少硬币数，无解返回 -1。
function coinChange(coins, amount) {
  const inf = amount + 1;
  const dp = Array(amount + 1).fill(inf);
  dp[0] = 0;
  for (let s = 1; s <= amount; s += 1) {
    for (const c of coins) {
      if (s >= c) dp[s] = Math.min(dp[s], dp[s - c] + 1);
    }
  }
  return dp[amount] > amount ? -1 : dp[amount];
}

// 6. coinChange2(amount, coins)：组合数（顺序无关）。
function coinChange2(amount, coins) {
  const dp = Array(amount + 1).fill(0);
  dp[0] = 1;
  for (const c of coins) {
    for (let s = c; s <= amount; s += 1) dp[s] += dp[s - c];
  }
  return dp[amount];
}

// 7. lengthOfLIS(nums)：严格递增最长子序列长度（耐心排序 / 二分）。
function lengthOfLIS(nums) {
  const tail = [];
  for (const x of nums) {
    let lo = 0;
    let hi = tail.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tail[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    if (lo === tail.length) tail.push(x);
    else tail[lo] = x;
  }
  return tail.length;
}

// 8. maxSubArray(nums)：最大子数组和。
function maxSubArray(nums) {
  let cur = nums[0];
  let ans = nums[0];
  for (let i = 1; i < nums.length; i += 1) {
    cur = Math.max(nums[i], cur + nums[i]);
    ans = Math.max(ans, cur);
  }
  return ans;
}

// 9. maxProduct(nums)：最大子数组乘积。
function maxProduct(nums) {
  let maxP = nums[0];
  let minP = nums[0];
  let ans = nums[0];
  for (let i = 1; i < nums.length; i += 1) {
    const x = nums[i];
    if (x < 0) [maxP, minP] = [minP, maxP];
    maxP = Math.max(x, maxP * x);
    minP = Math.min(x, minP * x);
    ans = Math.max(ans, maxP);
  }
  return ans;
}

// 10. wordBreak(s, wordDict)：能否拆成字典词（完全背包顺序）。wordDict 为数组。
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

// 11. numDecodings(s)：数字串解码方法数（1–26）。
function numDecodings(s) {
  if (!s.length || s[0] === '0') return 0;
  const n = s.length;
  let p0 = 1;
  let p1 = 1;
  for (let i = 1; i < n; i += 1) {
    let cur = 0;
    const one = +s[i];
    const two = +(s[i - 1] + s[i]);
    if (one !== 0) cur += p1;
    if (two >= 10 && two <= 26) cur += p0;
    p0 = p1;
    p1 = cur;
  }
  return p1;
}

// 12. numSquares(n)：和为 n 的完全平方数最少个数。
function numSquares(n) {
  const dp = Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let s = 1; s <= n; s += 1) {
    for (let k = 1; k * k <= s; k += 1) {
      dp[s] = Math.min(dp[s], dp[s - k * k] + 1);
    }
  }
  return dp[n];
}

// 13. integerBreak(n)：正整数拆成至少两个正整数之和，乘积最大。
function integerBreak(n) {
  if (n <= 3) return n - 1;
  let prod = 1;
  while (n > 4) {
    prod *= 3;
    n -= 3;
  }
  return prod * n;
}

// 14. countBits(n)：0..n 每个数二进制中 1 的个数。
function countBits(n) {
  const ans = Array(n + 1).fill(0);
  for (let i = 1; i <= n; i += 1) ans[i] = ans[i >> 1] + (i & 1);
  return ans;
}

// 15. nthFibonacci(n)：F(0)=0,F(1)=1。
function nthFibonacci(n) {
  if (n <= 1) return n;
  let a = 0;
  let b = 1;
  for (let i = 2; i <= n; i += 1) {
    const c = a + b;
    a = b;
    b = c;
  }
  return b;
}

// 16. deleteAndEarn(nums)：删 x 得 x 分且删尽所有 x，最大得分。
function deleteAndEarn(nums) {
  const mx = Math.max(...nums, 0);
  const sum = Array(mx + 1).fill(0);
  for (const x of nums) sum[x] += x;
  let take = 0;
  let skip = 0;
  for (let i = 1; i <= mx; i += 1) {
    const nt = skip + sum[i];
    const ns = Math.max(take, skip);
    take = nt;
    skip = ns;
  }
  return Math.max(take, skip);
}

// 17. canPartition(nums)：能否分成和相等的两部分。
function canPartition(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2) return false;
  const target = total / 2;
  const dp = Array(target + 1).fill(false);
  dp[0] = true;
  for (const x of nums) {
    for (let s = target; s >= x; s -= 1) dp[s] = dp[s] || dp[s - x];
  }
  return dp[target];
}

// 18. findTargetSumWays(nums, target)：加减凑目标和方案数。
function findTargetSumWays(nums, target) {
  const total = nums.reduce((a, b) => a + b, 0);
  const s2 = target + total;
  if (s2 < 0 || s2 % 2) return 0;
  const sumPos = s2 / 2;
  const dp = Array(sumPos + 1).fill(0);
  dp[0] = 1;
  for (const x of nums) {
    for (let s = sumPos; s >= x; s -= 1) dp[s] += dp[s - x];
  }
  return dp[sumPos];
}

// 19. longestPalindrome(s)：中心扩展求最长回文子串。
function longestPalindromeSubstring(s) {
  let start = 0;
  let len = 0;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l -= 1;
      r += 1;
    }
    return r - l - 1;
  };
  for (let i = 0; i < s.length; i += 1) {
    const o1 = expand(i, i);
    const o2 = expand(i, i + 1);
    const m = Math.max(o1, o2);
    if (m > len) {
      len = m;
      start = i - Math.floor((m - 1) / 2);
    }
  }
  return s.slice(start, start + len);
}

// 20. getMoneyAmount(n)：猜 1..n 的最坏最小花费（最小化最坏情况下的支付）。
function getMoneyAmount(n) {
  const dp = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
  for (let len = 2; len <= n; len += 1) {
    for (let i = 1; i + len - 1 <= n; i += 1) {
      const j = i + len - 1;
      dp[i][j] = Infinity;
      for (let k = i; k <= j; k += 1) {
        const left = k > i ? dp[i][k - 1] : 0;
        const right = k < j ? dp[k + 1][j] : 0;
        const cost = k + Math.max(left, right);
        dp[i][j] = Math.min(dp[i][j], cost);
      }
    }
  }
  return dp[1][n];
}

module.exports = {
  climbStairs,
  minCostClimbingStairs,
  rob,
  robCircular,
  coinChange,
  coinChange2,
  lengthOfLIS,
  maxSubArray,
  maxProduct,
  wordBreak,
  numDecodings,
  numSquares,
  integerBreak,
  countBits,
  nthFibonacci,
  deleteAndEarn,
  canPartition,
  findTargetSumWays,
  longestPalindromeSubstring,
  getMoneyAmount,
};
