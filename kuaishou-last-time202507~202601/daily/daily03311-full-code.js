/**
 * daily03311-full-code.js
 * 3311 题「implement」完整参考实现（可直接复制使用）
 */

// =========================
// 3311.x
// =========================

function debounce(fn, wait) {
  let t = null;
  return function debounced(...args) {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function throttle(fn, wait) {
  let last = 0;
  return function throttled(...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const arr = Array.from(iterable);
    if (arr.length === 0) return resolve([]);
    const ret = new Array(arr.length);
    let done = 0;
    arr.forEach((p, i) => {
      Promise.resolve(p).then(
        (v) => {
          ret[i] = v;
          done += 1;
          if (done === arr.length) resolve(ret);
        },
        (e) => reject(e)
      );
    });
  });
}

const compose = (...fns) => (x) => fns.reduceRight((v, fn) => fn(v), x);

function flat(arr, depth = 1) {
  if (depth <= 0) return arr.slice();
  return arr.reduce((acc, cur) => acc.concat(Array.isArray(cur) ? flat(cur, depth - 1) : cur), []);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function myNew(Ctor, ...args) {
  if (typeof Ctor !== 'function') throw new TypeError('Ctor must be function');
  const obj = Object.create(Ctor.prototype);
  const ret = Ctor.apply(obj, args);
  return ret && (typeof ret === 'object' || typeof ret === 'function') ? ret : obj;
}

module.exports = {
  debounce,
  throttle,
  promiseAll,
  compose,
  flat,
  sleep,
  myNew,
};
