/**
 * 030201 面试算法题（20 道）- 专题：二分查找与排序
 * 日期：2026-03-02
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 二分查找 ====================
function search(nums, target) {
    let lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >>> 1;
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

// ==================== 2. 搜索插入位置 ====================
function searchInsert(nums, target) {
    let lo = 0, hi = nums.length;
    while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

// ==================== 3. 在排序数组中查找元素的第一个和最后一个位置 ====================
function searchRange(nums, target) {
    const left = (lo, hi) => {
        while (lo < hi) {
            const mid = (lo + hi) >>> 1;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    };
    const right = (lo, hi) => {
        while (lo < hi) {
            const mid = (lo + hi + 1) >>> 1;
            if (nums[mid] > target) hi = mid - 1;
            else lo = mid;
        }
        return lo;
    };
    const l = left(0, nums.length);
    if (l === nums.length || nums[l] !== target) return [-1, -1];
    return [l, right(0, nums.length - 1)];
}

// ==================== 4. 搜索旋转排序数组 ====================
function searchRotated(nums, target) {
    let lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >>> 1;
        if (nums[mid] === target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else {
            if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}

// ==================== 5. 寻找旋转排序数组中的最小值 ====================
function findMin(nums) {
    let lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (nums[mid] > nums[hi]) lo = mid + 1;
        else hi = mid;
    }
    return nums[lo];
}

// ==================== 6. 搜索二维矩阵 ====================
function searchMatrix(matrix, target) {
    const m = matrix.length, n = matrix[0].length;
    let lo = 0, hi = m * n - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >>> 1;
        const v = matrix[(mid / n) | 0][mid % n];
        if (v === target) return true;
        if (v < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return false;
}

// ==================== 7. 寻找峰值 ====================
function findPeakElement(nums) {
    let lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (nums[mid] > nums[mid + 1]) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

// ==================== 8. 有效的完全平方数 ====================
function isPerfectSquare(num) {
    let lo = 0, hi = num;
    while (lo <= hi) {
        const mid = (lo + hi) >>> 1;
        const sq = mid * mid;
        if (sq === num) return true;
        if (sq < num) lo = mid + 1;
        else hi = mid - 1;
    }
    return false;
}

// ==================== 9. 排序数组（归并） ====================
function sortArray(nums) {
    if (nums.length <= 1) return nums;
    const mid = nums.length >> 1;
    const left = sortArray(nums.slice(0, mid));
    const right = sortArray(nums.slice(mid));
    const res = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length)
        res.push(left[i] <= right[j] ? left[i++] : right[j++]);
    return res.concat(left.slice(i), right.slice(j));
}

// ==================== 10. 数组中的第K个最大元素 ====================
function findKthLargest(nums, k) {
    const swap = (i, j) => [nums[i], nums[j]] = [nums[j], nums[i]];
    const partition = (lo, hi) => {
        const pivot = nums[hi];
        let i = lo;
        for (let j = lo; j < hi; j++)
            if (nums[j] >= pivot) swap(i++, j);
        swap(i, hi);
        return i;
    };
    let lo = 0, hi = nums.length - 1;
    k = k - 1;
    while (true) {
        const p = partition(lo, hi);
        if (p === k) return nums[p];
        if (p < k) lo = p + 1;
        else hi = p - 1;
    }
}

// ==================== 11. 合并两个有序数组 ====================
function mergeSorted(nums1, m, nums2, n) {
    let i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0)
        nums1[k--] = (i >= 0 && nums1[i] > nums2[j]) ? nums1[i--] : nums2[j--];
}

// ==================== 12. 合并区间（按起点排序后合并） ====================
function mergeIntervals(intervals) {
    if (!intervals.length) return [];
    intervals.sort((a, b) => a[0] - b[0]);
    const res = [intervals[0]];
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] <= res[res.length - 1][1])
            res[res.length - 1][1] = Math.max(res[res.length - 1][1], intervals[i][1]);
        else res.push(intervals[i]);
    }
    return res;
}

// ==================== 13. 最大数（自定义排序） ====================
function largestNumber(nums) {
    const s = nums.map(String).sort((a, b) => (b + a).localeCompare(a + b));
    return s[0] === '0' ? '0' : s.join('');
}

// ==================== 14. 颜色分类 ====================
function sortColors(nums) {
    let i = 0, j = 0, k = nums.length - 1;
    while (j <= k) {
        if (nums[j] === 0) { [nums[i], nums[j]] = [nums[j], nums[i]]; i++; j++; }
        else if (nums[j] === 2) { [nums[j], nums[k]] = [nums[k], nums[j]]; k--; }
        else j++;
    }
}

// ==================== 15. 对链表进行插入排序 ====================
function insertionSortList(head) {
    const dummy = new ListNode(-Infinity);
    while (head) {
        let p = dummy;
        while (p.next && p.next.val < head.val) p = p.next;
        const next = head.next;
        head.next = p.next;
        p.next = head;
        head = next;
    }
    return dummy.next;
}

// ==================== 16.  H 指数 ====================
function hIndex(citations) {
    citations.sort((a, b) => b - a);
    let h = 0;
    while (h < citations.length && citations[h] > h) h++;
    return h;
}

// ==================== 17. 在 D 天内送达包裹的能力 ====================
function shipWithinDays(weights, days) {
    let lo = Math.max(...weights), hi = weights.reduce((a, b) => a + b, 0);
    const ok = (cap) => {
        let d = 1, cur = 0;
        for (const w of weights) {
            if (cur + w > cap) { d++; cur = 0; }
            cur += w;
        }
        return d <= days;
    };
    while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (ok(mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

// ==================== 18. 爱吃香蕉的珂珂 ====================
function minEatingSpeed(piles, h) {
    let lo = 1, hi = Math.max(...piles);
    const ok = (k) => piles.reduce((s, p) => s + Math.ceil(p / k), 0) <= h;
    while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if (ok(mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

// ==================== 19. 寻找两个正序数组的中位数 ====================
function findMedianSortedArrays(nums1, nums2) {
    const m = nums1.length, n = nums2.length;
    const k = (m + n + 1) >> 1;
    const get = (arr, i) => (i < 0 ? -Infinity : i >= arr.length ? Infinity : arr[i]);
    let lo = 0, hi = m;
    while (lo <= hi) {
        const i = (lo + hi) >>> 1, j = k - i;
        if (get(nums1, i - 1) > get(nums2, j)) hi = i - 1;
        else if (get(nums2, j - 1) > get(nums1, i)) lo = i + 1;
        else {
            const left = Math.max(get(nums1, i - 1), get(nums2, j - 1));
            if ((m + n) % 2) return left;
            const right = Math.min(get(nums1, i), get(nums2, j));
            return (left + right) / 2;
        }
    }
    return 0;
}

// ==================== 20. 计算右侧小于当前元素的个数 ====================
function countSmaller(nums) {
    const res = Array(nums.length).fill(0);
    const arr = nums.map((v, i) => [v, i]);
    const merge = (lo, mid, hi) => {
        const left = arr.slice(lo, mid + 1), right = arr.slice(mid + 1, hi + 1);
        let i = 0, j = 0, k = lo, rightCount = 0;
        while (i < left.length && j < right.length) {
            if (left[i][0] <= right[j][0]) {
                res[left[i][1]] += rightCount;
                arr[k++] = left[i++];
            } else { rightCount++; arr[k++] = right[j++]; }
        }
        while (i < left.length) { res[left[i][1]] += rightCount; arr[k++] = left[i++]; }
        while (j < right.length) arr[k++] = right[j++];
    };
    const sort = (lo, hi) => {
        if (lo >= hi) return;
        const mid = (lo + hi) >>> 1;
        sort(lo, mid);
        sort(mid + 1, hi);
        merge(lo, mid, hi);
    };
    sort(0, nums.length - 1);
    return res;
}

// ==================== 测试 ====================
function test030201() {
    const assert = (name, got, expect) => {
        const ok = JSON.stringify(got) === JSON.stringify(expect);
        console.log(ok ? `[OK] ${name}` : `[FAIL] ${name} got=${JSON.stringify(got)} expect=${JSON.stringify(expect)}`);
    };
    assert('1. search', search([-1, 0, 3, 5, 9, 12], 9), 4);
    assert('2. searchInsert', searchInsert([1, 3, 5, 6], 5), 2);
    assert('3. searchRange', searchRange([5, 7, 7, 8, 8, 10], 8), [3, 4]);
    assert('4. searchRotated', searchRotated([4, 5, 6, 7, 0, 1, 2], 0), 4);
    assert('5. findMin', findMin([3, 4, 5, 1, 2]), 1);
    assert('6. searchMatrix', searchMatrix([[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3), true);
    assert('7. findPeakElement', findPeakElement([1, 2, 3, 1]), 2);
    assert('8. isPerfectSquare', isPerfectSquare(16), true);
    assert('9. sortArray', sortArray([5, 2, 3, 1]), [1, 2, 3, 5]);
    assert('10. findKthLargest', findKthLargest([3, 2, 1, 5, 6, 4], 2), 5);
    const n11 = [1, 2, 3, 0, 0, 0]; mergeSorted(n11, 3, [2, 5, 6], 3); assert('11. mergeSorted', n11, [1, 2, 2, 3, 5, 6]);
    assert('12. mergeIntervals', mergeIntervals([[1, 3], [2, 6], [8, 10]]), [[1, 6], [8, 10]]);
    assert('13. largestNumber', largestNumber([10, 2]), '210');
    const n14 = [2, 0, 2, 1, 1, 0]; sortColors(n14); assert('14. sortColors', n14, [0, 0, 1, 1, 2, 2]);
    assert('16. hIndex', hIndex([3, 0, 6, 1, 5]), 3);
    assert('17. shipWithinDays', shipWithinDays([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5), 15);
    assert('18. minEatingSpeed', minEatingSpeed([3, 6, 7, 11], 8), 4);
    assert('19. findMedianSortedArrays', findMedianSortedArrays([1, 3], [2]), 2);
    assert('20. countSmaller', countSmaller([5, 2, 6, 1]), [2, 1, 1, 0]);
    console.log('030201 tests done.');
}
test030201();
