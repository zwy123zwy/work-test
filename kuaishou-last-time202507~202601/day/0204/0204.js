// ==================== 1. 两数之和 ====================
// 题目描述：给定整数数组 nums 和目标值 target，找出和为目标值的两个整数下标。
// 假设每个输入只对应一个答案，且同一元素不能重复使用。

function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]


// ==================== 2. 有效的括号 ====================
// 题目描述：给定只包含 '(){}[]' 的字符串，判断括号是否有效闭合。

function isValid(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (const c of s) {
        if (map[c]) {
            if (stack.pop() !== map[c]) return false;
        } else {
            stack.push(c);
        }
    }
    return stack.length === 0;
}
console.log(isValid('()[]{}')); // true
console.log(isValid('([)]'));   // false


// ==================== 3. 合并两个有序数组 ====================
// 题目描述：将两个升序数组合并为一个升序数组，不额外开辟空间时 nums1 有足够空间。

function merge(nums1, m, nums2, n) {
    let i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) {
        nums1[k--] = (i >= 0 && nums1[i] > nums2[j]) ? nums1[i--] : nums2[j--];
    }
    return nums1;
}


// ==================== 4. 反转链表 ====================
// 题目描述：反转单链表，返回新头节点。

function reverseList(head) {
    let prev = null;
    while (head) {
        const next = head.next;
        head.next = prev;
        prev = head;
        head = next;
    }
    return prev;
}


// ==================== 5. 深拷贝 ====================
// 题目描述：实现深拷贝，处理对象、数组、Date、RegExp 及循环引用。

function deepClone(obj, cache = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (cache.has(obj)) return cache.get(obj);
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);
    const clone = Array.isArray(obj) ? [] : {};
    cache.set(obj, clone);
    for (const k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
            clone[k] = deepClone(obj[k], cache);
        }
    }
    return clone;
}


// ==================== 6. 防抖 ====================
// 题目描述：实现 debounce(fn, delay)，连续调用时仅最后一次 delay 后执行。

function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}


// ==================== 7. 节流 ====================
// 题目描述：实现 throttle(fn, delay)，在 delay 内最多执行一次。

function throttle(fn, delay) {
    let last = 0;
    return function (...args) {
        const now = Date.now();
        if (now - last >= delay) {
            last = now;
            fn.apply(this, args);
        }
    };
}


// ==================== 8. 数组扁平化 ====================
// 题目描述：将多层嵌套数组扁平化为一层。

function flatten(arr) {
    return arr.reduce((acc, cur) =>
        acc.concat(Array.isArray(cur) ? flatten(cur) : cur), []);
}
console.log(flatten([1, [2, [3, 4]]])); // [1, 2, 3, 4]


// ==================== 9. 数组去重 ====================
// 题目描述：数组去重，支持对象等引用类型。

function unique(arr) {
    return [...new Set(arr)];
}
// 对象去重可用 Map 存 key
function uniqueByKey(arr, key) {
    const seen = new Set();
    return arr.filter(item => {
        const k = key ? item[key] : JSON.stringify(item);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
    });
}


// ==================== 10. Promise.all ====================
// 题目描述：手写 Promise.all，全部成功才 resolve，一个失败则 reject。

Promise.myAll = function (promises) {
    return new Promise((resolve, reject) => {
        const results = [];
        let count = 0;
        if (promises.length === 0) return resolve(results);
        promises.forEach((p, i) => {
            Promise.resolve(p).then(
                val => { results[i] = val; if (++count === promises.length) resolve(results); },
                reject
            );
        });
    });
};


// ==================== 11. instanceof ====================
// 题目描述：手写 instanceof，判断对象是否是构造函数的实例。

function myInstanceof(obj, Constructor) {
    if (obj == null || typeof obj !== 'object') return false;
    let proto = Object.getPrototypeOf(obj);
    while (proto) {
        if (proto === Constructor.prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
    return false;
}


// ==================== 12. call / apply ====================
// 题目描述：手写 call 和 apply。

Function.prototype.myCall = function (ctx, ...args) {
    ctx = ctx ?? globalThis;
    const fn = Symbol();
    ctx[fn] = this;
    const res = ctx[fn](...args);
    delete ctx[fn];
    return res;
};
Function.prototype.myApply = function (ctx, args = []) {
    return this.myCall(ctx, ...args);
};


// ==================== 13. 二叉树最大深度 ====================
// 题目描述：给定二叉树根节点，返回最大深度。

function maxDepth(root) {
    if (!root) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}


// ==================== 14. 二分查找 ====================
// 题目描述：在升序数组中找到 target 的下标，不存在返回 -1。

function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        const mid = (left + right) >> 1;
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}


// ==================== 15. 无重复字符的最长子串 ====================
// 题目描述：给定字符串，找出不含重复字符的最长子串长度。

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
console.log(lengthOfLongestSubstring('abcabcbb')); // 3


// ==================== 16. 手写 new ====================
// 题目描述：手写 new 操作符。

function myNew(Constructor, ...args) {
    const obj = Object.create(Constructor.prototype);
    const res = Constructor.apply(obj, args);
    return (res && typeof res === 'object') ? res : obj;
}


// ==================== 17. 柯里化 ====================
// 题目描述：实现 curry(fn)，支持多参数分次传入。

function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) return fn.apply(this, args);
        return (...more) => curried.apply(this, args.concat(more));
    };
}
const add = (a, b, c) => a + b + c;
console.log(curry(add)(1)(2)(3)); // 6


// ==================== 18. 发布订阅 EventEmitter ====================
// 题目描述：实现 on、emit、off 的简易事件总线。

class EventEmitter {
    constructor() { this.events = {}; }
    on(event, cb) {
        (this.events[event] ??= []).push(cb);
    }
    emit(event, ...args) {
        (this.events[event] || []).forEach(cb => cb(...args));
    }
    off(event, cb) {
        if (!cb) delete this.events[event];
        else this.events[event] = (this.events[event] || []).filter(f => f !== cb);
    }
}


// ==================== 19. LRU 缓存 ====================
// 题目描述：实现 LRU 缓存，get/put 为 O(1)，容量超出时淘汰最久未用。

class LRUCache {
    constructor(capacity) {
        this.cap = capacity;
        this.map = new Map();
    }
    get(key) {
        if (!this.map.has(key)) return -1;
        const v = this.map.get(key);
        this.map.delete(key);
        this.map.set(key, v);
        return v;
    }
    put(key, value) {
        if (this.map.has(key)) this.map.delete(key);
        this.map.set(key, value);
        if (this.map.size > this.cap) this.map.delete(this.map.keys().next().value);
    }
}


// ==================== 20. 判断循环引用 ====================
// 题目描述：检测对象是否存在循环引用。

function hasCircularRef(obj, seen = new WeakSet()) {
    if (obj === null || typeof obj !== 'object') return false;
    if (seen.has(obj)) return true;
    seen.add(obj);
    for (const k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k) && hasCircularRef(obj[k], seen)) {
            return true;
        }
    }
    return false;
}
const a = {}; a.self = a;
console.log(hasCircularRef(a)); // true
