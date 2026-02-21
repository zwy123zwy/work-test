/**
 * 021901 面试算法题（20 道）- 专题：二分查找与贪心
 * 日期：2026-02-19
 * 规则：仅题干、输入输出与约束；个人完成后再补充解答与测试用例。
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 二分查找 ====================
// 题干：升序 nums 和 target，存在返回下标，否则 -1。
// 输入：nums: number[], target: number
// 输出：number
// 约束：O(log n)

function search(nums, target) {
    let lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

// ==================== 2. 搜索插入位置 ====================
// 题干：升序 nums 和 target，存在返回下标，否则返回插入位置使仍有序。
// 输入：nums: number[], target: number
// 输出：number
// 约束：二分找左边界

function searchInsert(nums, target) {
    let lo = 0, hi = nums.length;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

// ==================== 3. 在排序数组中查找元素的第一个和最后一个位置 ====================
// 题干：非递减 nums 和 target，返回 target 的起始和结束下标，不存在返回 [-1,-1]。
// 输入：nums: number[], target: number
// 输出：number[]
// 约束：二分找左右边界

function searchRange(nums, target) {
    const lb = (t) => { let lo = 0, hi = nums.length; while (lo < hi) { const m = (lo + hi) >> 1; if (nums[m] < t) lo = m + 1; else hi = m; } return lo; };
    const left = lb(target);
    if (left >= nums.length || nums[left] !== target) return [-1, -1];
    return [left, lb(target + 1) - 1];
}

// ==================== 4. 搜索旋转排序数组 ====================
// 题干：旋转后的升序 nums（无重复），查找 target 的下标，不存在 -1。
// 输入：nums: number[], target: number
// 输出：number
// 约束：二分 O(log n)

function searchRotated(nums, target) {
    let lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] === target) return mid;
        if (nums[mid] >= nums[lo]) {
            if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}

// ==================== 5. 寻找旋转排序数组中的最小值 ====================
// 题干：旋转后的升序 nums（无重复），返回最小元素。
// 输入：nums: number[]
// 输出：number
// 约束：二分

function findMin(nums) {
    let lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] > nums[hi]) lo = mid + 1;
        else hi = mid;
    }
    return nums[lo];
}

// ==================== 6. 搜索二维矩阵 ====================
// 题干：每行升序、每行首大于上行末的二维矩阵，判断 target 是否存在。
// 输入：matrix: number[][], target: number
// 输出：boolean
// 约束：二分或从左下角走

function searchMatrix(matrix, target) {
    const R = matrix.length, C = matrix[0]?.length || 0;
    let r = R - 1, c = 0;
    while (r >= 0 && c < C) {
        if (matrix[r][c] === target) return true;
        if (matrix[r][c] > target) r--;
        else c++;
    }
    return false;
}

// ==================== 7. x 的平方根 ====================
// 题干：非负 x，返回算术平方根的整数部分。
// 输入：x: number
// 输出：number
// 约束：二分 O(log x)

function mySqrt(x) {
    if (x <= 1) return x;
    let lo = 1, hi = x;
    while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (mid * mid <= x) lo = mid;
        else hi = mid - 1;
    }
    return lo;
}

// ==================== 8. 跳跃游戏 ====================
// 题干：nums[i] 表示从 i 最多跳 nums[i] 步。判断能否从下标 0 跳到最后一格。
// 输入：nums: number[]
// 输出：boolean
// 约束：贪心，维护最远可达

function canJump(nums) {
    let far = 0;
    for (let i = 0; i < nums.length && i <= far; i++)
        far = Math.max(far, i + nums[i]);
    return far >= nums.length - 1;
}

// ==================== 9. 跳跃游戏 II ====================
// 题干：同上，求最少跳跃次数。
// 输入：nums: number[]
// 输出：number
// 约束：贪心

function jump(nums) {
    let end = 0, far = 0, steps = 0;
    for (let i = 0; i < nums.length - 1; i++) {
        far = Math.max(far, i + nums[i]);
        if (i === end) { steps++; end = far; }
    }
    return steps;
}

// ==================== 10. 分配饼干 ====================
// 题干：孩子 g[i] 胃口，饼干 s[j] 尺寸。s[j]>=g[i] 可满足。求最多满足几个孩子。
// 输入：g: number[], s: number[]
// 输出：number
// 约束：贪心，排序后双指针

function findContentChildren(g, s) {
    g.sort((a, b) => a - b); s.sort((a, b) => a - b);
    let i = 0, j = 0;
    while (i < g.length && j < s.length) {
        if (s[j] >= g[i]) i++;
        j++;
    }
    return i;
}

// ==================== 11. 用最少数量的箭引爆气球 ====================
// 题干：区间 points[i]=[start,end]，垂直射箭可引爆重叠区间内的气球。求最少箭数。
// 输入：points: number[][]
// 输出：number
// 约束：按右端点排序，贪心

function findMinArrowShots(points) {
    if (!points.length) return 0;
    points.sort((a, b) => a[1] - b[1]);
    let end = points[0][1], count = 1;
    for (let i = 1; i < points.length; i++) {
        if (points[i][0] > end) { count++; end = points[i][1]; }
    }
    return count;
}

// ==================== 12. 无重叠区间 ====================
// 题干：区间数组，移除最小区间数使剩余区间互不重叠。
// 输入：intervals: number[][]
// 输出：number
// 约束：按右端点排序，贪心

function eraseOverlapIntervals(intervals) {
    if (!intervals.length) return 0;
    intervals.sort((a, b) => a[1] - b[1]);
    let end = intervals[0][1], remove = 0;
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < end) remove++;
        else end = intervals[i][1];
    }
    return remove;
}

// ==================== 13. 划分字母区间 ====================
// 题干：字符串 s，划分尽可能多片段使同一字母只出现在一个片段。返回各片段长度列表。
// 输入：s: string
// 输出：number[]
// 约束：记录每个字符最后出现位置，贪心

function partitionLabels(s) {
    const last = {};
    for (let i = 0; i < s.length; i++) last[s[i]] = i;
    const res = [];
    let start = 0, end = 0;
    for (let i = 0; i < s.length; i++) {
        end = Math.max(end, last[s[i]]);
        if (i === end) { res.push(end - start + 1); start = i + 1; }
    }
    return res;
}

// ==================== 14. 加油站 ====================
// 题干：环路上加油站 gas[i] 和耗油 cost[i]，从某站出发能绕一圈返回起点，返回起始下标；无法则 -1。
// 输入：gas: number[], cost: number[]
// 输出：number
// 约束：贪心，若总 gas>=总 cost 必有解

function canCompleteCircuit(gas, cost) {
    let sum = 0, tank = 0, start = 0;
    for (let i = 0; i < gas.length; i++) {
        sum += gas[i] - cost[i];
        tank += gas[i] - cost[i];
        if (tank < 0) { tank = 0; start = i + 1; }
    }
    return sum >= 0 ? start : -1;
}

// ==================== 15. 监控二叉树 ====================
// 题干：二叉树节点放摄像头可监控父、自身、子。求覆盖所有节点所需最少摄像头数。
// 输入：root: TreeNode | null
// 输出：number
// 约束：贪心/树形 DP，自底向上

function minCameraCover(root) {
    let cameras = 0;
    const dfs = (r) => {
        if (!r) return 2;
        const L = dfs(r.left), R = dfs(r.right);
        if (L === 0 || R === 0) { cameras++; return 1; }
        if (L === 1 || R === 1) return 2;
        return 0;
    };
    return (dfs(root) === 0 ? 1 : 0) + cameras;
}

// ==================== 16. 柠檬水找零 ====================
// 题干：顾客付 5/10/20，柠檬水 5 元。能否正确找零（开始时无零钱）。
// 输入：bills: number[]
// 输出：boolean
// 约束：贪心，优先找 10

function lemonadeChange(bills) {
    let five = 0, ten = 0;
    for (const b of bills) {
        if (b === 5) five++;
        else if (b === 10) { if (!five) return false; five--; ten++; }
        else { if (ten && five) { ten--; five--; } else if (five >= 3) five -= 3; else return false; }
    }
    return true;
}

// ==================== 17. 根据身高重建队列 ====================
// 题干：people[i]=[h,k] 表示身高 h、前面有 k 个 >=h 的人。重建队列使满足条件。
// 输入：people: number[][]
// 输出：number[][]
// 约束：按 h 降序 k 升序，再插入

function reconstructQueue(people) {
    people.sort((a, b) => a[0] !== b[0] ? b[0] - a[0] : a[1] - b[1]);
    const res = [];
    for (const p of people) res.splice(p[1], 0, p);
    return res;
}

// ==================== 18. 合并区间 ====================
// 题干：区间数组，合并所有重叠区间。
// 输入：intervals: number[][]
// 输出：number[][]
// 约束：按左端点排序后线性合并

function mergeIntervals(intervals) {
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

// ==================== 19. 有效的括号字符串 ====================
// 题干：字符串含 '(', ')', '*'，* 可当作 ( 或 ) 或空。判断是否为有效括号。
// 输入：s: string
// 输出：boolean
// 约束：贪心维护 lo/hi 范围

function checkValidString(s) {
    let lo = 0, hi = 0;
    for (const c of s) {
        lo += c === '(' ? 1 : -1;
        hi += c !== ')' ? 1 : -1;
        if (hi < 0) return false;
        lo = Math.max(lo, 0);
    }
    return lo === 0;
}

// ==================== 20. 子数组最大和（Kadane 贪心视角） ====================
// 题干：整数数组 nums，求连续子数组最大和。
// 输入：nums: number[]
// 输出：number
// 约束：贪心/Kadane

function maxSubArray(nums) {
    let cur = nums[0], max = nums[0];
    for (let i = 1; i < nums.length; i++) {
        cur = Math.max(nums[i], cur + nums[i]);
        max = Math.max(max, cur);
    }
    return max;
}
