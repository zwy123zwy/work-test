/**
 * 031501 面试算法题（20 道）- 专题：综合（React/Node 场景）
 * 日期：2026-03-15
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 扁平化嵌套列表 ====================
function flattenNested(nestedList) {
    const res = [];
    const dfs = (list) => {
        for (const x of list)
            if (Array.isArray(x)) dfs(x);
            else res.push(x);
    };
    dfs(nestedList);
    return res;
}

// ==================== 2. 扁平化对象 ====================
function flattenObject(obj, prefix = '') {
    const res = {};
    for (const [k, v] of Object.entries(obj)) {
        const key = prefix ? prefix + '.' + k : k;
        if (v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date))
            Object.assign(res, flattenObject(v, key));
        else res[key] = v;
    }
    return res;
}

// ==================== 3. 深拷贝 ====================
function deepClone(obj, map = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (map.has(obj)) return map.get(obj);
    const clone = Array.isArray(obj) ? [] : {};
    map.set(obj, clone);
    for (const k of Object.keys(obj)) clone[k] = deepClone(obj[k], map);
    return clone;
}

// ==================== 4. 防抖 ====================
function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// ==================== 5. 节流 ====================
function throttle(fn, limit) {
    let last = 0;
    return function (...args) {
        const now = Date.now();
        if (now - last >= limit) { last = now; fn.apply(this, args); }
    };
}

// ==================== 6. Promise.all ====================
function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        const res = [];
        let count = 0;
        if (!promises.length) return resolve(res);
        promises.forEach((p, i) => {
            Promise.resolve(p).then(v => { res[i] = v; if (++count === promises.length) resolve(res); }).catch(reject);
        });
    });
}

// ==================== 7. Promise.race ====================
function promiseRace(promises) {
    return new Promise((resolve, reject) => {
        for (const p of promises) Promise.resolve(p).then(resolve).catch(reject);
    });
}

// ==================== 8. 并发限制 ====================
async function concurrentLimit(tasks, limit) {
    const exec = async () => {
        while (tasks.length) await tasks.shift()();
    };
    await Promise.all(Array(Math.min(limit, tasks.length)).fill(0).map(exec));
}

// ==================== 9. 发布订阅 ====================
class EventEmitter {
    constructor() { this.events = {}; }
    on(event, cb) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(cb);
    }
    emit(event, ...args) { (this.events[event] || []).forEach(cb => cb(...args)); }
    off(event, cb) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(f => f !== cb);
    }
}

// ==================== 10. 柯里化 ====================
function curry(fn) {
    return function curried(...args) {
        return args.length >= fn.length ? fn.apply(this, args) : (...a) => curried.apply(this, args.concat(a));
    };
}

// ==================== 11. compose ====================
function compose(...fns) {
    return x => fns.reduceRight((v, f) => f(v), x);
}

// ==================== 12. 链式调用 ====================
class Chain {
    constructor(value) { this.value = value; }
    then(fn) { this.value = fn(this.value); return this; }
    get() { return this.value; }
}

// ==================== 13. 对象属性路径取值 ====================
function get(obj, path, defaultVal) {
    const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);
    let cur = obj;
    for (const k of keys) { cur = cur?.[k]; if (cur === undefined) return defaultVal; }
    return cur;
}

// ==================== 14. 模板渲染 ====================
function render(tpl, data) {
    return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => data[k] ?? '');
}

// ==================== 15. 千分位格式化 ====================
function formatNumber(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ==================== 16. 大数相加 ====================
function bigAdd(a, b) {
    let carry = 0, res = '';
    a = a.split('').reverse();
    b = b.split('').reverse();
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        const sum = (+a[i] || 0) + (+b[i] || 0) + carry;
        res = (sum % 10) + res;
        carry = (sum / 10) | 0;
    }
    return (carry ? '1' : '') + res;
}

// ==================== 17. 驼峰转下划线 ====================
function camelToSnake(str) {
    return str.replace(/[A-Z]/g, c => '_' + c.toLowerCase());
}

// ==================== 18. 下划线转驼峰 ====================
function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

// ==================== 19. 数组去重 ====================
function unique(arr) {
    return [...new Set(arr)];
}

// ==================== 20. 对象合并（深合并） ====================
function deepMerge(target, ...sources) {
    for (const src of sources) {
        for (const k of Object.keys(src)) {
            if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k]) && target[k] && typeof target[k] === 'object')
                deepMerge(target[k], src[k]);
            else target[k] = src[k];
        }
    }
    return target;
}

// ==================== 测试 ====================
function test031501() {
    const assert = (n, a, e) => console.log(JSON.stringify(a) === JSON.stringify(e) ? `[OK] ${n}` : `[FAIL] ${n}`);
    assert('1', flattenNested([1, [2, [3, 4]]]), [1, 2, 3, 4]);
    assert('3', deepClone({ a: 1 }).a, 1);
    assert('10', curry((a, b) => a + b)(1)(2), 3);
    assert('11', compose(x => x + 1, x => x * 2)(3), 7);
    assert('13', get({ a: { b: 1 } }, 'a.b'), 1);
    assert('14', render('{{name}}', { name: 'Tom' }), 'Tom');
    assert('15', formatNumber(1234567), '1,234,567');
    assert('16', bigAdd('999', '1'), '1000');
    assert('17', camelToSnake('helloWorld'), 'hello_world');
    assert('18', snakeToCamel('hello_world'), 'helloWorld');
    assert('19', unique([1, 2, 2, 3]), [1, 2, 3]);
    console.log('031501 tests done.');
}
test031501();
