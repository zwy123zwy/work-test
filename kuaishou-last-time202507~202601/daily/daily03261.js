/**
 * daily03261.js
 * 面试向：Redux 简易实现 / 手写 Promise / 常见 Promise 题 / 对象创建 / 数组 API 影响 / 排序
 */

// ============================================================
// 1) Redux 简易实现（createStore / combineReducers / applyMiddleware）
// ============================================================

function createStore(reducer, preloadedState) {
  let state = preloadedState;
  let listeners = [];
  let isDispatching = false;

  function getState() {
    return state;
  }

  function subscribe(listener) {
    listeners.push(listener);
    let active = true;
    return function unsubscribe() {
      if (!active) return;
      active = false;
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  function dispatch(action) {
    if (!action || typeof action.type !== "string") {
      throw new Error("action 必须是对象且包含 string 类型的 type");
    }
    if (isDispatching) throw new Error("reducer 执行中禁止 dispatch");
    try {
      isDispatching = true;
      state = reducer(state, action);
    } finally {
      isDispatching = false;
    }
    const snapshot = listeners.slice();
    snapshot.forEach((l) => l());
    return action;
  }

  dispatch({ type: "@@redux/INIT" });

  return { getState, dispatch, subscribe };
}

function combineReducers(reducers) {
  const keys = Object.keys(reducers);
  return function rootReducer(state, action) {
    const nextState = {};
    for (const k of keys) {
      const r = reducers[k];
      nextState[k] = r(state ? state[k] : undefined, action);
    }
    return nextState;
  };
}

function compose() {
  const funcs = Array.prototype.slice.call(arguments);
  if (funcs.length === 0) return (arg) => arg;
  if (funcs.length === 1) return funcs[0];
  return funcs.reduce((a, b) => (arg) => a(b(arg)));
}

function applyMiddleware() {
  const middlewares = Array.prototype.slice.call(arguments);
  return function enhancer(create) {
    return function (reducer, preloadedState) {
      const store = create(reducer, preloadedState);
      let dispatch = () => {
        throw new Error("dispatch 正在构建中");
      };
      const api = {
        getState: store.getState,
        dispatch: (a) => dispatch(a),
      };
      const chain = middlewares.map((mw) => mw(api));
      dispatch = compose.apply(null, chain)(store.dispatch);
      return { ...store, dispatch };
    };
  };
}

// thunk / promise middleware
const thunkMiddleware = ({ dispatch, getState }) => (next) => (action) => {
  if (typeof action === "function") return action(dispatch, getState);
  return next(action);
};

const promiseMiddleware = ({ dispatch }) => (next) => (action) => {
  if (action && typeof action.then === "function") return action.then(dispatch);
  if (action && action.payload && typeof action.payload.then === "function") {
    return action.payload.then(
      (v) => dispatch({ ...action, payload: v }),
      (e) => dispatch({ ...action, error: true, payload: e })
    );
  }
  return next(action);
};

// ============================================================
// 2) Promise class 手写（简化但覆盖 then/catch/finally + 静态方法）
// ============================================================

const _queueMicrotask = typeof queueMicrotask === "function" ? queueMicrotask : (fn) => Promise.resolve().then(fn);

class MyPromise {
  constructor(executor) {
    this.status = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledQueue = [];
    this.onRejectedQueue = [];

    const resolve = (v) => this._resolve(v);
    const reject = (e) => this._reject(e);

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  _resolve(v) {
    if (this.status !== "pending") return;
    if (v === this) return this._reject(new TypeError("Chaining cycle"));

    if (v && (typeof v === "object" || typeof v === "function")) {
      let then;
      try {
        then = v.then;
      } catch (e) {
        return this._reject(e);
      }
      if (typeof then === "function") {
        let called = false;
        try {
          then.call(
            v,
            (y) => {
              if (called) return;
              called = true;
              this._resolve(y);
            },
            (r) => {
              if (called) return;
              called = true;
              this._reject(r);
            }
          );
        } catch (e) {
          if (!called) this._reject(e);
        }
        return;
      }
    }

    this.status = "fulfilled";
    this.value = v;
    this.onFulfilledQueue.forEach((fn) => fn(v));
    this.onFulfilledQueue = [];
    this.onRejectedQueue = [];
  }

  _reject(e) {
    if (this.status !== "pending") return;
    this.status = "rejected";
    this.reason = e;
    this.onRejectedQueue.forEach((fn) => fn(e));
    this.onFulfilledQueue = [];
    this.onRejectedQueue = [];
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled = typeof onFulfilled === "function" ? onFulfilled : (v) => v;
    const realOnRejected =
      typeof onRejected === "function"
        ? onRejected
        : (e) => {
            throw e;
          };

    return new MyPromise((resolve, reject) => {
      const runFulfilled = () => {
        _queueMicrotask(() => {
          try {
            resolve(realOnFulfilled(this.value));
          } catch (e) {
            reject(e);
          }
        });
      };

      const runRejected = () => {
        _queueMicrotask(() => {
          try {
            resolve(realOnRejected(this.reason));
          } catch (e) {
            reject(e);
          }
        });
      };

      if (this.status === "fulfilled") runFulfilled();
      else if (this.status === "rejected") runRejected();
      else {
        this.onFulfilledQueue.push(runFulfilled);
        this.onRejectedQueue.push(runRejected);
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(cb) {
    return this.then(
      (v) => MyPromise.resolve(cb()).then(() => v),
      (e) => MyPromise.resolve(cb()).then(() => {
        throw e;
      })
    );
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value;
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const res = [];
      let done = 0;
      if (promises.length === 0) return resolve([]);
      promises.forEach((p, i) => {
        MyPromise.resolve(p).then(
          (v) => {
            res[i] = v;
            done++;
            if (done === promises.length) resolve(res);
          },
          (e) => reject(e)
        );
      });
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach((p) => MyPromise.resolve(p).then(resolve, reject));
    });
  }

  static allSettled(promises) {
    return new MyPromise((resolve) => {
      const res = [];
      let done = 0;
      if (promises.length === 0) return resolve([]);
      promises.forEach((p, i) => {
        MyPromise.resolve(p).then(
          (v) => {
            res[i] = { status: "fulfilled", value: v };
            done++;
            if (done === promises.length) resolve(res);
          },
          (e) => {
            res[i] = { status: "rejected", reason: e };
            done++;
            if (done === promises.length) resolve(res);
          }
        );
      });
    });
  }
}

// ============================================================
// 3) 常见 Promise 面试题代码（timeout / retry / 并发控制 / promisify）
// ============================================================

function withTimeout(p, ms, reason = new Error("Timeout")) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(reason), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      }
    );
  });
}

async function retry(fn, times, delayMs = 0) {
  let lastErr;
  for (let i = 0; i < times; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

async function limitConcurrency(items, limit, worker) {
  const res = new Array(items.length);
  let nextIndex = 0;
  const runners = new Array(Math.min(limit, items.length)).fill(0).map(async () => {
    while (nextIndex < items.length) {
      const i = nextIndex++;
      res[i] = await worker(items[i], i);
    }
  });
  await Promise.all(runners);
  return res;
}

function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, result) => (err ? reject(err) : resolve(result)));
    });
}

// ============================================================
// 4) 对象的 6 种创建方法 + 优缺点（速记见注释）
// ============================================================

// 1) {}
const obj1 = { a: 1 };
// 2) new Object()
const obj2 = new Object({ a: 1 });
// 3) Object.create(proto)
const obj3 = Object.create({ inherited: true });
// 4) 构造函数
function Foo(a) {
  this.a = a;
}
Foo.prototype.getA = function () {
  return this.a;
};
const obj4 = new Foo(1);
// 5) class
class Bar {
  constructor(a) {
    this.a = a;
  }
  getA() {
    return this.a;
  }
}
const obj5 = new Bar(1);
// 6) 工厂函数
function createBaz(a) {
  return {
    a,
    getA() {
      return a;
    },
  };
}
const obj6 = createBaz(1);

// ============================================================
// 5) 数组 API：是否影响原数组（速记）
// ============================================================

/**
 * mutate 原数组：
 * push/pop/shift/unshift, splice, sort, reverse, fill, copyWithin
 *
 * 不 mutate（返回新数组）：
 * concat, slice, map, filter, reduce, flat, flatMap
 * toReversed/toSorted/toSpliced（ES2023）
 */

function arrayApiDemos() {
  const a = [3, 1, 2];
  a.sort(); // mutate
  const b = [1, 2, 3].map((x) => x * 2); // new
  const c = [1, 2, 3].slice(1); // new
  return { a, b, c };
}

// ============================================================
// 6) 常见数组排序（都返回新数组，不改原数组）
// ============================================================

function bubbleSort(arr) {
  const a = arr.slice();
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
    }
  }
  return a;
}

function selectionSort(arr) {
  const a = arr.slice();
  for (let i = 0; i < a.length; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) if (a[j] < a[min]) min = j;
    if (min !== i) [a[i], a[min]] = [a[min], a[i]];
  }
  return a;
}

function insertionSort(arr) {
  const a = arr.slice();
  for (let i = 1; i < a.length; i++) {
    const cur = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > cur) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = cur;
  }
  return a;
}

function quickSort(arr) {
  if (arr.length <= 1) return arr.slice();
  const a = arr.slice();
  const pivot = a[Math.floor(a.length / 2)];
  const left = [];
  const mid = [];
  const right = [];
  for (const x of a) {
    if (x < pivot) left.push(x);
    else if (x > pivot) right.push(x);
    else mid.push(x);
  }
  return quickSort(left).concat(mid, quickSort(right));
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr.slice();
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const res = [];
  let i = 0;
  let j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) res.push(left[i++]);
    else res.push(right[j++]);
  }
  return res.concat(left.slice(i), right.slice(j));
}

// ============================================================
// exports（Node / 浏览器都能用）
// ============================================================

module.exports = {
  createStore,
  combineReducers,
  applyMiddleware,
  compose,
  thunkMiddleware,
  promiseMiddleware,
  MyPromise,
  withTimeout,
  retry,
  limitConcurrency,
  promisify,
  obj1,
  obj2,
  obj3,
  obj4,
  obj5,
  obj6,
  arrayApiDemos,
  bubbleSort,
  selectionSort,
  insertionSort,
  quickSort,
  mergeSort,
};

