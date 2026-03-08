// instanceof
function myInstanceof(left, right) {
    let proto = Object.getPrototypeOf(left);
    while (true) {
        if (proto === null) return false;
        if (proto === right.prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
    return false;
}


// new
function myNew(fn, ...args) {
    let obj = Object.create(fn.prototype);
    let res = fn.apply(obj, args);
    return res instanceof Object ? res : obj;
}

// Object.create
function myObjectCreate(proto) {
    function F() { }
    F.prototype = proto;
    return new F();
}

// apply
function myApply(fn, context, args) {
    context = context || window;
    const key = Symbol();
    context[key] = fn;
    const res = context[key](...args);
    delete context[key];
    return res;
}




class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(type, handler) {
        if (!this.events[type]) {
            this.events[type] = [];
        }
        this.events[type].push(handler);
    }

    addListener(type, handler) {
        this.on(type, handler)
    }

    prependListener(type, handler) {
        if (!this.events[type]) {
            this.events[type] = [];
        }
        this.events[type].unshift(handler);
    }

    removeListener(type, handler) {
        if (!this.events[type]) {
            return;
        }
        this.events[type] = this.events[type].filter(item => item !== handler);
    }

    off(type, handler) {
        this.removeListener(type, handler)
    }

    emit(type, ...args) {
        this.events[type].forEach((item) => {
            Reflect.apply(item, this, args);
        });
    }

    once(type, handler) {
        this.on(type, this._onceWrap(type, handler, this));
    }

    _onceWrap(type, handler, target) {
        const state = { fired: false, handler, type, target };
        const wrapFn = this._onceWrapper.bind(state);
        state.wrapFn = wrapFn;
        return wrapFn;
    }

    _onceWrapper(...args) {
        if (!this.fired) {
            this.fired = true;
            Reflect.apply(this.handler, this.target, args);
            this.target.off(this.type, this.wrapFn);
        }
    }
}



class Promise {
    constructor(executor) {
        this.status = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        const resolve = (value) => {
            if (value instanceof Promise) {
                value.then(resolve, reject);
                return;
            }
            if (this.status === 'pending') {
                this.status = 'fulfilled';
                this.value = value;
                this.onResolvedCallbacks.forEach(fn => fn(value));
            }
        }
        const reject = (reason) => {
            if (this.status === 'pending') {
                this.status = 'rejected';
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn(reason));
            }
        }
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }
    then(onFulfilled, onRejected) {
        return new Promise((resolve, reject) => {
            const handleResolve = (value) => {
                try {
                    const result = onFulfilled(value);
                    return result instanceof Promise ? result.then(resolve, reject) : resolve(result);
                } catch (error) {
                    reject(error);
                }
            }
            const handleReject = (reason) => {
                try {
                    const result = onRejected(reason);
                    return result instanceof Promise ? result.then(resolve, reject) : resolve(result);
                } catch (error) {
                    reject(error);
                }
            }
            if (this.status === 'fulfilled') {
                handleResolve(this.value);
            } else if (this.status === 'rejected') {
                handleReject(this.reason);
            } else if (this.status === 'pending') {
                this.onResolvedCallbacks.push(handleResolve);
                this.onRejectedCallbacks.push(handleReject);
            }
        })
    }
}


// promise.all

function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        let count = 0;
        let result = [];
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then((res) => {
                result[index] = res;
                count++;
                if (count === promises.length) {
                    resolve(result);
                }
            }).catch((err) => {
                reject(err);
            })
        })
    })
}


// promise.race
function promiseRace(promises) {
    return new Promise((resolve, reject) => {
        promises.forEach((promise) => {
            Promise.resolve(promise).then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            })
        })
    })
}


// promise.allSettled
function promiseAllSettled(promises) {
    return new Promise((resolve, reject) => {
        let count = 0;
        let result = [];
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then((res) => {
                result[index] = { status: 'fulfilled', value: res };
                count++;
                if (count === promises.length) {
                    resolve(result);
                }
            }).catch((err) => {
                result[index] = { status: 'rejected', reason: err };
                count++;
                if (count === promises.length) {
                    resolve(result);
                }
            })
        })
    })
}


// sleep
function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    })
}

// 设计一个简单的任务队列, 要求分别在 1,3,4 秒后打印出 "1", "2", "3"；
class TaskQueue {
    constructor() {
        this.queue = [];
        this.running = false;
    }

    addTask(task) {
        this.queue.push(task);
        if (!this.running) {
            this.run();
        }
    }

    async run() {
        this.running = true;
        while (this.queue.length > 0) {
            const task = this.queue.shift();
            await task();
        }
    }
}

// 并发限制器
class ConcurrencyLimiter {
    constructor(concurrency) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
        this.results = [];
        this.currentIndex = 0;
    }

    addTask(task) {
        this.queue.push({ task, index: this.currentIndex++ });
        this.run();
    }

    run() {
        if (this.running >= this.concurrency || this.queue.length === 0) {
            return;
        }
        const { task, index } = this.queue.shift();
        this.running++;
        task().then(result => {
            this.results[index] = result;
            this.running--;
            this.run();
        })
    }


}

// url to params
function urlToParams(url) {
    let str = '/.+\?(.+)$/'.exec(url)[1];
    let params = str.split('&');
    let paramsObj = {};
    params.forEach(param => {
        if (/=/.test(param)) {
            let [key, value] = param.split('=');
            key = decodeURIComponent(key);
            value = decodeURIComponent(value);
            if (paramsObj.hasOwnProperty(key)) {
                paramsObj[key] = [].concat(paramsObj[key], value);
            } else {
                paramsObj[key] = value;
            }
        }else{
            let key = decodeURIComponent(param);
            if (!paramsObj.hasOwnProperty(key)) {
                paramsObj[key] = '';
            }   
            paramsObj[key] = true;
        }

    })
    return paramsObj;
}


// js to tree
function listToTree(list) {
    let map = {};
    let tree = [];
    list.forEach(item => {
        map[item.id] = item;
    })
    list.forEach(item => {
        if (item.parentId) {
            if (!map[item.parentId].children) {
                map[item.parentId].children = [];
            }
            map[item.parentId].children.push(item);
        } else {
            tree.push(item);
        }
    })
    return tree;
}


class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback){
        if(!this.events[event]){
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    off(event, callback){
        if(!this.events[event]) return;
        if(!callback){
            delete this.events[event];
        } else {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }
    
    emit(event, ...args){
        if(!this.events[event]) return;
        this.events[event].forEach(callback => callback(...args));
    }
    
    
    once(event, callback){
        const onceCallback = (...args) => {
            callback(...args);
            this.off(event, onceCallback);
        }
        this.on(event, onceCallback);
    }
}