// ========== 简易 Redux ==========

/**
 * 创建 Redux Store
 * @param {Function} reducer - 状态更新函数
 * @param {*} preloadedState - 初始状态
 * @returns {Object} store 对象
 */
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
        };
    }

    // 初始化 state
    dispatch({ type: '@@redux/INIT' });

    return { getState, dispatch, subscribe };
}

/**
 * 组合多个 reducer
 * @param {Object} reducers - reducer 对象映射
 * @returns {Function} 组合后的 reducer
 */
function combineReducers(reducers) {
    return function (state = {}, action) {
        const nextState = {};
        for (let key in reducers) {
            nextState[key] = reducers[key](state[key], action);
        }
        return nextState;
    };
}

/**
 * 应用中间件
 * @param {...Function} middlewares - 中间件函数
 * @returns {Function} enhancer
 */
function applyMiddleware(...middlewares) {
    return (createStore) => (reducer, preloadedState) => {
        const store = createStore(reducer, preloadedState);
        let dispatch = store.dispatch;

        const middlewareAPI = {
            getState: store.getState,
            dispatch: (action) => dispatch(action)
        };

        const chain = middlewares.map(middleware => middleware(middlewareAPI));
        dispatch = chain.reduceRight((acc, middleware) => middleware(acc), store.dispatch);

        return { ...store, dispatch };
    };
}


// ========== 简易 Hooks 实现 ==========

/**
 * 创建 Hooks 运行时环境
 */
function createHooksRuntime() {
    const hooks = [];
    let hookIndex = 0;
    let pendingEffects = [];
    let pendingLayoutEffects = [];

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

    // useState: 按调用顺序存储状态，不能写在条件分支里
    function useState(initialValue) {
        const currentIndex = hookIndex++;
        if (hooks[currentIndex] === undefined) {
            hooks[currentIndex] = typeof initialValue === 'function' ? initialValue() : initialValue;
        }
        const setState = (nextValue) => {
            hooks[currentIndex] = typeof nextValue === 'function'
                ? nextValue(hooks[currentIndex])
                : nextValue;
        };
        return [hooks[currentIndex], setState];
    }

    // useReducer: useState 的泛化版本，适合复杂状态逻辑
    function useReducer(reducer, initialArg, init) {
        const currentIndex = hookIndex++;
        if (hooks[currentIndex] === undefined) {
            hooks[currentIndex] = init ? init(initialArg) : initialArg;
        }
        const dispatch = (action) => {
            hooks[currentIndex] = reducer(hooks[currentIndex], action);
        };
        return [hooks[currentIndex], dispatch];
    }

    // useRef: 保存可变值，不触发重渲染；常用于 DOM 引用或缓存最新值
    function useRef(initialValue) {
        const currentIndex = hookIndex++;
        if (hooks[currentIndex] === undefined) {
            hooks[currentIndex] = { current: initialValue };
        }
        return hooks[currentIndex];
    }

    // useEffect: 渲染后异步执行副作用；依赖变化时先清理旧副作用再执行新副作用
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
        } else {
            hooks[currentIndex] = previous;
        }
    }

    // useLayoutEffect: 与 useEffect 相同，但在 DOM 更新后同步执行
    function useLayoutEffect(effect, deps) {
        const currentIndex = hookIndex++;
        const previous = hooks[currentIndex];
        const hasChanged = !previous || !areHookInputsEqual(deps, previous.deps);
        if (hasChanged) {
            pendingLayoutEffects.push(() => {
                if (previous && typeof previous.cleanup === 'function') {
                    previous.cleanup();
                }
                const cleanup = effect();
                hooks[currentIndex] = {
                    deps,
                    cleanup: typeof cleanup === 'function' ? cleanup : undefined,
                };
            });
        } else {
            hooks[currentIndex] = previous;
        }
    }

    // useMemo: 缓存计算结果，依赖不变时跳过重算
    function useMemo(factory, deps) {
        const currentIndex = hookIndex++;
        const previous = hooks[currentIndex];
        if (!previous || !areHookInputsEqual(deps, previous.deps)) {
            const value = factory();
            hooks[currentIndex] = { value, deps };
            return value;
        }
        return previous.value;
    }

    // useCallback: 缓存函数引用，本质是 useMemo 的语法糖
    function useCallback(fn, deps) {
        return useMemo(() => fn, deps);
    }

    // useContext: 读取 context 值（简化版）
    function useContext(context) {
        return context._currentValue;
    }

    // useEvent: 返回引用稳定但内部逻辑始终最新的事件函数
    function useEvent(handler) {
        const handlerRef = useRef(handler);
        handlerRef.current = handler;
        const stableRef = useRef();
        if (!stableRef.current) {
            stableRef.current = (...args) => handlerRef.current(...args);
        }
        return stableRef.current;
    }

    // useId: 生成稳定的唯一 ID
    function useId() {
        const currentIndex = hookIndex++;
        if (hooks[currentIndex] === undefined) {
            hooks[currentIndex] = `:r${currentIndex}:`;
        }
        return hooks[currentIndex];
    }

    // useImperativeHandle: 自定义暴露给父组件的 ref 值
    function useImperativeHandle(ref, init, deps) {
        const currentIndex = hookIndex++;
        const previous = hooks[currentIndex];
        if (!previous || !areHookInputsEqual(deps, previous.deps)) {
            const value = init();
            hooks[currentIndex] = { deps };
            if (ref) ref.current = value;
        }
    }

    function flushLayoutEffects() {
        const effects = pendingLayoutEffects.splice(0);
        effects.forEach(run => run());
    }

    function flushEffects() {
        const effects = pendingEffects.splice(0);
        effects.forEach(run => run());
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
        useState,
        useReducer,
        useRef,
        useEffect,
        useLayoutEffect,
        useMemo,
        useCallback,
        useContext,
        useEvent,
        useId,
        useImperativeHandle,
        flushLayoutEffects,
        flushEffects,
        cleanupEffects,
    };
}

function renderWithHooks(runtime, component) {
    runtime.resetHookIndex();
    const output = component();
    runtime.flushLayoutEffects();
    runtime.flushEffects();
    return output;
}


// ========== 常见 Hooks 使用模式速记 ==========
/*
1. useState      保存组件内状态；支持函数式更新 setState(prev => prev + 1)
2. useReducer    复杂状态逻辑；适合多个子值或下一状态依赖上一状态的场景
3. useRef        保存可变值不触发重渲染；DOM 引用；缓存最新回调
4. useEffect     处理副作用（请求、订阅、定时器）；返回清理函数
5. useLayoutEffect 与 useEffect 相同，但同步执行，适合读取/修改 DOM 布局
6. useMemo       缓存昂贵计算结果；依赖不变时跳过重算
7. useCallback   缓存函数引用；避免子组件因函数引用变化而重渲染
8. useContext    读取 Context 值；避免 props 层层传递
9. useEvent      引用稳定但内部逻辑始终最新；解决 useCallback 闭包陈旧问题
10. useId        生成稳定唯一 ID；用于无障碍属性关联
11. useImperativeHandle 配合 forwardRef 自定义暴露给父组件的 ref 实例
*/


// ========== 测试 ==========
async function runDailyTests() {
    const assert = require('node:assert/strict');

    // Redux: createStore
    const counterReducer = (state = 0, action) => {
        if (action.type === 'INC') return state + 1;
        if (action.type === 'DEC') return state - 1;
        return state;
    };
    const store = createStore(counterReducer);
    assert.equal(store.getState(), 0);
    store.dispatch({ type: 'INC' });
    store.dispatch({ type: 'INC' });
    assert.equal(store.getState(), 2);
    let notified = 0;
    const unsub = store.subscribe(() => notified++);
    store.dispatch({ type: 'DEC' });
    assert.equal(notified, 1);
    unsub();
    store.dispatch({ type: 'DEC' });
    assert.equal(notified, 1);

    // Redux: combineReducers
    const rootReducer = combineReducers({
        count: counterReducer,
        name: (state = 'didi', action) => action.type === 'SET_NAME' ? action.payload : state,
    });
    const store2 = createStore(rootReducer);
    store2.dispatch({ type: 'INC' });
    store2.dispatch({ type: 'SET_NAME', payload: 'DiDi' });
    assert.equal(store2.getState().count, 1);
    assert.equal(store2.getState().name, 'DiDi');

    // Hooks: useState
    const rt = createHooksRuntime();
    function Counter() {
        const [count, setCount] = rt.useState(0);
        return { count, inc: () => setCount(c => c + 1) };
    }
    let view = renderWithHooks(rt, Counter);
    assert.equal(view.count, 0);
    view.inc();
    view = renderWithHooks(rt, Counter);
    assert.equal(view.count, 1);

    // Hooks: useReducer
    const rt2 = createHooksRuntime();
    function reducer(state, action) {
        if (action.type === 'add') return { ...state, count: state.count + action.payload };
        return state;
    }
    function ReducerComp() {
        const [state, dispatch] = rt2.useReducer(reducer, { count: 0 });
        return { state, dispatch };
    }
    let rv = renderWithHooks(rt2, ReducerComp);
    rv.dispatch({ type: 'add', payload: 5 });
    rv = renderWithHooks(rt2, ReducerComp);
    assert.equal(rv.state.count, 5);

    // Hooks: useEffect cleanup
    const rt3 = createHooksRuntime();
    let effectRuns = 0, cleanupRuns = 0;
    function EffectComp() {
        const [val, setVal] = rt3.useState(0);
        rt3.useEffect(() => {
            effectRuns++;
            return () => { cleanupRuns++; };
        }, [val]);
        return { val, setVal };
    }
    let ev = renderWithHooks(rt3, EffectComp);
    assert.equal(effectRuns, 1);
    ev.setVal(1);
    ev = renderWithHooks(rt3, EffectComp);
    assert.equal(effectRuns, 2);
    assert.equal(cleanupRuns, 1);
    rt3.cleanupEffects();
    assert.equal(cleanupRuns, 2);

    // Hooks: useMemo
    const rt4 = createHooksRuntime();
    let computeCount = 0;
    function MemoComp() {
        const [a, setA] = rt4.useState(1);
        const [b] = rt4.useState(2);
        const sum = rt4.useMemo(() => { computeCount++; return a + b; }, [a, b]);
        return { sum, setA };
    }
    let mv = renderWithHooks(rt4, MemoComp);
    assert.equal(mv.sum, 3);
    assert.equal(computeCount, 1);
    mv = renderWithHooks(rt4, MemoComp);
    assert.equal(computeCount, 1);
    mv.setA(10);
    mv = renderWithHooks(rt4, MemoComp);
    assert.equal(mv.sum, 12);
    assert.equal(computeCount, 2);

    // Hooks: useEvent
    const rt5 = createHooksRuntime();
    let latestVal = 0;
    let stableHandler;
    function EventComp() {
        const [val, setVal] = rt5.useState(0);
        latestVal = val;
        const onClick = rt5.useEvent(() => latestVal);
        return { val, setVal, onClick };
    }
    let eview = renderWithHooks(rt5, EventComp);
    stableHandler = eview.onClick;
    assert.equal(eview.onClick(), 0);
    eview.setVal(99);
    eview = renderWithHooks(rt5, EventComp);
    assert.equal(eview.onClick, stableHandler);
    assert.equal(eview.onClick(), 99);

    console.log('daIly0331 tests passed');
}

if (require.main === module) {
    runDailyTests().catch(err => {
        console.error(err);
        process.exitCode = 1;
    });
}
