/**
 * js-challenges 题单（April/04061.js）异步相关题目 — 参考实现汇总
 * 依赖：HandwrittenPromise（可选）、原生 fetch/AbortController（Node 18+）
 */

const { HandwrittenPromise } = require('./HandwrittenPromise.js');

// ---------------------------------------------------------------------------
// 基础工具
// ---------------------------------------------------------------------------

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

/** 每隔一秒打印 1,2,3,4,5 */
async function printOneToFiveEverySecond(log = console.log) {
    for (let i = 1; i <= 5; i += 1) {
        log(i);
        if (i < 5) await sleep(1000);
    }
}

/** 超过 ms 未 settle 则 reject */
function withTimeout(promise, ms, message = 'timeout') {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms)),
    ]);
}

/** promiseA -> promiseB：1s 内必须完成 */
function wrapWith1sTimeout(promiseA) {
    return withTimeout(Promise.resolve(promiseA), 1000, '超过 1s 未完成');
}

/** repeat(fn, times, interval) */
/** 与题面 repeat(console.log, 5, 1000) 一致：每 interval 执行一次 fn，共 times 次 */
function repeat(fn, times, interval) {
    return new Promise((resolve) => {
        let n = 0;
        const id = setInterval(() => {
            fn();
            n += 1;
            if (n >= times) {
                clearInterval(id);
                resolve();
            }
        }, interval);
    });
}

/** 用 setTimeout 链模拟 setInterval，返回 cancel */
function setTimeoutAsInterval(fn, delay) {
    let cleared = false;
    let id;
    function tick() {
        if (cleared) return;
        fn();
        id = setTimeout(tick, delay);
    }
    id = setTimeout(tick, delay);
    return () => {
        cleared = true;
        clearTimeout(id);
    };
}

/** 用 setInterval 模拟「只执行一次」的 setTimeout */
function setIntervalAsTimeout(fn, delay) {
    const id = setInterval(() => {
        clearInterval(id);
        fn();
    }, delay);
    return () => clearInterval(id);
}

/** 补偿漂移的「准周期」定时器 */
function accurateInterval(fn, intervalMs) {
    let expected = Date.now() + intervalMs;
    let id;
    function step() {
        fn();
        const drift = Date.now() - expected;
        expected += intervalMs;
        id = setTimeout(step, Math.max(0, intervalMs - drift));
    }
    id = setTimeout(step, intervalMs);
    return () => clearTimeout(id);
}

// ---------------------------------------------------------------------------
// 交通灯
// ---------------------------------------------------------------------------

/**
 * 循环：红 -> 绿 -> 黄
 * @param {(c: string) => void} onColor
 * @param {{ red?: number, green?: number, yellow?: number, cycles?: number }} opt
 */
async function trafficLight(onColor, opt = {}) {
    const { red = 3000, green = 2000, yellow = 1000, cycles = Infinity } = opt;
    let c = 0;
    while (c < cycles) {
        onColor('red');
        await sleep(red);
        onColor('green');
        await sleep(green);
        onColor('yellow');
        await sleep(yellow);
        c += 1;
    }
}

// ---------------------------------------------------------------------------
// fetch / AJAX / 图片
// ---------------------------------------------------------------------------

/** 封装 fetch，返回 async 函数 */
function createAsyncFetch(defaults = {}) {
    return async function asyncFetch(url, options = {}) {
        const res = await fetch(url, { ...defaults, ...options });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res;
    };
}

/** Promise 加载图片（浏览器）；Node 下可用占位或 skip */
function loadImage(url) {
    return new Promise((resolve, reject) => {
        if (typeof Image === 'undefined') {
            reject(new Error('loadImage 需在浏览器环境使用 Image'));
            return;
        }
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`load fail: ${url}`));
        img.src = url;
    });
}

/** XHR 版 GET -> Promise */
function ajaxGet(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.responseText);
            else reject(new Error(String(xhr.status)));
        };
        xhr.onerror = () => reject(new Error('network'));
        xhr.send();
    });
}

// ---------------------------------------------------------------------------
// 请求：串行 / 超时 / 中断 / 竞速 / 并发有序
// ---------------------------------------------------------------------------

async function sequentialRequests(tasks) {
    const out = [];
    for (const t of tasks) {
        out.push(await t());
    }
    return out;
}

/** 三秒超时（题面） */
function withTimeout3s(p) {
    return withTimeout(p, 3000, '超过三秒视为超时');
}

/** AbortController 包装 fetch */
function fetchWithAbort(url, options = {}) {
    const controller = new AbortController();
    const p = fetch(url, { ...options, signal: controller.signal });
    return { promise: p, abort: () => controller.abort() };
}

/** 多路 API 竞速：谁先 fulfilled 用谁（需全部可访问） */
function raceFastestApi(urls, fetchImpl = fetch) {
    return Promise.any(urls.map((u) => fetchImpl(u).then((r) => (r.ok ? r : Promise.reject(new Error(String(r.status)))))));
}

/** 多 URL：第一个 settled（含 reject）— 题意常为「最先返回的 response」用 race */
function raceFirstResponse(urls, fetchImpl = fetch) {
    return Promise.race(urls.map((u) => fetchImpl(u)));
}

/**
 * 并发上限 limit，结果按下标顺序（每个 task 对应原下标）
 */
async function concurrentPoolOrdered(tasks, limit) {
    const results = new Array(tasks.length);
    let cursor = 0;
    async function worker() {
        while (cursor < tasks.length) {
            const idx = cursor;
            cursor += 1;
            results[idx] = await tasks[idx]();
        }
    }
    const n = Math.min(limit, tasks.length);
    await Promise.all(Array.from({ length: n }, () => worker()));
    return results;
}

/** 有并发限制的「类 Promise.all」：tasks 为 () => Promise 的数组 */
function promiseAllWithLimit(tasks, limit) {
    return concurrentPoolOrdered(tasks, limit);
}

/** 高并发题抽象：total 条任务，同时最多 concurrency 个 */
async function runWithConcurrency(total, concurrency, taskFn) {
    const tasks = Array.from({ length: total }, (_, idx) => () => taskFn(idx));
    return concurrentPoolOrdered(tasks, concurrency);
}

/** Promise 串行（任务为返回 Promise 的函数数组） */
function runSerial(tasks) {
    return tasks.reduce((p, t) => p.then((acc) => t().then((v) => [...acc, v])), Promise.resolve([]));
}

// ---------------------------------------------------------------------------
// 调度：1/3/4 秒打印 1/2/3、Scheduler、池子补位
// ---------------------------------------------------------------------------

/** 分别在 delayMs[i] 后打印 labels[i]（或执行 fns[i]） */
function scheduleDelays(fns, delayMs) {
    return Promise.all(fns.map((fn, i) => sleep(delayMs[i]).then(() => fn())));
}

/** 题面：1s、3s、4s 后打印 "1"、"2"、"3" */
function schedulePrint123() {
    return scheduleDelays(
        [() => console.log('1'), () => console.log('2'), () => console.log('3')],
        [1000, 3000, 4000]
    );
}

/** 并行上限调度器（类） */
class Scheduler {
    constructor(limit) {
        this.limit = limit;
        this.running = 0;
        this.queue = [];
    }

    add(task) {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, resolve, reject });
            this.run();
        });
    }

    run() {
        while (this.running < this.limit && this.queue.length) {
            const { task, resolve, reject } = this.queue.shift();
            this.running += 1;
            Promise.resolve(task())
                .then(resolve, reject)
                .finally(() => {
                    this.running -= 1;
                    this.run();
                });
        }
    }
}

/**
 * 并发 n：完成一个从队列补一个新；onEachDone 每次完成时带上返回值
 */
async function poolRefill(urls, limit, worker, onEachDone) {
    const queue = [...urls];
    let active = 0;
    return new Promise((resolve, reject) => {
        const results = [];
        function next() {
            if (queue.length === 0 && active === 0) {
                resolve(results);
                return;
            }
            while (active < limit && queue.length) {
                const url = queue.shift();
                active += 1;
                Promise.resolve(worker(url))
                    .then((res) => {
                        results.push(res);
                        onEachDone?.(res);
                    })
                    .catch(reject)
                    .finally(() => {
                        active -= 1;
                        next();
                    });
            }
        }
        next();
    });
}

// ---------------------------------------------------------------------------
// 门闩：上一次未完成则忽略后续
// ---------------------------------------------------------------------------

function createLatestGate(asyncFn) {
    let seq = 0;
    return async function (...args) {
        const id = ++seq;
        const p = asyncFn.apply(this, args);
        const v = await p;
        if (id !== seq) return undefined;
        return v;
    };
}

// ---------------------------------------------------------------------------
// 每隔 3 秒输出时间（返回 cancel）
function every3SecondsLogTime(log = console.log) {
    const id = setInterval(() => log(new Date().toISOString()), 3000);
    return () => clearInterval(id);
}

// ---------------------------------------------------------------------------
// 回调地狱 -> Promise / async
// ---------------------------------------------------------------------------

function callbackHellStyle(getA, getB, getC, finalCb) {
    getA((a) => {
        getB(a, (b) => {
            getC(b, (c) => {
                finalCb(null, c);
            }, (e) => finalCb(e));
        }, (e) => finalCb(e));
    }, (e) => finalCb(e));
}

async function callbackHellToAsync(getA, getB, getC) {
    const a = await new Promise((res, rej) => getA(res, rej));
    const b = await new Promise((res, rej) => getB(a, res, rej));
    const c = await new Promise((res, rej) => getC(b, res, rej));
    return c;
}

// ---------------------------------------------------------------------------
// retry + 缓存兜底
// ---------------------------------------------------------------------------

async function promiseRetry(taskFn, { maxRetry = 3, delayMs = 0, getCache, setCache, cacheKey } = {}) {
    let lastErr;
    for (let i = 0; i < maxRetry; i += 1) {
        try {
            const v = await taskFn();
            if (setCache && cacheKey != null) setCache(cacheKey, v);
            return v;
        } catch (e) {
            lastErr = e;
            if (delayMs > 0) await sleep(delayMs);
        }
    }
    if (getCache && cacheKey != null) {
        const c = getCache(cacheKey);
        if (c !== undefined) return c;
    }
    throw lastErr;
}

// ---------------------------------------------------------------------------
// mySetInterval(fn, a, b)：第 k 次等待 a + k*b ms（k=0,1,2…）
// ---------------------------------------------------------------------------

function mySetInterval(fn, a, b) {
    let k = 0;
    let timerId = null;
    let cleared = false;
    function schedule() {
        if (cleared) return;
        const wait = a + k * b;
        k += 1;
        timerId = setTimeout(() => {
            fn();
            schedule();
        }, wait);
    }
    schedule();
    return {
        clear: () => {
            cleared = true;
            if (timerId) clearTimeout(timerId);
        },
    };
}

// ---------------------------------------------------------------------------
// Node promisify
// ---------------------------------------------------------------------------

function promisify(fn) {
    return function promisified(...args) {
        return new Promise((resolve, reject) => {
            fn.call(this, ...args, (err, ...vals) => {
                if (err) reject(err);
                else resolve(vals.length <= 1 ? vals[0] : vals);
            });
        });
    };
}

// ---------------------------------------------------------------------------
// async/await 语法糖：生成器执行器（与 04061.js 一致）
// ---------------------------------------------------------------------------

function asyncToGenerator(genFn) {
    return function (...args) {
        return new Promise((resolve, reject) => {
            const gen = genFn.apply(this, args);
            function step(type, arg) {
                let res;
                try {
                    res = gen[type](arg);
                } catch (e) {
                    reject(e);
                    return;
                }
                const { value, done } = res;
                if (done) {
                    resolve(value);
                    return;
                }
                Promise.resolve(value).then(
                    (v) => step('next', v),
                    (e) => step('throw', e)
                );
            }
            step('next');
        });
    };
}

// ---------------------------------------------------------------------------
// 请求 5s 未完成终止（fetch + AbortSignal.timeout 或 race）
// ---------------------------------------------------------------------------

function fetchWith5sAbort(url, options = {}) {
    const controller = new AbortController();
    const kill = setTimeout(() => controller.abort(), 5000);
    return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(kill));
}

module.exports = {
    HandwrittenPromise,
    sleep,
    printOneToFiveEverySecond,
    withTimeout,
    wrapWith1sTimeout,
    repeat,
    setTimeoutAsInterval,
    setIntervalAsTimeout,
    accurateInterval,
    trafficLight,
    createAsyncFetch,
    loadImage,
    ajaxGet,
    sequentialRequests,
    withTimeout3s,
    fetchWithAbort,
    raceFastestApi,
    raceFirstResponse,
    concurrentPoolOrdered,
    promiseAllWithLimit,
    runWithConcurrency,
    runSerial,
    scheduleDelays,
    schedulePrint123,
    Scheduler,
    poolRefill,
    createLatestGate,
    every3SecondsLogTime,
    callbackHellStyle,
    callbackHellToAsync,
    promiseRetry,
    mySetInterval,
    promisify,
    asyncToGenerator,
    fetchWith5sAbort,
};
