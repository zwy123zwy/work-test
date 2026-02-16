/**
 * 021401 面试算法题（20 道）- 专题：二叉树与递归
 * 日期：2026-02-14
 * 规则：仅题干、输入输出与约束；个人完成后再补充解答与测试用例。
 */

class ListNode {
    constructor(val, next = null) { this.val = val; this.next = next; }
}
class TreeNode {
    constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}

// ==================== 1. 二叉树的前序遍历 ====================
// 题干：给定 root，返回前序遍历结果数组（递归或迭代）。
// 输入：root: TreeNode | null
// 输出：number[]
// 约束：递归 O(n)，或迭代栈
// 注意点：① 前序：根-左-右；② 递归最简；迭代用栈，先右再左入栈保证左先出。

function preorderTraversal(root) {
    const res = [];
    const go = (r) => { if (!r) return; res.push(r.val); go(r.left); go(r.right); };
    go(root);
    return res;
}

// ==================== 2. 二叉树的中序遍历 ====================
// 题干：给定 root，返回中序遍历结果数组（递归或迭代）。
// 输入：root: TreeNode | null
// 输出：number[]
// 约束：迭代用栈，左-根-右
// 注意点：① 中序：左-根-右，BST 中序为升序；② 迭代：一路左到底入栈，弹出即访问，再走右。

function inorderTraversal(root) {
    const res = [], stk = [];
    let cur = root;
    while (cur || stk.length) {
        while (cur) { stk.push(cur); cur = cur.left; }
        cur = stk.pop(); res.push(cur.val); cur = cur.right;
    }
    return res;
}

// ==================== 3. 二叉树的后序遍历 ====================
// 题干：给定 root，返回后序遍历结果数组（递归或迭代）。
// 输入：root: TreeNode | null
// 输出：number[]
// 约束：迭代可用双栈或逆序
// 注意点：① 后序：左-右-根；② 迭代核心：右子树未访问完不能 pop 根，用 last 记录刚访问的右子。

function postorderTraversal(root) {
    const res = [], stk = [];
    let cur = root, last = null;
    while (cur || stk.length) {
        while (cur) { stk.push(cur); cur = cur.left; }
        cur = stk[stk.length - 1];
        if (!cur.right || cur.right === last) { res.push(cur.val); last = cur; stk.pop(); cur = null; }
        else cur = cur.right;
    }
    return res;
}

// ==================== 4. 二叉树的层序遍历 ====================
// 题干：给定 root，返回层序遍历结果（每层一个子数组）。
// 输入：root: TreeNode | null
// 输出：number[][]
// 约束：BFS 队列
// 注意点：① 必须按层区分，用 for 循环处理当前层 size；② 空树返回 []，不是 [[]]。

function levelOrder(root) {
    if (!root) return [];
    const res = []; const q = [root];
    while (q.length) {
        const row = [], sz = q.length;
        for (let i = 0; i < sz; i++) {
            const n = q.shift();
            row.push(n.val);
            if (n.left) q.push(n.left);
            if (n.right) q.push(n.right);
        }
        res.push(row);
    }
    return res;
}

// ==================== 5. 二叉树的锯齿形层序遍历 ====================
// 题干：第 0 层从左到右，第 1 层从右到左，交替。
// 输入：root: TreeNode | null
// 输出：number[][]
// 约束：BFS + 按层反转
// 注意点：① 奇数层（lv%2===1）reverse；② 也可用双端队列按层控制 push/unshift。

function zigzagLevelOrder(root) {
    if (!root) return [];
    const res = []; const q = [root]; let lv = 0;
    while (q.length) {
        const row = [], sz = q.length;
        for (let i = 0; i < sz; i++) {
            const n = q.shift();
            row.push(n.val);
            if (n.left) q.push(n.left);
            if (n.right) q.push(n.right);
        }
        if (lv % 2) row.reverse();
        res.push(row); lv++;
    }
    return res;
}

// ==================== 6. 二叉树的最大深度 ====================
// 题干：给定 root，返回最大深度（根到最远叶子的节点数）。
// 输入：root: TreeNode | null
// 输出：number
// 约束：递归 max(left, right) + 1
// 注意点：① 空节点返回 0；② 深度定义：节点数或边数要看清题意，常见是节点数。

function maxDepth(root) {
    if (!root) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// ==================== 7. 二叉树的最小深度 ====================
// 题干：根到最近叶子节点的节点数。叶子指无子节点的节点。
// 输入：root: TreeNode | null
// 输出：number
// 约束：注意单子树情况（不能取 min 为 0）
// 注意点：① 单子树（只有左或右）时不能取 min(l,r)，否则得 0；② 无子节点才是叶子。

function minDepth(root) {
    if (!root) return 0;
    if (!root.left && !root.right) return 1;
    const L = root.left ? minDepth(root.left) : Infinity;
    const R = root.right ? minDepth(root.right) : Infinity;
    return 1 + Math.min(L, R);
}

// ==================== 8. 对称二叉树 ====================
// 题干：判断二叉树是否轴对称（镜像对称）。
// 输入：root: TreeNode | null
// 输出：boolean
// 约束：递归比较左右子树镜像
// 注意点：① 空树算对称；② 比较 left 与 right 镜像：p.left↔q.right、p.right↔q.left。

function isSymmetric(root) {
    const check = (p, q) => {
        if (!p && !q) return true;
        if (!p || !q || p.val !== q.val) return false;
        return check(p.left, q.right) && check(p.right, q.left);
    };
    return !root || check(root.left, root.right);
}

// ==================== 9. 翻转二叉树 ====================
// 题干：翻转整棵树（每个节点的左右子树互换），返回根。
// 输入：root: TreeNode | null
// 输出：TreeNode | null
// 约束：原地修改，递归或迭代
// 注意点：① 先递归再交换或先交换再递归均可；② 用 [a,b]=[b,a] 交换左右简洁。

function invertTree(root) {
    if (!root) return null;
    [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
    return root;
}

// ==================== 10. 路径总和 ====================
// 题干：判断是否存在从根到叶的路径，路径上节点值和等于 targetSum。
// 输入：root: TreeNode | null, targetSum: number
// 输出：boolean
// 约束：DFS
// 注意点：① 必须到叶子（无左右子）才判断；② 用 targetSum-root.val 向下传递剩余和。

function hasPathSum(root, targetSum) {
    if (!root) return false;
    if (!root.left && !root.right) return root.val === targetSum;
    const n = targetSum - root.val;
    return hasPathSum(root.left, n) || hasPathSum(root.right, n);
}

// ==================== 11. 路径总和 II ====================
// 题干：找出所有从根到叶、节点值和等于 targetSum 的路径。
// 输入：root: TreeNode | null, targetSum: number
// 输出：number[][]
// 约束：DFS + 回溯
// 注意点：① path 必须回溯 push/pop；② 加入 res 时用 [...path] 复制，避免引用被修改。

function pathSum(root, targetSum) {
    const res = [];
    const dfs = (r, sum, path) => {
        if (!r) return;
        path.push(r.val);
        if (!r.left && !r.right && sum + r.val === targetSum) res.push([...path]);
        dfs(r.left, sum + r.val, path); dfs(r.right, sum + r.val, path);
        path.pop();
    };
    dfs(root, 0, []);
    return res;
}

// ==================== 12. 二叉树的直径 ====================
// 题干：直径定义为任意两节点间最长路径的边数，可不过根。
// 输入：root: TreeNode | null
// 输出：number
// 约束：递归求左右高度，更新 max = L + R
// 注意点：① 直径是边数，过某节点的最长路径 = 左高+右高；② 用全局/闭包变量记录 max。

function diameterOfBinaryTree(root) {
    let max = 0;
    const d = (r) => {
        if (!r) return 0;
        const L = d(r.left), R = d(r.right);
        max = Math.max(max, L + R);
        return 1 + Math.max(L, R);
    };
    d(root);
    return max;
}

// ==================== 13. 平衡二叉树 ====================
// 题干：判断是否平衡（每个节点左右子树高度差不超过 1）。
// 输入：root: TreeNode | null
// 输出：boolean
// 约束：自底向上 O(n)，或带剪枝的高度计算
// 注意点：① 用 -1 表示不平衡，剪枝提前返回；② 否则要两次遍历（先高度再平衡）O(n²)。

function isBalanced(root) {
    const h = (r) => {
        if (!r) return 0;
        const L = h(r.left), R = h(r.right);
        if (L === -1 || R === -1 || Math.abs(L - R) > 1) return -1;
        return 1 + Math.max(L, R);
    };
    return h(root) !== -1;
}

// ==================== 14. 将有序数组转为二叉搜索树 ====================
// 题干：升序数组 nums，构建高度平衡 BST（左右子树高度差 ≤ 1）。
// 输入：nums: number[]
// 输出：TreeNode | null
// 约束：取中点作根，递归左右
// 注意点：① 必须取中点才能平衡；② 偶数长度取左中或右中均可；③ l>r 时返回 null。

function sortedArrayToBST(nums) {
    const build = (l, r) => {
        if (l > r) return null;
        const m = (l + r) >> 1;
        return new TreeNode(nums[m], build(l, m - 1), build(m + 1, r));
    };
    return build(0, nums.length - 1);
}

// ==================== 15. 验证二叉搜索树 ====================
// 题干：判断二叉树是否为有效 BST（左 < 根 < 右，且子树也满足）。
// 输入：root: TreeNode | null
// 输出：boolean
// 约束：中序递增或递归传上下界
// 注意点：① 不能只比较父节点，左子树所有节点 < 根；② 用 -Infinity/Infinity 初始化边界。

function isValidBST(root) {
    const ok = (r, lo, hi) => {
        if (!r) return true;
        if (r.val <= lo || r.val >= hi) return false;
        return ok(r.left, lo, r.val) && ok(r.right, r.val, hi);
    };
    return ok(root, -Infinity, Infinity);
}

// ==================== 16. 二叉搜索树中第 K 小的元素 ====================
// 题干：给定 BST 的根和 k，返回第 k 小的元素（1-indexed）。
// 输入：root: TreeNode | null, k: number
// 输出：number
// 约束：中序遍历或记录排名
// 注意点：① BST 中序即升序，第 k 小即中序第 k 个；② 找到后可用 ans 剪枝，不再递归。

function kthSmallest(root, k) {
    let rank = 0, ans = null;
    const ino = (r) => {
        if (!r || ans !== null) return;
        ino(r.left);
        if (++rank === k) ans = r.val;
        ino(r.right);
    };
    ino(root);
    return ans;
}

// ==================== 17. 二叉树的最近公共祖先 ====================
// 题干：给定 root 和节点 p、q，返回 p、q 的最近公共祖先（LCA）。
// 输入：root: TreeNode | null, p: TreeNode, q: TreeNode
// 输出：TreeNode | null
// 约束：递归：在左/在右/当前为 LCA
// 注意点：① root===p 或 root===q 可直接返回 root；② L、R 都有返回 root，否则返回非空的一侧。

function lowestCommonAncestor(root, p, q) {
    if (!root || root === p || root === q) return root;
    const L = lowestCommonAncestor(root.left, p, q);
    const R = lowestCommonAncestor(root.right, p, q);
    if (L && R) return root;
    return L || R;
}

// ==================== 18. 二叉搜索树的最近公共祖先 ====================
// 题干：BST 的根和 p、q，利用 BST 性质求 LCA。
// 输入：root: TreeNode | null, p: TreeNode, q: TreeNode
// 输出：TreeNode | null
// 约束：若 p、q 都小于根则进左子树，都大于则进右子树，否则当前为 LCA
// 注意点：① 可利用 BST 大小关系，无需完整遍历；② 分叉点（一大一小夹根）即为 LCA。

function lowestCommonAncestorBST(root, p, q) {
    while (root) {
        if (p.val < root.val && q.val < root.val) root = root.left;
        else if (p.val > root.val && q.val > root.val) root = root.right;
        else return root;
    }
    return null;
}

// ==================== 19. 二叉树展开为链表 ====================
// 题干：按先序遍历顺序将树展开为只有右子节点的“链表”，原地修改。
// 输入：root: TreeNode | null
// 输出：无（原地修改）
// 约束：O(1) 空间（Morris 或递归时先记右子树再接）
// 注意点：① 左子树最右节点接右子树；② 顺序：root.left→root.right，root.left=null。

function flatten(root) {
    while (root) {
        if (root.left) {
            let p = root.left;
            while (p.right) p = p.right;
            p.right = root.right;
            root.right = root.left;
            root.left = null;
        }
        root = root.right;
    }
}

// ==================== 20. 从前序与中序遍历序列构造二叉树 ====================
// 题干：给定前序 preorder 与中序 inorder（无重复），构造二叉树并返回根。
// 输入：preorder: number[], inorder: number[]
// 输出：TreeNode | null
// 约束：前序首为根，在中序中划分左右，递归构造
// 注意点：① pre[0] 是根；② 在 inorder 中找到根下标 i，左子树 pre[1..i]、in[0..i-1]，右子树 pre[i+1..]、in[i+1..]；③ 可用 Map 存 inorder 下标避免 indexOf。

function buildTree(preorder, inorder) {
    if (!preorder.length) return null;
    const root = new TreeNode(preorder[0]);
    const i = inorder.indexOf(preorder[0]);
    root.left = buildTree(preorder.slice(1, i + 1), inorder.slice(0, i));
    root.right = buildTree(preorder.slice(i + 1), inorder.slice(i + 1));
    return root;
}

// ==================== 测试用例 ====================
function buildTreeFromArr(arr, i = 0) {
    if (i >= arr.length || arr[i] == null) return null;
    return new TreeNode(arr[i], buildTreeFromArr(arr, 2 * i + 1), buildTreeFromArr(arr, 2 * i + 2));
}

// 辅助：层序打印树（扁平数组）
// function printTree(root) { if (!root) return []; const q = [root], out = []; while (q.length) { const n = q.shift(); out.push(n?.val ?? null); if (n) { q.push(n.left ?? null); q.push(n.right ?? null); } } return out; }

(function test() {
    const t = buildTreeFromArr([1, 2, 3, 4, 5, 6, 7]);
    console.log('1. preorder:', preorderTraversal(t));
    console.log('2. inorder:', inorderTraversal(t));
    console.log('3. postorder:', postorderTraversal(t));
    console.log('4. levelOrder:', levelOrder(t));
    console.log('5. zigzagLevelOrder:', zigzagLevelOrder(t));
    console.log('6. maxDepth:', maxDepth(t));
    console.log('7. minDepth:', minDepth(t));
    const sym = buildTreeFromArr([1, 2, 2, 3, 4, 4, 3]);
    console.log('8. isSymmetric:', isSymmetric(sym));
    const t2 = buildTreeFromArr([1, 2, 3]);
    invertTree(t2);
    console.log('9. invertTree:', preorderTraversal(t2));
    const t3 = buildTreeFromArr([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]);
    console.log('10. hasPathSum 22:', hasPathSum(t3, 22));
    console.log('11. pathSum 22:', pathSum(t3, 22));
    const t4 = buildTreeFromArr([1, 2, 3, 4, 5]);
    console.log('12. diameterOfBinaryTree:', diameterOfBinaryTree(t4));
    console.log('13. isBalanced:', isBalanced(buildTreeFromArr([1, 2, 2, 3, 3, null, null, 4, 4])));
    const bst = buildTreeFromArr([4, 2, 6, 1, 3, 5, 7]);
    console.log('14. sortedArrayToBST:', preorderTraversal(sortedArrayToBST([-10, -3, 0, 5, 9])));
    console.log('15. isValidBST:', isValidBST(bst));
    console.log('16. kthSmallest 2:', kthSmallest(bst, 2));
    const lcaRoot = buildTreeFromArr([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
    const p = lcaRoot.left, q = lcaRoot.right; // 5,1
    console.log('17. lowestCommonAncestor:', lowestCommonAncestor(lcaRoot, p, q)?.val);
    const bst2 = buildTreeFromArr([6, 2, 8, 0, 4, 7, 9, null, null, 3, 5]);
    const p2 = bst2.left, q2 = bst2.left.right;
    console.log('18. lowestCommonAncestorBST:', lowestCommonAncestorBST(bst2, p2, q2)?.val);
    const flat = buildTreeFromArr([1, 2, 5, 3, 4, null, 6]);
    flatten(flat);
    const rightVals = []; let cur = flat; while (cur) { rightVals.push(cur.val); cur = cur.right; }
    console.log('19. flatten:', rightVals);
    const rebuilt = buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]);
    console.log('20. buildTree preorder:', preorderTraversal(rebuilt));
})();
