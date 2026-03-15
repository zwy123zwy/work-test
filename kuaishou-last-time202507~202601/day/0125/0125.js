// Array.flat
function flatten(arr) {
    return arr.reduce((res, item) => {
        return res.concat(Array.isArray(item) ? flatten(item) : item)
    }, [])
}

console.log(flatten([1, [2, [3, [4, [5]]]]]))

// Array.depth
function getDepth(arr) {
    return Math.max(...arr.map(item => Array.isArray(item) ? getDepth(item) + 1 : 1))
}

// promise.all
function myPromiseAll(promises) {
    return new Promise((resolve, reject) => {
        let result = [];
        let count = 0;
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(res => {
                result[i] = res;
                count++;
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
function myPromiseRace(promises) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        }
    })
}

// promise.any
function myPromiseAny(promises) {
    return new Promise((resolve, reject) => {
        let count = 0;
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(res => {
                resolve(res);
            }).catch(err => {
                count++;
                if (count === promises.length) {
                    reject(err);
                }
            })
        }
    })
}

// promise.allSettled
function myPromiseAllSettled(promises) {
    return new Promise((resolve, reject) => {
        let result = [];
        let count = 0;
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(res => {
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
            }).catch(err)
        }
    })
}

//  深拷贝
function deepClone(obj) {
    if (typeof obj !== 'object') {
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

// 并发限制器
class Scheduler {
    constructor(limit) {
        this.limit = limit;
        this.queue = [];
        this.activeCount = 0;
    }

    add(promiseCreator) {
        this.queue.push(promiseCreator);
        this.next();
    }

    next() {
        if (this.activeCount < this.limit && this.queue.length) {
            const promiseCreator = this.queue.shift();
            this.activeCount++;
            promiseCreator().then(() => {
                this.activeCount--;
                this.next();
            })
        }
    }

}


const timeout = (time) => {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}
const scheduler = new Scheduler();
const addTask = (time, order) => {
    scheduler.add(() => timeout(time).then(() => console.log(order)))
}
addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');


// apply
Function.prototype.myApply = function (context, arr) {
    if (typeof this !== 'function') {
        throw new TypeError('error')
    }
    context = context || window;
    context.fn = this;
    let result = context.fn(...arr);
    delete context.fn;
    return result;
}

// call
Function.prototype.myCall = function (context, ...args) {
    if (typeof this !== 'function') {
        throw new TypeError('error')
    }
    context = context || window;
    context.fn = this;
    let result = context.fn(...args);
    delete context.fn;
    return result;
}

// bind
Function.prototype.myBind = function (context, ...args) {
    if (typeof this !== 'function') {
        throw new TypeError('error')
    }
    context = context || window;
    let _this = this;
    return function F(...args2) {
        // 判断是否为 new 的方式调用
        if (this instanceof F) {
            return new _this(...args, ...args2)
        }
        return _this.apply(context, args.concat(args2))
    }
}

function myNew(fn, ...args) {
    let obj = Object.create(fn.prototype);
    let res = fn.apply(obj, args);
    return res instanceof Object ? res : obj;
}

// object.create
function myCreate(obj) {
    function F() { }
    F.prototype = obj;
    return new F();
}

// curry
function curry(fn, ...args) {
    return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args)
}

function sum(a, b, c) {
    return a + b + c;
}

console.log(curry(sum, 1, 2)(3));

// object.assign
function myAssign(target, ...sources) {
    for (let i = 0; i < sources.length; i++) {
        let source = sources[i];
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}

let obj = { a: 1 };
myAssign(obj, { b: 2 }, { c: 3 });
console.log(obj);

// sleep
function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

// promise暂停
async function pause() {
    await sleep(1000);
    console.log('暂停1秒');
}
// promise取消
async function cancel() {
    let promise = sleep(1000);
    setTimeout(() => {
        promise.cancel();
    }, 500);
    await promise;
    console.log('取消1秒');
}
// 单例模式
class Single {
    constructor() {
        if (!Single.instance) {
            Single.instance = this;
        }
        return Single.instance;
    }
}

// 工厂模式
class Factory {
    create(type) {
        switch (type) {
            case 'car':
                return new Car();
            case 'bike':
                return new Bike();
            default:
                return null;
        }
    }
}

class Car {
    drive() {
        console.log('drive car');
    }
}
class Bike {
    drive() {
        console.log('drive bike');
    }
}
class Vehicle {
    drive() {
        console.log('drive vehicle');
    }
}
class VehicleFactory {
    createVehicle(type) {
        switch (type) {
            case 'car':
                return new Car();
            case 'bike':
                return new Bike();
            default:
                return null;
        }
    }
}

// 原型模式

class Vehicle {
    constructor() {
        this.drive = function () {
            console.log('drive vehicle');
        }
    }
}
class Car extends Vehicle {
    constructor() {
        super();
    }
}
class Bike extends Vehicle {
    constructor() {
        super();
    }
}
class VehicleFactory {
    createVehicle(type) {
        switch (type) {
            case 'car':
                return new Car();
            case 'bike':
                return new Bike();
            default:
                return null;
        }
    }
}

// 建造者模式
class Vehicle {
    constructor() {
        this.type = null;
        this.frame = null;
        this.engine = null;
        this.wheel = null;
    }

    setType(type) {
        this.type = type;
    }

    setFrame(frame) {
        this.frame = frame;
    }

    setEngine(engine) {
        this.engine = engine;
    }

    setWheel(wheel) {
        this.wheel = wheel;
    }
}
class VehicleBuilder {
    constructor() {
        this.vehicle = new Vehicle();
    }

    setType(type) {
        this.vehicle.setType(type);
        return this;
    }

    setFrame(frame) {
        this.vehicle.setFrame(frame);
        return this;
    }

    setEngine(engine) {
        this.vehicle.setEngine(engine);
    }
}


// 代理模式
class VehicleDirector {
    constructor(builder) {
        this.builder = builder;
    }

    constructSportsVehicle() {
        return this.builder.setType('Sports Car')
            .setFrame('Sports Frame')
            .setEngine('Sports Engine')
            .setWheel('Sports Wheel')
            .getVehicle();
    }

    constructCoupeVehicle() {
    }
}

// 桥接模式
class Vehicle {
    constructor(builder) {
        this.builder = builder;
    }

    getVehicle() {
        return this.builder.getVehicle();
    }
}

class CarBuilder {
}
class CarManualBuilder {
}
// 享元模式

// 适配器模式
// 策略模式
// 模板方法模式
// 访问者模式
// 迭代器模式
// 观察者模式
// 中介者模式
// 状态模式
// 享元模式
// 代理模式
// 职责链模式
// 命令模式
// 备忘录模式
// 解释器模式

// 单一职责
// 封装 继承 组合
// 开闭原则
// 依赖倒置原则
// 接口隔离原则
// 迪米特法则

// 发布订阅模式
class PubSub {
    constructor() {
        this.subscribers = {};
    }

    subscribe(eventName, callback) {
        if (!this.subscribers[eventName]) {
            this.subscribers[eventName] = [];
        }
        this.subscribers[eventName].push(callback);
    }

    publish(eventName, data) {
        if (this.subscribers[eventName]) {
            return this.subscribers[eventName].map(callback => {
                try {
                    return callback(data);
                } catch (error) {
                    console.error(`Error in ${eventName} event handler:`, error);
                    return null;
                }
            });
        }
        // return [];
    }

    unsubscribe(eventName, callback) {
        if (this.subscribers[eventName]) {
            this.subscribers[eventName] = this.subscribers[eventName].filter(subscriber => subscriber !== callback);
        }
    }
}
