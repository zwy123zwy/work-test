/**
 * 04156.js — 前端代码算法题 20 道（图 / BFS / 回溯）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

function numIslands(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const dfs = (i, j) => {
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] !== '1') return;
    grid[i][j] = '0';
    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  };
  let ans = 0;
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

function maxAreaOfIsland(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const dfs = (i, j) => {
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] === 0) return 0;
    grid[i][j] = 0;
    return 1 + dfs(i + 1, j) + dfs(i - 1, j) + dfs(i, j + 1) + dfs(i, j - 1);
  };
  let ans = 0;
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) ans = Math.max(ans, dfs(i, j));
  }
  return ans;
}

function islandPerimeter(grid) {
  const m = grid.length;
  const n = grid[0].length;
  let ans = 0;
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (grid[i][j] === 1) {
        ans += 4;
        if (i > 0 && grid[i - 1][j] === 1) ans -= 2;
        if (j > 0 && grid[i][j - 1] === 1) ans -= 2;
      }
    }
  }
  return ans;
}

function floodFill(image, sr, sc, color) {
  const old = image[sr][sc];
  if (old === color) return image;
  const m = image.length;
  const n = image[0].length;
  const dfs = (i, j) => {
    if (i < 0 || i >= m || j < 0 || j >= n || image[i][j] !== old) return;
    image[i][j] = color;
    dfs(i + 1, j);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i, j - 1);
  };
  dfs(sr, sc);
  return image;
}

function updateMatrix(mat) {
  const m = mat.length;
  const n = mat[0].length;
  const q = [];
  const dist = Array.from({ length: m }, () => Array(n).fill(Infinity));
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (mat[i][j] === 0) {
        dist[i][j] = 0;
        q.push([i, j]);
      }
    }
  }
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length) {
    const [x, y] = q.shift();
    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= m || ny < 0 || ny >= n) continue;
      if (dist[nx][ny] > dist[x][y] + 1) {
        dist[nx][ny] = dist[x][y] + 1;
        q.push([nx, ny]);
      }
    }
  }
  return dist;
}

function orangesRotting(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const q = [];
  let fresh = 0;
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (grid[i][j] === 2) q.push([i, j]);
      if (grid[i][j] === 1) fresh += 1;
    }
  }
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let mins = 0;
  while (q.length && fresh > 0) {
    const size = q.length;
    for (let i = 0; i < size; i += 1) {
      const [x, y] = q.shift();
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= m || ny < 0 || ny >= n || grid[nx][ny] !== 1) continue;
        grid[nx][ny] = 2;
        fresh -= 1;
        q.push([nx, ny]);
      }
    }
    mins += 1;
  }
  return fresh === 0 ? mins : -1;
}

function canVisitAllRooms(rooms) {
  const seen = Array(rooms.length).fill(false);
  const st = [0];
  seen[0] = true;
  while (st.length) {
    const room = st.pop();
    for (const key of rooms[room]) {
      if (!seen[key]) {
        seen[key] = true;
        st.push(key);
      }
    }
  }
  return seen.every(Boolean);
}

function findCircleNum(isConnected) {
  const n = isConnected.length;
  const seen = Array(n).fill(false);
  let ans = 0;
  const dfs = (u) => {
    seen[u] = true;
    for (let v = 0; v < n; v += 1) if (isConnected[u][v] === 1 && !seen[v]) dfs(v);
  };
  for (let i = 0; i < n; i += 1) {
    if (!seen[i]) {
      ans += 1;
      dfs(i);
    }
  }
  return ans;
}

function validPath(n, edges, source, destination) {
  const g = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    g[u].push(v);
    g[v].push(u);
  }
  const seen = Array(n).fill(false);
  const q = [source];
  seen[source] = true;
  while (q.length) {
    const u = q.shift();
    if (u === destination) return true;
    for (const v of g[u]) {
      if (!seen[v]) {
        seen[v] = true;
        q.push(v);
      }
    }
  }
  return false;
}

function allPathsSourceTarget(graph) {
  const ans = [];
  const target = graph.length - 1;
  const path = [0];
  const dfs = (u) => {
    if (u === target) {
      ans.push([...path]);
      return;
    }
    for (const v of graph[u]) {
      path.push(v);
      dfs(v);
      path.pop();
    }
  };
  dfs(0);
  return ans;
}

function permute(nums) {
  const ans = [];
  const used = Array(nums.length).fill(false);
  const path = [];
  const dfs = () => {
    if (path.length === nums.length) {
      ans.push([...path]);
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
  return ans;
}

function permuteUnique(nums) {
  nums.sort((a, b) => a - b);
  const ans = [];
  const used = Array(nums.length).fill(false);
  const path = [];
  const dfs = () => {
    if (path.length === nums.length) {
      ans.push([...path]);
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
  return ans;
}

function subsets(nums) {
  const ans = [];
  const path = [];
  const dfs = (idx) => {
    if (idx === nums.length) {
      ans.push([...path]);
      return;
    }
    dfs(idx + 1);
    path.push(nums[idx]);
    dfs(idx + 1);
    path.pop();
  };
  dfs(0);
  return ans;
}

function combine(n, k) {
  const ans = [];
  const path = [];
  const dfs = (start) => {
    if (path.length === k) {
      ans.push([...path]);
      return;
    }
    for (let i = start; i <= n; i += 1) {
      path.push(i);
      dfs(i + 1);
      path.pop();
    }
  };
  dfs(1);
  return ans;
}

function combinationSum(candidates, target) {
  const ans = [];
  const path = [];
  const dfs = (start, remain) => {
    if (remain === 0) {
      ans.push([...path]);
      return;
    }
    if (remain < 0) return;
    for (let i = start; i < candidates.length; i += 1) {
      path.push(candidates[i]);
      dfs(i, remain - candidates[i]);
      path.pop();
    }
  };
  dfs(0, target);
  return ans;
}

function combinationSum2(candidates, target) {
  candidates.sort((a, b) => a - b);
  const ans = [];
  const path = [];
  const dfs = (start, remain) => {
    if (remain === 0) {
      ans.push([...path]);
      return;
    }
    if (remain < 0) return;
    for (let i = start; i < candidates.length; i += 1) {
      if (i > start && candidates[i] === candidates[i - 1]) continue;
      path.push(candidates[i]);
      dfs(i + 1, remain - candidates[i]);
      path.pop();
    }
  };
  dfs(0, target);
  return ans;
}

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
  const ans = [];
  const dfs = (idx, path) => {
    if (idx === digits.length) {
      ans.push(path);
      return;
    }
    for (const ch of map[digits[idx]]) dfs(idx + 1, path + ch);
  };
  dfs(0, '');
  return ans;
}

function generateParenthesis(n) {
  const ans = [];
  const dfs = (cur, l, r) => {
    if (cur.length === n * 2) {
      ans.push(cur);
      return;
    }
    if (l < n) dfs(cur + '(', l + 1, r);
    if (r < l) dfs(cur + ')', l, r + 1);
  };
  dfs('', 0, 0);
  return ans;
}

function exist(board, word) {
  const m = board.length;
  const n = board[0].length;
  const dfs = (i, j, k) => {
    if (k === word.length) return true;
    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== word[k]) return false;
    const ch = board[i][j];
    board[i][j] = '#';
    const ok =
      dfs(i + 1, j, k + 1) ||
      dfs(i - 1, j, k + 1) ||
      dfs(i, j + 1, k + 1) ||
      dfs(i, j - 1, k + 1);
    board[i][j] = ch;
    return ok;
  };
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) if (dfs(i, j, 0)) return true;
  }
  return false;
}

function numEnclaves(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const dfs = (i, j) => {
    if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] === 0) return 0;
    grid[i][j] = 0;
    return 1 + dfs(i + 1, j) + dfs(i - 1, j) + dfs(i, j + 1) + dfs(i, j - 1);
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
      if (grid[i][j] === 1) ans += dfs(i, j);
    }
  }
  return ans;
}

module.exports = {
  numIslands,
  maxAreaOfIsland,
  islandPerimeter,
  floodFill,
  updateMatrix,
  orangesRotting,
  canVisitAllRooms,
  findCircleNum,
  validPath,
  allPathsSourceTarget,
  permute,
  permuteUnique,
  subsets,
  combine,
  combinationSum,
  combinationSum2,
  letterCombinations,
  generateParenthesis,
  exist,
  numEnclaves,
};
