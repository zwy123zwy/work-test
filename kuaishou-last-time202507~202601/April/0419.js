/**
 * 0419.js - 携程面试常见代码题 20 道（链表 / 二叉树 / 回溯 / 排序）
 * 结合公开携程前端面经里出现过的反转链表、冒泡排序，以及常见算法手写题整理。
 */

// 1. ListNode：链表节点
function ListNode(val, next = null) {
  this.val = val;
  this.next = next;
}

// 2. TreeNode：二叉树节点
function TreeNode(val, left = null, right = null) {
  this.val = val;
  this.left = left;
  this.right = right;
}

// 3. reverseList(head)：反转链表
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

// 4. hasCycle(head)：判断链表是否有环
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

// 5. mergeTwoLists(list1, list2)：合并两个有序链表
function mergeTwoLists(list1, list2) {
  const dummy = new ListNode(0);
  let cur = dummy;
  let p1 = list1;
  let p2 = list2;

  while (p1 && p2) {
    if (p1.val <= p2.val) {
      cur.next = p1;
      p1 = p1.next;
    } else {
      cur.next = p2;
      p2 = p2.next;
    }
    cur = cur.next;
  }

  cur.next = p1 || p2;
  return dummy.next;
}

// 6. removeNthFromEnd(head, n)：删除链表倒数第 n 个节点
function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let fast = dummy;
  let slow = dummy;

  for (let i = 0; i < n; i += 1) fast = fast.next;
  while (fast && fast.next) {
    fast = fast.next;
    slow = slow.next;
  }

  slow.next = slow.next ? slow.next.next : null;
  return dummy.next;
}

// 7. bubbleSort(nums)：冒泡排序
function bubbleSort(nums) {
  const arr = nums.slice();
  for (let i = 0; i < arr.length - 1; i += 1) {
    let swapped = false;
    for (let j = 0; j < arr.length - 1 - i; j += 1) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}

// 8. quickSort(nums)：快速排序
function quickSort(nums) {
  if (nums.length <= 1) return nums.slice();
  const pivot = nums[Math.floor(nums.length / 2)];
  const left = [];
  const equal = [];
  const right = [];

  for (const num of nums) {
    if (num < pivot) left.push(num);
    else if (num > pivot) right.push(num);
    else equal.push(num);
  }

  return quickSort(left).concat(equal, quickSort(right));
}

// 9. mergeSort(nums)：归并排序
function mergeSort(nums) {
  if (nums.length <= 1) return nums.slice();
  const mid = Math.floor(nums.length / 2);
  const left = mergeSort(nums.slice(0, mid));
  const right = mergeSort(nums.slice(mid));
  const result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }

  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);
  return result;
}

// 10. binarySearch(nums, target)：二分查找
function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

// 11. preorderTraversal(root)：前序遍历
function preorderTraversal(root) {
  const result = [];

  function dfs(node) {
    if (!node) return;
    result.push(node.val);
    dfs(node.left);
    dfs(node.right);
  }

  dfs(root);
  return result;
}

// 12. inorderTraversal(root)：中序遍历
function inorderTraversal(root) {
  const result = [];

  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  }

  dfs(root);
  return result;
}

// 13. levelOrder(root)：层序遍历
function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];

  while (queue.length) {
    const size = queue.length;
    const level = [];
    for (let i = 0; i < size; i += 1) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }

  return result;
}

// 14. maxDepth(root)：二叉树最大深度
function maxDepth(root) {
  if (!root) return 0;
  return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
}

// 15. lowestCommonAncestor(root, p, q)：二叉树最近公共祖先
function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left || right;
}

// 16. permute(nums)：全排列
function permute(nums) {
  const result = [];
  const used = Array(nums.length).fill(false);
  const path = [];

  function backtrack() {
    if (path.length === nums.length) {
      result.push(path.slice());
      return;
    }

    for (let i = 0; i < nums.length; i += 1) {
      if (used[i]) continue;
      used[i] = true;
      path.push(nums[i]);
      backtrack();
      path.pop();
      used[i] = false;
    }
  }

  backtrack();
  return result;
}

// 17. subsets(nums)：子集
function subsets(nums) {
  const result = [];
  const path = [];

  function dfs(index) {
    result.push(path.slice());
    for (let i = index; i < nums.length; i += 1) {
      path.push(nums[i]);
      dfs(i + 1);
      path.pop();
    }
  }

  dfs(0);
  return result;
}

// 18. generateParenthesis(n)：生成有效括号
function generateParenthesis(n) {
  const result = [];

  function dfs(path, left, right) {
    if (path.length === 2 * n) {
      result.push(path);
      return;
    }
    if (left < n) dfs(path + '(', left + 1, right);
    if (right < left) dfs(path + ')', left, right + 1);
  }

  dfs('', 0, 0);
  return result;
}

// 19. topKFrequent(nums, k)：前 k 个高频元素
function topKFrequent(nums, k) {
  const freq = new Map();
  for (const num of nums) freq.set(num, (freq.get(num) || 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map((item) => item[0]);
}

// 20. maxTwoNumbers(nums)：一趟遍历找最大和次大值
function maxTwoNumbers(nums) {
  let first = -Infinity;
  let second = -Infinity;

  for (const num of nums) {
    if (num > first) {
      second = first;
      first = num;
    } else if (num > second) {
      second = num;
    }
  }

  return [first, second];
}

module.exports = {
  ListNode,
  TreeNode,
  reverseList,
  hasCycle,
  mergeTwoLists,
  removeNthFromEnd,
  bubbleSort,
  quickSort,
  mergeSort,
  binarySearch,
  preorderTraversal,
  inorderTraversal,
  levelOrder,
  maxDepth,
  lowestCommonAncestor,
  permute,
  subsets,
  generateParenthesis,
  topKFrequent,
  maxTwoNumbers,
};
