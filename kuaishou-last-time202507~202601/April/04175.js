/**
 * 04175.js — 前端代码算法题 20 道（二叉树 · 遍历 / 路径 · 构造 / BST）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 树结点：{ val, left, right }

// 1. maxDepth(root)
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// 2. minDepth(root)：到最近叶子。
function minDepth(root) {
  if (!root) return 0;
  if (!root.left) return 1 + minDepth(root.right);
  if (!root.right) return 1 + minDepth(root.left);
  return 1 + Math.min(minDepth(root.left), minDepth(root.right));
}

// 3. isSameTree(p, q)
function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q) return false;
  return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

// 4. invertTree(root)
function invertTree(root) {
  if (!root) return null;
  const l = invertTree(root.left);
  const r = invertTree(root.right);
  root.left = r;
  root.right = l;
  return root;
}

// 5. isSymmetric(root)
function isSymmetric(root) {
  const mir = (a, b) => {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.val === b.val && mir(a.left, b.right) && mir(a.right, b.left);
  };
  return !root || mir(root.left, root.right);
}

// 6. lowestCommonAncestorBST(root, p, q)（BST）
function lowestCommonAncestorBST(root, p, q) {
  let x = root;
  const pv = p.val;
  const qv = q.val;
  while (x) {
    if (pv < x.val && qv < x.val) x = x.left;
    else if (pv > x.val && qv > x.val) x = x.right;
    else return x;
  }
  return null;
}

// 7. lowestCommonAncestorBT(root, p, q)（普通二叉树）
function lowestCommonAncestorBT(root, p, q) {
  if (!root || root === p || root === q) return root;
  const l = lowestCommonAncestorBT(root.left, p, q);
  const r = lowestCommonAncestorBT(root.right, p, q);
  if (l && r) return root;
  return l || r;
}

// 8. diameterOfBinaryTree(root)：路径边数最长。
function diameterOfBinaryTree(root) {
  let best = 0;
  const depth = (n) => {
    if (!n) return 0;
    const l = depth(n.left);
    const r = depth(n.right);
    best = Math.max(best, l + r);
    return 1 + Math.max(l, r);
  };
  depth(root);
  return best;
}

// 9. isBalanced(root)
function isBalanced(root) {
  const h = (n) => {
    if (!n) return 0;
    const l = h(n.left);
    const r = h(n.right);
    if (l === -1 || r === -1 || Math.abs(l - r) > 1) return -1;
    return 1 + Math.max(l, r);
  };
  return h(root) !== -1;
}

// 10. hasPathSum(root, targetSum)
function hasPathSum(root, targetSum) {
  if (!root) return false;
  if (!root.left && !root.right) return targetSum === root.val;
  return (
    hasPathSum(root.left, targetSum - root.val) || hasPathSum(root.right, targetSum - root.val)
  );
}

// 11. pathSumIII(root, targetSum)：任意起点向下路径和为 target 的路径数。
function pathSumIII(root, targetSum) {
  const cnt = new Map([[0, 1]]);
  let ans = 0;
  const dfs = (n, pre) => {
    if (!n) return;
    pre += n.val;
    ans += cnt.get(pre - targetSum) || 0;
    cnt.set(pre, (cnt.get(pre) || 0) + 1);
    dfs(n.left, pre);
    dfs(n.right, pre);
    cnt.set(pre, cnt.get(pre) - 1);
  };
  dfs(root, 0);
  return ans;
}

// 12. flatten(root)：原地拉成右链表（先序）。
function flatten(root) {
  let prev = null;
  const dfs = (n) => {
    if (!n) return;
    dfs(n.right);
    dfs(n.left);
    n.right = prev;
    n.left = null;
    prev = n;
  };
  dfs(root);
}

// 13. connect(root)：完美二叉树 next 指针（层序 next）。
function connect(root) {
  let head = root;
  while (head && head.left) {
    let cur = head;
    while (cur) {
      cur.left.next = cur.right;
      if (cur.next) cur.right.next = cur.next.left;
      cur = cur.next;
    }
    head = head.left;
  }
  return root;
}

// 14. rightSideView(root)：每层最右。
function rightSideView(root) {
  const res = [];
  const dfs = (n, d) => {
    if (!n) return;
    if (res.length === d) res.push(n.val);
    dfs(n.right, d + 1);
    dfs(n.left, d + 1);
  };
  dfs(root, 0);
  return res;
}

// 15. zigzagLevelOrder(root)
function zigzagLevelOrder(root) {
  if (!root) return [];
  const res = [];
  const q = [root];
  let left = true;
  while (q.length) {
    const sz = q.length;
    const level = Array(sz);
    for (let i = 0; i < sz; i += 1) {
      const n = q.shift();
      const j = left ? i : sz - 1 - i;
      level[j] = n.val;
      if (n.left) q.push(n.left);
      if (n.right) q.push(n.right);
    }
    res.push(level);
    left = !left;
  }
  return res;
}

// 16. buildTree(preorder, inorder)：前序+中序建树。
function buildTree(preorder, inorder) {
  const idx = new Map();
  inorder.forEach((v, i) => idx.set(v, i));
  const aux = (ps, pe, is, ie) => {
    if (ps > pe || is > ie) return null;
    const v = preorder[ps];
    const im = idx.get(v);
    const leftLen = im - is;
    const root = { val: v, left: null, right: null };
    root.left = aux(ps + 1, ps + leftLen, is, im - 1);
    root.right = aux(ps + leftLen + 1, pe, im + 1, ie);
    return root;
  };
  return aux(0, preorder.length - 1, 0, inorder.length - 1);
}

// 17. sortedArrayToBST(nums)：升序数组平衡 BST。
function sortedArrayToBST(nums) {
  const aux = (lo, hi) => {
    if (lo > hi) return null;
    const mid = (lo + hi) >> 1;
    const n = { val: nums[mid], left: null, right: null };
    n.left = aux(lo, mid - 1);
    n.right = aux(mid + 1, hi);
    return n;
  };
  return aux(0, nums.length - 1);
}

// 18. kthSmallest(root, k)：BST 第 k 小。
function kthSmallest(root, k) {
  const st = [];
  let n = root;
  while (st.length || n) {
    while (n) {
      st.push(n);
      n = n.left;
    }
    n = st.pop();
    k -= 1;
    if (k === 0) return n.val;
    n = n.right;
  }
  return -1;
}

// 19. validateBST(root)
function validateBST(root) {
  let pred = -Infinity;
  const inorder = (n) => {
    if (!n) return true;
    if (!inorder(n.left)) return false;
    if (n.val <= pred) return false;
    pred = n.val;
    return inorder(n.right);
  };
  return inorder(root);
}

// 20. boundaryOfBinaryTree(root)：逆时针边界值。
function boundaryOfBinaryTree(root) {
  if (!root) return [];
  if (!root.left && !root.right) return [root.val];
  const res = [];
  const isLeaf = (n) => n && !n.left && !n.right;
  const leftB = (n) => {
    while (n && !isLeaf(n)) {
      res.push(n.val);
      n = n.left || n.right;
    }
  };
  const leaves = (n) => {
    if (!n) return;
    if (isLeaf(n)) {
      res.push(n.val);
      return;
    }
    leaves(n.left);
    leaves(n.right);
  };
  const rightB = (n) => {
    const stk = [];
    while (n && !isLeaf(n)) {
      stk.push(n.val);
      n = n.right || n.left;
    }
    while (stk.length) res.push(stk.pop());
  };
  res.push(root.val);
  leftB(root.left);
  leaves(root);
  rightB(root.right);
  return res;
}

module.exports = {
  maxDepth,
  minDepth,
  isSameTree,
  invertTree,
  isSymmetric,
  lowestCommonAncestorBST,
  lowestCommonAncestorBT,
  diameterOfBinaryTree,
  isBalanced,
  hasPathSum,
  pathSumIII,
  flatten,
  connect,
  rightSideView,
  zigzagLevelOrder,
  buildTree,
  sortedArrayToBST,
  kthSmallest,
  validateBST,
  boundaryOfBinaryTree,
};
