class MyPromise {
    constructor(executor) {
        this.status = "pending";
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        const resolve = (value) => {
            if (value instanceof MyPromise) {
                return value.then(resolve, reject);
            }

            setTimeout(() => {
                if (this.status === "pending") {
                    this.status = "fulfilled";
                    this.value = value;
                    this.onFulfilledCallbacks.forEach((fn) => fn());
                }
            }, 0);
        };
        const reject = (reason) => {
            setTimeout(() => {
                if (this.status === "pending") {
                    this.status = "rejected";
                    this.reason = reason;
                    this.onRejectedCallbacks.forEach((fn) => fn());
                }
            }, 0);
        };
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            const fulfilledCallback = () => {
                try {
                    const result = onFulfilled(this.value);
                    return result instanceof MyPromise
                        ? result.then(resolve, reject)
                        : resolve(result);
                } catch (error) {
                    reject(error);
                }
            };

            const rejectedCallback = () => {
                try {
                    const result = onRejected(this.reason);
                    return result instanceof MyPromise
                        ? result.then(resolve, reject)
                        : resolve(result);
                } catch (error) {
                    reject(error);
                }
            };

            if (this.status === "fulfilled") {
                fulfilledCallback();
            } else if (this.status === "rejected") {
                rejectedCallback();
            } else {
                this.onFulfilledCallbacks.push(fulfilledCallback);
                this.onRejectedCallbacks.push(rejectedCallback);
            }
        });
    }
}

MyPromise.all = function (promises) {
    return new MyPromise((resolve, reject) => {
        let results = [];
        let completed = 0;
        promises.forEach((promise, index) => {
            MyPromise.resolve(promise)
                .then((value) => {
                    results[index] = value;
                    completed++;
                    if (completed === promises.length) {
                        resolve(results);
                    }
                })
                .catch(reject);
        });
    });
};

MyPromise.allSettled = function (promises) {
    return new MyPromise((resolve) => {
        let results = [];
        let completed = 0;
        promises.forEach((promise, index) => {
            MyPromise.resolve(promise).then(
                (value) => {
                    results[index] = { status: "fulfilled", value };
                    completed++;
                    if (completed === promises.length) {
                        resolve(results);
                    }
                },
                (reason) => {
                    results[index] = { status: "rejected", reason };
                    completed++;
                    if (completed === promises.length) {
                        resolve(results);
                    }
                },
            );
        });
    });
};

MyPromise.race = function (promises) {
    return new MyPromise((resolve, reject) => {
        promises.forEach((promise) => {
            MyPromise.resolve(promise).then(resolve, reject);
        });
    });
};

class Scheduler {
    constructor(limit) {
        this.limit = limit;
        this.queue = [];
        this.activeCount = 0;
        this.currentIndex = 0;
        this.results = [];
    }

    add(promiseFunc) {
        this.queue.push({promiseFunc, index: this.currentIndex++});
        this.run();
    }
    
    run() {
        if(this.activeCount >= this.limit || this.queue.length === 0) {
            return;
        }
        const {promiseFunc, index} = this.queue.shift();
        this.activeCount++;
        promiseFunc().then((result) => {
            this.results[index] = result;
            this.activeCount--;
            this.run();
        }).catch((error) => {
            this.results[index] = error;
            this.activeCount--;
            this.run();
        });
    }
}



// - 手写 `Promise.all`、`Promise.allSettled`、`Promise.race`
// - 并发控制：限制同时请求数量（Scheduler）
// - 取消请求：`AbortController` / `Promise.race` + 取消标记
