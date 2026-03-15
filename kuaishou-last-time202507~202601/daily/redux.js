// 简单实现 Redux（JavaScript）

/**
 * 创建 store
 * @param {function} reducer - (state, action) => newState
 * @param {*} preloadedState - 初始 state，可选
 */
function createStore(reducer, preloadedState) {
  let state = preloadedState !== undefined ? preloadedState : reducer(undefined, { type: '@@redux/INIT' });
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
    return function unsubscribe() {
      const i = listeners.indexOf(listener);
      if (i >= 0) listeners.splice(i, 1);
    };
  }

  return { getState, dispatch, subscribe };
}

/**
 * 合并多个 reducer
 * @param {Object} reducers - { key: reducer }
 */
function combineReducers(reducers) {
  const keys = Object.keys(reducers);
  return function combinedReducer(state = {}, action) {
    const nextState = {};
    let hasChanged = false;
    for (const key of keys) {
      const prev = state[key];
      const next = reducers[key](prev, action);
      nextState[key] = next;
      if (next !== prev) hasChanged = true;
    }
    return hasChanged ? nextState : state;
  };
}

// ========== 使用示例 ==========
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

module.exports = { createStore, combineReducers };
