// 单例
function Single() {
    if (!Single.instance) {
        Single.instance = this;
    }
    return Single.instance;
}
// 工厂模式
function Factory(name) {
    this.name = name;
}

Factory.prototype.getName = function () {
    return this.name;
}
var a = new Factory('a');

// 抽象工厂

// 原型

// 生成器


// 结构模式
// 适配器
// 代理
// 桥接
// 组合
// 装饰
// 外观
// 享元


//行为模式
// 策略
class Strategy {
    constructor(name) {
        this.name = name;
    }
    show() {
        console.log('show');
    }
}
class Context {
    constructor(strategy) {
        this.strategy = strategy;
    }
    show() {
        this.strategy.show();
    }
}
var a = new Context(new Strategy('a'));
a.show();
// 迭代器
// 责任链
class Chain {
    constructor(name) {
        this.name = name;
        this.next = null;
    }
    setNext(next) {
        this.next = next;
    }
    handle() {
        console.log('handle');
    }
}
class ChainManager {
}
var a = new Chain('a');
var b = new Chain('b');
// 模板方法

// 访问者
// 中介者
// 观察者
class Observer {
    constructor(name) {
        this.name = name;
    }
    update() {
        console.log('update');
    }
}
// 状态
// 策略
// 命令
// 备忘录
// 访问者


// Promise
function Promise(fn) {
    let self = this;
    self.status = 'pending';
    self.value = null;
    self.onResolvedCallbacks = [];
    self.onRejectedCallbacks = [];

    function resolve(value) {
        if (value instanceof Promise) {
            return value.then(resolve, reject);
        }

        setTimeout(() => {
            if (self.status === 'pending') {
                self.status = 'fulfilled';
                self.value = value;
                self.onResolvedCallbacks.forEach(fn => fn());
            }
        }, 0);
    }

    function reject(reason) {
        setTimeout(() => {
            if (self.status === 'pending') {
                self.status = 'rejected';
                self.value = reason;
                self.onRejectedCallbacks.forEach(fn => fn());
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
    let self = this;
    return new Promise((resolve, reject) => {
        function resolvePromise() {
            try {
                let x = onFulfilled(self.value);
                if (x instanceof Promise) {
                    x.then(resolve, reject);
                } else {
                    resolve(x);
                }
            } catch (e) {
                reject(e);
            }
        }

        function rejectPromise() {
            try {
                let x = onRejected(self.value);
                if (x instanceof Promise) {
                    x.then(resolve, reject);
                } else {
                    resolve(x);
                }
            } catch (e) {
                reject(e);
            }
        }

        switch (self.status) {
            case 'pending':
                self.onResolvedCallbacks.push(resolvePromise);
                self.onRejectedCallbacks.push(rejectPromise);
                break;
            case 'fulfilled':
                resolvePromise();
                break;
            case 'rejected':
                rejectPromise();
                break;
        }
    });
};

// all

Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
        let count = 0;
        let arr = [];
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(res => {
                count++;
                arr[i] = res;
                if (count === promises.length) {
                    resolve(arr);
                }
            }, err => reject(err))
        }
    })
}

// race
Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(res => {
                resolve(res);
            }, err => reject(err))
        }
    })
}

// finally
Promise.prototype.finally = function (callback) {
    return this.then(
        value => Promise.resolve(callback()).then(() => value),
        reason => Promise.resolve(callback()).then(() => { throw reason })
    );
};

// 修复后的man函数
function man(name) {
    // 创建一个新对象，避免this指向问题
    const instance = Object.create(man.prototype);
    instance.queue = [];

    // 添加初始打印任务
    instance.queue.push(() => {
        console.log(`my name is ${name}`);
    });

    const api = {
        sleep(time) {
            instance.queue.push(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.log(`sleep ${time}s`);
                        resolve();
                    }, time * 1000); // 统一时间单位为秒
                });
            });
            return this;
        },
        sleepFirst(time) {
            instance.queue.unshift(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        console.log(`sleep first ${time}s`);
                        resolve();
                    }, time * 1000);
                });
            });
            return this; // 添加返回值支持链式调用
        },

        call(name) {
            instance.queue.push(() => {
                console.log(`call ${name}`);
            });
            return this;
        },

        action(action) {
            instance.queue.push(() => {
                console.log(`action ${action}`);
            });
            return this;
        },
    };

    // 执行队列中的所有函数
    setTimeout(async () => {
        for (const task of instance.queue) {
            await task();
        }
    }, 0);

    return api;
}

man('111').sleepFirst(5).call("mon").sleep(6).action("iphone")

// eventEmitter
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

    once(eventName, callback) {
        const onceCallback = (...args) => {
            callback(...args);
            this.off(eventName, onceCallback);
        };
        this.on(eventName, onceCallback);
    }

    off(eventName, callback) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
        }
        if (this.events[eventName].length === 0) {
            delete this.events[eventName];
        }
        // return this;
    }
}


// 并发限制器 - 支持结果返回

class Scheduler {
    constructor(limit = 3) {
        this.limit = limit;
        this.tasks = [];  // 重命名避免与任务函数混淆
        this.runningCount = 0;
        this.executionId = 0;  // 用于跟踪执行ID
    }

    add(task) {
        // 创建一个包装对象，包含任务和对应的resolve/reject
        return new Promise((resolve, reject) => {
            this.tasks.push({
                task,
                resolve,
                reject,
                id: this.executionId++  // 为每个任务分配唯一ID
            });
            
            this._run();
        });
    }

    // 批量添加任务的方法
    addAll(tasks) {
        return Promise.all(tasks.map(task => this.add(task)));
    }

    _run() {
        // 当正在运行的任务少于限制并且有待执行任务时，继续执行
        while (this.runningCount < this.limit && this.tasks.length > 0) {
            const { task, resolve, reject } = this.tasks.shift();
            this.runningCount++;
            
            // 执行任务并将结果传递给对应的promise
            Promise.resolve(task())
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    this.runningCount--;
                    this._run();  // 尝试运行下一个任务
                });
        }
    }
}

