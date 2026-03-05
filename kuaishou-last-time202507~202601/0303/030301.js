/**
 * 030301 面试算法题（20 道）- 专题：回溯与组合
 * 日期：2026-03-03
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 全排列 ====================
function permute(nums) {
    const res = [];
    const dfs = (path, used) => {
        if (path.length === nums.length) { res.push([...path]); return; }
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.push(nums[i]);
            dfs(path, used);
            path.pop();
            used[i] = false;
        }
    };
    dfs([], []);
    return res;
}

// ==================== 2. 全排列 II（含重复） ====================
function permuteUnique(nums) {
    nums.sort((a, b) => a - b);
    const res = [];
    const dfs = (path, used) => {
        if (path.length === nums.length) { res.push([...path]); return; }
        for (let i = 0; i < nums.length; i++) {
            if (used[i] || (i > 0 && nums[i] === nums[i - 1] && !used[i - 1])) continue;
            used[i] = true;
            path.push(nums[i]);
            dfs(path, used);
            path.pop();
            used[i] = false;
        }
    };
    dfs([], []);
    return res;
}

// ==================== 3. 组合 ====================
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

// ==================== 5. 组合总和 II（每个只能用一次） ====================
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

// ==================== 6. 子集 ====================
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

// ==================== 7. 子集 II（含重复） ====================
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

// ==================== 8. 括号生成 ====================
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

// ==================== 9. 电话号码的字母组合 ====================
function letterCombinations(digits) {
    if (!digits) return [];
    const map = { '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz' };
    const res = [];
    const dfs = (i, s) => {
        if (i === digits.length) { res.push(s); return; }
        for (const c of map[digits[i]] || '') dfs(i + 1, s + c);
    };
    dfs(0, '');
    return res;
}

// ==================== 10. 分割回文串 ====================
function partition(s) {
    const res = [];
    const isPal = (l, r) => { while (l < r) if (s[l++] !== s[r--]) return false; return true; };
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

// ==================== 11. 复原 IP 地址 ====================
function restoreIpAddresses(s) {
    const res = [];
    const dfs = (start, path) => {
        if (path.length === 4) {
            if (start === s.length) res.push(path.join('.'));
            return;
        }
        for (let len = 1; len <= 3 && start + len <= s.length; len++) {
            const seg = s.slice(start, start + len);
            if ((seg[0] === '0' && len > 1) || parseInt(seg, 10) > 255) continue;
            path.push(seg);
            dfs(start + len, path);
            path.pop();
        }
    };
    dfs(0, []);
    return res;
}

// ==================== 12. 单词搜索 ====================
function exist(board, word) {
    const m = board.length, n = board[0].length;
    const dfs = (i, j, k) => {
        if (k === word.length) return true;
        if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== word[k]) return false;
        const c = board[i][j];
        board[i][j] = '';
        const ok = dfs(i + 1, j, k + 1) || dfs(i - 1, j, k + 1) || dfs(i, j + 1, k + 1) || dfs(i, j - 1, k + 1);
        board[i][j] = c;
        return ok;
    };
    for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
            if (dfs(i, j, 0)) return true;
    return false;
}

// ==================== 13.  N 皇后 ====================
function solveNQueens(n) {
    const res = [];
    const cols = new Set(), diag1 = new Set(), diag2 = new Set();
    const board = Array(n).fill(null).map(() => Array(n).fill('.'));
    const dfs = (row) => {
        if (row === n) { res.push(board.map(r => r.join(''))); return; }
        for (let col = 0; col < n; col++) {
            if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) continue;
            cols.add(col); diag1.add(row - col); diag2.add(row + col);
            board[row][col] = 'Q';
            dfs(row + 1);
            board[row][col] = '.';
            cols.delete(col); diag1.delete(row - col); diag2.delete(row + col);
        }
    };
    dfs(0);
    return res;
}

// ==================== 14. N 皇后 II ====================
function totalNQueens(n) {
    return solveNQueens(n).length;
}

// ==================== 15. 解数独 ====================
function solveSudoku(board) {
    const box = (r, c) => 3 * ((r / 3) | 0) + ((c / 3) | 0);
    const rows = Array(9).fill(0).map(() => new Set());
    const cols = Array(9).fill(0).map(() => new Set());
    const boxes = Array(9).fill(0).map(() => new Set());
    for (let i = 0; i < 9; i++)
        for (let j = 0; j < 9; j++) {
            const c = board[i][j];
            if (c !== '.') { rows[i].add(c); cols[j].add(c); boxes[box(i, j)].add(c); }
        }
    const dfs = () => {
        for (let i = 0; i < 9; i++)
            for (let j = 0; j < 9; j++) {
                if (board[i][j] !== '.') continue;
                for (let d = 1; d <= 9; d++) {
                    const ch = String(d);
                    if (rows[i].has(ch) || cols[j].has(ch) || boxes[box(i, j)].has(ch)) continue;
                    board[i][j] = ch;
                    rows[i].add(ch); cols[j].add(ch); boxes[box(i, j)].add(ch);
                    if (dfs()) return true;
                    board[i][j] = '.';
                    rows[i].delete(ch); cols[j].delete(ch); boxes[box(i, j)].delete(ch);
                }
                return false;
            }
        return true;
    };
    dfs();
}

// ==================== 16. 递增子序列 ====================
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

// ==================== 17. 重新安排行程 ====================
function findItinerary(tickets) {
    const g = {};
    for (const [from, to] of tickets) {
        if (!g[from]) g[from] = [];
        g[from].push(to);
    }
    for (const k of Object.keys(g)) g[k].sort();
    const res = [];
    const dfs = (cur) => {
        while (g[cur] && g[cur].length) dfs(g[cur].shift());
        res.unshift(cur);
    };
    dfs('JFK');
    return res;
}

// ==================== 18. 二进制手表 ====================
function readBinaryWatch(turnedOn) {
    const res = [];
    const count = (n) => n.toString(2).split('0').join('').length;
    for (let h = 0; h < 12; h++)
        for (let m = 0; m < 60; m++)
            if (count(h) + count(m) === turnedOn) res.push(`${h}:${m < 10 ? '0' + m : m}`);
    return res;
}

// ==================== 19. 累加数 ====================
function isAdditiveNumber(num) {
    const n = num.length;
    const dfs = (i, a, b) => {
        if (i === n) return true;
        const sum = String(BigInt(a) + BigInt(b));
        if (num.slice(i, i + sum.length) !== sum) return false;
        return dfs(i + sum.length, b, sum);
    };
    for (let i = 1; i <= (n - 1) >> 1; i++) {
        if (num[0] === '0' && i > 1) break;
        const a = num.slice(0, i);
        for (let j = 1; Math.max(i, j) <= n - i - j; j++) {
            if (num[i] === '0' && j > 1) break;
            const b = num.slice(i, i + j);
            if (dfs(i + j, a, b)) return true;
        }
    }
    return false;
}

// ==================== 20. 划分为k个相等的子集 ====================
function canPartitionKSubsets(nums, k) {
    const sum = nums.reduce((a, b) => a + b, 0);
    if (sum % k) return false;
    const target = sum / k;
    nums.sort((a, b) => b - a);
    if (nums[0] > target) return false;
    const used = new Array(nums.length).fill(false);
    const dfs = (start, cur, cnt) => {
        if (cnt === k) return true;
        if (cur === target) return dfs(0, 0, cnt + 1);
        for (let i = start; i < nums.length; i++) {
            if (used[i] || cur + nums[i] > target) continue;
            used[i] = true;
            if (dfs(i + 1, cur + nums[i], cnt)) return true;
            used[i] = false;
        }
        return false;
    };
    return dfs(0, 0, 0);
}

// ==================== 测试 ====================
function test030301() {
    const assert = (name, got, expect) => {
        const ok = JSON.stringify(got) === JSON.stringify(expect);
        console.log(ok ? `[OK] ${name}` : `[FAIL] ${name} got=${JSON.stringify(got)} expect=${JSON.stringify(expect)}`);
    };
    assert('1. permute', permute([1, 2, 3]).length, 6);
    assert('2. permuteUnique', permuteUnique([1, 1, 2]).length, 3);
    assert('3. combine', combine(4, 2).length, 6);
    assert('4. combinationSum', combinationSum([2, 3, 6, 7], 7).length, 2);
    assert('5. combinationSum2', combinationSum2([10, 1, 2, 7, 6, 1, 5], 8).length, 4);
    assert('6. subsets', subsets([1, 2, 3]).length, 8);
    assert('7. subsetsWithDup', subsetsWithDup([1, 2, 2]).length, 6);
    assert('8. generateParenthesis', generateParenthesis(3).length, 5);
    assert('9. letterCombinations', letterCombinations('23').length, 9);
    assert('10. partition', partition('aab').length, 2);
    assert('11. restoreIpAddresses', restoreIpAddresses('25525511135').length, 2);
    assert('12. exist', exist([['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'ABCCED'), true);
    assert('13. solveNQueens', solveNQueens(4).length, 2);
    assert('14. totalNQueens', totalNQueens(4), 2);
    assert('16. findSubsequences', findSubsequences([4, 6, 7, 7]).length, 8);
    assert('18. readBinaryWatch', readBinaryWatch(1).length, 10);
    assert('19. isAdditiveNumber', isAdditiveNumber('112358'), true);
    assert('20. canPartitionKSubsets', canPartitionKSubsets([4, 3, 2, 3, 5, 2, 1], 4), true);
    console.log('030301 tests done.');
}
test030301();
