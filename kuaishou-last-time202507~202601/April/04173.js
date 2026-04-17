/**
 * 04173.js — 前端代码算法题 20 道（回溯 / 组合 · 排列 · 图上的 DFS）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. subsets(nums)：幂集。
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

// 2. subsetsWithDup(nums)：含重复元素，结果不重复。
function subsetsWithDup(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  const path = [];
  const dfs = (start) => {
    res.push(path.slice());
    for (let i = start; i < nums.length; i += 1) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      path.push(nums[i]);
      dfs(i + 1);
      path.pop();
    }
  };
  dfs(0);
  return res;
}

// 3. combinationSum(candidates, target)：无重复数字，可无限选，和为 target。
function combinationSum(candidates, target) {
  const res = [];
  const path = [];
  const dfs = (start, t) => {
    if (t === 0) {
      res.push(path.slice());
      return;
    }
    if (t < 0) return;
    for (let i = start; i < candidates.length; i += 1) {
      path.push(candidates[i]);
      dfs(i, t - candidates[i]);
      path.pop();
    }
  };
  dfs(0, target);
  return res;
}

// 4. combinationSum2(candidates, target)：每个数字用一次，结果不重复。
function combinationSum2(candidates, target) {
  candidates.sort((a, b) => a - b);
  const res = [];
  const path = [];
  const dfs = (start, t) => {
    if (t === 0) {
      res.push(path.slice());
      return;
    }
    for (let i = start; i < candidates.length; i += 1) {
      if (i > start && candidates[i] === candidates[i - 1]) continue;
      if (candidates[i] > t) break;
      path.push(candidates[i]);
      dfs(i + 1, t - candidates[i]);
      path.pop();
    }
  };
  dfs(0, target);
  return res;
}

// 5. permute(nums)：全排列。
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

// 6. permuteUnique(nums)：含重复，排列不重复。
function permuteUnique(nums) {
  nums.sort((a, b) => a - b);
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
      if (i > 0 && nums[i] === nums[i - 1] && !used[i - 1]) continue;
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

// 7. solveNQueens(n)：N 皇后所有解（'.' 与 'Q'）。
function solveNQueens(n) {
  const res = [];
  const cols = new Set();
  const diag1 = new Set();
  const diag2 = new Set();
  const board = Array.from({ length: n }, () => Array(n).fill('.'));
  const dfs = (r) => {
    if (r === n) {
      res.push(board.map((row) => row.join('')));
      return;
    }
    for (let c = 0; c < n; c += 1) {
      const d1 = r - c;
      const d2 = r + c;
      if (cols.has(c) || diag1.has(d1) || diag2.has(d2)) continue;
      cols.add(c);
      diag1.add(d1);
      diag2.add(d2);
      board[r][c] = 'Q';
      dfs(r + 1);
      board[r][c] = '.';
      cols.delete(c);
      diag1.delete(d1);
      diag2.delete(d2);
    }
  };
  dfs(0);
  return res;
}

// 8. totalNQueens(n)：解的个数。
function totalNQueens(n) {
  let ans = 0;
  const cols = new Set();
  const d1 = new Set();
  const d2 = new Set();
  const dfs = (r) => {
    if (r === n) {
      ans += 1;
      return;
    }
    for (let c = 0; c < n; c += 1) {
      const x = r - c;
      const y = r + c;
      if (cols.has(c) || d1.has(x) || d2.has(y)) continue;
      cols.add(c);
      d1.add(x);
      d2.add(y);
      dfs(r + 1);
      cols.delete(c);
      d1.delete(x);
      d2.delete(y);
    }
  };
  dfs(0);
  return ans;
}

// 9. partition(s)：切分字符串使每段都是回文，所有方案。
function partition(s) {
  const res = [];
  const path = [];
  const isPal = (i, j) => {
    while (i < j) {
      if (s[i] !== s[j]) return false;
      i += 1;
      j -= 1;
    }
    return true;
  };
  const dfs = (start) => {
    if (start === s.length) {
      res.push(path.slice());
      return;
    }
    for (let end = start; end < s.length; end += 1) {
      if (!isPal(start, end)) continue;
      path.push(s.slice(start, end + 1));
      dfs(end + 1);
      path.pop();
    }
  };
  dfs(0);
  return res;
}

// 10. exist(board, word)：网格搜词（字母不可重用同一格）。
function exist(board, word) {
  const m = board.length;
  const n = board[0].length;
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const dfs = (i, j, k) => {
    if (k === word.length) return true;
    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== word[k]) return false;
    const tmp = board[i][j];
    board[i][j] = '#';
    for (const [di, dj] of dirs) {
      if (dfs(i + di, j + dj, k + 1)) {
        board[i][j] = tmp;
        return true;
      }
    }
    board[i][j] = tmp;
    return false;
  };
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (dfs(i, j, 0)) return true;
    }
  }
  return false;
}

// 11. generateParenthesis(n)：n 对合法括号。
function generateParenthesis(n) {
  const res = [];
  const dfs = (open, close, cur) => {
    if (cur.length === 2 * n) {
      res.push(cur);
      return;
    }
    if (open < n) dfs(open + 1, close, `${cur}(`);
    if (close < open) dfs(open, close + 1, `${cur})`);
  };
  dfs(0, 0, '');
  return res;
}

// 12. letterCombinations(digits)：电话键盘字母组合。
function letterCombinations(digits) {
  if (!digits) return [];
  const map = ['', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz'];
  const res = [];
  const dfs = (i, path) => {
    if (i === digits.length) {
      res.push(path);
      return;
    }
    const letters = map[+digits[i]];
    for (const ch of letters) dfs(i + 1, path + ch);
  };
  dfs(0, '');
  return res;
}

// 13. combine(n, k)：1..n 中取 k 个数的组合。
function combine(n, k) {
  const res = [];
  const path = [];
  const dfs = (start) => {
    if (path.length === k) {
      res.push(path.slice());
      return;
    }
    for (let i = start; i <= n; i += 1) {
      path.push(i);
      dfs(i + 1);
      path.pop();
    }
  };
  dfs(1);
  return res;
}

// 14. restoreIpAddresses(s)：还原 IP 地址段。
function restoreIpAddresses(s) {
  const res = [];
  const path = [];
  const dfs = (start, parts) => {
    if (parts === 4) {
      if (start === s.length) res.push(path.join('.'));
      return;
    }
    for (let len = 1; len <= 3; len += 1) {
      if (start + len > s.length) break;
      const seg = s.slice(start, start + len);
      if (seg.length > 1 && seg[0] === '0') break;
      if (+seg > 255) break;
      path.push(seg);
      dfs(start + len, parts + 1);
      path.pop();
    }
  };
  dfs(0, 0);
  return res;
}

// 15. readBinaryWatch(turnedOn)：亮灯数能表示的时间列表（简化：返回 [ "h:m" ] 数量可接受时用穷举）。
function readBinaryWatch(turnedOn) {
  const res = [];
  for (let h = 0; h < 12; h += 1) {
    for (let m = 0; m < 60; m += 1) {
      if (bitCount(h) + bitCount(m) === turnedOn) {
        res.push(`${h}:${m < 10 ? `0${m}` : m}`);
      }
    }
  }
  return res;
}
function bitCount(x) {
  let c = 0;
  for (; x; x &= x - 1) c += 1;
  return c;
}

// 16. findWords(board, words)：`Trie + 回溯` 简化版 — 多词搜索（返回字典中可在盘中找到的单词）。
function findWords(board, words) {
  const root = {};
  for (const w of words) {
    let node = root;
    for (const ch of w) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node._w = w;
  }
  const m = board.length;
  const n = board[0].length;
  const res = [];
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const dfs = (i, j, node) => {
    const ch = board[i][j];
    if (!node[ch]) return;
    const next = node[ch];
    if (next._w) {
      res.push(next._w);
      delete next._w;
    }
    board[i][j] = '#';
    for (const [di, dj] of dirs) {
      const ni = i + di;
      const nj = j + dj;
      if (ni >= 0 && ni < m && nj >= 0 && nj < n && board[ni][nj] !== '#') dfs(ni, nj, next);
    }
    board[i][j] = ch;
  };
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) dfs(i, j, root);
  }
  return res;
}

// 17. numsSameConsecDiff(n, k)：n 位数相邻位数字差为 k 的所有数（不含前导零）。
function numsSameConsecDiff(n, k) {
  if (n === 1) return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const res = [];
  const dfs = (cur, len) => {
    if (len === n) {
      res.push(cur);
      return;
    }
    const d = cur % 10;
    if (d + k <= 9) dfs(cur * 10 + d + k, len + 1);
    if (k !== 0 && d - k >= 0) dfs(cur * 10 + d - k, len + 1);
  };
  for (let d = 1; d <= 9; d += 1) dfs(d, 1);
  return res;
}

// 18. splitIntoFibonacci(S)：拆成斐波那契式数字序列（回溯），无则 []。
function splitIntoFibonacci(S) {
  const res = [];
  const n = S.length;
  const dfs = (start) => {
    if (start === n) return res.length >= 3;
    let x = 0;
    for (let i = start; i < n; i += 1) {
      if (i > start && S[start] === '0') break;
      x = x * 10 + (+S[i]);
      if (x > 2 ** 31 - 1) break;
      const sz = res.length;
      if (sz >= 2 && x < res[sz - 1] + res[sz - 2]) continue;
      if (sz <= 1 || x === res[sz - 1] + res[sz - 2]) {
        res.push(x);
        if (dfs(i + 1)) return true;
        res.pop();
      }
      if (sz >= 2 && x > res[sz - 1] + res[sz - 2]) break;
    }
    return false;
  };
  dfs(0);
  return res;
}

// 19. numTilePossibilities(tiles)：字母牌可重复选取拼成的不同非空序列个数。
function numTilePossibilities(tiles) {
  const cnt = {};
  for (const ch of tiles) cnt[ch] = (cnt[ch] || 0) + 1;
  let ans = 0;
  const dfs = () => {
    for (const ch of Object.keys(cnt)) {
      if (cnt[ch] === 0) continue;
      cnt[ch] -= 1;
      ans += 1;
      dfs();
      cnt[ch] += 1;
    }
  };
  dfs();
  return ans;
}

// 20. beautifulSubsets(nums, k)：子集元素两两差不为 k 的个数（含空集是否视题意；此处LeetCode 2597：不含空集、子集非空）。
function beautifulSubsets(nums, k) {
  nums.sort((a, b) => a - b);
  let ans = 0;
  const path = [];
  const dfs = (start) => {
    if (path.length) ans += 1;
    for (let i = start; i < nums.length; i += 1) {
      let ok = true;
      for (const p of path) {
        if (Math.abs(nums[i] - p) === k) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      path.push(nums[i]);
      dfs(i + 1);
      path.pop();
    }
  };
  dfs(0);
  return ans;
}

module.exports = {
  subsets,
  subsetsWithDup,
  combinationSum,
  combinationSum2,
  permute,
  permuteUnique,
  solveNQueens,
  totalNQueens,
  partition,
  exist,
  generateParenthesis,
  letterCombinations,
  combine,
  restoreIpAddresses,
  readBinaryWatch,
  findWords,
  numsSameConsecDiff,
  splitIntoFibonacci,
  numTilePossibilities,
  beautifulSubsets,
};
