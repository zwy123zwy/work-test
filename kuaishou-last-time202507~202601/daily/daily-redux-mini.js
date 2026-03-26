/**
 * Redux 极简版：createStore + combineReducers
 */

function createStore(reducer, preloadedState) {
  let state = preloadedState;
  const listeners = [];

  function getState() {
    return state;
  }

  function subscribe(listener) {
    listeners.push(listener);
    return function unsubscribe() {
      const i = listeners.indexOf(listener);
      if (i !== -1) listeners.splice(i, 1);
    };
  }

  function dispatch(action) {
    state = reducer(state, action);
    listeners.slice().forEach((l) => l());
    return action;
  }

  dispatch({ type: '@@redux/INIT' });

  return { getState, dispatch, subscribe };
}

function combineReducers(reducers) {
  const keys = Object.keys(reducers);
  return function rootReducer(state, action) {
    const next = {};
    let changed = false;
    for (const k of keys) {
      const prevSlice = state ? state[k] : undefined;
      const nextSlice = reducers[k](prevSlice, action);
      next[k] = nextSlice;
      if (nextSlice !== prevSlice) changed = true;
    }
    return changed ? next : state;
  };
}

// ---------- 示例 ----------
const counter = (state = 0, action) => {
  if (action.type === 'inc') return state + 1;
  return state;
};

const store = createStore(counter);
store.subscribe(() => console.log('state:', store.getState()));
store.dispatch({ type: 'inc' });

module.exports = { createStore, combineReducers };
