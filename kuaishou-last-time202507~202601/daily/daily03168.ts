// 

const asyncQueue = typeof queueMicrotask === 'function'
  ? queueMicrotask
  : (cb: () => void) => setTimeout(cb, 0);

class MyPromise1 {
  public status: 'pending' | 'fulfilled' | 'rejected';
  public value: any;
  public reason: any;
  public onFulfilledCallbacks: Array<(value: any) => void>;
  public onRejectedCallbacks: Array<(reason: any) => void>;

  constructor(executor: (resolve: (value: any) => void, reject: (reason: any) => void) => void) {
    this.status = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value: any) => {
      if (this.status !== 'pending') return;
      // 处理 thenable / MyPromise1
      if (value instanceof MyPromise1) {
        return value.then(resolve, reject);
      }
      asyncQueue(() => {
        if (this.status !== 'pending') return;
        this.status = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach(fn => fn(value));
      });
    };

    const reject = (reason: any) => {
      if (this.status !== 'pending') return;
      asyncQueue(() => {
        if (this.status !== 'pending') return;
        this.status = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn(reason));
      });
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  public then(
    onFulfilled?: (value: any) => any,
    onRejected?: (reason: any) => any
  ): MyPromise1 {
    // 默认处理：值透传 / 错误透传
    const fulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (v: any) => v;
    const rejected =
      typeof onRejected === 'function'
        ? onRejected
        : (e: any) => {
            throw e;
          };

    return new MyPromise1((resolve, reject) => {
      const handleFulfilled = (value: any) => {
        asyncQueue(() => {
          try {
            const result = fulfilled(value);
            result instanceof MyPromise1
              ? result.then(resolve, reject)
              : resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      };

      const handleRejected = (reason: any) => {
        asyncQueue(() => {
          try {
            const result = rejected(reason);
            result instanceof MyPromise1
              ? result.then(resolve, reject)
              : resolve(result);
          } catch (error) {
            reject(error);
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