/**
 * 04153.js — 前端代码算法题 20 道（链表 / 二叉树基础）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

function reverseList(head) {
  let prev = null;
  let cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}

function middleNode(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}

function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

function mergeTwoLists(list1, list2) {
  const dummy = { next: null };
  let p = dummy;
  let a = list1;
  let b = list2;
  while (a && b) {
    if (a.val < b.val) {
      p.next = a;
      a = a.next;
    } else {
      p.next = b;
      b = b.next;
    }
    p = p.next;
  }
  p.next = a || b;
  return dummy.next;
}

function removeNthFromEnd(head, n) {
  const dummy = { next: head };
  let fast = dummy;
  let slow = dummy;
  for (let i = 0; i < n; i += 1) fast = fast.next;
  while (fast.next) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}

function deleteDuplicatesList(head) {
  let cur = head;
  while (cur && cur.next) {
    if (cur.val === cur.next.val) cur.next = cur.next.next;
    else cur = cur.next;
  }
  return head;
}

function getIntersectionNode(headA, headB) {
  let a = headA;
  let b = headB;
  while (a !== b) {
    a = a ? a.next : headB;
    b = b ? b.next : headA;
  }
  return a;
}

function isPalindromeList(head) {
  if (!head || !head.next) return true;
  let slow = head;
  let fast = head;
  while (fast.next && fast.next.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  let prev = null;
  let cur = slow.next;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  let p1 = head;
  let p2 = prev;
  while (p2) {
    if (p1.val !== p2.val) return false;
    p1 = p1.next;
    p2 = p2.next;
  }
  return true;
}

function invertTree(root) {
  if (!root) return root;
  [root.left, root.right] = [root.right, root.left];
  invertTree(root.left);
  invertTree(root.right);
  return root;
}

function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q) return false;
  return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

function minDepth(root) {
  if (!root) return 0;
  if (!root.left) return 1 + minDepth(root.right);
  if (!root.right) return 1 + minDepth(root.left);
  return 1 + Math.min(minDepth(root.left), minDepth(root.right));
}

function isSymmetric(root) {
  const check = (a, b) => {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.val === b.val && check(a.left, b.right) && check(a.right, b.left);
  };
  return check(root, root);
}

function preorderTraversal(root) {
  const ans = [];
  const dfs = (node) => {
    if (!node) return;
    ans.push(node.val);
    dfs(node.left);
    dfs(node.right);
  };
  dfs(root);
  return ans;
}

function inorderTraversal(root) {
  const ans = [];
  const dfs = (node) => {
    if (!node) return;
    dfs(node.left);
    ans.push(node.val);
    dfs(node.right);
  };
  dfs(root);
  return ans;
}

function postorderTraversal(root) {
  const ans = [];
  const dfs = (node) => {
    if (!node) return;
    dfs(node.left);
    dfs(node.right);
    ans.push(node.val);
  };
  dfs(root);
  return ans;
}

function levelOrder(root) {
  if (!root) return [];
  const q = [root];
  const ans = [];
  while (q.length) {
    const size = q.length;
    const layer = [];
    for (let i = 0; i < size; i += 1) {
      const node = q.shift();
      layer.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    ans.push(layer);
  }
  return ans;
}

function hasPathSum(root, targetSum) {
  if (!root) return false;
  if (!root.left && !root.right) return root.val === targetSum;
  return hasPathSum(root.left, targetSum - root.val) || hasPathSum(root.right, targetSum - root.val);
}

function sumOfLeftLeaves(root) {
  if (!root) return 0;
  let ans = 0;
  if (root.left && !root.left.left && !root.left.right) ans += root.left.val;
  return ans + sumOfLeftLeaves(root.left) + sumOfLeftLeaves(root.right);
}

function binaryTreePaths(root) {
  const ans = [];
  const dfs = (node, path) => {
    if (!node) return;
    const cur = path ? `${path}->${node.val}` : `${node.val}`;
    if (!node.left && !node.right) {
      ans.push(cur);
      return;
    }
    dfs(node.left, cur);
    dfs(node.right, cur);
  };
  dfs(root, '');
  return ans;
}

module.exports = {
  reverseList,
  middleNode,
  hasCycle,
  mergeTwoLists,
  removeNthFromEnd,
  deleteDuplicatesList,
  getIntersectionNode,
  isPalindromeList,
  invertTree,
  isSameTree,
  maxDepth,
  minDepth,
  isSymmetric,
  preorderTraversal,
  inorderTraversal,
  postorderTraversal,
  levelOrder,
  hasPathSum,
  sumOfLeftLeaves,
  binaryTreePaths,
};
