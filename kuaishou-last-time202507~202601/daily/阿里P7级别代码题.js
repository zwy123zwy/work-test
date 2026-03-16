/**
 * 阿里P7级别前端代码题
 * 包含10道实际业务场景题
 * 涵盖：性能优化、架构设计、异步编程、源码实现等
 */

// ============================================
// 题目1：实现一个高性能的虚拟列表组件
// ============================================

/**
 * 场景：需要渲染10万条数据，要求滚动流畅，内存占用小
 * 要求：
 * 1. 只渲染可视区域的元素
 * 2. 支持动态高度
 * 3. 滚动时无明显白屏
 * 4. 支持快速滚动定位
 */

class VirtualList {
  constructor(options) {
    this.container = options.container;
    this.itemCount = options.itemCount;
    this.itemHeight = options.itemHeight || 50;
    this.buffer = options.buffer || 5; // 缓冲区大小
    this.visibleCount = 0;
    this.startIndex = 0;
    this.endIndex = 0;
    
    this.init();
  }
  
  init() {
    // 创建容器和内容区域
    this.wrapper = document.createElement('div');
    this.wrapper.style.height = `${this.itemCount * this.itemHeight}px`;
    this.wrapper.style.position = 'relative';
    
    this.content = document.createElement('div');
    this.content.style.position = 'absolute';
    this.content.style.top = '0';
    this.content.style.width = '100%';
    
    this.wrapper.appendChild(this.content);
    this.container.appendChild(this.wrapper);
    
    // 计算可视区域能显示多少项
    this.visibleCount = Math.ceil(this.container.clientHeight / this.itemHeight) + this.buffer * 2;
    
    // 绑定滚动事件
    this.container.addEventListener('scroll', this.handleScroll.bind(this));
    
    // 初始渲染
    this.render();
  }
  
  handleScroll() {
    // TODO: 实现滚动处理
    // 1. 使用 requestAnimationFrame 优化滚动性能
    // 2. 计算当前滚动位置对应的起始索引
    // 3. 判断是否需要更新可视区域
    // 4. 考虑使用 Intersection Observer 优化
  }
  
  render() {
    // TODO: 实现渲染逻辑
    // 1. 计算起始和结束索引
    // 2. 渲染可视区域的元素
    // 3. 使用 DocumentFragment 批量插入
    // 4. 更新内容区域的位置
  }
  
  // 动态高度支持
  updateItemHeight(index, height) {
    // TODO: 实现动态高度更新
    // 1. 记录每个 item 的实际高度
    // 2. 重新计算位置映射表
    // 3. 更新总高度
  }
}

// 测试用例
// const list = new VirtualList({
//   container: document.getElementById('list'),
//   itemCount: 100000,
//   itemHeight: 50
// });


// ============================================
// 题目2：实现一个带缓存和取消功能的请求库
// ============================================

/**
 * 场景：在电商系统中，需要频繁请求商品详情，要求：
 * 1. 支持请求缓存，避免重复请求
 * 2. 支持取消正在进行的请求
 * 3. 支持请求重试
 * 4. 支持并发控制
 */

class RequestManager {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
    this.requestQueue = [];
    this.maxConcurrent = 6;
    this.currentConcurrent = 0;
  }
  
  // 核心请求方法
  async request(config) {
    const { url, method = 'GET', params, data, cache = true, retry = 0 } = config;
    const cacheKey = this.generateCacheKey(url, method, params, data);
    
    // 1. 检查缓存
    if (cache && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    // 2. 检查是否有相同的请求正在进行
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey).promise;
    }
    
    // 3. 创建请求任务
    const task = {
      config,
      cacheKey,
      retryCount: 0,
      maxRetry: retry,
      abortController: new AbortController(),
      promise: null
    };
    
    task.promise = this.executeRequest(task);
    this.pendingRequests.set(cacheKey, task);
    
    return task.promise;
  }
  
  async executeRequest(task) {
    // TODO: 实现请求执行逻辑
    // 1. 判断是否需要排队
    // 2. 使用 fetch 发起请求
    // 3. 处理响应和错误
    // 4. 实现重试机制
    // 5. 缓存结果
  }
  
  // 取消请求
  cancel(url, method = 'GET', params) {
    const cacheKey = this.generateCacheKey(url, method, params);
    const task = this.pendingRequests.get(cacheKey);
    
    if (task) {
      task.abortController.abort();
      this.pendingRequests.delete(cacheKey);
    }
  }
  
  // 取消所有请求
  cancelAll() {
    this.pendingRequests.forEach(task => {
      task.abortController.abort();
    });
    this.pendingRequests.clear();
  }
  
  generateCacheKey(url, method, params, data) {
    return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`;
  }
  
  // TODO: 实现并发控制
  processQueue() {
    // 1. 检查当前并发数
    // 2. 从队列中取出任务执行
    // 3. 控制最大并发数
  }
}

// 测试用例
// const requestManager = new RequestManager();
// requestManager.request({ url: '/api/products/123', cache: true, retry: 2 });


// ============================================
// 题目3：实现一个依赖收集的响应式系统
// ============================================

/**
 * 场景：实现一个类似 Vue 3 的响应式系统
 * 要求：
 * 1. 支持对象的响应式
 * 2. 支持数组的响应式
 * 3. 支持嵌套对象的响应式
 * 4. 支持依赖收集和触发
 */

class ReactiveSystem {
  constructor() {
    this.targetMap = new WeakMap();
    this.activeEffect = null;
    this.effectStack = [];
  }
  
  // 创建响应式对象
  reactive(target) {
    // TODO: 实现响应式代理
    // 1. 使用 Proxy 拦截对象操作
    // 2. 在 get 中收集依赖
    // 3. 在 set 中触发依赖
    // 4. 处理嵌套对象
    // 5. 处理数组方法
  }
  
  // 收集依赖
  track(target, key) {
    // TODO: 实现依赖收集
    // 1. 获取当前 activeEffect
    // 2. 建立依赖映射关系
    // 3. 使用 WeakMap 避免内存泄漏
  }
  
  // 触发依赖
  trigger(target, key) {
    // TODO: 实现依赖触发
    // 1. 获取该 key 对应的所有依赖
    // 2. 执行所有依赖函数
    // 3. 考虑异步执行优化
  }
  
  // 副作用函数
  effect(fn, options = {}) {
    // TODO: 实现副作用
    // 1. 包装函数，执行前入栈，执行后出栈
    // 2. 支持懒执行
    // 3. 支持调度器
    // 4. 支持停止追踪
  }
  
  // 计算属性
  computed(getter) {
    // TODO: 实现计算属性
    // 1. 懒执行，只在访问时计算
    // 2. 缓存结果，依赖不变就不重新计算
    // 3. 脏标记机制
  }
  
  // 监听属性
  watch(source, cb, options = {}) {
    // TODO: 实现监听
    // 1. 支持监听响应式对象
    // 2. 支持监听 getter 函数
    // 3. 支持立即执行
    // 4. 支持深度监听
  }
}

// 测试用例
// const system = new ReactiveSystem();
// const state = system.reactive({ count: 0, user: { name: 'John' } });
// system.effect(() => console.log(state.count));
// state.count++;


// ============================================
// 题目4：实现一个高性能的发布订阅系统
// ============================================

/**
 * 场景：电商系统中，需要在不同模块间通信
 * 要求：
 * 1. 支持一次性订阅
 * 2. 支持取消订阅
 * 3. 支持异步事件
 * 4. 支持错误处理
 * 5. 支持事件命名空间
 */

class EventEmitter {
  constructor() {
    this.events = new Map();
    this.maxListeners = 10;
  }
  
  // 订阅事件
  on(eventName, listener, options = {}) {
    // TODO: 实现订阅
    // 1. 创建事件数组（如果不存在）
    // 2. 添加监听器
    // 3. 检查监听器数量限制
    // 4. 支持上下文绑定
    // 5. 返回取消订阅函数
    
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    if (this.events.get(eventName).length > this.maxListeners) {
      console.warn(`Warning: More than ${this.maxListeners} listeners for event "${eventName}"`);
    }
    this.events.get(eventName).push({ listener, options });
    return () => {
      this.off(eventName, listener);
    }

  }
  
  // 一次性订阅
  once(eventName, listener) {
    // TODO: 实现一次性订阅
    // 1. 包装监听器
    // 2. 执行后自动取消订阅
    
    const wrapper = (...args) => {
      listener(...args);
      this.off(eventName, wrapper);
    }
    this.on(eventName, wrapper);
  }
  
  // 发布事件
  async emit(eventName, ...args) {
    const list = this.events.get(eventName);
    if (!list?.length) return;
    const tasks = list.map(({ listener, options }) => {
      try {
        const ret = listener.apply(options?.context, args);
        return Promise.resolve(ret);
      } catch (err) {
        console.error(`EventEmitter "${eventName}" listener error:`, err);
        return Promise.resolve();
      }
    });
    await Promise.all(tasks);
  }
  
  // 取消订阅
  off(eventName, listener) {
    const list = this.events.get(eventName);
    if (!list) return;
    const i = list.findIndex((item) => item.listener === listener);
    if (i >= 0) list.splice(i, 1);
    if (list.length === 0) this.events.delete(eventName);
  }
  
  // 清空所有事件
  removeAllListeners(eventName) {
    if (eventName !== undefined) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }
  }
  
  // 获取事件监听器数量
  listenerCount(eventName) {
    // TODO: 实现计数
    return this.events.get(eventName)?.length || 0;
  }
  
  // 命名空间支持
  // 例如：'order:create', 'order:cancel', 'payment:success'
  static createNameSpace(namespace) {
    const emitter = new EventEmitter();
    const prefix = namespace + ':';
    return {
      on: (eventName, listener, options) => emitter.on(prefix + eventName, listener, options),
      once: (eventName, listener) => emitter.once(prefix + eventName, listener),
      emit: (eventName, ...args) => emitter.emit(prefix + eventName, ...args),
      off: (eventName, listener) => emitter.off(prefix + eventName, listener),
      removeAllListeners: (eventName) => emitter.removeAllListeners(eventName !== undefined ? prefix + eventName : undefined),
      listenerCount: (eventName) => emitter.listenerCount(prefix + eventName),
    };
  }
}

// 测试用例
// const emitter = new EventEmitter();
// emitter.on('order:create', (order) => console.log('Order created:', order));
// emitter.emit('order:create', { id: 123, amount: 100 });


// ============================================
// 题目5：实现一个深拷贝函数
// ============================================

/**
 * 场景：需要拷贝复杂对象，包括循环引用
 * 要求：
 * 1. 支持基本类型
 * 2. 支持对象、数组
 * 3. 支持循环引用
 * 4. 支持 Date、RegExp、Map、Set 等特殊对象
 * 5. 支持函数拷贝
 */

function deepClone(source, hash = new WeakMap()) {
  // TODO: 实现深拷贝
  // 1. 处理 null 和基本类型
  // 2. 检查循环引用
  // 3. 处理 Date
  // 4. 处理 RegExp
  // 5. 处理 Map
  // 6. 处理 Set
  // 7. 处理 Array
  // 8. 处理 Object
  // 9. 处理 Function
  // 10. 递归拷贝
  
  // 提示：使用 Object.prototype.toString.call() 判断类型
  // 提示：使用 WeakMap 存储已拷贝的对象，避免循环引用
  // 提示：考虑 Symbol 作为 key 的情况
}

// 测试用例
// const obj = { a: 1, b: { c: 2 }, d: [1, 2, 3], e: new Date(), f: /test/g };
// obj.self = obj; // 循环引用
// const cloned = deepClone(obj);
// console.log(cloned !== obj); // true
// console.log(cloned.b !== obj.b); // true
// console.log(cloned.self === cloned); // true


// ============================================
// 题目6：实现一个模板引擎
// ============================================

/**
 * 场景：需要在前端渲染动态内容
 * 要求：
 * 1. 支持变量插值 {{ variable }}
 * 2. 支持条件渲染 {% if condition %} ... {% endif %}
 * 3. 支持循环 {% for item in list %} ... {% endfor %}
 * 4. 支持过滤器 {{ variable | filter }}
 * 5. 支持自定义函数
 */

class TemplateEngine {
  constructor() {
    this.filters = {
      upper: str => str.toUpperCase(),
      lower: str => str.toLowerCase(),
      capitalize: str => str.charAt(0).toUpperCase() + str.slice(1),
      reverse: str => str.split('').reverse().join('')
    };
  }
  
  // 编译模板
  compile(template) {
    // TODO: 实现模板编译
    // 1. 解析变量插值 {{ }}
    // 2. 解析条件语句 {% if %}
    // 3. 解析循环语句 {% for %}
    // 4. 处理过滤器
    // 5. 生成渲染函数
    // 6. 使用正则表达式或 AST
    
    // 提示：可以先将模板转换为 AST，再生成渲染函数
    // 提示：使用 new Function() 动态生成函数
  }
  
  // 渲染模板
  render(template, data) {
    // TODO: 实现渲染
    // 1. 编译模板
    // 2. 传入数据执行
    // 3. 返回渲染后的字符串
  }
  
  // 注册过滤器
  registerFilter(name, fn) {
    this.filters[name] = fn;
  }
  
  // 辅助方法：获取嵌套对象的值
  getValue(data, path) {
    // TODO: 实现路径查找
    // 例如：'user.name' => data.user.name
  }
}

// 测试用例
// const engine = new TemplateEngine();
// const template = `
//   <h1>{{ title | upper }}</h1>
//   {% if user.isLoggedIn %}
//     <p>Welcome, {{ user.name }}!</p>
//   {% endif %}
//   <ul>
//     {% for item in items %}
//       <li>{{ item.name }}</li>
//     {% endfor %}
//   </ul>
// `;
// const html = engine.render(template, {
//   title: 'My Page',
//   user: { isLoggedIn: true, name: 'John' },
//   items: [{ name: 'Item 1' }, { name: 'Item 2' }]
// });


// ============================================
// 题目7：实现一个异步任务队列
// ============================================

/**
 * 场景：需要批量处理任务，控制并发数
 * 要求：
 * 1. 支持任务添加
 * 2. 支持并发控制
 * 3. 支持任务优先级
 * 4. 支持任务重试
 * 5. 支持任务超时
 *
 * 【TODO 不合理或易歧义之处】
 * - add 的 TODO「尝试执行」与 start 的「填满并发槽」易冲突：约定为 add 只入队并返回 Promise，
 *   start() 才真正启动消费；add 后若已 start 则 _tryRun 会拉取新任务，这样两处语义一致。
 * - runTask 的 TODO「从队列中取出任务」意味着 runTask 不应接收参数，应由内部 shift 取任务，
 *   原题 add 里 runTask(taskWrapper) 传参是错误的。
 * - add 要求「返回 Promise」：需在队列项里保存 resolve/reject，在该任务完成或失败时 resolve/reject。
 * - clear：若只清 queue 不处理已入队项上的 Promise，调用方会永远 await 不到；应对未执行项 reject。
 */

class AsyncTaskQueue {
  constructor(options = {}) {
    this.concurrency = options.concurrency || 5;
    this.timeout = options.timeout || 5000;
    this.maxRetry = options.maxRetry || 3;
    this.queue = [];
    this.running = 0;
    this.results = [];
    this.errors = [];
    this.paused = false;
    this.started = false;
  }

  // 添加任务
  // task 应为返回 Promise 的函数，如 () => fetch(...) 或 async () => {...}
  add(task, priority = 0) {
    // 1. 包装任务函数（约定 task 为函数，执行后得到 Promise）
    // 2. 添加优先级
    // 3. 加入队列
    return new Promise((resolve, reject) => {
      this.queue.push({ task, priority, resolve, reject });
      this.queue.sort((a, b) => b.priority - a.priority);
      // 4. 尝试执行（若已 start 则立即参与调度）
      this._tryRun();
    });
    // 5. 返回 Promise（由上方 new Promise 满足）
  }

  _tryRun() {
    if (this.paused || !this.started) return;
    while (this.running < this.concurrency && this.queue.length > 0) {
      this.runTask();
    }
  }

  // 执行任务（从队列取一个并执行）
  async runTask() {
    // 1. 从队列中取出任务
    if (this.queue.length === 0) return;
    const item = this.queue.shift();
    this.running++;

    const runOnce = (retryCount = 0) => {
      // 2. 设置超时
      const timeoutPromise = new Promise((_, rej) =>
        setTimeout(() => rej(new Error('timeout')), this.timeout)
      );
      const taskPromise = typeof item.task === 'function'
        ? Promise.resolve(item.task())
        : Promise.resolve(item.task);

      return Promise.race([taskPromise, timeoutPromise])
        .then((result) => {
          // 5. 记录结果
          this.results.push(result);
          item.resolve(result);
        })
        .catch((err) => {
          // 4. 错误重试
          if (retryCount < this.maxRetry) {
            return runOnce(retryCount + 1);
          }
          this.errors.push(err);
          item.reject(err);
        })
        .finally(() => {
          this.running--;
          // 6. 尝试执行下一个任务
          this._tryRun();
        });
    };

    return runOnce();
  }

  // 启动队列
  start() {
    this.started = true;
    // 填满并发槽
    this._tryRun();
  }

  // 暂停队列（不接新任务，正在跑的可跑完）
  pause() {
    this.paused = true;
  }

  // 恢复队列
  resume() {
    this.paused = false;
    this._tryRun();
  }

  // 清空队列（仅清待执行；正在执行的不中断）
  clear() {
    this.queue.forEach((item) => item.reject(new Error('cleared')));
    this.queue.length = 0;
  }

  getStatus() {
    return {
      pending: this.queue.length,
      running: this.running,
      completed: this.results.length,
      failed: this.errors.length
    };
  }
}

// 测试用例
// const queue = new AsyncTaskQueue({ concurrency: 3, timeout: 2000 });
// for (let i = 0; i < 10; i++) {
//   queue.add(async () => {
//     await sleep(1000);
//     return i;
//   });
// }
// queue.start();


// ============================================
// 题目8：实现一个简单的状态管理库
// ============================================

/**
 * 场景：需要管理应用状态，支持跨组件共享
 * 要求：
 * 1. 支持状态存储
 * 2. 支持状态修改（同步/异步）
 * 3. 支持订阅状态变化
 * 4. 支持中间件
 * 5. 支持状态持久化
 */

class Store {
  constructor(options) {
    this.state = options.state || {};
    this.mutations = options.mutations || {};
    this.actions = options.actions || {};
    this.subscribers = [];
    this.middlewares = [];
  }
  
  // 获取状态
  getState() {
    return this.state;
  }
  
  // 同步修改状态
  commit(mutationName, payload) {
    // TODO: 实现同步修改
    // 1. 检查 mutation 是否存在
    // 2. 执行中间件
    // 3. 执行 mutation
    // 4. 通知订阅者
    // 5. 持久化状态（可选）
    
    const mutation = this.mutations[mutationName];
    if (!mutation) {
      throw new Error(`Mutation "${mutationName}" not found`);
    }
    
    // 执行中间件
    const context = { state: this.state, payload, mutation: mutationName };
    for (const middleware of this.middlewares) {
      middleware(context, () => {});
    }
    
    // 执行 mutation
    mutation(this.state, payload);
    
    // 通知订阅者
    this.subscribers.forEach(fn => fn(this.state, mutationName, payload));
  }
  
  // 异步修改状态
  async dispatch(actionName, payload) {
    // TODO: 实现异步修改
    // 1. 检查 action 是否存在
    // 2. 执行 action
    // 3. action 内部可以调用 commit
    // 4. 返回 Promise
    
    const action = this.actions[actionName];
    if (!action) {
      throw new Error(`Action "${actionName}" not found`);
    }
    
    const context = {
      state: this.state,
      commit: this.commit.bind(this),
      dispatch: this.dispatch.bind(this)
    };
    
    return await action(context, payload);
  }
  
  // 订阅状态变化
  subscribe(fn) {
    // TODO: 实现订阅
    // 1. 添加订阅者
    // 2. 返回取消订阅函数
    this.subscribers.push(fn);
    return () => {
      const index = this.subscribers.indexOf(fn);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }
  
  // 添加中间件
  use(middleware) {
    // TODO: 实现中间件
    this.middlewares.push(middleware);
  }
  
  // 状态持久化
  persist(key = 'store') {
    // TODO: 实现持久化
    // 1. 从 localStorage 读取初始状态
    // 2. 状态变化时保存到 localStorage
    
    // 读取初始状态
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        this.state = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse persisted state');
      }
    }
    
    // 保存状态
    this.subscribe((state) => {
      localStorage.setItem(key, JSON.stringify(state));
    });
  }
}

// 测试用例
// const store = new Store({
//   state: { count: 0, user: null },
//   mutations: {
//     increment(state) { state.count++; },
//     setUser(state, user) { state.user = user; }
//   },
//   actions: {
//     async login({ commit }, credentials) {
//       const user = await fetch('/api/login', credentials);
//       commit('setUser', user);
//     }
//   }
// });
// store.subscribe((state) => console.log('State changed:', state));
// store.commit('increment');
// store.dispatch('login', { username: 'john', password: '123456' });


// ============================================
// 题目9：实现一个性能监控SDK
// ============================================

/**
 * 场景：需要监控前端性能指标，上报到服务器
 * 要求：
 * 1. 采集页面加载性能
 * 2. 采集资源加载性能
 * 3. 采集用户交互性能
 * 4. 采集错误信息
 * 5. 支持自定义指标
 * 6. 批量上报
 */

class PerformanceMonitor {
  constructor(options = {}) {
    this.reportUrl = options.reportUrl;
    this.appId = options.appId;
    this.userId = options.userId;
    this.metrics = [];
    this.maxBatchSize = options.maxBatchSize || 10;
    this.batchTimer = null;
    this.batchInterval = options.batchInterval || 5000;
  }
  
  // 初始化
  init() {
    // TODO: 实现初始化
    // 1. 监听页面加载
    // 2. 监听资源加载
    // 3. 监听错误
    // 4. 监听用户交互
    // 5. 使用 Performance Observer API
    
    this.observePageLoad();
    this.observeResources();
    this.observeErrors();
    this.observeInteractions();
  }
  
  // 监听页面加载性能
  observePageLoad() {
    // TODO: 实现页面加载监控
    // 采集指标：
    // - DNS 查询时间
    // - TCP 连接时间
    // - 首字节时间 (TTFB)
    // - DOM 解析时间
    // - 页面完全加载时间
    // - 白屏时间
    // - 首次内容绘制 (FCP)
    // - 最大内容绘制 (LCP)
    
    window.addEventListener('load', () => {
      const timing = performance.timing;
      const metrics = {
        type: 'page_load',
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        ttfb: timing.responseStart - timing.requestStart,
        domParse: timing.domInteractive - timing.responseEnd,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
        url: location.href,
        timestamp: Date.now()
      };
      this.record(metrics);
    });
  }
  
  // 监听资源加载性能
  observeResources() {
    // TODO: 实现资源加载监控
    // 采集所有资源的加载时间
    // 按类型分组（script, css, img, xhr 等）
    // 识别慢资源
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'resource') {
          this.record({
            type: 'resource',
            name: entry.name,
            duration: entry.duration,
            size: entry.transferSize,
            initiatorType: entry.initiatorType,
            timestamp: Date.now()
          });
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
  
  // 监听错误
  observeErrors() {
    // TODO: 实现错误监控
    // 采集：
    // - JS 错误
    // - 资源加载错误
    // - Promise 未捕获错误
    // - 框架错误（React/Vue）
    
    window.addEventListener('error', (event) => {
      this.record({
        type: 'error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now()
      });
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      this.record({
        type: 'promise_error',
        message: event.reason,
        timestamp: Date.now()
      });
    });
  }
  
  // 监听用户交互
  observeInteractions() {
    // TODO: 实现交互监控
    // 采集：
    // - 首次输入延迟 (FID)
    // - 交互响应时间
    // - 用户行为路径
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'first-input') {
          this.record({
            type: 'first_input',
            fid: entry.processingStart - entry.startTime,
            eventType: entry.name,
            timestamp: Date.now()
          });
        }
      });
    });
    
    observer.observe({ entryTypes: ['first-input'] });
  }
  
  // 记录指标
  record(metric) {
    // TODO: 实现指标记录
    // 1. 添加通用信息（appId, userId, timestamp）
    // 2. 加入队列
    // 3. 检查是否需要上报
    this.metrics.push({
      ...metric,
      appId: this.appId,
      userId: this.userId
    });
    
    if (this.metrics.length >= this.maxBatchSize) {
      this.flush();
    } else {
      this.scheduleFlush();
    }
  }
  
  // 自定义指标
  customMetric(name, value, tags = {}) {
    // TODO: 实现自定义指标
    this.record({
      type: 'custom',
      name,
      value,
      tags,
      timestamp: Date.now()
    });
  }
  
  // 调度上报
  scheduleFlush() {
    // TODO: 实现调度上报
    if (!this.batchTimer) {
      this.batchTimer = setTimeout(() => {
        this.flush();
      }, this.batchInterval);
    }
  }
  
  // 立即上报
  async flush() {
    // TODO: 实现上报
    // 1. 取出所有指标
    // 2. 使用 sendBeacon 或 fetch 发送
    // 3. 处理失败重试
    
    if (this.metrics.length === 0) return;
    
    const data = [...this.metrics];
    this.metrics = [];
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(this.reportUrl, JSON.stringify(data));
      } else {
        await fetch(this.reportUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          keepalive: true
        });
      }
    } catch (error) {
      console.error('Failed to report metrics:', error);
      // 失败时重新加入队列
      this.metrics.unshift(...data);
    }
  }
}

// 测试用例
// const monitor = new PerformanceMonitor({
//   reportUrl: 'https://api.example.com/metrics',
//   appId: 'my-app',
//   userId: 'user-123'
// });
// monitor.init();
// monitor.customMetric('api_response_time', 120, { api: '/users' });


// ============================================
// 题目10：实现一个表单验证库
// ============================================

/**
 * 场景：需要验证复杂的表单，支持异步验证
 * 要求：
 * 1. 支持同步验证规则
 * 2. 支持异步验证规则
 * 3. 支持自定义验证规则
 * 4. 支持跨字段验证
 * 5. 支持错误消息国际化
 */

class FormValidator {
  constructor(rules = {}) {
    this.rules = rules;
    this.errors = {};
    this.customValidators = new Map();
    
    // 内置验证规则
    this.builtinValidators = {
      required: (value) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
        return value !== null && value !== undefined && value !== '';
      },
      
      email: (value) => {
        if (!value) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      
      phone: (value) => {
        if (!value) return true;
        return /^1[3-9]\d{9}$/.test(value);
      },
      
      minLength: (value, min) => {
        if (!value) return true;
        return value.length >= min;
      },
      
      maxLength: (value, max) => {
        if (!value) return true;
        return value.length <= max;
      },
      
      pattern: (value, regex) => {
        if (!value) return true;
        return regex.test(value);
      },
      
      number: (value) => {
        if (!value && value !== 0) return true;
        return !isNaN(Number(value));
      },
      
      min: (value, min) => {
        if (!value && value !== 0) return true;
        return Number(value) >= min;
      },
      
      max: (value, max) => {
        if (!value && value !== 0) return true;
        return Number(value) <= max;
      }
    };
  }
  
  // 验证单个字段
  async validateField(field, value, formData) {
    // TODO: 实现字段验证
    // 1. 获取字段规则
    // 2. 依次执行规则
    // 3. 支持异步验证
    // 4. 返回错误消息
    
    const fieldRules = this.rules[field];
    if (!fieldRules || fieldRules.length === 0) {
      return null;
    }
    
    for (const rule of fieldRules) {
      const { validator, message, ...params } = rule;
      
      let isValid = true;
      
      // 自定义验证器
      if (typeof validator === 'function') {
        isValid = await validator(value, formData);
      }
      // 内置验证器
      else if (typeof validator === 'string') {
        const validateFn = this.customValidators.get(validator) || this.builtinValidators[validator];
        if (!validateFn) {
          throw new Error(`Validator "${validator}" not found`);
        }
        isValid = await validateFn(value, params[validator], formData);
      }
      
      if (!isValid) {
        return message || `${field} validation failed`;
      }
    }
    
    return null;
  }
  
  // 验证整个表单
  async validate(formData) {
    // TODO: 实现表单验证
    // 1. 遍历所有字段
    // 2. 并行验证（优化性能）
    // 3. 收集所有错误
    // 4. 返回验证结果
    
    this.errors = {};
    const fields = Object.keys(this.rules);
    
    const results = await Promise.all(
      fields.map(async (field) => {
        const error = await this.validateField(field, formData[field], formData);
        return { field, error };
      })
    );
    
    let isValid = true;
    results.forEach(({ field, error }) => {
      if (error) {
        this.errors[field] = error;
        isValid = false;
      }
    });
    
    return {
      isValid,
      errors: this.errors
    };
  }
  
  // 添加自定义验证规则
  addValidator(name, validator) {
    // TODO: 实现自定义规则
    if (typeof validator !== 'function') {
      throw new Error('Validator must be a function');
    }
    this.customValidators.set(name, validator);
  }
  
  // 获取字段错误
  getError(field) {
    return this.errors[field] || null;
  }
  
  // 获取所有错误
  getErrors() {
    return this.errors;
  }
  
  // 清除错误
  clearErrors() {
    this.errors = {};
  }
  
  // 国际化支持
  setMessages(messages) {
    // TODO: 实现国际化
    // messages: { required: '此字段必填', email: '邮箱格式不正确' }
    this.messages = messages;
  }
}

// 测试用例
// const validator = new FormValidator({
//   username: [
//     { validator: 'required', message: '用户名不能为空' },
//     { validator: 'minLength', min: 3, message: '用户名至少3个字符' },
//     { validator: 'maxLength', max: 20, message: '用户名最多20个字符' }
//   ],
//   email: [
//     { validator: 'required', message: '邮箱不能为空' },
//     { validator: 'email', message: '邮箱格式不正确' }
//   ],
//   password: [
//     { validator: 'required', message: '密码不能为空' },
//     { validator: 'minLength', min: 6, message: '密码至少6个字符' },
//     {
//       validator: async (value, formData) => {
//         // 异步验证：检查密码强度
//         const response = await fetch('/api/check-password-strength', {
//           method: 'POST',
//           body: JSON.stringify({ password: value })
//         });
//         const result = await response.json();
//         return result.strength === 'strong';
//       },
//       message: '密码强度不足'
//     }
//   ],
//   confirmPassword: [
//     { validator: 'required', message: '请确认密码' },
//     {
//       validator: (value, formData) => value === formData.password,
//       message: '两次密码不一致'
//     }
//   ]
// });
//
// const formData = {
//   username: 'john',
//   email: 'john@example.com',
//   password: 'password123',
//   confirmPassword: 'password123'
// };
//
// const result = await validator.validate(formData);
// console.log(result);


// ============================================
// 附加题：实现一个简单的依赖注入容器
// ============================================

/**
 * 场景：需要在应用中管理依赖，实现解耦
 * 要求：
 * 1. 支持服务注册
 * 2. 支持依赖注入
 * 3. 支持单例模式
 * 4. 支持工厂模式
 * 5. 支持循环依赖检测
 */

class DIContainer {
  constructor() {
    this.services = new Map();
    this.instances = new Map();
    this.resolving = new Set(); // 用于检测循环依赖
  }
  
  // 注册服务
  register(name, factory, isSingleton = true) {
    // TODO: 实现服务注册
    // name: 服务名称
    // factory: 工厂函数，接收 container 参数
    // isSingleton: 是否单例
    this.services.set(name, { factory, isSingleton });
  }
  
  // 获取服务
  get(name) {
    // TODO: 实现服务获取
    // 1. 检查服务是否存在
    // 2. 检查是否是单例
    // 3. 如果正在解析，说明有循环依赖
    // 4. 执行工厂函数
    // 5. 缓存单例实例
    
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service "${name}" not found`);
    }
    
    // 单例模式：返回已存在的实例
    if (service.isSingleton && this.instances.has(name)) {
      return this.instances.get(name);
    }
    
    // 检测循环依赖
    if (this.resolving.has(name)) {
      throw new Error(`Circular dependency detected: ${name}`);
    }
    
    // 标记为正在解析
    this.resolving.add(name);
    
    try {
      // 执行工厂函数
      const instance = service.factory(this);
      
      // 缓存单例实例
      if (service.isSingleton) {
        this.instances.set(name, instance);
      }
      
      return instance;
    } finally {
      // 移除解析标记
      this.resolving.delete(name);
    }
  }
  
  // 批量获取服务
  getMultiple(names) {
    // TODO: 实现批量获取
    return names.map(name => this.get(name));
  }
  
  // 检查服务是否存在
  has(name) {
    return this.services.has(name);
  }
  
  // 移除服务
  remove(name) {
    this.services.delete(name);
    this.instances.delete(name);
  }
  
  // 清空容器
  clear() {
    this.services.clear();
    this.instances.clear();
    this.resolving.clear();
  }
}

// 测试用例
// const container = new DIContainer();
//
// // 注册服务
// container.register('config', () => ({
//   apiUrl: 'https://api.example.com',
//   timeout: 5000
// }));
//
// container.register('httpClient', (c) => {
//   const config = c.get('config');
//   return {
//     get: (url) => fetch(`${config.apiUrl}${url}`, { signal: AbortSignal.timeout(config.timeout) }),
//     post: (url, data) => fetch(`${config.apiUrl}${url}`, { method: 'POST', body: JSON.stringify(data) })
//   };
// });
//
// container.register('userService', (c) => {
//   const http = c.get('httpClient');
//   return {
//     getUser: (id) => http.get(`/users/${id}`),
//     createUser: (data) => http.post('/users', data)
//   };
// });
//
// // 获取服务
// const userService = container.get('userService');
// userService.getUser(123).then(console.log);


// ============================================
// 答案提示
// ============================================

/**
 * 解题思路：
 * 
 * 1. 虚拟列表：核心是只渲染可视区域，使用 transform 定位，缓冲区避免白屏
 * 2. 请求库：使用 Map 缓存，AbortController 取消，Promise 管理并发
 * 3. 响应式系统：Proxy + WeakMap + 副作用栈，核心是依赖收集和触发
 * 4. 发布订阅：Map 存储监听器，支持 once、异步、命名空间
 * 5. 深拷贝：WeakMap 解决循环引用，递归处理各种类型
 * 6. 模板引擎：正则解析或 AST，new Function 生成渲染函数
 * 7. 异步队列：Promise + 并发控制 + 优先级队列
 * 8. 状态管理：观察者模式 + 中间件 + 持久化
 * 9. 性能监控：Performance API + Observer + 批量上报
 * 10. 表单验证：规则引擎 + 异步验证 + 错误收集
 * 
 * 通用技巧：
 * - 使用 WeakMap 避免内存泄漏
 * - 使用 Proxy 实现代理模式
 * - 使用 Promise 管理异步流程
 * - 使用 Map/Set 管理数据结构
 * - 考虑边界情况和错误处理
 * - 考虑性能优化（节流、防抖、批量处理）
 * - 考虑可扩展性（插件、中间件）
 */


// ============================================
// 导出模块（如果需要）
// ============================================

// 如果在 Node.js 环境中
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    VirtualList,
    RequestManager,
    ReactiveSystem,
    EventEmitter,
    deepClone,
    TemplateEngine,
    AsyncTaskQueue,
    Store,
    PerformanceMonitor,
    FormValidator,
    DIContainer
  };
}
