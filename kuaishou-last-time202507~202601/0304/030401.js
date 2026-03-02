/**
 * 030401 面试题（20 道）- 专题：手写与场景综合
 * 日期：2026-03-04
 * 类型：手写 API、场景题、设计、编码实现
 */

// ==================== 1. 手写 apply / call ====================
// 题干：实现 myCall(ctx, ...args) 和 myApply(ctx, args)，效果与 Function.prototype.call/apply 一致。
// 输入：ctx, args
// 输出：函数执行结果
// 约束：考虑 ctx 为 null 时替代为 globalThis

// 实现：

Function.prototype.myCall = function (ctx, ...args) {
    const ctx = ctx || globalThis;
    ctx.fn = this;
    const result = ctx.fn(...args);
    delete ctx.fn;
    return result;
}

Function.prototype.myApply = function (ctx, args) {
    const ctx = ctx || globalThis;
    ctx.fn = this;
    const result = ctx.fn(...args);
    delete ctx.fn;
    return result;
}

// ==================== 2. 手写 Object.create ====================
// 题干：实现 myCreate(proto)，返回以 proto 为原型的空对象。
// 输入：proto: object | null
// 输出：object
// 约束：不直接用 Object.create

// 实现：

function myCreate(proto) {
    function F() {}
    F.prototype = proto;
    return new F();
}

// ==================== 3. 手写 JSON.stringify（简化版） ====================
// 题干：实现简化版 stringify，支持 null、number、string、boolean、数组、纯对象（无循环引用）。
// 输入：value: any
// 输出：string
// 约束：不处理 undefined、函数、Symbol、循环引用

// 实现：


// ==================== 4. 手写 LRU Cache ====================
// 题干：实现 LRU 缓存，get(key)、put(key, value)，容量满时淘汰最久未用。O(1) 读写。
// 输入：capacity: number
// 输出：{ get, put }
// 约束：Map 或 哈希表+双向链表

// 实现：


// ==================== 5. 手写 发布-订阅 与 观察者 区别 ====================
// 题干：简述发布-订阅与观察者模式的区别；实现一个简单的 EventBus（on/off/emit/once）。
// 输入：无
// 输出：文字区别 + EventBus 代码
// 约束：支持多事件

// 实现：


// ==================== 6. 场景：请求重试 ====================
// 题干：实现 requestWithRetry(fn, maxRetry)，请求失败时最多重试 maxRetry 次，每次间隔 1s 递增（1s、2s、3s）。
// 输入：fn: () => Promise<T>, maxRetry: number
// 输出：Promise<T>
// 约束：只有失败才重试

// 实现：


// ==================== 7. 场景：接口请求缓存 ====================
// 题干：相同参数的请求在同一时刻只发一次，后续拿到同一 Promise；请求完成后缓存结果，相同参数在 T 秒内直接返回缓存。
// 输入：requestFn: (params) => Promise<T>, ttl?: number
// 输出：包装后的请求函数
// 约束：并发同一 key 共用一个 Promise

// 实现：


// ==================== 8. 场景：排队执行 ====================
// 题干：实现 QueueRunner，add(task) 将异步 task 加入队列，同一时间只执行一个，按序执行。
// 输入：无
// 输出：{ add: (task) => Promise<any> }
// 约束：task 为 () => Promise<any>

// 实现：


// ==================== 9. 手写 数组去重 ====================
// 题干：实现数组去重，支持基本类型和对象（对象按引用去重）。至少两种：Set、reduce、Map。
// 输入：arr: any[]
// 输出：any[]
// 约束：对象用 Map 存引用

// 实现：


// ==================== 10. 手写 数组乱序 ====================
// 题干：实现 shuffle(arr)，等概率打乱数组。说明为什么 arr.sort(() => Math.random() - 0.5) 不均匀。
// 输入：arr: any[]
// 输出：any[]
// 约束：Fisher-Yates 洗牌

// 实现：


// ==================== 11. 手写 继承（ES5 与 ES6） ====================
// 题干：用 ES5 实现 Child 继承 Parent（组合继承或寄生组合）；用 ES6 class 写等价实现。
// 输入：无
// 输出：两段代码
// 约束：避免重复继承属性、原型链正确

// 实现：


// ==================== 12. 手写 带取消的 Promise ====================
// 题干：封装 createCancelablePromise(promise)，返回 { promise, cancel }，cancel 后 promise 永远 pending 或 reject。
// 输入：promise: Promise<any>
// 输出：{ promise, cancel }
// 约束：cancel 可提前调用

// 实现：


// ==================== 13. 手写 链式调用 ====================
// 题干：实现 Calculator，支持 new Calculator().add(1).add(2).multiply(3).result() 得到 9。
// 输入：无
// 输出：Calculator 类或对象
// 约束：链式返回 this

// 实现：


// ==================== 14. 手写 千分位格式化 ====================
// 题干：将数字格式化为千分位字符串，如 1234567.89 => "1,234,567.89"。
// 输入：num: number
// 输出：string
// 约束：正则或循环

// 实现：


// ==================== 15. 手写 驼峰与下划线互转 ====================
// 题干：camelToSnake('userName') => 'user_name'；snakeToCamel('user_name') => 'userName'。支持对象递归转换 key。
// 输入：str 或 obj
// 输出：string 或 object
// 约束：递归一层层转 key

// 实现：


// ==================== 16. 手写 获取嵌套属性 ====================
// 题干：实现 get(obj, path)，path 为 'a.b.c' 或 ['a','b','c']，取不到返回 undefined。
// 输入：obj: object, path: string | string[]
// 输出：any
// 约束：避免抛错

// 实现：


// ==================== 17. 手写 深比较 ====================
// 题干：实现 isEqual(a, b)，深度比较两个值是否相等。支持基本类型、数组、对象、Date、RegExp。
// 输入：a: any, b: any
// 输出：boolean
// 约束：处理循环引用（可选）

// 实现：


// ==================== 18. 场景：批量请求与错误处理 ====================
// 题干：给定多个请求 URL，并发请求，要求：全部成功返回结果数组；任意失败则整体失败，并返回第一个错误。不允许多个请求串行。
// 输入：urls: string[]
// 输出：Promise<results[]>
// 约束：Promise.all 或手写聚合

// 实现：


// ==================== 19. 手写 简易 依赖收集（响应式思路） ====================
// 题干：实现 reactive(obj)，返回代理对象；实现 effect(fn)，fn 内访问到的 reactive 属性变化时重新执行 fn。仅需支持一层属性。
// 输入：obj: object, fn: Function
// 输出：reactive 对象 + effect 注册
// 约束：Proxy get/set + Set 收集 effect

// 实现：


// ==================== 20. 手写 单例模式 ====================
// 题干：实现 getSingleton(Constructor)，使得多次调用 getSingleton(Foo) 返回同一实例。
// 输入：Constructor: new (...args) => T
// 输出：单例实例
// 约束：可传参，仅首次 new 时使用参数

// 实现：
