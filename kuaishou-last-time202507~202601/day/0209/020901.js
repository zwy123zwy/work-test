/**
 * 020901 JS 面试代码题（20 道）
 * 日期：2026-02-09
 * 规则：仅题干与约束，个人完成后再补充解答与测试用例。
 */

// ==================== 1. 手写防抖 ====================
// debounce(fn, wait)，wait 毫秒内无新调用才执行；支持 cancel() 取消防抖。

// 实现：

function debounce(fn, wait) {
    let timer = null;
    const debounced = function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), wait);
    };
    debounced.cancel = () => { clearTimeout(timer); timer = null; };
    return debounced;
}

// ==================== 2. 手写节流 ====================
// throttle(fn, wait)，每 wait 毫秒最多执行一次，支持 trailing（停止后执行最后一次）。

// 实现：

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

// ==================== 3. 手写 bind ====================
// 挂到 Function.prototype.myBind(thisArg, ...args)，返回的函数作为构造函数 new 时 this 指向新实例。

// 实现：

Function.prototype.myBind = function (thisArg, ...args) {
    const fn = this;
    const bound = function (...args2) {
        return fn.apply(this instanceof bound ? this : thisArg, args.concat(args2));
    };
    bound.prototype = Object.create(fn.prototype);
    return bound;
};

// ==================== 4. 手写深拷贝 ====================
// deepClone(obj)，支持 Date、RegExp、循环引用（WeakMap），不依赖 JSON。

// 实现：

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

// ==================== 5. 手写 flat ====================
// flat(arr, depth)，depth 默认 1，支持 Infinity，不改变原数组。

// 实现：
function flat(arr, depth = 1) {
    return arr.reduce((acc, item) => {
        if (Array.isArray(item) && depth > 0) {
            return acc.concat(flat(item, depth - 1));
        }
        return acc.concat(item);
    }, []);
}

// ==================== 6. 手写浅比较 ====================
// equal(a, b)，只比较一层 key，值用 ===，支持数组同下标同值。

// 实现：
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

// ==================== 7. 手写 Promise.allSettled ====================
// allSettled(promises)，返回 Promise<Array<{status, value?|reason?}>>，全部结束才 resolve，不 reject。

// 实现：
function allSettled(promises) {
    return Promise.all(promises.map(promise => Promise.resolve(promise).then(value => ({ status: 'fulfilled', value }), reason => ({ status: 'rejected', reason }))));
}


// ==================== 8. 手写柯里化求和 ====================
// sum(1)(2)(3)() === 6，支持 sum(1,2)(3)() 等形式，空调用返回累加结果。

// 实现：
function sum(...init) {
    const nums = [...init];
    const fn = (...more) => {
        if (more.length === 0) return nums.reduce((a, b) => a + b, 0);
        return sum(...nums, ...more);
    };
    return fn;
}

// ==================== 9. 手写 filter ====================
// myFilter(arr, fn)，fn(item, i, arr) 返回布尔，不改变原数组。

// 实现：

function myFilter(arr, fn) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        if (fn(arr[i], i, arr)) {
            result.push(arr[i]);
        }
    }
    return result;
}

// ==================== 10. 千分位格式化 ====================
// formatNum(1234567.89) => "1,234,567.89"，小数部分不插逗号。

// 实现：
function formatNum(num) {
    let numStr = num.toString();
    let parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

// ==================== 11. 驼峰转下划线 ====================
// camelToSnake('getUserInfo') => 'get_user_info'。

// 实现：

function camelToSnake(str) {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

// ==================== 12. 下划线转驼峰 ====================
// snakeToCamel('get_user_info') => 'getUserInfo'。

// 实现：

function snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// ==================== 13. 扁平数组转树 ====================
// flatToTree(items, idKey, pidKey, childrenKey)，idKey 默认 'id'，pidKey 默认 'parentId'，childrenKey 默认 'children'。根节点 parentId 为 null/undefined。

// 实现：

function flatToTree(items, idKey = 'id', pidKey = 'parentId', childrenKey = 'children') {
    const map = new Map();
    let result = [];
    for (let item of items) {
        map.set(item[idKey], item);
    }
    for (let item of items) {
        if (item[pidKey] === null || item[pidKey] === undefined) {
            result.push(item);
        } else {
            let parent = map.get(item[pidKey]);
            if (parent) {
                (parent[childrenKey] || (parent[childrenKey] = [])).push(item);
            }
        }
    }
    return result;
}

// ==================== 14. 大数相加 ====================
// addBigInt(a, b)，a、b 为数字字符串，返回和的字符串。不直接用 BigInt。

// 实现：

function addBigInt(a, b) {
    let maxLength = Math.max(a.length, b.length);
    a = a.padStart(maxLength, '0');
    b = b.padStart(maxLength, '0');
    let carry = 0;
    let result = '';
    for (let i = maxLength - 1; i >= 0; i--) {
        const sum = parseInt(a[i], 10) + parseInt(b[i], 10) + carry;
        carry = sum > 9 ? 1 : 0;
        result = (sum % 10) + result;
    }
    if (carry) result = carry + result;
    return result;
}

// ==================== 15. 手写 Object.assign（简化版） ====================
// myAssign(target, ...sources)，将 sources 的可枚举自有属性复制到 target，返回 target。

// 实现：

function myAssign(target, ...sources) {
    for (const source of sources) {
        if (source == null) continue;
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
        }
    }
    return target;
}

// ==================== 16. 手写 repeat ====================
// repeat(str, n)，返回 str 重复 n 次的新字符串。n 为 0 返回 ''。

// 实现：
function repeat(str, n) {
    if (n <= 0) return '';
    let s = '';
    for (let i = 0; i < n; i++) s += str;
    return s;
}

// ==================== 17. 手写 trim ====================
// myTrim(str)，去除首尾空白（空格、\t、\n 等）。

// 实现：

function myTrim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

// ==================== 18. 手写 maxBy ====================
// maxBy(arr, fn)，fn(item) 返回用于比较的值，返回 arr 中该值最大的项；空数组返回 undefined。

// 实现：


function maxBy(arr, fn) {
    if (arr.length === 0) return undefined;
    return arr.reduce((best, item) => {
        if (best === undefined) return item;
        return fn(item) > fn(best) ? item : best;
    }, undefined);
}
// ==================== 19. 手写 groupBy ====================
// groupBy(arr, fn)，fn(item) 返回 key，返回 { [key]: [items] }。

// 实现：


function groupBy(arr, fn) {
    return arr.reduce((acc, item) => {
        const key = fn(item);
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
    }, {});
}

// ==================== 20. 手写 once ====================
// once(fn)，返回新函数，多次调用只执行第一次，后续返回第一次的结果。

// 实现：
function once(fn) {
    let called = false;
    let result;
    return function (...args) {
        if (!called) {
            called = true;
            result = fn.apply(this, args);
        }
        return result;
    };
}

