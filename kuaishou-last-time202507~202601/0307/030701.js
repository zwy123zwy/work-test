/**
 * 030701 面试算法题（20 道）- 专题：栈与队列（事件循环/任务调度）
 * 日期：2026-03-07
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 有效的括号 ====================
function isValid(s) {
    const stack = [], map = { ')': '(', ']': '[', '}': '{' };
    for (const c of s) {
        if (map[c]) { if (stack.pop() !== map[c]) return false; }
        else stack.push(c);
    }
    return !stack.length;
}

// ==================== 2. 最小栈 ====================
class MinStack {
    constructor() { this.s = []; this.m = []; }
    push(x) { this.s.push(x); this.m.push(this.m.length ? Math.min(this.m[this.m.length - 1], x) : x); }
    pop() { this.s.pop(); this.m.pop(); }
    top() { return this.s[this.s.length - 1]; }
    getMin() { return this.m[this.m.length - 1]; }
}

// ==================== 3. 逆波兰表达式求值 ====================
function evalRPN(tokens) {
    const stack = [];
    const op = (a, b, f) => { const y = stack.pop(), x = stack.pop(); stack.push(f(x, y)); };
    for (const t of tokens) {
        if (t === '+') op(0, 0, (a, b) => a + b);
        else if (t === '-') op(0, 0, (a, b) => a - b);
        else if (t === '*') op(0, 0, (a, b) => a * b);
        else if (t === '/') op(0, 0, (a, b) => (a / b) | 0);
        else stack.push(+t);
    }
    return stack[0];
}

// ==================== 4. 克隆图 ====================
function cloneGraph(node) {
    if (!node) return null;
    const map = new Map();
    const dfs = n => {
        if (map.has(n)) return map.get(n);
        const c = { val: n.val, neighbors: [] };
        map.set(n, c);
        for (const nb of n.neighbors) c.neighbors.push(dfs(nb));
        return c;
    };
    return dfs(node);
}

// ==================== 5. 目标和（栈/DFS） ====================
function findTargetSumWays(nums, target) {
    let count = 0;
    const dfs = (i, sum) => {
        if (i === nums.length) { if (sum === target) count++; return; }
        dfs(i + 1, sum + nums[i]);
        dfs(i + 1, sum - nums[i]);
    };
    dfs(0, 0);
    return count;
}

// ==================== 6. 用栈实现队列 ====================
class MyQueue {
    constructor() { this.in = []; this.out = []; }
    push(x) { this.in.push(x); }
    pop() { if (!this.out.length) while (this.in.length) this.out.push(this.in.pop()); return this.out.pop(); }
    peek() { if (!this.out.length) while (this.in.length) this.out.push(this.in.pop()); return this.out[this.out.length - 1]; }
    empty() { return !this.in.length && !this.out.length; }
}

// ==================== 7. 用队列实现栈 ====================
class MyStack {
    constructor() { this.q = []; }
    push(x) { this.q.push(x); for (let i = 0; i < this.q.length - 1; i++) this.q.push(this.q.shift()); }
    pop() { return this.q.shift(); }
    top() { return this.q[0]; }
    empty() { return !this.q.length; }
}

// ==================== 8. 基本计算器 II ====================
function calculate2(s) {
    let num = 0, op = '+';
    const st = [];
    for (let i = 0; i <= s.length; i++) {
        const c = s[i];
        if (c >= '0' && c <= '9') num = num * 10 + (+c);
        else if (c === ' ') continue;
        else {
            if (op === '+') st.push(num);
            else if (op === '-') st.push(-num);
            else if (op === '*') st.push(st.pop() * num);
            else if (op === '/') st.push((st.pop() / num) | 0);
            op = c;
            num = 0;
        }
    }
    return st.reduce((a, b) => a + b, 0);
}

// ==================== 9. 删除相邻重复项 ====================
function removeDuplicatesStr(s) {
    const st = [];
    for (const c of s) st[st.length - 1] === c ? st.pop() : st.push(c);
    return st.join('');
}

// ==================== 10. 字符串解码 ====================
function decodeString(s) {
    const st = [];
    let num = 0, str = '';
    for (const c of s) {
        if (c >= '0' && c <= '9') num = num * 10 + (+c);
        else if (c === '[') { st.push([num, str]); num = 0; str = ''; }
        else if (c === ']') { const [n, prev] = st.pop(); str = prev + str.repeat(n); }
        else str += c;
    }
    return str;
}

// ==================== 11. 每日温度 ====================
function dailyTemperatures(temperatures) {
    const st = [];
    const res = Array(temperatures.length).fill(0);
    for (let i = 0; i < temperatures.length; i++) {
        while (st.length && temperatures[st[st.length - 1]] < temperatures[i]) {
            const j = st.pop();
            res[j] = i - j;
        }
        st.push(i);
    }
    return res;
}

// ==================== 12. 下一个更大元素 I ====================
function nextGreaterElement(nums1, nums2) {
    const map = {}, st = [];
    for (const x of nums2) {
        while (st.length && st[st.length - 1] < x) map[st.pop()] = x;
        st.push(x);
    }
    return nums1.map(x => map[x] ?? -1);
}

// ==================== 13. 下一个更大元素 II ====================
function nextGreaterElements(nums) {
    const n = nums.length, res = Array(n).fill(-1);
    const st = [];
    for (let i = 0; i < 2 * n; i++) {
        const idx = i % n;
        while (st.length && nums[st[st.length - 1]] < nums[idx]) res[st.pop()] = nums[idx];
        st.push(idx);
    }
    return res;
}

// ==================== 14. 柱状图中最大的矩形 ====================
function largestRectangleArea(heights) {
    heights = [0, ...heights, 0];
    const st = [];
    let max = 0;
    for (let i = 0; i < heights.length; i++) {
        while (st.length && heights[st[st.length - 1]] > heights[i]) {
            const h = heights[st.pop()];
            max = Math.max(max, h * (i - st[st.length - 1] - 1));
        }
        st.push(i);
    }
    return max;
}

// ==================== 15. 接雨水（单调栈） ====================
function trapStack(height) {
    const st = [];
    let res = 0;
    for (let i = 0; i < height.length; i++) {
        while (st.length && height[st[st.length - 1]] < height[i]) {
            const mid = st.pop();
            if (!st.length) break;
            res += (Math.min(height[st[st.length - 1]], height[i]) - height[mid]) * (i - st[st.length - 1] - 1);
        }
        st.push(i);
    }
    return res;
}

// ==================== 16. 滑动窗口最大值 ====================
function maxSlidingWindow(nums, k) {
    const dq = [], res = [];
    for (let i = 0; i < nums.length; i++) {
        while (dq.length && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
        dq.push(i);
        if (i >= k - 1) {
            while (dq[0] <= i - k) dq.shift();
            res.push(nums[dq[0]]);
        }
    }
    return res;
}

// ==================== 17. 前 K 个高频元素 ====================
function topKFrequent(nums, k) {
    const cnt = {};
    for (const x of nums) cnt[x] = (cnt[x] || 0) + 1;
    return Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, k).map(([v]) => +v);
}

// ==================== 18. 设计循环队列 ====================
class MyCircularQueue {
    constructor(k) { this.q = []; this.cap = k; }
    enQueue(v) { if (this.isFull()) return false; this.q.push(v); return true; }
    deQueue() { if (this.isEmpty()) return false; this.q.shift(); return true; }
    Front() { return this.isEmpty() ? -1 : this.q[0]; }
    Rear() { return this.isEmpty() ? -1 : this.q[this.q.length - 1]; }
    isEmpty() { return !this.q.length; }
    isFull() { return this.q.length >= this.cap; }
}

// ==================== 19. 设计循环双端队列 ====================
class MyCircularDeque {
    constructor(k) { this.q = []; this.cap = k; }
    insertFront(v) { if (this.isFull()) return false; this.q.unshift(v); return true; }
    insertLast(v) { if (this.isFull()) return false; this.q.push(v); return true; }
    deleteFront() { if (this.isEmpty()) return false; this.q.shift(); return true; }
    deleteLast() { if (this.isEmpty()) return false; this.q.pop(); return true; }
    getFront() { return this.isEmpty() ? -1 : this.q[0]; }
    getRear() { return this.isEmpty() ? -1 : this.q[this.q.length - 1]; }
    isEmpty() { return !this.q.length; }
    isFull() { return this.q.length >= this.cap; }
}

// ==================== 20. 验证栈序列 ====================
function validateStackSequences(pushed, popped) {
    const st = [];
    let j = 0;
    for (const x of pushed) {
        st.push(x);
        while (st.length && st[st.length - 1] === popped[j]) { st.pop(); j++; }
    }
    return !st.length;
}

// ==================== 测试 ====================
function test030701() {
    const assert = (n, a, e) => console.log(JSON.stringify(a) === JSON.stringify(e) ? `[OK] ${n}` : `[FAIL] ${n}`);
    assert('1', isValid('()[]{}'), true);
    assert('3', evalRPN(['2', '1', '+', '3', '*']), 9);
    assert('5', findTargetSumWays([1, 1, 1, 1, 1], 3), 5);
    assert('8', calculate2('3+2*2'), 7);
    assert('9', removeDuplicatesStr('abbaca'), 'ca');
    assert('10', decodeString('3[a]2[bc]'), 'aaabcbc');
    assert('11', dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]), [1, 1, 4, 2, 1, 1, 0, 0]);
    assert('12', nextGreaterElement([4, 1, 2], [1, 3, 4, 2]), [-1, 3, -1]);
    assert('16', maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);
    assert('17', topKFrequent([1, 1, 1, 2, 2, 3], 2), [1, 2]);
    assert('20', validateStackSequences([1, 2, 3, 4, 5], [4, 5, 3, 2, 1]), true);
    console.log('030701 tests done.');
}
test030701();
