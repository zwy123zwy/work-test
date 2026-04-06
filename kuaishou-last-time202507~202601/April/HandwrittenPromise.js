/**
 * 手写 Promise（教学向，覆盖题单「实现 Promise」常用能力）
 * 微任务：queueMicrotask，无则 Promise.resolve().then
 */

const microtask =
    typeof queueMicrotask === 'function'
        ? (fn) => queueMicrotask(fn)
        : (fn) => Promise.resolve().then(fn);

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        reject(new TypeError('Chaining cycle'));
        return;
    }
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        let called = false;
        try {
            const then = x.then;
            if (typeof then === 'function') {
                then.call(
                    x,
                    (y) => {
                        if (called) return;
                        called = true;
                        resolvePromise(promise2, y, resolve, reject);
                    },
                    (r) => {
                        if (called) return;
                        called = true;
                        reject(r);
                    }
                );
                return;
            }
        } catch (e) {
            if (called) return;
            reject(e);
            return;
        }
    }
    resolve(x);
}

class HandwrittenPromise {
    constructor(executor) {
        this.state = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = (val) => {
            if (this.state !== PENDING) return;
            microtask(() => {
                resolvePromise(this, val, (v) => {
                    this.state = FULFILLED;
                    this.value = v;
                    this.onFulfilledCallbacks.forEach((cb) => cb());
                    this.onFulfilledCallbacks = [];
                    this.onRejectedCallbacks = [];
                }, (r) => {
                    this.state = REJECTED;
                    this.reason = r;
                    this.onRejectedCallbacks.forEach((cb) => cb());
                    this.onFulfilledCallbacks = [];
                    this.onRejectedCallbacks = [];
                });
            });
        };

        const reject = (reason) => {
            if (this.state !== PENDING) return;
            microtask(() => {
                this.state = REJECTED;
                this.reason = reason;
                this.onRejectedCallbacks.forEach((cb) => cb());
                this.onFulfilledCallbacks = [];
                this.onRejectedCallbacks = [];
            });
        };

        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }

    then(onFulfilled, onRejected) {
        const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
        const realOnRejected =
            typeof onRejected === 'function'
                ? onRejected
                : (e) => {
                      throw e;
                  };

        const p2 = new HandwrittenPromise((resolve, reject) => {
            const doneFulfilled = () => {
                try {
                    const x = realOnFulfilled(this.value);
                    resolvePromise(p2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            };
            const doneRejected = () => {
                try {
                    const x = realOnRejected(this.reason);
                    resolvePromise(p2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            };

            if (this.state === FULFILLED) microtask(doneFulfilled);
            else if (this.state === REJECTED) microtask(doneRejected);
            else {
                this.onFulfilledCallbacks.push(doneFulfilled);
                this.onRejectedCallbacks.push(doneRejected);
            }
        });
        return p2;
    }

    catch(onRejected) {
        return this.then(undefined, onRejected);
    }

    finally(onFinally) {
        return this.then(
            (v) => HandwrittenPromise.resolve(onFinally()).then(() => v),
            (e) =>
                HandwrittenPromise.resolve(onFinally()).then(() => {
                    throw e;
                })
        );
    }

    static resolve(x) {
        if (x instanceof HandwrittenPromise) return x;
        return new HandwrittenPromise((res) => res(x));
    }

    static reject(r) {
        return new HandwrittenPromise((_, rej) => rej(r));
    }

    static all(iterable) {
        const arr = Array.from(iterable);
        return new HandwrittenPromise((resolve, reject) => {
            if (arr.length === 0) {
                resolve([]);
                return;
            }
            const out = new Array(arr.length);
            let n = 0;
            arr.forEach((item, i) => {
                HandwrittenPromise.resolve(item).then(
                    (v) => {
                        out[i] = v;
                        n += 1;
                        if (n === arr.length) resolve(out);
                    },
                    reject
                );
            });
        });
    }

    static race(iterable) {
        return new HandwrittenPromise((resolve, reject) => {
            for (const item of iterable) {
                HandwrittenPromise.resolve(item).then(resolve, reject);
            }
        });
    }

    static allSettled(iterable) {
        const arr = Array.from(iterable);
        return new HandwrittenPromise((resolve) => {
            if (arr.length === 0) {
                resolve([]);
                return;
            }
            const out = new Array(arr.length);
            let n = 0;
            const done = () => {
                n += 1;
                if (n === arr.length) resolve(out);
            };
            arr.forEach((item, i) => {
                HandwrittenPromise.resolve(item).then(
                    (value) => {
                        out[i] = { status: 'fulfilled', value };
                        done();
                    },
                    (reason) => {
                        out[i] = { status: 'rejected', reason };
                        done();
                    }
                );
            });
        });
    }

    static any(iterable) {
        const arr = Array.from(iterable);
        return new HandwrittenPromise((resolve, reject) => {
            if (arr.length === 0) {
                reject(new AggregateError([], 'All promises were rejected'));
                return;
            }
            const errors = new Array(arr.length);
            let rejected = 0;
            arr.forEach((item, i) => {
                HandwrittenPromise.resolve(item).then(resolve, (err) => {
                    errors[i] = err;
                    rejected += 1;
                    if (rejected === arr.length) {
                        reject(new AggregateError(errors, 'All promises were rejected'));
                    }
                });
            });
        });
    }
}

module.exports = { HandwrittenPromise };
