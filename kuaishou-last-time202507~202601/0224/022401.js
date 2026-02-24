/**
 * 022401 面试算法题（20 道）- 专题：滑动窗口与双指针进阶
 * 日期：2026-02-24
 * 规则：仅题干、输入输出与约束；个人完成后再补充解答与测试用例。
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 无重复字符的最长子串 ====================
// 题干：字符串 s，求不含重复字符的最长子串长度。
// 输入：s: string
// 输出：number
// 约束：滑动窗口 + 哈希

function lengthOfLongestSubstring(s) {
    const set = new Set();
    let max = 0, left = 0;
    for (let right = 0; right < s.length; right++) {
        while (set.has(s[right])) set.delete(s[left++]);
        set.add(s[right]);
        max = Math.max(max, right - left + 1);
    }
    return max;
}

// ==================== 2. 最小覆盖子串 ====================
// 题干：字符串 s、t，求 s 中最短子串，包含 t 中所有字符。无则 ""。
// 输入：s: string, t: string
// 输出：string
// 约束：滑动窗口 + 计数

function minWindow(s, t) {
    const need = {};
    for (const c of t) need[c] = (need[c] || 0) + 1;
    let needCount = t.length, minStart = 0, minLen = Infinity;
    for (let left = 0, right = 0; right < s.length; right++) {
        if (need[s[right]] > 0) needCount--;
        need[s[right]] = (need[s[right]] || 0) - 1;
        while (needCount === 0) {
            if (right - left + 1 < minLen) { minLen = right - left + 1; minStart = left; }
            need[s[left]]++;
            if (need[s[left]] > 0) needCount++;
            left++;
        }
    }
    return minLen === Infinity ? '' : s.slice(minStart, minStart + minLen);
}

// ==================== 3. 字符串的排列 ====================
// 题干：s1、s2，判断 s2 是否包含 s1 的排列（即 s1 的某一种排列是 s2 的子串）。
// 输入：s1: string, s2: string
// 输出：boolean
// 约束：定长滑动窗口 + 字符计数

function checkInclusion(s1, s2) {
    if (s1.length > s2.length) return false;
    const cnt = {};
    for (const c of s1) cnt[c] = (cnt[c] || 0) + 1;
    let match = s1.length;
    for (let i = 0; i < s2.length; i++) {
        if (cnt[s2[i]] !== undefined) { cnt[s2[i]]--; if (cnt[s2[i]] >= 0) match--; }
        if (i >= s1.length && cnt[s2[i - s1.length]] !== undefined) {
            cnt[s2[i - s1.length]]++;
            if (cnt[s2[i - s1.length]] > 0) match++;
        }
        if (match === 0) return true;
    }
    return false;
}

// ==================== 4. 找到字符串中所有字母异位词 ====================
// 题干：s 和 p，返回 s 中所有 p 的字母异位词的起始下标。
// 输入：s: string, p: string
// 输出：number[]
// 约束：定长窗口 + 计数

function findAnagrams(s, p) {
    if (s.length < p.length) return [];
    const cnt = {}, res = [];
    for (const c of p) cnt[c] = (cnt[c] || 0) + 1;
    let match = p.length;
    for (let i = 0; i < s.length; i++) {
        if (cnt[s[i]] !== undefined) { cnt[s[i]]--; if (cnt[s[i]] >= 0) match--; }
        if (i >= p.length && cnt[s[i - p.length]] !== undefined) {
            cnt[s[i - p.length]]++;
            if (cnt[s[i - p.length]] > 0) match++;
        }
        if (match === 0) res.push(i - p.length + 1);
    }
    return res;
}

// ==================== 5. 长度最小的子数组 ====================
// 题干：正整数数组 nums 和 target，和 >= target 的连续子数组的最短长度。
// 输入：nums: number[], target: number
// 输出：number
// 约束：滑动窗口

function minSubArrayLen(target, nums) {
    let sum = 0, left = 0, min = Infinity;
    for (let right = 0; right < nums.length; right++) {
        sum += nums[right];
        while (sum >= target) {
            min = Math.min(min, right - left + 1);
            sum -= nums[left++];
        }
    }
    return min === Infinity ? 0 : min;
}

// ==================== 6. 乘积小于 K 的子数组 ====================
// 题干：正整数数组 nums 和 k，求乘积小于 k 的连续子数组个数。
// 输入：nums: number[], k: number
// 输出：number
// 约束：滑动窗口，以右端点计数的子数组数

function numSubarrayProductLessThanK(nums, k) {
    if (k <= 1) return 0;
    let prod = 1, left = 0, count = 0;
    for (let right = 0; right < nums.length; right++) {
        prod *= nums[right];
        while (prod >= k) prod /= nums[left++];
        count += right - left + 1;
    }
    return count;
}

// ==================== 7. 替换后的最长重复字符 ====================
// 题干：字符串 s 和 k，最多将 k 个字符替换成任意字符，求替换后最长重复字符子串长度。
// 输入：s: string, k: number
// 输出：number
// 约束：滑动窗口，窗口内非众数字符数 <= k

function characterReplacement(s, k) {
    const cnt = {};
    let maxF = 0, res = 0;
    for (let left = 0, right = 0; right < s.length; right++) {
        cnt[s[right]] = (cnt[s[right]] || 0) + 1;
        maxF = Math.max(maxF, cnt[s[right]]);
        while (right - left + 1 - maxF > k) {
            cnt[s[left]]--;
            left++;
        }
        res = Math.max(res, right - left + 1);
    }
    return res;
}

// ==================== 8. 最大连续 1 的个数 III ====================
// 题干：二进制数组 nums 和 k，最多将 k 个 0 变为 1，求最大连续 1 的个数。
// 输入：nums: number[], k: number
// 输出：number
// 约束：滑动窗口，窗口内 0 的个数 <= k

function longestOnes(nums, k) {
    let zeros = 0, left = 0, res = 0;
    for (let right = 0; right < nums.length; right++) {
        if (nums[right] === 0) zeros++;
        while (zeros > k) { if (nums[left++] === 0) zeros--; }
        res = Math.max(res, right - left + 1);
    }
    return res;
}

// ==================== 9. 水果成篮 ====================
// 题干：数组 fruits[i] 为第 i 棵树的水果类型，只能选两种类型摘，从任意树开始连续摘。求最大摘取数量。
// 输入：fruits: number[]
// 输出：number
// 约束：滑动窗口，窗口内最多 2 种数

function totalFruit(fruits) {
    const cnt = new Map();
    let left = 0, res = 0;
    for (let right = 0; right < fruits.length; right++) {
        cnt.set(fruits[right], (cnt.get(fruits[right]) || 0) + 1);
        while (cnt.size > 2) {
            cnt.set(fruits[left], cnt.get(fruits[left]) - 1);
            if (cnt.get(fruits[left]) === 0) cnt.delete(fruits[left]);
            left++;
        }
        res = Math.max(res, right - left + 1);
    }
    return res;
}

// ==================== 10. 至多包含两个不同字符的最长子串 ====================
// 题干：字符串 s，求最多包含两种不同字符的最长子串长度。
// 输入：s: string
// 输出：number
// 约束：滑动窗口

function lengthOfLongestSubstringTwoDistinct(s) {
    const cnt = new Map();
    let left = 0, res = 0;
    for (let right = 0; right < s.length; right++) {
        cnt.set(s[right], (cnt.get(s[right]) || 0) + 1);
        while (cnt.size > 2) {
            cnt.set(s[left], cnt.get(s[left]) - 1);
            if (cnt.get(s[left]) === 0) cnt.delete(s[left]);
            left++;
        }
        res = Math.max(res, right - left + 1);
    }
    return res;
}

// ==================== 11. 三数之和（双指针） ====================
// 题干：nums 中找所有和为 0 的三元组，不重复。
// 输入：nums: number[]
// 输出：number[][]
// 约束：排序 + 双指针

function threeSum224(nums) {
    nums.sort((a, b) => a - b);
    const res = [];
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        let lo = i + 1, hi = nums.length - 1;
        while (lo < hi) {
            const sum = nums[i] + nums[lo] + nums[hi];
            if (sum === 0) { res.push([nums[i], nums[lo], nums[hi]]); lo++; while (lo < hi && nums[lo] === nums[lo - 1]) lo++; hi--; }
            else if (sum < 0) lo++;
            else hi--;
        }
    }
    return res;
}

// ==================== 12. 四数之和（双指针） ====================
// 题干：nums 和 target，找所有和为 target 的四元组，不重复。
// 输入：nums: number[], target: number
// 输出：number[][]
// 约束：排序 + 双层循环 + 双指针

function fourSum224(nums, target) {
    nums.sort((a, b) => a - b);
    const res = [];
    for (let i = 0; i < nums.length - 3; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        for (let j = i + 1; j < nums.length - 2; j++) {
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;
            let lo = j + 1, hi = nums.length - 1;
            while (lo < hi) {
                const sum = nums[i] + nums[j] + nums[lo] + nums[hi];
                if (sum === target) {
                    res.push([nums[i], nums[j], nums[lo], nums[hi]]);
                    lo++; while (lo < hi && nums[lo] === nums[lo - 1]) lo++;
                    hi--; while (lo < hi && nums[hi] === nums[hi + 1]) hi--;
                } else if (sum < target) lo++;
                else hi--;
            }
        }
    }
    return res;
}

// ==================== 13. 盛最多水的容器 ====================
// 题干：非负整数数组 height[i] 为板高，选两块板与 x 轴围成容器，求最大容积。
// 输入：height: number[]
// 输出：number
// 约束：双指针从两端向中间

function maxArea(height) {
    let left = 0, right = height.length - 1, max = 0;
    while (left < right) {
        max = Math.max(max, Math.min(height[left], height[right]) * (right - left));
        if (height[left] < height[right]) left++;
        else right--;
    }
    return max;
}

// ==================== 14. 接雨水（双指针） ====================
// 题干：n 个非负整数表示柱高，求能接的雨水量。
// 输入：height: number[]
// 输出：number
// 约束：双指针左右最大高度

function trap224(height) {
    let left = 0, right = height.length - 1, lMax = 0, rMax = 0, sum = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            lMax = Math.max(lMax, height[left]);
            sum += lMax - height[left];
            left++;
        } else {
            rMax = Math.max(rMax, height[right]);
            sum += rMax - height[right];
            right--;
        }
    }
    return sum;
}

// ==================== 15. 移动零 ====================
// 题干：数组 nums，将所有 0 移到末尾，保持非零元素相对顺序。原地。
// 输入：nums: number[]（原地修改）
// 输出：无
// 约束：双指针

function moveZeroes(nums) {
    let w = 0;
    for (let i = 0; i < nums.length; i++) if (nums[i] !== 0) nums[w++] = nums[i];
    while (w < nums.length) nums[w++] = 0;
}

// ==================== 16. 删除有序数组中的重复项 II ====================
// 题干：有序数组 nums，使每个元素最多出现两次，返回新长度，原地修改。
// 输入：nums: number[]
// 输出：number
// 约束：双指针

function removeDuplicates224(nums) {
    if (nums.length <= 2) return nums.length;
    let w = 2;
    for (let i = 2; i < nums.length; i++)
        if (nums[i] !== nums[w - 2]) nums[w++] = nums[i];
    return w;
}

// ==================== 17. 两数之和 II - 输入有序数组 ====================
// 题干：非递减数组 numbers 和 target，两数之和为 target 的下标（1-indexed）。
// 输入：numbers: number[], target: number
// 输出：number[]
// 约束：双指针首尾

function twoSum224(numbers, target) {
    let left = 0, right = numbers.length - 1;
    while (left < right) {
        const sum = numbers[left] + numbers[right];
        if (sum === target) return [left + 1, right + 1];
        if (sum < target) left++;
        else right--;
    }
    return [];
}

// ==================== 18. 通过删除字母匹配到字典里最长单词 ====================
// 题干：字符串 s 和字典 dictionary，删除 s 中若干字符得到字典中最长且字典序最小的字符串。
// 输入：s: string, dictionary: string[]
// 输出：string
// 约束：双指针判断子序列 + 排序

function findLongestWord(s, dictionary) {
    const isSub = (sub) => {
        let j = 0;
        for (let i = 0; i < s.length && j < sub.length; i++) if (s[i] === sub[j]) j++;
        return j === sub.length;
    };
    dictionary.sort((a, b) => b.length !== a.length ? b.length - a.length : a.localeCompare(b));
    for (const w of dictionary) if (isSub(w)) return w;
    return '';
}

// ==================== 19. 环形链表 II ====================
// 题干：链表若有环，返回环入口节点；否则 null。O(1) 空间。
// 输入：head: ListNode | null
// 输出：ListNode | null
// 约束：快慢指针

function detectCycle(head) {
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) {
            let p = head;
            while (p !== slow) { p = p.next; slow = slow.next; }
            return p;
        }
    }
    return null;
}

// ==================== 20. 删除链表的倒数第 N 个结点 ====================
// 题干：链表 head 和 n，删除倒数第 n 个节点，返回头节点。
// 输入：head: ListNode | null, n: number
// 输出：ListNode | null
// 约束：一趟：快指针先走 n 步

function removeNthFromEnd(head, n) {
    const dummy = new ListNode(0, head);
    let fast = dummy, slow = dummy;
    for (let i = 0; i <= n; i++) fast = fast.next;
    while (fast) { fast = fast.next; slow = slow.next; }
    slow.next = slow.next.next;
    return dummy.next;
}
