/**
 * daily03312-full-code.js
 * 3312 题「implement」完整参考实现（React Hooks / Redux，需 React 环境）
 */

// =========================
// 3312.x (React Hooks / Redux)
// =========================

// 需 React 环境
// import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

function usePreviousFactory(React) {
  const { useEffect, useRef } = React;
  return function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };
}

function useDebouncedValueFactory(React) {
  const { useEffect, useState } = React;
  return function useDebouncedValue(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
      const id = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
  };
}

function createStore(reducer, preloadedState) {
  let state = preloadedState;
  let listeners = [];
  function getState() {
    return state;
  }
  function subscribe(listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
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
  return (state = {}, action) => {
    const next = {};
    let changed = false;
    for (const k of keys) {
      const prevSlice = state[k];
      const nextSlice = reducers[k](prevSlice, action);
      next[k] = nextSlice;
      if (nextSlice !== prevSlice) changed = true;
    }
    return changed ? next : state;
  };
}

function useEventFactory(React) {
  const { useCallback, useRef } = React;
  return function useEvent(fn) {
    const ref = useRef(fn);
    ref.current = fn;
    return useCallback((...args) => ref.current(...args), []);
  };
}

function useLocalStorageFactory(React) {
  const { useEffect, useState } = React;
  return function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
      try {
        const raw = localStorage.getItem(key);
        return raw == null ? initialValue : JSON.parse(raw);
      } catch {
        return initialValue;
      }
    });

    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
  };
}

function useMountFactory(React) {
  const { useEffect } = React;
  return function useMount(fn) {
    useEffect(() => fn(), []);
  };
}

function useWhyDidYouUpdateFactory(React) {
  const { useEffect, useRef } = React;
  return function useWhyDidYouUpdate(name, props) {
    const prev = useRef(props);
    useEffect(() => {
      const keys = Object.keys({ ...prev.current, ...props });
      const changed = {};
      keys.forEach((k) => {
        if (prev.current[k] !== props[k]) {
          changed[k] = { from: prev.current[k], to: props[k] };
        }
      });
      if (Object.keys(changed).length > 0) {
        // eslint-disable-next-line no-console
        console.log('[why-did-you-update]', name, changed);
      }
      prev.current = props;
    });
  };
}

function useThrottleFnFactory(React) {
  const { useCallback, useEffect, useRef } = React;
  return function useThrottleFn(fn, wait) {
    const fnRef = useRef(fn);
    fnRef.current = fn;
    const lastRef = useRef(0);
    const timerRef = useRef(null);

    useEffect(() => () => timerRef.current && clearTimeout(timerRef.current), []);

    return useCallback((...args) => {
      const now = Date.now();
      const remain = wait - (now - lastRef.current);
      if (remain <= 0) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        lastRef.current = now;
        fnRef.current(...args);
      } else if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          lastRef.current = Date.now();
          fnRef.current(...args);
        }, remain);
      }
    }, [wait]);
  };
}

module.exports = {
  usePreviousFactory,
  useDebouncedValueFactory,
  createStore,
  combineReducers,
  useEventFactory,
  useLocalStorageFactory,
  useMountFactory,
  useWhyDidYouUpdateFactory,
  useThrottleFnFactory,
};
