/**
 * Hook 版防抖 / 节流（需安装 react）
 *
 * - useDebouncedValue：值在连续变化 delay ms 后才更新
 * - useDebouncedCallback：返回防抖函数，卸载时清理定时器
 * - useThrottledCallback：节流，options: { leading, trailing }
 *
 * 用法：const { useDebouncedValue } = require('./daily-hooks-debounce-throttle');
 * 或：import { useDebouncedValue } from './daily-hooks-debounce-throttle.js';
 */

const { useCallback, useEffect, useRef, useState } = require('react');

function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

function useDebouncedCallback(fn, delay) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current != null) clearTimeout(timerRef.current);
    };
  }, []);

  return useCallback(
    (...args) => {
      if (timerRef.current != null) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        fnRef.current(...args);
      }, delay);
    },
    [delay]
  );
}

/**
 * @param {Function} fn
 * @param {number} wait
 * @param {{ leading?: boolean, trailing?: boolean }} [options]
 */
function useThrottledCallback(fn, wait, options = {}) {
  const { leading = true, trailing = false } = options;
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const timeoutRef = useRef(null);
  const previousRef = useRef(0);
  const lastArgsRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current != null) clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback(
    (...args) => {
      const now = Date.now();
      if (previousRef.current === 0 && !leading) previousRef.current = now;

      const remaining = wait - (now - previousRef.current);
      lastArgsRef.current = args;

      const invoke = () => {
        previousRef.current = Date.now();
        const a = lastArgsRef.current;
        if (a) fnRef.current(...a);
      };

      if (remaining <= 0 || remaining > wait) {
        if (timeoutRef.current != null) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        previousRef.current = now;
        invoke();
      } else if (!timeoutRef.current && trailing) {
        timeoutRef.current = setTimeout(() => {
          previousRef.current = leading ? 0 : Date.now();
          timeoutRef.current = null;
          const a = lastArgsRef.current;
          if (a) fnRef.current(...a);
        }, remaining);
      }
    },
    [wait, leading, trailing]
  );
}

module.exports = {
  useDebouncedValue,
  useDebouncedCallback,
  useThrottledCallback,
};
