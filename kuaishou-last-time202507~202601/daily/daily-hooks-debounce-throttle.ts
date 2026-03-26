/**
 * Hook 版防抖 / 节流（需项目已安装 react）
 *
 * - useDebouncedValue：输入值在连续变化 delay ms 后才更新（搜索联想、请求入参）
 * - useDebouncedCallback：返回防抖函数，卸载时清理定时器
 * - useThrottledCallback：节流（leading：周期内首次立即执行；可选 trailing）
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/** 值防抖：value 变化后 delay ms 无新变化才同步到返回值 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

/** 函数防抖：始终调用最新 fn；卸载时清除未执行的定时器 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current != null) clearTimeout(timerRef.current);
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current != null) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        fnRef.current(...args);
      }, delay);
    },
    [delay]
  );
}

export type ThrottleOptions = {
  /** 周期内第一次是否立即执行，默认 true */
  leading?: boolean;
  /** 周期结束后是否再补执行最后一次，默认 false */
  trailing?: boolean;
};

/**
 * 函数节流：在 wait ms 内最多执行一次（逻辑贴近 lodash throttle，用 ref 存状态）。
 * - leading：周期开始时是否立即执行
 * - trailing：周期末尾是否再执行最后一次入参
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number,
  options: ThrottleOptions = {}
): (...args: Parameters<T>) => void {
  const { leading = true, trailing = false } = options;
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousRef = useRef(0);
  const lastArgsRef = useRef<Parameters<T> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current != null) clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
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
