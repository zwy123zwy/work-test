// 滴滴常见面试代码题 - 20道

// 1. 手写 call
Function.prototype.myCall = function (context, ...args) {
    context = context || window;
    const fn = Symbol('fn');
    context[fn] = this;
    const result = context[fn](...args);
    delete context[fn];
    return result;
};

// 2. 手写 apply
Function.prototype.myApply = function (context, args) {
    context = context || window;
    const fn = Symbol('fn');
    context[fn] = this;
    const result = context[fn](...args);
    delete context[fn];
    return result;
};

// 3. 手写 bind
Function.prototype.myBind = function (context, ...args) {
    const fn = this;
    return function F(...newArgs) {
        if (this instanceof F) {
            return new fn(...args, ...newArgs);
        }
        return fn.apply(context, [...args, ...newArgs]);
    };
};

// 4. 防抖 debounce
function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// 5. 节流 throttle
function throttle(fn, delay) {
    let lastTime = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastTime >= delay) {
            fn.apply(this, args);
            lastTime = now;
        }
    };
}

// 6. 柯里化 curry
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return function (...newArgs) {
            return curried.apply(this, [...args, ...newArgs]);
        };
    };
}

// 7. 函数组合 compose（从右到左）
function compose(...fns) {
    return function (x) {
        return fns.reduceRight((acc, fn) => fn(acc), x);
    };
}

// 8. 发布订阅 EventEmitter
class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(event, listener) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(listener);
        return this;
    }
    off(event, listener) {
        if (!this.events[event]) return this;
        this.events[event] = this.events[event].filter(l => l !== listener);
        return this;
    }
    emit(event, ...args) {
        if (!this.events[event]) return false;
        this.events[event].forEach(l => l(...args));
        return true;
    }
    once(event, listener) {
        const wrapper = (...args) => {
            listener(...args);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
        return this;
    }
}

// 9. LRU 缓存
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }
    get(key) {
        if (!this.cache.has(key)) return -1;
        const val = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, val);
        return val;
    }
    put(key, value) {
        if (this.cache.has(key)) this.cache.delete(key);
        else if (this.cache.size >= this.capacity) {
            this.cache.delete(this.cache.keys().next().value);
        }
        this.cache.set(key, value);
    }
}

// 10. Promise 重试 retry
function retry(fn, times, delay = 0) {
    return new Promise((resolve, reject) => {
        function attempt(remaining) {
            fn().then(resolve).catch(err => {
                if (remaining <= 1) return reject(err);
                setTimeout(() => attempt(remaining - 1), delay);
            });
        }
        attempt(times);
    });
}

// 11. Promise 超时控制 timeout
function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), ms)
    );
    return Promise.race([promise, timeout]);
}

// 12. 并发请求控制（限制同时进行的请求数）
function concurrentRequest(urls, maxConcurrent) {
    return new Promise((resolve) => {
        const results = [];
        let index = 0;
        let finished = 0;

        function next() {
            if (index >= urls.length) return;
            const i = index++;
            fetch(urls[i])
                .then(res => res.json())
                .catch(err => err)
                .then(data => {
                    results[i] = data;
                    finished++;
                    if (finished === urls.length) resolve(results);
                    else next();
                });
        }

        for (let i = 0; i < Math.min(maxConcurrent, urls.length); i++) {
            next();
        }
    });
}

// 13. 数组扁平化 flatten（支持指定深度）
function flatten(arr, depth = 1) {
    if (depth === 0) return arr;
    return arr.reduce((acc, item) => {
        if (Array.isArray(item)) {
            return acc.concat(flatten(item, depth - 1));
        }
        return acc.concat(item);
    }, []);
}

// 14. 数组去重（多种方法）
function unique(arr) {
    // 方法1: Set
    // return [...new Set(arr)];

    // 方法2: filter + indexOf
    // return arr.filter((item, index) => arr.indexOf(item) === index);

    // 方法3: reduce
    return arr.reduce((acc, item) => {
        return acc.includes(item) ? acc : [...acc, item];
    }, []);
}

// 15. 数组分组 groupBy
function groupBy(arr, key) {
    return arr.reduce((acc, item) => {
        const group = typeof key === 'function' ? key(item) : item[key];
        if (!acc[group]) acc[group] = [];
        acc[group].push(item);
        return acc;
    }, {});
}

// 16. 对象扁平化
function flattenObject(obj, prefix = '', result = {}) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                flattenObject(obj[key], newKey, result);
            } else {
                result[newKey] = obj[key];
            }
        }
    }
    return result;
}

// 17. 字符串模板解析
function template(str, data) {
    return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] !== undefined ? data[key] : match;
    });
}

// 18. 虚拟列表核心逻辑（计算可见区域的起止索引）
function calcVisibleRange(scrollTop, containerHeight, itemHeight, total) {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount + 1, total);
    const offsetTop = startIndex * itemHeight;
    return { startIndex, endIndex, offsetTop };
}

// 19. 图片懒加载（IntersectionObserver 方案）
function lazyLoadImages() {
    const imgs = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                obs.unobserve(img);
            }
        });
    });
    imgs.forEach(img => observer.observe(img));
}

// 20. 深度比较两个对象是否相等
function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a !== 'object' || a === null || b === null) return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
        if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
        if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
}

// ========== 测试 ==========
async function runDaily03302Tests() {
    const assert = require('node:assert/strict');

    // 1/2/3 call/apply/bind
    function greet(greeting, mark) { return `${greeting}, ${this.name}${mark}`; }
    const ctx = { name: 'DiDi' };
    assert.equal(greet.myCall(ctx, 'Hello', '!'), 'Hello, DiDi!');
    assert.equal(greet.myApply(ctx, ['Hi', '~']), 'Hi, DiDi~');
    assert.equal(greet.myBind(ctx, 'Hey')('?'), 'Hey, DiDi?');

    // 4 debounce（同步验证调用次数）
    let count = 0;
    const debouncedFn = debounce(() => count++, 50);
    debouncedFn(); debouncedFn(); debouncedFn();
    await new Promise(r => setTimeout(r, 100));
    assert.equal(count, 1);

    // 5 throttle
    let tCount = 0;
    const throttledFn = throttle(() => tCount++, 50);
    throttledFn(); throttledFn();
    await new Promise(r => setTimeout(r, 60));
    throttledFn();
    assert.equal(tCount, 2);

    // 6 curry
    const add = (a, b, c) => a + b + c;
    const curriedAdd = curry(add);
    assert.equal(curriedAdd(1)(2)(3), 6);
    assert.equal(curriedAdd(1, 2)(3), 6);

    // 7 compose
    const double = x => x * 2;
    const addOne = x => x + 1;
    assert.equal(compose(double, addOne)(3), 8); // double(addOne(3)) = 8

    // 8 EventEmitter
    const ee = new EventEmitter();
    const log = [];
    ee.on('data', x => log.push(x));
    ee.once('data', x => log.push(`once:${x}`));
    ee.emit('data', 1);
    ee.emit('data', 2);
    assert.deepEqual(log, [1, 'once:1', 2]);

    // 9 LRU
    const lru = new LRUCache(2);
    lru.put(1, 'a'); lru.put(2, 'b');
    assert.equal(lru.get(1), 'a');
    lru.put(3, 'c');
    assert.equal(lru.get(2), -1); // 2 已被淘汰

    // 10 retry
    let attempts = 0;
    await retry(() => new Promise((res, rej) => {
        attempts++;
        attempts < 3 ? rej('fail') : res('ok');
    }), 3);
    assert.equal(attempts, 3);

    // 13 flatten
    assert.deepEqual(flatten([1, [2, [3, [4]]]], 2), [1, 2, 3, [4]]);

    // 14 unique
    assert.deepEqual(unique([1, 2, 1, 3, 2]), [1, 2, 3]);

    // 15 groupBy
    const grouped = groupBy([{ type: 'a', v: 1 }, { type: 'b', v: 2 }, { type: 'a', v: 3 }], 'type');
    assert.deepEqual(grouped.a.map(x => x.v), [1, 3]);

    // 16 flattenObject
    assert.deepEqual(flattenObject({ a: { b: { c: 1 } }, d: 2 }), { 'a.b.c': 1, d: 2 });

    // 17 template
    assert.equal(template('Hello, {{name}}!', { name: 'DiDi' }), 'Hello, DiDi!');

    // 18 calcVisibleRange
    const range = calcVisibleRange(200, 300, 50, 100);
    assert.equal(range.startIndex, 4);
    assert.equal(range.offsetTop, 200);

    // 20 deepEqual
    assert.equal(deepEqual({ a: [1, 2] }, { a: [1, 2] }), true);
    assert.equal(deepEqual({ a: 1 }, { a: 2 }), false);

    console.log('daily03302 tests passed');
}

if (require.main === module) {
    runDaily03302Tests().catch(err => {
        console.error(err);
        process.exitCode = 1;
    });
}
