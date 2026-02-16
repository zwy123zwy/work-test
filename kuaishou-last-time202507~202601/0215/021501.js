/**
 * 021501 面试算法题（20 道）- 专题：动态规划
 * 日期：2026-02-15
 * 规则：仅题干、输入输出与约束；个人完成后再补充解答与测试用例。
 */

class ListNode {
    constructor(val, next = null) { this.val = val; this.next = next; }
}
class TreeNode {
    constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}

// ==================== 1. 爬楼梯 ====================
// 题干：一次可爬 1 或 2 阶，到第 n 阶有多少种不同方法？n >= 1。
// 输入：n: number
// 输出：number
// 约束：DP dp[i]=dp[i-1]+dp[i-2]，可空间优化 O(1)

function climbStairs(n) {
    if (n <= 2) return n;
    let a = 1, b = 2;
    for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
    return b;
}

// ==================== 2. 最小路径和 ====================
// 题干：m×n 网格，从左上到右下只能向右或向下，求路径上数字和的最小值。
// 输入：grid: number[][]
// 输出：number
// 约束：DP 二维或滚动数组

function minPathSum(grid) {
    const m = grid.length, n = grid[0].length;
    for (let i = 1; i < m; i++) grid[i][0] += grid[i - 1][0];
    for (let j = 1; j < n; j++) grid[0][j] += grid[0][j - 1];
    for (let i = 1; i < m; i++)
        for (let j = 1; j < n; j++)
            grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);
    return grid[m - 1][n - 1];
}

// ==================== 3. 最大子数组和 ====================
// 题干：整数数组 nums，求连续子数组的最大和。
// 输入：nums: number[]
// 输出：number
// 约束：DP 或 Kadane，O(n)

function maxSubArray(nums) {
    let cur = nums[0], max = nums[0];
    for (let i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i]);
        max = Math.max(max, cur);
    }
    return max;
}

// ==================== 4. 买卖股票的最佳时机 ====================
// 题干：数组 prices[i] 为第 i 天股价，最多一笔交易（买一次卖一次），求最大利润。
// 输入：prices: number[]
// 输出：number
// 约束：记录前缀最小，扫一遍求 max(p - min)

function maxProfit(prices) {
    if (!prices.length) return 0;
    let min = prices[0], ans = 0;
    for (const p of prices) { ans = Math.max(ans, p - min); min = Math.min(min, p); }
    return ans;
}

// ==================== 5. 买卖股票的最佳时机 II ====================
// 题干：可多次交易（买前须先卖），求最大利润。
// 输入：prices: number[]
// 输出：number
// 约束：贪心累加所有上升段，或 DP 状态机

function maxProfitII(prices) {
    let ans = 0;
    for (let i = 1; i < prices.length; i++)
        if (prices[i] > prices[i - 1]) ans += prices[i] - prices[i - 1];
    return ans;
}

// ==================== 6. 买卖股票的最佳时机含冷冻期 ====================
// 题干：卖出后有一天冷冻期不能买，可多次交易，求最大利润。
// 输入：prices: number[]
// 输出：number
// 约束：DP 状态：持有/不持有(冷冻)/不持有(非冷冻)

function maxProfitCold(prices) {
    let hold = -prices[0], cold = 0, free = 0;
    for (let i = 1; i < prices.length; i++) {
        [hold, cold, free] = [
            Math.max(hold, free - prices[i]),
            hold + prices[i],
            Math.max(free, cold)
        ];
    }
    return Math.max(cold, free);
}

// ==================== 7. 零钱兑换 ====================
// 题干：硬币数组 coins 和总金额 amount，求凑成 amount 的最少硬币数；无法凑成返回 -1。
// 输入：coins: number[], amount: number
// 输出：number
// 约束：完全背包 DP，dp[i]=min(dp[i-c])+1

function coinChange(coins, amount) {
    const dp = Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (let i = 1; i <= amount; i++)
        for (const c of coins)
            if (i >= c) dp[i] = Math.min(dp[i], dp[i - c] + 1);
    return dp[amount] === Infinity ? -1 : dp[amount];
}

// ==================== 8. 零钱兑换 II ====================
// 题干：硬币数组 coins 和 amount，求凑成 amount 的组合数（每种硬币无限）。
// 输入：coins: number[], amount: number
// 输出：number
// 约束：完全背包求方案数

function change(amount, coins) {
    const dp = Array(amount + 1).fill(0);
    dp[0] = 1;
    for (const c of coins)
        for (let i = c; i <= amount; i++)
            dp[i] += dp[i - c];
    return dp[amount];
}

// ==================== 9. 最长递增子序列 ====================
// 题干：整数数组 nums，求最长严格递增子序列的长度（不要求连续）。
// 输入：nums: number[]
// 输出：number
// 约束：DP O(n^2) 或 贪心+二分 O(n log n)

function lengthOfLIS(nums) {
    const dp = Array(nums.length).fill(1);
    for (let i = 1; i < nums.length; i++)
        for (let j = 0; j < i; j++)
            if (nums[i] > nums[j]) dp[i] = Math.max(dp[i], dp[j] + 1);
    return Math.max(...dp, 0);
}

// ==================== 10. 最长公共子序列 ====================
// 题干：字符串 text1、text2，求最长公共子序列长度（不要求连续）。
// 输入：text1: string, text2: string
// 输出：number
// 约束：二维 DP，s1[i]==s2[j] 则 dp[i][j]=dp[i-1][j-1]+1 否则 max(dp[i-1][j], dp[i][j-1])

function longestCommonSubsequence(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = text1[i - 1] === text2[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    return dp[m][n];
}

// ==================== 11. 编辑距离（Levenshtein） ====================
// 题干：单词 word1、word2，求最少插入/删除/替换次数使 word1 变为 word2。
// 输入：word1: string, word2: string
// 输出：number
// 约束：二维 DP，三种操作取 min

function minDistance(word1, word2) {
    const m = word1.length, n = word2.length;
    const dp = Array(m + 1).fill(0).map((_, i) => Array(n + 1).fill(0).map((_, j) => i + j));
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = word1[i - 1] === word2[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    return dp[m][n];
}

// ==================== 12. 不同路径 ====================
// 题干：m×n 网格，从左上到右下只能向右或向下，求不同路径数。
// 输入：m: number, n: number
// 输出：number
// 约束：DP 或组合数 C(m+n-2, m-1)

function uniquePaths(m, n) {
    const dp = Array(n).fill(1);
    for (let i = 1; i < m; i++)
        for (let j = 1; j < n; j++)
            dp[j] += dp[j - 1];
    return dp[n - 1];
}

// ==================== 13. 不同路径 II ====================
// 题干：同上，网格中若干格子有障碍物，求不经过障碍的路径数。
// 输入：obstacleGrid: number[][]（1 表示障碍）
// 输出：number
// 约束：DP 遇障碍则该格为 0

function uniquePathsWithObstacles(grid) {
    const m = grid.length, n = grid[0].length;
    const dp = Array(n).fill(0);
    dp[0] = 1;
    for (let i = 0; i < m; i++) {
        if (grid[i][0]) dp[0] = 0;
        for (let j = 1; j < n; j++)
            dp[j] = grid[i][j] ? 0 : dp[j] + dp[j - 1];
    }
    return dp[n - 1];
}

// ==================== 14. 整数拆分 ====================
// 题干：正整数 n，拆成至少两个正整数之和，求这些数乘积的最大值。
// 输入：n: number
// 输出：number
// 约束：DP 或数学（尽量拆成 3）

function integerBreak(n) {
    const dp = Array(n + 1).fill(0);
    dp[1] = 1;
    for (let i = 2; i <= n; i++)
        for (let j = 1; j < i; j++)
            dp[i] = Math.max(dp[i], Math.max(j, dp[j]) * Math.max(i - j, dp[i - j]));
    return dp[n];
}

// ==================== 15. 完全平方数 ====================
// 题干：正整数 n，求最少需要几个完全平方数（1,4,9,…）相加等于 n。
// 输入：n: number
// 输出：number
// 约束：DP 或 BFS 层数，或四平方和定理

function numSquares(n) {
    const dp = Array(n + 1).fill(Infinity);
    dp[0] = 0;
    for (let i = 1; i <= n; i++)
        for (let j = 1; j * j <= i; j++)
            dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
    return dp[n];
}

// ==================== 16. 单词拆分 ====================
// 题干：字符串 s 和单词表 wordDict，判断 s 是否可由 wordDict 中的单词拼接而成。
// 输入：s: string, wordDict: string[]
// 输出：boolean
// 约束：DP dp[i] 表示 s[0..i) 能否拆分

function wordBreak(s, wordDict) {
    const set = new Set(wordDict);
    const dp = Array(s.length + 1).fill(false);
    dp[0] = true;
    for (let i = 1; i <= s.length; i++)
        for (let j = 0; j < i; j++)
            if (dp[j] && set.has(s.slice(j, i))) { dp[i] = true; break; }
    return dp[s.length];
}

// ==================== 17. 单词拆分 II ====================
// 题干：同上，返回所有可能的拆分方案（句子列表）。
// 输入：s: string, wordDict: string[]
// 输出：string[]
// 约束：DP 记录可达性 + 回溯构造方案

function wordBreakII(s, wordDict) {
    const set = new Set(wordDict);
    const dp = Array(s.length + 1).fill(null).map(() => []);
    dp[0] = [''];
    for (let i = 1; i <= s.length; i++)
        for (let j = 0; j < i; j++)
            if (dp[j].length && set.has(s.slice(j, i)))
                for (const x of dp[j]) dp[i].push(x ? x + ' ' + s.slice(j, i) : s.slice(j, i));
    return dp[s.length];
}

// ==================== 18. 打家劫舍 ====================
// 题干：数组 nums 表示每户金额，不能偷相邻两家，求最大金额。
// 输入：nums: number[]
// 输出：number
// 约束：DP dp[i]=max(dp[i-1], dp[i-2]+nums[i])

function rob(nums) {
    if (!nums.length) return 0;
    let a = 0, b = nums[0];
    for (let i = 1; i < nums.length; i++) [a, b] = [b, Math.max(b, a + nums[i])];
    return b;
}

// ==================== 19. 打家劫舍 II ====================
// 题干：房屋围成环，首尾相邻，其余同打家劫舍。
// 输入：nums: number[]
// 输出：number
// 约束：分两种情况：不偷第一家 / 不偷最后一家，取 max

function robII(nums) {
    if (nums.length <= 1) return nums[0] || 0;
    const f = (arr) => { let a = 0, b = arr[0]; for (let i = 1; i < arr.length; i++) [a, b] = [b, Math.max(b, a + arr[i])]; return b; };
    return Math.max(f(nums.slice(0, -1)), f(nums.slice(1)));
}

// ==================== 20. 最长回文子串 ====================
// 题干：字符串 s，求最长回文子串。
// 输入：s: string
// 输出：string
// 约束：中心扩展 O(n^2) 或 Manacher O(n)；也可区间 DP

function longestPalindrome(s) {
    const expand = (l, r) => {
        while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
        return s.slice(l + 1, r);
    };
    let best = '';
    for (let i = 0; i < s.length; i++) {
        const a = expand(i, i), b = expand(i, i + 1);
        if (a.length > best.length) best = a;
        if (b.length > best.length) best = b;
    }
    return best;
}
