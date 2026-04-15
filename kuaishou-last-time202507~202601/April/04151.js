/**
 * 04151.js — 前端代码算法题 20 道（数组 / 前缀和 / 排序）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i];
    if (map.has(need)) return [map.get(need), i];
    map.set(nums[i], i);
  }
  return [];
}

function containsDuplicate(nums) {
  return new Set(nums).size !== nums.length;
}

function removeDuplicates(nums) {
  if (!nums.length) return 0;
  let k = 1;
  for (let i = 1; i < nums.length; i += 1) {
    if (nums[i] !== nums[i - 1]) nums[k++] = nums[i];
  }
  return k;
}

function removeElement(nums, val) {
  let k = 0;
  for (const x of nums) if (x !== val) nums[k++] = x;
  return k;
}

function plusOne(digits) {
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    if (digits[i] < 9) {
      digits[i] += 1;
      return digits;
    }
    digits[i] = 0;
  }
  digits.unshift(1);
  return digits;
}

function moveZeroes(nums) {
  let k = 0;
  for (const x of nums) if (x !== 0) nums[k++] = x;
  while (k < nums.length) nums[k++] = 0;
  return nums;
}

function intersection(nums1, nums2) {
  const set1 = new Set(nums1);
  const ans = new Set();
  for (const x of nums2) if (set1.has(x)) ans.add(x);
  return [...ans];
}

function mergeSortedArray(nums1, m, nums2, n) {
  let i = m - 1;
  let j = n - 1;
  let p = m + n - 1;
  while (j >= 0) {
    if (i >= 0 && nums1[i] > nums2[j]) nums1[p--] = nums1[i--];
    else nums1[p--] = nums2[j--];
  }
  return nums1;
}

function majorityElement(nums) {
  let cand = 0;
  let cnt = 0;
  for (const x of nums) {
    if (cnt === 0) cand = x;
    cnt += x === cand ? 1 : -1;
  }
  return cand;
}

function missingNumber(nums) {
  const n = nums.length;
  let ans = n;
  for (let i = 0; i < n; i += 1) ans ^= i ^ nums[i];
  return ans;
}

function pivotIndex(nums) {
  const total = nums.reduce((a, b) => a + b, 0);
  let left = 0;
  for (let i = 0; i < nums.length; i += 1) {
    if (left === total - left - nums[i]) return i;
    left += nums[i];
  }
  return -1;
}

function runningSum(nums) {
  for (let i = 1; i < nums.length; i += 1) nums[i] += nums[i - 1];
  return nums;
}

function getSumAbsoluteDifferences(nums) {
  const n = nums.length;
  const pre = Array(n + 1).fill(0);
  for (let i = 0; i < n; i += 1) pre[i + 1] = pre[i] + nums[i];
  const ans = Array(n).fill(0);
  for (let i = 0; i < n; i += 1) {
    const left = nums[i] * i - pre[i];
    const right = (pre[n] - pre[i + 1]) - nums[i] * (n - i - 1);
    ans[i] = left + right;
  }
  return ans;
}

function thirdMax(nums) {
  const set = [...new Set(nums)].sort((a, b) => b - a);
  return set.length >= 3 ? set[2] : set[0];
}

function sortedSquares(nums) {
  const ans = Array(nums.length);
  let l = 0;
  let r = nums.length - 1;
  let p = nums.length - 1;
  while (l <= r) {
    const a = nums[l] * nums[l];
    const b = nums[r] * nums[r];
    if (a > b) {
      ans[p--] = a;
      l += 1;
    } else {
      ans[p--] = b;
      r -= 1;
    }
  }
  return ans;
}

function minMoves2(nums) {
  nums.sort((a, b) => a - b);
  const mid = nums[(nums.length / 2) | 0];
  return nums.reduce((sum, x) => sum + Math.abs(x - mid), 0);
}

function arrayPairSum(nums) {
  nums.sort((a, b) => a - b);
  let ans = 0;
  for (let i = 0; i < nums.length; i += 2) ans += nums[i];
  return ans;
}

function heightChecker(heights) {
  const sorted = [...heights].sort((a, b) => a - b);
  let ans = 0;
  for (let i = 0; i < heights.length; i += 1) if (heights[i] !== sorted[i]) ans += 1;
  return ans;
}

function relativeSortArray(arr1, arr2) {
  const order = new Map();
  arr2.forEach((x, i) => order.set(x, i));
  return arr1.sort((a, b) => {
    const ia = order.has(a) ? order.get(a) : Infinity;
    const ib = order.has(b) ? order.get(b) : Infinity;
    if (ia !== ib) return ia - ib;
    return a - b;
  });
}

function minSubsequence(nums) {
  nums.sort((a, b) => b - a);
  const total = nums.reduce((a, b) => a + b, 0);
  const ans = [];
  let sum = 0;
  for (const x of nums) {
    ans.push(x);
    sum += x;
    if (sum > total - sum) break;
  }
  return ans;
}

module.exports = {
  twoSum,
  containsDuplicate,
  removeDuplicates,
  removeElement,
  plusOne,
  moveZeroes,
  intersection,
  mergeSortedArray,
  majorityElement,
  missingNumber,
  pivotIndex,
  runningSum,
  getSumAbsoluteDifferences,
  thirdMax,
  sortedSquares,
  minMoves2,
  arrayPairSum,
  heightChecker,
  relativeSortArray,
  minSubsequence,
};
