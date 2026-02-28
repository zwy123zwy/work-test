/**
 * 022501 面试算法题（20 道）- 专题：动态规划进阶
 * 日期：2026-02-25
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 买卖股票的最佳时机 ====================
function maxProfit1(prices) {
    if (!prices.length) return 0;
    let min = prices[0], res = 0;
    for (const p of prices) {
        res = Math.max(res, p - min);
        min = Math.min(min, p);
    }
    return res;
}

// ==================== 2. 买卖股票的最佳时机 II ====================
function maxProfit2(prices) {
    let res = 0;
    for (let i = 1; i < prices.length; i++)
        if (prices[i] > prices[i - 1]) res += prices[i] - prices[i - 1];
    return res;
}

// ==================== 3. 买卖股票的最佳时机 III ====================
function maxProfit3(prices) {
    let buy1 = -Infinity, sell1 = 0, buy2 = -Infinity, sell2 = 0;
    for (const p of prices) {
        buy1 = Math.max(buy1, -p);
        sell1 = Math.max(sell1, buy1 + p);
        buy2 = Math.max(buy2, sell1 - p);
        sell2 = Math.max(sell2, buy2 + p);
    }
    return sell2;
}

// ==================== 4. 买卖股票的最佳时机含冷冻期 ====================
function maxProfitCold(prices) {
    let sold = 0, held = -Infinity, rest = 0;
    for (const p of prices) {
        const prevSold = sold;
        sold = held + p;
        held = Math.max(held, rest - p);
        rest = Math.max(rest, prevSold);
    }
    return Math.max(sold, rest);
}

// ==================== 5. 零钱兑换 ====================
function coinChange(coins, amount) {
    const dp = Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (let i = 1; i <= amount; i++)
        for (const c of coins)
            if (i >= c) dp[i] = Math.min(dp[i], dp[i - c] + 1);
    return dp[amount] === Infinity ? -1 : dp[amount];
}

// ==================== 6. 零钱兑换 II ====================
function change(coins, amount) {
    const dp = Array(amount + 1).fill(0);
    dp[0] = 1;
    for (const c of coins)
        for (let i = c; i <= amount; i++) dp[i] += dp[i - c];
    return dp[amount];
}

// ==================== 7. 最长递增子序列 ====================
function lengthOfLIS(nums) {
    if (!nums.length) return 0;
    const dp = Array(nums.length).fill(1);
    for (let i = 1; i < nums.length; i++)
        for (let j = 0; j < i; j++)
            if (nums[i] > nums[j]) dp[i] = Math.max(dp[i], dp[j] + 1);
    return Math.max(...dp);
}

// ==================== 8. 最长递增子序列的个数 ====================
function findNumberOfLIS(nums) {
    const n = nums.length;
    const len = Array(n).fill(1), cnt = Array(n).fill(1);
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[i] <= nums[j]) continue;
            if (len[j] + 1 > len[i]) len[i] = len[j] + 1, cnt[i] = cnt[j];
            else if (len[j] + 1 === len[i]) cnt[i] += cnt[j];
        }
    }
    const maxLen = Math.max(...len);
    return len.reduce((s, l, i) => l === maxLen ? s + cnt[i] : s, 0);
}

// ==================== 9. 俄罗斯套娃信封 ====================
function maxEnvelopes(envelopes) {
    envelopes.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : b[1] - a[1]);
    const tails = [];
    for (const [, h] of envelopes) {
        let lo = 0, hi = tails.length;
        while (lo < hi) {
            const mid = (lo + hi) >>> 1;
            if (tails[mid] < h) lo = mid + 1;
            else hi = mid;
        }
        if (lo === tails.length) tails.push(h);
        else tails[lo] = h;
    }
    return tails.length;
}

// ==================== 10. 最大子数组和 ====================
function maxSubArray(nums) {
    let cur = 0, res = -Infinity;
    for (const x of nums) {
        cur = Math.max(x, cur + x);
        res = Math.max(res, cur);
    }
    return res;
}

// ==================== 11. 乘积最大子数组 ====================
function maxProduct(nums) {
    let maxP = nums[0], minP = nums[0], res = nums[0];
    for (let i = 1; i < nums.length; i++) {
        const x = nums[i];
        const [a, b] = [maxP * x, minP * x];
        maxP = Math.max(x, a, b);
        minP = Math.min(x, a, b);
        res = Math.max(res, maxP);
    }
    return res;
}

// ==================== 12. 打家劫舍 ====================
function rob(nums) {
    let prev = 0, curr = 0;
    for (const x of nums) [prev, curr] = [curr, Math.max(curr, prev + x)];
    return curr;
}

// ==================== 13. 打家劫舍 II ====================
function robRange(nums, lo, hi) {
    let prev = 0, curr = 0;
    for (let i = lo; i <= hi; i++) [prev, curr] = [curr, Math.max(curr, prev + nums[i])];
    return curr;
}
function rob2(nums) {
    if (nums.length === 1) return nums[0];
    return Math.max(robRange(nums, 0, nums.length - 2), robRange(nums, 1, nums.length - 1));
}

// ==================== 14. 打家劫舍 III ====================
function rob3(root) {
    const dfs = (node) => {
        if (!node) return [0, 0];
        const [lNo, lYes] = dfs(node.left);
        const [rNo, rYes] = dfs(node.right);
        const no = Math.max(lNo, lYes) + Math.max(rNo, rYes);
        const yes = node.val + lNo + rNo;
        return [no, yes];
    };
    const [a, b] = dfs(root);
    return Math.max(a, b);
}

// ==================== 15. 单词拆分 ====================
function wordBreak(s, wordDict) {
    const set = new Set(wordDict);
    const dp = Array(s.length + 1).fill(false);
    dp[0] = true;
    for (let i = 1; i <= s.length; i++)
        for (let j = 0; j < i; j++)
            if (dp[j] && set.has(s.slice(j, i))) { dp[i] = true; break; }
    return dp[s.length];
}

// ==================== 16. 单词拆分 II ====================
function wordBreak2(s, wordDict) {
    const set = new Set(wordDict);
    const memo = new Map();
    function dfs(start) {
        if (start === s.length) return [''];
        if (memo.has(start)) return memo.get(start);
        const res = [];
        for (let end = start + 1; end <= s.length; end++) {
            const w = s.slice(start, end);
            if (set.has(w))
                for (const tail of dfs(end))
                    res.push(w + (tail ? ' ' + tail : ''));
        }
        memo.set(start, res);
        return res;
    }
    return dfs(0);
}

// ==================== 17. 完全平方数 ====================
function numSquares(n) {
    const dp = Array(n + 1).fill(Infinity);
    dp[0] = 0;
    for (let i = 1; i <= n; i++)
        for (let j = 1; j * j <= i; j++)
            dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
    return dp[n];
}

// ==================== 18. 解码方法 ====================
function numDecodings(s) {
    if (s[0] === '0') return 0;
    let prev = 1, curr = 1;
    for (let i = 1; i < s.length; i++) {
        let next = 0;
        if (s[i] !== '0') next += curr;
        const two = parseInt(s.slice(i - 1, i + 1), 10);
        if (two >= 10 && two <= 26) next += prev;
        prev = curr;
        curr = next;
    }
    return curr;
}

// ==================== 19. 交错字符串 ====================
function isInterleave(s1, s2, s3) {
    if (s1.length + s2.length !== s3.length) return false;
    const m = s1.length, n = s2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(false));
    dp[0][0] = true;
    for (let i = 0; i <= m; i++)
        for (let j = 0; j <= n; j++) {
            if (i > 0 && s1[i - 1] === s3[i + j - 1]) dp[i][j] = dp[i][j] || dp[i - 1][j];
            if (j > 0 && s2[j - 1] === s3[i + j - 1]) dp[i][j] = dp[i][j] || dp[i][j - 1];
        }
    return dp[m][n];
}

// ==================== 20. 地下城游戏 ====================
function calculateMinimumHP(dungeon) {
    const m = dungeon.length, n = dungeon[0].length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(Infinity));
    dp[m][n - 1] = dp[m - 1][n] = 1;
    for (let i = m - 1; i >= 0; i--)
        for (let j = n - 1; j >= 0; j--) {
            const need = Math.min(dp[i + 1][j], dp[i][j + 1]) - dungeon[i][j];
            dp[i][j] = Math.max(1, need);
        }
    return dp[0][0];
}

// ==================== 测试 ====================
function test022501() {
    const assert = (name, got, expect) => {
        const ok = JSON.stringify(got) === JSON.stringify(expect);
        console.log(ok ? `[OK] ${name}` : `[FAIL] ${name} got=${JSON.stringify(got)} expect=${JSON.stringify(expect)}`);
    };
    assert('1. maxProfit1', maxProfit1([7, 1, 5, 3, 6, 4]), 5);
    assert('2. maxProfit2', maxProfit2([7, 1, 5, 3, 6, 4]), 7);
    assert('3. maxProfit3', maxProfit3([3, 3, 5, 0, 0, 3, 1, 4]), 6);
    assert('4. maxProfitCold', maxProfitCold([1, 2, 3, 0, 2]), 3);
    assert('5. coinChange', coinChange([1, 2, 5], 11), 3);
    assert('6. change', change([1, 2, 5], 5), 4);
    assert('7. lengthOfLIS', lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]), 4);
    assert('8. findNumberOfLIS', findNumberOfLIS([1, 3, 5, 4, 7]), 2);
    assert('9. maxEnvelopes', maxEnvelopes([[5, 4], [6, 4], [6, 7], [2, 3]]), 3);
    assert('10. maxSubArray', maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
    assert('11. maxProduct', maxProduct([2, 3, -2, 4]), 6);
    assert('12. rob', rob([2, 7, 9, 3, 1]), 12);
    assert('13. rob2', rob2([2, 3, 2]), 3);
    const tree = new TreeNode(3, new TreeNode(2, null, new TreeNode(3)), new TreeNode(3, null, new TreeNode(1)));
    assert('14. rob3', rob3(tree), 7);
    assert('15. wordBreak', wordBreak('leetcode', ['leet', 'code']), true);
    assert('16. wordBreak2', wordBreak2('catsanddog', ['cat', 'cats', 'and', 'sand', 'dog']).length, 2);
    assert('17. numSquares', numSquares(12), 3);
    assert('18. numDecodings', numDecodings('12'), 2);
    assert('19. isInterleave', isInterleave('aabcc', 'dbbca', 'aadbbcbcac'), true);
    assert('20. calculateMinimumHP', calculateMinimumHP([[-2, -3, 3], [-5, -10, 1], [10, 30, -5]]), 7);
    console.log('022501 tests done.');
}
test022501();
