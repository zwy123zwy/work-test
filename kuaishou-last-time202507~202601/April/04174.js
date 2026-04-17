/**
 * 04174.js — 前端代码算法题 20 道（图论 · BFS / DFS / 拓扑 / 并查集）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. numIslands(grid)：1 为陆地，岛屿个数。
function numIslands(grid) {
  if (!grid.length) return 0;
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

// 2. maxAreaOfIsland(grid)：最大岛屿面积。
function maxAreaOfIsland(grid) {
  if (!grid.length) return 0;
  const m = grid.length;
  const n = grid[0].length;
  let best = 0;
  const dfs = (i, j) => {
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] !== 1) return 0;
    grid[i][j] = 0;
    return 1 + dfs(i + 1, j) + dfs(i - 1, j) + dfs(i, j + 1) + dfs(i, j - 1);
  };
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (grid[i][j] === 1) best = Math.max(best, dfs(i, j));
    }
  }
  return best;
}

// 3. orangesRotting(grid)：2 腐烂 1 新鲜，每分钟传染四邻，返回全部腐烂分钟数或 -1。
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
  let qi = 0;
  let ans = 0;
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  while (qi < q.length) {
    const [i, j, t] = q[qi++];
    ans = t;
    for (const [di, dj] of dirs) {
      const ni = i + di;
      const nj = j + dj;
      if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] === 1) {
        grid[ni][nj] = 2;
        fresh -= 1;
        q.push([ni, nj, t + 1]);
      }
    }
  }
  return fresh === 0 ? ans : -1;
}

// 4. floodFill(image, sr, sc, color)：填充连通区域。
function floodFill(image, sr, sc, color) {
  const start = image[sr][sc];
  if (start === color) return image;
  const m = image.length;
  const n = image[0].length;
  const dfs = (i, j) => {
    if (i < 0 || i >= m || j < 0 || j >= n || image[i][j] !== start) return;
    image[i][j] = color;
    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  };
  dfs(sr, sc);
  return image;
}

// 5. cloneGraph(node)：`node` 为 { val, neighbors: Node[] }，深拷贝。
function cloneGraph(node) {
  if (!node) return null;
  const map = new Map();
  const dfs = (n) => {
    if (map.has(n)) return map.get(n);
    const c = { val: n.val, neighbors: [] };
    map.set(n, c);
    for (const nb of n.neighbors || []) c.neighbors.push(dfs(nb));
    return c;
  };
  return dfs(node);
}

// 6. canFinish(numCourses, prerequisites)：能否完成所有课（有向无环）。
function canFinish(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, () => []);
  const indeg = Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) {
    g[b].push(a);
    indeg[a] += 1;
  }
  const q = [];
  for (let i = 0; i < numCourses; i += 1) {
    if (indeg[i] === 0) q.push(i);
  }
  let taken = 0;
  let qi = 0;
  while (qi < q.length) {
    const u = q[qi++];
    taken += 1;
    for (const v of g[u]) {
      indeg[v] -= 1;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return taken === numCourses;
}

// 7. findOrder(numCourses, prerequisites)：拓扑排序序列或 []。
function findOrder(numCourses, prerequisites) {
  const g = Array.from({ length: numCourses }, () => []);
  const indeg = Array(numCourses).fill(0);
  for (const [a, b] of prerequisites) {
    g[b].push(a);
    indeg[a] += 1;
  }
  const q = [];
  for (let i = 0; i < numCourses; i += 1) {
    if (indeg[i] === 0) q.push(i);
  }
  const res = [];
  let qi = 0;
  while (qi < q.length) {
    const u = q[qi++];
    res.push(u);
    for (const v of g[u]) {
      indeg[v] -= 1;
      if (indeg[v] === 0) q.push(v);
    }
  }
  return res.length === numCourses ? res : [];
}

// 8. pacificAtlantic(heights)：能流向太平洋与大西洋的格子坐标。
function pacificAtlantic(heights) {
  const m = heights.length;
  const n = heights[0].length;
  const pac = Array.from({ length: m }, () => Array(n).fill(false));
  const atl = Array.from({ length: m }, () => Array(n).fill(false));
  const dfs = (i, j, oc, vis) => {
    vis[i][j] = true;
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    for (const [di, dj] of dirs) {
      const ni = i + di;
      const nj = j + dj;
      if (
        ni >= 0 &&
        ni < m &&
        nj >= 0 &&
        nj < n &&
        !vis[ni][nj] &&
        heights[ni][nj] >= heights[i][j]
      ) {
        dfs(ni, nj, heights[ni][nj], vis);
      }
    }
  };
  for (let j = 0; j < n; j += 1) {
    dfs(0, j, heights[0][j], pac);
    dfs(m - 1, j, heights[m - 1][j], atl);
  }
  for (let i = 0; i < m; i += 1) {
    dfs(i, 0, heights[i][0], pac);
    dfs(i, n - 1, heights[i][n - 1], atl);
  }
  const res = [];
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (pac[i][j] && atl[i][j]) res.push([i, j]);
    }
  }
  return res;
}

// 9. solve(board)：被 X 包围的 O 变 X（边界 DFS）。
function solve(board) {
  const m = board.length;
  if (!m) return board;
  const n = board[0].length;
  const mark = (i, j) => {
    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== 'O') return;
    board[i][j] = '#';
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
      else if (board[i][j] === '#') board[i][j] = 'O';
    }
  }
  return board;
}

// 10. numEnclaves(grid)：不能走到边界的 1 的个数。
function numEnclaves(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const mark = (i, j) => {
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] !== 1) return;
    grid[i][j] = 0;
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
  let cnt = 0;
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (grid[i][j] === 1) cnt += 1;
    }
  }
  return cnt;
}

// 11. shortestBridge(grid)：两座 1 岛之间最少翻转 0 的个数（多源 BFS）。
function shortestBridge(grid) {
  const n = grid.length;
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  const q = [];
  const find = () => {
    for (let i = 0; i < n; i += 1) {
      for (let j = 0; j < n; j += 1) {
        if (grid[i][j] === 1) return [i, j];
      }
    }
    return [0, 0];
  };
  const [si, sj] = find();
  const paint = (i, j) => {
    if (i < 0 || i >= n || j < 0 || j >= n || grid[i][j] !== 1) return;
    grid[i][j] = 2;
    q.push([i, j, 0]);
    paint(i + 1, j);
    paint(i - 1, j);
    paint(i, j + 1);
    paint(i, j - 1);
  };
  paint(si, sj);
  let qi = 0;
  while (qi < q.length) {
    const [i, j, d] = q[qi++];
    for (const [di, dj] of dirs) {
      const ni = i + di;
      const nj = j + dj;
      if (ni < 0 || ni >= n || nj < 0 || nj >= n) continue;
      if (grid[ni][nj] === 1) return d;
      if (grid[ni][nj] === 0) {
        grid[ni][nj] = 2;
        q.push([ni, nj, d + 1]);
      }
    }
  }
  return 0;
}

// 12. keysAndRooms(rooms)：能否访遍所有房间（图可达）。
function keysAndRooms(rooms) {
  const n = rooms.length;
  const seen = Array(n).fill(false);
  const st = [0];
  seen[0] = true;
  while (st.length) {
    const u = st.pop();
    for (const v of rooms[u]) {
      if (!seen[v]) {
        seen[v] = true;
        st.push(v);
      }
    }
  }
  return seen.every(Boolean);
}

// 13. findCircleNum(isConnected)：省份数（无向图连通分量）。
function findCircleNum(isConnected) {
  const n = isConnected.length;
  let comp = 0;
  const vis = Array(n).fill(false);
  for (let i = 0; i < n; i += 1) {
    if (vis[i]) continue;
    comp += 1;
    const st = [i];
    vis[i] = true;
    while (st.length) {
      const u = st.pop();
      for (let v = 0; v < n; v += 1) {
        if (isConnected[u][v] && !vis[v]) {
          vis[v] = true;
          st.push(v);
        }
      }
    }
  }
  return comp;
}

// 14. UnionFind（简化并查集）：connected / union。
class UnionFind {
  constructor(n) {
    this.p = Array.from({ length: n }, (_, i) => i);
    this.r = Array(n).fill(0);
  }
  find(x) {
    if (this.p[x] !== x) this.p[x] = this.find(this.p[x]);
    return this.p[x];
  }
  union(a, b) {
    let ra = this.find(a);
    let rb = this.find(b);
    if (ra === rb) return false;
    if (this.r[ra] < this.r[rb]) [ra, rb] = [rb, ra];
    this.p[rb] = ra;
    if (this.r[ra] === this.r[rb]) this.r[ra] += 1;
    return true;
  }
}

// 15. validTree(n, edges)：n 点边集是否为一棵树（无环且连通）。
function validTree(n, edges) {
  if (edges.length !== n - 1) return false;
  const uf = new UnionFind(n);
  for (const [a, b] of edges) {
    if (!uf.union(a, b)) return false;
  }
  return true;
}

// 16. networkDelayTime(times, n, k)：从 k 出发单源最短路最大（Dijkstra）。
function networkDelayTime(times, n, k) {
  const g = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) {
    g[u].push([v, w]);
  }
  const dist = Array(n + 1).fill(Infinity);
  dist[k] = 0;
  const pq = [[0, k]];
  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (d !== dist[u]) continue;
    for (const [v, w] of g[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        pq.push([dist[v], v]);
      }
    }
  }
  const ans = Math.max(...dist.slice(1));
  return ans < Infinity ? ans : -1;
}

// 17. numIslandsII(m, n, positions)：动态加陆地，每次岛屿数。
function numIslandsII(m, n, positions) {
  const id = (r, c) => r * n + c;
  const tot = m * n;
  const uf = new UnionFind(tot);
  const grid = Array.from({ length: m }, () => Array(n).fill(0));
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let cnt = 0;
  const res = [];
  for (const [r, c] of positions) {
    if (grid[r][c]) {
      res.push(cnt);
      continue;
    }
    grid[r][c] = 1;
    cnt += 1;
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n || !grid[nr][nc]) continue;
      if (uf.union(id(r, c), id(nr, nc))) cnt -= 1;
    }
    res.push(cnt);
  }
  return res;
}

// 18. isBipartite(graph)：邻接表无向图是否二分。
function isBipartite(graph) {
  const n = graph.length;
  const color = Array(n).fill(-1);
  for (let s = 0; s < n; s += 1) {
    if (color[s] !== -1) continue;
    color[s] = 0;
    const q = [s];
    for (let qi = 0; qi < q.length; qi += 1) {
      const u = q[qi];
      for (const v of graph[u]) {
        if (color[v] === -1) {
          color[v] = color[u] ^ 1;
          q.push(v);
        } else if (color[v] === color[u]) return false;
      }
    }
  }
  return true;
}

// 19. allPathsSourceTarget(graph)：DAG 从 0 到 n-1 所有路径。
function allPathsSourceTarget(graph) {
  const target = graph.length - 1;
  const res = [];
  const path = [];
  const dfs = (u) => {
    path.push(u);
    if (u === target) res.push(path.slice());
    else for (const v of graph[u]) dfs(v);
    path.pop();
  };
  dfs(0);
  return res;
}

// 20. calcEquation(equations, values, queries)：带权并查集求比值。
function calcEquation(equations, values, queries) {
  const parent = new Map();
  const w = new Map();
  const find = (x) => {
    if (!parent.has(x)) {
      parent.set(x, x);
      w.set(x, 1);
      return x;
    }
    if (parent.get(x) !== x) {
      const r = find(parent.get(x));
      w.set(x, w.get(x) * w.get(parent.get(x)));
      parent.set(x, r);
    }
    return parent.get(x);
  };
  const unite = (a, b, val) => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return;
    parent.set(rb, ra);
    w.set(rb, (w.get(a) * val) / w.get(b));
  };
  for (let i = 0; i < equations.length; i += 1) {
    unite(equations[i][0], equations[i][1], values[i]);
  }
  return queries.map(([a, b]) => {
    if (!parent.has(a) || !parent.has(b)) return -1;
    if (find(a) !== find(b)) return -1;
    return w.get(b) / w.get(a);
  });
}

module.exports = {
  numIslands,
  maxAreaOfIsland,
  orangesRotting,
  floodFill,
  cloneGraph,
  canFinish,
  findOrder,
  pacificAtlantic,
  solve,
  numEnclaves,
  shortestBridge,
  keysAndRooms,
  findCircleNum,
  UnionFind,
  validTree,
  networkDelayTime,
  numIslandsII,
  isBipartite,
  allPathsSourceTarget,
  calcEquation,
};
