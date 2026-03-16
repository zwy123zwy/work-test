"use strict";
// 简单实现 Redux（TypeScript）
Object.defineProperty(exports, "__esModule", { value: true });
exports.combineReducers = exports.createStore = void 0;
function createStore(reducer, preloadedState) {
    let state = preloadedState !== null && preloadedState !== void 0 ? preloadedState : reducer(undefined, { type: '' });
    const listeners = [];
    function getState() {
        return state;
    }
    function dispatch(action) {
        state = reducer(state, action);
        listeners.forEach((fn) => fn());
        return action;
    }
    function subscribe(listener) {
        listeners.push(listener);
        return () => {
            const i = listeners.indexOf(listener);
            if (i >= 0)
                listeners.splice(i, 1);
        };
    }
    return { getState, dispatch, subscribe };
}
exports.createStore = createStore;
// 合并多个 reducer
function combineReducers(reducers) {
    return (state, action) => {
        const next = {};
        let changed = false;
        for (const key of Object.keys(reducers)) {
            const prev = state === null || state === void 0 ? void 0 : state[key];
            const nextVal = reducers[key](prev, action);
            next[key] = nextVal;
            if (nextVal !== prev)
                changed = true;
        }
        return changed ? next : (state !== null && state !== void 0 ? state : next);
    };
}
exports.combineReducers = combineReducers;
function counterReducer(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}
const store = createStore(counterReducer);
store.subscribe(() => console.log('state:', store.getState()));
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' });
