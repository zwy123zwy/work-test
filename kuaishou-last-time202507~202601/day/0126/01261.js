// 
function compose(...fns) {
    return function (x) {
        return fns.reduceRight((y, f) => f(y), x);
    };
}// 实现函数组合 compose，使得 compose(f, g, h)(x) 等同于 f(g(h(x)))。

// 示例用法：
const add1 = x => x + 1;
const mul2 = x => x * 2;
const sub3 = x => x - 3;

const composedFn = compose(add1, mul2, sub3);
console.log(composedFn(5)); // 输出：5
// 计算过程：sub3(5) -> 2, mul2(2) -> 4, add1(4) -> 5


// instanceof
function myInstanceof(left, right) {
    let proto = Object.getPrototypeOf(left);
    while (true) {
        if (proto === null) return false;
        if (proto === right.prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
}

// apply
function myApply(context, args) {
    context = context || window;
    context.fn = this;
    let result;
    result = context.fn(...args);
    delete context.fn;
    return result;
}

// bind
function myBind(context, ...args1) {
    context = context || window;
    context.fn = this;
    return function (...args2) {
        const result = context.fn(...args1, ...args2);
        delete context.fn;
        return result;
    };
}


// call
function myCall(context, ...args) {
    context = context || window;
    context.fn = this;
    let result = context.fn(...args);
    delete context.fn;
    return result;
}

// lis
function longestSubstring(s) {
    let map = new Map();
    let left = 0;
    let right = 0;
    let res = 0;
    while (right < s.length) {
        if (map.has(s[right])) {
            left = Math.max(left, map.get(s[right]) + 1);
        }
        map.set(s[right], right);
        res = Math.max(res, right - left + 1);
    }
    return res;
}



// deepClone
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


