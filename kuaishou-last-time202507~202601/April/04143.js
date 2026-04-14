/**
 * 04143.js — 前端代码算法题 20 道（链表综合 / 并查集 / 经典 DP）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. reorderList(head)：重排链表 L0→Ln→L1→Ln-1...
function reorderList(head) {
  if (!head || !head.next) return head;
  let slow = head;
  let fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  let prev = null;
  let cur = slow.next;
  slow.next = null;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  let p1 = head;
  let p2 = prev;
  while (p2) {
    const n1 = p1.next;
    const n2 = p2.next;
    p1.next = p2;
    p2.next = n1;
    p1 = n1;
    p2 = n2;
  }
  return head;
}

// 2. oddEvenList(head)：奇偶位置链表重排。
function oddEvenList(head) {
  if (!head || !head.next) return head;
  let odd = head;
  let even = head.next;
  const evenHead = even;
  while (even && even.next) {
    odd.next = even.next;
    odd = odd.next;
    even.next = odd.next;
    even = even.next;
  }
  odd.next = evenHead;
  return head;
}

// 3. detectCycle(head)：返回链表入环点，无环返回 null。
function detectCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      let p = head;
      while (p !== slow) {
        p = p.next;
        slow = slow.next;
      }
      return p;
    }
  }
  return null;
}

// 4. rotateRight(head, k)：链表右旋 k 位。
function rotateRight(head, k) {
  if (!head || !head.next || k === 0) return head;
  let n = 1;
  let tail = head;
  while (tail.next) {
    tail = tail.next;
    n += 1;
  }
  k %= n;
  if (k === 0) return head;
  tail.next = head;
  let steps = n - k;
  let newTail = tail;
  while (steps > 0) {
    newTail = newTail.next;
    steps -= 1;
  }
  const newHead = newTail.next;
  newTail.next = null;
  return newHead;
}

// 5. flatten(root)：二叉树展开为链表（先序）。
function flatten(root) {
  let prev = null;
  const dfs = (node) => {
    if (!node) return;
    dfs(node.right);
    dfs(node.left);
    node.right = prev;
    node.left = null;
    prev = node;
  };
  dfs(root);
  return root;
}

// 6. diameterOfBinaryTree(root)：二叉树直径（边数）。
function diameterOfBinaryTree(root) {
  let ans = 0;
  const depth = (node) => {
    if (!node) return 0;
    const l = depth(node.left);
    const r = depth(node.right);
    ans = Math.max(ans, l + r);
    return 1 + Math.max(l, r);
  };
  depth(root);
  return ans;
}

// 7. isBalanced(root)：平衡二叉树。
function isBalanced(root) {
  const height = (node) => {
    if (!node) return 0;
    const l = height(node.left);
    if (l === -1) return -1;
    const r = height(node.right);
    if (r === -1) return -1;
    if (Math.abs(l - r) > 1) return -1;
    return 1 + Math.max(l, r);
  };
  return height(root) !== -1;
}

// 8. generateParenthesis(n)：生成 n 对括号全部合法组合。
function generateParenthesis(n) {
  const res = [];
  const dfs = (cur, left, right) => {
    if (cur.length === n * 2) {
      res.push(cur);
      return;
    }
    if (left < n) dfs(cur + '(', left + 1, right);
    if (right < left) dfs(cur + ')', left, right + 1);
  };
  dfs('', 0, 0);
  return res;
}

// 9. letterCombinations(digits)：电话号码字母组合。
function letterCombinations(digits) {
  if (!digits) return [];
  const map = {
    2: 'abc',
    3: 'def',
    4: 'ghi',
    5: 'jkl',
    6: 'mno',
    7: 'pqrs',
    8: 'tuv',
    9: 'wxyz',
  };
  const res = [];
  const dfs = (idx, path) => {
    if (idx === digits.length) {
      res.push(path);
      return;
    }
    for (const ch of map[digits[idx]]) {
      dfs(idx + 1, path + ch);
    }
  };
  dfs(0, '');
  return res;
}

// 10. restoreIpAddresses(s)：还原合法 IP 地址。
function restoreIpAddresses(s) {
  const res = [];
  const path = [];
  const valid = (str) => {
    if (str.length > 1 && str[0] === '0') return false;
    const n = Number(str);
    return n >= 0 && n <= 255;
  };
  const dfs = (idx) => {
    if (path.length === 4) {
      if (idx === s.length) res.push(path.join('.'));
      return;
    }
    for (let len = 1; len <= 3; len += 1) {
      if (idx + len > s.length) break;
      const part = s.slice(idx, idx + len);
      if (!valid(part)) continue;
      path.push(part);
      dfs(idx + len);
      path.pop();
    }
  };
  dfs(0);
  return res;
}

// 11. numTrees(n)：不同 BST 数量（Catalan）。
function numTrees(n) {
  const dp = Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = 1;
  for (let i = 2; i <= n; i += 1) {
    for (let root = 1; root <= i; root += 1) {
      dp[i] += dp[root - 1] * dp[i - root];
    }
  }
  return dp[n];
}

// 12. wordBreak(s, wordDict)：是否可由字典单词拼接。
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

// 13. maxProduct(nums)：乘积最大子数组。
function maxProduct(nums) {
  let maxHere = nums[0];
  let minHere = nums[0];
  let ans = nums[0];
  for (let i = 1; i < nums.length; i += 1) {
    const x = nums[i];
    if (x < 0) {
      const t = maxHere;
      maxHere = minHere;
      minHere = t;
    }
    maxHere = Math.max(x, maxHere * x);
    minHere = Math.min(x, minHere * x);
    ans = Math.max(ans, maxHere);
  }
  return ans;
}

// 14. maximalSquare(matrix)：最大正方形面积。
function maximalSquare(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  let maxSide = 0;
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (matrix[i - 1][j - 1] === '1') {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        maxSide = Math.max(maxSide, dp[i][j]);
      }
    }
  }
  return maxSide * maxSide;
}

// 15. longestCommonSubsequence(text1, text2)：最长公共子序列长度。
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

// 16. findRedundantConnection(edges)：无向图冗余连接。
function findRedundantConnection(edges) {
  const n = edges.length;
  const parent = Array.from({ length: n + 1 }, (_, i) => i);
  const find = (x) => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  const union = (a, b) => {
    const pa = find(a);
    const pb = find(b);
    if (pa === pb) return false;
    parent[pa] = pb;
    return true;
  };
  for (const [u, v] of edges) {
    if (!union(u, v)) return [u, v];
  }
  return [];
}

// 17. accountsMerge(accounts)：账户合并（并查集 + 邮箱映射）。
function accountsMerge(accounts) {
  const parent = Array.from({ length: accounts.length }, (_, i) => i);
  const find = (x) => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  const union = (a, b) => {
    const pa = find(a);
    const pb = find(b);
    if (pa !== pb) parent[pa] = pb;
  };
  const emailToId = new Map();
  for (let i = 0; i < accounts.length; i += 1) {
    for (let j = 1; j < accounts[i].length; j += 1) {
      const email = accounts[i][j];
      if (emailToId.has(email)) union(i, emailToId.get(email));
      else emailToId.set(email, i);
    }
  }
  const groups = new Map();
  for (const [email, id] of emailToId.entries()) {
    const root = find(id);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(email);
  }
  const res = [];
  for (const [id, emails] of groups.entries()) {
    emails.sort();
    res.push([accounts[id][0], ...emails]);
  }
  return res;
}

// 18. countSubstrings(s)：回文子串个数。
function countSubstrings(s) {
  let ans = 0;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      ans += 1;
      l -= 1;
      r += 1;
    }
  };
  for (let i = 0; i < s.length; i += 1) {
    expand(i, i);
    expand(i, i + 1);
  }
  return ans;
}

// 19. minDistanceDelete(word1, word2)：只允许删除字符，使两串相同的最少删除次数。
function minDistanceDelete(word1, word2) {
  const lcs = longestCommonSubsequence(word1, word2);
  return word1.length + word2.length - 2 * lcs;
}

// 20. numDistinct(s, t)：s 中子序列等于 t 的个数。
function numDistinct(s, t) {
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

module.exports = {
  reorderList,
  oddEvenList,
  detectCycle,
  rotateRight,
  flatten,
  diameterOfBinaryTree,
  isBalanced,
  generateParenthesis,
  letterCombinations,
  restoreIpAddresses,
  numTrees,
  wordBreak,
  maxProduct,
  maximalSquare,
  longestCommonSubsequence,
  findRedundantConnection,
  accountsMerge,
  countSubstrings,
  minDistanceDelete,
  numDistinct,
};
