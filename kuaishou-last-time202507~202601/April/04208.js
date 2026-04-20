// 04208 - 工程化专题（含参考答案）

// 问题1：实现命令行参数解析 parseArgs
function solution_04208_1(argv) {
  return argv.reduce((acc, cur, i, arr) => {
    if (!cur.startsWith('--')) return acc;
    const key = cur.slice(2);
    const next = arr[i + 1];
    acc[key] = next && !next.startsWith('--') ? next : true;
    return acc;
  }, {});
}

// 问题2：实现深度克隆（支持 Date/RegExp）
function solution_04208_2(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);
  if (map.has(obj)) return map.get(obj);
  const res = Array.isArray(obj) ? [] : {};
  map.set(obj, res);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res[key] = solution_04208_2(obj[key], map);
  }
  return res;
}

// 问题3：实现文件路径规范化 normalizePath
function solution_04208_3(pathStr) {
  const isAbs = pathStr.startsWith('/');
  const stack = [];
  pathStr.split('/').forEach((seg) => {
    if (!seg || seg === '.') return;
    if (seg === '..') stack.pop();
    else stack.push(seg);
  });
  return `${isAbs ? '/' : ''}${stack.join('/')}`;
}

// 问题4：实现事件总线跨模块共享
const solution_04208_4 = (() => {
  const events = {};
  return {
    on(type, fn) {
      (events[type] ||= []).push(fn);
    },
    emit(type, ...args) {
      (events[type] || []).forEach((fn) => fn(...args));
    },
    off(type, fn) {
      events[type] = (events[type] || []).filter((f) => f !== fn);
    },
  };
})();

// 问题5：实现配置合并器 configMerge
function solution_04208_5(a, b) {
  const out = { ...a };
  for (const key of Object.keys(b)) {
    if (
      out[key] &&
      b[key] &&
      typeof out[key] === 'object' &&
      typeof b[key] === 'object' &&
      !Array.isArray(out[key]) &&
      !Array.isArray(b[key])
    ) {
      out[key] = solution_04208_5(out[key], b[key]);
    } else {
      out[key] = b[key];
    }
  }
  return out;
}

// 问题6：实现简单模板引擎 compileTemplate
function solution_04208_6(tpl) {
  return (data) => tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => data[key] ?? '');
}

// 问题7：实现任务队列 TaskRunner
class solution_04208_7 {
  constructor() {
    this.tasks = [];
  }
  add(task) {
    this.tasks.push(task);
    return this;
  }
  async run() {
    const res = [];
    for (const task of this.tasks) res.push(await task());
    return res;
  }
}

// 问题8：实现插件系统 PluginSystem
class solution_04208_8 {
  constructor(ctx = {}) {
    this.ctx = ctx;
    this.plugins = [];
  }
  use(plugin) {
    this.plugins.push(plugin);
    if (typeof plugin.apply === 'function') plugin.apply(this.ctx);
  }
}

// 问题9：实现中间件机制 middlewareCompose
function solution_04208_9(middlewares) {
  return (ctx) => {
    const dispatch = (i) => {
      if (i >= middlewares.length) return Promise.resolve();
      const fn = middlewares[i];
      return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
    };
    return dispatch(0);
  };
}

// 问题10：实现日志器 logger
function solution_04208_10(prefix = 'LOG') {
  return {
    info: (...args) => console.log(`[${prefix}] [INFO]`, ...args),
    warn: (...args) => console.warn(`[${prefix}] [WARN]`, ...args),
    error: (...args) => console.error(`[${prefix}] [ERROR]`, ...args),
  };
}

// 问题11：实现错误边界包装 safeRun
function solution_04208_11(fn, fallback = null) {
  return (...args) => {
    try {
      return fn(...args);
    } catch {
      return fallback;
    }
  };
}

// 问题12：实现性能统计 profiler
function solution_04208_12(fn) {
  return (...args) => {
    const start = performance.now();
    const res = fn(...args);
    if (res && typeof res.then === 'function') {
      return res.finally(() => console.log('cost(ms):', performance.now() - start));
    }
    console.log('cost(ms):', performance.now() - start);
    return res;
  };
}

// 问题13：实现缓存淘汰策略 TTLCache
class solution_04208_13 {
  constructor() {
    this.map = new Map();
  }
  set(key, value, ttlMs) {
    this.map.set(key, { value, expire: Date.now() + ttlMs });
  }
  get(key) {
    const item = this.map.get(key);
    if (!item) return undefined;
    if (Date.now() > item.expire) {
      this.map.delete(key);
      return undefined;
    }
    return item.value;
  }
}

// 问题14：实现请求去重 requestDedup
function solution_04208_14(fn) {
  const pending = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!pending.has(key)) {
      pending.set(
        key,
        Promise.resolve(fn(...args)).finally(() => {
          pending.delete(key);
        }),
      );
    }
    return pending.get(key);
  };
}

// 问题15：实现数据校验器 schemaValidate
function solution_04208_15(schema, data) {
  return Object.keys(schema).every((key) => {
    const rule = schema[key];
    if (typeof rule === 'string') return typeof data[key] === rule;
    if (typeof rule === 'function') return !!rule(data[key], data);
    return true;
  });
}

// 问题16：实现对象只读代理 readonlyProxy
function solution_04208_16(obj) {
  return new Proxy(obj, {
    set() {
      throw new Error('Readonly');
    },
    deleteProperty() {
      throw new Error('Readonly');
    },
  });
}

// 问题17：实现命名空间注册器 namespace
function solution_04208_17(root, path, value) {
  const keys = path.split('.');
  let cur = root;
  for (let i = 0; i < keys.length - 1; i += 1) {
    cur[keys[i]] = cur[keys[i]] || {};
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
  return root;
}

// 问题18：实现策略模式策略切换
function solution_04208_18(strategies, type, ...args) {
  if (!strategies[type]) throw new Error('Unknown strategy');
  return strategies[type](...args);
}

// 问题19：实现责任链模式 chainOfResponsibility
function solution_04208_19(handlers) {
  return (ctx) => {
    for (const h of handlers) {
      const res = h(ctx);
      if (res !== undefined) return res;
    }
    return undefined;
  };
}

// 问题20：实现工厂模式 createService
function solution_04208_20(type, map, ...args) {
  const Ctor = map[type];
  if (!Ctor) throw new Error('Unknown service type');
  return new Ctor(...args);
}
