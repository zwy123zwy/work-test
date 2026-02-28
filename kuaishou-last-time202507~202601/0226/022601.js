/**
 * 022601 面试算法题（20 道）- 专题：前缀和、差分与矩阵
 * 日期：2026-02-26
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 区域和检索 - 数组不可变 ====================
class NumArray {
    constructor(nums) {
        this.pre = [0];
        for (const x of nums) this.pre.push(this.pre[this.pre.length - 1] + x);
    }
    sumRange(left, right) {
        return this.pre[right + 1] - this.pre[left];
    }
}

// ==================== 2. 二维区域和检索 - 矩阵不可变 ====================
class NumMatrix {
    constructor(matrix) {
        const m = matrix.length, n = matrix[0]?.length || 0;
        this.pre = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
        for (let i = 0; i < m; i++)
            for (let j = 0; j < n; j++)
                this.pre[i + 1][j + 1] = matrix[i][j] + this.pre[i][j + 1] + this.pre[i + 1][j] - this.pre[i][j];
    }
    sumRegion(r1, c1, r2, c2) {
        return this.pre[r2 + 1][c2 + 1] - this.pre[r1][c2 + 1] - this.pre[r2 + 1][c1] + this.pre[r1][c1];
    }
}

// ==================== 3. 和为 K 的子数组 ====================
function subarraySum(nums, k) {
    const map = new Map([[0, 1]]);
    let sum = 0, count = 0;
    for (const x of nums) {
        sum += x;
        count += map.get(sum - k) || 0;
        map.set(sum, (map.get(sum) || 0) + 1);
    }
    return count;
}

// ==================== 4. 连续数组 ====================
function findMaxLength(nums) {
    const map = new Map([[0, -1]]);
    let sum = 0, maxLen = 0;
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i] === 1 ? 1 : -1;
        if (map.has(sum)) maxLen = Math.max(maxLen, i - map.get(sum));
        else map.set(sum, i);
    }
    return maxLen;
}

// ==================== 5. 除自身以外数组的乘积 ====================
function productExceptSelf(nums) {
    const n = nums.length;
    const ans = Array(n).fill(1);
    for (let i = 1; i < n; i++) ans[i] = ans[i - 1] * nums[i - 1];
    let suf = 1;
    for (let i = n - 1; i >= 0; i--) {
        ans[i] *= suf;
        suf *= nums[i];
    }
    return ans;
}

// ==================== 6. 子数组和整除 K ====================
function subarraysDivByK(nums, k) {
    const map = new Map([[0, 1]]);
    let sum = 0, count = 0;
    for (const x of nums) {
        sum = ((sum + x) % k + k) % k;
        const c = map.get(sum) || 0;
        count += c;
        map.set(sum, c + 1);
    }
    return count;
}

// ==================== 7. 区间加法（差分） ====================
function getModifiedArray(length, updates) {
    const diff = Array(length + 1).fill(0);
    for (const [start, end, inc] of updates) {
        diff[start] += inc;
        diff[end + 1] -= inc;
    }
    const res = [];
    let cur = 0;
    for (let i = 0; i < length; i++) res.push(cur += diff[i]);
    return res;
}

// ==================== 8. 航班预订统计 ====================
function corpFlightBookings(bookings, n) {
    const diff = Array(n + 1).fill(0);
    for (const [first, last, seats] of bookings) {
        diff[first - 1] += seats;
        diff[last] -= seats;
    }
    const res = [];
    let cur = 0;
    for (let i = 0; i < n; i++) res.push(cur += diff[i]);
    return res;
}

// ==================== 9. 拼车 ====================
function carPooling(trips, capacity) {
    const diff = Array(1001).fill(0);
    for (const [num, from, to] of trips) {
        diff[from] += num;
        diff[to] -= num;
    }
    let cur = 0;
    for (const d of diff) {
        cur += d;
        if (cur > capacity) return false;
    }
    return true;
}

// ==================== 10. 矩阵块和 ====================
function matrixBlockSum(matrix, queries) {
    const m = matrix.length, n = matrix[0].length;
    const pre = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
            pre[i + 1][j + 1] = matrix[i][j] + pre[i][j + 1] + pre[i + 1][j] - pre[i][j];
    const sumRegion = (r1, c1, r2, c2) =>
        pre[r2 + 1][c2 + 1] - pre[r1][c2 + 1] - pre[r2 + 1][c1] + pre[r1][c1];
    return queries.map(([r1, c1, r2, c2]) => sumRegion(r1, c1, r2, c2));
}

// ==================== 11. 最大子矩阵 ====================
function maxSubmatrixSum(matrix) {
    const m = matrix.length, n = matrix[0].length;
    let res = -Infinity;
    for (let r1 = 0; r1 < m; r1++) {
        const rowSum = Array(n).fill(0);
        for (let r2 = r1; r2 < m; r2++) {
            for (let j = 0; j < n; j++) rowSum[j] += matrix[r2][j];
            let cur = 0;
            for (const x of rowSum) {
                cur = Math.max(x, cur + x);
                res = Math.max(res, cur);
            }
        }
    }
    return res;
}

// ==================== 12. 元素和为目标值的子矩阵数量 ====================
function numSubmatrixSumTarget(matrix, target) {
    const m = matrix.length, n = matrix[0].length;
    let count = 0;
    for (let r1 = 0; r1 < m; r1++) {
        const rowSum = Array(n).fill(0);
        for (let r2 = r1; r2 < m; r2++) {
            for (let j = 0; j < n; j++) rowSum[j] += matrix[r2][j];
            const map = new Map([[0, 1]]);
            let sum = 0;
            for (const x of rowSum) {
                sum += x;
                count += map.get(sum - target) || 0;
                map.set(sum, (map.get(sum) || 0) + 1);
            }
        }
    }
    return count;
}

// ==================== 13. 矩形区域不超过 K 的最大数值和 ====================
function maxSumSubmatrix(matrix, k) {
    const m = matrix.length, n = matrix[0].length;
    let res = -Infinity;
    for (let r1 = 0; r1 < m; r1++) {
        const rowSum = Array(n).fill(0);
        for (let r2 = r1; r2 < m; r2++) {
            for (let j = 0; j < n; j++) rowSum[j] += matrix[r2][j];
            const pre = [0];
            for (const x of rowSum) pre.push(pre[pre.length - 1] + x);
            for (let c1 = 0; c1 < pre.length; c1++)
                for (let c2 = c1 + 1; c2 < pre.length; c2++) {
                    const sum = pre[c2] - pre[c1];
                    if (sum <= k) res = Math.max(res, sum);
                }
        }
    }
    return res;
}

// ==================== 14. 定长子串中元音最大数目 ====================
const VOWELS = new Set('aeiouAEIOU');
function maxVowels(s, k) {
    let cur = 0;
    for (let i = 0; i < k; i++) if (VOWELS.has(s[i])) cur++;
    let max = cur;
    for (let i = k; i < s.length; i++) {
        if (VOWELS.has(s[i])) cur++;
        if (VOWELS.has(s[i - k])) cur--;
        max = Math.max(max, cur);
    }
    return max;
}

// ==================== 15. 每个元音包含偶数次的最长子串 ====================
function findTheLongestSubstring(s) {
    const map = new Map([[0, -1]]);
    const idx = (c) => 'aeiou'.indexOf(c);
    let state = 0, maxLen = 0;
    for (let i = 0; i < s.length; i++) {
        const j = idx(s[i]);
        if (j >= 0) state ^= 1 << j;
        if (map.has(state)) maxLen = Math.max(maxLen, i - map.get(state));
        else map.set(state, i);
    }
    return maxLen;
}

// ==================== 16. 统计「优美子数组」 ====================
function numberOfSubarrays(nums, k) {
    const map = new Map([[0, 1]]);
    let odd = 0, count = 0;
    for (const x of nums) {
        odd += x % 2;
        count += map.get(odd - k) || 0;
        map.set(odd, (map.get(odd) || 0) + 1);
    }
    return count;
}

// ==================== 17. 和可被 K 整除的子数组 ====================
// 同 subarraysDivByK
const subarraysDivByK17 = subarraysDivByK;

// ==================== 18. 连续子数组的最大和（前缀和视角） ====================
function maxSubArrayPrefix(nums) {
    let pre = 0, minPre = 0, res = -Infinity;
    for (const x of nums) {
        pre += x;
        res = Math.max(res, pre - minPre);
        minPre = Math.min(minPre, pre);
    }
    return res;
}

// ==================== 19. 左右两边子数组和相等 ====================
function pivotIndex(nums) {
    const total = nums.reduce((a, b) => a + b, 0);
    let left = 0;
    for (let i = 0; i < nums.length; i++) {
        if (left === total - left - nums[i]) return i;
        left += nums[i];
    }
    return -1;
}

// ==================== 20. 形成两个异或相等数组的三元组数目 ====================
function countTriplets(arr) {
    const n = arr.length;
    const xor = Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) xor[i + 1] = xor[i] ^ arr[i];
    let count = 0;
    for (let j = 1; j < n; j++)
        for (let i = 0; i < j; i++)
            for (let k = j; k < n; k++)
                if ((xor[j] ^ xor[i]) === (xor[k + 1] ^ xor[j])) count++;
    return count;
}

// ==================== 测试 ====================
function test022601() {
    const assert = (name, got, expect) => {
        const ok = JSON.stringify(got) === JSON.stringify(expect);
        console.log(ok ? `[OK] ${name}` : `[FAIL] ${name} got=${JSON.stringify(got)} expect=${JSON.stringify(expect)}`);
    };
    const na = new NumArray([-2, 0, 3, -5, 2, -1]);
    assert('1. NumArray', na.sumRange(0, 2), 1);
    const nm = new NumMatrix([[3, 0, 1], [5, 6, 3], [1, 2, 0]]);
    assert('2. NumMatrix', nm.sumRegion(1, 1, 2, 2), 11);
    assert('3. subarraySum', subarraySum([1, 1, 1], 2), 2);
    assert('4. findMaxLength', findMaxLength([0, 1, 0]), 2);
    assert('5. productExceptSelf', productExceptSelf([1, 2, 3, 4]), [24, 12, 8, 6]);
    assert('6. subarraysDivByK', subarraysDivByK([4, 5, 0, -2, -3, 1], 5), 7);
    assert('7. getModifiedArray', getModifiedArray(5, [[1, 3, 2], [2, 4, 3], [0, 2, -2]]), [-2, 0, 3, 5, 3]);
    assert('8. corpFlightBookings', corpFlightBookings([[1, 2, 10], [2, 3, 20], [2, 5, 25]], 5), [10, 55, 45, 25, 25]);
    assert('9. carPooling', carPooling([[2, 1, 5], [3, 3, 7]], 4), false);
    assert('10. matrixBlockSum', matrixBlockSum([[1, 2], [3, 4]], [[0, 0, 1, 1]]), [10]);
    assert('11. maxSubmatrixSum', maxSubmatrixSum([[1, 2], [-3, 4]]), 6);
    assert('12. numSubmatrixSumTarget', numSubmatrixSumTarget([[0, 1, 0], [1, 1, 1], [0, 1, 0]], 0), 4);
    assert('13. maxSumSubmatrix', maxSumSubmatrix([[1, 0, 1], [0, -2, 3]], 2), 2);
    assert('14. maxVowels', maxVowels('abciiidef', 3), 3);
    assert('15. findTheLongestSubstring', findTheLongestSubstring('eleetminicoworoep'), 13);
    assert('16. numberOfSubarrays', numberOfSubarrays([1, 1, 2, 1, 1], 3), 2);
    assert('17. subarraysDivByK17', subarraysDivByK17([4, 5, 0, -2, -3, 1], 5), 7);
    assert('18. maxSubArrayPrefix', maxSubArrayPrefix([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
    assert('19. pivotIndex', pivotIndex([1, 7, 3, 6, 5, 6]), 3);
    assert('20. countTriplets', countTriplets([2, 3, 1, 6, 7]), 4);
    console.log('022601 tests done.');
}
test022601();
