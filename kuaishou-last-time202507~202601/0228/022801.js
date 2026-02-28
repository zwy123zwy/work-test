/**
 * 022801 面试算法题（20 道）- 专题：树进阶与综合
 * 日期：2026-02-28
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 二叉树的右视图 ====================
function rightSideView(root) {
    if (!root) return [];
    const res = [], q = [root];
    while (q.length) {
        const len = q.length;
        res.push(q[len - 1].val);
        for (let i = 0; i < len; i++) {
            const n = q.shift();
            if (n.left) q.push(n.left);
            if (n.right) q.push(n.right);
        }
    }
    return res;
}

// ==================== 2. 二叉树的左视图 ====================
function leftSideView(root) {
    if (!root) return [];
    const res = [], q = [root];
    while (q.length) {
        res.push(q[0].val);
        const len = q.length;
        for (let i = 0; i < len; i++) {
            const n = q.shift();
            if (n.left) q.push(n.left);
            if (n.right) q.push(n.right);
        }
    }
    return res;
}

// ==================== 3. 二叉树的序列化与反序列化 ====================
function serialize(root) {
    if (!root) return 'null';
    return root.val + ',' + serialize(root.left) + ',' + serialize(root.right);
}
function deserialize(data) {
    const arr = data.split(',');
    let i = 0;
    function build() {
        const v = arr[i++];
        if (v === 'null' || v === undefined) return null;
        return new TreeNode(+v, build(), build());
    }
    return build();
}

// ==================== 4. 二叉搜索树序列化 ====================
function serializeBST(root) {
    return serialize(root);
}
function deserializeBST(data) {
    const arr = data.split(',');
    let i = 0;
    function build(lo, hi) {
        if (i >= arr.length) return null;
        const v = arr[i];
        if (v === 'null' || v === undefined) return null;
        const val = +v;
        if (val < lo || val > hi) return null;
        i++;
        return new TreeNode(val, build(lo, val), build(val, hi));
    }
    return build(-Infinity, Infinity);
}

// ==================== 5. 完全二叉树的节点个数 ====================
function countNodes(root) {
    if (!root) return 0;
    let lh = 0, rh = 0;
    for (let p = root; p; p = p.left) lh++;
    for (let p = root; p; p = p.right) rh++;
    if (lh === rh) return (1 << lh) - 1;
    return 1 + countNodes(root.left) + countNodes(root.right);
}

// ==================== 6. 二叉树的完全性检验 ====================
function isCompleteTree(root) {
    const q = [root];
    let seenNull = false;
    while (q.length) {
        const n = q.shift();
        if (!n) { seenNull = true; continue; }
        if (seenNull) return false;
        q.push(n.left, n.right);
    }
    return true;
}

// ==================== 7. 在二叉树中增加一行 ====================
function addOneRow(root, val, depth) {
    if (depth === 1) return new TreeNode(val, root, null);
    const q = [root];
    let d = 1;
    while (q.length) {
        const len = q.length;
        if (d === depth - 1) {
            for (let i = 0; i < len; i++) {
                const n = q.shift();
                n.left = new TreeNode(val, n.left, null);
                n.right = new TreeNode(val, null, n.right);
            }
            break;
        }
        for (let i = 0; i < len; i++) {
            const n = q.shift();
            if (n.left) q.push(n.left);
            if (n.right) q.push(n.right);
        }
        d++;
    }
    return root;
}

// ==================== 8. 找树左下角的值 ====================
function findBottomLeftValue(root) {
    const q = [root];
    let first = root.val;
    while (q.length) {
        const len = q.length;
        first = q[0].val;
        for (let i = 0; i < len; i++) {
            const n = q.shift();
            if (n.left) q.push(n.left);
            if (n.right) q.push(n.right);
        }
    }
    return first;
}

// ==================== 9. 二叉树的边界 ====================
function boundaryOfBinaryTree(root) {
    if (!root) return [];
    const left = [], leaves = [], right = [];
    function leftBound(node) {
        if (!node || (!node.left && !node.right)) return;
        left.push(node.val);
        leftBound(node.left || node.right);
    }
    function collectLeaves(node) {
        if (!node) return;
        if (!node.left && !node.right) leaves.push(node.val);
        collectLeaves(node.left);
        collectLeaves(node.right);
    }
    function rightBound(node) {
        if (!node || (!node.left && !node.right)) return;
        right.push(node.val);
        rightBound(node.right || node.left);
    }
    leftBound(root.left);
    if (root.left || root.right) collectLeaves(root);
    else leaves.push(root.val);
    rightBound(root.right);
    return [root.val, ...left, ...(root.left || root.right ? leaves : []), ...right.reverse()];
}

// ==================== 10. 二叉搜索树迭代器 ====================
class BSTIterator {
    constructor(root) {
        this.stack = [];
        this.pushLeft(root);
    }
    pushLeft(node) {
        while (node) { this.stack.push(node); node = node.left; }
    }
    next() {
        const n = this.stack.pop();
        this.pushLeft(n.right);
        return n.val;
    }
    hasNext() {
        return this.stack.length > 0;
    }
}

// ==================== 11. 恢复二叉搜索树 ====================
function recoverTree(root) {
    let x = null, y = null, prev = null;
    function dfs(node) {
        if (!node) return;
        dfs(node.left);
        if (prev && prev.val > node.val) {
            y = node;
            if (!x) x = prev;
        }
        prev = node;
        dfs(node.right);
    }
    dfs(root);
    if (x && y) [x.val, y.val] = [y.val, x.val];
}

// ==================== 12. 二叉搜索树中的众数 ====================
function findMode(root) {
    let maxCount = 0, curCount = 0, prev = null, res = [];
    function inorder(node) {
        if (!node) return;
        inorder(node.left);
        if (prev === null || prev !== node.val) curCount = 1;
        else curCount++;
        prev = node.val;
        if (curCount > maxCount) { maxCount = curCount; res = [node.val]; }
        else if (curCount === maxCount) res.push(node.val);
        inorder(node.right);
    }
    inorder(root);
    return res;
}

// ==================== 13. 把二叉搜索树转换为累加树 ====================
function convertBST(root) {
    let sum = 0;
    function revInorder(node) {
        if (!node) return;
        revInorder(node.right);
        sum += node.val;
        node.val = sum;
        revInorder(node.left);
    }
    revInorder(root);
    return root;
}

// ==================== 14. 二叉搜索树的范围和 ====================
function rangeSumBST(root, low, high) {
    if (!root) return 0;
    if (root.val < low) return rangeSumBST(root.right, low, high);
    if (root.val > high) return rangeSumBST(root.left, low, high);
    return root.val + rangeSumBST(root.left, low, high) + rangeSumBST(root.right, low, high);
}

// ==================== 15. 修剪二叉搜索树 ====================
function trimBST(root, low, high) {
    if (!root) return null;
    if (root.val < low) return trimBST(root.right, low, high);
    if (root.val > high) return trimBST(root.left, low, high);
    root.left = trimBST(root.left, low, high);
    root.right = trimBST(root.right, low, high);
    return root;
}

// ==================== 16. 删除二叉搜索树中的节点 ====================
function deleteNode(root, key) {
    if (!root) return null;
    if (key < root.val) { root.left = deleteNode(root.left, key); return root; }
    if (key > root.val) { root.right = deleteNode(root.right, key); return root; }
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    let p = root.right;
    while (p.left) p = p.left;
    root.val = p.val;
    root.right = deleteNode(root.right, p.val);
    return root;
}

// ==================== 17. 二叉搜索树中的插入操作 ====================
function insertIntoBST(root, val) {
    if (!root) return new TreeNode(val);
    if (val < root.val) root.left = insertIntoBST(root.left, val);
    else root.right = insertIntoBST(root.right, val);
    return root;
}

// ==================== 18. 后继者 ====================
function inorderSuccessor(root, p) {
    let succ = null;
    while (root) {
        if (p.val < root.val) { succ = root; root = root.left; }
        else root = root.right;
    }
    return succ;
}

// ==================== 19. 从先序遍历还原二叉树 ====================
function recoverFromPreorder(traversal) {
    const stack = [];
    let i = 0;
    while (i < traversal.length) {
        let d = 0;
        while (traversal[i] === '-') { d++; i++; }
        let num = '';
        while (i < traversal.length && traversal[i] !== '-') num += traversal[i++];
        const node = new TreeNode(+num);
        while (stack.length > d) stack.pop();
        if (stack.length) {
            if (!stack[stack.length - 1].left) stack[stack.length - 1].left = node;
            else stack[stack.length - 1].right = node;
        }
        stack.push(node);
    }
    return stack[0] || null;
}

// ==================== 20. 二叉树的垂序遍历 ====================
function verticalTraversal(root) {
    const nodes = [];
    function dfs(node, col, row) {
        if (!node) return;
        nodes.push([col, row, node.val]);
        dfs(node.left, col - 1, row + 1);
        dfs(node.right, col + 1, row + 1);
    }
    dfs(root, 0, 0);
    nodes.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] !== b[1] ? a[1] - b[1] : a[2] - b[2]);
    const res = [];
    let prevCol = null;
    for (const [col, , val] of nodes) {
        if (col !== prevCol) res.push([]);
        res[res.length - 1].push(val);
        prevCol = col;
    }
    return res;
}

// ==================== 测试 ====================
function test022801() {
    const assert = (name, got, expect) => {
        const ok = JSON.stringify(got) === JSON.stringify(expect);
        console.log(ok ? `[OK] ${name}` : `[FAIL] ${name} got=${JSON.stringify(got)} expect=${JSON.stringify(expect)}`);
    };
    const r1 = new TreeNode(1, new TreeNode(2, null, new TreeNode(5)), new TreeNode(3, null, new TreeNode(4)));
    assert('1. rightSideView', rightSideView(r1), [1, 3, 4]);
    const r2 = new TreeNode(1, new TreeNode(2, new TreeNode(4)), new TreeNode(3));
    assert('2. leftSideView', leftSideView(r2), [1, 2, 4]);
    const r3 = new TreeNode(1, new TreeNode(2), new TreeNode(3));
    assert('3. serialize', serialize(r3), '1,2,null,null,3,null,null');
    const r3b = deserialize('1,2,null,null,3,null,null');
    assert('3. deserialize', r3b && r3b.val === 1 && r3b.left.val === 2 && r3b.right.val === 3, true);
    const r5 = new TreeNode(1, new TreeNode(2, new TreeNode(4), new TreeNode(5)), new TreeNode(3, new TreeNode(6), null));
    assert('5. countNodes', countNodes(r5), 6);
    const r6 = new TreeNode(1, new TreeNode(2, new TreeNode(4), new TreeNode(5)), new TreeNode(3, new TreeNode(6), null));
    assert('6. isCompleteTree', isCompleteTree(r6), true);
    const r8 = new TreeNode(2, new TreeNode(1), new TreeNode(3));
    assert('8. findBottomLeftValue', findBottomLeftValue(r8), 1);
    const r10 = new TreeNode(7, new TreeNode(3), new TreeNode(15, new TreeNode(9), new TreeNode(20)));
    const it = new BSTIterator(r10);
    const nexts = [it.next(), it.next(), it.hasNext(), it.next(), it.hasNext(), it.next(), it.hasNext()];
    assert('10. BSTIterator', nexts, [3, 7, true, 9, true, 15, true]);
    const r14 = new TreeNode(10, new TreeNode(5, new TreeNode(3), new TreeNode(7)), new TreeNode(15, null, new TreeNode(18)));
    assert('14. rangeSumBST', rangeSumBST(r14, 7, 15), 32);
    const r19 = recoverFromPreorder('1-2--3--4-5--6--7');
    assert('19. recoverFromPreorder', r19 && r19.val === 1 && r19.left.val === 2 && r19.left.left.val === 3, true);
    const r20 = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
    assert('20. verticalTraversal', verticalTraversal(r20), [[9], [3, 15], [20], [7]]);
    console.log('022801 tests done.');
}
test022801();
