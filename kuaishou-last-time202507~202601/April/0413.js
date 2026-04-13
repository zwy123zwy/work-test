/**
 * 0413.js — 前端代码算法题 20 道（链表 / 双指针 / 滑窗 / 背包入门）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. reverseList(head)：反转单链表。
// 答：迭代三指针；或递归。
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

// 2. hasCycle(head)：链表是否有环（快慢指针）。
// 答：快每次走 2，慢走 1，相遇则有环。
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

// 3. mergeTwoLists(list1, list2)：合并两个升序链表。
// 答：哑结点拼接，或递归。
function mergeTwoLists(list1, list2) {
  const dummy = { next: null };
  let p = dummy;
  let a = list1;
  let b = list2;
  while (a && b) {
    if (a.val <= b.val) {
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

// 4. maxArea(height)：盛最多水的容器（双指针）。
// 答：左右夹逼，每次移动较短边。
function maxArea(height) {
  let l = 0;
  let r = height.length - 1;
  let ans = 0;
  while (l < r) {
    const h = Math.min(height[l], height[r]);
    ans = Math.max(ans, h * (r - l));
    if (height[l] < height[r]) l += 1;
    else r -= 1;
  }
  return ans;
}

// 5. trap(height)：接雨水。
// 答：双指针维护左右最高，或单调栈；此处双指针 O(n) O(1)。
function trap(height) {
  let l = 0;
  let r = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let ans = 0;
  while (l < r) {
    if (height[l] < height[r]) {
      if (height[l] >= leftMax) leftMax = height[l];
      else ans += leftMax - height[l];
      l += 1;
    } else {
      if (height[r] >= rightMax) rightMax = height[r];
      else ans += rightMax - height[r];
      r -= 1;
    }
  }
  return ans;
}

// 6. threeSum(nums)：三数之和为 0 的不重复三元组。
// 答：排序 + 固定 i，双指针 j,k，去重。
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  const n = nums.length;
  for (let i = 0; i < n - 2; i += 1) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let j = i + 1;
    let k = n - 1;
    while (j < k) {
      const s = nums[i] + nums[j] + nums[k];
      if (s === 0) {
        res.push([nums[i], nums[j], nums[k]]);
        j += 1;
        k -= 1;
        while (j < k && nums[j] === nums[j - 1]) j += 1;
        while (j < k && nums[k] === nums[k + 1]) k -= 1;
      } else if (s < 0) j += 1;
      else k -= 1;
    }
  }
  return res;
}

// 7. lengthOfLongestSubstring(s)：不含重复字符的最长子串长度。
// 答：滑窗 + 字符上次出现位置。
function lengthOfLongestSubstring(s) {
  const last = new Map();
  let l = 0;
  let ans = 0;
  for (let r = 0; r < s.length; r += 1) {
    const ch = s[r];
    if (last.has(ch) && last.get(ch) >= l) l = last.get(ch) + 1;
    last.set(ch, r);
    ans = Math.max(ans, r - l + 1);
  }
  return ans;
}

// 8. minWindow(s, t)：s 中包含 t 全部字符的最短子串。
// 答：滑窗 + need/window 计数，满足时收缩左边界。
function minWindow(s, t) {
  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);
  let needSize = need.size;
  let formed = 0;
  const window = new Map();
  let l = 0;
  let ansLen = Infinity;
  let ansL = 0;
  for (let r = 0; r < s.length; r += 1) {
    const c = s[r];
    window.set(c, (window.get(c) || 0) + 1);
    if (need.has(c) && window.get(c) === need.get(c)) formed += 1;
    while (l <= r && formed === needSize) {
      if (r - l + 1 < ansLen) {
        ansLen = r - l + 1;
        ansL = l;
      }
      const c2 = s[l];
      window.set(c2, window.get(c2) - 1);
      if (need.has(c2) && window.get(c2) < need.get(c2)) formed -= 1;
      l += 1;
    }
  }
  return ansLen === Infinity ? '' : s.slice(ansL, ansL + ansLen);
}

// 9. longestIncreasingSubsequence(nums)：最长严格递增子序列长度。
// 答：patience sorting：维护 tails 二分插入。
function longestIncreasingSubsequence(nums) {
  const tails = [];
  for (const x of nums) {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    if (lo === tails.length) tails.push(x);
    else tails[lo] = x;
  }
  return tails.length;
}

// 10. coinChange(coins, amount)：凑成 amount 的最少硬币数（每种无限枚）。
// 答：完全背包，dp[i]=min(dp[i-c]+1)。
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i += 1) {
    for (const c of coins) {
      if (i >= c) dp[i] = Math.min(dp[i], dp[i - c] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// 11. removeNthFromEnd(head, n)：删除倒数第 n 个结点。
// 答：快慢指针先让快指针走 n+1 步（相对哑结点），再同时移动。
function removeNthFromEnd(head, n) {
  const dummy = { next: head };
  let fast = dummy;
  let slow = dummy;
  for (let i = 0; i < n + 1; i += 1) fast = fast.next;
  while (fast) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}

// 12. getIntersectionNode(headA, headB)：两链表相交的起始结点（无环）。
// 答：走完 A 接 B、B 接 A，相遇点即交点（或同为 null）。
function getIntersectionNode(headA, headB) {
  let a = headA;
  let b = headB;
  while (a !== b) {
    a = a ? a.next : headB;
    b = b ? b.next : headA;
  }
  return a;
}

// 13. addTwoNumbers(l1, l2)：两非负整数逆序链表相加。
// 答：同步遍历进位，哑结点挂新链。
function addTwoNumbers(l1, l2) {
  const dummy = { next: null };
  let p = dummy;
  let carry = 0;
  let a = l1;
  let b = l2;
  while (a || b || carry) {
    const s = (a ? a.val : 0) + (b ? b.val : 0) + carry;
    carry = (s / 10) | 0;
    p.next = { val: s % 10, next: null };
    p = p.next;
    if (a) a = a.next;
    if (b) b = b.next;
  }
  return dummy.next;
}

// 14. swapPairs(head)：两两交换相邻结点。
// 答：哑结点，每次翻转 pre→a→b 为 pre→b→a。
function swapPairs(head) {
  const dummy = { next: head };
  let pre = dummy;
  while (pre.next && pre.next.next) {
    const a = pre.next;
    const b = a.next;
    pre.next = b;
    a.next = b.next;
    b.next = a;
    pre = a;
  }
  return dummy.next;
}

// 15. sortList(head)：链表 O(n log n) 排序。
// 答：快慢分两半断开，递归归并 mergeTwoLists。
function sortList(head) {
  if (!head || !head.next) return head;
  let slow = head;
  let fast = head.next;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  const mid = slow.next;
  slow.next = null;
  return mergeTwoLists(sortList(head), sortList(mid));
}

// 16. searchRange(nums, target)：有序数组中 target 的首尾下标。
// 答：两次二分：左边界与 target+1 左边界减一。
function searchRange(nums, target) {
  const lowerBound = (arr, t) => {
    let l = 0;
    let r = arr.length;
    while (l < r) {
      const m = (l + r) >> 1;
      if (arr[m] < t) l = m + 1;
      else r = m;
    }
    return l;
  };
  const lo = lowerBound(nums, target);
  if (lo === nums.length || nums[lo] !== target) return [-1, -1];
  const hi = lowerBound(nums, target + 1) - 1;
  return [lo, hi];
}

// 17. subarraySum(nums, k)：和为 k 的连续子数组个数。
// 答：前缀和 + 哈希 map[prefix] 出现次数。
function subarraySum(nums, k) {
  const map = new Map([[0, 1]]);
  let pre = 0;
  let ans = 0;
  for (const x of nums) {
    pre += x;
    ans += map.get(pre - k) || 0;
    map.set(pre, (map.get(pre) || 0) + 1);
  }
  return ans;
}

// 18. maxSlidingWindow(nums, k)：滑窗最大值序列。
// 答：单调递减双端队列存下标，队首为窗口最大。
function maxSlidingWindow(nums, k) {
  const dq = [];
  const res = [];
  for (let i = 0; i < nums.length; i += 1) {
    while (dq.length && dq[0] <= i - k) dq.shift();
    while (dq.length && nums[i] >= nums[dq[dq.length - 1]]) dq.pop();
    dq.push(i);
    if (i >= k - 1) res.push(nums[dq[0]]);
  }
  return res;
}

// 19. minSubArrayLen(target, nums)：和 ≥ target 的最短连续子数组长度。
// 答：滑窗，右扩累加，满足则左缩更新答案。
function minSubArrayLen(target, nums) {
  let l = 0;
  let sum = 0;
  let ans = Infinity;
  for (let r = 0; r < nums.length; r += 1) {
    sum += nums[r];
    while (sum >= target) {
      ans = Math.min(ans, r - l + 1);
      sum -= nums[l];
      l += 1;
    }
  }
  return ans === Infinity ? 0 : ans;
}

// 20. fourSum(nums, target)：四元组不重复且和为 target。
// 答：排序，固定 i、j，双指针 lo、hi，注意去重。
function fourSum(nums, target) {
  nums.sort((a, b) => a - b);
  const res = [];
  const n = nums.length;
  for (let i = 0; i < n - 3; i += 1) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    for (let j = i + 1; j < n - 2; j += 1) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue;
      let lo = j + 1;
      let hi = n - 1;
      while (lo < hi) {
        const s = nums[i] + nums[j] + nums[lo] + nums[hi];
        if (s === target) {
          res.push([nums[i], nums[j], nums[lo], nums[hi]]);
          lo += 1;
          hi -= 1;
          while (lo < hi && nums[lo] === nums[lo - 1]) lo += 1;
          while (lo < hi && nums[hi] === nums[hi + 1]) hi -= 1;
        } else if (s < target) lo += 1;
        else hi -= 1;
      }
    }
  }
  return res;
}

module.exports = {
  reverseList,
  hasCycle,
  mergeTwoLists,
  maxArea,
  trap,
  threeSum,
  lengthOfLongestSubstring,
  minWindow,
  longestIncreasingSubsequence,
  coinChange,
  removeNthFromEnd,
  getIntersectionNode,
  addTwoNumbers,
  swapPairs,
  sortList,
  searchRange,
  subarraySum,
  maxSlidingWindow,
  minSubArrayLen,
  fourSum,
};
