// instanceof
function MyInstanceof(left, right) {
    // 与原生一致：原始类型直接 false（不会对 left 做装箱）
    if (left == null || (typeof left !== 'object' && typeof left !== 'function')) {
        return false;
    }
    let proto = Object.getPrototypeOf(left);
    while (proto !== null) {
        if (proto === right.prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
    return false;
}

// typeof
//  number, string, boolean, undefined, null, symbol, object, function
function MyTypeOf(value) {
    return typeof value;
}

// object.is

function MyObjectIs(x, y) {
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    }
    return x !== x && y !== y;
}

// object.create（proto 为 null 时用原生 Object.create，避免旧式 new 报错）
function MyObjectCreate(obj) {
    if (obj === null) {
        return Object.create(null);
    }
    function F() { }
    F.prototype = obj;
    return new F();
}

// array.isArray
function MyArrayIsArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}

// 改变数组原数组 api
// push pop shift unshift splice sort reverse fill copyWithin

// 自定义实现
function MyPush(arr, ...args) {
    for (let i = 0; i < args.length; i++) {
        arr[arr.length] = args[i];
    }
    return arr.length;

}

function MyPop(arr) {
    if (arr.length === 0) return undefined;
    let last = arr[arr.length - 1];
    arr.length = arr.length - 1;

    return last;
}

// shift
function MyShift(arr) {
    if (arr.length === 0) return undefined;
    let first = arr[0];
    for (let i = 1; i < arr.length; i++) {

        arr[i - 1] = arr[i];
    }
    arr.length = arr.length - 1;
    return first;
}

// unshift
function MyUnshift(arr, ...args) {
    for (let i = arr.length - 1; i >= 0; i--) {
        arr[i + args.length] = arr[i];
    }
    for (let i = 0; i < args.length; i++) {
        arr[i] = args[i];
    }
    return arr.length;
}

// splice：与原生一致 — 修改原数组，返回「被删除元素」组成的数组
function MySplice(arr, start, deleteCount, ...insertItems) {
    const len = arr.length;
    let s = Math.trunc(start);
    if (s < 0) s = Math.max(len + s, 0);
    else s = Math.min(s, len);
    let del = deleteCount === undefined ? len - s : Math.trunc(deleteCount);
    del = Math.min(Math.max(del, 0), len - s);
    const deleted = arr.slice(s, s + del);
    const tail = arr.slice(s + del);
    arr.length = s;
    for (let i = 0; i < insertItems.length; i++) arr.push(insertItems[i]);
    for (let i = 0; i < tail.length; i++) arr.push(tail[i]);
    return deleted;
}

// sort（未传 compareFn 时按 UTF-16 字典序，与原生默认一致）
function MySort(arr, compareFn) {
    const cmp =
        compareFn ||
        ((a, b) => (String(a) > String(b) ? 1 : String(a) < String(b) ? -1 : 0));
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (cmp(arr[i], arr[j]) > 0) {
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}

// reverse
function MyReverse(arr) {
    let left = 0;
    let right = arr.length - 1;
    while (left < right) {
        let temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        left++;
        right--;
    }
    return arr;
}

// fill
function MyFill(arr, value, start, end) {
    for (let i = start; i < end; i++) {
        arr[i] = value;
    }
    return arr;
}

// copyWithin
function MyCopyWithin(arr, target, start, end) {
    for (let i = start; i < end; i++) {
        arr[target + (i - start)] = arr[i];
    }
    return arr;
}

// concat
function MyConcat(arr, ...args) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        result.push(arr[i]);
    }
    for (let i = 0; i < args.length; i++) {
        if (Array.isArray(args[i])) {
            for (let j = 0; j < args[i].length; j++) {
                result.push(args[i][j]);
            }
        } else {
            result.push(args[i]);
        }
    }
    return result;
}

// slice
function MySlice(arr, start, end) {
    let result = [];
    for (let i = start; i < end; i++) {
        result.push(arr[i]);
    }
    return result;
}

// indexOf

function MyIndexOf(arr, value) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === value) {
            return i;
        }
    }
    return -1;
}

// lastIndexOf

function MyLastIndexOf(arr, value) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === value) {
            return i;
        }
    }
    return -1;
}


// includes
function MyIncludes(arr, value) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === value) {
            return true;
        }
    }
    return false;
}

// find
function MyFind(arr, callback) {
    for (let i = 0; i < arr.length; i++) {
        if (callback(arr[i], i, arr)) {
            return arr[i];
        }
    }
    return undefined;
}

// findIndex
function MyFindIndex(arr, callback) {
    for (let i = 0; i < arr.length; i++) {
        if (callback(arr[i], i, arr)) {
            return i;
        }
    }
    return -1;
}


// every
function MyEvery(arr, callback) {
    for (let i = 0; i < arr.length; i++) {
        if (!callback(arr[i], i, arr)) {
            return false;
        }
    }
    return true;
}

// some
function MySome(arr, callback) {
    for (let i = 0; i < arr.length; i++) {
        if (callback(arr[i], i, arr)) {
            return true;
        }
    }
    return false;
}

// filter
function MyFilter(arr, callback) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        if (callback(arr[i], i, arr)) {
            result.push(arr[i]);
        }
    }
    return result;
}

// flat（depth 默认 1，与 Array.prototype.flat 一致；传 Infinity 可全展开）
function MyFlat(arr, depth) {
    const d = depth === undefined ? 1 : depth;
    if (d <= 0) return arr.slice();
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            result.push(...MyFlat(arr[i], d - 1));
        } else {
            result.push(arr[i]);
        }
    }
    return result;
}

// forEach
function MyForEach(arr, callback) {
    for (let i = 0; i < arr.length; i++) {
        callback(arr[i], i, arr);
    }
}

// map
function MyMap(arr, callback) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        result.push(callback(arr[i], i, arr));
    }
    return result;
}

// reduce（未传 initialValue 时从 i=1 起，第一项作初始累加器）
function MyReduce(arr, callback, initialValue) {
    if (arr.length === 0 && arguments.length < 3) {
        throw new TypeError('Reduce of empty array with no initial value');
    }
    let i = 0;
    let accumulator = initialValue;
    if (arguments.length < 3) {
        accumulator = arr[0];
        i = 1;
    }
    for (; i < arr.length; i++) {
        accumulator = callback(accumulator, arr[i], i, arr);
    }
    return accumulator;
}

// 浅拷贝
function MyShallowCopy(obj) {
    let result = {};
    for (let key in obj) {
        result[key] = obj[key];
    }
    return result;
}

// ========== 深拷贝（Deep Clone）==========
//
// 【定义】
// 深拷贝：产生一份与源数据「值相等但存储独立」的副本；若属性值仍是对象/数组，
// 会递归复制其内部数据，修改副本不会影响源对象中对应嵌套对象的值。
// 与浅拷贝区别：浅拷贝只复制第一层键，嵌套对象仍共享同一引用。
//
// 【无法 / 难以完美克隆的典型情况】
// - 函数、Symbol 属性：JSON 方案会丢；手写需按需求拷贝或跳过
// - 循环引用：对象 A 通过属性间接指向自身，需 WeakMap 记录已克隆节点
// - 特殊对象：Date、RegExp、Map、Set、ArrayBuffer、类实例的原型链等需分支处理
// - 不可枚举属性、getter/setter：简单递归可能只拷可枚举自有属性
//
// ---------------------------------------------------------------------------
// 方法一：JSON（仅适合「纯 JSON 数据」：无函数、无 undefined、无 Symbol、无循环引用）
// 缺点：Date → 字符串；NaN/Infinity → null；Map/Set/函数丢失
// ---------------------------------------------------------------------------
function MyDeepCloneJSON(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// ---------------------------------------------------------------------------
// 方法二：递归 + WeakMap（处理普通对象、数组、Date、RegExp、循环引用）
// 思路：visited 记录「原对象 → 已创建的副本」，再次遇到同一引用时直接返回副本
// ---------------------------------------------------------------------------
function MyDeepCloneRecursive(obj, visited = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (visited.has(obj)) {
        return visited.get(obj);
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (obj instanceof RegExp) {
        return new RegExp(obj.source, obj.flags);
    }
    if (Array.isArray(obj)) {
        const arr = [];
        visited.set(obj, arr);
        for (let i = 0; i < obj.length; i++) {
            arr[i] = MyDeepCloneRecursive(obj[i], visited);
        }
        return arr;
    }
    // 普通对象（含 plain object）；不处理 Map/Set 时可走此分支
    const out = Object.create(Object.getPrototypeOf(obj));
    visited.set(obj, out);
    const keys = Reflect.ownKeys(obj);
    for (const key of keys) {
        const desc = Object.getOwnPropertyDescriptor(obj, key);
        if (!desc) continue;
        if ('value' in desc) {
            Object.defineProperty(out, key, {
                ...desc,
                value: MyDeepCloneRecursive(desc.value, visited),
            });
        } else {
            Object.defineProperty(out, key, desc);
        }
    }
    return out;
}

// ---------------------------------------------------------------------------
// 方法三：structuredClone（浏览器 / Node 17+ 内置，能力介于 JSON 与手写之间）
// 支持：循环引用、Date、RegExp、Map、Set、ArrayBuffer、部分 TypedArray 等
// 不支持：函数、原型链上的行为、某些 DOM/Node 宿主对象
// ---------------------------------------------------------------------------
function MyDeepCloneStructured(obj) {
    if (typeof structuredClone !== 'function') {
        throw new TypeError('structuredClone is not available in this environment');
    }
    return structuredClone(obj);
}

// ---------------------------------------------------------------------------
// 方法四：Map / Set 显式分支（在方法二基础上扩展，演示思路）
// ---------------------------------------------------------------------------
function MyDeepCloneWithCollections(obj, visited = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (visited.has(obj)) {
        return visited.get(obj);
    }
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);

    if (obj instanceof Map) {
        const m = new Map();
        visited.set(obj, m);
        for (const [k, v] of obj) {
            m.set(MyDeepCloneWithCollections(k, visited), MyDeepCloneWithCollections(v, visited));
        }
        return m;
    }
    if (obj instanceof Set) {
        const s = new Set();
        visited.set(obj, s);
        for (const v of obj) {
            s.add(MyDeepCloneWithCollections(v, visited));
        }
        return s;
    }
    if (Array.isArray(obj)) {
        const arr = [];
        visited.set(obj, arr);
        for (let i = 0; i < obj.length; i++) {
            arr[i] = MyDeepCloneWithCollections(obj[i], visited);
        }
        return arr;
    }
    const out = Object.create(Object.getPrototypeOf(obj));
    visited.set(obj, out);
    for (const key of Reflect.ownKeys(obj)) {
        const desc = Object.getOwnPropertyDescriptor(obj, key);
        if (!desc) continue;
        if ('value' in desc) {
            Object.defineProperty(out, key, {
                ...desc,
                value: MyDeepCloneWithCollections(desc.value, visited),
            });
        } else {
            Object.defineProperty(out, key, desc);
        }
    }
    return out;
}

// 数组去重（多种写法，避免同名覆盖）
function MyUniqueBySet(arr) {
    return [...new Set(arr)];
}

function MyUniqueByFilter(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}

function MyUniqueByReduce(arr) {
    return arr.reduce((acc, item) => (acc.includes(item) ? acc : [...acc, item]), []);
}

// apply / call：用 Symbol 临时属性，避免覆盖 context 上已有的 fn；this 用 globalThis 兼容 Node
const __protoCallKey = Symbol('__call_apply__');

Function.prototype.myApply = function (context, args) {
    if (typeof this !== 'function') {
        throw new TypeError('myApply called on non-function');
    }
    const ctx = context == null ? globalThis : Object(context);
    ctx[__protoCallKey] = this;
    try {
        const list = args == null ? [] : Array.from(args);
        return ctx[__protoCallKey](...list);
    } finally {
        delete ctx[__protoCallKey];
    }
};

Function.prototype.myCall = function (context, ...args) {
    if (typeof this !== 'function') {
        throw new TypeError('myCall called on non-function');
    }
    const ctx = context == null ? globalThis : Object(context);
    ctx[__protoCallKey] = this;
    try {
        return ctx[__protoCallKey](...args);
    } finally {
        delete ctx[__protoCallKey];
    }
};

Function.prototype.myBind = function (context, ...bound) {
    if (typeof this !== 'function') {
        throw new TypeError('myBind called on non-function');
    }
    const fn = this;
    const boundFn = function (...rest) {
        if (new.target !== undefined) {
            const obj = Object.create(fn.prototype);
            const r = fn.apply(obj, [...bound, ...rest]);
            return r != null && (typeof r === 'object' || typeof r === 'function') ? r : obj;
        }
        return fn.apply(context == null ? globalThis : context, [...bound, ...rest]);
    };
    if (fn.prototype) {
        boundFn.prototype = Object.create(fn.prototype);
    }
    boundFn.prototype.constructor = boundFn;
    return boundFn;
};

// 千分位：只对整数部分加分隔符，避免小数点参与 len / match 出错
function format(n) {
    const str = String(n);
    const dot = str.indexOf('.');
    let intPart = dot === -1 ? str : str.slice(0, dot);
    const decPart = dot === -1 ? '' : str.slice(dot);
    if (intPart.length <= 3) return str;
    const remainder = intPart.length % 3;
    const head = remainder ? intPart.slice(0, remainder) : '';
    const body = intPart.slice(remainder);
    const groups = body.match(/\d{3}/g);
    const joined = (head ? head + ',' : '') + (groups ? groups.join(',') : '');
    return joined + decPart;
}
// format(12323.33) === '12,323.33'

function jsonToTree(data) {
    // 初始化结果数组，并判断输入数据的格式
    let result = []
    if (!Array.isArray(data)) {
        return result
    }
    // 使用map，将当前对象的id与当前对象对应存储起来
    let map = {};
    data.forEach(item => {
        map[item.id] = item;
    });
    // 
    data.forEach(item => {
        let parent = map[item.pid];
        if (parent) {
            (parent.children || (parent.children = [])).push(item);
        } else {
            result.push(item);
        }
    });
    return result;
}


function parseParam(url) {
    const m = /.+\?(.+)$/.exec(url);
    if (!m) return {};
    const paramsStr = m[1];
    const paramsArr = paramsStr.split('&'); // 将字符串以 & 分割后存到数组中
    let paramsObj = {};
    // 将 params 存到对象中
    paramsArr.forEach(param => {
        if (/=/.test(param)) { // 处理有 value 的参数
            let [key, val] = param.split('='); // 分割 key 和 value
            val = decodeURIComponent(val); // 解码
            val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字
            if (paramsObj.hasOwnProperty(key)) { // 如果对象有 key，则添加一个值
                paramsObj[key] = [].concat(paramsObj[key], val);
            } else { // 如果对象没有这个 key，创建 key 并设置值
                paramsObj[key] = val;
            }
        } else { // 处理没有 value 的参数
            paramsObj[param] = true;
        }
    })
    return paramsObj;
}


// promise

class MyPromise {
    constructor(executor) {
        this.status = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        const resolve = (value) => {
            if (value instanceof MyPromise) {
                return value.then(resolve, reject);
            }
            setTimeout(() => {
                if (this.status === 'pending') {
                    this.status = 'fulfilled';
                    this.value = value;
                    this.onFulfilledCallbacks.forEach(fn => fn());
                }
            }, 0);
        };
        const reject = (reason) => {
            setTimeout(() => {
                if (this.status === 'pending') {
                    this.status = 'rejected';
                    this.reason = reason;
                    this.onRejectedCallbacks.forEach(fn => fn());
                }
            }, 0);
        };
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }
    then(onFulfilled, onRejected) {
        const f = typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
        const rj = typeof onRejected === 'function' ? onRejected : (e) => { throw e; };
        return new MyPromise((resolve, reject) => {
            function resolveHandler(value) {
                try {
                    const result = f(value);
                    return result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
                } catch (error) {
                    reject(error);
                }
            }
            function rejectHandler(reason) {
                try {
                    const result = rj(reason);
                    return result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
                } catch (error) {
                    reject(error);
                }
            }
            if (this.status === 'fulfilled') {
                resolveHandler(this.value);
            } else if (this.status === 'rejected') {
                rejectHandler(this.reason);
            } else {
                this.onFulfilledCallbacks.push(resolveHandler);
                this.onRejectedCallbacks.push(rejectHandler);
            }
        })
    }
}

MyPromise.resolve = function (x) {
    if (x instanceof MyPromise) return x;
    return new MyPromise((resolve) => resolve(x));
};

// promise.all
function MyPromiseAll(promises) {
    return new MyPromise((resolve, reject) => {
        if (promises.length === 0) {
            resolve([]);
            return;
        }
        let failed = false;
        const result = [];
        let count = 0;
        promises.forEach((promise, index) => {
            MyPromise.resolve(promise).then(
                (value) => {
                    if (failed) return;
                    result[index] = value;
                    count += 1;
                    if (count === promises.length) resolve(result);
                },
                (reason) => {
                    if (failed) return;
                    failed = true;
                    reject(reason);
                }
            );
        });
    });
}

// promise.allSettled
function MyPromiseAllSettled(promises) {
    return new MyPromise((resolve) => {
        if (promises.length === 0) {
            resolve([]);
            return;
        }
        const result = [];
        let count = 0;
        const done = () => {
            count += 1;
            if (count === promises.length) resolve(result);
        };
        promises.forEach((promise, index) => {
            MyPromise.resolve(promise).then(
                (value) => {
                    result[index] = { status: 'fulfilled', value };
                    done();
                },
                (reason) => {
                    result[index] = { status: 'rejected', reason };
                    done();
                }
            );
        });
    });
}

// promise.race（空数组时与原生一致：永远 pending；先 settle 的胜出）
function MyPromiseRace(promises) {
    return new MyPromise((resolve, reject) => {
        let settled = false;
        const win = (fn) => (x) => {
            if (!settled) {
                settled = true;
                fn(x);
            }
        };
        for (let i = 0; i < promises.length; i += 1) {
            MyPromise.resolve(promises[i]).then(win(resolve), win(reject));
        }
    });
}

// promise.any（任一 fulfilled 即 resolve；全 reject 则 AggregateError）
function MyPromiseAny(promises) {
    return new MyPromise((resolve, reject) => {
        if (promises.length === 0) {
            reject(new AggregateError([], 'All promises were rejected'));
            return;
        }
        let done = false;
        const errors = new Array(promises.length);
        let rejected = 0;
        promises.forEach((promise, index) => {
            MyPromise.resolve(promise).then(
                (value) => {
                    if (!done) {
                        done = true;
                        resolve(value);
                    }
                },
                (err) => {
                    if (done) return;
                    errors[index] = err;
                    rejected += 1;
                    if (rejected === promises.length) {
                        reject(new AggregateError(errors, 'All promises were rejected'));
                    }
                }
            );
        });
    });
}