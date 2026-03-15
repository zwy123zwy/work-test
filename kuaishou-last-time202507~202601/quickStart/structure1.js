// instance of
function myInstanceOf(left, right) {
    let proto = Object.getPrototypeOf(left);
    while (true) {
        if (proto === null) return false;
        if (proto === right.prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
}


// new
function myNew(constructor, ...args) {
    let obj = Object.create(constructor.prototype);
    let result = constructor.apply(obj, args);
    return result instanceof Object ? result : obj;

}

// object create
function myCreate(proto, propertiesObject) {
    function F() { }
    F.prototype = proto;
    let obj = new F();
    if (propertiesObject !== undefined) {
        Object.defineProperties(obj, propertiesObject);
    }
    return obj;
}


// object is

function myIs(x, y) {
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    }
    return x !== x && y !== y;
}

// array push
Array.prototype.myPush = function (...args) {
    for (let i = 0; i < args.length; i++) {
        this[this.length] = args[i];
    }
    return this.length;
}

// array pop
Array.prototype.myPop = function () {
    if (this.length === 0) {
        return undefined;
    }
    let result = this[this.length - 1];
    delete this[this.length - 1];
    this.length--;
    return result;
}

// array shift
Array.prototype.myShift = function () {
    if (this.length === 0) {
        return undefined;
    }
    let result = this[0];
    for (let i = 1; i < this.length; i++) {
        this[i - 1] = this[i];
    }
    delete this[this.length - 1];
    this.length--;
    return result;
}


// array unshift

Array.prototype.myUnshift = function (...args) {
    for (let i = this.length - 1; i >= 0; i--) {
        this[i + args.length] = this[i];
    }
    for (let i = 0; i < args.length; i++) {
        this[i] = args[i];
    }
    return this.length;
}


// keys
Array.prototype.myKeys = function () {
    let result = [];
    for (let i = 0; i < this.length; i++) {
        result.push(i);
    }
    return result;
}

// values

Array.prototype.myValues = function () {
    let result = [];
    for (let i = 0; i < this.length; i++) {
        result.push(this[i]);
    }
    return result;
}

// array entries

Array.prototype.myEntries = function () {
    let result = [];
    for (let i = 0; i < this.length; i++) {
        result.push([i, this[i]]);
    }
    return result;
}

// array reverse
Array.prototype.myReverse = function () {
    for (let i = 0; i < this.length / 2; i++) {
        let temp = this[i];
        this[i] = this[this.length - 1 - i];
        this[this.length - 1 - i] = temp;
    }
}

// array sort
Array.prototype.mySort = function (compareFn) {
    for (let i = 0; i < this.length - 1; i++) {
        for (let j = 0; j < this.length - 1 - i; j++) {
            if (compareFn(this[j], this[j + 1]) > 0) {
                let temp = this[j];
                this[j] = this[j + 1];
                this[j + 1] = temp;
            }
        }
    }
    return this;
}

//冒泡排序

function bubbleSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
    return arr;
}

// 选择排序

function selectionSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let indexMin = i;
        for (let j = i; j < arr.length; j++) {
            if (arr[j] < arr[indexMin]) {
                indexMin = j;
            }
        }
        if (indexMin !== i) {
            let temp = arr[i];
            arr[i] = arr[indexMin];
            arr[indexMin] = temp;
        }
    }
    return arr;
}


// 插入排序

function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let j = i - 1;
        let temp = arr[i];
        while (j >= 0 && arr[j] > temp) {
            arr[j + 1] = arr[j];
            j--;
        }
    }
    return arr;
}

// 快速排序

function quickSort(arr) {
    if (arr.length < 2) {
        return arr;
    }
    let left = [];
    let right = [];
    let mid = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < mid) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return [...quickSort(left), mid, ...quickSort(right)];

}

// array includes
Array.prototype.myIncludes = function (searchElement, fromIndex = 0) {
    for (let i = fromIndex; i < this.length; i++) {
        if (this[i] === searchElement) {
            return true;
        }
    }
    return false;
}

// array indexOf
Array.prototype.myIndexOf = function (searchElement, fromIndex = 0) {
    for (let i = fromIndex; i < this.length; i++) {
        if (this[i] === searchElement) {
            return i;
        }
    }
    return -1;
}


// array concat

Array.prototype.myConcat = function (...args) {
    let result = [];
    for (let i = 0; i < this.length; i++) {
        result.push(this[i]);
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

// array slice
Array.prototype.mySlice = function (start, end) {
    let result = [];
    for (let i = start; i < end; i++) {
        result.push(this[i]);
    }
    return result;
}

// array splice

Array.prototype.mySplice = function (start, deleteCount, ...args) {
    let result = [];
    for (let i = start; i < start + deleteCount; i++) {
        result.push(this[i]);
        delete this[i];
    }
    for (let i = this.length - 1; i >= start + deleteCount; i--) {
        this[i + args.length] = this[i];
    }
    for (let i = 0; i < args.length; i++) {
        this[start + i] = args[i];
    }
    this.length = this.length - deleteCount + args.length;
    return result;
}


// array reduce
Array.prototype.myReduce = function (callback, initialValue) {
    let result = initialValue;
    for (let i = 0; i < this.length; i++) {
        result = callback(result, this[i], i, this);
    }
    return result;
}

// array reduceRight
Array.prototype.myReduceRight = function (callback, initialValue) {
    let result = initialValue;
    for (let i = this.length - 1; i >= 0; i--) {
        result = callback(result, this[i], i, this);
    }
    return result;
}


// every
Array.prototype.myEvery = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (!callback(this[i], i, this)) {
            return false;
        }
    }
    return true;
}

// some
Array.prototype.mySome = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return true;
        }
    }
    return false;
}

// find 

Array.prototype.myFind = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return this[i];
        }
    }
    return undefined;
}


// filter
Array.prototype.myFilter = function (callback) {
    let result = [];
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            result.push(this[i]);
        }
    }
    return result;
}


// forEach
Array.prototype.myForEach = function (callback) {
    for (let i = 0; i < this.length; i++) {
        callback(this[i], i, this);
    }
}


// map
Array.prototype.myMap = function (callback) {
    let result = [];
    for (let i = 0; i < this.length; i++) {
        result.push(callback(this[i], i, this));
    }
    return result;
}

// fill
Array.prototype.myFill = function (value, start = 0, end = this.length) {
    for (let i = start; i < end; i++) {
        this[i] = value;
    }
    return this;
}


// ==================== 继承 ====================

// 1. 原型链继承（问题：引用属性共享、无法传参）
function Parent() {
    this.name = 'parent';
    this.colors = ['red', 'blue'];
}
function Child1() {
    this.type = 'child1';
}
Child1.prototype = new Parent();
Child1.prototype.constructor = Child1;

// 2. 借用构造函数继承（问题：方法不能复用）
function Child2() {
    Parent.call(this);
    this.type = 'child2';
}

// 3. 组合继承（原型链 + 借用构造，问题：父构造函数执行两次）
function Child3() {
    Parent.call(this);
    this.type = 'child3';
}
Child3.prototype = new Parent();
Child3.prototype.constructor = Child3;

// 4. 原型式继承（基于对象创建新对象）
function createObject(obj) {
    function F() {}
    F.prototype = obj;
    return new F();
}
const person = { name: 'person', friends: ['a', 'b'] };
const person1 = createObject(person);

// 5. 寄生式继承（在原型式基础上增强）
function createAnother(original) {
    const clone = Object.create(original);
    clone.sayHi = function () {
        console.log('hi');
    };
    return clone;
}
const another = createAnother(person);

// 6. 寄生组合继承（推荐，最优）
function inheritPrototype(SubType, SuperType) {
    const prototype = Object.create(SuperType.prototype);
    prototype.constructor = SubType;
    SubType.prototype = prototype;
}
function Child6() {
    Parent.call(this);
    this.type = 'child6';
}
inheritPrototype(Child6, Parent);

// 7. Object.create 实现简单继承
const parentObj = { name: 'parent' };
const childObj = Object.create(parentObj);

// apply

function myApply(context, args) {
    context = context || window;
    context.fn = this;
    let result = context.fn(...args);
    delete context.fn;
    return result;
}

// call
function myCall(context, ...args) {
    context = context || window;
    context.fn = this;
    let result = context.fn(...args);
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
    }
}


// ==================== 防抖 ====================
// 定义：在事件被触发 n 秒后再执行回调，若 n 秒内再次触发则重新计时
// 应用场景：
//   - 搜索框输入联想（用户停止输入后请求）
//   - 窗口 resize（停止拖动后再计算布局）
//   - 表单验证（停止输入后再校验）
//   - 按钮防重复点击
//   - 滚动加载更多
// 使用：debounce(fn, 500) | debounce(fn, 500, { leading: true }) | debounce(fn, 500, { trailing: false })
function debounce(fn, delay, options = {}) {
    const { leading = false, trailing = true } = options; // leading: 首次立即执行  trailing: 最后一次延迟执行
    let timer = null;
    let lastArgs = null;
    let lastThis = null;
    let lastCallTime = null;

    const invoke = () => {
        if (lastArgs !== null && trailing) {
            fn.apply(lastThis, lastArgs);
            lastArgs = null;
            lastThis = null;
        }
        timer = null;
        lastCallTime = null; // 重置，使下次触发可再次 leading
    };

    return function (...args) {
        const now = Date.now();
        const isFirst = lastCallTime === null;
        lastCallTime = now;
        lastArgs = args;
        lastThis = this;

        if (timer) clearTimeout(timer);

        if (leading && isFirst) {
            fn.apply(this, args);
            lastArgs = null;
            lastThis = null;
        }

        timer = setTimeout(invoke, delay);
    };
}

// ==================== 节流 ====================
// 定义：在指定时间间隔内只执行一次，无论触发多少次
// 应用场景：
//   - 滚动加载（滚动时每 200ms 检查一次位置）
//   - 鼠标移动、拖拽（高频事件限频）
//   - 播放器进度条（按固定频率更新）
//   - 瀑布流/虚拟列表（scroll 时节流计算）
// 使用：throttle(fn, 500) | throttle(fn, 500, { leading: true }) | throttle(fn, 500, { trailing: false })
function throttle(fn, delay, options = {}) {
    const { leading = true, trailing = true } = options; // leading: 首次立即执行  trailing: 时间结束时再执行一次
    let lastTime = 0;
    let timer = null;
    let lastArgs = null;
    let lastThis = null;

    const invoke = () => {
        if (lastArgs !== null && trailing) {
            fn.apply(lastThis, lastArgs);
            lastArgs = null;
            lastThis = null;
            lastTime = Date.now();
        }
        timer = null;
    };

    return function (...args) {
        const now = Date.now();

        if (leading && lastTime === 0) {
            fn.apply(this, args);
            lastTime = now;
            return;
        }

        if (now - lastTime >= delay) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            fn.apply(this, args);
            lastTime = now;
        } else if (trailing) {
            lastArgs = args;
            lastThis = this;
            if (!timer) {
                timer = setTimeout(invoke, delay - (now - lastTime));
            }
        }
    };
}

// promise

function myPromise(executor) {
    let self = this;
    self.status = 'pending';
    self.value = undefined;
    self.reason = undefined;
    self.onFulfilledCallbacks = [];
    self.onRejectedCallbacks = [];

    function resolve(value) {
        if (value instanceof myPromise) {
            return value.then(resolve, reject);
        }
        setTimeout(() => {
            if (self.status === 'pending') {
                self.status = 'fulfilled';
                self.value = value;
                self.onFulfilledCallbacks.forEach(fn => fn(value));
            }
        }, 0);
    }

    function reject(reason) {
        if (value instanceof myPromise) {
            return value.then(resolve, reject);
        }
        setTimeout(() => {
            if (self.status === 'pending') {
                self.status = 'rejected';
                self.reason = reason;
                self.onRejectedCallbacks.forEach(fn => fn(reason));
            }
        }, 0);

    }
    function then(onFulfilled, onRejected) {
        return new myPromise((resolve, reject) => {
            if (self.status === 'fulfilled') {
                try {
                    let x = onFulfilled(self.value);
                    if (x instanceof myPromise) {
                        x.then(resolve, reject);
                    } else {
                        resolve(x);
                    }
                } catch (e) {
                    reject(e);
                }
            }
            if (self.status === 'rejected') {
                try {
                    let x = onRejected(self.reason);
                    if (x instanceof myPromise) {
                        x.then(resolve, reject);
                    } else {
                        resolve(x);
                    }
                } catch (e) {
                    reject(e);
                }
            }
            if (self.status === 'pending') {
                self.onFulfilledCallbacks.push(() => {
                    try {   
                        let x = onFulfilled(self.value);
                        if (x instanceof myPromise) {
                            x.then(resolve, reject);
                        } else {
                            resolve(x);
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
                self.onRejectedCallbacks.push(() => {
                    try {
                        let x = onRejected(self.reason);
                        if (x instanceof myPromise) {
                            x.then(resolve, reject);
                        } else {
                            resolve(x);
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        })
    }
}

// promise.all
function myPromiseAll(promises) {
    return new myPromise((resolve, reject) => {
        let count = 0;
        let result = [];
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(res => {
                count++;
                result[i] = res;    
                if (count === promises.length) {
                    resolve(result);
                }
            }, err => reject(err))
        }
    })
}

// promise.race
function myPromiseRace(promises) {
    return new myPromise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {     
            promises[i].then(resolve, reject);
        }
    })
}

// promise.allSettled
function myPromiseAllSettled(promises) {
    return new myPromise((resolve, reject) => {
        let result = [];
        let count = 0;
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(res => {
                result[i] = {
                    status: 'fulfilled',
                    value: res
                };
                count++;
                if (count === promises.length) {
                    resolve(result);
                }
            }, err => {
                result[i] = {
                    status: 'rejected',
                    reason: err
                };
                count++;
                if (count === promises.length) {
                    resolve(result);
                }
            })
        }
    })
}

// promise.any
function myPromiseAny(promises) {
    return new myPromise((resolve, reject) => {
        let count = 0;
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(res => {
                resolve(res);
            }, err => {
                count++;
                if (count === promises.length) {
                    reject(err);
                }
            })
        }
    })
}

// async/await
function myAsync(fn) {
    return function (...args) {
        return new myPromise((resolve, reject) => {
            fn(...args).then(resolve, reject);
        })
    }
}

// async/await
function myAsync(fn) {
    return function (...args) {
        return new myPromise((resolve, reject) => { 
            fn(...args).then(resolve, reject);
        })
    }
}

// async/await
function myAsync(fn) {
    return function (...args) {
        return new myPromise((resolve, reject) => {
            fn(...args).then(resolve, reject);
        })
    }
}

// event emitter
function EventEmitter() {
    this.events = {};
}
EventEmitter.prototype.on = function (eventName, callback) {
    if (!this.events[eventName]) {
        this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
}
EventEmitter.prototype.emit = function (eventName, ...args) {
    if (!this.events[eventName]) {
        return;
    }
    this.events[eventName].forEach(callback => callback(...args));
}
EventEmitter.prototype.off = function (eventName, callback) {
    if (!this.events[eventName]) {
        return;
    }
    this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
}
EventEmitter.prototype.once = function (eventName, callback) {
    this.on(eventName, (...args) => {
        callback(...args);
        this.off(eventName, callback);
    });
}       

// koa middleware
function myKoa() {
    return new myPromise((resolve, reject) => {
        const ctx = {};
        const middleware = [];
        const fn = compose(middleware);
        fn(ctx).then(resolve, reject);
    })
}

// koa middleware
function myKoa() {
    return new myPromise((resolve, reject) => {     
        const ctx = {};
        const middleware = [];
        const fn = compose(middleware);
        fn(ctx).then(resolve, reject);
    })
}

// koa middleware
function myKoa() {
    return new myPromise((resolve, reject) => {     
        const ctx = {};
        const middleware = [];
        const fn = compose(middleware);
        fn(ctx).then(resolve, reject);
    })
}

// compose
function compose(middleware) {
    return function (ctx, next) {
        let index = -1;
        function dispatch(i) {
            if (i <= index) {
                return Promise.reject(new Error('next() called multiple times'));
            }
            index = i;
            let fn = middleware[i];
            if (i === middleware.length) {
                fn = next;
            }
            try {
                return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
            } catch (err) {
                return Promise.reject(err);
            }
        }
        return dispatch(0);
    }
}


// lruCache
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }
    get(key) {
        if (!this.cache.has(key)) return -1;
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }
    put(key, value) {
        if(this.cache.has(key)){
            this.cache.delete(key);
        } else if(this.cache.size >= this.capacity){
            this.cache.delete(this.cache.keys().next().value);
        }
        this.cache.set(key, value);
    }
    delete(key) {
        if(this.cache.has(key)){
            this.cache.delete(key);
            return true;
        }
        return false;
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

// 