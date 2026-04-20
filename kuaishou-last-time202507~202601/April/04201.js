// 04201 - 异步专题（含参考答案）

// 问题1：实现可取消 Promise（cancelable promise）
function solution_04201_1(executor) {
  let canceled = false;
  const promise = new Promise((resolve, reject) => {
    executor(
      (value) => {
        if (!canceled) resolve(value);
      },
      (err) => {
        if (!canceled) reject(err);
      },
    );
  });
  return {
    promise,
    cancel() {
      canceled = true;
    },
  };
}

// 问题2：实现 Promise 超时包装（withTimeout）
function solution_04201_2(promise, ms) {
  return Promise.race([
    Promise.resolve(promise),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), ms);
    }),
  ]);
}

// 问题3：实现并发控制器 pLimit
function solution_04201_3(limit) {
  let active = 0;
  const queue = [];
  const next = () => {
    if (active >= limit || queue.length === 0) return;
    active += 1;
    const { fn, resolve, reject } = queue.shift();
    Promise.resolve()
      .then(fn)
      .then(resolve, reject)
      .finally(() => {
        active -= 1;
        next();
      });
  };
  return (fn) =>
    new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      next();
    });
}

// 问题4：实现串行执行器 serialTasks
function solution_04201_4(tasks) {
  return tasks.reduce((p, task) => p.then((arr) => Promise.resolve(task()).then((res) => [...arr, res])), Promise.resolve([]));
}

// 问题5：实现重试函数 retry
async function solution_04201_5(fn, times = 3) {
  let lastErr;
  for (let i = 0; i < times; i += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
}

// 问题6：实现指数退避重试 backoffRetry
async function solution_04201_6(fn, times = 3, baseDelay = 100) {
  let lastErr;
  for (let i = 0; i < times; i += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const delay = baseDelay * 2 ** i;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

// 问题7：实现请求池 requestPool
async function solution_04201_7(taskFns, limit = 3) {
  const run = solution_04201_3(limit);
  return Promise.all(taskFns.map((fn) => run(fn)));
}

// 问题8：实现 Promise.any
function solution_04201_8(promises) {
  return new Promise((resolve, reject) => {
    const errors = [];
    let failed = 0;
    if (promises.length === 0) reject(new AggregateError([], 'All promises were rejected'));
    promises.forEach((p, i) => {
      Promise.resolve(p).then(resolve, (err) => {
        errors[i] = err;
        failed += 1;
        if (failed === promises.length) reject(new AggregateError(errors, 'All promises were rejected'));
      });
    });
  });
}

// 问题9：实现 Promise.allSettled
function solution_04201_9(promises) {
  return Promise.all(
    promises.map((p) =>
      Promise.resolve(p).then(
        (value) => ({ status: 'fulfilled', value }),
        (reason) => ({ status: 'rejected', reason }),
      ),
    ),
  );
}

// 问题10：实现 Promise.finally
function solution_04201_10(promise, cb) {
  return Promise.resolve(promise).then(
    (value) => Promise.resolve(cb()).then(() => value),
    (err) => Promise.resolve(cb()).then(() => Promise.reject(err)),
  );
}

// 问题11：实现 sleep
function solution_04201_11(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 问题12：实现异步轮询 asyncPoll
async function solution_04201_12(fn, validate, interval = 100, maxTimes = 10) {
  for (let i = 0; i < maxTimes; i += 1) {
    const res = await fn();
    if (validate(res)) return res;
    await solution_04201_11(interval);
  }
  throw new Error('Poll timeout');
}

// 问题13：实现异步队列 AsyncQueue
class solution_04201_13 {
  constructor() {
    this.values = [];
    this.waiters = [];
  }
  enqueue(val) {
    if (this.waiters.length) {
      const resolve = this.waiters.shift();
      resolve(val);
    } else {
      this.values.push(val);
    }
  }
  dequeue() {
    if (this.values.length) return Promise.resolve(this.values.shift());
    return new Promise((resolve) => this.waiters.push(resolve));
  }
}

// 问题14：实现任务调度器 Scheduler
class solution_04201_14 {
  constructor(limit = 2) {
    this.limit = limit;
    this.active = 0;
    this.queue = [];
  }
  add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.run();
    });
  }
  run() {
    while (this.active < this.limit && this.queue.length) {
      const { task, resolve, reject } = this.queue.shift();
      this.active += 1;
      Promise.resolve()
        .then(task)
        .then(resolve, reject)
        .finally(() => {
          this.active -= 1;
          this.run();
        });
    }
  }
}

// 问题15：实现 debouncePromise
function solution_04201_15(fn, wait) {
  let timer = null;
  let pendingReject = null;
  return (...args) =>
    new Promise((resolve, reject) => {
      if (timer) clearTimeout(timer);
      if (pendingReject) pendingReject(new Error('Canceled by debounce'));
      pendingReject = reject;
      timer = setTimeout(() => {
        pendingReject = null;
        Promise.resolve(fn(...args)).then(resolve, reject);
      }, wait);
    });
}

// 问题16：实现 throttlePromise
function solution_04201_16(fn, wait) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last < wait) return Promise.reject(new Error('Throttled'));
    last = now;
    return Promise.resolve(fn(...args));
  };
}

// 问题17：实现 memoizeAsync
function solution_04201_17(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      cache.set(
        key,
        Promise.resolve(fn(...args)).catch((err) => {
          cache.delete(key);
          throw err;
        }),
      );
    }
    return cache.get(key);
  };
}

// 问题18：实现流水线 asyncPipeline
function solution_04201_18(...fns) {
  return (input) => fns.reduce((p, fn) => p.then(fn), Promise.resolve(input));
}

// 问题19：实现并行 map asyncMap
function solution_04201_19(arr, mapper) {
  return Promise.all(arr.map((item, idx) => Promise.resolve(mapper(item, idx))));
}

// 问题20：实现批处理 batchRun
async function solution_04201_20(tasks, size = 5) {
  const result = [];
  for (let i = 0; i < tasks.length; i += size) {
    const batch = tasks.slice(i, i + size);
    const res = await Promise.all(batch.map((fn) => fn()));
    result.push(...res);
  }
  return result;
}
