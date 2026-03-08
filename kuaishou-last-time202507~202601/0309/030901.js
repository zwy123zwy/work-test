/**
 * 030901 面试算法题（20 道）- 专题：递归与分治（useMemo/React 树递归）
 * 日期：2026-03-09
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1.  Pow(x, n) ====================
function myPow(x, n) {
    if (n === 0) return 1;
    if (n < 0) return 1 / myPow(x, -n);
    return n % 2 ? x * myPow(x * x, (n - 1) / 2) : myPow(x * x, n / 2);
}

// ==================== 2. 多数元素 ====================
function majorityElement(nums) {
    let cand = 0, count = 0;
    for (const x of nums) {
        if (count === 0) cand = x;
        count += x === cand ? 1 : -1;
    }
    return cand;
}

// ==================== 3. 最大子数组和（分治） ====================
function maxSubArrayDivide(nums) {
    const dc = (lo, hi) => {
        if (lo === hi) return nums[lo];
        const mid = (lo + hi) >>> 1;
        let left = -Infinity, sum = 0;
        for (let i = mid; i >= lo; i--) { sum += nums[i]; left = Math.max(left, sum); }
        let right = -Infinity; sum = 0;
        for (let i = mid + 1; i <= hi; i++) { sum += nums[i]; right = Math.max(right, sum); }
        return Math.max(dc(lo, mid), dc(mid + 1, hi), left + right);
    };
    return dc(0, nums.length - 1);
}

// ==================== 4. 不同的二叉搜索树 ====================
function numTrees(n) {
    const dp = Array(n + 1).fill(0);
    dp[0] = dp[1] = 1;
    for (let i = 2; i <= n; i++)
        for (let j = 0; j < i; j++) dp[i] += dp[j] * dp[i - 1 - j];
    return dp[n];
}

// ==================== 5. 合并 K 个升序链表（分治） ====================
function mergeKListsDC(lists) {
    const merge = (a, b) => {
        const dummy = new ListNode(0);
        let p = dummy;
        while (a && b) p.next = a.val <= b.val ? (p = a, a = a.next) : (p = b, b = b.next);
        p.next = a || b;
        return dummy.next;
    };
    const dc = (lo, hi) => {
        if (lo > hi) return null;
        if (lo === hi) return lists[lo];
        const mid = (lo + hi) >>> 1;
        return merge(dc(lo, mid), dc(mid + 1, hi));
    };
    return dc(0, lists.length - 1);
}

// ==================== 6. 为运算表达式设计优先级 ====================
function diffWaysToCompute(expr) {
    const res = [];
    for (let i = 0; i < expr.length; i++) {
        const c = expr[i];
        if (c === '+' || c === '-' || c === '*') {
            const left = diffWaysToCompute(expr.slice(0, i));
            const right = diffWaysToCompute(expr.slice(i + 1));
            for (const a of left) for (const b of right)
                res.push(c === '+' ? a + b : c === '-' ? a - b : a * b);
        }
    }
    if (!res.length) res.push(parseInt(expr, 10));
    return res;
}

// ==================== 7. 不同的子序列 ====================
function numDistinct(s, t) {
    const m = s.length, n = t.length;
    const dp = Array(n + 1).fill(0);
    dp[0] = 1;
    for (let i = 1; i <= m; i++)
        for (let j = n; j >= 1; j--)
            if (s[i - 1] === t[j - 1]) dp[j] += dp[j - 1];
    return dp[n];
}

// ==================== 8. 汉诺塔 ====================
function hanota(A, B, C) {
    const move = (n, from, to, aux) => {
        if (n === 1) to.push(from.pop());
        else { move(n - 1, from, aux, to); to.push(from.pop()); move(n - 1, aux, to, from); }
    };
    move(A.length, A, C, B);
}

// ==================== 9. 斐波那契数 ====================
function fib(n) {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
    return b;
}

// ==================== 10. 爬楼梯 ====================
function climbStairs(n) {
    let a = 1, b = 1;
    for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
    return b;
}

// ==================== 11. 第 N 个泰波那契数 ====================
function tribonacci(n) {
    if (n === 0) return 0;
    if (n <= 2) return 1;
    let a = 0, b = 1, c = 1;
    for (let i = 3; i <= n; i++) [a, b, c] = [b, c, a + b + c];
    return c;
}

// ==================== 12. 矩形覆盖 ====================
function rectCover(n) {
    if (n <= 2) return n;
    let a = 1, b = 2;
    for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
    return b;
}

// ==================== 13. 翻转二叉树 ====================
function invertTree(root) {
    if (!root) return null;
    [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
    return root;
}

// ==================== 14. 对称二叉树 ====================
function isSymmetric(root) {
    const check = (p, q) => {
        if (!p && !q) return true;
        if (!p || !q || p.val !== q.val) return false;
        return check(p.left, q.right) && check(p.right, q.left);
    };
    return !root || check(root.left, root.right);
}

// ==================== 15. 二叉树最大深度 ====================
function maxDepth(root) {
    return !root ? 0 : 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// ==================== 16. 二叉树最小深度 ====================
function minDepth(root) {
    if (!root) return 0;
    if (!root.left && !root.right) return 1;
    if (!root.left) return 1 + minDepth(root.right);
    if (!root.right) return 1 + minDepth(root.left);
    return 1 + Math.min(minDepth(root.left), minDepth(root.right));
}

// ==================== 17. 合并二叉树 ====================
function mergeTrees(t1, t2) {
    if (!t1) return t2;
    if (!t2) return t1;
    t1.val += t2.val;
    t1.left = mergeTrees(t1.left, t2.left);
    t1.right = mergeTrees(t1.right, t2.right);
    return t1;
}

// ==================== 18. 二叉树的直径 ====================
function diameterOfBinaryTree(root) {
    let max = 0;
    const depth = (node) => {
        if (!node) return 0;
        const l = depth(node.left), r = depth(node.right);
        max = Math.max(max, l + r);
        return 1 + Math.max(l, r);
    };
    depth(root);
    return max;
}

// ==================== 19. 将有序数组转为二叉搜索树 ====================
function sortedArrayToBST(nums) {
    if (!nums.length) return null;
    const mid = nums.length >> 1;
    return new TreeNode(nums[mid], sortedArrayToBST(nums.slice(0, mid)), sortedArrayToBST(nums.slice(mid + 1)));
}

// ==================== 20. 二叉搜索树的最近公共祖先 ====================
function lowestCommonAncestorBST(root, p, q) {
    if (root.val > p.val && root.val > q.val) return lowestCommonAncestorBST(root.left, p, q);
    if (root.val < p.val && root.val < q.val) return lowestCommonAncestorBST(root.right, p, q);
    return root;
}

// ==================== 测试 ====================
function test030901() {
    const assert = (n, a, e) => console.log(JSON.stringify(a) === JSON.stringify(e) ? `[OK] ${n}` : `[FAIL] ${n}`);
    assert('1', myPow(2, 10), 1024);
    assert('2', majorityElement([3, 2, 3]), 3);
    assert('3', maxSubArrayDivide([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
    assert('4', numTrees(3), 5);
    assert('9', fib(4), 3);
    assert('10', climbStairs(3), 3);
    assert('18', diameterOfBinaryTree(new TreeNode(1, new TreeNode(2, new TreeNode(4), new TreeNode(5)), new TreeNode(3))), 3);
    console.log('030901 tests done.');
}
test030901();
