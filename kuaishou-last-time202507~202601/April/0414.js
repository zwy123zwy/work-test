/**
 * 0414.js — 前端代码算法题 20 道（DP 进阶 / 字符串与栈 / Trie / 图 / 数学）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. editDistance(word1, word2)：最小编辑距离。
// 答：二维 DP：删/插/换。
function editDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i += 1) dp[i][0] = i;
  for (let j = 0; j <= n; j += 1) dp[0][j] = j;
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

// 2. numDecodings(s)：数字串解码为 A-Z 的方案数。
// 答：DP，注意前导 0 与 10-26。
function numDecodings(s) {
  if (!s.length || s[0] === '0') return 0;
  let a = 1;
  let b = 1;
  for (let i = 1; i < s.length; i += 1) {
    let cur = 0;
    const one = Number(s[i]);
    const two = Number(s.slice(i - 1, i + 1));
    if (one >= 1 && one <= 9) cur += b;
    if (two >= 10 && two <= 26) cur += a;
    a = b;
    b = cur;
  }
  return b;
}

// 3. maxProfitCooldown(prices)：卖出后需冷冻 1 天再买入，最大利润。
// 答：三状态 DP：持有 / 冷冻刚卖 / 可买。
function maxProfitCooldown(prices) {
  if (!prices.length) return 0;
  let hold = -prices[0];
  let sold = 0;
  let rest = 0;
  for (let i = 1; i < prices.length; i += 1) {
    const p = prices[i];
    const prevHold = hold;
    const prevSold = sold;
    const prevRest = rest;
    hold = Math.max(prevHold, prevRest - p);
    sold = prevHold + p;
    rest = Math.max(prevRest, prevSold);
  }
  return Math.max(sold, rest);
}

// 4. decodeString(s)：形如 3[a2[c]] 的编码串解码。
// 答：栈：遇 ] 弹出片段与重复次数拼接。
function decodeString(s) {
  const stNum = [];
  const stStr = [];
  let num = 0;
  let cur = '';
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      num = num * 10 + (ch.charCodeAt(0) - 48);
    } else if (ch === '[') {
      stNum.push(num);
      stStr.push(cur);
      num = 0;
      cur = '';
    } else if (ch === ']') {
      const k = stNum.pop();
      const prev = stStr.pop();
      cur = prev + cur.repeat(k);
    } else {
      cur += ch;
    }
  }
  return cur;
}

// 5. Trie：前缀树，insert / search / startsWith。
// 答：多叉树结点 map 或数组。
class Trie {
  constructor() {
    this.root = {};
  }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node.end = true;
  }

  search(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node[ch]) return false;
      node = node[ch];
    }
    return !!node.end;
  }

  startsWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node[ch]) return false;
      node = node[ch];
    }
    return true;
  }
}

// 6. numIslands(grid)：二维网格中「1」岛屿个数（四连通）。
// 答：DFS/BFS 标记访问为 0。
function numIslands(grid) {
  if (!grid.length) return 0;
  const m = grid.length;
  const n = grid[0].length;
  let cnt = 0;
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
        cnt += 1;
        dfs(i, j);
      }
    }
  }
  return cnt;
}

// 7. canFinish(numCourses, prerequisites)：能否修完所有课（有向无环）。
// 答：拓扑排序：入度队列 + 邻接表。
function canFinish(numCourses, prerequisites) {
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

// 8. findMedianSortedArrays(nums1, nums2)：两个有序数组的中位数 O(log(m+n))。
// 答：二分较短数组的分割线，使左右元素个数与大小关系满足中位。
function findMedianSortedArrays(nums1, nums2) {
  const A = nums1.length <= nums2.length ? nums1 : nums2;
  const B = nums1.length <= nums2.length ? nums2 : nums1;
  const m = A.length;
  const n = B.length;
  let lo = 0;
  let hi = m;
  while (lo <= hi) {
    const i = (lo + hi) >> 1;
    const j = ((m + n + 1) >> 1) - i;
    const maxLeftA = i === 0 ? -Infinity : A[i - 1];
    const minRightA = i === m ? Infinity : A[i];
    const maxLeftB = j === 0 ? -Infinity : B[j - 1];
    const minRightB = j === n ? Infinity : B[j];
    if (maxLeftA <= minRightB && maxLeftB <= minRightA) {
      if ((m + n) % 2 === 0) {
        return (Math.max(maxLeftA, maxLeftB) + Math.min(minRightA, minRightB)) / 2;
      }
      return Math.max(maxLeftA, maxLeftB);
    }
    if (maxLeftA > minRightB) hi = i - 1;
    else lo = i + 1;
  }
  return 0;
}

// 9. largestNumber(nums)：非负整数拼接成最大数字字符串。
// 答：排序比较 a+b 与 b+a。
function largestNumber(nums) {
  const strs = nums.map(String);
  strs.sort((a, b) => {
    if (a + b > b + a) return -1;
    if (a + b < b + a) return 1;
    return 0;
  });
  if (strs[0] === '0') return '0';
  return strs.join('');
}

// 10. mySqrt(x)：整数平方根（向下取整）。
// 答：二分 [0,x] 或牛顿迭代。
function mySqrt(x) {
  if (x < 2) return x;
  let lo = 1;
  let hi = x >> 1;
  let ans = 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const sq = mid * mid;
    if (sq === x) return mid;
    if (sq < x) {
      ans = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return ans;
}

// 11. longestValidParentheses(s)：最长合法括号子串长度。
// 答：栈存「未匹配」下标作基准；遇 ) 弹栈用距离更新 ans。
function longestValidParentheses(s) {
  const st = [-1];
  let ans = 0;
  for (let i = 0; i < s.length; i += 1) {
    if (s[i] === '(') st.push(i);
    else {
      st.pop();
      if (!st.length) st.push(i);
      else ans = Math.max(ans, i - st[st.length - 1]);
    }
  }
  return ans;
}

// 12. isMatch(s, p)：通配符匹配，* 匹配任意串，? 匹配单字符。
// 答：二维 DP：* 取空或延续。
function isMatch(s, p) {
  const m = s.length;
  const n = p.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= n; j += 1) {
    if (p[j - 1] === '*') dp[0][j] = dp[0][j - 1];
  }
  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      if (p[j - 1] === '*') {
        dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
      } else if (p[j - 1] === '?' || p[j - 1] === s[i - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }
  return dp[m][n];
}

// 13. longestPalindrome(s)：最长回文子串。
// 答：枚举中心向两侧扩展，奇偶长度各一次。
function longestPalindrome(s) {
  let start = 0;
  let maxLen = 0;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l -= 1;
      r += 1;
    }
    const len = r - l - 1;
    if (len > maxLen) {
      maxLen = len;
      start = l + 1;
    }
  };
  for (let i = 0; i < s.length; i += 1) {
    expand(i, i);
    expand(i, i + 1);
  }
  return s.slice(start, start + maxLen);
}

// 14. rob2(nums)：环形数组打家劫舍（首尾不能同偷）。
// 答：拆成「不偷首」与「不偷尾」两段线性 rob，取 max。
function rob2(nums) {
  const robLinear = (arr) => {
    let a = 0;
    let b = 0;
    for (const x of arr) {
      const c = Math.max(b, a + x);
      a = b;
      b = c;
    }
    return b;
  };
  if (nums.length === 1) return nums[0];
  return Math.max(robLinear(nums.slice(0, -1)), robLinear(nums.slice(1)));
}

// 15. copyRandomList(head)：复制带 random 指针的链表。
// 答：Map 旧结点→新结点；第二遍连 next 与 random。
function copyRandomList(head) {
  if (!head) return null;
  const map = new Map();
  let cur = head;
  while (cur) {
    map.set(cur, { val: cur.val, next: null, random: null });
    cur = cur.next;
  }
  cur = head;
  while (cur) {
    const copy = map.get(cur);
    copy.next = cur.next ? map.get(cur.next) : null;
    cur = cur.next;
  }
  cur = head;
  while (cur) {
    const copy = map.get(cur);
    copy.random = cur.random ? map.get(cur.random) : null;
    cur = cur.next;
  }
  return map.get(head);
}

// 16. cloneGraph(node)：无向图结点深拷贝（val + neighbors[]）。
// 答：Map 原→新，DFS 递归复制邻居。
function cloneGraph(node) {
  if (!node) return null;
  const map = new Map();
  const dfs = (n) => {
    if (map.has(n)) return map.get(n);
    const copy = { val: n.val, neighbors: [] };
    map.set(n, copy);
    for (const nb of n.neighbors || []) {
      copy.neighbors.push(dfs(nb));
    }
    return copy;
  };
  return dfs(node);
}

// 17. networkDelayTime(times, n, k)：从 k 到所有点的最短时间（有向加权）。
// 答：Dijkstra；此处用数组每次取最小距离。
function networkDelayTime(times, n, k) {
  const g = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) {
    g[u].push([v, w]);
  }
  const dist = Array(n + 1).fill(Infinity);
  dist[k] = 0;
  const seen = new Set();
  for (let i = 0; i < n; i += 1) {
    let u = -1;
    let best = Infinity;
    for (let j = 1; j <= n; j += 1) {
      if (!seen.has(j) && dist[j] < best) {
        best = dist[j];
        u = j;
      }
    }
    if (u === -1 || best === Infinity) break;
    seen.add(u);
    for (const [v, w] of g[u]) {
      if (dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    }
  }
  let ans = 0;
  for (let i = 1; i <= n; i += 1) {
    if (dist[i] === Infinity) return -1;
    ans = Math.max(ans, dist[i]);
  }
  return ans;
}

// 18. myPow(x, n)：x 的 n 次幂（快速幂）。
// 答：n 二进制拆分，底数平方、结果累乘。
function myPow(x, n) {
  if (n === 0) return 1;
  if (n < 0) {
    x = 1 / x;
    n = -n;
  }
  let res = 1;
  let b = x;
  let e = n;
  while (e > 0) {
    if (e & 1) res *= b;
    b *= b;
    e >>= 1;
  }
  return res;
}

// 19. reverseBits(n)：32 位无符号整数按位反转。
function reverseBits(n) {
  let res = 0;
  for (let i = 0; i < 32; i += 1) {
    res = (res << 1) | (n & 1);
    n >>>= 1;
  }
  return res >>> 0;
}

// 20. countBits(n)：0..n 每个数二进制中 1 的个数。
// 答：dp[i] = dp[i >> 1] + (i & 1)。
function countBits(n) {
  const ans = Array(n + 1).fill(0);
  for (let i = 1; i <= n; i += 1) {
    ans[i] = ans[i >> 1] + (i & 1);
  }
  return ans;
}

module.exports = {
  editDistance,
  numDecodings,
  maxProfitCooldown,
  decodeString,
  Trie,
  numIslands,
  canFinish,
  findMedianSortedArrays,
  largestNumber,
  mySqrt,
  longestValidParentheses,
  isMatch,
  longestPalindrome,
  rob2,
  copyRandomList,
  cloneGraph,
  networkDelayTime,
  myPow,
  reverseBits,
  countBits,
};

