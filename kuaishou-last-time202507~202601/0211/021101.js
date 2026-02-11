/**
 * 021101 面试题（20 道）- 不重复新题
 * 日期：2026-02-11
 * 规则：仅题干与约束，个人完成后再补充解答与测试用例。
 */

class ListNode {
    constructor(val, next = null) { this.val = val; this.next = next; }
}
class TreeNode {
    constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}

// ==================== 1. 合并两个有序数组（原地） ====================
// nums1 长度 m+n，前 m 项有效；nums2 长度 n。将 nums2 合并进 nums1 并保持非递减。原地修改 nums1。
// 输入：nums1, m, nums2, n
// 输出：无（原地修改 nums1）

function merge(nums1, m, nums2, n) {
    let i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
        else nums1[k--] = nums2[j--];
    }
}


// ==================== 2. 删除链表倒数第 N 个节点 ====================
// 给定单链表头 head 和 n，删除倒数第 n 个节点，返回新头。保证 n 有效。
// 输入：head: ListNode, n: number
// 输出：ListNode | null

function removeNthFromEnd(head, n) {
    const dummy = new ListNode(0, head);
    let fast = dummy, slow = dummy;
    for (let i = 0; i <= n; i++) fast = fast.next;
    while (fast) { fast = fast.next; slow = slow.next; }
    slow.next = slow.next.next;
    return dummy.next;
}

// ==================== 3. 环形链表 II ====================
// 给定链表头 head，若存在环，返回环的入口节点；否则返回 null。O(1) 空间。
// 输入：head: ListNode
// 输出：ListNode | null

function detectCycle(head) {
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) {
            let p = head;
            while (p !== slow) { p = p.next; slow = slow.next; }
            return p;
        }
    }
    return null;
}

// ==================== 4. 对称二叉树 ====================
// 判断二叉树是否轴对称（镜像对称）。
// 输入：root: TreeNode | null
// 输出：boolean

function isSymmetric(root) {
    const check = (p, q) => {
        if (!p && !q) return true;
        if (!p || !q || p.val !== q.val) return false;
        return check(p.left, q.right) && check(p.right, q.left);
    };
    return !root || check(root.left, root.right);
}

// ==================== 5. 二叉树中序遍历（迭代） ====================
// 给定 root，返回中序遍历结果数组。不用递归，用栈模拟。
// 输入：root: TreeNode | null
// 输出：number[]

function inorderTraversal(root) {
    const res = [];
    const stk = [];
    let cur = root;
    while (cur || stk.length) {
        while (cur) { stk.push(cur); cur = cur.left; }
        cur = stk.pop();
        res.push(cur.val);
        cur = cur.right;
    }
    return res;
}

// ==================== 6. 二叉树的锯齿形层序遍历 ====================
// 给定 root，返回锯齿形层序遍历：第 0 层从左到右，第 1 层从右到左，交替。
// 输入：root: TreeNode | null
// 输出：number[][]

function zigzagLevelOrder(root) {
    if (!root) return [];
    const res = [];
    const q = [root];
    let level = 0;
    while (q.length) {
        const sz = q.length;
        const row = [];
        for (let i = 0; i < sz; i++) {
            const n = q.shift();
            row.push(n.val);
            if (n.left) q.push(n.left);
            if (n.right) q.push(n.right);
        }
        if (level % 2 === 1) row.reverse();
        res.push(row);
        level++;
    }
    return res;
}

// ==================== 7. 最小栈 ====================
// 实现栈，支持 push、pop、top，以及 getMin 在 O(1) 时间内返回栈内最小元素。
// 输入：无
// 输出：MinStack 类

class MinStack {
    constructor() { this.stk = []; this.minStk = []; }
    push(x) {
        this.stk.push(x);
        if (!this.minStk.length || x <= this.minStk[this.minStk.length - 1]) this.minStk.push(x);
    }
    pop() {
        const x = this.stk.pop();
        if (x === this.minStk[this.minStk.length - 1]) this.minStk.pop();
    }
    top() { return this.stk[this.stk.length - 1]; }
    getMin() { return this.minStk[this.minStk.length - 1]; }
}

// ==================== 8. 用栈实现队列 ====================
// 仅用两个栈实现队列，支持 push、pop、peek、empty。
// 输入：无
// 输出：MyQueue 类

class MyQueue {
    constructor() { this.in = []; this.out = []; }
    push(x) { this.in.push(x); }
    pop() {
        if (!this.out.length) while (this.in.length) this.out.push(this.in.pop());
        return this.out.pop();
    }
    peek() {
        if (!this.out.length) while (this.in.length) this.out.push(this.in.pop());
        return this.out[this.out.length - 1];
    }
    empty() { return !this.in.length && !this.out.length; }
}

// ==================== 9. 爬楼梯 ====================
// 一次可爬 1 或 2 阶，到第 n 阶有多少种不同爬法？n >= 1。
// 输入：n: number
// 输出：number

function climbStairs(n) {
    if (n <= 2) return n;
    let a = 1, b = 2;
    for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
    return b;
}

// ==================== 10. 二分查找 ====================
// 在升序数组 nums 中查找 target，存在返回下标，否则返回 -1。
// 输入：nums: number[], target: number
// 输出：number

function binarySearch(nums, target) {
    let lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

// ==================== 11. 搜索旋转排序数组 ====================
// nums 是旋转后的升序数组（如 [4,5,6,0,1,2]），无重复。查找 target 的下标，不存在返回 -1。O(log n)。
// 输入：nums: number[], target: number
// 输出：number

function search(nums, target) {
    let lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (nums[mid] === target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}

// ==================== 12. 最长公共前缀 ====================
// 给定字符串数组 strs，求最长公共前缀。无公共前缀返回 ''。
// 输入：strs: string[]
// 输出：string

function longestCommonPrefix(strs) {
    if (!strs.length) return '';
    let i = 0;
    while (strs[0][i] && strs.every(s => s[i] === strs[0][i])) i++;
    return strs[0].slice(0, i);
}

// ==================== 13. 罗马数字转整数 ====================
// 给定罗马数字字符串 s（如 "III"、"IV"、"MCMXCIV"），转为整数。
// 输入：s: string
// 输出：number

function romanToInt(s) {
    const m = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let sum = 0;
    for (let i = 0; i < s.length; i++) {
        if (m[s[i]] < m[s[i + 1]]) sum -= m[s[i]];
        else sum += m[s[i]];
    }
    return sum;
}

// ==================== 14. 缺失的第一个正数 ====================
// 给定未排序整数数组 nums，找出未出现的最小正整数。O(n) 时间 O(1) 额外空间。
// 输入：nums: number[]
// 输出：number

function firstMissingPositive(nums) {
    const n = nums.length;
    for (let i = 0; i < n; i++) {
        while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
            [nums[nums[i] - 1], nums[i]] = [nums[i], nums[nums[i] - 1]];
        }
    }
    for (let i = 0; i < n; i++) if (nums[i] !== i + 1) return i + 1;
    return n + 1;
}

// ==================== 15. 子集 ====================
// 给定不含重复元素的数组 nums，返回所有可能的子集（幂集）。空集也算。
// 输入：nums: number[]
// 输出：number[][]

function subsets(nums) {
    const res = [[]];
    for (const x of nums) {
        const n = res.length;
        for (let i = 0; i < n; i++) res.push([...res[i], x]);
    }
    return res;
}

// ==================== 16. 回文链表 ====================
// 判断单链表是否为回文结构。O(n) 时间 O(1) 空间（可修改链表）。
// 输入：head: ListNode | null
// 输出：boolean

function isPalindrome(head) {
    const reverse = (h) => {
        let prev = null;
        while (h) { const n = h.next; h.next = prev; prev = h; h = n; }
        return prev;
    };
    let slow = head, fast = head;
    while (fast?.next) { slow = slow.next; fast = fast.next.next; }
    let p = head, q = reverse(slow);
    while (q) {
        if (p.val !== q.val) return false;
        p = p.next; q = q.next;
    }
    return true;
}

// ==================== 17. 二叉树的直径 ====================
// 二叉树直径：任意两节点间最长路径的边数。可不过根节点。
// 输入：root: TreeNode | null
// 输出：number

function diameterOfBinaryTree(root) {
    let max = 0;
    const depth = (node) => {
        if (!node) return 0;
        const L = depth(node.left), R = depth(node.right);
        max = Math.max(max, L + R);
        return 1 + Math.max(L, R);
    };
    depth(root);
    return max;
}

// ==================== 18. 路径总和 ====================
// 判断是否存在从根到叶的路径，路径上节点值和等于 targetSum。
// 输入：root: TreeNode | null, targetSum: number
// 输出：boolean

function hasPathSum(root, targetSum) {
    if (!root) return false;
    if (!root.left && !root.right) return root.val === targetSum;
    const next = targetSum - root.val;
    return hasPathSum(root.left, next) || hasPathSum(root.right, next);
}

// ==================== 19. 有效的字母异位词 ====================
// 判断字符串 s 和 t 是否为字母异位词（字母相同、顺序可不同）。
// 输入：s: string, t: string
// 输出：boolean

function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    const cnt = {};
    for (const c of s) cnt[c] = (cnt[c] || 0) + 1;
    for (const c of t) {
        if (!cnt[c]) return false;
        cnt[c]--;
    }
    return true;
}

// ==================== 20. 字符串转换整数 (atoi) ====================
// 实现 atoi：去掉前导空格，读取可选 +/-，再读连续数字，转为整数。超出 [−2^31, 2^31−1] 截断。
// 输入：s: string
// 输出：number

function myAtoi(s) {
    s = s.trim();
    if (!s) return 0;
    let sign = 1, i = 0;
    if (s[0] === '-' || s[0] === '+') { sign = s[0] === '-' ? -1 : 1; i++; }
    let n = 0;
    const MIN = -(2 ** 31), MAX = 2 ** 31 - 1;
    for (; i < s.length && /\d/.test(s[i]); i++) {
        n = n * 10 + (s[i] - '0');
        if (sign === 1 && n > MAX) return MAX;
        if (sign === -1 && n > -MIN) return MIN;
    }
    return sign * n;
}
