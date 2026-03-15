//并行限制器
function concurrent(tasks, limit) {
    let count = 0;
    let completed = 0;
    let index = 0;
    let results = new Array(tasks.length);


    return new Promise((resolve, reject) => {
        function next() {
            if (count >= limit || index >= tasks.length) {
                return;
            }

            const currentIndex = index++;
            const task = tasks[currentIndex];
            count++;
            Promise.resolve(task()).then(res => {
                results[currentIndex] = res;
            }).catch(err => {
                reject(err);
            }).finally(() => {
                count--;
                completed++;
                if (completed === tasks.length) {
                    resolve(results);
                } else {
                    next();
                }
            })
            next();
        }

        for (let i = 0; i < Math.min(limit, tasks.length); i++) {
            next();
        }

    })

}

// promise

function myPromise(executor) {
    let self = this;
    self.status = 'pending';
    self.value = undefined;
    self.onResolvedCallbacks = [];
    self.onRejectedCallbacks = [];

    function resolve(value) {
        if (value instanceof myPromise) {
            value.then(resolve, reject);
        }

        setTimeout(() => {
            if (self.status === 'pending') {
                self.status = 'fulfilled';
                self.value = value;
                self.onResolvedCallbacks.forEach(fn => fn(value));
            }
        }, 0);
    }

    function reject(reason) {
        setTimeout(() => {
            if (self.status === 'pending') {
                self.status = 'rejected';
                self.value = reason;
                self.onRejectedCallbacks.forEach(fn => fn(reason));
            }
        }, 0);
    }

    try {
        executor(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

// promise.then

myPromise.prototype.then = function (onResolved, onRejected) {
    let self = this;
    return new myPromise((resolve, reject) => {
        function resolvePromise() {
            try {
                let x = onResolved(self.value);
                if (x instanceof myPromise) {
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

        switch (self.status) {
            case 'fulfilled':
                onResolved(self.value);
                break;
            case 'rejected':
                onRejected(self.reason);
                break;
            case 'pending':
                self.onResolvedCallbacks.push(resolvePromise);
                self.onRejectedCallbacks.push(rejectPromise);
                break;
        }
    })
}


// promise.all
myPromise.all = function (promises) {
    let count = 0;
    let result = [];

    return new myPromise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(res => {
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
myPromise.race = function (promises) {
    return new myPromise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(res => {
                resolve(res);
            }, err => reject(err))
        }
    })
}

// promise.any

myPromise.any = function (promises) {
    let count = 0;
    let result = [];

    return new myPromise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(res => {
                count++;
                result[i] = res;
                if (count === promises.length) {
                    resolve(result);
                }
            }, err => {
                count++;
                result[i] = err;
                if (count === promises.length) {
                    reject(result);
                }
            })
        }
    })
}

// 继承
function parent() {
    this.name = 'parent';
}

function child() {
    parent.call(this);
    this.type = 'child';
}

// 原型链继承
child.prototype = new parent();


// 组合继承
function child() {
    parent.call(this);
    this.type = 'child';
}

child.prototype = new parent();

// 原型继承
let parent = { name: 'parent' };
let child1 = Object.create(parent);

// 寄生继承
function createAnother(original) {
    let clone = object(original);  // 通过调用函数创建一个新对象 
    clone.sayHi = function () {     // 以某种方式增强这个对象 
        console.log("hi");
    };
    return clone;           // 返回这个对象 
}

// 寄生组合继承
function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function () {
    console.log(this.name);
};
function SubType(name, age) {
    SuperType.call(this, name);   // 第二次调用SuperType() 
    this.age = age;
}
SubType.prototype = new SuperType();   // 第一次调用SuperType() 
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function () {
    console.log(this.age);
};


// sleep
function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    })
}

Array.prototype.flat = function (depth = 1) {
    let result = [];
    for (let i = 0; i < this.length; i++) {
        if (Array.isArray(this[i]) && depth > 0) {
            result = result.concat(this[i].flat(depth - 1));
        } else {
            result.push(this[i]);
        }
    }
    return result;
}

// foreach
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

// reduce
Array.prototype.myReduce = function (callback, initialValue) {
    let result = initialValue;
    for (let i = 0; i < this.length; i++) {
        result = callback(result, this[i], i, this);
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

// includes
Array.prototype.myIncludes = function (value, fromIndex = 0) {
    for (let i = fromIndex; i < this.length; i++) {
        if (this[i] === value) {
            return true;
        }
    }
    return false;
}

// push
Array.prototype.myPush = function (...args) {
    for (let i = 0; i < args.length; i++) {
        this[this.length] = args[i];
    }
    return this.length;
}

// pop
Array.prototype.myPop = function () {
    let result = this[this.length - 1];
    this.length--;
    return result;
}

// shift
Array.prototype.myShift = function () {
    let result = this[0];
    for (let i = 1; i < this.length; i++) {
        this[i - 1] = this[i];
    }
    this.length--;
    return result;
}

// unshift

Array.prototype.myUnshift = function (...args) {
    for (let i = this.length - 1; i >= 0; i--) {
        this[i + args.length] = this[i];
    }
    for (let i = 0; i < args.length; i++) {
        this[i] = args[i];
    }
    return this.length;
}

// sort
Array.prototype.mySort = function (compareFn) {
    for (let i = 0; i < this.length; i++) {
        for (let j = i + 1; j < this.length; j++) {
            if (compareFn(this[i], this[j]) > 0) {
                [this[i], this[j]] = [this[j], this[i]];
            }
        }
    }
    return this;
}


// new
function myNew(fn, ...args) {
    let obj = Object.create(fn.prototype);
    let result = fn.call(obj, ...args);
    return result instanceof Object ? result : obj;
}

// instanceof
function myInstanceof(left, right) {
    let proto = left.__proto__;
    while (true) {
        if (proto === null) {
            return false;
        }
        if (proto === right.prototype) {
            return true;
        }
        proto = proto.__proto__;
    }
}

// trim
String.prototype.myTrim = function () {
    return this.replace(/^\s+|\s+$/g, '');
}



// debounce
function debounce(fn, delay) {
    let timer = null;
    return function () {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, delay);
    }
}

// throttle
function throttle(fn, delay) {
    let flag = true;
    return function () {
        if (!flag) {
            return;
        }
        flag = false;
        setTimeout(() => {
            fn.apply(this, arguments);
            flag = true;
        }, delay);
    }
}
