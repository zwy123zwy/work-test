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



