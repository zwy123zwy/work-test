/**
 * 021801 面试算法题（20 道）- 专题：图与 BFS/DFS
 * 日期：2026-02-18
 * 规则：仅题干、输入输出与约束；个人完成后再补充解答与测试用例。
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 课程表 ====================
// 题干：numCourses 门课，prerequisites[i]=[a,b] 表示选 a 须先选 b。判断能否完成所有课程。
// 输入：numCourses: number, prerequisites: number[][]
// 输出：boolean
// 约束：拓扑排序，检测有向图是否有环

function canFinish(numCourses, prerequisites) {
    const ind = new Array(numCourses).fill(0), g = Array(numCourses).fill(0).map(() => []);
    for (const [a, b] of prerequisites) { g[b].push(a); ind[a]++; }
    const q = []; for (let i = 0; i < numCourses; i++) if (ind[i] === 0) q.push(i);
    let count = 0;
    while (q.length) {
        const u = q.shift(); count++;
        for (const v of g[u]) if (--ind[v] === 0) q.push(v);
    }
    return count === numCourses;
}

// ==================== 2. 课程表 II ====================
// 题干：同上，返回一种完成顺序；无法完成返回 []。
// 输入：numCourses: number, prerequisites: number[][]
// 输出：number[]
// 约束：拓扑排序

function findOrder(numCourses, prerequisites) {
    const ind = new Array(numCourses).fill(0), g = Array(numCourses).fill(0).map(() => []);
    for (const [a, b] of prerequisites) { g[b].push(a); ind[a]++; }
    const q = [], order = [];
    for (let i = 0; i < numCourses; i++) if (ind[i] === 0) q.push(i);
    while (q.length) {
        const u = q.shift(); order.push(u);
        for (const v of g[u]) if (--ind[v] === 0) q.push(v);
    }
    return order.length === numCourses ? order : [];
}

// ==================== 3. 克隆图 ====================
// 题干：无向连通图，节点含 val 和 neighbors。深拷贝整张图。
// 输入：node: Node | null（val, neighbors[]）
// 输出：Node | null
// 约束：BFS/DFS + 哈希

function cloneGraph(node) {
    if (!node) return null;
    const map = new Map();
    const dfs = (n) => {
        if (map.has(n.val)) return map.get(n.val);
        const copy = { val: n.val, neighbors: [] };
        map.set(n.val, copy);
        for (const nb of n.neighbors) copy.neighbors.push(dfs(nb));
        return copy;
    };
    return dfs(node);
}

// ==================== 4. 岛屿数量 ====================
// 题干：grid 中 '1' 为陆地，'0' 为水，上下左右相连为同一岛。求岛屿数量。
// 输入：grid: string[][] 或 number[][]
// 输出：number
// 约束：DFS/BFS 标记

function numIslands(grid) {
    let count = 0;
    const R = grid.length, C = grid[0].length;
    const dfs = (r, c) => {
        if (r < 0 || r >= R || c < 0 || c >= C || grid[r][c] !== '1') return;
        grid[r][c] = '0';
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
    };
    for (let r = 0; r < R; r++)
        for (let c = 0; c < C; c++)
            if (grid[r][c] === '1') { count++; dfs(r, c); }
    return count;
}

// ==================== 5. 岛屿的最大面积 ====================
// 题干：同上，求最大岛屿面积（1 的个数）。
// 输入：grid: number[][]
// 输出：number
// 约束：DFS/BFS

function maxAreaOfIsland(grid) {
    let max = 0;
    const R = grid.length, C = grid[0].length;
    const dfs = (r, c) => {
        if (r < 0 || r >= R || c < 0 || c >= C || grid[r][c] !== 1) return 0;
        grid[r][c] = 0;
        return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1);
    };
    for (let r = 0; r < R; r++)
        for (let c = 0; c < C; c++)
            if (grid[r][c] === 1) max = Math.max(max, dfs(r, c));
    return max;
}

// ==================== 6. 被围绕的区域 ====================
// 题干：二维字符 'X'/'O'，将与边界上 'O' 相连的 'O' 保留，其余 'O' 替换为 'X'。
// 输入：board: string[][]（原地修改）
// 输出：无
// 约束：从边界 DFS

function solve(board) {
    const R = board.length, C = board[0]?.length || 0;
    const dfs = (r, c) => {
        if (r < 0 || r >= R || c < 0 || c >= C || board[r][c] !== 'O') return;
        board[r][c] = '#';
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
    };
    for (let r = 0; r < R; r++) { dfs(r, 0); dfs(r, C - 1); }
    for (let c = 0; c < C; c++) { dfs(0, c); dfs(R - 1, c); }
    for (let r = 0; r < R; r++)
        for (let c = 0; c < C; c++)
            board[r][c] = board[r][c] === '#' ? 'O' : 'X';
}

// ==================== 7. 太平洋大西洋水流问题 ====================
// 题干：矩阵 heights，雨水从高流向低。返回既能流向太平洋又能流向大西洋的格子坐标。
// 输入：heights: number[][]
// 输出：number[][]
// 约束：从两个边界分别 DFS/BFS，取交集

function pacificAtlantic(heights) {
    const R = heights.length, C = heights[0].length;
    const pac = new Set(), atl = new Set();
    const dfs = (r, c, set) => {
        if (r < 0 || r >= R || c < 0 || c >= C || set.has(r + ',' + c)) return;
        set.add(r + ',' + c);
        const h = heights[r][c];
        if (r > 0 && heights[r - 1][c] >= h) dfs(r - 1, c, set);
        if (r < R - 1 && heights[r + 1][c] >= h) dfs(r + 1, c, set);
        if (c > 0 && heights[r][c - 1] >= h) dfs(r, c - 1, set);
        if (c < C - 1 && heights[r][c + 1] >= h) dfs(r, c + 1, set);
    };
    for (let r = 0; r < R; r++) { dfs(r, 0, pac); dfs(r, C - 1, atl); }
    for (let c = 0; c < C; c++) { dfs(0, c, pac); dfs(R - 1, c, atl); }
    const res = [];
    for (let r = 0; r < R; r++)
        for (let c = 0; c < C; c++)
            if (pac.has(r + ',' + c) && atl.has(r + ',' + c)) res.push([r, c]);
    return res;
}

// ==================== 8. 冗余连接 ====================
// 题干：树加一条边形成无向图，edges 给出所有边。删除一条边使图变回树，返回可删的边（多解返回最后出现的）。
// 输入：edges: number[][]
// 输出：number[]
// 约束：并查集

function findRedundantConnection(edges) {
    const n = edges.length, parent = Array(n + 1).fill(0).map((_, i) => i);
    const find = x => parent[x] === x ? x : (parent[x] = find(parent[x]));
    const union = (a, b) => { const pa = find(a), pb = find(b); if (pa === pb) return false; parent[pa] = pb; return true; };
    for (const [u, v] of edges) if (!union(u, v)) return [u, v];
    return [];
}

// ==================== 9. 冗余连接 II ====================
// 题干：有根树加一条有向边形成有向图，删除一条边使图变回有根树，返回可删的边。
// 输入：edges: number[][]
// 输出：number[]
// 约束：并查集，分入度为 2 和环两种情况

function findRedundantDirectedConnection(edges) {
    const n = edges.length;
    const parent = Array(n + 1).fill(0).map((_, i) => i);
    let dupParent = null, cycleEdge = null;
    const find = x => parent[x] === x ? x : (parent[x] = find(parent[x]));
    const union = (a, b) => { const pa = find(a), pb = find(b); if (pa === pb) return false; parent[pa] = pb; return true; };
    const inDeg = new Array(n + 1).fill(0);
    for (const [u, v] of edges) { inDeg[v]++; if (inDeg[v] === 2) dupParent = v; }
    for (const [u, v] of edges) {
        if (dupParent === v) continue;
        if (!union(u, v)) cycleEdge = [u, v];
    }
    if (!dupParent) return cycleEdge;
    for (let i = edges.length - 1; i >= 0; i--)
        if (edges[i][1] === dupParent) {
            const copy = edges.map(([a, b]) => [a, b]);
            for (let j = 0; j < n + 1; j++) parent[j] = j;
            for (let j = 0; j < edges.length; j++)
                if (j !== i && !union(copy[j][0], copy[j][1])) return edges[i];
            return edges[i];
        }
    return [];
}

// ==================== 10. 判断二分图 ====================
// 题干：无向图，能否将节点分成两组使每条边两端节点在不同组。
// 输入：graph: number[][]（邻接表）
// 输出：boolean
// 约束：BFS/DFS 染色

function isBipartite(graph) {
    const n = graph.length, color = new Array(n).fill(-1);
    for (let i = 0; i < n; i++) {
        if (color[i] >= 0) continue;
        const q = [i]; color[i] = 0;
        while (q.length) {
            const u = q.shift();
            for (const v of graph[u]) {
                if (color[v] === color[u]) return false;
                if (color[v] < 0) { color[v] = 1 - color[u]; q.push(v); }
            }
        }
    }
    return true;
}

// ==================== 11. 01 矩阵 ====================
// 题干：二维 0/1 矩阵，返回每个格到最近 0 的距离（曼哈顿距离）。
// 输入：mat: number[][]
// 输出：number[][]
// 约束：多源 BFS 从所有 0 出发

function updateMatrix(mat) {
    const R = mat.length, C = mat[0].length;
    const q = [], dist = Array(R).fill(0).map(() => Array(C).fill(Infinity));
    for (let r = 0; r < R; r++)
        for (let c = 0; c < C; c++)
            if (mat[r][c] === 0) { q.push([r, c]); dist[r][c] = 0; }
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (q.length) {
        const [r, c] = q.shift();
        for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && dist[nr][nc] > dist[r][c] + 1) {
                dist[nr][nc] = dist[r][c] + 1;
                q.push([nr, nc]);
            }
        }
    }
    return dist;
}

// ==================== 12. 腐烂的橘子 ====================
// 题干：网格，0 空格，1 新鲜橘子，2 腐烂橘子。每分钟腐烂橘子使相邻新鲜橘子腐烂。求全部腐烂所需分钟数，无法则 -1。
// 输入：grid: number[][]
// 输出：number
// 约束：多源 BFS

function orangesRotting(grid) {
    const R = grid.length, C = grid[0].length;
    const q = []; let fresh = 0;
    for (let r = 0; r < R; r++)
        for (let c = 0; c < C; c++) {
            if (grid[r][c] === 2) q.push([r, c, 0]);
            else if (grid[r][c] === 1) fresh++;
        }
    let maxT = 0;
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (q.length) {
        const [r, c, t] = q.shift();
        maxT = Math.max(maxT, t);
        for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] === 1) {
                grid[nr][nc] = 2; fresh--;
                q.push([nr, nc, t + 1]);
            }
        }
    }
    return fresh === 0 ? maxT : -1;
}

// ==================== 13. 打开转盘锁 ====================
// 题干：四位数字锁 "0000"，每次可转一位（+1 或 -1），deadends 为禁止状态，target 为目标。求最少转动次数。
// 输入：deadends: string[], target: string
// 输出：number
// 约束：BFS 最短路径

function openLock(deadends, target) {
    const dead = new Set(deadends);
    if (dead.has('0000')) return -1;
    const q = [['0000', 0]];
    const seen = new Set(['0000']);
    while (q.length) {
        const [cur, step] = q.shift();
        if (cur === target) return step;
        for (let i = 0; i < 4; i++) {
            for (const d of [1, -1]) {
                const next = cur.slice(0, i) + ((Number(cur[i]) + d + 10) % 10) + cur.slice(i + 1);
                if (dead.has(next) || seen.has(next)) continue;
                seen.add(next);
                q.push([next, step + 1]);
            }
        }
    }
    return -1;
}

// ==================== 14. 完全平方数 ====================
// 题干：正整数 n，求最少需要几个完全平方数相加等于 n。
// 输入：n: number
// 输出：number
// 约束：BFS 层数或 DP

function numSquares(n) {
    const q = [n], seen = new Set([n]);
    let step = 0;
    while (q.length) {
        step++;
        const size = q.length;
        for (let i = 0; i < size; i++) {
            const x = q.shift();
            for (let j = 1; j * j <= x; j++) {
                const next = x - j * j;
                if (next === 0) return step;
                if (!seen.has(next)) { seen.add(next); q.push(next); }
            }
        }
    }
    return n;
}

// ==================== 15. 最小基因变化 ====================
// 题干：基因串由 8 个字符组成，每次可变一个字符。start、end、bank。求 start 到 end 最少变化次数。
// 输入：start: string, end: string, bank: string[]
// 输出：number
// 约束：BFS

function minMutation(start, end, bank) {
    const set = new Set(bank);
    if (!set.has(end)) return -1;
    const q = [[start, 0]];
    const genes = ['A', 'C', 'G', 'T'];
    while (q.length) {
        const [cur, step] = q.shift();
        if (cur === end) return step;
        for (let i = 0; i < 8; i++) {
            for (const g of genes) {
                if (g === cur[i]) continue;
                const next = cur.slice(0, i) + g + cur.slice(i + 1);
                if (set.has(next)) { set.delete(next); q.push([next, step + 1]); }
            }
        }
    }
    return -1;
}

// ==================== 16. 单词接龙 ====================
// 题干：beginWord、endWord、wordList。每次变一个字母，求 beginWord 到 endWord 的最短序列长度。
// 输入：beginWord: string, endWord: string, wordList: string[]
// 输出：number
// 约束：BFS

function ladderLength(beginWord, endWord, wordList) {
    const set = new Set(wordList);
    if (!set.has(endWord)) return 0;
    const q = [[beginWord, 1]];
    while (q.length) {
        const [w, len] = q.shift();
        if (w === endWord) return len;
        for (let i = 0; i < w.length; i++) {
            for (let c = 97; c <= 122; c++) {
                const next = w.slice(0, i) + String.fromCharCode(c) + w.slice(i + 1);
                if (set.has(next)) { set.delete(next); q.push([next, len + 1]); }
            }
        }
    }
    return 0;
}

// ==================== 17. 单词接龙 II ====================
// 题干：同上，返回所有最短转换序列。
// 输入：beginWord: string, endWord: string, wordList: string[]
// 输出：string[][]
// 约束：BFS 记录路径 + 回溯

function findLadders(beginWord, endWord, wordList) {
    const wordSet = new Set(wordList);
    if (!wordSet.has(endWord)) return [];
    let layer = new Map();
    layer.set(beginWord, [[beginWord]]);
    while (layer.size) {
        const nextLayer = new Map();
        for (const [w, paths] of layer) {
            if (w === endWord) return paths;
            for (let i = 0; i < w.length; i++) {
                for (let c = 97; c <= 122; c++) {
                    const nw = w.slice(0, i) + String.fromCharCode(c) + w.slice(i + 1);
                    if (!wordSet.has(nw)) continue;
                    for (const p of paths) {
                        const newPath = [...p, nw];
                        if (!nextLayer.has(nw)) nextLayer.set(nw, []);
                        nextLayer.get(nw).push(newPath);
                    }
                }
            }
        }
        for (const w of nextLayer.keys()) wordSet.delete(w);
        layer = nextLayer;
    }
    return [];
}

// ==================== 18. 并查集模板 ====================
// 题干：实现并查集，支持 find、union、connected。
// 输入：n: number（元素 0~n-1）
// 输出：UnionFind 类
// 约束：路径压缩 + 按秩合并

class UnionFind {
    constructor(n) {
        this.parent = Array(n).fill(0).map((_, i) => i);
        this.rank = new Array(n).fill(0);
    }
    find(x) { return this.parent[x] === x ? x : (this.parent[x] = this.find(this.parent[x])); }
    union(a, b) {
        const pa = this.find(a), pb = this.find(b);
        if (pa === pb) return false;
        if (this.rank[pa] < this.rank[pb]) this.parent[pa] = pb;
        else if (this.rank[pa] > this.rank[pb]) this.parent[pb] = pa;
        else { this.parent[pb] = pa; this.rank[pa]++; }
        return true;
    }
    connected(a, b) { return this.find(a) === this.find(b); }
}

// ==================== 19. 省份数量 ====================
// 题干：n 个城市，isConnected[i][j]=1 表示 i、j 相连。省份为直接或间接相连的城市组。求省份数。
// 输入：isConnected: number[][]
// 输出：number
// 约束：并查集或 DFS

function findCircleNum(isConnected) {
    const n = isConnected.length;
    const uf = new UnionFind(n);
    for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++)
            if (isConnected[i][j]) uf.union(i, j);
    const roots = new Set();
    for (let i = 0; i < n; i++) roots.add(uf.find(i));
    return roots.size;
}

// ==================== 20. 网络延迟时间 ====================
// 题干：n 个节点，times[i]=[u,v,w] 表示 u 到 v 需 w。从 k 发出信号，求所有节点收到信号的最短时间；无法全部收到返回 -1。
// 输入：times: number[][], n: number, k: number
// 输出：number
// 约束：Dijkstra 或 Bellman-Ford

function networkDelayTime(times, n, k) {
    const g = Array(n + 1).fill(0).map(() => []);
    for (const [u, v, w] of times) g[u].push([v, w]);
    const dist = new Array(n + 1).fill(Infinity);
    dist[k] = 0;
    const pq = [[0, k]];
    while (pq.length) {
        pq.sort((a, b) => b[0] - a[0]);
        const [d, u] = pq.pop();
        if (d > dist[u]) continue;
        for (const [v, w] of g[u]) {
            if (dist[v] > dist[u] + w) {
                dist[v] = dist[u] + w;
                pq.push([dist[v], v]);
            }
        }
    }
    let max = 0;
    for (let i = 1; i <= n; i++) { if (dist[i] === Infinity) return -1; max = Math.max(max, dist[i]); }
    return max;
}
