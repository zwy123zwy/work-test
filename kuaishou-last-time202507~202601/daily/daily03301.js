// new
function myNew(constructor, ...args) {
    const obj = Object.create(constructor.prototype);
    const result = constructor.apply(obj, args);
    const isObject = result !== null && (typeof result === 'object' || typeof result === 'function');
    return isObject ? result : obj;
}


// object.create
function myObjectCreate(proto) {
    function F() { }
    F.prototype = proto;
    return new F();
}

// instanceof
function myInstanceOf(left, right) {
    if (left === null || (typeof left !== 'object' && typeof left !== 'function')) {
        return false;
    }
    let proto = Object.getPrototypeOf(left);
    while (proto) {
        if (proto === right.prototype) {
            return true;
        }
        proto = Object.getPrototypeOf(proto);
    }
    return false;
    // return proto === right.prototype;

}

// 浅拷贝
function shallowCopy(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    let newObj = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

// 深拷贝
function deepCopy(obj, hash = new WeakMap()) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    if (hash.has(obj)) {
        return hash.get(obj);
    }
    let newObj = Array.isArray(obj) ? [] : {};
    hash.set(obj, newObj);
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key], hash) : obj[key];
        }
    }
    return newObj;
}

// json深拷贝
function jsonDeepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// 缺点： 
// 1. 无法复制函数、undefined、Symbol等特殊类型
// 2. 无法处理循环引用的对象
// 3. 无法复制Date、RegExp等特殊对象

// 改变原数组的api 
// push pop shift unshift splice sort reverse fill copyWithin
// 不改变原数组的api
// concat slice map filter reduce forEach find findIndex some every includes indexOf lastIndexOf join toString toLocaleString

// api 
function myPush(arr, ...args) {
    for (let i = 0; i < args.length; i++) {
        arr[arr.length] = args[i];
    }
    return arr.length;
}

function myPop(arr) {
    if (arr.length === 0) return undefined;
    const last = arr[arr.length - 1];
    arr.length = arr.length - 1;
    return last;
}

function myShift(arr) {
    if (arr.length === 0) return undefined;
    const first = arr[0];
    for (let i = 0; i < arr.length - 1; i++) {
        arr[i] = arr[i + 1];
    }
    arr.length = arr.length - 1;
    return first;
}

function myUnshift(arr, ...args) {
    const len = args.length;
    for (let i = arr.length - 1; i >= 0; i--) {
        arr[i + len] = arr[i];
    }
    for (let i = 0; i < len; i++) {
        arr[i] = args[i];
    }
    return arr.length;
}

function mySplice(arr, start, deleteCount, ...items) {
    const len = arr.length;
    start = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
    const actualDeleteCount = deleteCount === undefined ? len - start : deleteCount;
    deleteCount = Math.min(Math.max(actualDeleteCount, 0), len - start);
    const deleted = [];
    for (let i = 0; i < deleteCount; i++) {
        deleted.push(arr[start + i]);
    }
    const itemsLen = items.length;
    if (itemsLen > deleteCount) {
        for (let i = len - 1; i >= start + deleteCount; i--) {
            arr[i + itemsLen - deleteCount] = arr[i];
        }
    } else if (itemsLen < deleteCount) {
        for (let i = start + deleteCount; i < len; i++) {
            arr[i + itemsLen - deleteCount] = arr[i];
        }
        arr.length = len + itemsLen - deleteCount;
    }
    for (let i = 0; i < itemsLen; i++) {
        arr[start + i] = items[i];
    }
    return deleted;
}

function mySort(arr, compareFn) {
    if (!compareFn) {
        compareFn = (a, b) => String(a) > String(b) ? 1 : String(a) < String(b) ? -1 : 0;
    }
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (compareFn(arr[j], arr[j + 1]) > 0) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

function myReverse(arr) {
    let left = 0;
    let right = arr.length - 1;
    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
    }
    return arr;
}

function myFill(arr, value, start = 0, end = arr.length) {
    start = start < 0 ? Math.max(arr.length + start, 0) : Math.min(start, arr.length);
    end = end < 0 ? Math.max(arr.length + end, 0) : Math.min(end, arr.length);
    for (let i = start; i < end; i++) {
        arr[i] = value;
    }
    return arr;
}

function myCopyWithin(arr, target, start, end = arr.length) {
    const len = arr.length;
    target = target < 0 ? Math.max(len + target, 0) : Math.min(target, len);
    start = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
    end = end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
    const count = Math.min(end - start, len - target);
    const copied = [];
    for (let i = 0; i < count; i++) {
        copied[i] = arr[start + i];
    }
    for (let i = 0; i < count; i++) {
        arr[target + i] = copied[i];
    }
    return arr;
}

// 不改变原数组的api
function myConcat(arr, ...args) {
    const result = [...arr];
    for (let arg of args) {
        if (Array.isArray(arg)) {
            result.push(...arg);
        } else {
            result.push(arg);
        }
    }
    return result;
}

function mySlice(arr, start = 0, end = arr.length) {
    const len = arr.length;
    start = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
    end = end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(arr[i]);
    }
    return result;
}

function myMap(arr, callback, thisArg) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        result.push(callback.call(thisArg, arr[i], i, arr));
    }
    return result;
}

function myFilter(arr, callback, thisArg) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (callback.call(thisArg, arr[i], i, arr)) {
            result.push(arr[i]);
        }
    }
    return result;
}

function myReduce(arr, callback, initialValue) {
    let accumulator = initialValue;
    let start = 0;
    if (accumulator === undefined) {
        if (arr.length === 0) throw new TypeError('Reduce of empty array with no initial value');
        accumulator = arr[0];
        start = 1;
    }
    for (let i = start; i < arr.length; i++) {
        accumulator = callback(accumulator, arr[i], i, arr);
    }
    return accumulator;
}

function myForEach(arr, callback, thisArg) {
    for (let i = 0; i < arr.length; i++) {
        callback.call(thisArg, arr[i], i, arr);
    }
}

function myFind(arr, callback, thisArg) {
    for (let i = 0; i < arr.length; i++) {
        if (callback.call(thisArg, arr[i], i, arr)) {
            return arr[i];
        }
    }
    return undefined;
}

function myFindIndex(arr, callback, thisArg) {
    for (let i = 0; i < arr.length; i++) {
        if (callback.call(thisArg, arr[i], i, arr)) {
            return i;
        }
    }
    return -1;
}

function mySome(arr, callback, thisArg) {
    for (let i = 0; i < arr.length; i++) {
        if (callback.call(thisArg, arr[i], i, arr)) {
            return true;
        }
    }
    return false;
}

function myEvery(arr, callback, thisArg) {
    for (let i = 0; i < arr.length; i++) {
        if (!callback.call(thisArg, arr[i], i, arr)) {
            return false;
        }
    }
    return true;
}

function myIncludes(arr, searchElement, fromIndex = 0) {
    fromIndex = fromIndex < 0 ? Math.max(arr.length + fromIndex, 0) : fromIndex;
    for (let i = fromIndex; i < arr.length; i++) {
        if (arr[i] === searchElement) {
            return true;
        }
    }
    return false;
}

function myIndexOf(arr, searchElement, fromIndex = 0) {
    fromIndex = fromIndex < 0 ? Math.max(arr.length + fromIndex, 0) : fromIndex;
    for (let i = fromIndex; i < arr.length; i++) {
        if (arr[i] === searchElement) {
            return i;
        }
    }
    return -1;
}

function myLastIndexOf(arr, searchElement, fromIndex = arr.length - 1) {
    fromIndex = fromIndex < 0 ? arr.length + fromIndex : fromIndex;
    for (let i = fromIndex; i >= 0; i--) {
        if (arr[i] === searchElement) {
            return i;
        }
    }
    return -1;
}

function myJoin(arr, separator = ',') {
    let result = '';
    for (let i = 0; i < arr.length; i++) {
        if (i > 0) result += separator;
        result += arr[i] === null || arr[i] === undefined ? '' : arr[i];
    }
    return result;
}

function myToString(arr) {
    return myJoin(arr, ',');
}

function myToLocaleString(arr, locales, options) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element === null || element === undefined) {
            result.push('');
        } else if (typeof element === 'number') {
            result.push(element.toLocaleString(locales, options));
        } else if (element instanceof Date) {
            result.push(element.toLocaleString(locales, options));
        } else {
            result.push(String(element));
        }
    }
    return result.join(',');
}


// Flat
function myFlat(arr, depth = 1) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (Array.isArray(element) && depth > 0) {
            result.push(...myFlat(element, depth - 1));
        } else {
            result.push(element);
        }
    }
    return result;
}


// bubble sort

function bubbleSort(arr) {
    const len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

// selection sort
function selectionSort(arr) {
    const len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < len; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex
            ], arr[i]
            ]
        }
    }
    return arr;
}

// insertion sort
function insertionSort(arr) {
    const len = arr.length;
    for (let i = 1; i < len; i++) {
        let j = i;
        while (j > 0 && arr[j] < arr[j - 1]) {
            [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
            j--;
        }
    }
    return arr;
}

// merge sort

function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    const result = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    while (i < left.length) {
        result.push(left[i]);
        i++;
    }
    while (j < right.length) {
        result.push(right[j]);
        j++;
    }
    return result;
}


// quick sort
function quickSort(arr) {
    if (arr.length <= 1) return arr;
    const pivot = arr[arr.length - 1];
    const left = [];
    const right = [];
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        }
        else {
            right.push(arr[i]);
        }
    }
    return [...quickSort(left), pivot, ...quickSort(right)];
}


// Promise
class MyPromise {
    constructor(executor) {
        this.status = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        const resolve = (value) => {
            if (value instanceof MyPromise) {
                return value.then(resolve, reject);
            }
            setTimeout(() => {
                if (this.status === 'pending') {
                    this.status = 'fulfilled';
                    this.value = value;
                    this.onResolvedCallbacks.forEach(fn => fn());
                }
            }, 0);
        }

        const reject = (reason) => {
            setTimeout(() => {
                if (this.status === 'pending') {
                    this.status = 'rejected';
                    this.reason = reason;
                    this.onRejectedCallbacks.forEach(fn => fn());
                }
            }, 0);

        }
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }
    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            const fulfilledHandler = typeof onFulfilled === 'function' ? onFulfilled : value => value;
            const rejectedHandler = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };
            const fulfilled = (value) => {
                try {
                    const result = fulfilledHandler(value);
                    return result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
                } catch (error) {
                    reject(error);
                }
            };

            const rejected = (reason) => {
                try {
                    const result = rejectedHandler(reason);
                    return result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
                } catch (error) {
                    reject(error);
                }
            };

            if (this.status === 'fulfilled') {
                fulfilled(this.value);
            } else if (this.status === 'rejected') {
                rejected(this.reason);
            } else {
                this.onResolvedCallbacks.push(fulfilled);
                this.onRejectedCallbacks.push(rejected);
            }
        });
    }
}
Promise.all = function (promises) {
    return new Promise((resolve, reject) => {
        let count = 0;
        let result = [];
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(res => {
                count++;
                result[i] = res;
                if (count === promises.length) {
                    resolve(result);
                }
            }, reject);
        }
    })
}

Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(resolve, reject);
        }
    })
}

Promise.allSettled = function (promises) {
    return new Promise((resolve) => {
        let count = 0;
        let result = [];
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then(res => {
                result[i] = { status: 'fulfilled', value: res };
            }, err => {
                result[i] = { status: 'rejected', reason: err };
            }).finally(() => {
                count++;
                if (count === promises.length) {
                    resolve(result);

                    return result;
                }
            });
        }
    })
}


// async/await
function asyncToGenerator(generatorFunc) {
    return function () {
        const gen = generatorFunc.apply(this, arguments);
        return new Promise((resolve, reject) => {
            function step(key, arg) {
                let result;
                try {
                    result = gen[key](arg);
                } catch (error) {
                    reject(error);
                }
                const { value, done } = result;
                if (done) {
                    resolve(value);
                } else {
                    Promise.resolve(value).then(val => step('next', val), err => step('throw', err));
                }
            }
            step('next');
        })
    }
}


// limit concurrency
class limitConcurrency {
    constructor(limit) {
        this.limit = limit;
        this.running = 0;
        this.queue = [];
        this.currentIndex = 0;
        this.results = [];
    }

    add(task) {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, resolve, reject, index: this.currentIndex++ });
            this.execute();
        });
    }

    execute() {
        if (this.running >= this.limit || this.queue.length === 0) {
            return;
        }
        const { task, resolve, reject, index } = this.queue.shift();
        this.running++;
        Promise.resolve(task()).then((result) => {
            this.results[index] = result;
            resolve(result);
            this.running--;
            this.execute();
        }).catch((error) => {
            this.results[index] = error;
            reject(error);
            this.running--;
            this.execute();
        }).finally(() => {
            if (this.running === 0 && this.queue.length > 0) {
                this.execute();
            }
        });

    }
}


// koa compose
function compose(middlewares) {
    return function (ctx, next) {
        let index = -1;
        return dispatch(0);
        function dispatch(i) {
            if (i <= index) {
                return Promise.reject(new Error('next() called multiple times'));
            }
            index = i;
            let fn = middlewares[i];
            if (i === middlewares.length) {
                fn = next;
            }
            if (!fn) {
                return Promise.resolve();

            }
            try {
                return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
            } catch (error) {
                return Promise.reject(error);
            }
        }
    }
}

// redux
function createStore(reducer, preloadedState) {
    let state = preloadedState;
    let listeners = [];

    function getState() {
        return state;
    }

    function dispatch(action) {
        state = reducer(state, action);
        listeners.forEach(listener => listener());
        return action;
    }

    function subscribe(listener) {
        listeners.push(listener);
        return function unsubscribe() {
            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
        }
    }
    
    dispatch({ type: '@@redux/INIT' });
    return { getState, dispatch, subscribe };
}

/*
常用 hooks 特性速记
1. useState: 保存组件内状态；支持函数式更新，适合依赖上一次 state 的场景。
2. useEffect: 处理副作用；依赖数组变化后重新执行，返回清理函数可在下次执行前/卸载时回收资源。
3. useRef: 保存可变值，不会触发重新渲染；常用于 DOM 引用或缓存最新值。
4. useMemo: 缓存计算结果；只在依赖变化时重新计算，避免重算昂贵逻辑。
5. useCallback: 缓存函数引用；常用于把稳定函数传给子组件。
6. useEvent: 返回“引用稳定但内部逻辑总是最新”的事件函数，适合解决闭包陈旧问题。
*/

// 下面实现一个极简版 hooks 运行时，便于理解 React hooks 的核心工作方式。
function createHookRuntime() {
    const hooks = [];
    let hookIndex = 0;
    let pendingEffects = [];

    function resetHookIndex() {
        hookIndex = 0;
    }

    function areHookInputsEqual(nextDeps, prevDeps) {
        if (!Array.isArray(nextDeps) || !Array.isArray(prevDeps)) {
            return false;
        }
        if (nextDeps.length !== prevDeps.length) {
            return false;
        }
        for (let i = 0; i < nextDeps.length; i++) {
            if (!Object.is(nextDeps[i], prevDeps[i])) {
                return false;
            }
        }
        return true;
    }

    function useRef(initialValue) {
        const currentIndex = hookIndex++;
        if (!hooks[currentIndex]) {
            hooks[currentIndex] = { current: initialValue };
        }
        return hooks[currentIndex];
    }

    // useState 的关键点是“按调用顺序”读取槽位，所以 hooks 不能写在条件分支里。
    function useState(initialValue) {
        const currentIndex = hookIndex++;
        if (!hooks[currentIndex]) {
            hooks[currentIndex] = typeof initialValue === 'function' ? initialValue() : initialValue;
        }
        const setState = (nextValue) => {
            const prevValue = hooks[currentIndex];
            hooks[currentIndex] = typeof nextValue === 'function' ? nextValue(prevValue) : nextValue;
            return hooks[currentIndex];
        };
        return [hooks[currentIndex], setState];
    }

    // useEffect 在“渲染之后”执行副作用；依赖没变时跳过，依赖变了先清理旧副作用再执行新副作用。
    function useEffect(effect, deps) {
        const currentIndex = hookIndex++;
        const previous = hooks[currentIndex];
        const hasChanged = !previous || !areHookInputsEqual(deps, previous.deps);
        if (hasChanged) {
            pendingEffects.push(() => {
                if (previous && typeof previous.cleanup === 'function') {
                    previous.cleanup();
                }
                const cleanup = effect();
                hooks[currentIndex] = {
                    deps,
                    cleanup: typeof cleanup === 'function' ? cleanup : undefined,
                };
            });
        }
    }

    // useEvent 的目标是让返回函数的引用稳定，但它调用的始终是最新 handler。
    function useEvent(handler) {
        const handlerRef = useRef(handler);
        handlerRef.current = handler;
        const stableCallbackRef = useRef();
        if (!stableCallbackRef.current) {
            stableCallbackRef.current = (...args) => handlerRef.current(...args);
        }
        return stableCallbackRef.current;
    }

    function flushEffects() {
        const effects = pendingEffects;
        pendingEffects = [];
        effects.forEach((run) => run());
    }

    function cleanupEffects() {
        for (let i = 0; i < hooks.length; i++) {
            const hook = hooks[i];
            if (hook && typeof hook.cleanup === 'function') {
                hook.cleanup();
                hook.cleanup = undefined;
            }
        }
    }

    return {
        resetHookIndex,
        useRef,
        useState,
        useEffect,
        useEvent,
        flushEffects,
        cleanupEffects,
    };
}

function renderWithHooks(runtime, component) {
    runtime.resetHookIndex();
    const output = component();
    runtime.flushEffects();
    return output;
}

async function runDaily03301Tests() {
    const assert = require('node:assert/strict');

    // 校验当前文件里的典型实现是否正确，避免只“看起来像对”。
    assert.equal(myInstanceOf([], Array), true);
    assert.equal(myInstanceOf(1, Number), false);
    assert.deepEqual((() => {
        const list = [1, 2, 3, 4];
        const deleted = mySplice(list, 2);
        return { list, deleted };
    })(), { list: [1, 2], deleted: [3, 4] });
    assert.deepEqual(myCopyWithin([1, 2, 3, 4], 1, 2), [1, 3, 4, 4]);
    assert.deepEqual(mergeSort([5, 2, 4, 1, 3]), [1, 2, 3, 4, 5]);
    assert.deepEqual(quickSort([5, 2, 4, 1, 3]), [1, 2, 3, 4, 5]);

    const runtime = createHookRuntime();
    let effectRuns = 0;
    let cleanupRuns = 0;

    function CounterComponent() {
        const [count, setCount] = runtime.useState(0);
        runtime.useEffect(() => {
            effectRuns++;
            return () => {
                cleanupRuns++;
            };
        }, [count]);

        return {
            count,
            increment: () => setCount((value) => value + 1),
        };
    }

    let counter = renderWithHooks(runtime, CounterComponent);
    assert.equal(counter.count, 0);
    assert.equal(effectRuns, 1);
    assert.equal(cleanupRuns, 0);

    counter.increment();
    counter = renderWithHooks(runtime, CounterComponent);
    assert.equal(counter.count, 1);
    assert.equal(effectRuns, 2);
    assert.equal(cleanupRuns, 1);

    const eventRuntime = createHookRuntime();
    let latestCount = 0;
    let firstStableHandler;

    function EventComponent() {
        const [count, setCount] = eventRuntime.useState(0);
        latestCount = count;
        const onClick = eventRuntime.useEvent(() => latestCount);
        return { count, setCount, onClick };
    }

    let eventView = renderWithHooks(eventRuntime, EventComponent);
    firstStableHandler = eventView.onClick;
    assert.equal(eventView.onClick(), 0);

    eventView.setCount(10);
    eventView = renderWithHooks(eventRuntime, EventComponent);
    assert.equal(eventView.onClick, firstStableHandler);
    assert.equal(eventView.onClick(), 10);

    const scheduler = new limitConcurrency(2);
    const concurrencyValues = await Promise.all([
        scheduler.add(() => Promise.resolve('a')),
        scheduler.add(() => Promise.resolve('b')),
    ]);
    assert.deepEqual(concurrencyValues, ['a', 'b']);

    runtime.cleanupEffects();
    eventRuntime.cleanupEffects();
    assert.equal(cleanupRuns, 2);

    console.log('daily03301 tests passed');
}

if (require.main === module) {
    runDaily03301Tests().catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
}




