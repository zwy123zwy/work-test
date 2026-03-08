/**
 * 031401 面试算法题（20 道）- 专题：图进阶（依赖/模块图）
 * 日期：2026-03-14
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 找到小镇的法官 ====================
function findJudge(n, trust) {
    const inD = Array(n + 1).fill(0), outD = Array(n + 1).fill(0);
    for (const [a, b] of trust) { outD[a]++; inD[b]++; }
    for (let i = 1; i <= n; i++) if (inD[i] === n - 1 && outD[i] === 0) return i;
    return -1;
}

// ==================== 2. 可能的二分法 ====================
function possibleBipartition(n, dislikes) {
    const g = Array(n + 1).fill(0).map(() => []);
    for (const [a, b] of dislikes) { g[a].push(b); g[b].push(a); }
    const color = {};
    const dfs = (u, c) => {
        if (color[u] !== undefined) return color[u] === c;
        color[u] = c;
        for (const v of g[u]) if (!dfs(v, 1 - c)) return false;
        return true;
    };
    for (let i = 1; i <= n; i++) if (color[i] === undefined && !dfs(i, 0)) return false;
    return true;
}

// ==================== 3. 钥匙和房间 ====================
function canVisitAllRooms(rooms) {
    const vis = new Set([0]);
    const q = [0];
    while (q.length) {
        const u = q.shift();
        for (const v of rooms[u]) if (!vis.has(v)) { vis.add(v); q.push(v); }
    }
    return vis.size === rooms.length;
}

// ==================== 4. 网络延迟时间 ====================
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

// ==================== 5. 判断是否为有向无环图 ====================
function isDAG(n, edges) {
    const ind = Array(n).fill(0);
    const g = Array(n).fill(0).map(() => []);
    for (const [a, b] of edges) { g[a].push(b); ind[b]++; }
    const q = [];
    for (let i = 0; i < n; i++) if (ind[i] === 0) q.push(i);
    let count = 0;
    while (q.length) {
        const u = q.shift();
        count++;
        for (const v of g[u]) if (--ind[v] === 0) q.push(v);
    }
    return count === n;
}

// ==================== 6. 最大网络秩 ====================
function maximalNetworkRank(n, roads) {
    const deg = Array(n).fill(0);
    const conn = new Set();
    for (const [a, b] of roads) { deg[a]++; deg[b]++; conn.add(a + ',' + b); conn.add(b + ',' + a); }
    let max = 0;
    for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++)
            max = Math.max(max, deg[i] + deg[j] - (conn.has(i + ',' + j) ? 1 : 0));
    return max;
}

// ==================== 7. 重新规划路线 ====================
function minReorder(n, connections) {
    const g = Array(n).fill(0).map(() => []);
    for (const [a, b] of connections) {
        g[a].push([b, 1]);
        g[b].push([a, 0]);
    }
    let count = 0;
    const dfs = (u, parent) => {
        for (const [v, dir] of g[u]) if (v !== parent) { count += dir; dfs(v, u); }
    };
    dfs(0, -1);
    return count;
}

// ==================== 8. 节点间通路 ====================
function findWhetherExistsPath(n, graph, start, target) {
    const g = Array(n).fill(0).map(() => []);
    for (const [a, b] of graph) g[a].push(b);
    const vis = new Set();
    const dfs = (u) => {
        if (u === target) return true;
        if (vis.has(u)) return false;
        vis.add(u);
        for (const v of g[u]) if (dfs(v)) return true;
        return false;
    };
    return dfs(start);
}

// ==================== 9. 最小高度树 ====================
function findMinHeightTrees(n, edges) {
    if (n === 1) return [0];
    const deg = Array(n).fill(0);
    const g = Array(n).fill(0).map(() => []);
    for (const [a, b] of edges) {
        g[a].push(b);
        g[b].push(a);
        deg[a]++; deg[b]++;
    }
    let q = [];
    for (let i = 0; i < n; i++) if (deg[i] === 1) q.push(i);
    while (n > 2) {
        const next = [];
        for (const u of q) {
            n--;
            for (const v of g[u]) if (--deg[v] === 1) next.push(v);
        }
        q = next;
    }
    return q;
}

// ==================== 10. 相似字符串组 ====================
function numSimilarGroups(strs) {
    const n = strs.length;
    const parent = Array(n).fill(0).map((_, i) => i);
    const find = x => (parent[x] === x ? x : (parent[x] = find(parent[x])));
    const union = (a, b) => { parent[find(a)] = find(b); };
    const similar = (a, b) => {
        let diff = 0;
        for (let i = 0; i < a.length; i++) if (a[i] !== b[i] && ++diff > 2) return false;
        return true;
    };
    for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++)
            if (similar(strs[i], strs[j])) union(i, j);
    return new Set(parent.map(find)).size;
}

// ==================== 11. 省份数量 ====================
function findCircleNum(isConnected) {
    const n = isConnected.length;
    const vis = new Set();
    const dfs = i => {
        vis.add(i);
        for (let j = 0; j < n; j++) if (isConnected[i][j] && !vis.has(j)) dfs(j);
    };
    let count = 0;
    for (let i = 0; i < n; i++) if (!vis.has(i)) { dfs(i); count++; }
    return count;
}

// ==================== 12. 判断二分图 ====================
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

// ==================== 13. 判断图中是否存在环 ====================
function hasCycle(n, edges) {
    const parent = Array(n).fill(0).map((_, i) => i);
    const find = x => (parent[x] === x ? x : (parent[x] = find(parent[x])));
    for (const [a, b] of edges) {
        if (find(a) === find(b)) return true;
        parent[find(a)] = find(b);
    }
    return false;
}

// ==================== 14. 最小代价连接所有点 ====================
function minCostConnectPoints(points) {
    const n = points.length;
    const dist = (i, j) => Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);
    const edges = [];
    for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++) edges.push([dist(i, j), i, j]);
    edges.sort((a, b) => a[0] - b[0]);
    const parent = Array(n).fill(0).map((_, i) => i);
    const find = x => (parent[x] === x ? x : (parent[x] = find(parent[x])));
    let res = 0, count = 0;
    for (const [w, a, b] of edges) {
        if (find(a) === find(b)) continue;
        parent[find(a)] = find(b);
        res += w;
        if (++count === n - 1) break;
    }
    return res;
}

// ==================== 15. 距离顺序排列矩阵单元格 ====================
function allCellsDistOrder(rows, cols, rCenter, cCenter) {
    const res = [];
    for (let i = 0; i < rows; i++)
        for (let j = 0; j < cols; j++)
            res.push([i, j]);
    res.sort((a, b) =>
        (Math.abs(a[0] - rCenter) + Math.abs(a[1] - cCenter)) -
        (Math.abs(b[0] - rCenter) + Math.abs(b[1] - cCenter)));
    return res;
}

// ==================== 16. 统计参与通信的服务器 ====================
function countServers(grid) {
    const m = grid.length, n = grid[0].length;
    const row = Array(m).fill(0), col = Array(n).fill(0);
    for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
            if (grid[i][j]) { row[i]++; col[j]++; }
    let count = 0;
    for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
            if (grid[i][j] && (row[i] > 1 || col[j] > 1)) count++;
    return count;
}

// ==================== 17. 最大人工岛 ====================
function largestIsland(grid) {
    const n = grid.length;
    const dfs = (i, j, id) => {
        if (i < 0 || i >= n || j < 0 || j >= n || grid[i][j] !== 1) return 0;
        grid[i][j] = id;
        return 1 + dfs(i + 1, j, id) + dfs(i - 1, j, id) + dfs(i, j + 1, id) + dfs(i, j - 1, id);
    };
    const sizes = {};
    let id = 2;
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
            if (grid[i][j] === 1) { sizes[id] = dfs(i, j, id); id++; }
    let max = Math.max(0, ...Object.values(sizes));
    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
            if (grid[i][j] !== 0) continue;
            const set = new Set();
            for (const [di, dj] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
                const ni = i + di, nj = j + dj;
                if (ni >= 0 && ni < n && nj >= 0 && nj < n && grid[ni][nj] > 1) set.add(grid[ni][nj]);
            }
            let sum = 1;
            for (const x of set) sum += sizes[x];
            max = Math.max(max, sum);
        }
    return max;
}

// ==================== 18. 统计封闭岛屿的数目 ====================
function closedIsland(grid) {
    const m = grid.length, n = grid[0].length;
    const dfs = (i, j) => {
        if (i < 0 || i >= m || j < 0 || j >= n) return false;
        if (grid[i][j] !== 0) return true;
        grid[i][j] = 1;
        const a = dfs(i + 1, j), b = dfs(i - 1, j), c = dfs(i, j + 1), d = dfs(i, j - 1);
        return a && b && c && d;
    };
    let count = 0;
    for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
            if (grid[i][j] === 0 && dfs(i, j)) count++;
    return count;
}

// ==================== 19. 克隆图 ====================
function cloneGraph(node) {
    if (!node) return null;
    const map = new Map();
    const dfs = n => {
        if (map.has(n)) return map.get(n);
        const c = { val: n.val, neighbors: [] };
        map.set(n, c);
        for (const nb of n.neighbors) c.neighbors.push(dfs(nb));
        return c;
    };
    return dfs(node);
}

// ==================== 20. 等式方程的可满足性 ====================
function equationsPossible(equations) {
    const parent = Array(26).fill(0).map((_, i) => i);
    const find = x => (parent[x] === x ? x : (parent[x] = find(parent[x])));
    for (const eq of equations) {
        if (eq[1] !== '=') continue;
        const a = eq[0].charCodeAt(0) - 97, b = eq[3].charCodeAt(0) - 97;
        parent[find(a)] = find(b);
    }
    for (const eq of equations) {
        if (eq[1] !== '!') continue;
        const a = eq[0].charCodeAt(0) - 97, b = eq[3].charCodeAt(0) - 97;
        if (find(a) === find(b)) return false;
    }
    return true;
}

// ==================== 测试 ====================
function test031401() {
    const assert = (n, a, e) => console.log(JSON.stringify(a) === JSON.stringify(e) ? `[OK] ${n}` : `[FAIL] ${n}`);
    assert('1', findJudge(2, [[1, 2]]), 2);
    assert('3', canVisitAllRooms([[1], [2], [3], []]), true);
    assert('11', findCircleNum([[1, 1, 0], [1, 1, 0], [0, 0, 1]]), 2);
    assert('15', allCellsDistOrder(1, 2, 0, 0).length, 2);
    assert('20', equationsPossible(['a==b', 'b!=a']), false);
    console.log('031401 tests done.');
}
test031401();
