/**
 * 04172.js — 前端代码算法题 20 道（动态规划 · 二维 / 网格与子序列）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. uniquePaths(m, n)：从左上到右下路径数（只能右/下）。
function uniquePaths(m, n) {
  const dp = Array(n).fill(1);
  for (let i = 1; i < m; i += 1) {
    for (let j = 1; j < n; j += 1) dp[j] += dp[j - 1];
  }
  return dp[n - 1];
}

// 2. uniquePathsWithObstacles(grid)：1 障碍。
function uniquePathsWithObstacles(grid) {
  const m = grid.length;
  const n = grid[0].length;
  if (grid[0][0] === 1 || grid[m - 1][n - 1] === 1) return 0;
  const dp = Array(n).fill(0);
  dp[0] = grid[0][0] === 0 ? 1 : 0;
  for (let j = 1; j < n; j += 1) {
    dp[j] = grid[0][j] === 1 ? 0 : dp[j - 1];
  }
  for (let i = 1; i < m; i += 1) {
    if (grid[i][0] === 1) dp[0] = 0;
    for (let j = 1; j < n; j += 1) {
      if (grid[i][j] === 1) dp[j] = 0;
      else dp[j] += dp[j - 1];
    }
  }
  return dp[n - 1];
}

// 3. minPathSum(grid)：路径数字和最小。
function minPathSum(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const dp = Array(n).fill(Infinity);
  dp[0] = 0;
  for (let i = 0; i < m; i += 1) {
    dp[0] += grid[i][0];
    for (let j = 1; j < n; j += 1) {
      dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];
    }
  }
  return dp[n - 1];
}

// 4. longestCommonSubsequence(a, b)。
function longestCommonSubsequence(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array(n + 1).fill(0);
  for (let i = 1; i <= m; i += 1) {
    let prev = 0;
    for (let j = 1; j <= n; j += 1) {
      const tmp = dp[j];
      if (a[i - 1] === b[j - 1]) dp[j] = prev + 1;
      else dp[j] = Math.max(dp[j], dp[j - 1]);
      prev = tmp;
    }
  }
  return dp[n];
}

// 5. editDistance(word1, word2)。
function editDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i += 1) dp[i][0] = i;
  for (let j = 0; j <= n; j += 1) dp[0][j] = j;
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// 6. isInterleave(s1, s2, s3)。
function isInterleave(s1, s2, s3) {
  if (s1.length + s2.length !== s3.length) return false;
  const m = s1.length;
  const n = s2.length;
  const dp = Array(n + 1).fill(false);
  dp[0] = true;
  for (let j = 1; j <= n; j += 1) dp[j] = dp[j - 1] && s2[j - 1] === s3[j - 1];
  for (let i = 1; i <= m; i += 1) {
    dp[0] = dp[0] && s1[i - 1] === s3[i - 1];
    for (let j = 1; j <= n; j += 1) {
      const c = s3[i + j - 1];
      dp[j] = (dp[j] && s1[i - 1] === c) || (dp[j - 1] && s2[j - 1] === c);
    }
  }
  return dp[n];
}

// 7. maximalSquare(matrix)：全 1 正方形最大边长平方。
function maximalSquare(matrix) {
  if (!matrix.length) return 0;
  const m = matrix.length;
  const n = matrix[0].length;
  let ans = 0;
  const dp = Array(n + 1).fill(0);
  for (let i = 1; i <= m; i += 1) {
    let prev = 0;
    for (let j = 1; j <= n; j += 1) {
      const tmp = dp[j];
      if (matrix[i - 1][j - 1] === '1') {
        dp[j] = Math.min(dp[j], dp[j - 1], prev) + 1;
        ans = Math.max(ans, dp[j]);
      } else dp[j] = 0;
      prev = tmp;
    }
  }
  return ans * ans;
}

// 8. minimumDeleteSum(s1, s2)：删到相等的最小 ASCII 和。
function minimumDeleteSum(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let j = 1; j <= n; j += 1) dp[0][j] = dp[0][j - 1] + s2.charCodeAt(j - 1);
  for (let i = 1; i <= m; i += 1) {
    dp[i][0] = dp[i - 1][0] + s1.charCodeAt(i - 1);
    for (let j = 1; j <= n; j += 1) {
      if (s1[i - 1] === s2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + s1.charCodeAt(i - 1),
          dp[i][j - 1] + s2.charCodeAt(j - 1),
        );
      }
    }
  }
  return dp[m][n];
}

// 9. numDistinct(s, t)：s 子序列等于 t 的个数。
function numDistinct(s, t) {
  const m = s.length;
  const n = t.length;
  const dp = Array(n + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= m; i += 1) {
    for (let j = n; j >= 1; j -= 1) {
      if (s[i - 1] === t[j - 1]) dp[j] += dp[j - 1];
    }
  }
  return dp[n];
}

// 10. longestPalindromeSubseq(s)。
function longestPalindromeSubseq(s) {
  const n = s.length;
  const dp = Array(n).fill(1);
  for (let i = n - 2; i >= 0; i -= 1) {
    let prev = 0;
    for (let j = i + 1; j < n; j += 1) {
      const tmp = dp[j];
      if (s[i] === s[j]) dp[j] = prev + 2;
      else dp[j] = Math.max(dp[j], dp[j - 1]);
      prev = tmp;
    }
  }
  return n ? dp[n - 1] : 0;
}

// 11. isMatchRegex(s, p)：支持 . 和 *。
function isMatchRegex(s, p) {
  const m = s.length;
  const n = p.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 2; j <= n; j += 1) {
    if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2];
  }
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (p[j - 1] === '*') {
        dp[i][j] = dp[i][j - 2];
        if (p[j - 2] === '.' || p[j - 2] === s[i - 1]) dp[i][j] = dp[i][j] || dp[i - 1][j];
      } else if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }
  return dp[m][n];
}

// 12. isMatchWildcard(s, p)：? 单字符 * 任意串。
function isMatchWildcard(s, p) {
  const m = s.length;
  const n = p.length;
  const dp = Array(n + 1).fill(false);
  dp[0] = true;
  for (let j = 1; j <= n; j += 1) {
    if (p[j - 1] === '*') dp[j] = dp[j - 1];
  }
  for (let i = 1; i <= m; i += 1) {
    let prev = dp[0];
    dp[0] = false;
    for (let j = 1; j <= n; j += 1) {
      const cur = dp[j];
      if (p[j - 1] === '*') {
        dp[j] = dp[j] || dp[j - 1] || prev;
      } else if (p[j - 1] === '?' || p[j - 1] === s[i - 1]) {
        dp[j] = prev;
      } else dp[j] = false;
      prev = cur;
    }
  }
  return dp[n];
}

// 13. maxUncrossedLines(A, B)：等价两序列 LCS 长度。
function maxUncrossedLines(A, B) {
  const m = A.length;
  const n = B.length;
  const dp = Array(n + 1).fill(0);
  for (let i = 1; i <= m; i += 1) {
    let prev = 0;
    for (let j = 1; j <= n; j += 1) {
      const tmp = dp[j];
      if (A[i - 1] === B[j - 1]) dp[j] = prev + 1;
      else dp[j] = Math.max(dp[j], dp[j - 1]);
      prev = tmp;
    }
  }
  return dp[n];
}

// 14. minInsertionsPalindrome(s)：插入最少字符使成回文（n − 最长回文子序列长）。
function minInsertionsPalindrome(s) {
  const n = s.length;
  if (!n) return 0;
  return n - longestPalindromeSubseq(s);
}

// 15. longestIncreasingPath(matrix)：严格递增最长路径（记忆化 DFS）。
function longestIncreasingPath(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  const memo = Array.from({ length: m }, () => Array(n).fill(0));
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const dfs = (i, j) => {
    if (memo[i][j]) return memo[i][j];
    let best = 1;
    for (const [di, dj] of dirs) {
      const ni = i + di;
      const nj = j + dj;
      if (ni >= 0 && ni < m && nj >= 0 && nj < n && matrix[ni][nj] > matrix[i][j]) {
        best = Math.max(best, 1 + dfs(ni, nj));
      }
    }
    memo[i][j] = best;
    return best;
  };
  let ans = 0;
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) ans = Math.max(ans, dfs(i, j));
  }
  return ans;
}

// 16. minFallingPathSum(matrix)：相邻列 ±1。
function minFallingPathSum(matrix) {
  const n = matrix.length;
  const dp = matrix[0].slice();
  for (let i = 1; i < n; i += 1) {
    const next = Array(n).fill(Infinity);
    for (let j = 0; j < n; j += 1) {
      for (const dj of [-1, 0, 1]) {
        const k = j + dj;
        if (k >= 0 && k < n) next[j] = Math.min(next[j], dp[k] + matrix[i][j]);
      }
    }
    for (let j = 0; j < n; j += 1) dp[j] = next[j];
  }
  return Math.min(...dp);
}

// 17. countSquareSubmatrices(matrix)：全 1 正方形子矩阵个数。
function countSquareSubmatrices(matrix) {
  if (!matrix.length) return 0;
  const m = matrix.length;
  const n = matrix[0].length;
  let ans = 0;
  const dp = Array(n + 1).fill(0);
  for (let i = 1; i <= m; i += 1) {
    let prev = 0;
    for (let j = 1; j <= n; j += 1) {
      const tmp = dp[j];
      if (matrix[i - 1][j - 1] === 1) {
        dp[j] = Math.min(dp[j], dp[j - 1], prev) + 1;
        ans += dp[j];
      } else dp[j] = 0;
      prev = tmp;
    }
  }
  return ans;
}

// 18. cherryPickup(grid)：两人从左上到右下摘樱桃最大（返回 0 若无路径）。
function cherryPickup(grid) {
  const n = grid.length;
  const memo = new Map();
  const key = (r1, c1, c2) => `${r1},${c1},${c2}`;
  const dfs = (r1, c1, c2) => {
    const r2 = r1 + c1 - c2;
    if (r1 >= n || c1 >= n || r2 >= n || c2 >= n) return -Infinity;
    if (grid[r1][c1] === -1 || grid[r2][c2] === -1) return -Infinity;
    if (r1 === n - 1 && c1 === n - 1) return grid[r1][c1];
    const k = key(r1, c1, c2);
    if (memo.has(k)) return memo.get(k);
    let ans = grid[r1][c1];
    if (c1 !== c2) ans += grid[r2][c2];
    ans += Math.max(
      dfs(r1 + 1, c1, c2 + 1),
      dfs(r1 + 1, c1, c2),
      dfs(r1, c1 + 1, c2 + 1),
      dfs(r1, c1 + 1, c2),
    );
    memo.set(k, ans);
    return ans;
  };
  const res = dfs(0, 0, 0);
  return res < 0 ? 0 : res;
}

// 19. minimumTotal(triangle)：自顶向下最小路径和（三角形数组）。
function minimumTotal(triangle) {
  if (!triangle.length) return 0;
  let dp = triangle[triangle.length - 1].slice();
  for (let r = triangle.length - 2; r >= 0; r -= 1) {
    const row = triangle[r];
    const next = [];
    for (let j = 0; j < row.length; j += 1) {
      next[j] = row[j] + Math.min(dp[j], dp[j + 1]);
    }
    dp = next;
  }
  return dp[0];
}

// 20. splitArray(nums, m)：m 段，最小化各段和最大值。
function splitArray(nums, m) {
  let lo = Math.max(...nums);
  let hi = nums.reduce((a, b) => a + b, 0);
  const ok = (mx) => {
    let parts = 1;
    let sum = 0;
    for (const x of nums) {
      if (sum + x > mx) {
        parts += 1;
        sum = x;
      } else sum += x;
    }
    return parts <= m;
  };
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (ok(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

module.exports = {
  uniquePaths,
  uniquePathsWithObstacles,
  minPathSum,
  longestCommonSubsequence,
  editDistance,
  isInterleave,
  maximalSquare,
  minimumDeleteSum,
  numDistinct,
  longestPalindromeSubseq,
  isMatchRegex,
  isMatchWildcard,
  maxUncrossedLines,
  minInsertionsPalindrome,
  longestIncreasingPath,
  minFallingPathSum,
  countSquareSubmatrices,
  cherryPickup,
  minimumTotal,
  splitArray,
};
