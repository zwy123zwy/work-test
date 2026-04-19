/**
 * 04182.js
 * 题目 + 函数骨架 + 可执行参考答案
 */

const questions = [
  {
    id: 1,
    title: '手写 Promise 基础版',
    prompt: '实现状态流转和 then 队列。',
    starter: `class MyPromise {
  constructor(executor) {
    // TODO
  }
}`,
    solution: `const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state !== PENDING) return;
      queueMicrotask(() => {
        if (this.state !== PENDING) return;
        this.state = FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach((fn) => fn(value));
      });
    };

    const reject = (reason) => {
      if (this.state !== PENDING) return;
      queueMicrotask(() => {
        if (this.state !== PENDING) return;
        this.state = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn(reason));
      });
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    const fulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v;
    const rejected = typeof onRejected === 'function' ? onRejected : (e) => { throw e; };

    return new MyPromise((resolve, reject) => {
      const handleFulfilled = (value) => {
        try {
          resolve(fulfilled(value));
        } catch (error) {
          reject(error);
        }
      };

      const handleRejected = (reason) => {
        try {
          resolve(rejected(reason));
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === PENDING) {
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      } else if (this.state === FULFILLED) {
        queueMicrotask(() => handleFulfilled(this.value));
      } else {
        queueMicrotask(() => handleRejected(this.reason));
      }
    });
  }
}`,
    focus: ['Promise/A+', '状态机'],
  },
  {
    id: 2,
    title: '实现 then 链式调用',
    prompt: '支持返回普通值和 thenable。',
    starter: `MyPromise.prototype.then = function(onFulfilled, onRejected) {
  // TODO
};`,
    solution: `function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) return reject(new TypeError('Chaining cycle detected'));
  if (x && (typeof x === 'object' || typeof x === 'function')) {
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
      } else {
        resolve(x);
      }
    } catch (error) {
      if (!called) reject(error);
    }
  } else {
    resolve(x);
  }
}`,
    focus: ['链式调用'],
  },
  {
    id: 3,
    title: '实现 catch',
    prompt: '基于 then 扩展。',
    starter: `MyPromise.prototype.catch = function(onRejected) {
  // TODO
};`,
    solution: `MyPromise.prototype.catch = function(onRejected) {
  return this.then(undefined, onRejected);
};`,
    focus: ['错误传播'],
  },
  {
    id: 4,
    title: '实现 finally',
    prompt: '无论成功失败都执行。',
    starter: `MyPromise.prototype.finally = function(handler) {
  // TODO
};`,
    solution: `MyPromise.prototype.finally = function(handler) {
  return this.then(
    (value) => Promise.resolve(handler()).then(() => value),
    (reason) => Promise.resolve(handler()).then(() => { throw reason; })
  );
};`,
    focus: ['收尾逻辑'],
  },
  {
    id: 5,
    title: '实现 Promise.resolve',
    prompt: '兼容 thenable。',
    starter: `MyPromise.resolve = function(value) {
  // TODO
};`,
    solution: `MyPromise.resolve = function(value) {
  if (value instanceof MyPromise) return value;
  return new MyPromise((resolve) => resolve(value));
};`,
    focus: ['规范兼容'],
  },
  {
    id: 6,
    title: '实现 Promise.reject',
    prompt: '直接创建 rejected Promise。',
    starter: `MyPromise.reject = function(reason) {
  // TODO
};`,
    solution: `MyPromise.reject = function(reason) {
  return new MyPromise((_, reject) => reject(reason));
};`,
    focus: ['快速失败'],
  },
  {
    id: 7,
    title: '实现 Promise.all',
    prompt: '按顺序收集结果。',
    starter: `function promiseAll(list) {
  // TODO
}`,
    solution: `function promiseAll(list) {
  return new Promise((resolve, reject) => {
    if (list.length === 0) return resolve([]);
    const result = new Array(list.length);
    let count = 0;
    list.forEach((item, index) => {
      Promise.resolve(item).then(
        (value) => {
          result[index] = value;
          count += 1;
          if (count === list.length) resolve(result);
        },
        reject
      );
    });
  });
}`,
    focus: ['并发聚合'],
  },
  {
    id: 8,
    title: '实现 Promise.allSettled',
    prompt: '收集每项状态和值。',
    starter: `function promiseAllSettled(list) {
  // TODO
}`,
    solution: `function promiseAllSettled(list) {
  return Promise.all(
    list.map((item) =>
      Promise.resolve(item).then(
        (value) => ({ status: 'fulfilled', value }),
        (reason) => ({ status: 'rejected', reason })
      )
    )
  );
}`,
    focus: ['聚合结果'],
  },
  {
    id: 9,
    title: '实现 Promise.race',
    prompt: '取最先 settle 的结果。',
    starter: `function promiseRace(list) {
  // TODO
}`,
    solution: `function promiseRace(list) {
  return new Promise((resolve, reject) => {
    for (const item of list) {
      Promise.resolve(item).then(resolve, reject);
    }
  });
}`,
    focus: ['竞态'],
  },
  {
    id: 10,
    title: '实现 Promise.any',
    prompt: '全部失败时抛 AggregateError。',
    starter: `function promiseAny(list) {
  // TODO
}`,
    solution: `function promiseAny(list) {
  return new Promise((resolve, reject) => {
    const errors = [];
    let failed = 0;
    if (list.length === 0) return reject(new AggregateError([], 'All promises were rejected'));
    list.forEach((item, index) => {
      Promise.resolve(item).then(
        resolve,
        (error) => {
          errors[index] = error;
          failed += 1;
          if (failed === list.length) {
            reject(new AggregateError(errors, 'All promises were rejected'));
          }
        }
      );
    });
  });
}`,
    focus: ['错误聚合'],
  },
  {
    id: 11,
    title: '实现串行任务队列',
    prompt: '任务函数依次执行。',
    starter: `async function runSerial(tasks) {
  // TODO
}`,
    solution: `async function runSerial(tasks) {
  const result = [];
  for (const task of tasks) {
    result.push(await task());
  }
  return result;
}`,
    focus: ['异步串行'],
  },
  {
    id: 12,
    title: '实现并发控制器',
    prompt: '限制最大并发数。',
    starter: `async function asyncPool(limit, tasks) {
  // TODO
}`,
    solution: `async function asyncPool(limit, tasks) {
  const result = [];
  const executing = [];
  for (const task of tasks) {
    const p = Promise.resolve().then(task);
    result.push(p);
    if (limit <= tasks.length) {
      const e = p.then(() => {
        executing.splice(executing.indexOf(e), 1);
      });
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(result);
}`,
    focus: ['调度器'],
  },
  {
    id: 13,
    title: '实现 scheduler.addTask',
    prompt: '输出任务调度顺序。',
    starter: `class Scheduler {
  addTask(task) {
    // TODO
  }
}`,
    solution: `class Scheduler {
  constructor(limit = 2) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }

  addTask(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.run();
    });
  }

  run() {
    while (this.running < this.limit && this.queue.length) {
      const { task, resolve, reject } = this.queue.shift();
      this.running += 1;
      Promise.resolve()
        .then(task)
        .then(resolve, reject)
        .finally(() => {
          this.running -= 1;
          this.run();
        });
    }
  }
}`,
    focus: ['经典面试题'],
  },
  {
    id: 14,
    title: '实现 retry',
    prompt: '失败后指数退避。',
    starter: `async function retry(fn, times, delay) {
  // TODO
}`,
    solution: `function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retry(fn, times, delay) {
  let lastError;
  for (let i = 0; i < times; i += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < times - 1) {
        await sleep(delay * 2 ** i);
      }
    }
  }
  throw lastError;
}`,
    focus: ['重试策略'],
  },
  {
    id: 15,
    title: '实现 timeoutPromise',
    prompt: '超时主动失败。',
    starter: `function timeoutPromise(promise, ms) {
  // TODO
}`,
    solution: `function timeoutPromise(promise, ms) {
  let timer = null;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}`,
    focus: ['超时控制'],
  },
  {
    id: 16,
    title: '实现 sleep',
    prompt: '支持 await。',
    starter: `function sleep(ms) {
  // TODO
}`,
    solution: `function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}`,
    focus: ['基础封装'],
  },
  {
    id: 17,
    title: '实现 asyncPool',
    prompt: '批量请求限流。',
    starter: `async function asyncPool(limit, items, iteratorFn) {
  // TODO
}`,
    solution: `async function asyncPool(limit, items, iteratorFn) {
  const tasks = items.map((item) => () => iteratorFn(item));
  return asyncPoolCore(limit, tasks);
}

async function asyncPoolCore(limit, tasks) {
  const result = [];
  const executing = [];
  for (const task of tasks) {
    const p = Promise.resolve().then(task);
    result.push(p);
    const e = p.finally(() => {
      executing.splice(executing.indexOf(e), 1);
    });
    executing.push(e);
    if (executing.length >= limit) await Promise.race(executing);
  }
  return Promise.all(result);
}`,
    focus: ['并发池'],
  },
  {
    id: 18,
    title: '实现请求去重',
    prompt: '相同 key 并发只发一次。',
    starter: `function createDedupedRequest(request) {
  // TODO
}`,
    solution: `function createDedupedRequest(request) {
  const inFlight = new Map();
  return function deduped(key, ...args) {
    if (inFlight.has(key)) return inFlight.get(key);
    const promise = Promise.resolve().then(() => request(...args));
    inFlight.set(key, promise);
    return promise.finally(() => inFlight.delete(key));
  };
}`,
    focus: ['请求合并'],
  },
  {
    id: 19,
    title: '实现任务取消',
    prompt: '支持 AbortController。',
    starter: `function requestWithCancel(task, signal) {
  // TODO
}`,
    solution: `function requestWithCancel(task, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new Error('Aborted'));
    const onAbort = () => reject(new Error('Aborted'));
    signal?.addEventListener('abort', onAbort, { once: true });
    Promise.resolve()
      .then(task)
      .then(resolve, reject)
      .finally(() => signal?.removeEventListener('abort', onAbort));
  });
}`,
    focus: ['取消语义'],
  },
  {
    id: 20,
    title: '实现红绿灯循环',
    prompt: '按时序反复执行。',
    starter: `async function trafficLight() {
  // TODO
}`,
    solution: `function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createTrafficLight() {
  let running = true;
  async function start() {
    while (running) {
      console.log('red');
      await wait(3000);
      console.log('yellow');
      await wait(1000);
      console.log('green');
      await wait(2000);
    }
  }
  return {
    start,
    stop() {
      running = false;
    },
  };
}`,
    focus: ['异步递归', '时序控制'],
  },
];

module.exports = questions;
