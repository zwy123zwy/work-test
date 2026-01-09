// 并发限制
class Limiter {
    constructor(limit) {
        this.limit = limit;
        this.running = 0;
        this.queue = [];
        this.results = [];
    }
    add(promiseTask) {
        this.queue.push(promiseTask);
    }

    run() {
        if (!this.queue.length || !this.running || this.running >= this.limit) {
            return;
        }
        this.running++;
        for (let i = 0; i < this.limit; i++) {
            const task = this.queue.shift();
            if (!task) {
                break;
            }
            task().then(res => {
                this.results.push(res);
            }).finally(() => {
                this.running--;
                this.run();
            });
        }
    }
    start() {
        for (let i = 0; i < this.limit; i++) {
            this.run();
        }
    }
}

// promise
Promise.prototype.myAll = function (promises) {
    let count = 0;
    let results = [];
    return new Promise((resolve, reject) => {
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(res => {
                count++;
                results[index] = res;
                if (count === promises.length) {
                    resolve(this.results);
                }
            },
                err => reject(err)
            )
        })
    })
}

// 
Promise.prototype.myRace = function (promises) {
    return new Promise((resolve, reject) => {
        promises.forEach(promise => {
            Promise.resolve(promise).then(res => resolve(res),
                err => reject(err)
            )
        })
    })
}

Promise.prototype.myAny = function (promises) {
    let count = 0;
    let results = [];
    return new Promise((resolve, reject) => {
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(res => {
                resolve(res);
            },
                err => {
                    count++;
                    results[index] = err;
                    if (count === promises.length) {
                        reject(results);
                    }
                }
            )
        })
    })
}

// async
function asyncGenerator(generator) {
    return function () {
        let iterator = generator();
        return new Promise((resolve, reject) => {
            function next(data) {
                let { value, done } = iterator.next(data);
                if (done) {
                    resolve(value);
                } else {
                    Promise.resolve(value).then(res => next(res),
                        err => reject(err)
                    )
                }
            }
        })
    }
}

// promise
function myPromise() {
    const self = this;
    self.status = 'pending';
    self.value = null;
    self.reason = null;
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
                self.onResolvedCallbacks.forEach(fn => fn());
            }
        }, 0);
    }

    function reject(reason) {
        setTimeout(() => {
            if (self.status === 'pending') {
                self.status = 'rejected';
                self.reason = reason;
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


Promise.prototype.then = function (onResolved, onRejected) {
    const self = this;
    return new Promise((resolve, reject) => {
        function resolvePromise() {
            try {
                let x = onResolved(this.value);
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
                let x = onRejected(this.reason);
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
