// 设计原则
// 单一职责原则
// 一个类只负责一个职责
// 开闭原则
// 一个类应该对扩展开放，对修改关闭
// 单一职责原则是开闭原则的基础
// 单一职责原则是开闭原则的实现
// 依赖倒置原则
// 一个类应该依赖于抽象而不是具体实现
// 单一职责原则是依赖倒置原则的实现
// 接口隔离原则
// 一个类应该只有一个接口
// 单一职责原则是接口隔离原则的实现
// 迪米特法则
// 一个类应该尽量减少对外部的依赖
// 单一职责原则是迪米特法则的实现
// 里氏替换原则
// 一个类应该可以被其子类替换

// 设计模式
// 单例模式
function Singleton() {
    if (Singleton.instance) {
        return Singleton.instance;
    }
    this.name = 'singleton';
    Singleton.instance = this;
}

const singleton = new Singleton();
console.log(singleton.name);

// 工厂模式
function Factory() {
    this.create = function(type) {
        return new type();
    }
}

const factory = new Factory();
const product = factory.create('product');
console.log(product.name);

// 抽象工厂模式
function AbstractFactory() {
    this.create = function(type) {
        return new type();
    }
}

const abstractFactory = new AbstractFactory();
const product1 = abstractFactory.create('product');
console.log(product1.name);

// 生成器模式
function Generator() {
    this.create = function(type) {
        return new type();
    }
}

const generator = new Generator();
const product2 = generator.create('product');
console.log(product2.name);


// 结构模式
// 适配器模式
function Adapter(target) {
    this.target = target;
}

const adapter = new Adapter('product');
console.log(adapter.target.name);

// 代理模式
function Proxy(target) {
    this.target = target;
}

const proxy = new Proxy('product');

// 桥接模式
function Bridge(target) {
    this.target = target;
}

const bridge = new Bridge('product');
console.log(bridge.target.name);

// 组合模式
function Composite(target) {
    this.target = target;
}

const composite = new Composite('product');

// 装饰模式
function Decorator(target) {
    this.target = target;
}

const decorator = new Decorator('product');
console.log(decorator.target.name);

// 外观模式
function Facade(target) {
    this.target = target;
}

const facade = new Facade('product');

// 享元模式
function Flyweight(target) {
    this.target = target;
}

const flyweight = new Flyweight('product');
console.log(flyweight.target.name);


// 行为模式
// 策略模式
function Strategy(target) {
    this.target = target;
}

const strategy = new Strategy('product');
console.log(strategy.target.name);
// 职责链模式
function Chain(target) {
    this.target = target;
}

const chain = new Chain('product');
console.log(chain.target.name);
// 命令模式
function Command(target) {
    this.target = target;
}

const command = new Command('product');
console.log(command.target.name);

// 备忘录模式
function Memento(target) {
    this.target = target;
}

const memento = new Memento('product');
console.log(memento.target.name);
// 解释器模式
function Interpreter(target) {
    this.target = target;
}

const interpreter = new Interpreter('product');
console.log(interpreter.target.name);

// 迭代器模式
function Iterator(target) {
    this.target = target;
}

const iterator = new Iterator('product');
console.log(iterator.target.name);

// 观察者模式
function Observer(target) {
    this.target = target;
}

const observer = new Observer('product');
console.log(observer.target.name);

// 中介者模式
function Mediator(target) {
    this.target = target;
}

const mediator = new Mediator('product');
console.log(mediator.target.name);
// 状态模式
function State(target) {
    this.target = target;
}

const state = new State('product');
console.log(state.target.name);

// 访问者模式
function Visitor(target) {
    this.target = target;
}

const visitor = new Visitor('product'); 

// 发布-订阅模式
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    emit(eventName, ...args) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => callback(...args));
        }
    }

    off(eventName, callback) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(item => item !== callback);
            if (this.events[eventName].length === 0) {
                delete this.events[eventName];
            }
        }
    }

    once(eventName, callback) {
        const onceCallback = (...args) => {
            callback(...args);
            this.off(eventName, onceCallback);
        }
        this.on(eventName, onceCallback);
    }
}

const eventEmitter = new EventEmitter();
console.log(eventEmitter.events);


// 冒泡排序
// 时间复杂度O(n^2) 
// 空间复杂度O(1)
// 稳定性：稳定
// 原理：每次比较相邻的两个元素，如果前一个元素比后一个元素大，则交换位置
// 实现：
function bubbleSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

// 选择排序
// 时间复杂度O(n^2) 
// 空间复杂度O(1)
// 稳定性：不稳定
// 原理：每次选择最小的元素，放在最前面
// 实现：
function selectionSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let indexMin = i;
        for (let j = i; j < arr.length; j++) {
            if (arr[j] < arr[indexMin]) {
                indexMin = j;
            }
        }
        if (indexMin !== i) {
            [arr[i], arr[indexMin]] = [arr[indexMin], arr[i]];
        }
    }
    return arr;
}

// 插入排序
// 时间复杂度O(n^2) 
// 空间复杂度O(1)
// 稳定性：稳定
// 原理：每次选择最小的元素，放在最前面
// 实现：
function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let j = i - 1;
        let temp = arr[i];
        while (j >= 0 && arr[j] > temp) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = temp;
    }
    return arr;
}

// 快速排序
// 时间复杂度O(nlogn) 
// 空间复杂度O(logn)
// 稳定性：不稳定
// 原理：每次选择一个基准元素，将比基准元素小的放在左边，比基准元素大的放在右边
// 实现：
function quickSort(arr) {
    if (arr.length < 2) { return arr; }
    const left = [];
    const right = [];
    const mid = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < mid) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return [...quickSort(left), mid, ...quickSort(right)];
} 

// 归并排序
// 时间复杂度O(nlogn) 
// 空间复杂度O(n)
// 稳定性：稳定
// 原理：每次将数组分成两部分，分别排序，然后合并
// 实现：
function mergeSort(arr) {
    if (arr.length < 2) { return arr; }
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    return merge(mergeSort(left), mergeSort(right));
}

// lru
function LRU(capacity) {
    this.capacity = capacity;
    this.cache = new Map();

    this.get = function(key) {
        if (this.cache.has(key)) {
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }
        return -1;
    }

    this.put = function(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        this.cache.set(key, value);
        if (this.cache.size > this.capacity) {
            this.cache.delete(this.cache.keys().next().value);
        }
    }

    this.toString = function() {
        return JSON.stringify(this.cache);
    }
}

const lru = new LRU(3);
console.log(lru.cache);

// promise
class Promise {
    constructor(executor) {
        this.state = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
    }

    resolve(value) {
        if (this.state === 'pending') {
            this.state = 'fulfilled';
            this.value = value;
            this.onFulfilledCallbacks.forEach(callback => callback());
        }
    }

    reject(reason) {
        if (this.state === 'pending') {
            this.state = 'rejected';
            this.reason = reason;
            this.onRejectedCallbacks.forEach(callback => callback());
        }
    }

    then(onFulfilled, onRejected) {
         function resolvePromise(promise, x, resolve, reject) {
            if (promise === x) {
                return reject(new TypeError('Chaining cycle detected for promise'));
            }
            if (x instanceof Promise) {
                x.then(resolve, reject);
            } else {
                resolve(x);
            }
         }

         function rejectPromise(promise, reason, reject) {
            if (promise === reason) {
                return reject(new TypeError('Chaining cycle detected for promise'));
            }
            if (reason instanceof Promise) {
                reason.then(resolve, reject);
            } else {
                reject(reason);
            }
         }

        if (this.state === 'fulfilled') {
            onFulfilled(this.value);
        }
        if (this.state === 'rejected') {
            onRejected(this.reason);
        }
        if (this.state === 'pending') {
            this.onFulfilledCallbacks.push(onFulfilled);
            this.onRejectedCallbacks.push(onRejected);
        }

    }
}

const promise = new Promise((resolve, reject) => {
    resolve('success');
});

promise.then(value => {
    console.log(value);
});

