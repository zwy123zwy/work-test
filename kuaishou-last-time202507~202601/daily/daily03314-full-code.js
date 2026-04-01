/**
 * daily03314-full-code.js
 * 3314 题「implement」浏览器 / 工程完整参考实现
 */

const { sleep } = require('./daily03311-full-code.js');

// =========================
// 3314.x 浏览器 / 工程
// =========================

class EventEmitter {
  constructor() {
    this.events = new Map();
  }
  on(type, fn) {
    if (!this.events.has(type)) this.events.set(type, new Set());
    this.events.get(type).add(fn);
    return this;
  }
  off(type, fn) {
    if (!this.events.has(type)) return this;
    this.events.get(type).delete(fn);
    return this;
  }
  once(type, fn) {
    const wrap = (...args) => {
      this.off(type, wrap);
      fn(...args);
    };
    this.on(type, wrap);
    return this;
  }
  emit(type, ...args) {
    if (!this.events.has(type)) return false;
    [...this.events.get(type)].forEach((fn) => fn(...args));
    return true;
  }
}

async function limitRequest(tasks, limit) {
  const ret = new Array(tasks.length);
  let idx = 0;
  const workers = new Array(Math.min(limit, tasks.length)).fill(0).map(async () => {
    while (idx < tasks.length) {
      const i = idx++;
      ret[i] = await tasks[i]();
    }
  });
  await Promise.all(workers);
  return ret;
}

function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a == null || b == null) return false;
  if (typeof a !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) {
    if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
    if (!deepEqual(a[k], b[k])) return false;
  }
  return true;
}

function parseQuery(url) {
  const query = url.includes('?') ? url.split('?')[1].split('#')[0] : url;
  const sp = new URLSearchParams(query);
  const out = {};
  for (const [k, v] of sp.entries()) {
    if (Object.prototype.hasOwnProperty.call(out, k)) {
      out[k] = Array.isArray(out[k]) ? [...out[k], v] : [out[k], v];
    } else out[k] = v;
  }
  return out;
}

function flattenObject(obj, prefix = '', out = {}) {
  if (obj == null || typeof obj !== 'object') {
    out[prefix] = obj;
    return out;
  }
  const entries = Array.isArray(obj) ? obj.map((v, i) => [String(i), v]) : Object.entries(obj);
  entries.forEach(([k, v]) => {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v != null && typeof v === 'object') flattenObject(v, path, out);
    else out[path] = v;
  });
  return out;
}

function appendQuery(url, params) {
  const [baseAndQuery, hash = ''] = url.split('#');
  const [base, query = ''] = baseAndQuery.split('?');
  const sp = new URLSearchParams(query);
  Object.keys(params).forEach((k) => {
    const v = params[k];
    if (Array.isArray(v)) {
      sp.delete(k);
      v.forEach((item) => sp.append(k, String(item)));
    } else {
      sp.set(k, String(v));
    }
  });
  const q = sp.toString();
  return `${base}${q ? `?${q}` : ''}${hash ? `#${hash}` : ''}`;
}

function once(fn) {
  let done = false;
  let ret;
  return function wrapped(...args) {
    if (done) return ret;
    done = true;
    ret = fn.apply(this, args);
    return ret;
  };
}

async function fetchWithRetry(url, n, options = {}) {
  let lastErr;
  for (let i = 0; i < n; i += 1) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (e) {
      lastErr = e;
      const backoff = Math.min(1000 * 2 ** i, 8000);
      await sleep(backoff);
    }
  }
  throw lastErr;
}

module.exports = {
  EventEmitter,
  limitRequest,
  deepEqual,
  parseQuery,
  flattenObject,
  appendQuery,
  once,
  fetchWithRetry,
};
