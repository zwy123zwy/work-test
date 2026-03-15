/**
 * 030101 面试算法题（20 道）- 专题：贪心
 * 日期：2026-03-01
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 跳跃游戏 ====================
function canJump(nums) {
    let far = 0;
    for (let i = 0; i < nums.length; i++) {
        if (i > far) return false;
        far = Math.max(far, i + nums[i]);
    }
    return true;
}

// ==================== 2. 跳跃游戏 II ====================
function jump(nums) {
    let end = 0, far = 0, steps = 0;
    for (let i = 0; i < nums.length - 1; i++) {
        far = Math.max(far, i + nums[i]);
        if (i === end) { end = far; steps++; }
    }
    return steps;
}

// ==================== 3. 合并区间 ====================
function merge(intervals) {
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

// ==================== 4. 无重叠区间 ====================
function eraseOverlapIntervals(intervals) {
    if (!intervals.length) return 0;
    intervals.sort((a, b) => a[1] - b[1]);
    let end = -Infinity, count = 0;
    for (const [s, e] of intervals) {
        if (s >= end) { end = e; count++; }
    }
    return intervals.length - count;
}

// ==================== 5. 用最少数量的箭引爆气球 ====================
function findMinArrowShots(points) {
    if (!points.length) return 0;
    points.sort((a, b) => a[1] - b[1]);
    let end = points[0][1], arrows = 1;
    for (let i = 1; i < points.length; i++) {
        if (points[i][0] > end) { end = points[i][1]; arrows++; }
    }
    return arrows;
}

// ==================== 6. 划分字母区间 ====================
function partitionLabels(s) {
    const last = {};
    for (let i = 0; i < s.length; i++) last[s[i]] = i;
    const res = [];
    let start = 0, maxEnd = 0;
    for (let i = 0; i < s.length; i++) {
        maxEnd = Math.max(maxEnd, last[s[i]]);
        if (i === maxEnd) { res.push(i - start + 1); start = i + 1; }
    }
    return res;
}

// ==================== 7. 任务调度器 ====================
function leastInterval(tasks, n) {
    const cnt = {};
    for (const t of tasks) cnt[t] = (cnt[t] || 0) + 1;
    const max = Math.max(...Object.values(cnt));
    let same = 0;
    for (const c of Object.values(cnt)) if (c === max) same++;
    return Math.max(tasks.length, (max - 1) * (n + 1) + same);
}

// ==================== 8. 柠檬水找零 ====================
function lemonadeChange(bills) {
    let five = 0, ten = 0;
    for (const b of bills) {
        if (b === 5) five++;
        else if (b === 10) { if (!five) return false; five--; ten++; }
        else {
            if (ten && five) { ten--; five--; }
            else if (five >= 3) five -= 3;
            else return false;
        }
    }
    return true;
}

// ==================== 9. 分发饼干 ====================
function findContentChildren(g, s) {
    g.sort((a, b) => a - b);
    s.sort((a, b) => a - b);
    let i = 0, j = 0;
    while (i < g.length && j < s.length) {
        if (s[j] >= g[i]) i++;
        j++;
    }
    return i;
}

// ==================== 10. 分发糖果 ====================
function candy(ratings) {
    const n = ratings.length;
    const arr = Array(n).fill(1);
    for (let i = 1; i < n; i++)
        if (ratings[i] > ratings[i - 1]) arr[i] = arr[i - 1] + 1;
    for (let i = n - 2; i >= 0; i--)
        if (ratings[i] > ratings[i + 1]) arr[i] = Math.max(arr[i], arr[i + 1] + 1);
    return arr.reduce((a, b) => a + b, 0);
}

// ==================== 11. 根据身高重建队列 ====================
function reconstructQueue(people) {
    people.sort((a, b) => a[0] !== b[0] ? b[0] - a[0] : a[1] - b[1]);
    const res = [];
    for (const p of people) res.splice(p[1], 0, p);
    return res;
}

// ==================== 12. 单调递增的数字 ====================
function monotoneIncreasingDigits(n) {
    const s = String(n).split('');
    let i = 1;
    while (i < s.length && s[i] >= s[i - 1]) i++;
    if (i < s.length) {
        while (i > 0 && s[i] < s[i - 1]) { s[i - 1]--; i--; }
        for (i++; i < s.length; i++) s[i] = '9';
    }
    return parseInt(s.join(''), 10);
}

// ==================== 13. 移掉 K 位数字 ====================
function removeKdigits(num, k) {
    const stack = [];
    for (const d of num) {
        while (k && stack.length && stack[stack.length - 1] > d) { stack.pop(); k--; }
        stack.push(d);
    }
    while (k--) stack.pop();
    let s = stack.join('').replace(/^0+/, '');
    return s || '0';
}

// ==================== 14. 加油站 ====================
function canCompleteCircuit(gas, cost) {
    let total = 0, cur = 0, start = 0;
    for (let i = 0; i < gas.length; i++) {
        total += gas[i] - cost[i];
        cur += gas[i] - cost[i];
        if (cur < 0) { start = i + 1; cur = 0; }
    }
    return total >= 0 ? start : -1;
}

// ==================== 15. 最大数 ====================
function largestNumber(nums) {
    const s = nums.map(String).sort((a, b) => (b + a).localeCompare(a + b));
    return s[0] === '0' ? '0' : s.join('');
}

// ==================== 16. 摆动序列 ====================
function wiggleMaxLength(nums) {
    if (nums.length < 2) return nums.length;
    let up = 1, down = 1;
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] > nums[i - 1]) up = down + 1;
        else if (nums[i] < nums[i - 1]) down = up + 1;
    }
    return Math.max(up, down);
}

// ==================== 17. 买卖股票的最佳时机含手续费 ====================
function maxProfitFee(prices, fee) {
    let buy = -prices[0], sell = 0;
    for (let i = 1; i < prices.length; i++) {
        sell = Math.max(sell, buy + prices[i] - fee);
        buy = Math.max(buy, sell - prices[i]);
    }
    return sell;
}

// ==================== 18. 监控二叉树 ====================
function minCameraCover(root) {
    let cameras = 0;
    const dfs = (node) => {
        if (!node) return 2;
        const l = dfs(node.left), r = dfs(node.right);
        if (l === 0 || r === 0) { cameras++; return 1; }
        if (l === 1 || r === 1) return 2;
        return 0;
    };
    return (dfs(root) === 0 ? 1 : 0) + cameras;
}

// ==================== 19. 非递减数列 ====================
function checkPossibility(nums) {
    let changed = 0;
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] >= nums[i - 1]) continue;
        if (changed++) return false;
        if (i > 1 && nums[i] < nums[i - 2]) nums[i] = nums[i - 1];
    }
    return true;
}

// ==================== 20. 重构字符串 ====================
function reorganizeString(s) {
    const cnt = {};
    for (const c of s) cnt[c] = (cnt[c] || 0) + 1;
    const max = Math.max(...Object.values(cnt));
    if (max > (s.length + 1) / 2) return '';
    const arr = Object.entries(cnt).sort((a, b) => b[1] - a[1]);
    const res = Array(s.length);
    let i = 0;
    for (const [c, n] of arr)
        for (let k = 0; k < n; k++) {
            res[i] = c;
            i += 2;
            if (i >= s.length) i = 1;
        }
    return res.join('');
}

// ==================== 测试 ====================
function test030101() {
    const assert = (name, got, expect) => {
        const ok = JSON.stringify(got) === JSON.stringify(expect);
        console.log(ok ? `[OK] ${name}` : `[FAIL] ${name} got=${JSON.stringify(got)} expect=${JSON.stringify(expect)}`);
    };
    assert('1. canJump', canJump([2, 3, 1, 1, 4]), true);
    assert('2. jump', jump([2, 3, 1, 1, 4]), 2);
    assert('3. merge', merge([[1, 3], [2, 6], [8, 10], [15, 18]]), [[1, 6], [8, 10], [15, 18]]);
    assert('4. eraseOverlapIntervals', eraseOverlapIntervals([[1, 2], [2, 3], [3, 4], [1, 3]]), 1);
    assert('5. findMinArrowShots', findMinArrowShots([[10, 16], [2, 8], [1, 6], [7, 12]]), 2);
    assert('6. partitionLabels', partitionLabels('ababcbacadefegdehijhklij'), [9, 7, 8]);
    assert('7. leastInterval', leastInterval(['A', 'A', 'A', 'B', 'B', 'B'], 2), 8);
    assert('8. lemonadeChange', lemonadeChange([5, 5, 5, 10, 20]), true);
    assert('9. findContentChildren', findContentChildren([1, 2, 3], [1, 1]), 1);
    assert('10. candy', candy([1, 0, 2]), 5);
    assert('11. reconstructQueue', reconstructQueue([[7, 0], [4, 4], [7, 1], [5, 0], [6, 1], [5, 2]]).length, 6);
    assert('12. monotoneIncreasingDigits', monotoneIncreasingDigits(10), 9);
    assert('13. removeKdigits', removeKdigits('1432219', 3), '1219');
    assert('14. canCompleteCircuit', canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]), 3);
    assert('15. largestNumber', largestNumber([10, 2]), '210');
    assert('16. wiggleMaxLength', wiggleMaxLength([1, 7, 4, 9, 2, 5]), 6);
    assert('17. maxProfitFee', maxProfitFee([1, 3, 2, 8, 4, 9], 2), 8);
    assert('18. minCameraCover', minCameraCover(new TreeNode(0, new TreeNode(0, new TreeNode(0), new TreeNode(0)))), 1);
    assert('19. checkPossibility', checkPossibility([4, 2, 3]), true);
    assert('20. reorganizeString', reorganizeString('aab').length, 3);
    console.log('030101 tests done.');
}
test030101();
