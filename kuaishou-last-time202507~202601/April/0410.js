/**
 * 0410.js — 前端代码算法题 20 道（链表 / 树 / 图 / DP / 字符串）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. reverseList(head)：反转链表（迭代）。
// 答：prev/cur 迭代。
function reverseList(head) {
  let prev = null;
  let cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}

// 2. hasCycle(head)：链表是否有环（快慢指针）。
// 答：快慢指针相遇则有环。
function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// 3. detectCycle(head)：返回入环节点（Floyd）。
// 答：相遇后，ptr 从 head 与 slow 同步走，相遇点为入环。
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

// 4. mergeTwoLists(l1, l2)：合并两个有序链表。
// 答：哨兵节点 + 双指针。
function mergeTwoLists(l1, l2) {
  const dummy = { val: 0, next: null };
  let cur = dummy;
  let a = l1;
  let b = l2;
  while (a && b) {
    if (a.val <= b.val) {
      cur.next = a;
      a = a.next;
    } else {
      cur.next = b;
      b = b.next;
    }
    cur = cur.next;
  }
  cur.next = a || b;
  return dummy.next;
}

// 5. removeNthFromEnd(head, n)：删除倒数第 n 个节点。
// 答：双指针，fast 先走 n 步。
function removeNthFromEnd(head, n) {
  const dummy = { val: 0, next: head };
  let fast = dummy;
  let slow = dummy;
  for (let i = 0; i < n; i += 1) fast = fast.next;
  while (fast && fast.next) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next ? slow.next.next : null;
  return dummy.next;
}

// 6. inorderTraversal(root)：二叉树中序遍历（迭代栈版）。
// 答：左链入栈，弹出访问，再走右。
function inorderTraversal(root) {
  const res = [];
  const st = [];
  let cur = root;
  while (cur || st.length) {
    while (cur) {
      st.push(cur);
      cur = cur.left;
    }
    cur = st.pop();
    res.push(cur.val);
    cur = cur.right;
  }
  return res;
}

// 7. levelOrder(root)：二叉树层序遍历。
// 答：队列 BFS。
function levelOrder(root) {
  if (!root) return [];
  const q = [root];
  const res = [];
  while (q.length) {
    const size = q.length;
    const layer = [];
    for (let i = 0; i < size; i += 1) {
      const node = q.shift();
      layer.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    res.push(layer);
  }
  return res;
}

// 8. maxDepth(root)：二叉树最大深度。
// 答：递归。
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// 9. isValidBST(root)：验证二叉搜索树（上下界/中序单调）。
// 答：上下界递归。
function isValidBST(root) {
  const dfs = (node, low, high) => {
    if (!node) return true;
    if (low != null && node.val <= low) return false;
    if (high != null && node.val >= high) return false;
    return dfs(node.left, low, node.val) && dfs(node.right, node.val, high);
  };
  return dfs(root, null, null);
}

// 10. lowestCommonAncestor(root, p, q)：最近公共祖先（普通二叉树）。
// 答：后序：左右分别找，若两边都有则当前是 LCA。
function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left || right;
}

// 11. serialize/deserialize：二叉树序列化与反序列化（层序或前序）。
// 答：层序，用 null 占位。
function serialize(root) {
  if (!root) return '[]';
  const q = [root];
  const out = [];
  while (q.length) {
    const node = q.shift();
    if (!node) {
      out.push(null);
    } else {
      out.push(node.val);
      q.push(node.left);
      q.push(node.right);
    }
  }
  while (out.length && out[out.length - 1] == null) out.pop();
  return JSON.stringify(out);
}

function deserialize(data) {
  const arr = JSON.parse(data);
  if (!arr.length) return null;
  const root = { val: arr[0], left: null, right: null };
  const q = [root];
  let i = 1;
  while (q.length && i < arr.length) {
    const node = q.shift();
    const lv = arr[i++];
    if (lv != null) {
      node.left = { val: lv, left: null, right: null };
      q.push(node.left);
    }
    if (i >= arr.length) break;
    const rv = arr[i++];
    if (rv != null) {
      node.right = { val: rv, left: null, right: null };
      q.push(node.right);
    }
  }
  return root;
}

// 12. numIslands(grid)：岛屿数量（DFS/BFS）。
// 答：DFS 染色。
function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  const m = grid.length;
  const n = grid[0].length;
  let ans = 0;
  const dfs = (i, j) => {
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] !== '1') return;
    grid[i][j] = '0';
    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  };
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (grid[i][j] === '1') {
        ans += 1;
        dfs(i, j);
      }
    }
  }
  return ans;
}

// 13. courseSchedule(numCourses, prerequisites)：课程表（拓扑排序）。
// 答：Kahn 入度 BFS。
function courseSchedule(numCourses, prerequisites) {
  const indeg = Array(numCourses).fill(0);
  const g = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) {
    g[b].push(a);
    indeg[a] += 1;
  }
  const q = [];
  for (let i = 0; i < numCourses; i += 1) if (indeg[i] === 0) q.push(i);
  let taken = 0;
  while (q.length) {
    const u = q.shift();
    taken += 1;
    for (const v of g[u]) {
      indeg[v] -= 1;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return taken === numCourses;
}

// 14. climbStairs(n)：爬楼梯（DP）。
// 答：斐波那契。
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

// 15. coinChange(coins, amount)：零钱兑换最少硬币（DP）。
// 答：dp[i] = min(dp[i-c]+1)。
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i += 1) {
    for (const c of coins) {
      if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// 16. longestIncreasingSubsequence(nums)：最长递增子序列长度（O(n log n)）。
// 答：tails + 二分。
function longestIncreasingSubsequence(nums) {
  const tails = [];
  for (const x of nums) {
    let l = 0;
    let r = tails.length;
    while (l < r) {
      const mid = (l + r) >> 1;
      if (tails[mid] >= x) r = mid;
      else l = mid + 1;
    }
    tails[l] = x;
  }
  return tails.length;
}

// 17. editDistance(a, b)：编辑距离（DP）。
// 答：经典 DP。
function editDistance(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i += 1) dp[i][0] = i;
  for (let j = 0; j <= n; j += 1) dp[0][j] = j;
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// 18. longestPalindrome(s)：最长回文子串（中心扩展/DP）。
// 答：中心扩展 O(n^2)。
function longestPalindrome(s) {
  if (s.length <= 1) return s;
  let bestL = 0;
  let bestR = 0;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l -= 1;
      r += 1;
    }
    return [l + 1, r - 1];
  };
  for (let i = 0; i < s.length; i += 1) {
    const [l1, r1] = expand(i, i);
    if (r1 - l1 > bestR - bestL) {
      bestL = l1;
      bestR = r1;
    }
    const [l2, r2] = expand(i, i + 1);
    if (r2 - l2 > bestR - bestL) {
      bestL = l2;
      bestR = r2;
    }
  }
  return s.slice(bestL, bestR + 1);
}

// 19. decodeString(s)：字符串解码，如 \"3[a2[c]]\" → \"accaccacc\"（栈）。
// 答：两个栈：countStack/strStack。
function decodeString(s) {
  const countSt = [];
  const strSt = [];
  let cur = '';
  let num = 0;
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      num = num * 10 + (ch.charCodeAt(0) - 48);
    } else if (ch === '[') {
      countSt.push(num);
      strSt.push(cur);
      num = 0;
      cur = '';
    } else if (ch === ']') {
      const k = countSt.pop();
      const prev = strSt.pop();
      cur = prev + cur.repeat(k);
    } else {
      cur += ch;
    }
  }
  return cur;
}

// 20. parseExpression(expr)：实现简单表达式求值（+ - * / 括号，或用逆波兰/双栈）。
// 答：双栈（运算符栈 + 数字栈）。
function parseExpression(expr) {
  const ops = [];
  const nums = [];
  const prec = (op) => (op === '+' || op === '-' ? 1 : op === '*' || op === '/' ? 2 : 0);
  const apply = () => {
    const op = ops.pop();
    const b = nums.pop();
    const a = nums.pop();
    if (op === '+') nums.push(a + b);
    else if (op === '-') nums.push(a - b);
    else if (op === '*') nums.push(a * b);
    else if (op === '/') nums.push(a / b);
  };
  const s = expr.replace(/\s+/g, '');
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch >= '0' && ch <= '9' || ch === '.') {
      let j = i;
      while (j < s.length && ((s[j] >= '0' && s[j] <= '9') || s[j] === '.')) j += 1;
      nums.push(Number(s.slice(i, j)));
      i = j;
      continue;
    }
    if (ch === '(') {
      ops.push(ch);
      i += 1;
      continue;
    }
    if (ch === ')') {
      while (ops.length && ops[ops.length - 1] !== '(') apply();
      ops.pop();
      i += 1;
      continue;
    }
    // + - * /
    while (ops.length && ops[ops.length - 1] !== '(' && prec(ops[ops.length - 1]) >= prec(ch)) {
      apply();
    }
    ops.push(ch);
    i += 1;
  }
  while (ops.length) apply();
  return nums.pop();
}

module.exports = {
  reverseList,
  hasCycle,
  detectCycle,
  mergeTwoLists,
  removeNthFromEnd,
  inorderTraversal,
  levelOrder,
  maxDepth,
  isValidBST,
  lowestCommonAncestor,
  serialize,
  deserialize,
  numIslands,
  courseSchedule,
  climbStairs,
  coinChange,
  longestIncreasingSubsequence,
  editDistance,
  longestPalindrome,
  decodeString,
  parseExpression,
};

