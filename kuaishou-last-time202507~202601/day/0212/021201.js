/**
 * 021201 面试算法题（20 道）- 专题：数组与双指针
 * 日期：2026-02-12
 * 规则：仅题干、输入输出与约束；个人完成后再补充解答与测试用例。
 */

class ListNode {
    constructor(val, next = null) { this.val = val; this.next = next; }
}
class TreeNode {
    constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}

// ==================== 1. 两数之和 II（有序数组） ====================
// 题干：升序数组 numbers 和 target，找两个不同下标使其和等于 target，返回 [i+1, j+1]。保证有唯一解。
// 输入：numbers: number[], target: number
// 输出：number[]
// 约束：双指针 O(n)，空间 O(1)

function twoSum(numbers, target) {
    let l = 0, r = numbers.length - 1;
    while (l < r) {
        const s = numbers[l] + numbers[r];
        if (s === target) return [l + 1, r + 1];
        if (s < target) l++; else r--;
    }
    return [];
}

// ==================== 2. 盛最多水的容器 ====================
// 题干：n 个非负整数表示挡板高度，选两根与 x 轴构成容器，求最大盛水量。
// 输入：height: number[]
// 输出：number
// 约束：双指针 O(n)

function maxArea(height) {
    let l = 0, r = height.length - 1, ans = 0;
    while (l < r) {
        ans = Math.max(ans, Math.min(height[l], height[r]) * (r - l));
        height[l] < height[r] ? l++ : r--;
    }
    return ans;
}

// ==================== 3. 三数之和 ====================
// 题干：数组 nums，找出所有和为 0 的三元组，不重复。
// 输入：nums: number[]
// 输出：number[][]
// 约束：排序 + 双指针，去重

function threeSum(nums) {
    if (nums.length < 3) return [];
    nums.sort((a, b) => a - b);
    const res = [];
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        let l = i + 1, r = nums.length - 1;
        while (l < r) {
            const s = nums[i] + nums[l] + nums[r];
            if (s === 0) {
                res.push([nums[i], nums[l], nums[r]]);
                while (l < r && nums[l] === nums[l + 1]) l++;
                while (l < r && nums[r] === nums[r - 1]) r--;
                l++; r--;
            } else if (s < 0) l++; else r--;
        }
    }
    return res;
}

// ==================== 4. 最接近的三数之和 ====================
// 题干：数组 nums 和 target，找三个数使其和最接近 target，返回该和。
// 输入：nums: number[], target: number
// 输出：number
// 约束：双指针 O(n^2)

function threeSumClosest(nums, target) {
    nums.sort((a, b) => a - b);
    let best = nums[0] + nums[1] + nums[2];
    for (let i = 0; i < nums.length - 2; i++) {
        let l = i + 1, r = nums.length - 1;
        while (l < r) {
            const s = nums[i] + nums[l] + nums[r];
            if (Math.abs(s - target) < Math.abs(best - target)) best = s;
            if (s < target) l++; else if (s > target) r--; else return s;
        }
    }
    return best;
}

// ==================== 5. 删除有序数组中的重复项（原地） ====================
// 题干：升序数组 nums，原地删除重复项，使每个元素只出现一次，返回新长度。
// 输入：nums: number[]
// 输出：number
// 约束：O(1) 额外空间，双指针

function removeDuplicates(nums) {
    if (!nums.length) return 0;
    let k = 1;
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] !== nums[k - 1]) nums[k++] = nums[i];
    }
    return k;
}

// ==================== 6. 移除元素（原地） ====================
// 题干：数组 nums 和值 val，原地删除所有等于 val 的元素，返回新长度。
// 输入：nums: number[], val: number
// 输出：number
// 约束：O(1) 额外空间

function removeElement(nums, val) {
    let k = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== val) nums[k++] = nums[i];
    }
    return k;
}

// ==================== 7. 移动零 ====================
// 题干：数组 nums，将所有 0 移到末尾，保持非零元素相对顺序。
// 输入：nums: number[]
// 输出：无（原地修改）
// 约束：O(1) 额外空间，最小化操作次数

function moveZeroes(nums) {
    let k = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) nums[k++] = nums[i];
    }
    for (; k < nums.length; k++) nums[k] = 0;
}

// ==================== 8. 合并两个有序数组（原地） ====================
// 题干：nums1 长度 m+n 前 m 项有效，nums2 长度 n。将 nums2 合并进 nums1 并保持非递减。
// 输入：nums1: number[], m: number, nums2: number[], n: number
// 输出：无（原地修改 nums1）
// 约束：从后往前双指针

function merge(nums1, m, nums2, n) {
    let i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
        else nums1[k--] = nums2[j--];
    }
}

// ==================== 9. 轮转数组 ====================
// 题干：数组 nums 和整数 k，将数组向右轮转 k 步（末尾到开头）。
// 输入：nums: number[], k: number
// 输出：无（原地修改）
// 约束：O(1) 额外空间（三次反转或环状替换）

function rotate(nums, k) {
    k %= nums.length;
    const rev = (l, r) => { while (l < r) [nums[l], nums[r]] = [nums[r], nums[l]], l++, r--; };
    rev(0, nums.length - 1);
    rev(0, k - 1);
    rev(k, nums.length - 1);
}

// ==================== 10. 删除有序数组中的重复项 II（最多保留 2 个） ====================
// 题干：升序数组 nums，原地删除使每个元素最多出现两次，返回新长度。
// 输入：nums: number[]
// 输出：number
// 约束：O(1) 额外空间

function removeDuplicatesII(nums) {
    if (nums.length <= 2) return nums.length;
    let k = 2;
    for (let i = 2; i < nums.length; i++) {
        if (nums[i] !== nums[k - 2]) nums[k++] = nums[i];
    }
    return k;
}

// ==================== 11. 长度最小的子数组 ====================
// 题干：正整数数组 nums 和 target，找和 ≥ target 的连续子数组的最小长度，不存在返回 0。
// 输入：nums: number[], target: number
// 输出：number
// 约束：滑动窗口 O(n)

function minSubArrayLen(target, nums) {
    let sum = 0, l = 0, ans = Infinity;
    for (let r = 0; r < nums.length; r++) {
        sum += nums[r];
        while (sum >= target) {
            ans = Math.min(ans, r - l + 1);
            sum -= nums[l++];
        }
    }
    return ans === Infinity ? 0 : ans;
}

// ==================== 12. 无重复字符的最长子串 ====================
// 题干：字符串 s，求不含重复字符的最长子串长度。
// 输入：s: string
// 输出：number
// 约束：滑动窗口 O(n)

function lengthOfLongestSubstring(s) {
    const set = new Set();
    let l = 0, ans = 0;
    for (let r = 0; r < s.length; r++) {
        while (set.has(s[r])) set.delete(s[l++]);
        set.add(s[r]);
        ans = Math.max(ans, r - l + 1);
    }
    return ans;
}

// ==================== 13. 最小覆盖子串 ====================
// 题干：字符串 s、t，求 s 中包含 t 所有字符的最小子串；不存在返回 ""。
// 输入：s: string, t: string
// 输出：string
// 约束：滑动窗口 + 哈希

function minWindow(s, t) {
    const need = {}; for (const c of t) need[c] = (need[c] || 0) + 1;
    let cnt = Object.keys(need).length, l = 0, start = 0, len = Infinity;
    for (let r = 0; r < s.length; r++) {
        if (need[s[r]] !== undefined) { need[s[r]]--; if (need[s[r]] === 0) cnt--; }
        while (cnt === 0) {
            if (r - l + 1 < len) { len = r - l + 1; start = l; }
            if (need[s[l]] !== undefined) { need[s[l]]++; if (need[s[l]] > 0) cnt++; }
            l++;
        }
    }
    return len === Infinity ? '' : s.slice(start, start + len);
}

// ==================== 14. 字符串的排列 ====================
// 题干：s1、s2，判断 s2 是否包含 s1 的某个排列作为子串。
// 输入：s1: string, s2: string
// 输出：boolean
// 约束：滑动窗口，O(n)

function checkInclusion(s1, s2) {
    if (s1.length > s2.length) return false;
    const cnt = {}; for (const c of s1) cnt[c] = (cnt[c] || 0) + 1;
    let match = Object.keys(cnt).length;
    for (let r = 0; r < s2.length; r++) {
        if (cnt[s2[r]] !== undefined) { cnt[s2[r]]--; if (cnt[s2[r]] === 0) match--; }
        if (r >= s1.length) {
            const lc = s2[r - s1.length];
            if (cnt[lc] !== undefined) { cnt[lc]++; if (cnt[lc] === 1) match++; }
        }
        if (match === 0) return true;
    }
    return false;
}

// ==================== 15. 找到字符串中所有字母异位词 ====================
// 题干：字符串 s、p，返回 s 中所有 p 的字母异位词子串的起始下标。
// 输入：s: string, p: string
// 输出：number[]
// 约束：滑动窗口

function findAnagrams(s, p) {
    if (p.length > s.length) return [];
    const need = {}; for (const c of p) need[c] = (need[c] || 0) + 1;
    let match = Object.keys(need).length, res = [];
    for (let r = 0; r < s.length; r++) {
        if (need[s[r]] !== undefined) { need[s[r]]--; if (need[s[r]] === 0) match--; }
        if (r >= p.length) {
            const lc = s[r - p.length];
            if (need[lc] !== undefined) { need[lc]++; if (need[lc] === 1) match++; }
        }
        if (match === 0) res.push(r - p.length + 1);
    }
    return res;
}

// ==================== 16. 乘积小于 K 的子数组 ====================
// 题干：正整数数组 nums 和整数 k，求连续子数组乘积小于 k 的个数。
// 输入：nums: number[], k: number
// 输出：number
// 约束：滑动窗口

function numSubarrayProductLessThanK(nums, k) {
    if (k <= 1) return 0;
    let prod = 1, l = 0, ans = 0;
    for (let r = 0; r < nums.length; r++) {
        prod *= nums[r];
        while (prod >= k) prod /= nums[l++];
        ans += r - l + 1;
    }
    return ans;
}

// ==================== 17. 最大连续 1 的个数 III ====================
// 题干：二进制数组 nums 和整数 k，最多将 k 个 0 变为 1，求最长连续 1 的子数组长度。
// 输入：nums: number[], k: number
// 输出：number
// 约束：滑动窗口

function longestOnes(nums, k) {
    let l = 0, zeros = 0, ans = 0;
    for (let r = 0; r < nums.length; r++) {
        if (nums[r] === 0) zeros++;
        while (zeros > k) { if (nums[l++] === 0) zeros--; }
        ans = Math.max(ans, r - l + 1);
    }
    return ans;
}

// ==================== 18. 区间列表的交集 ====================
// 题干：两组合并区间 firstList、secondList（均按左端点排序），返回所有交集区间。
// 输入：firstList: number[][], secondList: number[][]
// 输出：number[][]
// 约束：双指针扫描

function intervalIntersection(firstList, secondList) {
    const res = [];
    let i = 0, j = 0;
    while (i < firstList.length && j < secondList.length) {
        const [a1, a2] = firstList[i], [b1, b2] = secondList[j];
        const lo = Math.max(a1, b1), hi = Math.min(a2, b2);
        if (lo <= hi) res.push([lo, hi]);
        a2 < b2 ? i++ : j++;
    }
    return res;
}

// ==================== 19. 接雨水 ====================
// 题干：n 个非负整数表示柱子高度，按此排列能接多少雨水。
// 输入：height: number[]
// 输出：number
// 约束：双指针或单调栈，O(n)

function trap(height) {
    let l = 0, r = height.length - 1, lm = 0, rm = 0, ans = 0;
    while (l < r) {
        if (height[l] < height[r]) {
            lm = Math.max(lm, height[l]);
            ans += lm - height[l++];
        } else {
            rm = Math.max(rm, height[r]);
            ans += rm - height[r--];
        }
    }
    return ans;
}

// ==================== 20. 颜色分类（荷兰国旗） ====================
// 题干：数组 nums 仅含 0、1、2，原地排序使相同数字相邻（0-1-2）。
// 输入：nums: number[]
// 输出：无（原地修改）
// 约束：单遍扫描 O(n)，O(1) 空间

function sortColors(nums) {
    let i = 0, lo = 0, hi = nums.length - 1;
    while (i <= hi) {
        if (nums[i] === 0) [nums[lo++], nums[i++]] = [nums[i], nums[lo]];
        else if (nums[i] === 2) [nums[hi--], nums[i]] = [nums[i], nums[hi]];
        else i++;
    }
}
