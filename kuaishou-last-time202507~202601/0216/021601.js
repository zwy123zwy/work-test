/**
 * 021601 面试算法题（20 道）- 专题：栈与队列
 * 日期：2026-02-16
 * 规则：仅题干、输入输出与约束；个人完成后再补充解答与测试用例。
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 有效括号 ====================
// 题干：只含 '()[]{}' 的字符串 s，判断括号是否有效。
// 输入：s: string
// 输出：boolean
// 约束：栈

function isValid(s) {
    const stk = [];
    const map = { ')': '(', ']': '[', '}': '{' };
    for (const c of s) {
        if (map[c]) { if (!stk.length || stk.pop() !== map[c]) return false; }
        else stk.push(c);
    }
    return stk.length === 0;
}

// ==================== 2. 最小栈 ====================
// 题干：实现栈，支持 push、pop、top，getMin 在 O(1) 内返回最小元素。
// 输入：无
// 输出：MinStack 类
// 约束：辅助栈或单栈存差值

class MinStack {
    constructor() { this.stk = []; this.minStk = []; }
    push(val) {
        this.stk.push(val);
        if (!this.minStk.length || val <= this.minStk[this.minStk.length - 1]) this.minStk.push(val);
    }
    pop() {
        const v = this.stk.pop();
        if (v === this.minStk[this.minStk.length - 1]) this.minStk.pop();
        return v;
    }
    top() { return this.stk[this.stk.length - 1]; }
    getMin() { return this.minStk[this.minStk.length - 1]; }
}

// ==================== 3. 用栈实现队列 ====================
// 题干：仅用两个栈实现队列，支持 push、pop、peek、empty。
// 输入：无
// 输出：MyQueue 类
// 约束：in/out 双栈

class MyQueue {
    constructor() { this.in = []; this.out = []; }
    push(x) { this.in.push(x); }
    _pour() { while (this.in.length) this.out.push(this.in.pop()); }
    pop() { if (!this.out.length) this._pour(); return this.out.pop(); }
    peek() { if (!this.out.length) this._pour(); return this.out[this.out.length - 1]; }
    empty() { return !this.in.length && !this.out.length; }
}

// ==================== 4. 用队列实现栈 ====================
// 题干：仅用两个队列实现栈，支持 push、pop、top、empty。
// 输入：无
// 输出：MyStack 类
// 约束：每次 push 后倒腾使栈顶在队首

class MyStack {
    constructor() { this.q = []; }
    push(x) {
        const n = this.q.length;
        this.q.push(x);
        for (let i = 0; i < n; i++) this.q.push(this.q.shift());
    }
    pop() { return this.q.shift(); }
    top() { return this.q[0]; }
    empty() { return !this.q.length; }
}

// ==================== 5. 每日温度 ====================
// 题干：数组 temps[i] 为第 i 天气温，返回数组 ans，ans[i] 为第 i 天需等几天才有更高温度，无则 0。
// 输入：temperatures: number[]
// 输出：number[]
// 约束：单调栈

function dailyTemperatures(temperatures) {
    const stk = [], ans = new Array(temperatures.length).fill(0);
    for (let i = 0; i < temperatures.length; i++) {
        while (stk.length && temperatures[stk[stk.length - 1]] < temperatures[i]) {
            const j = stk.pop();
            ans[j] = i - j;
        }
        stk.push(i);
    }
    return ans;
}

// ==================== 6. 下一个更大元素 I ====================
// 题干：nums1 是 nums2 的子集。对 nums1 中每个 x，在 nums2 中找 x 右侧第一个更大元素，无则 -1。
// 输入：nums1: number[], nums2: number[]
// 输出：number[]
// 约束：单调栈 + 哈希

function nextGreaterElement(nums1, nums2) {
    const stk = [], next = {};
    for (const x of nums2) {
        while (stk.length && stk[stk.length - 1] < x) next[stk.pop()] = x;
        stk.push(x);
    }
    return nums1.map(x => next[x] ?? -1);
}

// ==================== 7. 下一个更大元素 II ====================
// 题干：循环数组 nums，对每个元素找其右侧（含循环）第一个更大元素，无则 -1。
// 输入：nums: number[]
// 输出：number[]
// 约束：单调栈，数组复制一份或取模

function nextGreaterElements(nums) {
    const n = nums.length, ans = new Array(n).fill(-1), stk = [];
    for (let i = 0; i < 2 * n; i++) {
        const j = i % n;
        while (stk.length && nums[stk[stk.length - 1]] < nums[j]) ans[stk.pop()] = nums[j];
        stk.push(j);
    }
    return ans;
}

// ==================== 8. 柱状图中最大的矩形 ====================
// 题干：n 个非负整数表示柱高，求柱状图中能勾勒出的最大矩形面积。
// 输入：heights: number[]
// 输出：number
// 约束：单调栈，以每根柱为高的最大矩形

function largestRectangleArea(heights) {
    const stk = [];
    let max = 0;
    heights.push(0);
    for (let i = 0; i < heights.length; i++) {
        while (stk.length && heights[stk[stk.length - 1]] > heights[i]) {
            const h = heights[stk.pop()];
            const w = stk.length ? i - stk[stk.length - 1] - 1 : i;
            max = Math.max(max, h * w);
        }
        stk.push(i);
    }
    heights.pop();
    return max;
}

// ==================== 9. 滑动窗口最大值 ====================
// 题干：数组 nums 和 k，返回每个大小为 k 的滑动窗口的最大值组成的数组。
// 输入：nums: number[], k: number
// 输出：number[]
// 约束：单调队列，O(n)

function maxSlidingWindow(nums, k) {
    const q = [];
    const res = [];
    for (let i = 0; i < nums.length; i++) {
        while (q.length && nums[q[q.length - 1]] <= nums[i]) q.pop();
        q.push(i);
        if (q[0] <= i - k) q.shift();
        if (i >= k - 1) res.push(nums[q[0]]);
    }
    return res;
}

// ==================== 10. 逆波兰表达式求值 ====================
// 题干：有效逆波兰表达式 tokens（如 ["2","1","+","3","*"]），求值。
// 输入：tokens: string[]
// 输出：number
// 约束：栈，遇运算符弹出两数运算

function evalRPN(tokens) {
    const stk = [];
    for (const t of tokens) {
        if (['+', '-', '*', '/'].includes(t)) {
            const b = stk.pop(), a = stk.pop();
            stk.push(t === '+' ? a + b : t === '-' ? a - b : t === '*' ? a * b : (a / b) | 0);
        } else stk.push(Number(t));
    }
    return stk[0];
}

// ==================== 11. 基本计算器 I ====================
// 题干：字符串 s 含数字、'+'、'-'、'('、')'、空格，实现基本计算器，返回结果。
// 输入：s: string
// 输出：number
// 约束：栈处理括号，或符号栈 + 数字栈

function calculate1(s) {
    let i = 0, sign = 1, num = 0, stk = [0];
    const next = () => { while (s[i] === ' ') i++; return i < s.length ? s[i++] : ''; };
    const readNum = () => {
        let n = '';
        while (/[0-9]/.test(s[i])) n += s[i++];
        return Number(n) || 0;
    };
    while (i < s.length) {
        const c = next();
        if (c === '') break;
        if (c === '(') stk.push(sign), sign = 1;
        else if (c === ')') num = stk.pop() * num + stk.pop(), sign = 1;
        else if (c === '+') stk.push(stk.pop() + sign * num), num = 0, sign = 1;
        else if (c === '-') stk.push(stk.pop() + sign * num), num = 0, sign = -1;
        else { i--; num = readNum(); }
    }
    return stk.pop() + sign * num;
}

// ==================== 12. 基本计算器 II ====================
// 题干：字符串 s 含数字、'+'、'-'、'*'、'/'、空格，无括号，实现计算器。
// 输入：s: string
// 输出：number
// 约束：栈或单遍扫描处理乘除优先

function calculate2(s) {
    let num = 0, op = '+', stk = [];
    for (let i = 0; i <= s.length; i++) {
        const c = s[i];
        if (c === ' ') continue;
        if (/\d/.test(c)) { num = num * 10 + Number(c); continue; }
        if (op === '+') stk.push(num);
        else if (op === '-') stk.push(-num);
        else if (op === '*') stk.push(stk.pop() * num);
        else if (op === '/') stk.push((stk.pop() / num) | 0);
        op = c; num = 0;
    }
    return stk.reduce((a, b) => a + b, 0);
}

// ==================== 13. 验证栈序列 ====================
// 题干：pushed、popped 为 1~n 的排列，判断 pushed 入栈后能否按 popped 顺序出栈。
// 输入：pushed: number[], popped: number[]
// 输出：boolean
// 约束：模拟栈

function validateStackSequences(pushed, popped) {
    const stk = [];
    let j = 0;
    for (const x of pushed) {
        stk.push(x);
        while (stk.length && stk[stk.length - 1] === popped[j]) stk.pop(), j++;
    }
    return j === popped.length;
}

// ==================== 14. 删除相邻重复项 ====================
// 题干：字符串 s，反复删除相邻重复项，直到无法删除，返回最终字符串。
// 输入：s: string
// 输出：string
// 约束：栈模拟

function removeDuplicates(s) {
    const stk = [];
    for (const c of s) {
        if (stk.length && stk[stk.length - 1] === c) stk.pop();
        else stk.push(c);
    }
    return stk.join('');
}

// ==================== 15. 字符串解码 ====================
// 题干：如 "3[a2[c]]" 解码为 "accaccacc"。k[encoded_string] 表示重复 k 次。
// 输入：s: string
// 输出：string
// 约束：栈，遇 ] 弹出直到 [ 再处理数字

function decodeString(s) {
    const stk = [];
    for (const c of s) {
        if (c !== ']') { stk.push(c); continue; }
        let sub = '';
        while (stk[stk.length - 1] !== '[') sub = stk.pop() + sub;
        stk.pop();
        let k = '';
        while (stk.length && /\d/.test(stk[stk.length - 1])) k = stk.pop() + k;
        stk.push(sub.repeat(Number(k) || 1));
    }
    return stk.join('');
}

// ==================== 16. 接雨水（单调栈解法） ====================
// 题干：n 个非负整数表示柱高，求能接的雨水量。
// 输入：height: number[]
// 输出：number
// 约束：单调栈（与双指针不同思路）

function trap(height) {
    const stk = [];
    let sum = 0;
    for (let i = 0; i < height.length; i++) {
        while (stk.length && height[stk[stk.length - 1]] < height[i]) {
            const mid = stk.pop();
            if (!stk.length) break;
            const left = stk[stk.length - 1];
            sum += (Math.min(height[left], height[i]) - height[mid]) * (i - left - 1);
        }
        stk.push(i);
    }
    return sum;
}

// ==================== 17. 设计循环队列 ====================
// 题干：设计循环队列，支持 enQueue、deQueue、Front、Rear、isEmpty、isFull。容量 k。
// 输入：k: number
// 输出：MyCircularQueue 类
// 约束：数组 + front/rear 指针

class MyCircularQueue {
    constructor(k) { this.cap = k; this.arr = []; this.f = 0; this.r = 0; this.size = 0; }
    enQueue(val) {
        if (this.isFull()) return false;
        this.arr[this.r] = val; this.r = (this.r + 1) % this.cap; this.size++;
        return true;
    }
    deQueue() { if (this.isEmpty()) return false; this.f = (this.f + 1) % this.cap; this.size--; return true; }
    Front() { return this.isEmpty() ? -1 : this.arr[this.f]; }
    Rear() { return this.isEmpty() ? -1 : this.arr[(this.r - 1 + this.cap) % this.cap]; }
    isEmpty() { return this.size === 0; }
    isFull() { return this.size === this.cap; }
}

// ==================== 18. 设计循环双端队列 ====================
// 题干：设计循环双端队列，支持 insertFront、insertLast、deleteFront、deleteLast、getFront、getRear、isEmpty、isFull。
// 输入：k: number
// 输出：MyCircularDeque 类
// 约束：数组循环

class MyCircularDeque {
    constructor(k) { this.cap = k; this.arr = []; this.f = 0; this.r = 0; this.size = 0; }
    insertFront(val) {
        if (this.isFull()) return false;
        this.f = (this.f - 1 + this.cap) % this.cap;
        this.arr[this.f] = val; this.size++; return true;
    }
    insertLast(val) {
        if (this.isFull()) return false;
        this.arr[this.r] = val; this.r = (this.r + 1) % this.cap; this.size++; return true;
    }
    deleteFront() { if (this.isEmpty()) return false; this.f = (this.f + 1) % this.cap; this.size--; return true; }
    deleteLast() { if (this.isEmpty()) return false; this.r = (this.r - 1 + this.cap) % this.cap; this.size--; return true; }
    getFront() { return this.isEmpty() ? -1 : this.arr[this.f]; }
    getRear() { return this.isEmpty() ? -1 : this.arr[(this.r - 1 + this.cap) % this.cap]; }
    isEmpty() { return this.size === 0; }
    isFull() { return this.size === this.cap; }
}

// ==================== 19. 最大频率栈 ====================
// 题干：支持 push、pop。pop 返回栈中出现频率最高的元素；频率相同时返回最靠近栈顶的。
// 输入：无
// 输出：FreqStack 类
// 约束：哈希 + 按频率分桶（栈的栈）

class FreqStack {
    constructor() { this.freq = new Map(); this.stackOfStacks = []; }
    push(val) {
        const f = (this.freq.get(val) || 0) + 1;
        this.freq.set(val, f);
        if (f > this.stackOfStacks.length) this.stackOfStacks.push([]);
        this.stackOfStacks[f - 1].push(val);
    }
    pop() {
        const stk = this.stackOfStacks[this.stackOfStacks.length - 1];
        const val = stk.pop();
        if (!stk.length) this.stackOfStacks.pop();
        this.freq.set(val, this.freq.get(val) - 1);
        return val;
    }
}

// ==================== 20. 去除重复字母 ====================
// 题干：字符串 s，去重并保证字典序最小，且保留每个字符至少一次。
// 输入：s: string
// 输出：string
// 约束：单调栈 + 计数

function removeDuplicateLetters(s) {
    const cnt = {};
    for (const c of s) cnt[c] = (cnt[c] || 0) + 1;
    const stk = [], inStk = new Set();
    for (const c of s) {
        cnt[c]--;
        if (inStk.has(c)) continue;
        while (stk.length && stk[stk.length - 1] > c && cnt[stk[stk.length - 1]] > 0)
            inStk.delete(stk.pop());
        stk.push(c); inStk.add(c);
    }
    return stk.join('');
}
