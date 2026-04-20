// 04207 - 前端场景专题（含参考答案）

// 问题1：实现 EventEmitter
class solution_04207_1 {
  constructor() {
    this.events = {};
  }
  on(type, fn) {
    (this.events[type] ||= []).push(fn);
  }
  emit(type, ...args) {
    (this.events[type] || []).forEach((fn) => fn(...args));
  }
  off(type, fn) {
    this.events[type] = (this.events[type] || []).filter((f) => f !== fn);
  }
}

// 问题2：实现发布订阅带 once
class solution_04207_2 extends solution_04207_1 {
  once(type, fn) {
    const wrap = (...args) => {
      this.off(type, wrap);
      fn(...args);
    };
    this.on(type, wrap);
  }
}

// 问题3：实现观察者模式
class solution_04207_3_Subject {
  constructor() {
    this.observers = [];
  }
  add(observer) {
    this.observers.push(observer);
  }
  notify(data) {
    this.observers.forEach((o) => o.update(data));
  }
}

// 问题4：实现虚拟 DOM 节点构造
function solution_04207_4(tag, props = {}, children = []) {
  return { tag, props, children };
}

// 问题5：实现虚拟 DOM diff（简化）
function solution_04207_5(oldNode, newNode) {
  if (!oldNode) return { type: 'CREATE', node: newNode };
  if (!newNode) return { type: 'REMOVE' };
  if (oldNode.tag !== newNode.tag) return { type: 'REPLACE', node: newNode };
  if (JSON.stringify(oldNode.props) !== JSON.stringify(newNode.props)) return { type: 'PROPS', props: newNode.props };
  return { type: 'UPDATE' };
}

// 问题6：实现 DOM 事件委托
function solution_04207_6(parent, selector, event, handler) {
  parent.addEventListener(event, (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) handler.call(target, e);
  });
}

// 问题7：实现图片懒加载
function solution_04207_7(selector = 'img[data-src]') {
  const imgs = document.querySelectorAll(selector);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      img.src = img.dataset.src;
      io.unobserve(img);
    });
  });
  imgs.forEach((img) => io.observe(img));
}

// 问题8：实现无限滚动检测
function solution_04207_8(callback, threshold = 100) {
  const onScroll = () => {
    const remain = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
    if (remain <= threshold) callback();
  };
  window.addEventListener('scroll', onScroll);
  return () => window.removeEventListener('scroll', onScroll);
}

// 问题9：实现拖拽排序逻辑
function solution_04207_9(arr, from, to) {
  const list = arr.slice();
  const [item] = list.splice(from, 1);
  list.splice(to, 0, item);
  return list;
}

// 问题10：实现复制文本到剪贴板
async function solution_04207_10(text) {
  if (navigator.clipboard) return navigator.clipboard.writeText(text);
  const input = document.createElement('textarea');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
}

// 问题11：实现本地存储封装 storage
const solution_04207_11 = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key, fallback = null) {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  },
  remove(key) {
    localStorage.removeItem(key);
  },
};

// 问题12：实现过期缓存 localCache
const solution_04207_12 = {
  set(key, value, ttlMs) {
    const data = { value, expireAt: Date.now() + ttlMs };
    localStorage.setItem(key, JSON.stringify(data));
  },
  get(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Date.now() > data.expireAt) {
      localStorage.removeItem(key);
      return null;
    }
    return data.value;
  },
};

// 问题13：实现 history 路由简版
class solution_04207_13 {
  constructor() {
    this.routes = {};
    window.addEventListener('popstate', () => this.resolve(location.pathname));
  }
  register(path, cb) {
    this.routes[path] = cb;
  }
  push(path) {
    history.pushState({}, '', path);
    this.resolve(path);
  }
  resolve(path) {
    if (this.routes[path]) this.routes[path]();
  }
}

// 问题14：实现 hash 路由简版
class solution_04207_14 {
  constructor() {
    this.routes = {};
    window.addEventListener('hashchange', () => this.resolve(location.hash.slice(1)));
  }
  register(path, cb) {
    this.routes[path] = cb;
  }
  resolve(path) {
    if (this.routes[path]) this.routes[path]();
  }
}

// 问题15：实现请求拦截器
function solution_04207_15(fetcher, interceptors = []) {
  return (config) => {
    const nextConfig = interceptors.reduce((cfg, fn) => fn(cfg), config);
    return fetcher(nextConfig);
  };
}

// 问题16：实现响应拦截器
function solution_04207_16(promise, interceptors = []) {
  return interceptors.reduce((p, fn) => p.then(fn), Promise.resolve(promise));
}

// 问题17：实现 fetch 封装
function solution_04207_17(url, options = {}) {
  return fetch(url, options).then(async (res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get('content-type') || '';
    return contentType.includes('application/json') ? res.json() : res.text();
  });
}

// 问题18：实现 websocket 重连
function solution_04207_18(url, { maxRetry = 5, interval = 1000 } = {}) {
  let retry = 0;
  let ws;
  const connect = () => {
    ws = new WebSocket(url);
    ws.onclose = () => {
      if (retry < maxRetry) {
        retry += 1;
        setTimeout(connect, interval * retry);
      }
    };
  };
  connect();
  return () => ws && ws.close();
}

// 问题19：实现前端埋点队列
class solution_04207_19 {
  constructor(sender, size = 5) {
    this.sender = sender;
    this.size = size;
    this.queue = [];
  }
  push(event) {
    this.queue.push(event);
    if (this.queue.length >= this.size) this.flush();
  }
  flush() {
    if (!this.queue.length) return;
    const batch = this.queue.splice(0, this.queue.length);
    this.sender(batch);
  }
}

// 问题20：实现简单状态管理 store
function solution_04207_20(initialState = {}) {
  let state = initialState;
  const listeners = new Set();
  return {
    getState: () => state,
    setState(partial) {
      state = typeof partial === 'function' ? partial(state) : { ...state, ...partial };
      listeners.forEach((fn) => fn(state));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
