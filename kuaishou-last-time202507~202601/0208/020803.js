/**
 * 020803 JS 面试代码题（20 道）
 * 日期：2026-02-08
 * 规则：仅题干与约束，个人完成后再补充解答与测试用例。
 */

// ==================== 1. 手写 call ====================
// myCall(thisArg, ...args)，在 thisArg 上调用函数并返回结果。可挂到 Function.prototype。

// 实现：
Function.prototype.myCall = function (thisArg, ...args) {
    const fn = this;
    const key = Symbol('call');
    const ctx = thisArg != null ? Object(thisArg) : globalThis;
    ctx[key] = fn;
    const res = ctx[key](...args);
    delete ctx[key];
    return res;
};


// ==================== 2. 手写 apply ====================
// myApply(thisArg, args)，args 为数组。可挂到 Function.prototype。

// 实现：
Function.prototype.myApply = function (thisArg, args = []) {
    const fn = this;
    const key = Symbol('apply');
    const ctx = thisArg != null ? Object(thisArg) : globalThis;
    ctx[key] = fn;
    const res = ctx[key](...args);
    delete ctx[key];
    return res;
};


// ==================== 3. 手写 instanceof ====================
// myInstanceof(obj, Constructor)，判断 obj 是否在 Constructor 的原型链上。

// 实现：
function myInstanceof(obj, Constructor) {
    if (obj == null || typeof obj !== 'object' && typeof obj !== 'function') return false;
    let proto = Object.getPrototypeOf(obj);
    const prototype = Constructor.prototype;
    while (proto) {
        if (proto === prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
    return false;
}

// ==================== 4. 手写 Array.prototype.reduce ====================
// myReduce(arr, fn, init)，fn(acc, cur, i, arr)。不改变原数组。

// 实现：
function myReduce(arr, fn, init) {
    if (arr.length === 0 && init === undefined) throw new TypeError('Reduce of empty array with no initial value');
    let accumulator = init !== undefined ? init : arr[0];
    for (let i = init !== undefined ? 0 : 1; i < arr.length; i++) {
        accumulator = fn(accumulator, arr[i], i, arr);
    }
    return accumulator;
}

// ==================== 5. 手写 Promise.all ====================
// myAll(promises)，全部 resolve 时返回 [v1,v2,...]，任一 reject 时整体 reject。传入空数组返回 Promise.resolve([])。

// 实现：
function myAll(promises) {
    if (promises.length === 0) return Promise.resolve([]);
    return new Promise((resolve, reject) => {
        let count = 0;
        const result = [];
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(res => {
                result[i] = res;
                if (++count === promises.length) resolve(result);
            }).catch(reject);
        }
    });
}

// ==================== 6. 手写 LRU 缓存 ====================
// 实现 LRUCache(capacity)，支持 get(key)、put(key, value)。超出容量时淘汰最近最少使用的项。get/put 都算「使用」。

// 实现：
function LRUCache(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
}
LRUCache.prototype.get = function(key) {
    if (!this.cache.has(key)) return undefined;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
}
LRUCache.prototype.put = function(key, value) {
    if (this.cache.has(key)) {
        this.cache.delete(key);
    }
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
        this.cache.delete(this.cache.keys().next().value);
    }
}
// ==================== 7. 手写 EventEmitter ====================
// 支持 on(event, fn)、off(event, fn)、emit(event, ...args)、once(event, fn)。

// 实现：
function EventEmitter() {
    this.events = {};
}
EventEmitter.prototype.on = function(event, fn) {
    if (!this.events[event]) {
        this.events[event] = [];
    }
    this.events[event].push(fn);
}
EventEmitter.prototype.off = function(event, fn) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(f => f !== fn);
}
EventEmitter.prototype.emit = function(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach(fn => fn.apply(this, args));
}
EventEmitter.prototype.once = function(event, fn) {
    const once = (...args) => {
        this.off(event, once);
        fn.apply(this, args);
    }
    this.on(event, once);
}
EventEmitter.prototype.toString = function() {
    return JSON.stringify(this.events);
}
// ==================== 8. 通用柯里化 ====================
// curry(fn)，使 fn(a,b,c) 可写成 curry(fn)(a)(b)(c) 或 curry(fn)(a,b)(c)。参数个数达到 fn 的 length 时执行。

// 实现：
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return function(...args2) {
            return curried.apply(this, args.concat(args2));
        }
    }
}

// ==================== 9. 手写 compose ====================
// compose(f, g, h)(x) === f(g(h(x)))。接收多个函数，返回组合后的函数。

// 实现：

function compose(...funcs) {
    return function(x) {
        return funcs.reduceRight((y, f) => f(y), x);
    }
}

// ==================== 10. 数组去重 ====================
// 实现 unique(arr)，返回去重后的新数组。至少写出两种写法（如 Set、filter+indexOf 等）。

// 实现：

function unique(arr) {
    return [...new Set(arr)];
}

function unique2(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}


// ==================== 11. 手写 Object.create ====================
// myCreate(proto)，返回以 proto 为原型的空对象。不调用 Object.create。

// 实现：

function myCreate(proto) {
    function F() {}
    F.prototype = proto;
    return new F();
}

// ==================== 12. 手写 map ====================
// myMap(arr, fn)，fn(item, i, arr)，不改变原数组，返回新数组。

// 实现：

function myMap(arr, fn) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        result.push(fn(arr[i], i, arr));
    }
    return result;
}

// ==================== 13. 手写 Promise.race ====================
// myRace(promises)，任一 Promise  settled 时，整体以该结果 resolve/reject。

// 实现：
function myRace(promises) {
    return new Promise((resolve, reject) => {
        for (const p of promises) {
            Promise.resolve(p).then(resolve).catch(reject);
        }
    });
}

// ==================== 14. 扁平化并去重 ====================
// flatUnique(arr)，将嵌套数组扁平化并去重，返回数字升序数组。如 [1,[2,1],[3,2]] => [1,2,3]。

// 实现：
function flatUnique(arr) {
   let result = [];
   for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
        result.push(...flatUnique(arr[i]));
    } else {
        result.push(arr[i]);
    }
   }
   return [...new Set(result)].sort((a, b) => a - b);
}

// ==================== 15. 手写发布订阅 ====================
// PubSub：subscribe(event, fn)、publish(event, ...args)、unsubscribe(event, fn)。

// 实现：

class PubSub {
    constructor() {
        this.events = {};
    }
    subscribe(event, fn) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(fn);
    }
    publish(event, ...args) {
        if (!this.events[event]) return;
        this.events[event].forEach(fn => fn.apply(this, args));
    }
    unsubscribe(event, fn) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(f => f !== fn);
    }
}
// ==================== 16. 单例模式 ====================
// 实现 getSingleton(Constructor)，使多次调用返回同一个实例。如 const s = getSingleton(Foo); s === getSingleton(Foo)。

// 实现：

const _singletonCache = new Map();
function getSingleton(Constructor) {
    if (!_singletonCache.has(Constructor)) {
        _singletonCache.set(Constructor, new Constructor());
    }
    return _singletonCache.get(Constructor);
}

// ==================== 17. 手写 Promise（简化版） ====================
// 实现 MyPromise，支持 new MyPromise((resolve, reject) => {})，及 then(onFulfilled, onRejected)。仅需支持同步 resolve/reject 和 then 链式调用即可。

// 实现：

class MyPromise {
    constructor(executor) {
        this.state = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        const resolve = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.onFulfilledCallbacks.forEach(fn => fn());
            }
        };
        const reject = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        };
        try { executor(resolve, reject); } catch (e) { reject(e); }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
        onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e; };
        const p = new MyPromise((resolve, reject) => {
            const run = () => {
                try {
                    if (this.state === 'fulfilled') {
                        const x = onFulfilled(this.value);
                        resolve(x);
                    } else if (this.state === 'rejected') {
                        const x = onRejected(this.reason);
                        resolve(x);
                    } else {
                        this.onFulfilledCallbacks.push(() => run());
                        this.onRejectedCallbacks.push(() => run());
                    }
                } catch (e) { reject(e); }
            };
            run();
        });
        return p;
    }
}   
// ==================== 18. 树转扁平数组 ====================
// treeToFlat(tree, childrenKey)，将树形结构转为一维数组。childrenKey 默认为 'children'。

// 实现：

function treeToFlat(tree, childrenKey = 'children') {
    if (!tree) return [];
    const list = Array.isArray(tree) ? tree : [tree];
    const result = [];
    for (const node of list) {
        result.push(node);
        if (node[childrenKey]?.length) {
            result.push(...treeToFlat(node[childrenKey], childrenKey));
        }
    }
    return result;
}

// ==================== 19. 手写 带并发限制的请求调度 ====================
// limitRequest(urls, limit, fetchFn)，最多同时发起 limit 个请求，完成一个再补一个，全部完成后返回 [r1,r2,...]。

// 实现：

function limitRequest(urls, limit, fetchFn) {
    const result = new Array(urls.length);
    let idx = 0;
    const run = () => {
        if (idx >= urls.length) return Promise.resolve();
        const i = idx++;
        return Promise.resolve(fetchFn(urls[i]))
            .then(res => { result[i] = res; })
            .then(() => run());
    };
    const pool = Array(Math.min(limit, urls.length)).fill(null).map(() => run());
    return Promise.all(pool).then(() => result);
}

// ==================== 20. 手写 简易 reactive ====================
// reactive(obj)，返回代理对象，对属性读写做监听。实现 get/set 时 console.log 访问或修改的 key 即可（简化版）。

// 实现：

function reactive(obj) {
    return new Proxy(obj, {
        get(target, key) {
            console.log(`get ${key}`);
            return target[key];
        },
        set(target, key, value) {
            console.log(`set ${key} ${value}`);
            target[key] = value;
            return true;
        }
    });
}
