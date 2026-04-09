/**
 * 0409.js — 前端代码算法题 20 道（数组 / 哈希 / 双指针 / 滑窗 / 二分）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. twoSum(nums, target)：返回两数之和的下标（O(n)）。
// 答：哈希表记录 value->index。
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i];
    if (map.has(need)) return [map.get(need), i];
    map.set(nums[i], i);
  }
  return [];
}

// 2. threeSum(nums)：返回所有和为 0 的不重复三元组。
// 答：排序 + 固定 i + 双指针，跳重。
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length; i += 1) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    if (nums[i] > 0) break;
    let l = i + 1;
    let r = nums.length - 1;
    while (l < r) {
      const s = nums[i] + nums[l] + nums[r];
      if (s === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        l += 1;
        r -= 1;
        while (l < r && nums[l] === nums[l - 1]) l += 1;
        while (l < r && nums[r] === nums[r + 1]) r -= 1;
      } else if (s < 0) l += 1;
      else r -= 1;
    }
  }
  return res;
}

// 3. maxArea(height)：盛最多水的容器（双指针）。
// 答：左右指针，移动短板。
function maxArea(height) {
  let l = 0;
  let r = height.length - 1;
  let ans = 0;
  while (l < r) {
    ans = Math.max(ans, Math.min(height[l], height[r]) * (r - l));
    if (height[l] < height[r]) l += 1;
    else r -= 1;
  }
  return ans;
}

// 4. trap(height)：接雨水（双指针/单调栈）。
// 答：双指针维护 leftMax/rightMax。
function trap(height) {
  let l = 0;
  let r = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let ans = 0;
  while (l < r) {
    if (height[l] < height[r]) {
      leftMax = Math.max(leftMax, height[l]);
      ans += leftMax - height[l];
      l += 1;
    } else {
      rightMax = Math.max(rightMax, height[r]);
      ans += rightMax - height[r];
      r -= 1;
    }
  }
  return ans;
}

// 5. lengthOfLongestSubstring(s)：无重复字符最长子串（滑动窗口）。
// 答：窗口 + lastIndex map。
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

// 6. minWindow(s, t)：最小覆盖子串（滑窗 + 计数）。
// 答：need 计数 + have 计数，满足后缩左。
function minWindow(s, t) {
  if (!t) return '';
  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);
  const window = new Map();
  const required = need.size;
  let formed = 0;
  let l = 0;
  let best = [-1, -1];
  let bestLen = Infinity;
  for (let r = 0; r < s.length; r += 1) {
    const ch = s[r];
    window.set(ch, (window.get(ch) || 0) + 1);
    if (need.has(ch) && window.get(ch) === need.get(ch)) formed += 1;
    while (l <= r && formed === required) {
      if (r - l + 1 < bestLen) {
        bestLen = r - l + 1;
        best = [l, r];
      }
      const leftCh = s[l];
      window.set(leftCh, window.get(leftCh) - 1);
      if (need.has(leftCh) && window.get(leftCh) < need.get(leftCh)) formed -= 1;
      l += 1;
    }
  }
  if (best[0] === -1) return '';
  return s.slice(best[0], best[1] + 1);
}

// 7. findAnagrams(s, p)：找所有字母异位词起始下标。
// 答：固定窗口长度 |p|，计数比较（用 26 数组更快）。
function findAnagrams(s, p) {
  const need = Array(26).fill(0);
  const win = Array(26).fill(0);
  const a = 'a'.charCodeAt(0);
  for (const ch of p) need[ch.charCodeAt(0) - a] += 1;
  const res = [];
  const k = p.length;
  for (let i = 0; i < s.length; i += 1) {
    win[s.charCodeAt(i) - a] += 1;
    if (i >= k) win[s.charCodeAt(i - k) - a] -= 1;
    if (i >= k - 1) {
      let ok = true;
      for (let j = 0; j < 26; j += 1) {
        if (win[j] !== need[j]) {
          ok = false;
          break;
        }
      }
      if (ok) res.push(i - k + 1);
    }
  }
  return res;
}

// 8. subarraySum(nums, k)：和为 k 的子数组个数（前缀和 + 哈希）。
// 答：prefixSum 统计出现次数。
function subarraySum(nums, k) {
  const cnt = new Map();
  cnt.set(0, 1);
  let sum = 0;
  let ans = 0;
  for (const x of nums) {
    sum += x;
    ans += cnt.get(sum - k) || 0;
    cnt.set(sum, (cnt.get(sum) || 0) + 1);
  }
  return ans;
}

// 9. topKFrequent(nums, k)：出现频率最高的 k 个元素（桶/堆）。
// 答：桶排序（频率最大为 n）。
function topKFrequent(nums, k) {
  const freq = new Map();
  for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1);
  const buckets = Array(nums.length + 1)
    .fill(0)
    .map(() => []);
  for (const [x, f] of freq.entries()) buckets[f].push(x);
  const res = [];
  for (let f = buckets.length - 1; f >= 0 && res.length < k; f -= 1) {
    for (const x of buckets[f]) {
      res.push(x);
      if (res.length === k) break;
    }
  }
  return res;
}

// 10. mergeIntervals(intervals)：合并区间。
// 答：排序后合并。
function mergeIntervals(intervals) {
  if (intervals.length <= 1) return intervals;
  intervals.sort((a, b) => a[0] - b[0]);
  const res = [intervals[0].slice()];
  for (let i = 1; i < intervals.length; i += 1) {
    const last = res[res.length - 1];
    const cur = intervals[i];
    if (cur[0] <= last[1]) last[1] = Math.max(last[1], cur[1]);
    else res.push(cur.slice());
  }
  return res;
}

// 11. searchRotated(nums, target)：搜索旋转排序数组（二分）。
// 答：判断哪边有序，缩区间。
function searchRotated(nums, target) {
  let l = 0;
  let r = nums.length - 1;
  while (l <= r) {
    const mid = (l + r) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[l] <= nums[mid]) {
      if (nums[l] <= target && target < nums[mid]) r = mid - 1;
      else l = mid + 1;
    } else {
      if (nums[mid] < target && target <= nums[r]) l = mid + 1;
      else r = mid - 1;
    }
  }
  return -1;
}

// 12. findFirstLast(nums, target)：有序数组中查找首尾位置（两次二分）。
// 答：lowerBound 找首个 >=target，upperBound 找首个 >target。
function findFirstLast(nums, target) {
  const lower = () => {
    let l = 0;
    let r = nums.length;
    while (l < r) {
      const mid = (l + r) >> 1;
      if (nums[mid] >= target) r = mid;
      else l = mid + 1;
    }
    return l;
  };
  const upper = () => {
    let l = 0;
    let r = nums.length;
    while (l < r) {
      const mid = (l + r) >> 1;
      if (nums[mid] > target) r = mid;
      else l = mid + 1;
    }
    return l;
  };
  const l = lower();
  const r = upper() - 1;
  if (l <= r && nums[l] === target) return [l, r];
  return [-1, -1];
}

// 13. kthLargest(nums, k)：第 k 大元素（快速选择）。
// 答：partition 找第 n-k 小。
function kthLargest(nums, k) {
  const targetIdx = nums.length - k;
  let l = 0;
  let r = nums.length - 1;
  const swap = (i, j) => {
    const t = nums[i];
    nums[i] = nums[j];
    nums[j] = t;
  };
  const partition = (lo, hi) => {
    const pivot = nums[hi];
    let i = lo;
    for (let j = lo; j < hi; j += 1) {
      if (nums[j] <= pivot) {
        swap(i, j);
        i += 1;
      }
    }
    swap(i, hi);
    return i;
  };
  while (l <= r) {
    const p = partition(l, r);
    if (p === targetIdx) return nums[p];
    if (p < targetIdx) l = p + 1;
    else r = p - 1;
  }
  return undefined;
}

// 14. nextGreaterElements(nums)：下一个更大元素（循环数组，单调栈）。
// 答：栈存下标，遍历 2n。
function nextGreaterElements(nums) {
  const n = nums.length;
  const res = Array(n).fill(-1);
  const st = [];
  for (let i = 0; i < 2 * n; i += 1) {
    const idx = i % n;
    while (st.length && nums[st[st.length - 1]] < nums[idx]) {
      res[st.pop()] = nums[idx];
    }
    if (i < n) st.push(idx);
  }
  return res;
}

// 15. dailyTemperatures(T)：每日温度（单调栈）。
// 答：栈存递减温度的下标。
function dailyTemperatures(T) {
  const res = Array(T.length).fill(0);
  const st = [];
  for (let i = 0; i < T.length; i += 1) {
    while (st.length && T[st[st.length - 1]] < T[i]) {
      const j = st.pop();
      res[j] = i - j;
    }
    st.push(i);
  }
  return res;
}

// 16. productExceptSelf(nums)：除自身以外数组乘积（前后缀）。
// 答：前缀乘积 * 后缀乘积，O(1) 额外（除输出）。
function productExceptSelf(nums) {
  const n = nums.length;
  const res = Array(n).fill(1);
  let pre = 1;
  for (let i = 0; i < n; i += 1) {
    res[i] = pre;
    pre *= nums[i];
  }
  let suf = 1;
  for (let i = n - 1; i >= 0; i -= 1) {
    res[i] *= suf;
    suf *= nums[i];
  }
  return res;
}

// 17. rotateArray(nums, k)：原地旋转数组（翻转法）。
// 答：整体翻转 + 前 k 翻转 + 后 n-k 翻转。
function rotateArray(nums, k) {
  const n = nums.length;
  if (n === 0) return nums;
  const kk = ((k % n) + n) % n;
  const rev = (l, r) => {
    while (l < r) {
      const t = nums[l];
      nums[l] = nums[r];
      nums[r] = t;
      l += 1;
      r -= 1;
    }
  };
  rev(0, n - 1);
  rev(0, kk - 1);
  rev(kk, n - 1);
  return nums;
}

// 18. removeDuplicatesSorted(nums)：有序数组原地去重，返回新长度。
// 答：快慢指针，slow 指向下一个可写位置。
function removeDuplicatesSorted(nums) {
  if (nums.length === 0) return 0;
  let slow = 1;
  for (let fast = 1; fast < nums.length; fast += 1) {
    if (nums[fast] !== nums[fast - 1]) {
      nums[slow] = nums[fast];
      slow += 1;
    }
  }
  return slow;
}

// 19. mergeSortedArrays(a, m, b, n)：合并两个有序数组到 a（从后往前）。
// 答：i=m-1,j=n-1,k=m+n-1。
function mergeSortedArrays(a, m, b, n) {
  let i = m - 1;
  let j = n - 1;
  let k = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && a[i] > b[j]) a[k--] = a[i--];
    else a[k--] = b[j--];
  }
  return a;
}

// 20. quickSort(arr)：原地快排（写 partition + 递归/迭代）。
// 答：分区 + 递归。
function quickSort(arr, l = 0, r = arr.length - 1) {
  const swap = (i, j) => {
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  };
  const partition = (lo, hi) => {
    const pivot = arr[hi];
    let i = lo;
    for (let j = lo; j < hi; j += 1) {
      if (arr[j] <= pivot) {
        swap(i, j);
        i += 1;
      }
    }
    swap(i, hi);
    return i;
  };
  if (l >= r) return arr;
  const p = partition(l, r);
  quickSort(arr, l, p - 1);
  quickSort(arr, p + 1, r);
  return arr;
}

module.exports = {
  twoSum,
  threeSum,
  maxArea,
  trap,
  lengthOfLongestSubstring,
  minWindow,
  findAnagrams,
  subarraySum,
  topKFrequent,
  mergeIntervals,
  searchRotated,
  findFirstLast,
  kthLargest,
  nextGreaterElements,
  dailyTemperatures,
  productExceptSelf,
  rotateArray,
  removeDuplicatesSorted,
  mergeSortedArrays,
  quickSort,
};

