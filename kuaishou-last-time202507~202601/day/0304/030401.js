/**
 * 030401 面试算法题（20 道）- 专题：图与 BFS/DFS
 * 日期：2026-03-04
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 岛屿数量 ====================
function numIslands(grid) {
    if (!grid.length) return 0;
    const m = grid.length, n = grid[0].length;
    const dfs = (i, j) => {
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] !== '1') return;
        grid[i][j] = '0';
        dfs(i + 1, j); dfs(i - 1, j); dfs(i, j + 1); dfs(i, j - 1);
    };
    let count = 0;
    for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
            if (grid[i][j] === '1') { dfs(i, j); count++; }
    return count;
}

// ==================== 2. 岛屿的最大面积 ====================
function maxAreaOfIsland(grid) {
    if (!grid.length) return 0;
    const m = grid.length, n = grid[0].length;
    const dfs = (i, j) => {
        if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] !== 1) return 0;
        grid[i][j] = 0;
        return 1 + dfs(i + 1, j) + dfs(i - 1, j) + dfs(i, j + 1) + dfs(i, j - 1);
    };
    let max = 0;
    for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
            if (grid[i][j] === 1) max = Math.max(max, dfs(i, j));
    return max;
}

// ==================== 3. 被围绕的区域 ====================
function solve(board) {
    if (!board.length) return;
    const m = board.length, n = board[0].length;
    const dfs = (i, j) => {
        if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== 'O') return;
        board[i][j] = '#';
        dfs(i + 1, j); dfs(i - 1, j); dfs(i, j + 1); dfs(i, j - 1);
    };
    for (let i = 0; i < m; i++) { dfs(i, 0); dfs(i, n - 1); }
    for (let j = 0; j < n; j++) { dfs(0, j); dfs(m - 1, j); }
    for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++) {
            if (board[i][j] === '#') board[i][j] = 'O';
            else if (board[i][j] === 'O') board[i][j] = 'X';
        }
}

// ==================== 4. 克隆图 ====================
function cloneGraph(node) {
    if (!node) return null;
    const map = new Map();
    const dfs = (n) => {
        if (map.has(n)) return map.get(n);
        const copy = { val: n.val, neighbors: [] };
        map.set(n, copy);
        for (const nb of n.neighbors) copy.neighbors.push(dfs(nb));
        return copy;
    };
    return dfs(node);
}

// ==================== 5. 课程表 ====================
function canFinish(numCourses, prerequisites) {
    const ind = Array(numCourses).fill(0);
    const g = Array(numCourses).fill(0).map(() => []);
    for (const [a, b] of prerequisites) { g[b].push(a); ind[a]++; }
    const q = [];
    for (let i = 0; i < numCourses; i++) if (ind[i] === 0) q.push(i);
    let count = 0;
    while (q.length) {
        const u = q.shift();
        count++;
        for (const v of g[u]) if (--ind[v] === 0) q.push(v);
    }
    return count === numCourses;
}

// ==================== 6. 课程表 II ====================
function findOrder(numCourses, prerequisites) {
    const ind = Array(numCourses).fill(0);
    const g = Array(numCourses).fill(0).map(() => []);
    for (const [a, b] of prerequisites) { g[b].push(a); ind[a]++; }
    const q = [];
    for (let i = 0; i < numCourses; i++) if (ind[i] === 0) q.push(i);
    const res = [];
    while (q.length) {
        const u = q.shift();
        res.push(u);
        for (const v of g[u]) if (--ind[v] === 0) q.push(v);
    }
    return res.length === numCourses ? res : [];
}

// ==================== 7. 省份数量 ====================
function findCircleNum(isConnected) {
    const n = isConnected.length;
    const vis = new Set();
    const dfs = (i) => {
        vis.add(i);
        for (let j = 0; j < n; j++) if (isConnected[i][j] && !vis.has(j)) dfs(j);
    };
    let count = 0;
    for (let i = 0; i < n; i++) if (!vis.has(i)) { dfs(i); count++; }
    return count;
}

// ==================== 8. 冗余连接 ====================
function findRedundantConnection(edges) {
    const parent = Array(edges.length + 1).fill(0).map((_, i) => i);
    const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
    const union = (a, b) => { const pa = find(a), pb = find(b); if (pa === pb) return false; parent[pa] = pb; return true; };
    for (const [a, b] of edges) if (!union(a, b)) return [a, b];
    return [];
}

// ==================== 9. 单词接龙 ====================
function ladderLength(beginWord, endWord, wordList) {
    const set = new Set(wordList);
    if (!set.has(endWord)) return 0;
    let q = [beginWord], step = 1;
    while (q.length) {
        const next = [];
        for (const w of q) {
            if (w === endWord) return step;
            for (let i = 0; i < w.length; i++)
                for (let c = 97; c <= 122; c++) {
                    const nw = w.slice(0, i) + String.fromCharCode(c) + w.slice(i + 1);
                    if (set.has(nw)) { set.delete(nw); next.push(nw); }
                }
        }
        q = next;
        step++;
    }
    return 0;
}

// ==================== 10. 矩阵中的最长递增路径 ====================
function longestIncreasingPath(matrix) {
    if (!matrix.length) return 0;
    const m = matrix.length, n = matrix[0].length;
    const memo = Array(m).fill(0).map(() => Array(n).fill(0));
    const dfs = (i, j, prev) => {
        if (i < 0 || i >= m || j < 0 || j >= n || matrix[i][j] <= prev) return 0;
        if (memo[i][j]) return memo[i][j];
        const v = matrix[i][j];
        memo[i][j] = 1 + Math.max(dfs(i + 1, j, v), dfs(i - 1, j, v), dfs(i, j + 1, v), dfs(i, j - 1, v));
        return memo[i][j];
    };
    let max = 0;
    for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++) max = Math.max(max, dfs(i, j, -Infinity));
    return max;
}

// ==================== 11. 判断二分图 ====================
function isBipartite(graph) {
    const color = {};
    const dfs = (u, c) => {
        if (color[u] !== undefined) return color[u] === c;
        color[u] = c;
        for (const v of graph[u]) if (!dfs(v, 1 - c)) return false;
        return true;
    };
    for (let i = 0; i < graph.length; i++) if (color[i] === undefined && !dfs(i, 0)) return false;
    return true;
}

// ==================== 12. 太平洋大西洋水流问题 ====================
function pacificAtlantic(heights) {
    if (!heights.length) return [];
    const m = heights.length, n = heights[0].length;
    const pac = new Set(), atl = new Set();
    const dfs = (i, j, set) => {
        const key = i + ',' + j;
        if (set.has(key)) return;
        set.add(key);
        for (const [di, dj] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
            const ni = i + di, nj = j + dj;
            if (ni >= 0 && ni < m && nj >= 0 && nj < n && heights[ni][nj] >= heights[i][j]) dfs(ni, nj, set);
        }
    };
    for (let i = 0; i < m; i++) { dfs(i, 0, pac); dfs(i, n - 1, atl); }
    for (let j = 0; j < n; j++) { dfs(0, j, pac); dfs(m - 1, j, atl); }
    const res = [];
    for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
            if (pac.has(i + ',' + j) && atl.has(i + ',' + j)) res.push([i, j]);
    return res;
}

// ==================== 13. 腐烂的橘子 ====================
function orangesRotting(grid) {
    const m = grid.length, n = grid[0].length;
    let q = [], fresh = 0;
    for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++) {
            if (grid[i][j] === 2) q.push([i, j]);
            else if (grid[i][j] === 1) fresh++;
        }
    let time = 0;
    while (q.length && fresh) {
        const next = [];
        for (const [i, j] of q) {
            for (const [di, dj] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
                const ni = i + di, nj = j + dj;
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && grid[ni][nj] === 1) {
                    grid[ni][nj] = 2;
                    fresh--;
                    next.push([ni, nj]);
                }
            }
        }
        q = next;
        time++;
    }
    return fresh ? -1 : time;
}

// ==================== 14. 蛇与梯子 ====================
function snakesAndLadders(board) {
    const n = board.length;
    const get = (s) => {
        const row = n - 1 - ((s - 1) / n) | 0;
        const col = (s - 1) % n;
        const c = (row + n) % 2 === 0 ? col : n - 1 - col;
        return board[row][c] === -1 ? s : board[row][c];
    };
    const vis = new Set([1]);
    let q = [1], step = 0;
    while (q.length) {
        const next = [];
        for (const cur of q) {
            if (cur === n * n) return step;
            for (let d = 1; d <= 6 && cur + d <= n * n; d++) {
                const nxt = get(cur + d);
                if (!vis.has(nxt)) { vis.add(nxt); next.push(nxt); }
            }
        }
        q = next;
        step++;
    }
    return -1;
}

// ==================== 15. 打开转盘锁 ====================
function openLock(deadends, target) {
    const dead = new Set(deadends);
    if (dead.has('0000')) return -1;
    let q = ['0000'], vis = new Set(['0000']), step = 0;
    while (q.length) {
        const next = [];
        for (const cur of q) {
            if (cur === target) return step;
            for (let i = 0; i < 4; i++) {
                for (const d of [1, -1]) {
                    const digit = (parseInt(cur[i], 10) + d + 10) % 10;
                    const nw = cur.slice(0, i) + digit + cur.slice(i + 1);
                    if (!dead.has(nw) && !vis.has(nw)) { vis.add(nw); next.push(nw); }
                }
            }
        }
        q = next;
        step++;
    }
    return -1;
}

// ==================== 16. 完全平方数（BFS 最短路） ====================
function numSquares(n) {
    let q = [n], step = 0, vis = new Set([n]);
    while (q.length) {
        const next = [];
        for (const cur of q) {
            if (cur === 0) return step;
            for (let i = 1; i * i <= cur; i++) {
                const rest = cur - i * i;
                if (!vis.has(rest)) { vis.add(rest); next.push(rest); }
            }
        }
        q = next;
        step++;
    }
    return -1;
}

// ==================== 17. 最小基因变化 ====================
function minMutation(start, end, bank) {
    const set = new Set(bank);
    if (!set.has(end)) return -1;
    const genes = ['A', 'C', 'G', 'T'];
    let q = [start], step = 0;
    set.delete(start);
    while (q.length) {
        const next = [];
        for (const w of q) {
            if (w === end) return step;
            for (let i = 0; i < 8; i++)
                for (const g of genes) {
                    if (g === w[i]) continue;
                    const nw = w.slice(0, i) + g + w.slice(i + 1);
                    if (set.has(nw)) { set.delete(nw); next.push(nw); }
                }
        }
        q = next;
        step++;
    }
    return -1;
}

// ==================== 18. 网络延迟时间 ====================
function networkDelayTime(times, n, k) {
    const dist = Array(n + 1).fill(Infinity);
    dist[k] = 0;
    for (let i = 0; i < n; i++)
        for (const [u, v, w] of times)
            if (dist[u] !== Infinity && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    let max = 0;
    for (let i = 1; i <= n; i++) { if (dist[i] === Infinity) return -1; max = Math.max(max, dist[i]); }
    return max;
}

// ==================== 19. 重新规划路线 ====================
function minReorder(n, connections) {
    const g = Array(n).fill(0).map(() => []);
    for (const [a, b] of connections) {
        g[a].push([b, 1]);
        g[b].push([a, 0]);
    }
    let count = 0;
    const dfs = (u, parent) => {
        for (const [v, dir] of g[u]) {
            if (v === parent) continue;
            count += dir;
            dfs(v, u);
        }
    };
    dfs(0, -1);
    return count;
}

// ==================== 20. 判断图中是否存在有效路径 ====================
function hasValidPath(grid) {
    const m = grid.length, n = grid[0].length;
    const dirs = { 1: [[0, -1], [0, 1]], 2: [[-1, 0], [1, 0]], 3: [[0, -1], [1, 0]], 4: [[0, 1], [1, 0]], 5: [[0, -1], [-1, 0]], 6: [[0, 1], [-1, 0]] };
    const opp = { '0,1': '0,-1', '0,-1': '0,1', '1,0': '-1,0', '-1,0': '1,0' };
    const vis = new Set();
    const dfs = (i, j) => {
        if (i === m - 1 && j === n - 1) return true;
        vis.add(i + ',' + j);
        for (const [di, dj] of dirs[grid[i][j]] || []) {
            const ni = i + di, nj = j + dj;
            if (ni < 0 || ni >= m || nj < 0 || nj >= n || vis.has(ni + ',' + nj)) continue;
            const nextDirs = dirs[grid[ni][nj]];
            if (!nextDirs) continue;
            const need = opp[di + ',' + dj] || (-di) + ',' + (-dj);
            if (nextDirs.some(([a, b]) => a + ',' + b === need || (-a) + ',' + (-b) === need))
                if (dfs(ni, nj)) return true;
        }
        return false;
    };
    return dfs(0, 0);
}

// ==================== 测试 ====================
function test030401() {
    const assert = (name, got, expect) => {
        const ok = JSON.stringify(got) === JSON.stringify(expect);
        console.log(ok ? `[OK] ${name}` : `[FAIL] ${name} got=${JSON.stringify(got)} expect=${JSON.stringify(expect)}`);
    };
    const g1 = [['1', '1', '1', '1', '0'], ['1', '1', '0', '1', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '0', '0', '0']];
    assert('1. numIslands', numIslands(g1), 1);
    const g2 = [[1, 1, 0, 0, 0], [1, 1, 0, 0, 0], [0, 0, 0, 1, 1], [0, 0, 0, 1, 1]];
    assert('2. maxAreaOfIsland', maxAreaOfIsland(g2), 4);
    assert('5. canFinish', canFinish(2, [[1, 0]]), true);
    assert('6. findOrder', findOrder(2, [[1, 0]]), [0, 1]);
    assert('7. findCircleNum', findCircleNum([[1, 1, 0], [1, 1, 0], [0, 0, 1]]), 2);
    assert('8. findRedundantConnection', findRedundantConnection([[1, 2], [1, 3], [2, 3]]), [2, 3]);
    assert('9. ladderLength', ladderLength('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']), 5);
    assert('10. longestIncreasingPath', longestIncreasingPath([[9, 9, 4], [6, 6, 8], [2, 1, 1]]), 4);
    assert('11. isBipartite', isBipartite([[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]]), false);
    assert('13. orangesRotting', orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]]), 4);
    assert('15. openLock', openLock(['0201', '0101', '0102', '1212', '2002'], '0202'), 6);
    assert('18. networkDelayTime', networkDelayTime([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2), 2);
    assert('19. minReorder', minReorder(6, [[0, 1], [1, 3], [2, 3], [4, 0], [4, 5]]), 3);
    console.log('030401 tests done.');
}
test030401();
