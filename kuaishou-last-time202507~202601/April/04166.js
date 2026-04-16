/**
 * 04166.js — 前端代码算法题 20 道（字符串 DP / 子序列 / 编辑距离）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. longestCommonSubsequence(text1, text2)：最长公共子序列长度。
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

// 2. minDistance(word1, word2)：编辑距离。
function minDistance(word1, word2) {
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

// 3. longestPalindromeSubseq(s)：最长回文子序列。
function longestPalindromeSubseq(s) {
  const n = s.length;
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = n - 1; i >= 0; i -= 1) {
    dp[i][i] = 1;
    for (let j = i + 1; j < n; j += 1) {
      if (s[i] === s[j]) dp[i][j] = dp[i + 1][j - 1] + 2;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
    }
  }
  return dp[0][n - 1];
}

// 4. minInsertions(s)：变为回文的最少插入次数。
function minInsertions(s) {
  const n = s.length;
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  for (let len = 2; len <= n; len += 1) {
    for (let i = 0; i + len - 1 < n; i += 1) {
      const j = i + len - 1;
      if (s[i] === s[j]) dp[i][j] = dp[i + 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i + 1][j], dp[i][j - 1]);
    }
  }
  return dp[0][n - 1];
}

// 5. isInterleave(s1, s2, s3)：是否交错组成。
function isInterleave(s1, s2, s3) {
  const m = s1.length;
  const n = s2.length;
  if (m + n !== s3.length) return false;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let i = 1; i <= m; i += 1) dp[i][0] = dp[i - 1][0] && s1[i - 1] === s3[i - 1];
  for (let j = 1; j <= n; j += 1) dp[0][j] = dp[0][j - 1] && s2[j - 1] === s3[j - 1];
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      const k = i + j - 1;
      dp[i][j] =
        (dp[i - 1][j] && s1[i - 1] === s3[k]) || (dp[i][j - 1] && s2[j - 1] === s3[k]);
    }
  }
  return dp[m][n];
}

// 6. distinctSubsequences(s, t)：t 作为 s 子序列出现次数。
function distinctSubsequences(s, t) {
  const m = s.length;
  const n = t.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i += 1) dp[i][0] = 1;
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      dp[i][j] = dp[i - 1][j];
      if (s[i - 1] === t[j - 1]) dp[i][j] += dp[i - 1][j - 1];
    }
  }
  return dp[m][n];
}

// 7. maxDotProduct(nums1, nums2)：正数最大点积子序列。
function maxDotProduct(nums1, nums2) {
  const m = nums1.length;
  const n = nums2.length;
  const dp = Array.from({ length: m }, () => Array(n).fill(-Infinity));
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      const p = nums1[i] * nums2[j];
      dp[i][j] = p;
      if (i > 0) dp[i][j] = Math.max(dp[i][j], dp[i - 1][j]);
      if (j > 0) dp[i][j] = Math.max(dp[i][j], dp[i][j - 1]);
      if (i > 0 && j > 0) dp[i][j] = Math.max(dp[i][j], dp[i - 1][j - 1] + p);
      if (i > 0 && j > 0) dp[i][j] = Math.max(dp[i][j], dp[i - 1][j - 1]);
    }
  }
  return dp[m - 1][n - 1];
}

// 8. longestRepeatingSubsequence(s)：最长重复子序列（i≠j）。
function longestRepeatingSubsequence(s) {
  const n = s.length;
  const dp = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= n; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (s[i - 1] === s[j - 1] && i !== j) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[n][n];
}

// 9. minimumDeleteSum(s1, s2)：使相等的最小 ASCII 删除和。
function minimumDeleteSum(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i += 1) dp[i][0] = dp[i - 1][0] + s1.charCodeAt(i - 1);
  for (let j = 1; j <= n; j += 1) dp[0][j] = dp[0][j - 1] + s2.charCodeAt(j - 1);
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (s1[i - 1] === s2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else
        dp[i][j] = Math.min(
          dp[i - 1][j] + s1.charCodeAt(i - 1),
          dp[i][j - 1] + s2.charCodeAt(j - 1),
        );
    }
  }
  return dp[m][n];
}

// 10. longestCommonSubstring(text1, text2)：最长公共子串长度。
function longestCommonSubstring(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  let ans = 0;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        ans = Math.max(ans, dp[i][j]);
      }
    }
  }
  return ans;
}

// 11. countPalindromicSubsequences(S)：不同回文子序列个数 mod 1e9+7。
function countPalindromicSubsequences(S) {
  const mod = 1e9 + 7;
  const n = S.length;
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i += 1) dp[i][i] = 1;
  for (let len = 2; len <= n; len += 1) {
    for (let i = 0; i + len - 1 < n; i += 1) {
      const j = i + len - 1;
      if (S[i] === S[j]) {
        let l = i + 1;
        let r = j - 1;
        while (l <= r && S[l] !== S[i]) l += 1;
        while (l <= r && S[r] !== S[j]) r -= 1;
        if (l > r) dp[i][j] = (dp[i + 1][j - 1] * 2 + 2) % mod;
        else if (l === r) dp[i][j] = (dp[i + 1][j - 1] * 2 + 1) % mod;
        else dp[i][j] = (dp[i + 1][j - 1] * 2 - dp[l + 1][r - 1] + mod) % mod;
      } else {
        dp[i][j] = (dp[i + 1][j] + dp[i][j - 1] - dp[i + 1][j - 1] + mod) % mod;
      }
    }
  }
  return dp[0][n - 1];
}

// 12. regularExpressionMatch(s, p)：正则 . *。
function regularExpressionMatch(s, p) {
  const m = s.length;
  const n = p.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 2; j <= n; j += 1) if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2];
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (p[j - 1] === '*') {
        dp[i][j] = dp[i][j - 2];
        if (p[j - 2] === '.' || p[j - 2] === s[i - 1]) dp[i][j] = dp[i][j] || dp[i - 1][j];
      } else if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) dp[i][j] = dp[i - 1][j - 1];
    }
  }
  return dp[m][n];
}

// 13. isMatch(s, p)：通配符 ? *。
function isMatch(s, p) {
  const m = s.length;
  const n = p.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= n; j += 1) if (p[j - 1] === '*') dp[0][j] = dp[0][j - 1];
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (p[j - 1] === '*') dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
      else if (p[j - 1] === '?' || p[j - 1] === s[i - 1]) dp[i][j] = dp[i - 1][j - 1];
    }
  }
  return dp[m][n];
}

// 14. palindromePartition(s)：分割成回文子串的最少刀数（最少段数 −1）。
function palindromePartition(s) {
  const n = s.length;
  const isPal = Array.from({ length: n }, () => Array(n).fill(false));
  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = i; j < n; j += 1) {
      isPal[i][j] = s[i] === s[j] && (j - i < 2 || isPal[i + 1][j - 1]);
    }
  }
  const dp = Array(n).fill(0);
  for (let j = 0; j < n; j += 1) {
    if (isPal[0][j]) dp[j] = 0;
    else {
      dp[j] = j;
      for (let i = 0; i < j; i += 1) {
        if (isPal[i + 1][j]) dp[j] = Math.min(dp[j], dp[i] + 1);
      }
    }
  }
  return dp[n - 1];
}

// 15. longestPalindrome(s)：可重排的最长回文长度。
function longestPalindrome(s) {
  const cnt = new Map();
  for (const c of s) cnt.set(c, (cnt.get(c) || 0) + 1);
  let ans = 0;
  let odd = 0;
  for (const v of cnt.values()) {
    ans += v - (v & 1);
    odd |= v & 1;
  }
  return ans + odd;
}

// 16. shortestPalindrome(s)：最短回文前缀补全。
function shortestPalindrome(s) {
  const rev = [...s].reverse().join('');
  const comb = `${s}#${rev}`;
  const lps = Array(comb.length).fill(0);
  for (let i = 1; i < comb.length; i += 1) {
    let j = lps[i - 1];
    while (j > 0 && comb[i] !== comb[j]) j = lps[j - 1];
    if (comb[i] === comb[j]) j += 1;
    lps[i] = j;
  }
  return rev.slice(0, s.length - lps[comb.length - 1]) + s;
}

// 17. strStr(haystack, needle)：KMP 找首位置。
function strStr(haystack, needle) {
  if (!needle.length) return 0;
  const lps = Array(needle.length).fill(0);
  for (let i = 1; i < needle.length; i += 1) {
    let j = lps[i - 1];
    while (j > 0 && needle[i] !== needle[j]) j = lps[j - 1];
    if (needle[i] === needle[j]) j += 1;
    lps[i] = j;
  }
  for (let i = 0, j = 0; i < haystack.length; i += 1) {
    while (j > 0 && haystack[i] !== needle[j]) j = lps[j - 1];
    if (haystack[i] === needle[j]) j += 1;
    if (j === needle.length) return i - needle.length + 1;
  }
  return -1;
}

// 18. numDistinct(s, t)：与 distinctSubsequences 同义。
function numDistinct(s, t) {
  return distinctSubsequences(s, t);
}

// 19. longestIncreasingSubsequence(nums)：LIS 长度 O(n log n)。
function longestIncreasingSubsequence(nums) {
  const tails = [];
  for (const x of nums) {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const m = (lo + hi) >> 1;
      if (tails[m] < x) lo = m + 1;
      else hi = m;
    }
    if (lo === tails.length) tails.push(x);
    else tails[lo] = x;
  }
  return tails.length;
}

// 20. maxUncrossedLines(nums1, nums2)：不相交连线最大条数（同 LCS）。
function maxUncrossedLines(nums1, nums2) {
  const m = nums1.length;
  const n = nums2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (nums1[i - 1] === nums2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

module.exports = {
  longestCommonSubsequence,
  minDistance,
  longestPalindromeSubseq,
  minInsertions,
  isInterleave,
  distinctSubsequences,
  maxDotProduct,
  longestRepeatingSubsequence,
  minimumDeleteSum,
  longestCommonSubstring,
  countPalindromicSubsequences,
  regularExpressionMatch,
  isMatch,
  palindromePartition,
  longestPalindrome,
  shortestPalindrome,
  strStr,
  numDistinct,
  longestIncreasingSubsequence,
  maxUncrossedLines,
};
