// 异步任务调度器（贴合前端并发控制）
// 题目描述
// 实现异步任务调度器 Scheduler，限制最大并发数 max：
// add(promiseCreator)：添加异步任务（返回 Promise 的函数）；
// 任务按添加顺序执行，并发数不超过 max；
// 支持获取所有任务完成后的结果。

class Scheduler {
    constructor(max) {
        this.max = max;
        this.queue = [];
        this.running = 0;
        this.result = [];
    }

    add(task) {
        return new Promise((resolve, reject) => {
            const runTask = () => {
                this.running++;
                task()
                    .then((value) => {
                        this.running--;
                        this.result.push(value);
                        resolve(value);
                        this.runNext();
                    })
                    .catch((err) => {
                        this.running--;
                        reject(err);
                        this.runNext();
                    });
            };

            if (this.running < this.max) {
                runTask();
            } else {
                this.queue.push(runTask);
            }
        });
    }

    runNext() {
        if (this.queue.length > 0 && this.running < this.max) {
            const next = this.queue.shift();
            next();
        }
    }
}

const scheduler = new Scheduler(2);
const task1 = () => new Promise(resolve => setTimeout(() => resolve(1), 1000));
const task2 = () => new Promise(resolve => setTimeout(() => resolve(2), 500));
const task3 = () => new Promise(resolve => setTimeout(() => resolve(3), 300));
scheduler.add(task1).then(console.log);
scheduler.add(task2).then(console.log);
scheduler.add(task3).then(console.log);


//  防抖函数实现（贴合前端交互）
// 题目描述
// 实现通用防抖函数 debounce(fn, delay, options)：
// options.leading：是否立即执行第一次调用（默认 false）；
// options.trailing：是否执行最后一次调用（默认 true）；
// 支持取消防抖（cancel 方法）；
// 支持立即执行（flush 方法）。
// 输入示例

function debounce(fn, delay, options = {}) {
    let timer = null;
    let lastArgs, lastThis, result;
    let lastCallTime = null;

    const invokeFunc = function (args) {
        return fn.apply(this, args);
    };

    const leadingEdge = function () {
        // 设置定时器用于后续调用
        timer = setTimeout(timerExpired, delay);
        // 如果设置了leading，则立即执行函数
        if (options.leading === true) {
            return invokeFunc(lastArgs);
        }
        return result;
    };

    const trailingEdge = function () {
        timer = null;
        // 只有设置了trailing且有等待执行的参数时才执行函数
        if (options.trailing !== false && lastArgs) {
            const args = lastArgs;
            const thisArg = lastThis;
            lastArgs = null;
            lastThis = null;
            return invokeFunc(args);
        }
        return result;
    };

    const timerExpired = function () {
        const timeSinceLastCall = Date.now() - lastCallTime;

        if (lastCallTime === null || timeSinceLastCall >= delay || timeSinceLastCall < 0) {
            trailingEdge();
        } else {
            // 延迟执行
            timer = setTimeout(timerExpired, delay - timeSinceLastCall);
        }
    };

    const debounced = function (...args) {
        lastArgs = args;
        lastThis = this;
        const timeNow = Date.now();

        // 判断是否是第一次调用或已经超过了延迟时间
        const isInvoking = !timer;

        if (isInvoking) {
            lastCallTime = timeNow;
            // 第一次调用，检查是否需要立即执行
            return leadingEdge();
        } else {
            lastCallTime = timeNow;
            // 更新定时器
            clearTimeout(timer);
            timer = setTimeout(timerExpired, delay);
        }

        return result;
    };

    // 添加取消功能
    debounced.cancel = function () {
        if (timer !== null) {
            clearTimeout(timer);
            timer = null;
            lastArgs = null;
            lastThis = null;
            lastCallTime = null;
        }
    };

    // 添加立即执行功能
    debounced.flush = function () {
        if (timer) {
            clearTimeout(timer);
            timer = null;
            const args = lastArgs;
            const thisArg = lastThis;
            lastArgs = null;
            lastThis = null;
            lastCallTime = null;
            return invokeFunc(args);
        }
        return result;
    };

    return debounced;
}

const fn = () => console.log('click');
const debouncedFn = debounce(fn, 1000, { leading: true });
debouncedFn(); // 立即执行
debouncedFn(); // 1秒后不执行（trailing=false时）



//  包体积优化（0-1 背包，贴合前端工程化）
// 题目描述
// 有 n 个前端模块，每个模块优化耗时 time[i]，优化后减少体积 size[i]，总耗时上限 T，选择模块使总减少体积最大：

// 输出示例
const maxSize = (time, size, T) => {
    const n = time.length;
    // 使用一维DP数组，节省空间
    const dp = new Array(T + 1).fill(0);

    // 遍历每个任务
    for (let i = 0; i < n; i++) {
        // 从后往前遍历，确保每个物品只使用一次
        for (let j = T; j >= time[i]; j--) {
            dp[j] = Math.max(dp[j], dp[j - time[i]] + size[i]);
        }
    }

    return dp[T];
};

// 测试用例
const time = [1, 2, 3, 4];
const size = [1, 2, 3, 4];
const T = 5;
console.log(maxSize(time, size, T)); // 应该输出在时间限制T内的最大收益


//  嵌套组件扁平化（贴合前端组件树处理）
// 题目描述
// 前端组件树为嵌套结构（children 为子组件数组），实现深度优先遍历，扁平化组件树为一维数组，元素为组件 name，并标注层级（根组件层级为 0）：
// 输入示例

const componentTree = {
    name: 'App',
    children: [
        { name: 'Header', children: [{ name: 'Nav', children: [] }] },
        { name: 'Content', children: [] }
    ]
};

const flattenComponentTree = (tree) => {
    const result = [];

    const traverse = (node, level) => {
        if (!node) return;

        // 将当前节点加入结果
        result.push({ name: node.name, level: level });

        // 遍历子节点
        if (node.children && node.children.length > 0) {
            for (const child of node.children) {
                traverse(child, level + 1);
            }
        }
    };

    traverse(tree, 0);

    return result;
};

// 或者使用迭代方式实现
const flattenComponentTreeIterative = (tree) => {
    if (!tree) return [];

    const result = [];
    // 使用栈保存节点及其层级
    const stack = [{ node: tree, level: 0 }];

    while (stack.length > 0) {
        const { node, level } = stack.pop();

        if (node) {
            result.push({ name: node.name, level: level });

            // 将子节点加入栈，注意要逆序添加以保证正确的访问顺序
            if (node.children && node.children.length > 0) {
                for (let i = node.children.length - 1; i >= 0; i--) {
                    stack.push({ node: node.children[i], level: level + 1 });
                }
            }
        }
    }

    return result;
};

// 输出示例

console.log(flattenComponentTree(componentTree));

// [
//   { name: 'App', level: 0 },
//   { name: 'Header', level: 1 },
//   { name: 'Nav', level: 2 },
//   { name: 'Content', level: 1 }
// ]
// 考察点：DFS（递归 / 迭代）、复杂数据结构处理、边界 case（空 children）
// 阿里追问
// 若组件树层级超过 1000 层，递归实现会栈溢出，如何用迭代优化？


function flatten(arr) {
    const result = [];
    const stack = [...arr]; // 用栈替代递归

    while (stack.length) {
        const item = stack.pop();
        if (Array.isArray(item)) {
            stack.push(...item); // 拆开子数组
        } else {
            result.push(item);
        }
    }
    return result.reverse(); // 因栈是倒序，需反转
}

// 4. LRU 缓存淘汰算法（贴合前端缓存场景）
// 题目描述
// 实现 LRU（最近最少使用）缓存类 LRUCache，要求所有操作时间复杂度为 O (1)：
// constructor(capacity)：初始化缓存容量；
// get(key)：获取值，不存在返回 - 1，访问


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
        } else if (this.cache.size === this.capacity) {
            this.cache.delete(this.cache.keys().next().value);
        }
    }

    print() {
        console.log(this.cache);
    }

    clear() {
        this.cache.clear();
    }

    size() {
        return this.cache.size;
    }

    keys() {
        return Array.from(this.cache.keys());
    }

    values() {
        return Array.from(this.cache.values());
    }

}

function parseUrlParams(str) {
    const params = {};
    const pairs = str.split('&');

    for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key.includes('[')) {
            // 处理嵌套：如 'b[c]' -> ['b', 'c']
            const keys = key.match(/([^\[\]]+)/g);
            let current = params;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = current[keys[i]] || {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
        } else {
            params[key] = value;
        }
    }
    return params;
}


// 实现 Promise.all
// 题目描述
// 实现简化版 myPromiseAll，功能与原生 Promise.all 一致：
// 接收一个 Promise 数组（或可迭代对象）；
// 所有 Promise 成功时，按顺序返回结果数组；
// 任意一个 Promise 失败时，立即返回该失败原因；
// 空数组时返回空数组。
// 考察点：Promise 状态控制、异步结果收集、同步 / 异步边界处理
// 输入示例

function myPromiseAll(promises) {
    return new Promise((resolve, reject) => {
        const results = [];
        let count = 0;

        for (const promise of promises) {
            Promise.resolve(promise)
                .then(result => {
                    results[count++] = result;
                    if (count === promises.length) {
                        resolve(results);
                    }
                }, error => reject(error))
        }
    })
}

const p1 = Promise.resolve(1);
const p2 = new Promise(resolve => setTimeout(() => resolve(2), 100));
myPromiseAll([p1, p2]).then(console.log); // [1, 2]
myPromiseAll([p1, Promise.reject('error')]).catch(console.log); // 'error'


// 2. 实现 Promise.race
// 题目描述
// 实现简化版 myPromiseRace，功能与原生 Promise.race 一致：
// 接收一个 Promise 数组（或可迭代对象）；
// 返回第一个完成（成功 / 失败）的 Promise 的结果 / 原因；
// 空数组时永远处于 pending 状态。
// 考察点：Promise 状态抢占、异步结果优先返回
// 输入示例

function myPromiseRace(promises) {
    return new Promise((resolve, reject) => {
        for (const promise of promises) {
            Promise.resolve(promise)
                .then(result => resolve(result), error => reject(error))
        }
    })
}

const p3 = new Promise(resolve => setTimeout(() => resolve(1), 100));
const p4 = new Promise(resolve => setTimeout(() => resolve(2), 50));
myPromiseRace([p3, p4]).then(console.log); // 2
myPromiseRace([Promise.reject('error'), p1]).catch(console.log); // 'error'
// 3. 实现 Promise.allSettled
// 题目描述
// 实现简化版 myPromiseAllSettled，功能与原生 Promise.allSettled 一致：
// 接收一个 Promise 数组；
// 所有 Promise 完成（无论成功 / 失败）后，返回结果数组；
// 每个结果格式：{ status: 'fulfilled', value: ... } 或 { status: 'rejected', reason: ... }。
// 考察点：异步结果全量收集、状态不中断
// 输入示例

function myPromiseAllSettled(promises) {
    return new Promise((resolve, reject) => {
        const results = [];
        let count = 0;

        for (const promise of promises) {
            Promise.resolve(promise)
                .then(result => {
                    results[count++] = { status: 'fulfilled', value: result };
                    if (count === promises.length) {
                        resolve(results);
                    }
                }, error => {
                    results[count++] = { status: 'rejected', reason: error };
                    if (count === promises.length) {
                        resolve(results);
                    }
                })
        }
    })
}


const p5 = Promise.resolve(1);
const p6 = Promise.reject('error');
myPromiseAllSettled([p5, p6]).then(console.log);
// [{ status: 'fulfilled', value: 1 }, { status: 'rejected', reason: 'error' }]
// 4. 实现 Promise.any
// 题目描述
// 实现简化版 myPromiseAny，功能与原生 Promise.any 一致：
// 接收一个 Promise 数组；
// 任意一个 Promise 成功时，立即返回该成功结果；
// 所有 Promise 失败时，返回 AggregateError（简化版可返回包含所有失败原因的对象）；
// 空数组时返回失败。
// 考察点：Promise 成功状态抢占、全失败场景处理
// 输入示例

function myPromiseAny(promises) {
    return new Promise((resolve, reject) => {
        const reasons = [];
        let count = 0;

        for (const promise of promises) {
            Promise.resolve(promise)
                .then(result => resolve(result), error => {
                    reasons[count++] = error;
                    if (count === promises.length) {
                        reject(new AggregateError(reasons, 'All promises were rejected'));
                    }
                })
        }
    })
}

const p7 = Promise.reject('error1');
const p8 = new Promise(resolve => setTimeout(() => resolve(2), 50));
myPromiseAny([p7, p8]).then(console.log); // 2
myPromiseAny([p7, Promise.reject('error2')]).catch(err => console.log(err.reasons)); // ['error1', 'error2



function uniqueArray(arr) {
    const map = new Map(); // 用Map记录已出现的元素（比Object更高效）
    const result = [];

    for (const item of arr) {
        if (!map.has(item)) {
            map.set(item, true);
            result.push(item);
        }
    }
    return result;
}
