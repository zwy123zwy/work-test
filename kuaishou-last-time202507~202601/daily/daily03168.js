// 简易 Promise 实现（JavaScript 版本）

const asyncQueue =
  typeof queueMicrotask === 'function'
    ? queueMicrotask
    : (cb) => setTimeout(cb, 0);

class MyPromise1 {
  constructor(executor) {
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.status !== 'pending') return;
      if (value instanceof MyPromise1) {
        return value.then(resolve, reject);
      }
      asyncQueue(() => {
        if (this.status !== 'pending') return;
        this.status = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach((fn) => fn(value));
      });
    };

    const reject = (reason) => {
      if (this.status !== 'pending') return;
      asyncQueue(() => {
        if (this.status !== 'pending') return;
        this.status = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn(reason));
      });
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    const fulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
    const rejected =
      typeof onRejected === 'function'
        ? onRejected
        : (e) => {
            throw e;
          };

    return new MyPromise1((resolve, reject) => {
      const handleFulfilled = (value) => {
        asyncQueue(() => {
          try {
            const result = fulfilled(value);
            result instanceof MyPromise1
              ? result.then(resolve, reject)
              : resolve(result);
          } catch (err) {
            reject(err);
          }
        });
      };

      const handleRejected = (reason) => {
        asyncQueue(() => {
          try {
            const result = rejected(reason);
            result instanceof MyPromise1
              ? result.then(resolve, reject)
              : resolve(result);
          } catch (err) {
            reject(err);
          }
        });
      };

      if (this.status === 'fulfilled') {
        handleFulfilled(this.value);
      } else if (this.status === 'rejected') {
        handleRejected(this.reason);
      } else {
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    });
  }
}

// 简单使用示例
// const p = new MyPromise1((resolve, reject) => {
//   setTimeout(() => resolve(1), 1000);
// });
// p.then((v) => v + 1)
//  .then(console.log);

