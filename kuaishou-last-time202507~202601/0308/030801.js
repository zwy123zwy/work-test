/**
 * 030801 面试算法题（20 道）- 专题：哈希与集合（Hooks 依赖/cache）
 * 日期：2026-03-08
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 两数之和 ====================
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const j = map.get(target - nums[i]);
        if (j !== undefined) return [j, i];
        map.set(nums[i], i);
    }
    return [];
}

// ==================== 2. 存在重复元素 II ====================
function containsNearbyDuplicate(nums, k) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        if (map.has(nums[i]) && i - map.get(nums[i]) <= k) return true;
        map.set(nums[i], i);
    }
    return false;
}

// ==================== 3. 快乐数 ====================
function isHappy(n) {
    const seen = new Set();
    while (n !== 1 && !seen.has(n)) {
        seen.add(n);
        n = String(n).split('').reduce((s, d) => s + (+d) ** 2, 0);
    }
    return n === 1;
}

// ==================== 4. 同构字符串 ====================
function isIsomorphic(s, t) {
    const m1 = {}, m2 = {};
    for (let i = 0; i < s.length; i++) {
        if (m1[s[i]] !== m2[t[i]]) return false;
        m1[s[i]] = m2[t[i]] = i;
    }
    return true;
}

// ==================== 5. 两个列表的最小索引和 ====================
function findRestaurant(list1, list2) {
    const map = new Map(list1.map((v, i) => [v, i]));
    let min = Infinity, res = [];
    for (let i = 0; i < list2.length; i++) {
        if (!map.has(list2[i])) continue;
        const sum = map.get(list2[i]) + i;
        if (sum < min) { min = sum; res = [list2[i]]; }
        else if (sum === min) res.push(list2[i]);
    }
    return res;
}

// ==================== 6. 字符串中的第一个唯一字符 ====================
function firstUniqChar(s) {
    const cnt = {};
    for (const c of s) cnt[c] = (cnt[c] || 0) + 1;
    for (let i = 0; i < s.length; i++) if (cnt[s[i]] === 1) return i;
    return -1;
}

// ==================== 7. 两个数组的交集 II ====================
function intersect(nums1, nums2) {
    const map = {};
    for (const x of nums1) map[x] = (map[x] || 0) + 1;
    const res = [];
    for (const x of nums2) if (map[x]) { res.push(x); map[x]--; }
    return res;
}

// ==================== 8. 有效的字母异位词 ====================
function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    const cnt = {};
    for (const c of s) cnt[c] = (cnt[c] || 0) + 1;
    for (const c of t) { if (!cnt[c]) return false; cnt[c]--; }
    return true;
}

// ==================== 9. 赎金信 ====================
function canConstruct(ransomNote, magazine) {
    const cnt = {};
    for (const c of magazine) cnt[c] = (cnt[c] || 0) + 1;
    for (const c of ransomNote) {
        if (!cnt[c]) return false;
        cnt[c]--;
    }
    return true;
}

// ==================== 10. 找出字符串中所有字母异位词 ====================
function findAnagrams(s, p) {
    const need = {}, win = {};
    for (const c of p) need[c] = (need[c] || 0) + 1;
    const keys = Object.keys(need).length;
    let match = 0, left = 0, res = [];
    for (let right = 0; right < s.length; right++) {
        const c = s[right];
        if (need[c]) { win[c] = (win[c] || 0) + 1; if (win[c] === need[c]) match++; }
        while (match === keys && right - left + 1 >= p.length) {
            if (right - left + 1 === p.length) res.push(left);
            const d = s[left++];
            if (need[d]) { if (win[d] === need[d]) match--; win[d]--; }
        }
    }
    return res;
}

// ==================== 11. 缺失的第一个正数 ====================
function firstMissingPositive(nums) {
    const n = nums.length;
    for (let i = 0; i < n; i++)
        while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i])
            [nums[nums[i] - 1], nums[i]] = [nums[i], nums[nums[i] - 1]];
    for (let i = 0; i < n; i++) if (nums[i] !== i + 1) return i + 1;
    return n + 1;
}

// ==================== 12. 最长连续序列 ====================
function longestConsecutive(nums) {
    const set = new Set(nums);
    let max = 0;
    for (const x of set) {
        if (set.has(x - 1)) continue;
        let len = 0, cur = x;
        while (set.has(cur)) { len++; cur++; }
        max = Math.max(max, len);
    }
    return max;
}

// ==================== 13. 只出现一次的数字 ====================
function singleNumber(nums) {
    return nums.reduce((a, b) => a ^ b, 0);
}

// ==================== 14. 只出现一次的数字 II ====================
function singleNumber2(nums) {
    let ones = 0, twos = 0;
    for (const x of nums) {
        ones = (ones ^ x) & ~twos;
        twos = (twos ^ x) & ~ones;
    }
    return ones;
}

// ==================== 15. 只出现一次的数字 III ====================
function singleNumber3(nums) {
    const xor = nums.reduce((a, b) => a ^ b, 0);
    const low = xor & -xor;
    let a = 0, b = 0;
    for (const x of nums) (x & low) ? a ^= x : b ^= x;
    return [a, b];
}

// ==================== 16. 复制带随机指针的链表（哈希） ====================
function copyRandomListHash(head) {
    if (!head) return null;
    const map = new Map();
    let p = head;
    while (p) { map.set(p, { val: p.val, next: null, random: null }); p = p.next; }
    p = head;
    while (p) {
        map.get(p).next = p.next ? map.get(p.next) : null;
        map.get(p).random = p.random ? map.get(p.random) : null;
        p = p.next;
    }
    return map.get(head);
}

// ==================== 17. 砖墙 ====================
function leastBricks(wall) {
    const cnt = new Map();
    let max = 0;
    for (const row of wall) {
        let sum = 0;
        for (let i = 0; i < row.length - 1; i++) {
            sum += row[i];
            cnt.set(sum, (cnt.get(sum) || 0) + 1);
            max = Math.max(max, cnt.get(sum));
        }
    }
    return wall.length - max;
}

// ==================== 18. 四数相加 II ====================
function fourSumCount(nums1, nums2, nums3, nums4) {
    const map = new Map();
    for (const a of nums1) for (const b of nums2) map.set(a + b, (map.get(a + b) || 0) + 1);
    let count = 0;
    for (const c of nums3) for (const d of nums4) count += map.get(-(c + d)) || 0;
    return count;
}

// ==================== 19. 数对和 ====================
function pairSums(nums, target) {
    const map = new Map();
    const res = [];
    for (const x of nums) {
        const y = target - x;
        if (map.get(y)) { res.push([y, x]); map.set(y, map.get(y) - 1); }
        else map.set(x, (map.get(x) || 0) + 1);
    }
    return res;
}

// ==================== 20. 分组 Anagrams ====================
function groupAnagrams(strs) {
    const map = new Map();
    for (const s of strs) {
        const key = [...s].sort().join('');
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(s);
    }
    return [...map.values()];
}

// ==================== 测试 ====================
function test030801() {
    const assert = (n, a, e) => console.log(JSON.stringify(a) === JSON.stringify(e) ? `[OK] ${n}` : `[FAIL] ${n}`);
    assert('1', twoSum([2, 7, 11, 15], 9), [0, 1]);
    assert('2', containsNearbyDuplicate([1, 2, 3, 1], 3), true);
    assert('3', isHappy(19), true);
    assert('4', isIsomorphic('egg', 'add'), true);
    assert('6', firstUniqChar('leetcode'), 0);
    assert('8', isAnagram('anagram', 'nagaram'), true);
    assert('9', canConstruct('aa', 'aab'), true);
    assert('11', firstMissingPositive([3, 4, -1, 1]), 2);
    assert('12', longestConsecutive([100, 4, 200, 1, 3, 2]), 4);
    assert('13', singleNumber([2, 2, 1]), 1);
    assert('18', fourSumCount([1, 2], [-2, -1], [-1, 2], [0, 2]), 2);
    assert('20', groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']).length, 3);
    console.log('030801 tests done.');
}
test030801();
