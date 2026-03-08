/**
 * 031201 面试算法题（20 道）- 专题：数组高级（数据流/分页）
 * 日期：2026-03-12
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 旋转图像 ====================
function rotate(matrix) {
    const n = matrix.length;
    for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++) [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    matrix.forEach(row => row.reverse());
}

// ==================== 2. 螺旋矩阵 III ====================
function spiralMatrixIII(rows, cols, rStart, cStart) {
    const res = [[rStart, cStart]];
    let r = rStart, c = cStart, step = 1;
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    let d = 0;
    while (res.length < rows * cols) {
        for (let _ = 0; _ < 2; _++) {
            for (let i = 0; i < step; i++) {
                r += dirs[d][0]; c += dirs[d][1];
                if (r >= 0 && r < rows && c >= 0 && c < cols) res.push([r, c]);
            }
            d = (d + 1) % 4;
        }
        step++;
    }
    return res;
}

// ==================== 3. 重塑矩阵 ====================
function matrixReshape(mat, r, c) {
    const m = mat.length, n = mat[0].length;
    if (m * n !== r * c) return mat;
    const flat = mat.flat();
    const res = [];
    for (let i = 0; i < r; i++) res.push(flat.slice(i * c, (i + 1) * c));
    return res;
}

// ==================== 4. 转置矩阵 ====================
function transpose(matrix) {
    const m = matrix.length, n = matrix[0].length;
    return Array.from({ length: n }, (_, j) => Array.from({ length: m }, (_, i) => matrix[i][j]));
}

// ==================== 5. 搜索二维矩阵 II ====================
function searchMatrix2(matrix, target) {
    let i = 0, j = matrix[0].length - 1;
    while (i < matrix.length && j >= 0) {
        if (matrix[i][j] === target) return true;
        matrix[i][j] > target ? j-- : i++;
    }
    return false;
}

// ==================== 6. 托普利茨矩阵 ====================
function isToeplitzMatrix(matrix) {
    for (let i = 0; i < matrix.length - 1; i++)
        for (let j = 0; j < matrix[0].length - 1; j++)
            if (matrix[i][j] !== matrix[i + 1][j + 1]) return false;
    return true;
}

// ==================== 7. 数组中的第 K 个最大元素 ====================
function findKthLargest(nums, k) {
    const partition = (lo, hi) => {
        const pivot = nums[hi];
        let i = lo;
        for (let j = lo; j < hi; j++) if (nums[j] >= pivot) [nums[i], nums[j]] = [nums[j], nums[i]], i++;
        [nums[i], nums[hi]] = [nums[hi], nums[i]];
        return i;
    };
    let lo = 0, hi = nums.length - 1;
    k--;
    while (true) {
        const p = partition(lo, hi);
        if (p === k) return nums[p];
        p < k ? lo = p + 1 : hi = p - 1;
    }
}

// ==================== 8. 前 K 个高频元素 ====================
function topKFrequent(nums, k) {
    const cnt = {};
    for (const x of nums) cnt[x] = (cnt[x] || 0) + 1;
    return Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, k).map(([v]) => +v);
}

// ==================== 9. 合并区间 ====================
function merge(intervals) {
    if (!intervals.length) return [];
    intervals.sort((a, b) => a[0] - b[0]);
    const res = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] <= res[res.length - 1][1])
            res[res.length - 1][1] = Math.max(res[res.length - 1][1], intervals[i][1]);
        else res.push(intervals[i]);
    }
    return res;
}

// ==================== 10. 插入区间 ====================
function insert(intervals, newInterval) {
    const res = [];
    let i = 0;
    while (i < intervals.length && intervals[i][1] < newInterval[0]) res.push(intervals[i++]);
    while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    res.push(newInterval);
    while (i < intervals.length) res.push(intervals[i++]);
    return res;
}

// ==================== 11. 轮转数组 ====================
function rotateArray(nums, k) {
    k = k % nums.length;
    const rev = (a, b) => { while (a < b) [nums[a], nums[b]] = [nums[b], nums[a]], a++, b--; };
    rev(0, nums.length - 1);
    rev(0, k - 1);
    rev(k, nums.length - 1);
}

// ==================== 12. 寻找重复数 ====================
function findDuplicate(nums) {
    let slow = nums[0], fast = nums[nums[0]];
    while (slow !== fast) { slow = nums[slow]; fast = nums[nums[fast]]; }
    slow = 0;
    while (slow !== fast) { slow = nums[slow]; fast = nums[fast]; }
    return slow;
}

// ==================== 13. 移动零 ====================
function moveZeroes(nums) {
    let k = 0;
    for (let i = 0; i < nums.length; i++) if (nums[i] !== 0) nums[k++] = nums[i];
    while (k < nums.length) nums[k++] = 0;
}

// ==================== 14. 除自身以外数组的乘积 ====================
function productExceptSelf(nums) {
    const n = nums.length;
    const res = Array(n).fill(1);
    for (let i = 1; i < n; i++) res[i] = res[i - 1] * nums[i - 1];
    let suf = 1;
    for (let i = n - 1; i >= 0; i--) { res[i] *= suf; suf *= nums[i]; }
    return res;
}

// ==================== 15. 螺旋矩阵 IV ====================
function spiralMatrix(head) {
    const res = [];
    let p = head;
    while (p) { res.push(p.val); p = p.next; }
    const m = Math.ceil(Math.sqrt(res.length)), n = m;
    const mat = Array(m).fill(0).map(() => Array(n).fill(-1));
    let idx = 0, r = 0, c = 0, dr = 0, dc = 1;
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    for (let i = 0; i < res.length; i++) {
        mat[r][c] = res[i];
        let nr = r + dirs[idx][0], nc = c + dirs[idx][1];
        if (nr < 0 || nr >= m || nc < 0 || nc >= n || mat[nr][nc] !== -1) {
            idx = (idx + 1) % 4;
            nr = r + dirs[idx][0]; nc = c + dirs[idx][1];
        }
        r = nr; c = nc;
    }
    return mat;
}

// ==================== 16. 数据流中的第 K 大元素 ====================
class KthLargest {
    constructor(k, nums) {
        this.k = k;
        this.nums = nums.sort((a, b) => a - b);
    }
    add(val) {
        const idx = this.nums.findIndex(x => x >= val);
        this.nums.splice(idx < 0 ? this.nums.length : idx, 0, val);
        return this.nums[this.nums.length - this.k];
    }
}

// ==================== 17. 打乱数组 ====================
class Solution {
    constructor(nums) { this.orig = [...nums]; this.nums = nums; }
    reset() { this.nums = [...this.orig]; return this.nums; }
    shuffle() {
        for (let i = this.nums.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.nums[i], this.nums[j]] = [this.nums[j], this.nums[i]];
        }
        return this.nums;
    }
}

// ==================== 18. 缺失的第一个正数 ====================
function firstMissingPositive(nums) {
    const n = nums.length;
    for (let i = 0; i < n; i++)
        while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i])
            [nums[nums[i] - 1], nums[i]] = [nums[i], nums[nums[i] - 1]];
    for (let i = 0; i < n; i++) if (nums[i] !== i + 1) return i + 1;
    return n + 1;
}

// ==================== 19. 盛最多水的容器 ====================
function maxArea(height) {
    let i = 0, j = height.length - 1, max = 0;
    while (i < j) {
        max = Math.max(max, Math.min(height[i], height[j]) * (j - i));
        height[i] < height[j] ? i++ : j--;
    }
    return max;
}

// ==================== 20. 接雨水 ====================
function trap(height) {
    let l = 0, r = height.length - 1, lmax = 0, rmax = 0, res = 0;
    while (l < r) {
        if (height[l] < height[r]) {
            if (height[l] >= lmax) lmax = height[l];
            else res += lmax - height[l];
            l++;
        } else {
            if (height[r] >= rmax) rmax = height[r];
            else res += rmax - height[r];
            r--;
        }
    }
    return res;
}

// ==================== 测试 ====================
function test031201() {
    const assert = (n, a, e) => console.log(JSON.stringify(a) === JSON.stringify(e) ? `[OK] ${n}` : `[FAIL] ${n}`);
    assert('3', matrixReshape([[1, 2], [3, 4]], 1, 4), [[1, 2, 3, 4]]);
    assert('5', searchMatrix2([[1, 4, 7], [2, 5, 8], [3, 6, 9]], 5), true);
    assert('7', findKthLargest([3, 2, 1, 5, 6, 4], 2), 5);
    assert('9', merge([[1, 3], [2, 6], [8, 10]]), [[1, 6], [8, 10]]);
    assert('13', (() => { const n = [0, 1, 0, 3, 12]; moveZeroes(n); return n; })(), [1, 3, 12, 0, 0]);
    assert('18', firstMissingPositive([3, 4, -1, 1]), 2);
    assert('19', maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
    console.log('031201 tests done.');
}
test031201();
