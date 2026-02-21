/**
 * 021701 面试算法题（20 道）- 专题：回溯与组合
 * 日期：2026-02-17
 * 规则：仅题干、输入输出与约束；个人完成后再补充解答与测试用例。
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 子集 ====================
// 题干：不含重复元素的 nums，返回所有子集（幂集）。
// 输入：nums: number[]
// 输出：number[][]
// 约束：回溯或迭代

function subsets(nums) {
    const res = [];
    const dfs = (start, path) => {
        res.push([...path]);
        for (let i = start; i < nums.length; i++) {
            path.push(nums[i]);
            dfs(i + 1, path);
            path.pop();
        }
    };
    dfs(0, []);
    return res;
}

// ==================== 2. 子集 II ====================
// 题干：含重复元素的 nums，返回所有不重复子集。
// 输入：nums: number[]
// 输出：number[][]
// 约束：排序 + 回溯去重

function subsetsWithDup(nums) {
    nums.sort((a, b) => a - b);
    const res = [];
    const dfs = (start, path) => {
        res.push([...path]);
        for (let i = start; i < nums.length; i++) {
            if (i > start && nums[i] === nums[i - 1]) continue;
            path.push(nums[i]);
            dfs(i + 1, path);
            path.pop();
        }
    };
    dfs(0, []);
    return res;
}

// ==================== 3. 组合 ====================
// 题干：1~n 中选 k 个数的所有组合。
// 输入：n: number, k: number
// 输出：number[][]
// 约束：回溯

function combine(n, k) {
    const res = [];
    const dfs = (start, path) => {
        if (path.length === k) { res.push([...path]); return; }
        for (let i = start; i <= n; i++) {
            path.push(i);
            dfs(i + 1, path);
            path.pop();
        }
    };
    dfs(1, []);
    return res;
}

// ==================== 4. 组合总和 ====================
// 题干：无重复正整数 candidates 和 target，数字可重复使用，找出所有和为 target 的组合。
// 输入：candidates: number[], target: number
// 输出：number[][]
// 约束：回溯，可重复选

function combinationSum(candidates, target) {
    const res = [];
    const dfs = (start, path, sum) => {
        if (sum === target) { res.push([...path]); return; }
        if (sum > target) return;
        for (let i = start; i < candidates.length; i++) {
            path.push(candidates[i]);
            dfs(i, path, sum + candidates[i]);
            path.pop();
        }
    };
    dfs(0, [], 0);
    return res;
}

// ==================== 5. 组合总和 II ====================
// 题干：含重复正整数的 candidates 和 target，每个数字用一次，找出所有不重复组合。
// 输入：candidates: number[], target: number
// 输出：number[][]
// 约束：排序 + 回溯去重

function combinationSum2(candidates, target) {
    candidates.sort((a, b) => a - b);
    const res = [];
    const dfs = (start, path, sum) => {
        if (sum === target) { res.push([...path]); return; }
        if (sum > target) return;
        for (let i = start; i < candidates.length; i++) {
            if (i > start && candidates[i] === candidates[i - 1]) continue;
            path.push(candidates[i]);
            dfs(i + 1, path, sum + candidates[i]);
            path.pop();
        }
    };
    dfs(0, [], 0);
    return res;
}

// ==================== 6. 组合总和 III ====================
// 题干：1~9 中选 k 个数，使其和等于 n。每个数字最多用一次。
// 输入：k: number, n: number
// 输出：number[][]
// 约束：回溯

function combinationSum3(k, n) {
    const res = [];
    const dfs = (start, path, sum) => {
        if (path.length === k && sum === n) { res.push([...path]); return; }
        if (path.length >= k || sum >= n) return;
        for (let i = start; i <= 9; i++) {
            path.push(i);
            dfs(i + 1, path, sum + i);
            path.pop();
        }
    };
    dfs(1, [], 0);
    return res;
}

// ==================== 7. 全排列 ====================
// 题干：不含重复数字的 nums，返回所有全排列。
// 输入：nums: number[]
// 输出：number[][]
// 约束：回溯，交换或 used 数组

function permute(nums) {
    const res = [];
    const dfs = (path, used) => {
        if (path.length === nums.length) { res.push([...path]); return; }
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true; path.push(nums[i]);
            dfs(path, used);
            path.pop(); used[i] = false;
        }
    };
    dfs([], []);
    return res;
}

// ==================== 8. 全排列 II ====================
// 题干：含重复数字的 nums，返回所有不重复全排列。
// 输入：nums: number[]
// 输出：number[][]
// 约束：排序 + 回溯去重

function permuteUnique(nums) {
    nums.sort((a, b) => a - b);
    const res = [], used = [];
    const dfs = (path) => {
        if (path.length === nums.length) { res.push([...path]); return; }
        for (let i = 0; i < nums.length; i++) {
            if (used[i] || (i > 0 && nums[i] === nums[i - 1] && !used[i - 1])) continue;
            used[i] = true; path.push(nums[i]);
            dfs(path);
            path.pop(); used[i] = false;
        }
    };
    dfs([]);
    return res;
}

// ==================== 9. 括号生成 ====================
// 题干：n 对括号，生成所有有效的括号组合。
// 输入：n: number
// 输出：string[]
// 约束：回溯，左括号数 >= 右括号数

function generateParenthesis(n) {
    const res = [];
    const dfs = (open, close, s) => {
        if (s.length === 2 * n) { res.push(s); return; }
        if (open < n) dfs(open + 1, close, s + '(');
        if (close < open) dfs(open, close + 1, s + ')');
    };
    dfs(0, 0, '');
    return res;
}

// ==================== 10. 电话号码的字母组合 ====================
// 题干：数字串 "23" 对应 "abc"、"def"，返回所有字母组合。
// 输入：digits: string
// 输出：string[]
// 约束：回溯

const digitMap = ['', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz'];
function letterCombinations(digits) {
    if (!digits) return [];
    const res = [];
    const dfs = (i, s) => {
        if (i === digits.length) { res.push(s); return; }
        for (const c of digitMap[digits[i]]) dfs(i + 1, s + c);
    };
    dfs(0, '');
    return res;
}

// ==================== 11. 分割回文串 ====================
// 题干：字符串 s，将 s 分割成若干子串使每个都是回文，返回所有分割方案。
// 输入：s: string
// 输出：string[][]
// 约束：回溯 + 判断回文

function partition(s) {
    const isPal = (l, r) => { while (l < r) if (s[l++] !== s[r--]) return false; return true; };
    const res = [];
    const dfs = (start, path) => {
        if (start === s.length) { res.push([...path]); return; }
        for (let end = start; end < s.length; end++) {
            if (!isPal(start, end)) continue;
            path.push(s.slice(start, end + 1));
            dfs(end + 1, path);
            path.pop();
        }
    };
    dfs(0, []);
    return res;
}

// ==================== 12. 分割回文串 II ====================
// 题干：字符串 s，求最少分割次数使每个子串都是回文。
// 输入：s: string
// 输出：number
// 约束：DP 或 BFS

function minCut(s) {
    const n = s.length;
    const pal = Array(n).fill(0).map(() => Array(n).fill(true));
    for (let len = 2; len <= n; len++)
        for (let i = 0; i + len <= n; i++) {
            const j = i + len - 1;
            pal[i][j] = s[i] === s[j] && pal[i + 1][j - 1];
        }
    const dp = new Array(n + 1).fill(Infinity);
    dp[0] = 0;
    for (let j = 1; j <= n; j++)
        for (let i = 0; i < j; i++)
            if (pal[i][j - 1]) dp[j] = Math.min(dp[j], dp[i] + 1);
    return dp[n] - 1;
}

// ==================== 13. 复原 IP 地址 ====================
// 题干：只含数字的字符串 s，返回所有有效 IP 地址（如 "255.255.11.135"）。
// 输入：s: string
// 输出：string[]
// 约束：回溯，四段每段 0~255 无前导零

function restoreIpAddresses(s) {
    const res = [];
    const dfs = (start, path) => {
        if (path.length === 4) {
            if (start === s.length) res.push(path.join('.'));
            return;
        }
        for (let len = 1; len <= 3 && start + len <= s.length; len++) {
            const seg = s.slice(start, start + len);
            if ((seg[0] === '0' && len > 1) || Number(seg) > 255) break;
            path.push(seg);
            dfs(start + len, path);
            path.pop();
        }
    };
    dfs(0, []);
    return res;
}

// ==================== 14. 单词搜索 ====================
// 题干：二维字符网格 board 和单词 word，判断 word 是否存在于网格中（相邻格子上下左右）。
// 输入：board: string[][], word: string
// 输出：boolean
// 约束：回溯 + visited

function exist(board, word) {
    const R = board.length, C = board[0].length;
    const dfs = (r, c, i) => {
        if (i === word.length) return true;
        if (r < 0 || r >= R || c < 0 || c >= C || board[r][c] !== word[i]) return false;
        const ch = board[r][c];
        board[r][c] = '';
        const ok = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
        board[r][c] = ch;
        return ok;
    };
    for (let r = 0; r < R; r++)
        for (let c = 0; c < C; c++)
            if (dfs(r, c, 0)) return true;
    return false;
}

// ==================== 15. 单词搜索 II ====================
// 题干：二维网格 board 和单词表 words，返回网格中出现的所有 words 中的单词。
// 输入：board: string[][], words: string[]
// 输出：string[]
// 约束：回溯 + Trie 剪枝

class TrieNode {
    constructor() { this.next = {}; this.word = null; }
}
function findWords(board, words) {
    const root = new TrieNode();
    for (const w of words) {
        let p = root;
        for (const c of w) { p = p.next[c] = p.next[c] || new TrieNode(); }
        p.word = w;
    }
    const res = [], R = board.length, C = board[0].length;
    const dfs = (r, c, node) => {
        if (r < 0 || r >= R || c < 0 || c >= C) return;
        const ch = board[r][c];
        const next = node.next[ch];
        if (!next) return;
        if (next.word) { res.push(next.word); next.word = null; }
        board[r][c] = '';
        dfs(r + 1, c, next); dfs(r - 1, c, next); dfs(r, c + 1, next); dfs(r, c - 1, next);
        board[r][c] = ch;
    };
    for (let r = 0; r < R; r++)
        for (let c = 0; c < C; c++) dfs(r, c, root);
    return res;
}

// ==================== 16. N 皇后 ====================
// 题干：n×n 棋盘放 n 个皇后，使任意两皇后不在同一行、列、对角线。返回所有方案。
// 输入：n: number
// 输出：string[][]
// 约束：回溯，每行放一个

function solveNQueens(n) {
    const res = [], cols = new Set(), d1 = new Set(), d2 = new Set();
    const board = Array(n).fill(0).map(() => Array(n).fill('.'));
    const dfs = (row) => {
        if (row === n) { res.push(board.map(r => r.join(''))); return; }
        for (let c = 0; c < n; c++) {
            if (cols.has(c) || d1.has(row - c) || d2.has(row + c)) continue;
            cols.add(c); d1.add(row - c); d2.add(row + c);
            board[row][c] = 'Q';
            dfs(row + 1);
            board[row][c] = '.'; cols.delete(c); d1.delete(row - c); d2.delete(row + c);
        }
    };
    dfs(0);
    return res;
}

// ==================== 17. N 皇后 II ====================
// 题干：同上，返回方案数。
// 输入：n: number
// 输出：number
// 约束：回溯，计数

function totalNQueens(n) {
    let count = 0;
    const cols = new Set(), d1 = new Set(), d2 = new Set();
    const dfs = (row) => {
        if (row === n) { count++; return; }
        for (let c = 0; c < n; c++) {
            if (cols.has(c) || d1.has(row - c) || d2.has(row + c)) continue;
            cols.add(c); d1.add(row - c); d2.add(row + c);
            dfs(row + 1);
            cols.delete(c); d1.delete(row - c); d2.delete(row + c);
        }
    };
    dfs(0);
    return count;
}

// ==================== 18. 解数独 ====================
// 题干：9×9 数独，空白格用 '.'，填入 1~9 使每行每列每 3×3 宫格不重复。
// 输入：board: string[][]（原地修改）
// 输出：无
// 约束：回溯

function solveSudoku(board) {
    const rows = Array(9).fill(0).map(() => new Set());
    const cols = Array(9).fill(0).map(() => new Set());
    const boxes = Array(9).fill(0).map(() => new Set());
    for (let r = 0; r < 9; r++)
        for (let c = 0; c < 9; c++) {
            const ch = board[r][c];
            if (ch === '.') continue;
            const b = (r / 3 | 0) * 3 + (c / 3 | 0);
            rows[r].add(ch); cols[c].add(ch); boxes[b].add(ch);
        }
    const dfs = () => {
        for (let r = 0; r < 9; r++)
            for (let c = 0; c < 9; c++) {
                if (board[r][c] !== '.') continue;
                const b = (r / 3 | 0) * 3 + (c / 3 | 0);
                for (let d = 1; d <= 9; d++) {
                    const ch = String(d);
                    if (rows[r].has(ch) || cols[c].has(ch) || boxes[b].has(ch)) continue;
                    board[r][c] = ch; rows[r].add(ch); cols[c].add(ch); boxes[b].add(ch);
                    if (dfs()) return true;
                    board[r][c] = '.'; rows[r].delete(ch); cols[c].delete(ch); boxes[b].delete(ch);
                }
                return false;
            }
        return true;
    };
    dfs();
}

// ==================== 19. 递增子序列 ====================
// 题干：整数数组 nums，找出所有不同的递增子序列，至少两个元素。
// 输入：nums: number[]
// 输出：number[][]
// 约束：回溯，不能排序（保持原序）

function findSubsequences(nums) {
    const res = [];
    const dfs = (start, path) => {
        if (path.length >= 2) res.push([...path]);
        const used = new Set();
        for (let i = start; i < nums.length; i++) {
            if (used.has(nums[i]) || (path.length && nums[i] < path[path.length - 1])) continue;
            used.add(nums[i]);
            path.push(nums[i]);
            dfs(i + 1, path);
            path.pop();
        }
    };
    dfs(0, []);
    return res;
}

// ==================== 20. 重新安排行程 ====================
// 题干：机票列表 tickets，每张 [from, to]，从 "JFK" 出发，返回字典序最小的行程。
// 输入：tickets: string[][]
// 输出：string[]
// 约束：回溯 + 欧拉路径（或 Hierholzer）

function findItinerary(tickets) {
    const g = {};
    for (const [from, to] of tickets) {
        if (!g[from]) g[from] = [];
        g[from].push(to);
    }
    for (const k of Object.keys(g)) g[k].sort();
    const path = [];
    const dfs = (cur) => {
        while (g[cur] && g[cur].length) dfs(g[cur].shift());
        path.unshift(cur);
    };
    dfs('JFK');
    return path;
}
