/**
 * 04154.js — 前端代码算法题 20 道（二分 / 滑动窗口）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

function binarySearch(nums, target) {
  let l = 0;
  let r = nums.length - 1;
  while (l <= r) {
    const m = (l + r) >> 1;
    if (nums[m] === target) return m;
    if (nums[m] < target) l = m + 1;
    else r = m - 1;
  }
  return -1;
}

function searchInsert(nums, target) {
  let l = 0;
  let r = nums.length;
  while (l < r) {
    const m = (l + r) >> 1;
    if (nums[m] < target) l = m + 1;
    else r = m;
  }
  return l;
}

function firstBadVersion(n, isBadVersion) {
  let l = 1;
  let r = n;
  while (l < r) {
    const m = l + ((r - l) >> 1);
    if (isBadVersion(m)) r = m;
    else l = m + 1;
  }
  return l;
}

function mySqrt(x) {
  let l = 0;
  let r = x;
  while (l <= r) {
    const m = (l + r) >> 1;
    if (m * m <= x) l = m + 1;
    else r = m - 1;
  }
  return r;
}

function searchRotated(nums, target) {
  let l = 0;
  let r = nums.length - 1;
  while (l <= r) {
    const m = (l + r) >> 1;
    if (nums[m] === target) return m;
    if (nums[l] <= nums[m]) {
      if (nums[l] <= target && target < nums[m]) r = m - 1;
      else l = m + 1;
    } else {
      if (nums[m] < target && target <= nums[r]) l = m + 1;
      else r = m - 1;
    }
  }
  return -1;
}

function findMin(nums) {
  let l = 0;
  let r = nums.length - 1;
  while (l < r) {
    const m = (l + r) >> 1;
    if (nums[m] > nums[r]) l = m + 1;
    else r = m;
  }
  return nums[l];
}

function peakIndexInMountainArray(arr) {
  let l = 0;
  let r = arr.length - 1;
  while (l < r) {
    const m = (l + r) >> 1;
    if (arr[m] < arr[m + 1]) l = m + 1;
    else r = m;
  }
  return l;
}

function minEatingSpeed(piles, h) {
  let l = 1;
  let r = Math.max(...piles);
  const ok = (k) => piles.reduce((s, p) => s + Math.ceil(p / k), 0) <= h;
  while (l < r) {
    const m = (l + r) >> 1;
    if (ok(m)) r = m;
    else l = m + 1;
  }
  return l;
}

function shipWithinDays(weights, days) {
  let l = Math.max(...weights);
  let r = weights.reduce((a, b) => a + b, 0);
  const ok = (cap) => {
    let need = 1;
    let cur = 0;
    for (const w of weights) {
      if (cur + w > cap) {
        need += 1;
        cur = 0;
      }
      cur += w;
    }
    return need <= days;
  };
  while (l < r) {
    const m = (l + r) >> 1;
    if (ok(m)) r = m;
    else l = m + 1;
  }
  return l;
}

function splitArray(nums, k) {
  let l = Math.max(...nums);
  let r = nums.reduce((a, b) => a + b, 0);
  const ok = (mx) => {
    let groups = 1;
    let cur = 0;
    for (const x of nums) {
      if (cur + x > mx) {
        groups += 1;
        cur = 0;
      }
      cur += x;
    }
    return groups <= k;
  };
  while (l < r) {
    const m = (l + r) >> 1;
    if (ok(m)) r = m;
    else l = m + 1;
  }
  return l;
}

function lengthOfLongestSubstring(s) {
  const map = new Map();
  let l = 0;
  let ans = 0;
  for (let r = 0; r < s.length; r += 1) {
    if (map.has(s[r])) l = Math.max(l, map.get(s[r]) + 1);
    map.set(s[r], r);
    ans = Math.max(ans, r - l + 1);
  }
  return ans;
}

function minWindow(s, t) {
  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);
  let missing = t.length;
  let l = 0;
  let start = 0;
  let minLen = Infinity;
  for (let r = 0; r < s.length; r += 1) {
    const c = s[r];
    if (need.has(c)) {
      if (need.get(c) > 0) missing -= 1;
      need.set(c, need.get(c) - 1);
    }
    while (missing === 0) {
      if (r - l + 1 < minLen) {
        minLen = r - l + 1;
        start = l;
      }
      const lc = s[l++];
      if (need.has(lc)) {
        need.set(lc, need.get(lc) + 1);
        if (need.get(lc) > 0) missing += 1;
      }
    }
  }
  return minLen === Infinity ? '' : s.slice(start, start + minLen);
}

function checkInclusion(s1, s2) {
  if (s1.length > s2.length) return false;
  const cnt = Array(26).fill(0);
  const base = 97;
  for (const ch of s1) cnt[ch.charCodeAt(0) - base] += 1;
  let left = 0;
  let need = s1.length;
  for (let right = 0; right < s2.length; right += 1) {
    const ri = s2.charCodeAt(right) - base;
    if (cnt[ri] > 0) need -= 1;
    cnt[ri] -= 1;
    if (right - left + 1 > s1.length) {
      const li = s2.charCodeAt(left) - base;
      if (cnt[li] >= 0) need += 1;
      cnt[li] += 1;
      left += 1;
    }
    if (need === 0) return true;
  }
  return false;
}

function findAnagrams(s, p) {
  const ans = [];
  if (p.length > s.length) return ans;
  const cnt = Array(26).fill(0);
  const base = 97;
  for (const ch of p) cnt[ch.charCodeAt(0) - base] += 1;
  let left = 0;
  let need = p.length;
  for (let right = 0; right < s.length; right += 1) {
    const ri = s.charCodeAt(right) - base;
    if (cnt[ri] > 0) need -= 1;
    cnt[ri] -= 1;
    if (right - left + 1 > p.length) {
      const li = s.charCodeAt(left) - base;
      if (cnt[li] >= 0) need += 1;
      cnt[li] += 1;
      left += 1;
    }
    if (need === 0) ans.push(left);
  }
  return ans;
}

function numSubarrayProductLessThanK(nums, k) {
  if (k <= 1) return 0;
  let prod = 1;
  let left = 0;
  let ans = 0;
  for (let right = 0; right < nums.length; right += 1) {
    prod *= nums[right];
    while (prod >= k) prod /= nums[left++];
    ans += right - left + 1;
  }
  return ans;
}

function longestOnes(nums, k) {
  let left = 0;
  let zeros = 0;
  let ans = 0;
  for (let right = 0; right < nums.length; right += 1) {
    if (nums[right] === 0) zeros += 1;
    while (zeros > k) if (nums[left++] === 0) zeros -= 1;
    ans = Math.max(ans, right - left + 1);
  }
  return ans;
}

function maxVowels(s, k) {
  const set = new Set(['a', 'e', 'i', 'o', 'u']);
  let cur = 0;
  let ans = 0;
  for (let i = 0; i < s.length; i += 1) {
    if (set.has(s[i])) cur += 1;
    if (i >= k && set.has(s[i - k])) cur -= 1;
    if (i >= k - 1) ans = Math.max(ans, cur);
  }
  return ans;
}

function findMaxAverage(nums, k) {
  let sum = 0;
  for (let i = 0; i < k; i += 1) sum += nums[i];
  let ans = sum;
  for (let i = k; i < nums.length; i += 1) {
    sum += nums[i] - nums[i - k];
    ans = Math.max(ans, sum);
  }
  return ans / k;
}

function divisorSubstrings(num, k) {
  const s = String(num);
  let ans = 0;
  for (let i = 0; i + k <= s.length; i += 1) {
    const v = Number(s.slice(i, i + k));
    if (v !== 0 && num % v === 0) ans += 1;
  }
  return ans;
}

function minSubArrayLen(target, nums) {
  let left = 0;
  let sum = 0;
  let ans = Infinity;
  for (let right = 0; right < nums.length; right += 1) {
    sum += nums[right];
    while (sum >= target) {
      ans = Math.min(ans, right - left + 1);
      sum -= nums[left++];
    }
  }
  return ans === Infinity ? 0 : ans;
}

module.exports = {
  binarySearch,
  searchInsert,
  firstBadVersion,
  mySqrt,
  searchRotated,
  findMin,
  peakIndexInMountainArray,
  minEatingSpeed,
  shipWithinDays,
  splitArray,
  lengthOfLongestSubstring,
  minWindow,
  checkInclusion,
  findAnagrams,
  numSubarrayProductLessThanK,
  longestOnes,
  maxVowels,
  findMaxAverage,
  divisorSubstrings,
  minSubArrayLen,
};
