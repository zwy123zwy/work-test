/**
 * 04165.js — 前端代码算法题 20 道（二叉树进阶 / LCA / 路径）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}

// 1. lowestCommonAncestor(root, p, q)：BST 最近公共祖先。
function lowestCommonAncestorBST(root, p, q) {
  let n = root;
  const a = Math.min(p.val, q.val);
  const b = Math.max(p.val, q.val);
  while (n) {
    if (n.val > b) n = n.left;
    else if (n.val < a) n = n.right;
    else return n;
  }
  return null;
}

// 2. lowestCommonAncestor(root, p, q)：一般二叉树。
function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const L = lowestCommonAncestor(root.left, p, q);
  const R = lowestCommonAncestor(root.right, p, q);
  if (L && R) return root;
  return L || R;
}

// 3. distanceK(root, target, k)：距 target 为 k 的节点值。
function distanceK(root, target, k) {
  const parent = new Map();
  const dfs = (node, par) => {
    if (!node) return;
    if (par !== null) parent.set(node, par);
    dfs(node.left, node);
    dfs(node.right, node);
  };
  dfs(root, null);
  const q = [target];
  const seen = new Set([target]);
  let d = 0;
  while (q.length && d < k) {
    const sz = q.length;
    for (let i = 0; i < sz; i += 1) {
      const n = q.shift();
      for (const nx of [n.left, n.right, parent.get(n)]) {
        if (nx && !seen.has(nx)) {
          seen.add(nx);
          q.push(nx);
        }
      }
    }
    d += 1;
  }
  return q.map((n) => n.val);
}

// 4. pathSumThree(root, sum)：路径和为 sum 的路径条数（前缀和）。
function pathSumThree(root, sum) {
  let ans = 0;
  const cnt = new Map([[0, 1]]);
  const dfs = (node, pre) => {
    if (!node) return;
    const cur = pre + node.val;
    ans += cnt.get(cur - sum) || 0;
    cnt.set(cur, (cnt.get(cur) || 0) + 1);
    dfs(node.left, cur);
    dfs(node.right, cur);
    cnt.set(cur, cnt.get(cur) - 1);
  };
  dfs(root, 0);
  return ans;
}

// 5. maxPathSum(root)：任意路径最大和。
function maxPathSum(root) {
  let ans = -Infinity;
  const dfs = (node) => {
    if (!node) return 0;
    const L = Math.max(0, dfs(node.left));
    const R = Math.max(0, dfs(node.right));
    ans = Math.max(ans, L + R + node.val);
    return Math.max(L, R) + node.val;
  };
  dfs(root);
  return ans;
}

// 6. flatten(root)：原地展开为右链表（后序拼接左子树到右）。
function flatten(root) {
  if (!root) return null;
  flatten(root.left);
  flatten(root.right);
  const R = root.right;
  root.right = root.left;
  root.left = null;
  let p = root;
  while (p.right) p = p.right;
  p.right = R;
  return root;
}

// 7. connect(root)：完美二叉树 next 指针（结点需含 next 字段）。
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

// 8. rightSideView(root)：右视图。
function rightSideView(root) {
  const ans = [];
  const dfs = (node, d) => {
    if (!node) return;
    ans[d] = node.val;
    dfs(node.left, d + 1);
    dfs(node.right, d + 1);
  };
  dfs(root, 0);
  return ans;
}

// 9. boundaryOfBinaryTree(root)：边界遍历。
function boundaryOfBinaryTree(root) {
  if (!root) return [];
  const left = [];
  const leaves = [];
  const right = [];
  const isLeaf = (n) => n && !n.left && !n.right;
  const collectLeft = (n) => {
    if (!n || isLeaf(n)) return;
    left.push(n.val);
    if (n.left) collectLeft(n.left);
    else collectLeft(n.right);
  };
  const collectLeaves = (n) => {
    if (!n) return;
    if (isLeaf(n)) leaves.push(n.val);
    else {
      collectLeaves(n.left);
      collectLeaves(n.right);
    }
  };
  const collectRight = (n) => {
    if (!n || isLeaf(n)) return;
    if (n.right) collectRight(n.right);
    else collectRight(n.left);
    right.push(n.val);
  };
  if (!isLeaf(root)) left.push(root.val);
  collectLeft(root.left);
  collectLeaves(root);
  collectRight(root.right);
  return [...left, ...leaves, ...right];
}

// 10. sumNumbers(root)：根到叶数字和。
function sumNumbers(root) {
  let ans = 0;
  const dfs = (node, v) => {
    if (!node) return;
    const nv = v * 10 + node.val;
    if (!node.left && !node.right) ans += nv;
    dfs(node.left, nv);
    dfs(node.right, nv);
  };
  dfs(root, 0);
  return ans;
}

// 11. sumOfLeftLeaves(root)：左叶子之和。
function sumOfLeftLeaves(root) {
  let ans = 0;
  const dfs = (node, isLeft) => {
    if (!node) return;
    if (!node.left && !node.right && isLeft) ans += node.val;
    dfs(node.left, true);
    dfs(node.right, false);
  };
  dfs(root, false);
  return ans;
}

// 12. findBottomLeftValue(root)：最底层最左值。
function findBottomLeftValue(root) {
  let ans = root.val;
  let depth = -1;
  const dfs = (node, d) => {
    if (!node) return;
    if (!node.left && !node.right) {
      if (d > depth) {
        depth = d;
        ans = node.val;
      }
    }
    dfs(node.left, d + 1);
    dfs(node.right, d + 1);
  };
  dfs(root, 0);
  return ans;
}

// 13. longestUnivaluePath(root)：同值最长路径边数。
function longestUnivaluePath(root) {
  let ans = 0;
  const dfs = (node) => {
    if (!node) return 0;
    const L = dfs(node.left);
    const R = dfs(node.right);
    let l = 0;
    let r = 0;
    if (node.left && node.left.val === node.val) l = L + 1;
    if (node.right && node.right.val === node.val) r = R + 1;
    ans = Math.max(ans, l + r);
    return Math.max(l, r);
  };
  dfs(root);
  return ans;
}

// 14. rob(root)：二叉树打家劫舍。
function rob(root) {
  const dfs = (node) => {
    if (!node) return [0, 0];
    const L = dfs(node.left);
    const R = dfs(node.right);
    const take = node.val + L[1] + R[1];
    const skip = Math.max(L[0], L[1]) + Math.max(R[0], R[1]);
    return [take, skip];
  };
  const r = dfs(root);
  return Math.max(r[0], r[1]);
}

// 15. isValidBST(root)：是否 BST。
function isValidBST(root) {
  let pre = -Infinity;
  let ok = true;
  const dfs = (node) => {
    if (!node) return;
    dfs(node.left);
    if (node.val <= pre) ok = false;
    pre = node.val;
    dfs(node.right);
  };
  dfs(root);
  return ok;
}

// 16. kthSmallest(root, k)：BST 第 k 小。
function kthSmallest(root, k) {
  const st = [];
  let n = root;
  while (n || st.length) {
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

// 17. buildTree(preorder, inorder)：前序+中序建树。
function buildTree(preorder, inorder) {
  const idx = new Map();
  inorder.forEach((v, i) => idx.set(v, i));
  let p = 0;
  const dfs = (lo, hi) => {
    if (lo > hi) return null;
    const v = preorder[p];
    p += 1;
    const m = idx.get(v);
    const node = new TreeNode(v);
    node.left = dfs(lo, m - 1);
    node.right = dfs(m + 1, hi);
    return node;
  };
  return dfs(0, inorder.length - 1);
}

// 18. serialize / deserialize 二叉树。
function serialize(root) {
  const out = [];
  const dfs = (node) => {
    if (!node) {
      out.push('null');
      return;
    }
    out.push(String(node.val));
    dfs(node.left);
    dfs(node.right);
  };
  dfs(root);
  return out.join(',');
}

function deserialize(data) {
  const arr = data.split(',');
  let i = 0;
  const dfs = () => {
    if (arr[i] === 'null') {
      i += 1;
      return null;
    }
    const node = new TreeNode(+arr[i]);
    i += 1;
    node.left = dfs();
    node.right = dfs();
    return node;
  };
  return dfs();
}

// 19. isSubtree(s, t)：t 是否为 s 的子树。
function isSubtree(s, t) {
  const same = (a, b) => {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.val === b.val && same(a.left, b.left) && same(a.right, b.right);
  };
  const dfs = (a) => {
    if (!a) return false;
    return same(a, t) || dfs(a.left) || dfs(a.right);
  };
  return dfs(s);
}

// 20. diameterOfBinaryTree(root)：直径（边数）。
function diameterOfBinaryTree(root) {
  let ans = 0;
  const dfs = (node) => {
    if (!node) return 0;
    const L = dfs(node.left);
    const R = dfs(node.right);
    ans = Math.max(ans, L + R);
    return Math.max(L, R) + 1;
  };
  dfs(root);
  return ans;
}

module.exports = {
  TreeNode,
  lowestCommonAncestorBST,
  lowestCommonAncestor,
  distanceK,
  pathSumThree,
  maxPathSum,
  flatten,
  connect,
  rightSideView,
  boundaryOfBinaryTree,
  sumNumbers,
  sumOfLeftLeaves,
  findBottomLeftValue,
  longestUnivaluePath,
  rob,
  isValidBST,
  kthSmallest,
  buildTree,
  serialize,
  deserialize,
  isSubtree,
  diameterOfBinaryTree,
};
