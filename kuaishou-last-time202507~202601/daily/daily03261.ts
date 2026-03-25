/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * daily03261.ts
 * 面试向：Redux 简易实现 / 手写 Promise / 常见 Promise 题 / 对象创建 / 数组 API 影响 / 排序 / TS 体操
 */

// ============================================================
// 1) Redux 简易实现（createStore / combineReducers / applyMiddleware）
// ============================================================

export type Action<T extends string = string> = { type: T } & Record<string, any>;
export type Reducer<S, A extends Action = Action> = (state: S | undefined, action: A) => S;
export type Unsubscribe = () => void;
export type Listener = () => void;
export type Dispatch<A extends Action = Action> = (action: A) => A;

export interface Store<S, A extends Action = Action> {
  getState(): S;
  dispatch: Dispatch<A>;
  subscribe(listener: Listener): Unsubscribe;
}

type PreloadedState<S> = S | undefined;

export function createStore<S, A extends Action = Action>(
  reducer: Reducer<S, A>,
  preloadedState?: PreloadedState<S>
): Store<S, A> {
  let state = preloadedState as S | undefined;
  let listeners: Listener[] = [];
  let isDispatching = false;

  const getState = () => state as S;

  const subscribe = (listener: Listener): Unsubscribe => {
    listeners.push(listener);
    let active = true;
    return () => {
      if (!active) return;
      active = false;
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  const dispatch: Dispatch<A> = (action) => {
    if (!action || typeof action.type !== 'string') {
      throw new Error('action 必须是对象且包含 string 类型的 type');
    }
    if (isDispatching) throw new Error('reducer 执行中禁止 dispatch');
    try {
      isDispatching = true;
      state = reducer(state, action);
    } finally {
      isDispatching = false;
    }
    // 快照通知（避免订阅者中途变更影响本轮）
    const snapshot = listeners.slice();
    snapshot.forEach((l) => l());
    return action;
  };

  // 初始化 state
  dispatch({ type: '@@redux/INIT' } as A);

  return { getState, dispatch, subscribe };
}

export type ReducersMapObject<S, A extends Action = Action> = {
  [K in keyof S]: Reducer<S[K], A>;
};

export function combineReducers<S, A extends Action = Action>(reducers: ReducersMapObject<S, A>): Reducer<S, A> {
  const keys = Object.keys(reducers) as Array<keyof S>;
  return (state: S | undefined, action: A): S => {
    const nextState: Partial<S> = {};
    for (const k of keys) {
      const r = reducers[k];
      const prevSlice = state ? state[k] : undefined;
      (nextState as any)[k] = r(prevSlice, action);
    }
    return nextState as S;
  };
}

// middleware：({getState, dispatch}) => next => action
export type MiddlewareAPI<S, A extends Action = Action> = { getState: () => S; dispatch: Dispatch<A> };
export type Middleware<S, A extends Action = Action> = (api: MiddlewareAPI<S, A>) => (next: Dispatch<A>) => Dispatch<A>;
export type StoreEnhancer<S, A extends Action = Action> = (create: typeof createStore<S, A>) => typeof createStore<S, A>;

export function applyMiddleware<S, A extends Action = Action>(...middlewares: Array<Middleware<S, A>>): StoreEnhancer<S, A> {
  return (create) =>
    (reducer, preloadedState) => {
      const store = create(reducer, preloadedState);
      let dispatch: Dispatch<A> = () => {
        throw new Error('dispatch 正在构建中');
      };
      const api: MiddlewareAPI<S, A> = {
        getState: store.getState,
        dispatch: (a) => dispatch(a),
      };

      const chain = middlewares.map((mw) => mw(api));
      dispatch = compose(...chain)(store.dispatch);

      return { ...store, dispatch };
    };
}

export function compose<T>(...funcs: Array<(arg: T) => T>) {
  if (funcs.length === 0) return (arg: T) => arg;
  if (funcs.length === 1) return funcs[0];
  return funcs.reduce((a, b) => (arg: T) => a(b(arg)));
}

// 常见 middleware：thunk / promise
export type Thunk<S, A extends Action = Action> = (dispatch: Dispatch<A>, getState: () => S) => any;
export type ThunkAction<S, A extends Action = Action> = A | Thunk<S, A>;

export const thunkMiddleware =
  <S, A extends Action = Action>({ dispatch, getState }: MiddlewareAPI<S, A>) =>
  (next: Dispatch<A>) =>
  (action: any) => {
    if (typeof action === 'function') return (action as Thunk<S, A>)(dispatch, getState);
    return next(action);
  };

export const promiseMiddleware =
  <S, A extends Action = Action>({ dispatch }: MiddlewareAPI<S, A>) =>
  (next: Dispatch<A>) =>
  (action: any) => {
    if (action && typeof action.then === 'function') {
      return action.then(dispatch);
    }
    if (action && action.payload && typeof action.payload.then === 'function') {
      return action.payload.then(
        (v: any) => dispatch({ ...action, payload: v }),
        (e: any) => dispatch({ ...action, error: true, payload: e })
      );
    }
    return next(action);
  };

// ============================================================
// 2) Promise class 手写（简化但覆盖 then/catch/finally + 静态方法）
// ============================================================

type Resolve<T> = (value: T | MyPromise<T>) => void;
type Reject = (reason?: any) => void;

type Status = 'pending' | 'fulfilled' | 'rejected';

export class MyPromise<T = any> {
  private status: Status = 'pending';
  private value: any;
  private reason: any;
  private onFulfilledQueue: Array<(v: any) => void> = [];
  private onRejectedQueue: Array<(e: any) => void> = [];

  constructor(executor: (resolve: Resolve<T>, reject: Reject) => void) {
    const resolve: Resolve<T> = (v) => this._resolve(v);
    const reject: Reject = (e) => this._reject(e);
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  private _resolve(v: any) {
    if (this.status !== 'pending') return;
    if (v === this) return this._reject(new TypeError('Chaining cycle'));

    // thenable 解析
    if (v && (typeof v === 'object' || typeof v === 'function')) {
      let then: any;
      try {
        then = (v as any).then;
      } catch (e) {
        return this._reject(e);
      }
      if (typeof then === 'function') {
        let called = false;
        try {
          then.call(
            v,
            (y: any) => {
              if (called) return;
              called = true;
              this._resolve(y);
            },
            (r: any) => {
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

    this.status = 'fulfilled';
    this.value = v;
    this.onFulfilledQueue.forEach((fn) => fn(v));
    this.onFulfilledQueue = [];
    this.onRejectedQueue = [];
  }

  private _reject(e: any) {
    if (this.status !== 'pending') return;
    this.status = 'rejected';
    this.reason = e;
    this.onRejectedQueue.forEach((fn) => fn(e));
    this.onFulfilledQueue = [];
    this.onRejectedQueue = [];
  }

  then<U = T, V = never>(
    onFulfilled?: ((value: T) => U | MyPromise<U>) | null,
    onRejected?: ((reason: any) => V | MyPromise<V>) | null
  ): MyPromise<U | V> {
    const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v: any) => v;
    const realOnRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (e: any) => {
            throw e;
          };

    const next = new MyPromise<U | V>((resolve, reject) => {
      const runFulfilled = () => {
        queueMicrotask(() => {
          try {
            const x = realOnFulfilled(this.value);
            resolve(x as any);
          } catch (e) {
            reject(e);
          }
        });
      };

      const runRejected = () => {
        queueMicrotask(() => {
          try {
            const x = realOnRejected(this.reason);
            resolve(x as any);
          } catch (e) {
            reject(e);
          }
        });
      };

      if (this.status === 'fulfilled') runFulfilled();
      else if (this.status === 'rejected') runRejected();
      else {
        this.onFulfilledQueue.push(() => runFulfilled());
        this.onRejectedQueue.push(() => runRejected());
      }
    });

    return next;
  }

  catch<V = never>(onRejected: (reason: any) => V | MyPromise<V>) {
    return this.then(null, onRejected);
  }

  finally(cb: () => any) {
    return this.then(
      (v) => MyPromise.resolve(cb()).then(() => v),
      (e) => MyPromise.resolve(cb()).then(() => {
        throw e;
      })
    );
  }

  static resolve<T>(value: T | MyPromise<T>) {
    if (value instanceof MyPromise) return value;
    return new MyPromise<T>((resolve) => resolve(value as any));
  }

  static reject(reason?: any) {
    return new MyPromise((_, reject) => reject(reason));
  }

  static all<T>(promises: Array<T | MyPromise<T>>): MyPromise<T[]> {
    return new MyPromise<T[]>((resolve, reject) => {
      const res: T[] = [];
      let done = 0;
      promises.forEach((p, i) => {
        MyPromise.resolve(p as any).then(
          (v) => {
            res[i] = v;
            done++;
            if (done === promises.length) resolve(res);
          },
          (e) => reject(e)
        );
      });
      if (promises.length === 0) resolve([]);
    });
  }

  static race<T>(promises: Array<T | MyPromise<T>>): MyPromise<T> {
    return new MyPromise<T>((resolve, reject) => {
      promises.forEach((p) => MyPromise.resolve(p as any).then(resolve, reject));
    });
  }

  static allSettled<T>(promises: Array<T | MyPromise<T>>) {
    return new MyPromise<Array<{ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: any }>>((resolve) => {
      const res: any[] = [];
      let done = 0;
      promises.forEach((p, i) => {
        MyPromise.resolve(p as any).then(
          (v) => {
            res[i] = { status: 'fulfilled', value: v };
            done++;
            if (done === promises.length) resolve(res);
          },
          (e) => {
            res[i] = { status: 'rejected', reason: e };
            done++;
            if (done === promises.length) resolve(res);
          }
        );
      });
      if (promises.length === 0) resolve([]);
    });
  }
}

// ============================================================
// 3) 常见 Promise 面试题代码（timeout / retry / 并发控制 / promisify）
// ============================================================

export function withTimeout<T>(p: Promise<T>, ms: number, reason = new Error('Timeout')): Promise<T> {
  return new Promise<T>((resolve, reject) => {
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

export async function retry<T>(fn: () => Promise<T>, times: number, delayMs = 0): Promise<T> {
  let lastErr: any;
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

export async function limitConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const res: R[] = new Array(items.length);
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

export function promisify<TArgs extends any[], TResult>(
  fn: (...args: [...TArgs, (err: any, result?: TResult) => void]) => void
) {
  return (...args: TArgs) =>
    new Promise<TResult>((resolve, reject) => {
      fn(...args, (err, result) => (err ? reject(err) : resolve(result as TResult)));
    });
}

// ============================================================
// 4) 对象的 6 种创建方法 + 优缺点（面试口径）
// ============================================================

/**
 * 1) 对象字面量 {}：
 *   - 优：最常用、直观、性能好
 *   - 缺：大量重复结构时不便复用；原型共享需要额外处理
 */
export const obj1 = { a: 1 };

/**
 * 2) new Object()：
 *   - 优：语义明确
 *   - 缺：冗余，不如字面量简洁
 */
export const obj2 = new Object({ a: 1 });

/**
 * 3) Object.create(proto)：
 *   - 优：可精确指定原型（原型式继承）
 *   - 缺：属性定义不如字面量直观；需要注意原型链与 null 原型
 */
export const obj3 = Object.create({ inherited: true });

/**
 * 4) 构造函数 new Fn()：
 *   - 优：可复用初始化逻辑；配合 prototype 共享方法
 *   - 缺：需要维护 this/原型；容易忘 new；继承写法更复杂
 */
export function Foo(this: any, a: number) {
  this.a = a;
}
Foo.prototype.getA = function () {
  return this.a;
};
export const obj4 = new (Foo as any)(1);

/**
 * 5) class：
 *   - 优：语法糖更清晰；继承/方法定义更规范
 *   - 缺：本质还是原型；私有字段/装饰器等有额外成本
 */
export class Bar {
  constructor(public a: number) {}
  getA() {
    return this.a;
  }
}
export const obj5 = new Bar(1);

/**
 * 6) 工厂函数：
 *   - 优：不依赖 new；可封装私有变量（闭包）
 *   - 缺：方法不能天然走原型共享（每次创建新函数）除非手动共享
 */
export function createBaz(a: number) {
  return {
    a,
    getA() {
      return a;
    },
  };
}
export const obj6 = createBaz(1);

// ============================================================
// 5) 数组 API：是否影响原数组（面试速记）
// ============================================================

/**
 * 会改变原数组（mutate）：
 * - push/pop/shift/unshift
 * - splice
 * - sort/reverse
 * - fill/copyWithin
 *
 * 不改变原数组（return new）：
 * - concat/slice
 * - map/filter/reduce/reduceRight
 * - flat/flatMap
 * - toReversed/toSorted/toSpliced（ES2023，返回新数组）
 *
 * 其他：
 * - forEach 不返回新数组，但可能在回调里改原数组（副作用）
 */

export function arrayApiDemos() {
  const a = [3, 1, 2];
  a.sort(); // mutate
  a.reverse(); // mutate
  a.splice(1, 1); // mutate

  const b = [1, 2, 3].map((x) => x * 2); // new
  const c = [1, 2, 3].slice(1); // new
  const d = [1, 2].concat([3]); // new

  return { a, b, c, d };
}

// ============================================================
// 6) 常见数组排序方法（面试：思想 + JS 实现）
// ============================================================

export function bubbleSort(arr: number[]) {
  const a = arr.slice();
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
    }
  }
  return a;
}

export function selectionSort(arr: number[]) {
  const a = arr.slice();
  for (let i = 0; i < a.length; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) if (a[j] < a[min]) min = j;
    if (min !== i) [a[i], a[min]] = [a[min], a[i]];
  }
  return a;
}

export function insertionSort(arr: number[]) {
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

export function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr.slice();
  const a = arr.slice();
  const pivot = a[Math.floor(a.length / 2)];
  const left: number[] = [];
  const mid: number[] = [];
  const right: number[] = [];
  for (const x of a) {
    if (x < pivot) left.push(x);
    else if (x > pivot) right.push(x);
    else mid.push(x);
  }
  return [...quickSort(left), ...mid, ...quickSort(right)];
}

export function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr.slice();
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const res: number[] = [];
  let i = 0,
    j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) res.push(left[i++]);
    else res.push(right[j++]);
  }
  return res.concat(left.slice(i), right.slice(j));
}

// ============================================================
// 7) TS 体操常用模板（面试/刷题）
// ============================================================

// 7.1 基础工具
export type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
export type Expect<T extends true> = T;

// 7.2 Union 转 Intersection
export type UnionToIntersection<U> = (U extends any ? (x: U) => any : never) extends (x: infer I) => any ? I : never;

// 7.3 DeepReadonly
export type DeepReadonly<T> = T extends (...args: any[]) => any
  ? T
  : T extends readonly any[]
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

// 7.4 DeepPartial
export type DeepPartial<T> = T extends (...args: any[]) => any
  ? T
  : T extends readonly any[]
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

// 7.5 TupleToUnion
export type TupleToUnion<T extends readonly any[]> = T[number];

// 7.6 String -> Union of chars
export type StringToUnion<S extends string> = S extends `${infer F}${infer R}` ? F | StringToUnion<R> : never;

// 7.7 去掉 Promise 包裹
export type AwaitedLike<T> = T extends Promise<infer U> ? AwaitedLike<U> : T;

// 7.8 RequireAtLeastOne
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> &
    {
      [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
    }[Keys];

// 7.9 IsAny
export type IsAny<T> = 0 extends 1 & T ? true : false;

// 7.10 Flatten array type
export type Flatten<T extends readonly any[]> = T extends readonly [infer F, ...infer R]
  ? F extends readonly any[]
    ? [...Flatten<F>, ...Flatten<R>]
    : [F, ...Flatten<R>]
  : [];

// 小测试（不会产生 JS）
type _t1 = Expect<Equal<TupleToUnion<[1, 2, 3]>, 1 | 2 | 3>>;
type _t2 = Expect<Equal<StringToUnion<'abc'>, 'a' | 'b' | 'c'>>;
type _t3 = Expect<Equal<AwaitedLike<Promise<Promise<number>>>, number>>;

