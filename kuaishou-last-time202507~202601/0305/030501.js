/**
 * 030501 面试算法题（20 道）- 专题：双指针与滑动窗口
 * 日期：2026-03-05
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 两数之和 II（有序数组） ====================
function twoSum(nums, target) {
    let i = 0, j = nums.length - 1;
    while (i < j) {
        const sum = nums[i] + nums[j];
        if (sum === target) return [i + 1, j + 1];
        if (sum < target) i++;
        else j--;
    }
    return [];
}

// ==================== 2. 三数之和 ====================
function threeSum(nums) {
    nums.sort((a, b) => a - b);
    const res = [];
    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        let lo = i + 1, hi = nums.length - 1;
        while (lo < hi) {
            const sum = nums[i] + nums[lo] + nums[hi];
            if (sum === 0) {
                res.push([nums[i], nums[lo], nums[hi]]);
                while (lo < hi && nums[lo] === nums[lo + 1]) lo++;
                while (lo < hi && nums[hi] === nums[hi - 1]) hi--;
                lo++;
                hi--;
            } else if (sum < 0) lo++;
            else hi--;
        }
    }
    return res;
}

// ==================== 3. 最接近的三数之和 ====================
function threeSumClosest(nums, target) {
    nums.sort((a, b) => a - b);
    let best = Infinity;
    for (let i = 0; i < nums.length - 2; i++) {
        let lo = i + 1, hi = nums.length - 1;
        while (lo < hi) {
            const sum = nums[i] + nums[lo] + nums[hi];
            if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;
            if (sum < target) lo++;
            else hi--;
        }
    }
    return best;
}

// ==================== 4. 四数之和 ====================
function fourSum(nums, target) {
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
                    while (lo < hi && nums[lo] === nums[lo + 1]) lo++;
                    while (lo < hi && nums[hi] === nums[hi - 1]) hi--;
                    lo++;
                    hi--;
                } else if (sum < target) lo++;
                else hi--;
            }
        }
    }
    return res;
}

// ==================== 5. 无重复字符的最长子串 ====================
function lengthOfLongestSubstring(s) {
    const set = new Set();
    let left = 0, max = 0;
    for (let right = 0; right < s.length; right++) {
        while (set.has(s[right])) set.delete(s[left++]);
        set.add(s[right]);
        max = Math.max(max, right - left + 1);
    }
    return max;
}

// ==================== 6. 最小覆盖子串 ====================
function minWindow(s, t) {
    const need = {};
    for (const c of t) need[c] = (need[c] || 0) + 1;
    let needCount = Object.keys(need).length;
    let left = 0, start = 0, len = Infinity;
    for (let right = 0; right < s.length; right++) {
        const c = s[right];
        if (need[c] !== undefined) {
            need[c]--;
            if (need[c] === 0) needCount--;
        }
        while (needCount === 0) {
            if (right - left + 1 < len) { len = right - left + 1; start = left; }
            const d = s[left++];
            if (need[d] !== undefined) {
                if (need[d] === 0) needCount++;
                need[d]++;
            }
        }
    }
    return len === Infinity ? '' : s.slice(start, start + len);
}

// ==================== 7. 串联所有单词的子串 ====================
function findSubstring(s, words) {
    if (!words.length) return [];
    const n = words[0].length, totalLen = words.length * n, needCount = words.length;
    const need = {};
    for (const w of words) need[w] = (need[w] || 0) + 1;
    const res = [];
    for (let start = 0; start < n; start++) {
        const win = {};
        let count = 0;
        for (let i = start; i + n <= s.length; i += n) {
            const w = s.slice(i, i + n);
            if (i >= start + totalLen) {
                const prev = s.slice(i - totalLen, i - totalLen + n);
                if (need[prev]) {
                    win[prev]--;
                    if (win[prev] < need[prev]) count--;
                }
            }
            if (need[w]) {
                win[w] = (win[w] || 0) + 1;
                if (win[w] <= need[w]) count++;
            } else {
                for (const k of Object.keys(win)) delete win[k];
                count = 0;
            }
            if (count === needCount) res.push(i - totalLen + n);
        }
    }
    return res;
}

// ==================== 8. 长度最小的子数组 ====================
function minSubArrayLen(target, nums) {
    let left = 0, sum = 0, minLen = Infinity;
    for (let right = 0; right < nums.length; right++) {
        sum += nums[right];
        while (sum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            sum -= nums[left++];
        }
    }
    return minLen === Infinity ? 0 : minLen;
}

// ==================== 9. 盛最多水的容器 ====================
function maxArea(height) {
    let i = 0, j = height.length - 1, max = 0;
    while (i < j) {
        max = Math.max(max, Math.min(height[i], height[j]) * (j - i));
        if (height[i] < height[j]) i++;
        else j--;
    }
    return max;
}

// ==================== 10. 移除元素 ====================
function removeElement(nums, val) {
    let k = 0;
    for (let i = 0; i < nums.length; i++)
        if (nums[i] !== val) nums[k++] = nums[i];
    return k;
}

// ==================== 11. 删除有序数组中的重复项 II ====================
function removeDuplicates(nums) {
    if (nums.length <= 2) return nums.length;
    let k = 2;
    for (let i = 2; i < nums.length; i++)
        if (nums[i] !== nums[k - 2]) nums[k++] = nums[i];
    return k;
}

// ==================== 12. 移动零 ====================
function moveZeroes(nums) {
    let k = 0;
    for (let i = 0; i < nums.length; i++)
        if (nums[i] !== 0) nums[k++] = nums[i];
    for (; k < nums.length; k++) nums[k] = 0;
}

// ==================== 13. 反转字符串 ====================
function reverseString(s) {
    for (let i = 0, j = s.length - 1; i < j; i++, j--) [s[i], s[j]] = [s[j], s[i]];
}

// ==================== 14. 验证回文串 ====================
function isPalindrome(s) {
    const t = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (let i = 0, j = t.length - 1; i < j; i++, j--)
        if (t[i] !== t[j]) return false;
    return true;
}

// ==================== 15. 反转字符串中的元音字母 ====================
function reverseVowels(s) {
    const set = new Set('aeiouAEIOU');
    const arr = s.split('');
    let i = 0, j = arr.length - 1;
    while (i < j) {
        while (i < j && !set.has(arr[i])) i++;
        while (i < j && !set.has(arr[j])) j--;
        if (i < j) [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
        j--;
    }
    return arr.join('');
}

// ==================== 16. 链表的中间结点 ====================
function middleNode(head) {
    let slow = head, fast = head;
    while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
    return slow;
}

// ==================== 17. 环形链表 II ====================
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

// ==================== 18. 删除排序链表中的重复元素 II ====================
function deleteDuplicates(head) {
    const dummy = new ListNode(0, head);
    let p = dummy;
    while (p.next) {
        let q = p.next;
        while (q.next && q.next.val === q.val) q = q.next;
        if (q !== p.next) p.next = q.next;
        else p = p.next;
    }
    return dummy.next;
}

// ==================== 19. 分隔链表 ====================
function partitionList(head, x) {
    const small = new ListNode(0), large = new ListNode(0);
    let ps = small, pl = large;
    while (head) {
        if (head.val < x) { ps.next = head; ps = ps.next; }
        else { pl.next = head; pl = pl.next; }
        head = head.next;
    }
    pl.next = null;
    ps.next = large.next;
    return small.next;
}

// ==================== 20. 接雨水 ====================
function trap(height) {
    let left = 0, right = height.length - 1;
    let leftMax = 0, rightMax = 0, res = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) leftMax = height[left];
            else res += leftMax - height[left];
            left++;
        } else {
            if (height[right] >= rightMax) rightMax = height[right];
            else res += rightMax - height[right];
            right--;
        }
    }
    return res;
}

// ==================== 测试 ====================
function test030501() {
    const assert = (name, got, expect) => {
        const ok = JSON.stringify(got) === JSON.stringify(expect);
        console.log(ok ? `[OK] ${name}` : `[FAIL] ${name} got=${JSON.stringify(got)} expect=${JSON.stringify(expect)}`);
    };
    assert('1. twoSum', twoSum([2, 7, 11, 15], 9), [1, 2]);
    assert('2. threeSum', threeSum([-1, 0, 1, 2, -1, -4]).length, 2);
    assert('3. threeSumClosest', threeSumClosest([-1, 2, 1, -4], 1), 2);
    assert('4. fourSum', fourSum([1, 0, -1, 0, -2, 2], 0).length, 3);
    assert('5. lengthOfLongestSubstring', lengthOfLongestSubstring('abcabcbb'), 3);
    assert('6. minWindow', minWindow('ADOBECODEBANC', 'ABC'), 'BANC');
    assert('7. findSubstring', findSubstring('barfoothefoobarman', ['foo', 'bar']), [0, 9]);
    assert('8. minSubArrayLen', minSubArrayLen(7, [2, 3, 1, 2, 4, 3]), 2);
    assert('9. maxArea', maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
    const n10 = [3, 2, 2, 3]; assert('10. removeElement', removeElement(n10, 3), 2);
    const n11 = [1, 1, 1, 2, 2, 3]; assert('11. removeDuplicates', removeDuplicates(n11), 5);
    const n12 = [0, 1, 0, 3, 12]; moveZeroes(n12); assert('12. moveZeroes', n12, [1, 3, 12, 0, 0]);
    const n13 = ['h', 'e', 'l', 'l', 'o']; reverseString(n13); assert('13. reverseString', n13, ['o', 'l', 'l', 'e', 'h']);
    assert('14. isPalindrome', isPalindrome('A man, a plan, a canal: Panama'), true);
    assert('15. reverseVowels', reverseVowels('hello'), 'holle');
    assert('16. middleNode', middleNode(new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))))).val, 3);
    assert('20. trap', trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]), 6);
    console.log('030501 tests done.');
}
test030501();
