/**
 * 020801 JS 面试题（20 道）- 贴合面试实际场景
 * 日期：2026-02-08
 * 规则：仅题干与约束，个人完成后再补充解答与测试用例。
 */

// ==================== 1. 场景：列表请求防抖 ====================
// 搜索框输入时触发请求，用户连续输入只发最后一次请求，且延迟 300ms 再发。
// 要求：手写防抖函数，支持取消防抖（如清空输入时取消待发请求）。

// 【修正】防抖：每次调用重置 timer，wait ms 内无新调用才执行。原逻辑混淆了节流。
function debounce(fn, wait) {
    let timer = null;
    const debounced = function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), wait);
    };
    debounced.cancel = () => { clearTimeout(timer); timer = null; };
    return debounced;
}


// ==================== 2. 场景：滚动加载节流 ====================
// 滚动事件每 200ms 最多执行一次回调，且滚动停止后执行最后一次。
// 要求：结合 throttle +  trailing，或说明如何用现有工具实现。

// 【修正】节流 + trailing：先立即执行一次，wait 内再次调用则安排 trailing，停止后执行最后一次
function throttle(fn, wait) {
    let last = 0, timer = null;
    return function (...args) {
        const now = Date.now();
        if (now - last >= wait) {
            last = now;
            fn.apply(this, args);
        } else if (!timer) {
            timer = setTimeout(() => {
                timer = null;
                last = Date.now();
                fn.apply(this, args);
            }, wait - (now - last));
        }
    };
}

// ==================== 3. 输出题 ====================
// 写出下面代码的输出顺序，并说明原因。
// console.log(1);
// setTimeout(() => console.log(2), 0);
// Promise.resolve().then(() => console.log(3));
// async function f() { console.log(4); await null; console.log(5); }
// f();
// console.log(6);
// 1 4 6 3 5 2

// ==================== 4. 手写：实现 Array.prototype.flat(depth) ====================
// 不改变原数组，depth 默认 1，支持 Infinity。仅需写出核心逻辑。

// 【修正】缺少 return；避免污染原型，用独立函数
function flat(arr, depth = 1) {
    const result = [];
    const flatten = (a, d) => {
        for (const item of a) {
            if (Array.isArray(item) && d > 0) flatten(item, d - 1);
            else result.push(item);
        }
    };
    flatten(arr, depth);
    return result;
}

// ==================== 5. 场景：接口串行改并行 ====================
// 现有三个请求 A、B、C，当前是 await A(); await B(); await C(); 如何改为并行且拿到 [a, b, c]？
// 要求：写出代码并说明错误处理（某一个失败时希望的行为）。


// ==================== 6. 手写：实现 new 操作符 ====================
// 函数 myNew(Constructor, ...args)，返回实例，并保证原型链、构造函数内 this 正确。

function myNew(Constructor, ...args) {
    let obj = Object.create(Constructor.prototype); 
    const res = Constructor.apply(obj, args);
    return (res && typeof res === 'object') ? res : obj;
}

// ==================== 7. 输出题：this ====================
// const obj = { a: 1, fn() { console.log(this.a); } };
// const fn2 = obj.fn;
// fn2();  obj.fn();  fn2.call(obj);
// 分别输出什么？
// undefined 1 1
 
// ==================== 8. 场景：大列表渲染优化 ====================
// 一次渲染 1 万条列表导致卡顿，请说出至少 3 种前端优化思路（不写具体代码也可）。

// 场景题：思路为虚拟滚动、分页、骨架屏等，无需可运行代码

// ==================== 9. 手写：浅比较两个对象是否相等 ====================
// equal(a, b)：只比较一层 key，值用 ===；支持数组（同下标同值）。

// 【修正】题目要求浅比较，递归 equal 为深比较。浅比较只比较一层，值用 ===
function equal(a, b) {
    if (a === b) return true;
    if (a == null || b == null || typeof a !== 'object' || typeof b !== 'object') return false;
    const keysA = Object.keys(a), keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
        if (!Object.prototype.hasOwnProperty.call(b, key) || a[key] !== b[key]) return false;
    }
    return true;
}

// ==================== 10. 输出题：闭包 ====================
// for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 100); }
// 输出？若希望输出 0,1,2，至少写出两种改法（不改 var 也可）。 

// 输出 3,3,3。改法1：let i。改法2：for(var i=0;i<3;i++){ (function(j){ setTimeout(()=>console.log(j),100); })(i); }

// ==================== 11. 手写：Promise.allSettled ====================
// 传入 Promise 数组，返回 Promise<Array<{status, value?|reason?}>>，全部结束才 resolve，不 reject。

function allSettled(promises) {
    return Promise.all(promises.map(promise => promise.then(value => ({ status: 'fulfilled', value }), reason => ({ status: 'rejected', reason }))));
}

// ==================== 12. 场景：单页应用路由鉴权 ====================
// 未登录访问 /user 时跳转 /login，登录后跳回 /user。请简述前端实现思路（路由守卫 + 重定向）。


// ==================== 13. 手写：柯里化 sum(1)(2)(3) === 6 ====================
// 实现 sum，支持 sum(1)(2)(3)() 或 sum(1,2)(3)() 等形式，空调用时返回累加结果。约定一种即可。

// 【修正】sum(1)(2)(3)() 空调用时返回累加；原逻辑错误且 args 重复声明
function curryingSum(...init) {
    const nums = [...init];
    const fn = (...more) => {
        if (more.length === 0) return nums.reduce((a, b) => a + b, 0);
        return curryingSum(...nums, ...more);
    };
    return fn;
}

// ==================== 14. 输出题：类型与隐式转换 ====================
// console.log([] + {});  console.log({} + []);  console.log([] == ![]);
// 分别输出？简要说明。

function typeAndImplicitConversion() {
    console.log([] + {});  // "" + {} => "[object Object]"
    console.log({} + []);  // {} + [] => "[object Object]0"
    console.log([] == ![]);  // [] == false => true
}

// ==================== 15. 场景：前端错误上报 ====================
// 如何捕获：① 全局 JS 报错 ② 未 catch 的 Promise 错误 ③ 资源加载失败？
// 各写一行关键代码或 API 名称。

// ① window.onerror 或 addEventListener('error') ② unhandledrejection ③ addEventListener('error', fn, true) 捕获阶段

// ==================== 16. 手写：深拷贝（支持 Date、RegExp、循环引用） ====================
// deepClone(obj)，不依赖 JSON，循环引用时指向同一拷贝对象。

// 【修正】需支持 Date、RegExp、循环引用
function deepClone(obj, cache = new WeakMap()) {
    if (obj == null || typeof obj !== 'object') return obj;
    if (cache.has(obj)) return cache.get(obj);
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof RegExp) return new RegExp(obj);
    const clone = Array.isArray(obj) ? [] : {};
    cache.set(obj, clone);
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clone[key] = deepClone(obj[key], cache);
        }
    }
    return clone;
}

// ==================== 17. 场景：长列表虚拟滚动原理 ====================
// 用一句话说明「虚拟列表」如何减少 DOM 数量；再说明如何估算每项高度未知时的列表总高度（思路即可）。


// ==================== 18. 手写：bind 并支持 new ====================
// myBind(thisArg, ...args)，返回的函数作为构造函数 new 时，this 指向新实例。
Function.prototype.myBind = function (thisArg, ...args) {
    const fn = this;
    const bound = function (...args2) {
        return fn.apply(this instanceof bound ? this : thisArg, args.concat(args2));
    };
    bound.prototype = Object.create(fn.prototype);
    return bound;
};


// ==================== 19. 输出题：微任务与宏任务 ====================
// Promise.resolve().then(() => console.log(1)).then(() => console.log(2));
// Promise.resolve().then(() => console.log(3));
// 输出顺序？1 3 2（两个 then 链交替入微任务队列）



// ==================== 20. 场景：前端缓存策略 ====================
// 静态资源（如 main.abc123.js）和接口数据（如 /api/user）分别适合用什么缓存策略？
// 各用一句话说明（强缓存 / 协商缓存 / 不缓存等）。

// ==================== 测试用例 ====================
function assert(cond, msg) {
    if (!cond) throw new Error('Assert failed: ' + msg);
}

async function runTests() {
    // 1 debounce
    let n = 0;
    const db = debounce(() => n++, 50);
    db(); db(); db();
    await new Promise(r => setTimeout(r, 100));
    assert(n === 1, 'debounce');
    db.cancel();
    assert(typeof db.cancel === 'function', 'debounce cancel');

    // 2 throttle
    let m = 0;
    const th = throttle(() => m++, 50);
    th(); th(); th();
    await new Promise(r => setTimeout(r, 120));
    assert(m >= 1, 'throttle');

    // 4 flat
    assert(JSON.stringify(flat([1, [2, [3, 4]]], 1)) === '[1,2,[3,4]]', 'flat depth1');
    assert(JSON.stringify(flat([1, [2, [3, 4]]], Infinity)) === '[1,2,3,4]', 'flat Infinity');

    // 6 myNew
    function F(a, b) { this.x = a + b; }
    F.prototype.y = 1;
    const o = myNew(F, 1, 2);
    assert(o.x === 3 && o.y === 1 && o instanceof F, 'myNew');

    // 9 equal (浅比较)
    assert(equal({ a: 1, b: 2 }, { a: 1, b: 2 }) === true, 'equal true');
    assert(equal({ a: 1 }, { a: 1, b: 2 }) === false, 'equal key diff');
    assert(equal({ a: {} }, { a: {} }) === false, 'equal shallow ref');

    // 11 allSettled
    const settled = await allSettled([
        Promise.resolve(1),
        Promise.reject('e'),
        Promise.resolve(3)
    ]);
    assert(settled[0].status === 'fulfilled' && settled[0].value === 1, 'allSettled fulfilled');
    assert(settled[1].status === 'rejected' && settled[1].reason === 'e', 'allSettled rejected');

    // 13 curryingSum
    assert(curryingSum(1)(2)(3)() === 6, 'curryingSum');
    assert(curryingSum(1, 2)(3)() === 6, 'curryingSum multi');

    // 16 deepClone
    const d1 = { a: 1, b: new Date(0), c: /test/ };
    const d2 = deepClone(d1);
    assert(d2.a === 1 && d2.b.getTime() === 0 && d2.c.source === 'test', 'deepClone');
    const loop = {}; loop.self = loop;
    const loop2 = deepClone(loop);
    assert(loop2.self === loop2, 'deepClone circular');

    // 18 myBind
    const fn = function (x) { return this.a + x; };
    assert(fn.myBind({ a: 1 })(2) === 3, 'myBind');

    console.log('✅ 全部代码题测试通过');
}

if (typeof require !== 'undefined' && require.main === module) {
    runTests().catch(e => { console.error(e); process.exit(1); });
}
