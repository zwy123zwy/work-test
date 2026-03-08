/**
 * 031001 面试算法题（20 道）- 专题：树遍历变体（React 虚拟 DOM 树）
 * 日期：2026-03-10
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 二叉树的中序遍历 ====================
function inorderTraversal(root) {
    const res = [], st = [];
    while (root || st.length) {
        while (root) { st.push(root); root = root.left; }
        root = st.pop();
        res.push(root.val);
        root = root.right;
    }
    return res;
}

// ==================== 2. 二叉树的前序遍历 ====================
function preorderTraversal(root) {
    if (!root) return [];
    const res = [], st = [root];
    while (st.length) {
        const n = st.pop();
        res.push(n.val);
        if (n.right) st.push(n.right);
        if (n.left) st.push(n.left);
    }
    return res;
}

// ==================== 3. 二叉树的后序遍历 ====================
function postorderTraversal(root) {
    const res = [], st = [root];
    while (st.length) {
        const n = st.pop();
        if (!n) continue;
        res.unshift(n.val);
        if (n.left) st.push(n.left);
        if (n.right) st.push(n.right);
    }
    return res;
}

// ==================== 4. 二叉树的层序遍历 ====================
function levelOrder(root) {
    if (!root) return [];
    const res = [], q = [root];
    while (q.length) {
        const row = [], n = q.length;
        for (let i = 0; i < n; i++) {
            const node = q.shift();
            row.push(node.val);
            if (node.left) q.push(node.left);
            if (node.right) q.push(node.right);
        }
        res.push(row);
    }
    return res;
}

// ==================== 5. 二叉树的锯齿形层序遍历 ====================
function zigzagLevelOrder(root) {
    if (!root) return [];
    const res = [];
    let q = [root], lv = 0;
    while (q.length) {
        const row = [], next = [];
        for (const n of q) {
            row.push(n.val);
            if (n.left) next.push(n.left);
            if (n.right) next.push(n.right);
        }
        res.push(lv % 2 ? row.reverse() : row);
        q = next;
        lv++;
    }
    return res;
}

// ==================== 6. 二叉树的最大宽度 ====================
function widthOfBinaryTree(root) {
    if (!root) return 0;
    const q = [[root, 0]];
    let max = 0;
    while (q.length) {
        const n = q.length;
        let lo = q[0][1], hi = q[q.length - 1][1];
        max = Math.max(max, hi - lo + 1);
        for (let i = 0; i < n; i++) {
            const [node, idx] = q.shift();
            if (node.left) q.push([node.left, 2 * idx]);
            if (node.right) q.push([node.right, 2 * idx + 1]);
        }
    }
    return max;
}

// ==================== 7. 路径总和 II ====================
function pathSum(root, targetSum) {
    const res = [];
    const dfs = (node, sum, path) => {
        if (!node) return;
        path.push(node.val);
        if (!node.left && !node.right && sum + node.val === targetSum) res.push([...path]);
        dfs(node.left, sum + node.val, path);
        dfs(node.right, sum + node.val, path);
        path.pop();
    };
    dfs(root, 0, []);
    return res;
}

// ==================== 8. 求根到叶子节点数字之和 ====================
function sumNumbers(root) {
    let res = 0;
    const dfs = (node, num) => {
        if (!node) return;
        num = num * 10 + node.val;
        if (!node.left && !node.right) res += num;
        dfs(node.left, num);
        dfs(node.right, num);
    };
    dfs(root, 0);
    return res;
}

// ==================== 9. 二叉树展开为链表 ====================
function flattenTree(root) {
    let p = root;
    while (p) {
        if (p.left) {
            let rightmost = p.left;
            while (rightmost.right) rightmost = rightmost.right;
            rightmost.right = p.right;
            p.right = p.left;
            p.left = null;
        }
        p = p.right;
    }
}

// ==================== 10. 填充每个节点的下一个右侧节点指针 ====================
function connect(root) {
    if (!root) return null;
    let leftmost = root;
    while (leftmost.left) {
        let head = leftmost;
        while (head) {
            head.left.next = head.right;
            if (head.next) head.right.next = head.next.left;
            head = head.next;
        }
        leftmost = leftmost.left;
    }
    return root;
}

// ==================== 11. 二叉树的堂兄弟节点 ====================
function isCousins(root, x, y) {
    let dx = 0, dy = 0, px = null, py = null;
    const dfs = (node, parent, d) => {
        if (!node) return;
        if (node.val === x) { dx = d; px = parent; }
        if (node.val === y) { dy = d; py = parent; }
        dfs(node.left, node, d + 1);
        dfs(node.right, node, d + 1);
    };
    dfs(root, null, 0);
    return dx === dy && px !== py;
}

// ==================== 12. 二叉树的层序遍历 II ====================
function levelOrderBottom(root) {
    const res = levelOrder(root);
    return res.reverse();
}

// ==================== 13. 平衡二叉树 ====================
function isBalanced(root) {
    const height = (node) => {
        if (!node) return 0;
        const l = height(node.left), r = height(node.right);
        if (l === -1 || r === -1 || Math.abs(l - r) > 1) return -1;
        return 1 + Math.max(l, r);
    };
    return height(root) !== -1;
}

// ==================== 14. 左叶子之和 ====================
function sumOfLeftLeaves(root) {
    const dfs = (node, isLeft) => {
        if (!node) return 0;
        if (!node.left && !node.right && isLeft) return node.val;
        return dfs(node.left, true) + dfs(node.right, false);
    };
    return dfs(root, false);
}

// ==================== 15. 找所有根到叶子的路径 ====================
function binaryTreePaths(root) {
    const res = [];
    const dfs = (node, path) => {
        if (!node) return;
        path.push(node.val);
        if (!node.left && !node.right) res.push(path.join('->'));
        dfs(node.left, path);
        dfs(node.right, path);
        path.pop();
    };
    dfs(root, []);
    return res;
}

// ==================== 16. 另一个树的子树 ====================
function isSubtree(root, subRoot) {
    const same = (a, b) => {
        if (!a && !b) return true;
        if (!a || !b || a.val !== b.val) return false;
        return same(a.left, b.left) && same(a.right, b.right);
    };
    if (!root) return !subRoot;
    return same(root, subRoot) || isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

// ==================== 17. 二叉树的坡度 ====================
function findTilt(root) {
    let tilt = 0;
    const sum = (node) => {
        if (!node) return 0;
        const l = sum(node.left), r = sum(node.right);
        tilt += Math.abs(l - r);
        return node.val + l + r;
    };
    sum(root);
    return tilt;
}

// ==================== 18. N 叉树的前序遍历 ====================
function preorderNary(root) {
    if (!root) return [];
    const res = [root.val];
    for (const c of root.children || []) res.push(...preorderNary(c));
    return res;
}

// ==================== 19. N 叉树的后序遍历 ====================
function postorderNary(root) {
    if (!root) return [];
    const res = [];
    for (const c of root.children || []) res.push(...postorderNary(c));
    res.push(root.val);
    return res;
}

// ==================== 20. N 叉树的层序遍历 ====================
function levelOrderNary(root) {
    if (!root) return [];
    const res = [], q = [root];
    while (q.length) {
        const row = [], n = q.length;
        for (let i = 0; i < n; i++) {
            const node = q.shift();
            row.push(node.val);
            for (const c of node.children || []) q.push(c);
        }
        res.push(row);
    }
    return res;
}

// ==================== 测试 ====================
function test031001() {
    const assert = (n, a, e) => console.log(JSON.stringify(a) === JSON.stringify(e) ? `[OK] ${n}` : `[FAIL] ${n}`);
    const t = new TreeNode(1, new TreeNode(2), new TreeNode(3));
    assert('1', inorderTraversal(t), [2, 1, 3]);
    assert('2', preorderTraversal(t), [1, 2, 3]);
    assert('4', levelOrder(t), [[1], [2, 3]]);
    assert('8', sumNumbers(new TreeNode(1, new TreeNode(2), new TreeNode(3))), 25);
    assert('13', isBalanced(new TreeNode(1, new TreeNode(2), new TreeNode(3))), true);
    console.log('031001 tests done.');
}
test031001();
