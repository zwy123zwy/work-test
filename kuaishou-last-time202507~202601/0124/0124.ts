function SuperType(_name) {
    this.colors = ["red", "blue", "green"];
    this.name = _name;
}
SuperType.prototype.getName = function () {
    console.log(this.name);
};
function SubType(_name, age) {
    SuperType.call(this, _name);
    this.age = age;
}
//Object.create()返回一个空对象，函数参数将作为空对象的原型对象
SubType.prototype = Object.create(SuperType.prototype);
SubType.prototype.constructor = SubType;

SubType.prototype.getAge = function () {
    console.log(this.age);
};

let instance1 = new SubType("lbw", 18);
instance1.colors.push("black");
console.log(instance1.colors); //[ 'red', 'blue', 'green', 'black' ]
instance1.getName(); //lbw
instance1.getAge(); //18

let instance2 = new SubType("white", 28);
console.log(instance2.colors); //[ 'red', 'blue', 'green' ]
instance2.getName(); //white
instance2.getAge(); //28

//实现ts中的内置方法pick
interface Todo {
    title: string;
    description: string;
    completed: boolean;
}

type MyPick<T, K extends keyof T> = {
    [P in K]: T[P];
};
type TodoPreview = MyPick<Todo, "title" | "completed">;

const arr = [1, [2, 3, [4, 5]], 1, 2, [6, 7]]
Array.prototype.flat = function (deep = 1) {
    let res = []
    deep--
    for (const p of this) {
        if (Array.isArray(p) && deep >= 0) {
            res = res.concat(p.flat(deep))
        } else {
            res.push(p)
        }
    }
    return res
}
console.log(arr.flat(1))




// deepclone
function deepClone(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    let newObj = Array.isArray(obj) ? [] : {};

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key];
        }
    }
    return newObj;
}


// new

function myNew() {
    var obj = new Object();
    var constructor = [].shift.call(arguments);
    obj.__proto__ = constructor.prototype;
    var ret = constructor.apply(obj, arguments);
    return typeof ret === 'object' ? ret : obj;
}

class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    show() {
        console.log(this.name, this.age);
    }
}

// var p = new Person('张三', 18);
// p.show();
// var p1 = myNew(Person, '张三', 18);
// p1.show();

// instanceof

function myInstanceof(left, right) {
    let proto = Object.getPrototypeOf(left);

    while (true) {
        if (!proto) return false;
        if (proto === right.prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
}

// object.is
Object.is = function (x, y) {
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    } else {
        return x !== x && y !== y;
    }
}

// object.create
Object.create = function (obj) {
    function F() { }
    F.prototype = obj;
    return new F();
}

// object.assign
Object.assign = function (target) {
    for (let i = 1; i < arguments.length; i++) {
        let source = arguments[i];
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}

// apply
Function.prototype.myApply = function (context, args) {
    context = context || window;
    context.fn = this;
    let result;
    if (!args) {
        result = context.fn();
    } else {
        result = context.fn(...args);
    }
    delete context.fn;
    return result;
}

// call
Function.prototype.myCall = function (context, ...args) {
    context = context || window;
    context.fn = this;
    let result = context.fn(...args);
    delete context.fn;
    return result;
}

// bind
Function.prototype.myBind = function (context, ...args) {
    let _this = this;
    return function F(...innerArgs) {
        if (this instanceof F) {
            return new _this(...args, ...innerArgs);
        }
        return _this.apply(context, args.concat(innerArgs));
    }
}

// promise
function Promise(fn) {
    let state = 'pending';
    let value = null;
    let resolveCallbacks = [];
    let rejectCallbacks = [];

    function resolve(newValue) {
        if (newValue instanceof Promise) {
            newValue.then(resolve, reject);
        }
        setTimeout(() => {
            if (state === 'pending') {
                state = 'fulfilled';
                value = newValue;
                resolveCallbacks.forEach(fn => fn());
            }
        }, 0);
    }

    function reject(reason) {
        setTimeout(() => {
            if (state === 'pending') {
                state = 'rejected';
                value = reason;
                rejectCallbacks.forEach(fn => fn());
            }
        }, 0);
    }

    try {
        fn(resolve, reject);
    } catch (e) {
        reject(e);
    }

}

Promise.prototype.then = function (onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
        function resolvePromise(value) {
            try {
                let result = onFulfilled(value);
                if (result instanceof Promise) {
                    result.then(resolve, reject);
                } else {
                    resolve(result);
                }
            } catch (e) {
                reject(e);
            }
        }

        function rejectPromise(reason) {
            try {
                let result = onRejected(reason);
                if (result instanceof Promise) {
                    result.then(resolve, reject);
                } else {
                    resolve(result);
                }
            } catch (e) {
                reject(e);
            }
        }

        if (state === 'fulfilled') {
            resolvePromise(value);
        } else if (state === 'rejected') {
            rejectPromise(value);
        } else if (state === 'pending') {
            resolveCallbacks.push(resolvePromise);
            rejectCallbacks.push(rejectPromise);
        }

    })
}


// promise.all

Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
        let count = 0;
        let result = [];
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(res => {
                count++;
                result[i] = res;
                if (count === promises.length) {
                    resolve(result);
                }
            }).catch(err => {
                reject(err);
            })
        }
    })
}


// promise.race

Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        }
    })
}

// promise.any

Promise.any = function (promises) {
    return new Promise((resolve, reject) => {
        let count = 0;
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(res => {
                resolve(res);
            }).catch(err => {
                count++;
                if (count === promises.length) {
                    reject(new Error('All promises were rejected'));
                }
            })
        }
    })
}


// promise.allSettled
Promise.allSettled = function (promises) {
    return new Promise((resolve, reject) => {
        let count = 0;
        let result = [];
        for (let i = 0; i < promises.length; i++) {
            promises[i].then(res => {
                count++;
                result[i] = {
                    status: 'fulfilled',
                    value: res
                };
            }, err => {
                count++;
                result[i] = {
                    status: 'rejected',
                    reason: err
                };
            }).finally(() => {
                if (count === promises.length) {
                    resolve(result);
                }
            })
        }
    })
}

// scheduler
class Scheduler {

    constructor(limit) {
        this.limit = limit;
        this.activeCount = 0;
        this.queue = [];
    }

    add(promiseCreator) {
        this.queue.push(promiseCreator);
        setTimeout(() => {
            this.task();
        }, 0);
    }

    task() {
        while (this.activeCount < this.limit && this.queue.length) {
            const task = this.queue.shift();
            task().then(() => {
                this.activeCount--;
                this.task();
            })
            this.activeCount++;
        }
        // return result;
    }
}

/// add(1,2,3).count();
/// add(1)(2,4).count();
function add() {
    let args = [...arguments];
    let add = function () {
        args.push(...arguments);
        return add;
    }
    add.count = function () {
        return args.reduce((a, b) => a + b);
    }
    return add;
}

console.log(add(1)(2)(3).count());
console.log(add(1, 2, 3).count());

// 数组去重
function unique(arr) {
    return [...new Set(arr)];
}

function unique1(arr) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        if (!result.includes(arr[i])) {
            result.push(arr[i]);
        }
    }
    return result;
}

function unique2(arr) {
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        let flag = true;
        for (let j = 0; j < result.length; j++) {
            if (arr[i] === result[j]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            result.push(arr[i]);
        }
    }
}

// 对象数组去重
function unique3(arr) {
    let result = [];
    let obj = {};
    for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i].id]) {
            result.push(arr[i]);
            obj[arr[i].id] = true;
        }
    }
    return result;
}

// 

// import { useState, useCallback } from 'react';

// function useCounter() {
//     // 定义 count 这个 state 用于保存当前数值
//     const [count, setCount] = useState(0);
//     // 实现加 1 的操作
//     const increment = useCallback(() => setCount(count + 1), [count]);
//     // 实现减 1 的操作
//     const decrement = useCallback(() => setCount(count - 1), [count]);
//     // 重置计数器
//     const reset = useCallback(() => setCount(0), []);

//     // 将业务逻辑的操作 export 出去供调用者使用
//     return { count, increment, decrement, reset };
// }

// import React from 'react';

// function Counter() {
//     // 调用自定义 Hook
//     const { count, increment, decrement, reset } = useCounter();

//     // 渲染 UI
//     return (
//         <div>
//             <button onClick={decrement}> - </button>
//             <p>{count}</p>
//             <button onClick={increment}> + </button>
//             <button onClick={reset}> reset </button>
//         </div>
//     );
// }


// // 通用请求

// import { useState } from 'react';

// const useAsync = (asyncFunction) => {
//     // 设置三个异步逻辑相关的 state
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     // 定义一个 callback 用于执行异步逻辑
//     const execute = useCallback(() => {
//         // 请求开始时，设置 loading 为 true，清除已有数据和 error 状态
//         setLoading(true);
//         setData(null);
//         setError(null);
//         return asyncFunction()
//             .then((response) => {
//                 // 请求成功时，将数据写进 state，设置 loading 为 false
//                 setData(response);
//                 setLoading(false);
//             })
//             .catch((error) => {
//                 // 请求失败时，设置 loading 为 false，并设置错误状态
//                 setError(error);
//                 setLoading(false);
//             });
//     }, [asyncFunction]);

//     return { execute, loading, data, error };
// };
// // export default useAsync;

// import React from "react";
// import useAsync from './useAsync';

// export default function UserList() {
//     // 通过 useAsync 这个函数，只需要提供异步逻辑的实现
//     const {
//         execute: fetchUsers,
//         data: users,
//         loading,
//         error,
//     } = useAsync(async () => {
//         const res = await fetch("https://reqres.in/api/users/");
//         const json = await res.json();
//         return json.data;
//     });

//     return (
//         // 根据状态渲染 UI...
//         <div className="user-list">...</div>
//     );
// }

// array.keys
Array.prototype.keys = function () {
    let index = 0;
    return {
        next: function () {
            return index < this.length ? { value: index++, done: false } : { done: true };
        }
    }
}
console.log([1, 2, 3].keys());

// array.values
Array.prototype.values = function () {
    let index = 0;
    return {
        next: function () {
            return index < this.length ? { value: this[index++], done: false } : { done: true };
        }
    }
}

// array.entries
Array.prototype.entries = function () {
    let index = 0;
    return {
        next: function () {
            return index < this.length ? { value: [index, this[index++]], done: false } : { done: true };
        }
    }
}
// array.fill
Array.prototype.fill = function (value, start = 0, end = this.length) {
    for (let i = start; i < end; i++) {
        this[i] = value;
    }
    return this;
}

// array.copyWithin
Array.prototype.copyWithin = function (target, start = 0, end = this.length) {
    for (let i = start; i < end; i++) {
        this[target + (i - start)] = this[i];
    }
    return this;
}

// array.pop
Array.prototype.pop = function () {
    let last = this[this.length - 1];
    this.length = this.length - 1;
    return last;
}

// array.push
Array.prototype.push = function (...args) {

    for (let i = 0; i < args.length; i++) {
        this[this.length] = args[i];
    }
    return this.length;
}

// array.shift
Array.prototype.shift = function () {
    let first = this[0];
    for (let i = 0; i < this.length - 1; i++) {
        this[i] = this[i + 1];
    }
    this.length = this.length - 1;
    return first;
}

// array.unshift
Array.prototype.unshift = function (...args) {

    for (let i = this.length - 1; i >= 0; i--) {
        this[i + args.length] = this[i];
    }
    for (let i = 0; i < args.length; i++) {
        this[i] = args[i];
    }
    return this.length;
}

// array.reduce
Array.prototype.reduce = function (callback, initialValue) {

    let accumulator = initialValue;
    for (let i = 0; i < this.length; i++) {
        accumulator = callback(accumulator, this[i], i, this);
    }
    return accumulator;
}

// array.reduceRight
Array.prototype.reduceRight = function (callback, initialValue) {

    let accumulator = initialValue;
    for (let i = this.length - 1; i >= 0; i--) {
        accumulator = callback(accumulator, this[i], i, this);
    }
    return accumulator;
}

//  array.reverse
Array.prototype.reverse = function () {

    for (let i = 0; i < this.length / 2; i++) {
        let temp = this[i];
        this[i] = this[this.length - 1 - i];
        this[this.length - 1 - i] = temp;
    }
    return this;
}

// array.sort
Array.prototype.sort = function (compareFn) {

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


// array.concat()
Array.prototype.concat = function (...args) {
    let arr = [];

    for (let i = 0; i < this.length; i++) {
        arr.push(this[i]);
    }
    for (let i = 0; i < args.length; i++) {
        if (Array.isArray(args[i])) {
            for (let j = 0; j < args[i].length; j++) {
                arr.push(args[i][j]);
            }
        } else {
            arr.push(args[i]);
        }
    }

    return arr;
}


// array.slice(start, end)
Array.prototype.mySlice = function (start, end) {
    let arr = [];
    if (start < 0) {
        start = this.length + start;
    }
    if (end < 0) {
        end = this.length + end;
    }
    if (end === undefined) {
        end = this.length;
    }
    for (let i = start; i < end; i++) {
        arr.push(this[i]);
    }
    return arr;
}

// array.splice
Array.prototype.mySplice = function (start, deleteCount, ...args) {

    let arr = [];
    for (let i = start; i < start + deleteCount; i++) {
        arr.push(this[i]);
    }
    for (let i = this.length - 1; i >= start; i--) {
        this[i + args.length] = this[i];
    }
    for (let i = 0; i < args.length; i++) {
        this[start + i] = args[i];
    }
    return arr;
}



// array.indexof
Array.prototype.myIndexOf = function (element, start) {
    for (let i = start; i < this.length; i++) {
        if (this[i] === element) {
            return i;
        }
    }
    return -1;
}

// array.lastIndexOf
Array.prototype.myLastIndexOf = function (element, start) {
    for (let i = start; i >= 0; i--) {
        if (this[i] === element) {
            return i;
        }
    }
    return -1;
}

// array.includes
Array.prototype.myIncludes = function (element, start) {
    for (let i = start; i < this.length; i++) {
        if (this[i] === element) {
            return true;
        }
    }
    return false;
}


// array.find
Array.prototype.myFind = function (callback) {

    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return this[i];
        }
    }
    return undefined;
}


// array.findIndex
Array.prototype.myFindIndex = function (callback) {

    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return i;
        }
    }
    return -1;
}

// array.every
Array.prototype.myEvery = function (callback) {

    for (let i = 0; i < this.length; i++) {
        if (!callback(this[i], i, this)) {
            return false;
        }
    }
    return true;
}


// array.some
Array.prototype.mySome = function (callback) {

    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return true;
        }
    }
    return false;
}

// array.forEach
Array.prototype.myForEach = function (callback) {
    for (let i = 0; i < this.length; i++) {
        callback(this[i], i, this);
    }
}

// array.map
Array.prototype.myMap = function (callback) {
    let result = [];

    for (let i = 0; i < this.length; i++) {
        result[i] = callback(this[i], i, this);
    }

    return result;
}

// array.filter
Array.prototype.myFilter = function (callback) {
    let result = [];

    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            result.push(this[i]);
        }
    }

    return result;
}


const array = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8];

Array.from(new Set(array)); // [1, 2, 3, 5, 9, 8]
// const array1 = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8];

uniqueArray(array); // [1, 2, 3, 5, 9, 8]

function uniqueArray(array) {
    let map = {};
    let res = [];
    for (var i = 0; i < array.length; i++) {
        if (!map.hasOwnProperty([array[i]])) {
            map[array[i]] = 1;
            res.push(array[i]);
        }
    }
    return res;
}

let arr = [1, [2, [3, 4, 5]]];
function flatten(arr) {
    let result = [];

    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            result = result.concat(flatten(arr[i]));
        } else {
            result.push(arr[i]);
        }
    }
    return result;
}
flatten(arr);  //  [1, 2, 3, 4，5]

// URL 参数
function urlParse(url) {
    let obj = {};
    let arr = url.split('?')[1].split('&');
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i].split('=');
        item[0] = decodeURIComponent(item[0]);
        item[1] = decodeURIComponent(item[1]);
        if (item[0] in obj) {
            obj[item[0]] = [].concat(obj[item[0]], item[1]);
        } else {
            obj[item[0]] = item[1];
        }
    }
    return obj;

}

console.log(urlParse('https://www.nowcoder.com/?a=1&b=2&c=3&a=4'));

// compose
function compose(middlewares) {
    return function () {
        return dispatch(0);
        function dispatch(i) {
            let fn = middlewares[i];
            if (!fn) {
                return Promise.resolve();
            }
            return Promise.resolve(
                fn(function next() {
                    return dispatch(i + 1);
                })
            );
        }
    };
}

// 
// 使用闭包实现
for (var i = 0; i < 5; i++) {
    (function (i) {
        setTimeout(function () {
            console.log(i);
        }, i * 1000);
    })(i);
}
// 使用 let 块级作用域
for (let i = 0; i < 5; i++) {
    setTimeout(function () {
        console.log(i);
    }, i * 1000);
}

// const taskRunner = async () => {
//     await task(3000, 'red')
//     await task(2000, 'green')
//     await task(2100, 'yellow')
//     taskRunner()
// }
// taskRunner()
// 转换前：
let source = [{
    id: 1,
    pid: 0,
    name: 'body'
}, {
    id: 2,
    pid: 1,
    name: 'title'
}, {
    id: 3,
    pid: 2,
    name: 'div'
}]
// 转换为: 
let tree = [{
    id: 1,
    pid: 0,
    name: 'body',
    children: [{
        id: 2,
        pid: 1,
        name: 'title',
        children: [{
            id: 3,
            pid: 1,
            name: 'div'
        }]
    }]
}]
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

console.log(JSON.stringify(jsonToTree(source)), jsonToTree(source) === tree);


// 对象继承
// 1、原型链继承
function Parent() {
    this.name = 'parent';
    this.money = [1000, 2000]
}

function Child() {
    this.name = 'child';
}

Child.prototype = new Parent();
const child1 = new Child();
child1.money.push(3000);
console.log(child1.money);
const child2 = new Child();
console.log(child2.money);

console.log("====================================");

// 2、构造函数继承
function Parent1() {
    this.name = 'parent';
    this.money = [1000, 2000]
}

function Child1() {
    Parent1.call(this, ...arguments);
}

const child11 = new Child1();
child11.money.push(3000);
console.log(child11.money);
const child12 = new Child1();
console.log(child12.money);

console.log("====================================");
// 3、组合继承
function Parent2() {
    this.name = 'parent';
    this.money = [1000, 2000]
}

function Child2() {
    Parent2.call(this, ...arguments);
}

Child2.prototype = new Parent2();
const child21 = new Child2();
child21.money.push(3000);
console.log(child21.money);
const child22 = new Child2();
console.log(child22.money);
console.log("====================================");

// 4、原型式继承
function create(obj) {
    function F() { }
    F.prototype = obj;
    return new F();
}
const parent3 = { name: 'parent' };
const child3 = create(parent3);
console.log(child3.name);
child3.name = 'child';
console.log(child3.name);
console.log(parent3.name);
console.log("====================================");

// 5、寄生式继承
function create2(obj) {
    const clone = create(obj);
    clone.say = function () {
        console.log('hello');
    }
    return clone;
}

const parent4 = { name: 'parent' };
const child4 = create2(parent4);
child4.say();
console.log(child4.name);
console.log(parent4.name);
console.log("====================================");

// 6、寄生组合式继承
function Parent5() {
    this.name = 'parent';
    this.money = [1000, 2000]
}

function Child5() {
    Parent5.call(this, ...arguments);
}

Child5.prototype = Object.create(Parent5.prototype);
Child5.prototype.constructor = Child5;
const child51 = new Child5();
child51.money.push(3000);

console.log(child51.money);
const child52 = new Child5();
console.log(child52.money);
console.log("====================================");

class Parent6 {
    constructor() {
        this.name = 'parent';
        this.money = [1000, 2000]
    }
}

class Child6 extends Parent6 {
    constructor() {
        super(...arguments);
    }
}
const child61 = new Child6();
child61.money.push(3000);
console.log(child61.money);
const child62 = new Child6();
console.log(child62.money);
console.log("====================================");


