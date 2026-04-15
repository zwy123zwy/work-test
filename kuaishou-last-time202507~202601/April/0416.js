/**
 * 0416.js — 前端代码算法题 20 道（网格 BFS/DFS / 拓扑 / 回溯 / 图论）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. orangesRotting(grid)：腐烂橘子扩散到全烂的最少分钟，无法则 -1。
function orangesRotting(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const q = [];
  let fresh = 0;
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (grid[i][j] === 2) q.push([i, j, 0]);
      else if (grid[i][j] === 1) fresh += 1;
    }
  }
  if (fresh === 0) return 0;
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let t = 0;
  let head = 0;
  while (head < q.length) {
    const [i, j, time] = q[head];
    head += 1;
    t = time;
    for (const [di, dj] of dirs) {
      const ni = i + di;
      const nj = j + dj;
      if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] === 1) {
        grid[ni][nj] = 2;
        fresh -= 1;
        q.push([ni, nj, time + 1]);
      }
    }
  }
  return fresh === 0 ? t : -1;
}

// 2. wallsAndGates(rooms)：0 门、INF 空房，填每个空房到最近门的距离。
function wallsAndGates(rooms) {
  const m = rooms.length;
  const n = rooms[0].length;
  const q = [];
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (rooms[i][j] === 0) q.push([i, j]);
    }
  }
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let head = 0;
  while (head < q.length) {
    const [i, j] = q[head];
    head += 1;
    for (const [di, dj] of dirs) {
      const ni = i + di;
      const nj = j + dj;
      if (ni >= 0 && ni < m && nj >= 0 && nj < n && rooms[ni][nj] === 2147483647) {
        rooms[ni][nj] = rooms[i][j] + 1;
        q.push([ni, nj]);
      }
    }
  }
  return rooms;
}

// 3. shortestPathBinaryMatrix(grid)：8 邻接从左上到右下最短路径格数。
function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) return -1;
  if (n === 1) return 1;
  const q = [[0, 0, 1]];
  grid[0][0] = 1;
  const dirs = [];
  for (let di = -1; di <= 1; di += 1) {
    for (let dj = -1; dj <= 1; dj += 1) {
      if (di || dj) dirs.push([di, dj]);
    }
  }
  let head = 0;
  while (head < q.length) {
    const [i, j, d] = q[head];
    head += 1;
    if (i === n - 1 && j === n - 1) return d;
    for (const [di, dj] of dirs) {
      const ni = i + di;
      const nj = j + dj;
      if (ni >= 0 && ni < n && nj >= 0 && nj < n && grid[ni][nj] === 0) {
        grid[ni][nj] = 1;
        q.push([ni, nj, d + 1]);
      }
    }
  }
  return -1;
}

// 4. exist(board, word)：网格中能否按邻接走出 word。
function exist(board, word) {
  const m = board.length;
  const n = board[0].length;
  const dfs = (i, j, k) => {
    if (k === word.length) return true;
    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== word[k]) return false;
    const tmp = board[i][j];
    board[i][j] = '#';
    const ok =
      dfs(i + 1, j, k + 1) ||
      dfs(i - 1, j, k + 1) ||
      dfs(i, j + 1, k + 1) ||
      dfs(i, j - 1, k + 1);
    board[i][j] = tmp;
    return ok;
  };
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (dfs(i, j, 0)) return true;
    }
  }
  return false;
}

// 5. solve(board)：被 X 完全包围的 O 翻成 X。
function solve(board) {
  const m = board.length;
  const n = board[0].length;
  const mark = (i, j) => {
    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== 'O') return;
    board[i][j] = 'S';
    mark(i + 1, j);
    mark(i - 1, j);
    mark(i, j + 1);
    mark(i, j - 1);
  };
  for (let j = 0; j < n; j += 1) {
    mark(0, j);
    mark(m - 1, j);
  }
  for (let i = 0; i < m; i += 1) {
    mark(i, 0);
    mark(i, n - 1);
  }
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (board[i][j] === 'O') board[i][j] = 'X';
      else if (board[i][j] === 'S') board[i][j] = 'O';
    }
  }
  return board;
}

// 6. numEnclaves(grid)：飞不出去的 1 的个数（四邻接）。
function numEnclaves(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const dfs = (i, j) => {
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] !== 1) return;
    grid[i][j] = 0;
    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  };
  for (let i = 0; i < m; i += 1) {
    dfs(i, 0);
    dfs(i, n - 1);
  }
  for (let j = 0; j < n; j += 1) {
    dfs(0, j);
    dfs(m - 1, j);
  }
  let ans = 0;
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (grid[i][j] === 1) ans += 1;
    }
  }
  return ans;
}

// 7. maxDistance(grid)：海洋(0)到最近陆地(1)的最大距离（多源 BFS）。
function maxDistance(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const q = [];
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (grid[i][j] === 1) q.push([i, j, 0]);
    }
  }
  if (q.length === 0 || q.length === m * n) return -1;
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let ans = -1;
  let head = 0;
  while (head < q.length) {
    const [i, j, d] = q[head];
    head += 1;
    for (const [di, dj] of dirs) {
      const ni = i + di;
      const nj = j + dj;
      if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] === 0) {
        grid[ni][nj] = 1;
        ans = Math.max(ans, d + 1);
        q.push([ni, nj, d + 1]);
      }
    }
  }
  return ans;
}

// 8. pacificAtlantic(heights)：能流到太平洋与大西洋的格子坐标。
function pacificAtlantic(heights) {
  const m = heights.length;
  const n = heights[0].length;
  const p = Array.from({ length: m }, () => Array(n).fill(false));
  const a = Array.from({ length: m }, () => Array(n).fill(false));
  const dfs = (ocean, i, j, prev) => {
    if (i < 0 || i >= m || j < 0 || j >= n) return;
    if (ocean[i][j] || heights[i][j] < prev) return;
    ocean[i][j] = true;
    const h = heights[i][j];
    dfs(ocean, i + 1, j, h);
    dfs(ocean, i - 1, j, h);
    dfs(ocean, i, j + 1, h);
    dfs(ocean, i, j - 1, h);
  };
  for (let j = 0; j < n; j += 1) {
    dfs(p, 0, j, -Infinity);
    dfs(a, m - 1, j, -Infinity);
  }
  for (let i = 0; i < m; i += 1) {
    dfs(p, i, 0, -Infinity);
    dfs(a, i, n - 1, -Infinity);
  }
  const res = [];
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (p[i][j] && a[i][j]) res.push([i, j]);
    }
  }
  return res;
}

// 9. findOrder(numCourses, prerequisites)：拓扑排序课程顺序。
function findOrder(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, () => []);
  const indeg = Array(numCourses).fill(0);
  for (const [v, u] of prerequisites) {
    g[u].push(v);
    indeg[v] += 1;
  }
  const q = [];
  for (let i = 0; i < numCourses; i += 1) {
    if (indeg[i] === 0) q.push(i);
  }
  const res = [];
  let head = 0;
  while (head < q.length) {
    const u = q[head];
    head += 1;
    res.push(u);
    for (const v of g[u]) {
      indeg[v] -= 1;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return res.length === numCourses ? res : [];
}

// 10. alienOrder(words)：外星字典合法字母顺序。
function alienOrder(words) {
  const adj = new Map();
  const indeg = new Map();
  for (const w of words) {
    for (const ch of w) {
      if (!adj.has(ch)) adj.set(ch, new Set());
      if (!indeg.has(ch)) indeg.set(ch, 0);
    }
  }
  for (let i = 0; i < words.length - 1; i += 1) {
    const a = words[i];
    const b = words[i + 1];
    if (a.length > b.length && a.startsWith(b)) return '';
    const len = Math.min(a.length, b.length);
    for (let j = 0; j < len; j += 1) {
      if (a[j] !== b[j]) {
        if (!adj.get(a[j]).has(b[j])) {
          adj.get(a[j]).add(b[j]);
          indeg.set(b[j], indeg.get(b[j]) + 1);
        }
        break;
      }
    }
  }
  const q = [];
  for (const [ch, d] of indeg.entries()) {
    if (d === 0) q.push(ch);
  }
  let head = 0;
  const order = [];
  while (head < q.length) {
    const u = q[head];
    head += 1;
    order.push(u);
    for (const v of adj.get(u)) {
      indeg.set(v, indeg.get(v) - 1);
      if (indeg.get(v) === 0) q.push(v);
    }
  }
  return order.length === indeg.size ? order.join('') : '';
}

// 11. permuteUnique(nums)：全排列去重。
function permuteUnique(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  const used = Array(nums.length).fill(false);
  const path = [];
  const dfs = () => {
    if (path.length === nums.length) {
      res.push([...path]);
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

// 12. combinationSum2(candidates, target)：每个数用一次，和为 target。
function combinationSum2(candidates, target) {
  candidates.sort((a, b) => a - b);
  const res = [];
  const dfs = (start, remain, path) => {
    if (remain === 0) {
      res.push([...path]);
      return;
    }
    for (let i = start; i < candidates.length; i += 1) {
      if (candidates[i] > remain) break;
      if (i > start && candidates[i] === candidates[i - 1]) continue;
      path.push(candidates[i]);
      dfs(i + 1, remain - candidates[i], path);
      path.pop();
    }
  };
  dfs(0, target, []);
  return res;
}

// 13. partition(s)：分割回文串，返回所有方案。
function partition(s) {
  const res = [];
  const path = [];
  const isPal = (l, r) => {
    while (l < r) {
      if (s[l] !== s[r]) return false;
      l += 1;
      r -= 1;
    }
    return true;
  };
  const dfs = (start) => {
    if (start === s.length) {
      res.push([...path]);
      return;
    }
    for (let end = start; end < s.length; end += 1) {
      if (isPal(start, end)) {
        path.push(s.slice(start, end + 1));
        dfs(end + 1);
        path.pop();
      }
    }
  };
  dfs(0);
  return res;
}

// 14. solveNQueens(n)：N 皇后所有解（'.' 与 'Q'）。
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
      if (cols.has(c) || diag1.has(r - c) || diag2.has(r + c)) continue;
      cols.add(c);
      diag1.add(r - c);
      diag2.add(r + c);
      board[r][c] = 'Q';
      dfs(r + 1);
      board[r][c] = '.';
      cols.delete(c);
      diag1.delete(r - c);
      diag2.delete(r + c);
    }
  };
  dfs(0);
  return res;
}

// 15. solveSudoku(board)：解数独，原地 '1'-'9'与 '.'。
function solveSudoku(board) {
  const rows = Array.from({ length: 9 }, () => Array(10).fill(false));
  const cols = Array.from({ length: 9 }, () => Array(10).fill(false));
  const box = Array.from({ length: 9 }, () => Array(10).fill(false));
  for (let i = 0; i < 9; i += 1) {
    for (let j = 0; j < 9; j += 1) {
      if (board[i][j] !== '.') {
        const d = board[i][j].charCodeAt(0) - 48;
        const b = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        rows[i][d] = cols[j][d] = box[b][d] = true;
      }
    }
  }
  const dfs = (pos) => {
    if (pos === 81) return true;
    const i = Math.floor(pos / 9);
    const j = pos % 9;
    if (board[i][j] !== '.') return dfs(pos + 1);
    const b = Math.floor(i / 3) * 3 + Math.floor(j / 3);
    for (let d = 1; d <= 9; d += 1) {
      if (rows[i][d] || cols[j][d] || box[b][d]) continue;
      rows[i][d] = cols[j][d] = box[b][d] = true;
      board[i][j] = String(d);
      if (dfs(pos + 1)) return true;
      board[i][j] = '.';
      rows[i][d] = cols[j][d] = box[b][d] = false;
    }
    return false;
  };
  dfs(0);
  return board;
}

// 16. isBipartite(graph)：无向图能否二分染色。
function isBipartite(graph) {
  const n = graph.length;
  const color = Array(n).fill(-1);
  for (let s = 0; s < n; s += 1) {
    if (color[s] !== -1) continue;
    color[s] = 0;
    const q = [s];
    let head = 0;
    while (head < q.length) {
      const u = q[head];
      head += 1;
      for (const v of graph[u]) {
        if (color[v] === -1) {
          color[v] = color[u] ^ 1;
          q.push(v);
        } else if (color[v] === color[u]) {
          return false;
        }
      }
    }
  }
  return true;
}

// 17. allPathsSourceTarget(graph)：DAG 从 0 到 n-1 所有路径。
function allPathsSourceTarget(graph) {
  const n = graph.length;
  const res = [];
  const path = [0];
  const dfs = (u) => {
    if (u === n - 1) {
      res.push([...path]);
      return;
    }
    for (const v of graph[u]) {
      path.push(v);
      dfs(v);
      path.pop();
    }
  };
  dfs(0);
  return res;
}

// 18. eventualSafeNodes(graph)：终端安全点（不出环）。
function eventualSafeNodes(graph) {
  const n = graph.length;
  const state = Array(n).fill(0);
  const dfs = (u) => {
    if (state[u] !== 0) return state[u] === 2;
    state[u] = 1;
    for (const v of graph[u]) {
      if (!dfs(v)) return false;
    }
    state[u] = 2;
    return true;
  };
  const res = [];
  for (let i = 0; i < n; i += 1) {
    if (dfs(i)) res.push(i);
  }
  return res.sort((a, b) => a - b);
}

// 19. canVisitAllRooms(rooms)：从 0 出发能否打开所有房间（列表为钥匙）。
function canVisitAllRooms(rooms) {
  const n = rooms.length;
  const seen = new Set([0]);
  const st = [...rooms[0]];
  while (st.length) {
    const k = st.pop();
    if (seen.has(k)) continue;
    seen.add(k);
    for (const x of rooms[k]) st.push(x);
  }
  return seen.size === n;
}

// 20. calcEquation(equations, values, queries)：变量除法查询，无法求则 -1。
function calcEquation(equations, values, queries) {
  const id = new Map();
  let nid = 0;
  const getId = (x) => {
    if (!id.has(x)) {
      id.set(x, nid);
      nid += 1;
    }
    return id.get(x);
  };
  const adj = [];
  for (let i = 0; i < equations.length; i += 1) {
    const [a, b] = equations[i];
    const w = values[i];
    const u = getId(a);
    const v = getId(b);
    while (adj.length <= Math.max(u, v)) adj.push([]);
    adj[u].push([v, w]);
    adj[v].push([u, 1 / w]);
  }
  const dfs = (u, t, vis) => {
    if (u === t) return 1;
    vis.add(u);
    for (const [v, w] of adj[u] || []) {
      if (vis.has(v)) continue;
      const r = dfs(v, t, vis);
      if (r >= 0) return w * r;
    }
    return -1;
  };
  const res = [];
  for (const [a, b] of queries) {
    if (!id.has(a) || !id.has(b)) {
      res.push(-1);
      continue;
    }
    const u = id.get(a);
    const v = id.get(b);
    if (u === v) res.push(1);
    else res.push(dfs(u, v, new Set()));
  }
  return res;
}

module.exports = {
  orangesRotting,
  wallsAndGates,
  shortestPathBinaryMatrix,
  exist,
  solve,
  numEnclaves,
  maxDistance,
  pacificAtlantic,
  findOrder,
  alienOrder,
  permuteUnique,
  combinationSum2,
  partition,
  solveNQueens,
  solveSudoku,
  isBipartite,
  allPathsSourceTarget,
  eventualSafeNodes,
  canVisitAllRooms,
  calcEquation,
};
