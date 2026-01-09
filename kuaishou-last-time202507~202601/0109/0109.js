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
