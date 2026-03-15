// promise

function myPromise(fn) {
    let self = this;
    this.status = 'pending';
    this.value = null;
    this.reason = null;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

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
                self.reason = reason;
                self.onRejectedCallbacks.forEach(fn => fn(reason));
            }
        }, 0);
    }

    try {
        fn(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

myPromise.prototype.then = function (onResolved, onRejected) {
    const self = this;
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
                resolvePromise();
                break;
            case 'rejected':
                rejectPromise();
                break;
            case 'pending':
                self.onResolvedCallbacks.push(resolvePromise);
                self.onRejectedCallbacks.push(rejectPromise);
                break;
        }
    })
};

// promise.all
myPromise.all = function (promises) {
    return new myPromise((resolve, reject) => {
        let count = 0;
        let result = [];
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(res => {
                count++;
                result[i] = res;
                if (count === promises.length) {
                    resolve(result);
                }
            })
        }
    })
}

myPromise.race = function (promises) {
    return new myPromise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            })
        }
    })
}

// async
function asyncGenerator(fn) {
    return function () {
        let gen = fn.apply(this, arguments);
        return new myPromise((resolve, reject) => {
            function step(key, arg) {
                let result;
                try {
                    result = gen[key](arg);
                } catch (e) {
                    reject(e);
                }
                const { value, done } = result;
                if (done) {
                    resolve(value);
                } else {
                    Promise.resolve(value).then(val => step('next', val), err => step('throw', err));
                }
            }
            step('next')
        })
    }
}

// 并发限制器
class Scheduler {
    constructor() {
        this.queue = [];
        this.maxCount = 2;
        this.runCounts = 0;
    }
    add(promiseCreator) {
        this.queue.push(promiseCreator);
    }
    taskStart() {
        for (let i = 0; i < this.maxCount; i++) {
            this.request();
        }
    }
    request() {
        if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount) {
            return;
        }
        this.runCounts++;

        this.queue.shift()().then(() => {
            this.runCounts--;
            this.request();
        });
    }
}

const timeout = time => new Promise(resolve => {
    setTimeout(resolve, time);
})

const scheduler = new Scheduler();

const addTask = (time, order) => {
    scheduler.add(() => timeout(time).then(() => console.log(order)))
}


addTask(1000, '1');
addTask(500, '2');
addTask(300, '3');
addTask(400, '4');

scheduler.taskStart()

/// 
