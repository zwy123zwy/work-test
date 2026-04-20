// 04204 - 函数式专题（含参考答案）

// 问题1：实现 debounce（立即执行版）
function solution_04204_1(fn, wait) {
  let timer = null;
  return function (...args) {
    const callNow = !timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
    }, wait);
    if (callNow) fn.apply(this, args);
  };
}

// 问题2：实现 throttle（尾调用版）
function solution_04204_2(fn, wait) {
  let timer = null;
  let lastArgs = null;
  return function (...args) {
    if (!timer) {
      fn.apply(this, args);
      timer = setTimeout(() => {
        timer = null;
        if (lastArgs) {
          fn.apply(this, lastArgs);
          lastArgs = null;
        }
      }, wait);
    } else {
      lastArgs = args;
    }
  };
}

// 问题3：实现函数柯里化 curry
function solution_04204_3(fn, ...args) {
  return function (...rest) {
    const all = [...args, ...rest];
    return all.length >= fn.length ? fn(...all) : solution_04204_3(fn, ...all);
  };
}

// 问题4：实现反柯里化 uncurry
function solution_04204_4(fn) {
  return function (context, ...args) {
    return fn.apply(context, args);
  };
}

// 问题5：实现 compose
function solution_04204_5(...fns) {
  return (input) => fns.reduceRight((acc, fn) => fn(acc), input);
}

// 问题6：实现 pipe
function solution_04204_6(...fns) {
  return (input) => fns.reduce((acc, fn) => fn(acc), input);
}

// 问题7：实现 once
function solution_04204_7(fn) {
  let called = false;
  let value;
  return function (...args) {
    if (!called) {
      called = true;
      value = fn.apply(this, args);
    }
    return value;
  };
}

// 问题8：实现 before
function solution_04204_8(n, fn) {
  let count = 0;
  return function (...args) {
    if (count < n) {
      count += 1;
      return fn.apply(this, args);
    }
    return undefined;
  };
}

// 问题9：实现 after
function solution_04204_9(n, fn) {
  let count = 0;
  return function (...args) {
    count += 1;
    if (count >= n) return fn.apply(this, args);
    return undefined;
  };
}

// 问题10：实现 memoize
function solution_04204_10(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn.apply(this, args));
    return cache.get(key);
  };
}

// 问题11：实现 myCall
Function.prototype.solution_04204_11 = function (context, ...args) {
  const ctx = context == null ? globalThis : Object(context);
  const key = Symbol('fn');
  ctx[key] = this;
  const res = ctx[key](...args);
  delete ctx[key];
  return res;
};

// 问题12：实现 myApply
Function.prototype.solution_04204_12 = function (context, args = []) {
  const ctx = context == null ? globalThis : Object(context);
  const key = Symbol('fn');
  ctx[key] = this;
  const res = ctx[key](...args);
  delete ctx[key];
  return res;
};

// 问题13：实现 myBind
Function.prototype.solution_04204_13 = function (context, ...preset) {
  const fn = this;
  return function (...later) {
    return fn.apply(context, [...preset, ...later]);
  };
};

// 问题14：实现 myNew
function solution_04204_14(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype);
  const res = Ctor.apply(obj, args);
  return res && (typeof res === 'object' || typeof res === 'function') ? res : obj;
}

// 问题15：实现 myInstanceof
function solution_04204_15(left, right) {
  if (left == null || (typeof left !== 'object' && typeof left !== 'function')) return false;
  let proto = Object.getPrototypeOf(left);
  while (proto) {
    if (proto === right.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

// 问题16：实现占位符柯里化 curryWithPlaceholder
const _ = Symbol('placeholder');
function solution_04204_16(fn, ...args) {
  return function (...rest) {
    const merged = [];
    let i = 0;
    let j = 0;
    while (i < args.length) {
      if (args[i] === _ && j < rest.length) merged.push(rest[j++]);
      else merged.push(args[i]);
      i += 1;
    }
    while (j < rest.length) merged.push(rest[j++]);
    const validCount = merged.filter((x) => x !== _).length;
    if (validCount >= fn.length && !merged.slice(0, fn.length).includes(_)) {
      return fn(...merged);
    }
    return solution_04204_16(fn, ...merged);
  };
}

// 问题17：实现函数重载 overload
function solution_04204_17() {
  const map = new Map();
  const fn = function (...args) {
    const key = String(args.length);
    if (!map.has(key)) throw new Error('No overload matched');
    return map.get(key)(...args);
  };
  fn.add = (len, handler) => {
    map.set(String(len), handler);
    return fn;
  };
  return fn;
}

// 问题18：实现函数缓存器 cacheByArgs
function solution_04204_18(fn, resolver = JSON.stringify) {
  const cache = new Map();
  return (...args) => {
    const key = resolver(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
}

// 问题19：实现参数校验包装器 withValidator
function solution_04204_19(fn, validator) {
  return (...args) => {
    if (!validator(...args)) throw new Error('Invalid arguments');
    return fn(...args);
  };
}

// 问题20：实现耗时统计包装器 withTiming
function solution_04204_20(fn, onMeasure = console.log) {
  return (...args) => {
    const start = performance.now();
    const res = fn(...args);
    if (res && typeof res.then === 'function') {
      return res.finally(() => onMeasure(performance.now() - start));
    }
    onMeasure(performance.now() - start);
    return res;
  };
}
