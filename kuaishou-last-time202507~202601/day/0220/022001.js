/**
 * 022001 面试算法题（20 道）- 专题：哈希与设计
 * 日期：2026-02-20
 * 规则：仅题干、输入输出与约束；个人完成后再补充解答与测试用例。
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 两数之和 ====================
// 题干：nums 和 target，返回两数下标使和等于 target，保证有唯一解。
// 输入：nums: number[], target: number
// 输出：number[]
// 约束：哈希表一次遍历

function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const need = target - nums[i];
        if (map.has(need)) return [map.get(need), i];
        map.set(nums[i], i);
    }
    return [];
}

// ==================== 2. 三数之和 ====================
// 题干：nums，找出所有和为 0 的三元组，不重复。
// 输入：nums: number[]
// 输出：number[][]
// 约束：排序 + 双指针，去重

function threeSum(nums) {
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

// ==================== 3. 四数之和 ====================
// 题干：nums 和 target，找出所有和为 target 的四元组，不重复。
// 输入：nums: number[], target: number
// 输出：number[][]
// 约束：排序 + 双层循环 + 双指针

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
                    lo++; while (lo < hi && nums[lo] === nums[lo - 1]) lo++;
                    hi--; while (lo < hi && nums[hi] === nums[hi + 1]) hi--;
                } else if (sum < target) lo++;
                else hi--;
            }
        }
    }
    return res;
}

// ==================== 4. 最长连续序列 ====================
// 题干：未排序整数数组，找出最长连续数字序列的长度。
// 输入：nums: number[]
// 输出：number
// 约束：哈希集合 O(n)，以序列起点展开计数

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

// ==================== 5. 字母异位词分组 ====================
// 题干：字符串数组，将互为字母异位词的放同一组。
// 输入：strs: string[]
// 输出：string[][]
// 约束：哈希，key 为排序后字符串或字符计数编码

function groupAnagrams(strs) {
    const map = new Map();
    for (const s of strs) {
        const key = [...s].sort().join('');
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(s);
    }
    return [...map.values()];
}

// ==================== 6. 有效的字母异位词 ====================
// 题干：两字符串 s、t，判断是否为字母异位词。
// 输入：s: string, t: string
// 输出：boolean
// 约束：哈希计数或排序

function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    const cnt = {};
    for (const c of s) cnt[c] = (cnt[c] || 0) + 1;
    for (const c of t) { cnt[c] = (cnt[c] || 0) - 1; if (cnt[c] < 0) return false; }
    return true;
}

// ==================== 7. 重复的 DNA 序列 ====================
// 题干：DNA 序列只含 A/C/G/T，找出所有长度为 10 且出现超过 1 次的子串。
// 输入：s: string
// 输出：string[]
// 约束：哈希统计子串出现次数

function findRepeatedDnaSequences(s) {
    const map = new Map(), res = [];
    for (let i = 0; i + 10 <= s.length; i++) {
        const sub = s.slice(i, i + 10);
        map.set(sub, (map.get(sub) || 0) + 1);
        if (map.get(sub) === 2) res.push(sub);
    }
    return res;
}

// ==================== 8. 存在重复元素 II ====================
// 题干：nums 和 k，是否存在 i!=j 使 nums[i]==nums[j] 且 |i-j|<=k。
// 输入：nums: number[], k: number
// 输出：boolean
// 约束：哈希 + 滑动窗口思想

function containsNearbyDuplicate(nums, k) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        if (map.has(nums[i]) && i - map.get(nums[i]) <= k) return true;
        map.set(nums[i], i);
    }
    return false;
}

// ==================== 9. 快乐数 ====================
// 题干：n 各位平方和替换 n，重复直到 1 或循环。判断是否为快乐数。
// 输入：n: number
// 输出：boolean
// 约束：哈希记录已出现值或快慢指针

function isHappy(n) {
    const seen = new Set();
    while (n !== 1 && !seen.has(n)) {
        seen.add(n);
        let s = 0;
        while (n) { s += (n % 10) ** 2; n = (n / 10) | 0; }
        n = s;
    }
    return n === 1;
}

// ==================== 10. 同构字符串 ====================
// 题干：s、t 能否一一映射（双向），如 add->egg。
// 输入：s: string, t: string
// 输出：boolean
// 约束：哈希双向映射

function isIsomorphic(s, t) {
    if (s.length !== t.length) return false;
    const m1 = new Map(), m2 = new Map();
    for (let i = 0; i < s.length; i++) {
        if (m1.get(s[i]) !== m2.get(t[i])) return false;
        m1.set(s[i], i); m2.set(t[i], i);
    }
    return true;
}

// ==================== 11. LRU 缓存 ====================
// 题干：设计 LRU，get/put O(1)，capacity 满时淘汰最久未用。
// 输入：capacity，方法 get(key)、put(key,value)
// 输出：按调用返回
// 约束：HashMap + 双向链表

class LRUCache {
    constructor(capacity) { this.cap = capacity; this.map = new Map(); }
    get(key) {
        if (!this.map.has(key)) return -1;
        const v = this.map.get(key); this.map.delete(key); this.map.set(key, v);
        return v;
    }
    put(key, value) {
        if (this.map.has(key)) this.map.delete(key);
        this.map.set(key, value);
        if (this.map.size > this.cap) this.map.delete(this.map.keys().next().value);
    }
}

// ==================== 12. LFU 缓存 ====================
// 题干：设计 LFU，get/put O(1)，capacity 满时淘汰 freq 最小的，同 freq 淘汰最久未用。
// 输入：capacity，方法 get(key)、put(key,value)
// 输出：按调用返回
// 约束：HashMap + 多个双向链表按 freq 分组

class LFUCache {
    constructor(capacity) { this.cap = capacity; this.minF = 0; this.k2f = new Map(); this.k2v = new Map(); this.f2keys = new Map(); }
    _touch(key) {
        const f = this.k2f.get(key);
        const keys = this.f2keys.get(f); keys.delete(key); if (!keys.size) { this.f2keys.delete(f); if (f === this.minF) this.minF++; }
        const nf = f + 1; this.k2f.set(key, nf); if (!this.f2keys.has(nf)) this.f2keys.set(nf, new Set()); this.f2keys.get(nf).add(key);
    }
    get(key) {
        if (!this.k2v.has(key)) return -1;
        this._touch(key);
        return this.k2v.get(key);
    }
    put(key, value) {
        if (this.cap <= 0) return;
        if (this.k2v.has(key)) { this.k2v.set(key, value); this._touch(key); return; }
        if (this.k2v.size >= this.cap) {
            const keys = this.f2keys.get(this.minF);
            const evict = keys.values().next().value;
            keys.delete(evict); this.k2v.delete(evict); this.k2f.delete(evict);
        }
        this.k2v.set(key, value); this.k2f.set(key, 1); this.minF = 1;
        if (!this.f2keys.has(1)) this.f2keys.set(1, new Set()); this.f2keys.get(1).add(key);
    }
}

// ==================== 13. 设计哈希集合 ====================
// 题干：实现 MyHashSet，add、remove、contains O(1)。
// 输入：方法 add(key)、remove(key)、contains(key)
// 输出：按调用返回
// 约束：链地址法或数组

class MyHashSet {
    constructor() { this.BASE = 769; this.data = Array(this.BASE).fill(0).map(() => []); }
    _hash(key) { return key % this.BASE; }
    add(key) { const h = this._hash(key); if (this.data[h].indexOf(key) === -1) this.data[h].push(key); }
    remove(key) { const h = this._hash(key); const i = this.data[h].indexOf(key); if (i !== -1) this.data[h].splice(i, 1); }
    contains(key) { return this.data[this._hash(key)].indexOf(key) !== -1; }
}

// ==================== 14. 设计哈希映射 ====================
// 题干：实现 MyHashMap，put、get、remove O(1)。
// 输入：方法 put(key,value)、get(key)、remove(key)
// 输出：按调用返回
// 约束：链地址法

class MyHashMap {
    constructor() { this.BASE = 769; this.data = Array(this.BASE).fill(0).map(() => []); }
    _hash(key) { return key % this.BASE; }
    put(key, value) {
        const h = this._hash(key);
        const bucket = this.data[h];
        for (const p of bucket) if (p[0] === key) { p[1] = value; return; }
        bucket.push([key, value]);
    }
    get(key) {
        const bucket = this.data[this._hash(key)];
        for (const [k, v] of bucket) if (k === key) return v;
        return -1;
    }
    remove(key) {
        const h = this._hash(key), bucket = this.data[h];
        for (let i = 0; i < bucket.length; i++) if (bucket[i][0] === key) { bucket.splice(i, 1); return; }
    }
}

// ==================== 15. 最小栈 ====================
// 题干：支持 push、pop、top、getMin，getMin O(1)。
// 输入：方法 push、pop、top、getMin
// 输出：按调用返回
// 约束：辅助栈存当前最小值

class MinStack0220 {
    constructor() { this.stk = []; this.minStk = []; }
    push(val) { this.stk.push(val); if (!this.minStk.length || val <= this.minStk[this.minStk.length - 1]) this.minStk.push(val); }
    pop() { const v = this.stk.pop(); if (v === this.minStk[this.minStk.length - 1]) this.minStk.pop(); return v; }
    top() { return this.stk[this.stk.length - 1]; }
    getMin() { return this.minStk[this.minStk.length - 1]; }
}

// ==================== 16. 用栈实现队列 ====================
// 题干：仅用栈实现队列，push、pop、peek、empty。
// 输入：方法 push、pop、peek、empty
// 输出：按调用返回
// 约束：双栈（输入栈 + 输出栈）

class MyQueue0220 {
    constructor() { this.in = []; this.out = []; }
    push(x) { this.in.push(x); }
    _pour() { while (this.in.length) this.out.push(this.in.pop()); }
    pop() { if (!this.out.length) this._pour(); return this.out.pop(); }
    peek() { if (!this.out.length) this._pour(); return this.out[this.out.length - 1]; }
    empty() { return !this.in.length && !this.out.length; }
}

// ==================== 17. 用队列实现栈 ====================
// 题干：仅用队列实现栈，push、pop、top、empty。
// 输入：方法 push、pop、top、empty
// 输出：按调用返回
// 约束：单队列或双队列

class MyStack0220 {
    constructor() { this.q = []; }
    push(x) { const n = this.q.length; this.q.push(x); for (let i = 0; i < n; i++) this.q.push(this.q.shift()); }
    pop() { return this.q.shift(); }
    top() { return this.q[0]; }
    empty() { return !this.q.length; }
}

// ==================== 18. 设计推特 ====================
// 题干：实现 Twitter：postTweet、getNewsFeed（关注人 + 自己最近 10 条）、follow、unfollow。
// 输入：方法 postTweet、getNewsFeed、follow、unfollow
// 输出：按调用返回
// 约束：哈希 + 多路归并或堆

class Twitter {
    constructor() { this.tweets = []; this.following = new Map(); }
    postTweet(userId, tweetId) { this.tweets.unshift({ userId, tweetId }); }
    getNewsFeed(userId) {
        const follow = this.following.get(userId) || new Set();
        follow.add(userId);
        const out = [];
        for (const t of this.tweets) { if (follow.has(t.userId) && out.length < 10) out.push(t.tweetId); }
        return out;
    }
    follow(followerId, followeeId) { if (!this.following.has(followerId)) this.following.set(followerId, new Set()); this.following.get(followerId).add(followeeId); }
    unfollow(followerId, followeeId) { this.following.get(followerId)?.delete(followeeId); }
}

// ==================== 19. 设计停车场系统 ====================
// 题干：三种车位 big、medium、small，addCar(carType) 返回是否可停，停一车占一车位。
// 输入：big、medium、small 数量，方法 addCar(carType)
// 输出：boolean
// 约束：简单计数

class ParkingSystem {
    constructor(big, medium, small) { this.slots = [0, big, medium, small]; }
    addCar(carType) { if (this.slots[carType] <= 0) return false; this.slots[carType]--; return true; }
}

// ==================== 20. 设计循环队列 ====================
// 题干：实现循环队列，enQueue、deQueue、Front、Rear、isEmpty、isFull。
// 输入：k 容量，方法 enQueue、deQueue、Front、Rear、isEmpty、isFull
// 输出：按调用返回
// 约束：数组或链表，避免假溢出

class MyCircularQueue0220 {
    constructor(k) { this.cap = k; this.arr = []; this.f = 0; this.r = 0; this.size = 0; }
    enQueue(val) { if (this.isFull()) return false; this.arr[this.r] = val; this.r = (this.r + 1) % this.cap; this.size++; return true; }
    deQueue() { if (this.isEmpty()) return false; this.f = (this.f + 1) % this.cap; this.size--; return true; }
    Front() { return this.isEmpty() ? -1 : this.arr[this.f]; }
    Rear() { return this.isEmpty() ? -1 : this.arr[(this.r - 1 + this.cap) % this.cap]; }
    isEmpty() { return this.size === 0; }
    isFull() { return this.size === this.cap; }
}
