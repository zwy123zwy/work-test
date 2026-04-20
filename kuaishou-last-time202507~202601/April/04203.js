// 04203 - 对象专题（含参考答案）

// 问题1：实现深拷贝（支持循环引用）
function solution_04203_1(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (map.has(obj)) return map.get(obj);
  const res = Array.isArray(obj) ? [] : {};
  map.set(obj, res);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      res[key] = solution_04203_1(obj[key], map);
    }
  }
  return res;
}

// 问题2：实现深比较 deepEqual
function solution_04203_2(a, b) {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false;
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => solution_04203_2(a[k], b[k]));
}

// 问题3：实现对象路径取值 get
function solution_04203_3(obj, path, defaultValue) {
  const keys = Array.isArray(path) ? path : path.split('.');
  const val = keys.reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
  return val === undefined ? defaultValue : val;
}

// 问题4：实现对象路径赋值 set
function solution_04203_4(obj, path, value) {
  const keys = Array.isArray(path) ? path : path.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const k = keys[i];
    if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {};
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
  return obj;
}

// 问题5：实现对象路径删除 unset
function solution_04203_5(obj, path) {
  const keys = Array.isArray(path) ? path : path.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i += 1) {
    if (cur == null) return false;
    cur = cur[keys[i]];
  }
  if (cur && Object.prototype.hasOwnProperty.call(cur, keys[keys.length - 1])) {
    delete cur[keys[keys.length - 1]];
    return true;
  }
  return false;
}

// 问题6：实现对象扁平化 flattenObject
function solution_04203_6(obj, prefix = '', res = {}) {
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      solution_04203_6(obj[key], path, res);
    } else {
      res[path] = obj[key];
    }
  }
  return res;
}

// 问题7：实现对象反扁平化 unflattenObject
function solution_04203_7(flatObj) {
  const res = {};
  for (const key in flatObj) {
    if (!Object.prototype.hasOwnProperty.call(flatObj, key)) continue;
    solution_04203_4(res, key, flatObj[key]);
  }
  return res;
}

// 问题8：实现键值翻转 invert
function solution_04203_8(obj) {
  return Object.entries(obj).reduce((acc, [k, v]) => {
    acc[v] = k;
    return acc;
  }, {});
}

// 问题9：实现 pick
function solution_04203_9(obj, keys) {
  return keys.reduce((acc, k) => {
    if (k in obj) acc[k] = obj[k];
    return acc;
  }, {});
}

// 问题10：实现 omit
function solution_04203_10(obj, keys) {
  const remove = new Set(keys);
  return Object.keys(obj).reduce((acc, k) => {
    if (!remove.has(k)) acc[k] = obj[k];
    return acc;
  }, {});
}

// 问题11：实现深合并 mergeDeep
function solution_04203_11(target, source) {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    const a = out[key];
    const b = source[key];
    if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
      out[key] = solution_04203_11(a, b);
    } else {
      out[key] = b;
    }
  }
  return out;
}

// 问题12：实现默认值填充 defaultsDeep
function solution_04203_12(obj, defaults) {
  const out = solution_04203_1(obj);
  for (const key in defaults) {
    if (!Object.prototype.hasOwnProperty.call(defaults, key)) continue;
    const val = defaults[key];
    if (out[key] === undefined) out[key] = val;
    else if (out[key] && val && typeof out[key] === 'object' && typeof val === 'object') {
      out[key] = solution_04203_12(out[key], val);
    }
  }
  return out;
}

// 问题13：实现对象冻结 deepFreeze
function solution_04203_13(obj) {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((key) => {
    const val = obj[key];
    if (val && typeof val === 'object' && !Object.isFrozen(val)) {
      solution_04203_13(val);
    }
  });
  return obj;
}

// 问题14：实现对象判空 isEmptyObject
function solution_04203_14(obj) {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

// 问题15：实现 classNames 拼接器
function solution_04203_15(...args) {
  return args
    .flatMap((arg) => {
      if (!arg) return [];
      if (typeof arg === 'string') return [arg];
      if (Array.isArray(arg)) return arg.filter(Boolean);
      if (typeof arg === 'object') return Object.keys(arg).filter((k) => arg[k]);
      return [];
    })
    .join(' ');
}

// 问题16：实现 URL 查询参数解析 parseQuery
function solution_04203_16(query) {
  const str = query.replace(/^\?/, '');
  if (!str) return {};
  return str.split('&').reduce((acc, pair) => {
    const [k, v = ''] = pair.split('=');
    acc[decodeURIComponent(k)] = decodeURIComponent(v);
    return acc;
  }, {});
}

// 问题17：实现 URL 查询参数序列化 stringifyQuery
function solution_04203_17(obj) {
  return Object.keys(obj)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
    .join('&');
}

// 问题18：实现 JSON 安全解析 safeJSONParse
function solution_04203_18(text, fallback = null) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

// 问题19：实现 mapValues
function solution_04203_19(obj, fn) {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = fn(obj[key], key);
    return acc;
  }, {});
}

// 问题20：实现 mapKeys
function solution_04203_20(obj, fn) {
  return Object.keys(obj).reduce((acc, key) => {
    acc[fn(obj[key], key)] = obj[key];
    return acc;
  }, {});
}
