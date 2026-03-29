/**
 * daily0327.js
 * 考察：React Redux 简易实现、常见 Hooks 写法、this / 闭包（示例见文末）
 * - Redux 部分可在 Node 直接 require 运行
 * - Hooks 需项目安装 react 后取消注释或复制到组件内
 */

// ============================================================
// 一、Redux 简易实现（可独立运行）
// ============================================================

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

// ============================================================
// 二、常见 Hooks 实现模板（需：import { useRef, useCallback, useState, useEffect } from 'react'）
// ============================================================

/**
 * useEvent：稳定函数引用 + 始终执行最新 fn（与 daily0326.js 同思路）
 */
function useEvent(fn) {
  const { useRef, useCallback } = require('react');
  const fnRef = useRef(fn);
  fnRef.current = fn;
  return useCallback((...args) => fnRef.current(...args), []);
}

/**
 * useLatest：ref 同步最新 value，避免子订阅/定时器闭包陈旧
 */
function useLatest(value) {
  const { useRef, useEffect } = require('react');
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

function useForceUpdate() {
  const { useState, useCallback } = require('react');
  const [, set] = useState(0);
  return useCallback(() => set((n) => n + 1), []);
}

function usePrevious(value) {
  const { useRef, useEffect } = require('react');
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

// ============================================================
// 三、this / 闭包 —— 与 daily0328 题目对照
// ============================================================

const demoObj = {
  name: 'didi',
  getName() {
    return function () {
      console.log(this.name);
    };
  },
  getNameArrow() {
    return () => {
      console.log(this.name);
    };
  },
};

// const func = demoObj.getName(); func();       // 独立调用：this 非 demoObj → undefined
// const func2 = demoObj.getNameArrow(); func2(); // 箭头词法 this → demoObj → 'didi'

const mainExports = {
  createStore,
  combineReducers,
  demoObj,
};

// 有 react 时再导出 hooks（避免无 react 时 require 报错）
let hooksExports = {};
try {
  require.resolve('react');
  hooksExports = {
    useEvent,
    useLatest,
    useForceUpdate,
    usePrevious,
  };
} catch (e) {
  hooksExports = {
    useEvent: null,
    useLatest: null,
    useForceUpdate: null,
    usePrevious: null,
    _note: '安装 react 后可使用 useEvent / useLatest 等',
  };
}

module.exports = { ...mainExports, ...hooksExports };
