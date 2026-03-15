/**
 * 021102 面试算法题（20 道）
 * 日期：2025-02-11
 * 规则：仅题干、输入输出与约束；个人完成后再补充解答与测试用例。
 */

class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// ==================== 1. 爬楼梯 ====================
// 题干：你每次可爬 1 或 2 阶，到 n 阶有多少种不同方法？
// 输入：n: number
// 输出：number
// 约束：O(n) 时间 O(1) 空间

function climbStairs(n) {
    if (n <= 2) return n;
    let a = 1, b = 2;
    for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
    return b;
}



// ==================== 2. 盛最多水的容器 ====================
// 题干：给定 n 个非负整数表示挡板高度，选两根挡板与 x 轴构成容器，求最大盛水量。
// 输入：height: number[]
// 输出：number
// 约束：双指针 O(n)

function maxArea(height) {
    let l = 0, r = height.length - 1, ans = 0;
    while (l < r) {
        ans = Math.max(ans, Math.min(height[l], height[r]) * (r - l));
        height[l] < height[r] ? l++ : r--;
    }
    return ans;
}



// ==================== 3. 整数反转 ====================
// 题干：给定 32 位有符号整数 x，反转 digits。若溢出返回 0。
// 输入：x: number
// 输出：number
// 约束：不可用字符串转换

function reverse(x) {
    const MIN = -(2 ** 31), MAX = 2 ** 31 - 1;
    let n = 0;
    while (x !== 0) {
        n = n * 10 + (x % 10);
        x = (x / 10) | 0;
    }
    return n < MIN || n > MAX ? 0 : n;
}



// ==================== 4. 回文数 ====================
// 题干：判断整数 x 是否为回文数（从左读和从右读一样）。
// 输入：x: number
// 输出：boolean
// 约束：不可转为字符串，O(log n) 空间

function isPalindrome(x) {
    if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
    let half = 0;
    while (x > half) { half = half * 10 + (x % 10); x = (x / 10) | 0; }
    return x === half || x === ((half / 10) | 0);
}



// ==================== 5. 罗马数字转整数 ====================
// 题干：给定罗马数字字符串 s（如 "III"、"IV"），转为整数。
// 输入：s: string
// 输出：number
// 约束：罗马数字规则（小写大前则减）

function romanToInt(s) {
    const m = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let sum = 0;
    for (let i = 0; i < s.length; i++) {
        if (m[s[i]] < m[s[i + 1]]) sum -= m[s[i]];
        else sum += m[s[i]];
    }
    return sum;
}



// ==================== 6. 最长公共前缀 ====================
// 题干：给定字符串数组 strs，返回所有字符串的最长公共前缀；无则返回 ""。
// 输入：strs: string[]
// 输出：string
// 约束：0 <= strs.length

function longestCommonPrefix(strs) {
    if (!strs.length) return '';
    let i = 0;
    while (strs[0][i] && strs.every(s => s[i] === strs[0][i])) i++;
    return strs[0].slice(0, i);
}



// ==================== 7. 删除有序数组中的重复项（原地） ====================
// 题干：给定升序数组 nums，原地删除重复项，使每个元素只出现一次，返回新长度。
// 输入：nums: number[]
// 输出：number（新长度）
// 约束：O(1) 额外空间

function removeDuplicates(nums) {
    if (!nums.length) return 0;
    let k = 1;
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] !== nums[k - 1]) nums[k++] = nums[i];
    }
    return k;
}



// ==================== 8. 移除元素（原地） ====================
// 题干：给定数组 nums 和值 val，原地删除所有等于 val 的元素，返回新长度。
// 输入：nums: number[], val: number
// 输出：number
// 约束：O(1) 额外空间

function removeElement(nums, val) {
    let k = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== val) nums[k++] = nums[i];
    }
    return k;
}

// ==================== 9. 实现 strStr() ====================
// 题干：在 haystack 中找出 needle 首次出现下标，不存在则 -1。needle 为空返回 0。
// 输入：haystack: string, needle: string
// 输出：number
// 约束：可用 KMP 或暴力

function strStr(haystack, needle) {
    if (!needle) return 0;
    for (let i = 0; i <= haystack.length - needle.length; i++) {
        if (haystack.slice(i, i + needle.length) === needle) return i;
    }
    return -1;
}



// ==================== 10. 搜索插入位置 ====================
// 题干：给定升序数组 nums 和目标 target，若存在返回下标，否则返回插入位置使仍有序。
// 输入：nums: number[], target: number
// 输出：number
// 约束：O(log n) 二分

function searchInsert(nums, target) {
    let lo = 0, hi = nums.length;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}



// ==================== 11. 加一 ====================
// 题干：给定表示非负整数的 digits 数组（高位在前），返回加一后的结果。
// 输入：digits: number[]
// 输出：number[]
// 约束：不含前导零（除 0 本身）

function plusOne(digits) {
    for (let i = digits.length - 1; i >= 0; i--) {
        digits[i]++;
        if (digits[i] < 10) return digits;
        digits[i] = 0;
    }
    return [1, ...digits];
}



// ==================== 12. 二进制求和 ====================
// 题干：给定两个二进制字符串 a、b，返回它们的和（二进制字符串）。
// 输入：a: string, b: string
// 输出：string
// 约束：模拟竖式加法

function addBinary(a, b) {
    let i = a.length - 1, j = b.length - 1, carry = 0, res = '';
    while (i >= 0 || j >= 0 || carry) {
        const sum = (i >= 0 ? +a[i--] : 0) + (j >= 0 ? +b[j--] : 0) + carry;
        res = (sum % 2) + res;
        carry = sum >> 1;
    }
    return res;
}



// ==================== 13. x 的平方根 ====================
// 题干：给定非负整数 x，返回其算术平方根的整数部分（ truncate）。
// 输入：x: number
// 输出：number
// 约束：不可用内置函数，O(log x)

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



// ==================== 14. 合并两个有序数组（与 021101 不同思路巩固） ====================
// 题干：nums1 长度 m+n，前 m 项有效；nums2 长度 n。将 nums2 合并进 nums1 并保持非递减。原地修改。
// 输入：nums1: number[], m: number, nums2: number[], n: number
// 输出：无（原地修改 nums1）
// 约束：从后往前双指针

function merge(nums1, m, nums2, n) {
    let i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
        else nums1[k--] = nums2[j--];
    }
}



// ==================== 15. 二叉树的前序遍历（迭代） ====================
// 题干：给定 root，返回前序遍历结果数组。不用递归，用栈模拟。
// 输入：root: TreeNode | null
// 输出：number[]
// 约束：迭代

function preorderTraversal(root) {
    const res = [];
    const stk = [];
    let cur = root;
    while (cur || stk.length) {
        while (cur) { res.push(cur.val); stk.push(cur); cur = cur.left; }
        cur = stk.pop().right;
    }
    return res;
}

// ==================== 16. 二叉树的后序遍历（迭代） ====================
// 题干：给定 root，返回后序遍历结果数组。不用递归，用栈模拟。
// 输入：root: TreeNode | null
// 输出：number[]
// 约束：迭代

function postorderTraversal(root) {
    const res = [];
    const stk = [];
    let cur = root, last = null;
    while (cur || stk.length) {
        while (cur) { stk.push(cur); cur = cur.left; }
        cur = stk[stk.length - 1];
        if (!cur.right || cur.right === last) { res.push(cur.val); last = cur; stk.pop(); cur = null; }
        else cur = cur.right;
    }
    return res;
}

// ==================== 17. 将有序数组转为二叉搜索树 ====================
// 题干：给定升序数组 nums，构建高度平衡 BST（任意节点左右子树高度差不超过 1）。
// 输入：nums: number[]
// 输出：TreeNode | null
// 约束：取中点作为根，递归左右

function sortedArrayToBST(nums) {
    const build = (l, r) => {
        if (l > r) return null;
        const mid = (l + r) >> 1;
        return new TreeNode(nums[mid], build(l, mid - 1), build(mid + 1, r));
    };
    return build(0, nums.length - 1);
}



// ==================== 18. 平衡二叉树 ====================
// 题干：判断二叉树是否平衡（每个节点左右子树高度差不超过 1）。
// 输入：root: TreeNode | null
// 输出：boolean
// 约束：O(n) 自底向上

function isBalanced(root) {
    const height = (node) => {
        if (!node) return 0;
        const L = height(node.left), R = height(node.right);
        if (L === -1 || R === -1 || Math.abs(L - R) > 1) return -1;
        return 1 + Math.max(L, R);
    };
    return height(root) !== -1;
}



// ==================== 19. 二叉树的最小深度 ====================
// 题干：给定 root，返回从根到最近叶子节点的节点数。叶子指无子节点的节点。
// 输入：root: TreeNode | null
// 输出：number
// 约束：BFS 或 DFS

function minDepth(root) {
    if (!root) return 0;
    if (!root.left && !root.right) return 1;
    const L = root.left ? minDepth(root.left) : Infinity;
    const R = root.right ? minDepth(root.right) : Infinity;
    return 1 + Math.min(L, R);
}



// ==================== 20. 路径总和 ====================
// 题干：给定 root 和 targetSum，判断是否存在从根到叶子的路径，路径上节点值和等于 targetSum。
// 输入：root: TreeNode | null, targetSum: number
// 输出：boolean
// 约束：DFS 或 BFS

function hasPathSum(root, targetSum) {
    if (!root) return false;
    if (!root.left && !root.right) return root.val === targetSum;
    const next = targetSum - root.val;
    return hasPathSum(root.left, next) || hasPathSum(root.right, next);
}
