/**
 * 滴滴前端面试 - 常见 10 道手写代码题
 * 
 * 整理自：滴滴前端一面、二面高频手写题
 * 难度：中等
 * 优先级：🔥🔥🔥 必考
 */

// ============================================
// 题目 1：手写防抖函数（Debounce）
// ============================================

/**
 * 防抖：触发事件后，n 秒后才执行，如果 n 秒内又触发，则重新计时
 * 应用场景：搜索框输入、窗口 resize
 */

function debounce(fn, delay) {
    let timer = null;

    return function (...args) {
        // 清除之前的定时器
        if (timer) clearTimeout(timer);

        // 重新计时
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// 测试
const handleInput = debounce((value) => {
    console.log('搜索:', value);
}, 500);

// handleInput('滴滴');
// handleInput('滴滴出行');
// handleInput('滴滴出行面试');  // 只有最后一次会执行


// ============================================
// 题目 2：手写节流函数（Throttle）
// ============================================

/**
 * 节流：连续触发事件，但在 n 秒中只执行一次
 * 应用场景：滚动加载、鼠标移动
 */

function throttle(fn, interval) {
    let lastTime = 0;

    return function (...args) {
        const now = Date.now();

        if (now - lastTime >= interval) {
            lastTime = now;
            fn.apply(this, args);
        }
    };
}

// 测试
const handleScroll = throttle(() => {
    console.log('滚动事件触发');
}, 1000);

// window.addEventListener('scroll', handleScroll);


// ============================================
// 题目 3：手写深拷贝（Deep Clone）
// ============================================

/**
 * 深拷贝：递归拷贝所有层级
 * 注意：循环引用、Date、RegExp、Map、Set 等特殊对象
 */

function deepClone(obj, hash = new WeakMap()) {
    // null 或非对象类型，直接返回
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // 处理循环引用
    if (hash.has(obj)) {
        return hash.get(obj);
    }

    // 处理 Date
    if (obj instanceof Date) {
        return new Date(obj);
    }

    // 处理 RegExp
    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }

    // 处理 Map
    if (obj instanceof Map) {
        const cloneMap = new Map();
        hash.set(obj, cloneMap);
        obj.forEach((value, key) => {
            cloneMap.set(deepClone(key, hash), deepClone(value, hash));
        });
        return cloneMap;
    }

    // 处理 Set
    if (obj instanceof Set) {
        const cloneSet = new Set();
        hash.set(obj, cloneSet);
        obj.forEach(value => {
            cloneSet.add(deepClone(value, hash));
        });
        return cloneSet;
    }

    // 处理普通对象和数组
    const cloneObj = new obj.constructor();
    hash.set(obj, cloneObj);

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloneObj[key] = deepClone(obj[key], hash);
        }
    }

    return cloneObj;
}

// 测试
const obj = {
    name: '滴滴',
    info: { age: 10 },
    hobbies: ['出行', '科技'],
    date: new Date(),
    reg: /test/g
};
const cloned = deepClone(obj);
// console.log(cloned);


// ============================================
// 题目 4：手写 Promise
// ============================================

/**
 * 手写 Promise：实现基本的 Promise 功能
 * 包括：状态管理、then 链式调用、catch、finally
 */

class MyPromise {
    constructor(executor) {
        this.state = 'pending';  // pending、fulfilled、rejected
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

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        // 参数校验
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

        const promise2 = new MyPromise((resolve, reject) => {
            const fulfilled = () => {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(this.value);
                        this.resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            };

            const rejected = () => {
                setTimeout(() => {
                    try {
                        const x = onRejected(this.reason);
                        this.resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            };

            if (this.state === 'fulfilled') {
                fulfilled();
            } else if (this.state === 'rejected') {
                rejected();
            } else {
                this.onFulfilledCallbacks.push(fulfilled);
                this.onRejectedCallbacks.push(rejected);
            }
        });

        return promise2;
    }

    resolvePromise(promise2, x, resolve, reject) {
        if (promise2 === x) {
            return reject(new TypeError('循环引用'));
        }

        if (x instanceof MyPromise) {
            x.then(resolve, reject);
        } else {
            resolve(x);
        }
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    finally(onFinally) {
        return this.then(
            value => {
                onFinally();
                return value;
            },
            reason => {
                onFinally();
                throw reason;
            }
        );
    }

    static resolve(value) {
        return new MyPromise(resolve => resolve(value));
    }

    static reject(reason) {
        return new MyPromise((_, reject) => reject(reason));
    }

    static all(promises) {
        return new MyPromise((resolve, reject) => {
            const result = [];
            let count = 0;

            promises.forEach((promise, index) => {
                Promise.resolve(promise).then(
                    value => {
                        result[index] = value;
                        count++;
                        if (count === promises.length) {
                            resolve(result);
                        }
                    },
                    reject
                );
            });
        });
    }
}

// 测试
// const p = new MyPromise((resolve, reject) => {
//   setTimeout(() => resolve('滴滴面试'), 1000);
// });
// p.then(res => console.log(res));


// ============================================
// 题目 5：手写 call、apply、bind
// ============================================

/**
 * call：立即执行，参数列表
 * apply：立即执行，参数数组
 * bind：返回函数，参数列表
 */

// 手写 call
Function.prototype.myCall = function (context, ...args) {
    context = context || window;

    const fn = Symbol();
    context[fn] = this;

    const result = context[fn](...args);
    delete context[fn];

    return result;
};

// 手写 apply
Function.prototype.myApply = function (context, args) {
    context = context || window;

    const fn = Symbol();
    context[fn] = this;

    const result = context[fn](...args);
    delete context[fn];

    return result;
};

// 手写 bind
Function.prototype.myBind = function (context, ...args1) {
    const fn = this;

    const boundFn = function (...args2) {
        // 作为构造函数调用时，this 指向实例
        return fn.apply(
            this instanceof boundFn ? this : context,
            [...args1, ...args2]
        );
    };

    // 继承原型
    boundFn.prototype = Object.create(fn.prototype);

    return boundFn;
};

// 测试
const person = { name: '滴滴' };
function greet(greeting, punctuation) {
    console.log(greeting + ', ' + this.name + punctuation);
}

// greet.myCall(person, '你好', '！');
// greet.myApply(person, ['你好', '！']);
// greet.myBind(person, '你好')('！');


// ============================================
// 题目 6：手写 new 操作符
// ============================================

/**
 * new 做了什么：
 * 1. 创建一个空对象
 * 2. 链接到原型
 * 3. 绑定 this
 * 4. 返回新对象
 */

function myNew(constructor, ...args) {
    // 1. 创建空对象，链接到原型
    const obj = Object.create(constructor.prototype);

    // 2. 绑定 this，执行构造函数
    const result = constructor.apply(obj, args);

    // 3. 如果构造函数返回对象，则返回该对象；否则返回新对象
    return result instanceof Object ? result : obj;
}

// 测试
function Person(name, age) {
    this.name = name;
    this.age = age;
}

// const p = myNew(Person, '滴滴', 10);
// console.log(p);  // Person { name: '滴滴', age: 10 }


// ============================================
// 题目 7：手写 instanceof
// ============================================

/**
 * instanceof：判断对象是否是某个构造函数的实例
 * 原理：沿着原型链查找
 */

function myInstanceof(obj, constructor) {
    // 获取对象的原型
    let proto = Object.getPrototypeOf(obj);

    // 获取构造函数的原型
    const prototype = constructor.prototype;

    // 沿着原型链查找
    while (proto) {
        if (proto === prototype) {
            return true;
        }
        proto = Object.getPrototypeOf(proto);
    }

    return false;
}

// 测试
// console.log(myInstanceof([], Array));     // true
// console.log(myInstanceof([], Object));    // true
// console.log(myInstanceof([], Function));  // false


// ============================================
// 题目 8：数组扁平化（flatten）
// ============================================

/**
 * 数组扁平化：将多维数组转换为一维数组
 */

// 方法 1：递归
function flatten1(arr) {
    const result = [];

    arr.forEach(item => {
        if (Array.isArray(item)) {
            result.push(...flatten1(item));
        } else {
            result.push(item);
        }
    });

    return result;
}

// 方法 2：reduce
function flatten2(arr) {
    return arr.reduce((acc, val) => {
        return acc.concat(Array.isArray(val) ? flatten2(val) : val);
    }, []);
}

// 方法 3：while 迭代
function flatten3(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}

// 方法 4：ES6 flat
function flatten4(arr) {
    return arr.flat(Infinity);
}

// 测试
const arr = [1, [2, [3, [4]]]];
// console.log(flatten1(arr));  // [1, 2, 3, 4]
// console.log(flatten2(arr));  // [1, 2, 3, 4]
// console.log(flatten3(arr));  // [1, 2, 3, 4]
// console.log(flatten4(arr));  // [1, 2, 3, 4]


// ============================================
// 题目 9：数组去重
// ============================================

/**
 * 数组去重：移除数组中的重复元素
 */

// 方法 1：Set
function unique1(arr) {
    return [...new Set(arr)];
}

// 方法 2：filter + indexOf
function unique2(arr) {
    return arr.filter((item, index) => {
        return arr.indexOf(item) === index;
    });
}

// 方法 3：reduce
function unique3(arr) {
    return arr.reduce((acc, val) => {
        if (!acc.includes(val)) {
            acc.push(val);
        }
        return acc;
    }, []);
}

// 方法 4：Map（适用于对象数组）
function unique4(arr, key) {
    const map = new Map();
    return arr.filter(item => {
        const val = key ? item[key] : item;
        return !map.has(val) && map.set(val, 1);
    });
}

// 测试
const arr1 = [1, 2, 2, 3, 3, 3];
// console.log(unique1(arr1));  // [1, 2, 3]
// console.log(unique2(arr1));  // [1, 2, 3]
// console.log(unique3(arr1));  // [1, 2, 3]

const arr2 = [{ id: 1 }, { id: 1 }, { id: 2 }];
// console.log(unique4(arr2, 'id'));  // [{ id: 1 }, { id: 2 }]


// ============================================
// 题目 10：函数柯里化（Currying）
// ============================================

/**
 * 柯里化：将多参数函数转换为单参数函数
 * 示例：add(1, 2, 3) → add(1)(2)(3)
 */

function curry(fn) {
    return function curried(...args) {
        // 参数足够，执行原函数
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }

        // 参数不够，返回函数继续收集参数
        return function (...args2) {
            return curried.apply(this, [...args, ...args2]);
        };
    };
}

// 测试
function add(a, b, c) {
    return a + b + c;
}

const curriedAdd = curry(add);

// console.log(curriedAdd(1, 2, 3));    // 6
// console.log(curriedAdd(1)(2)(3));    // 6
// console.log(curriedAdd(1, 2)(3));    // 6
// console.log(curriedAdd(1)(2, 3));    // 6


// ============================================
// 附加题：发布订阅模式（EventEmitter）
// ============================================

/**
 * 发布订阅模式：事件的发布和订阅
 */

class EventEmitter {
    constructor() {
        this.events = {};
    }

    // 订阅事件
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        return this;
    }

    // 发布事件
    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(callback => {
                callback.apply(this, args);
            });
        }
        return this;
    }

    // 只订阅一次
    once(event, callback) {
        const wrapper = (...args) => {
            callback.apply(this, args);
            this.off(event, wrapper);
        };

        this.on(event, wrapper);
        return this;
    }

    // 取消订阅
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
        return this;
    }
}

// 测试
const emitter = new EventEmitter();

emitter.on('滴滴面试', (name) => {
    console.log(`${name} 参加了面试`);
});

emitter.emit('滴滴面试', '张三');  // 张三 参加了面试


// ============================================
// 总结
// ============================================

/**
 * 滴滴前端面试高频手写题：
 * 
 * 1. 防抖（Debounce）和节流（Throttle） 🔥🔥🔥
 * 2. 深拷贝（Deep Clone） 🔥🔥🔥
 * 3. 手写 Promise 🔥🔥🔥
 * 4. call、apply、bind 🔥🔥🔥
 * 5. new 操作符 🔥🔥
 * 6. instanceof 🔥🔥
 * 7. 数组扁平化 🔥🔥
 * 8. 数组去重 🔥🔥
 * 9. 函数柯里化 🔥🔥
 * 10. 发布订阅模式 🔥🔥
 * 
 * 面试技巧：
 * - 手写题要理解原理，不要死记硬背
 * - 要能说出应用场景
 * - 要注意边界情况（如深拷贝的循环引用）
 * - 要能说出优化方案
 */
