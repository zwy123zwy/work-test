/**
 * 030101 面试题（20 道）- 专题：JS/TS 基础与场景
 * 日期：2026-03-01
 * 类型：闭包、事件循环、类型、异步、原型、ES 语法等
 */

// ==================== 1. 闭包与变量捕获 ====================
// 题干：写出下面循环输出，并解释原因。如何改为每秒输出 0,1,2？
// for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 1000); }
// 输入：无
// 输出：说明输出结果 + 修正代码
// 约束：至少两种正确写法（let / IIFE / 传参）

// 实现：


// ==================== 2. 事件循环顺序 ====================
// 题干：说出 console 输出顺序。setTimeout(fn,0)、Promise.then、async/await、sync 代码。
// 输入：一段含上述的代码
// 输出：输出顺序说明
// 约束：区分宏任务、微任务、调用栈

// 实现：


// ==================== 3. this 绑定 ====================
// 题干：obj.fn()、fn()、new fn()、fn.call(ctx)、箭头函数中 this 分别指向什么？手写 bind。
// 输入：无
// 输出：简要说明 + myBind 实现
// 约束：不直接用 Function.prototype.bind

// 实现：


// ==================== 4. 深拷贝 ====================
// 题干：实现深拷贝，支持对象、数组、Date、RegExp、Map、Set，处理循环引用。
// 输入：source: any
// 输出：any
// 约束：循环引用用 WeakMap 记录

// 实现：


// ==================== 5. 防抖与节流 ====================
// 题干：实现 debounce(fn, delay) 和 throttle(fn, delay)，说明区别与使用场景。
// 输入：fn: Function, delay: number
// 输出：包装后的函数
// 约束：防抖支持 leading/trailing 可选

// 实现：


// ==================== 6. 手写 Promise ====================
// 题干：实现 MyPromise，支持 then、catch、resolve、reject、状态不可逆。
// 输入：executor(resolve, reject)
// 输出：MyPromise 实例
// 约束：支持链式 then、微任务用 queueMicrotask 或 setTimeout

// 实现：


// ==================== 7. Promise.all / Promise.race ====================
// 题干：手写 Promise.all（全部成功才成功）和 Promise.race（先完成即返回）。
// 输入：iterable: Promise[]
// 输出：Promise
// 约束：all 保持顺序，一个失败即失败

// 实现：


// ==================== 8. 并发限制 ====================
// 题干：实现 limitRequest(urls, limit)，限制同时请求数为 limit，按顺序返回结果。
// 输入：urls: string[], limit: number
// 输出：Promise<any[]>
// 约束：使用 Promise 控制并发

// 实现：


// ==================== 9. 类型判断 ====================
// 题干：实现 myTypeOf(x)，区分 null、数组、普通对象、Date、RegExp 等。
// 输入：x: any
// 输出：string
// 约束：不使用 Object.prototype.toString 时如何区分 array/object

// 实现：


// ==================== 10. 数组扁平化 ====================
// 题干：实现 flat(arr, depth)，depth 为 Infinity 时完全扁平。
// 输入：arr: any[], depth?: number
// 输出：any[]
// 约束：递归或迭代

// 实现：


// ==================== 11. 发布订阅 EventEmitter ====================
// 题干：实现 on、off、emit、once。
// 输入：事件名、回调
// 输出：按调用
// 约束：同一事件多个回调

// 实现：


// ==================== 12. 柯里化 ====================
// 题干：实现 curry(fn)，支持 sum(1)(2)(3) 与 sum(1,2)(3)。
// 输入：fn: Function
// 输出：柯里化后的函数
// 约束：参数够了才执行

// 实现：


// ==================== 13. 组合函数 compose ====================
// 题干：实现 compose(f, g, h)(x) => f(g(h(x)))。
// 输入：...fns: Function[]
// 输出：Function
// 约束：支持多函数

// 实现：


// ==================== 14. 实现 instanceof ====================
// 题干：手写 myInstanceof(obj, Constructor)，判断原型链上是否有 Constructor.prototype。
// 输入：obj: any, Constructor: Function
// 输出：boolean
// 约束：考虑 null、基本类型

// 实现：


// ==================== 15. 实现 new ====================
// 题干：手写 myNew(Constructor, ...args)，返回实例并绑定原型。
// 输入：Constructor, ...args
// 输出：object
// 约束：若 Constructor 返回对象则用该对象

// 实现：

function myNew(Constructor,...args) {
    const obj = Object.create(Constructor.prototype);
    const result = Constructor.apply(obj, args);
    return typeof result === 'object' && result !== null ? result : obj;
}

// ==================== 16. 对象扁平化与反扁平化 ====================
// 题干：{ a: 1, b: { c: 2, d: { e: 3 } } } => { a: 1, 'b.c': 2, 'b.d.e': 3 }，及反向。
// 输入：obj: object
// 输出：object
// 约束：递归处理嵌套

// 实现：


// ==================== 17. 大数相加 ====================
// 题干：两个大数字符串相加，返回和字符串。
// 输入：a: string, b: string
// 输出：string
// 约束：不转 Number，按位相加

// 实现：


// ==================== 18. 版本号比较 ====================
// 题干：比较两个版本号 "1.2.3" 与 "1.2.4"，返回 1 / -1 / 0。
// 输入：v1: string, v2: string
// 输出：number
// 约束：按段比较

// 实现：


// ==================== 19. 模板字符串解析 ====================
// 题干：实现简单模板解析，如 "Hello {{name}}, age: {{age}}"，传入 { name, age } 返回替换后字符串。
// 输入：template: string, data: object
// 输出：string
// 约束：支持嵌套对象 data.user.name

// 实现：


// ==================== 20. 异步串行与并行 ====================
// 题干：实现 runAsyncList(tasks)，tasks 为返回 Promise 的函数数组。先串行执行，再提供并行版本并说明区别。
// 输入：tasks: (() => Promise<any>)[]
// 输出：Promise<any[]>
// 约束：串行按序，并行同时发起

// 实现：
