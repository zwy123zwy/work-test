class Scheduler {
    constructor(limit) {
        this.limit = limit;
        this.count = 0; // 当前正在运行的任务数
        this.queue = []; // 等待队列
    }

    add(promiseCreator) {
        // 1. add 返回一个 Promise，让外部可以 await
        return new Promise((resolve, reject) => {
            // 2. 将任务本身的执行逻辑 + resolve/reject 权柄推入队列
            this.queue.push({
                creator: promiseCreator,
                resolve,
                reject
            });

            // 3. 尝试运行
            this.run();
        });
    }

    run() {
        // 4. 边界判断：如果并发满了，或者队列空了，直接停止
        if (this.count >= this.limit || this.queue.length === 0) {
            return;
        }

        // 5. 取出任务
        const task = this.queue.shift();
        this.count++;

        // 6. 执行任务
        // 注意：task.creator() 可能报错，也可能不返回 Promise，用 Promise.resolve 包一层最稳妥
        Promise.resolve(task.creator())
            .then(res => {
                // 任务成功，把结果还给当初调用 add 的人
                task.resolve(res);
            })
            .catch(err => {
                // 任务失败，抛出错误
                task.reject(err);
            })
            .finally(() => {
                // 7. 任务结束，释放计数，并触发下一轮调度
                this.count--;
                this.run();
            });
    }
}

// 请求重试与指数退避 (Retry with Backoff)

// 题目：实现一个 request 函数，支持出错重试。
// 参数：fetcher (函数), maxRetries (最大重试次数).
// 要求：重试间隔必须遵循“指数退避”策略（如：1s, 2s, 4s, 8s...），不能死循环。

function request(fetcher, maxRetries) {
    return new Promise((resolve, reject) => {
        let retries = 0;
        const tryRequest = () => {
            fetcher()
                .then(resolve)
                .catch(err => {
                    if (retries < maxRetries) {
                        retries++;
                        const delay = Math.pow(2, retries);
                        setTimeout(tryRequest, delay * 1000);
                    } else {
                        reject(err);
                    }
                })
        }
        tryRequest();
    })
}


// 洋葱模型中间件 (Koa-like Middleware)

// 题目：实现一个 compose 函数。
// 输入：[fn1, fn2, fn3]，其中 fn 格式为 async (ctx, next) => { ... }。
// 输出：一个可以直接调用的函数，执行顺序类似 Koa 的洋葱模型（外->内->外）。
// 考察点：高阶函数、递归、Promise 链式调用、中间件模式。
// 难度：⭐⭐⭐⭐⭐
// 关联：直接对应你简历中的“拦截器”逻辑。P7必须能手写这个，不能只用库。

function compose(middlewares) {
    if (!Array.isArray(middlewares)) {
        throw new TypeError('Middleware stack must be an array!');
    }
    return function (ctx) {
        function dispatch(i) {
            if (i >= middlewares.length) return Promise.resolve();
            const fn = middlewares[i];
            return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
        }
        return dispatch(0);
    }
}

// 发布订阅模式 (Event Emitter) 的进阶版

// 题目：实现 EventEmitter。
// 要求：支持 on, emit, off, once。
// 进阶要求：支持 namespace（如 emit('scope:event')）或支持“先发布后订阅”（缓存历史消息）。
// 考察点：设计模式、闭包、内存泄漏防范（off 的实现细节）。

class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(...args));
        }
    }

    off(event, listener) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(l => l !== listener);
        }
    }

    once(event, listener) {
        const onceListener = (...args) => {
            listener(...args);
            this.off(event, onceListener);
        };
        this.on(event, onceListener);
    }
}


// 虚拟列表 (Virtual List) 的核心计算

// 题目：给定一个包含 10万条数据的数组，容器高度 containerHeight，每一项高度不定（但可以通过 item.height 获取）。
// 请写出计算 startIndex（可视区域第一项索引）和 renderList（当前需要渲染的列表）的函数。
// 要求：能够处理滚动时的 scrollTop 变化。


function calculateVisibleItems(data, containerHeight, scrollTop) {
    let totalHeight = 0;
    let startIndex = 0;
    let endIndex = data.length - 1;

    // 计算 startIndex
    for (let i = 0; i < data.length; i++) {
        if (totalHeight + data[i].height > scrollTop) {
            startIndex = i;
            break;
        }
        totalHeight += data[i].height;
    }
    // 计算 endIndex
    totalHeight = 0;
    for (let i = startIndex; i < data.length; i++) {
        totalHeight += data[i].height;
        if (totalHeight >= containerHeight) {
            endIndex = i;
            break;
        }
    }

    const renderList = data.slice(startIndex, endIndex + 1);
    return { startIndex, renderList };
}


// LRU 缓存算法 (Least Recently Used)
// 题目：实现一个 LRUCache 类，包含 get 和 put 方法。当缓存满时，优先删除最久未使用的数据。
// 要求：get 和 put 的时间复杂度必须是 O(1)。
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) {
            return -1;
        }
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }

    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        this.cache.set(key, value);
        if (this.cache.size > this.capacity) {
            this.cache.delete(this.cache.keys().next().value);
        }
    }
}


// 扁平数组转树形结构 (Array to Tree)

// 题目：后端返回一个扁平数组 [{id:1, pid:0}, {id:2, pid:1}, ...]，请将其转换为嵌套的 Tree 结构。
// 要求：时间复杂度为 O(n)，不能使用双重循环。
// 考察点：对象引用（Pointer）、哈希映射（Map）的使用技巧。

function arrayToTree(items) {
    const map = {};
    const tree = [];

    items.forEach(item => {
        map[item.id] = { ...item, children: [] };
    });

    items.forEach(item => {
        if (item.pid === 0) {
            tree.push(map[item.id]);
        } else {
            if (map[item.pid]) {
                map[item.pid].children.push(map[item.id]);
            }
        }
    });

    return tree;
}

// 深度克隆 (Deep Clone) 考虑循环引用

// 题目：实现 deepClone。
// 要求1：支持基本类型、对象、数组。
// 要求2：解决循环引用问题（对象 A 引用了 A 本身，不能死循环）。
// 要求3：能够处理 Date 和 RegExp 类型。
// 考察点：递归、WeakMap 的应用、类型判断的严谨性。

function deepClone(obj, hash = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj);
    }

    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }

    if (hash.has(obj)) {
        return hash.get(obj);
    }

    const cloneObj = Array.isArray(obj) ? [] : {};
    hash.set(obj, cloneObj);

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloneObj[key] = deepClone(obj[key], hash);
        }
    }

    return cloneObj;
}

Promise.myAll = function (promises) {
    return new Promise((resolve, reject) => {
        // 边界判断：传入的必须是数组（或可迭代对象）
        if (!Array.isArray(promises)) {
            return reject(new TypeError('Argument must be an array'));
        }

        let result = [];
        let count = 0;
        const len = promises.length;

        if (len === 0) {
            return resolve([]);
        }

        promises.forEach((p, index) => {
            // P7 细节：用 Promise.resolve 包裹，防止数组里有非 Promise 值（如数字、字符串）
            Promise.resolve(p).then(res => {
                result[index] = res; // 保证结果顺序与请求顺序一致
                count++;
                if (count === len) {
                    resolve(result);
                }
            }).catch(err => {
                reject(err); // 只要有一个错，直接挂掉
            });
        });
    });
};

Promise.myRace = function (promises) {
    return new Promise((resolve, reject) => {
        // 边界判断：传入的必须是数组（或可迭代对象）
        if (!Array.isArray(promises)) {
            return reject(new TypeError('Argument must be an array'));
        }

        promises.forEach(p => {
            // P7 细节：用 Promise.resolve 包裹，防止数组里有非 Promise 值（如数字、字符串）
            Promise.resolve(p).then(res => {
                resolve(res); // 只要有一个成功，就返回结果
            }).catch(err => {
                reject(err); // 只要有一个失败，就返回错误
            });
        });
    });
}

// console.log(1); //1

// setTimeout(() => {
//     console.log(2);
// }, 0);

// Promise.resolve().then(() => {
//     console.log(3); // a1
// }).then(() => {
//     console.log(4);
// });

// async function async1() {
//     console.log(5); //2 
//     await async2(); // a2
//     console.log(6);
// }

// async function async2() {
//     console.log(7); //3
// }

// async1();
// console.log(8); // 4

function foo() {
    console.log(this.a);
}

function doFoo() {
    foo();
}

var obj = {
    a: 1,
    doFoo: doFoo
};

var a = 2;
obj.doFoo()
