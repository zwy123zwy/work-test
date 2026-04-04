/**
 * daily0406.js — JS 面试代码题 20 道（函数式 / 工具函数）
 * 题后 // 答：… 为参考答案。
 */

// 1. 手写 compose(...fns)，compose(f,g,h)(x) === f(g(h(x)))。
// 答：(x)=>fns.reduceRight((v,f)=>f(v),x)

// 2. 手写 pipe(...fns)，pipe(f,g,h)(x) === h(g(f(x)))。
// 答：(x)=>fns.reduce((v,f)=>f(v),x)

// 3. 手写 curry(fn)，支持柯里化调用。
// 答：递归收集参数，够 fn.length 则调用，否则返回继续柯里化的函数。

// 4. 实现 unary(fn)，把多参函数变成只收第一个参数。
// 答：(a)=>fn(a)

// 5. 手写 map / filter / reduce（仅数组版，不用内置同名方法）。
// 答：for 循环 push 或累加器实现。

// 6. 实现 flattenObject({ a: { b: 1 } }) -> { 'a.b': 1 }。
// 答：递归，键用 prefix + '.' + k。

// 7. 手写节流 throttle 带 trailing：最后一次也要在停顿后触发。
// 答：last 时间 + 结束时 setTimeout 补发最后一次调用。

// 8. 实现防抖 debounce 的 immediate 选项（首击立即执行）。
// 答：首次 call，之后 wait 内仅重置定时器，不再立即执行直到停顿。

// 9. 手写函数重载模拟：overload 根据参数类型分发。
// 答：typeof / length 判断分支调用不同实现。

// 10. 实现 composePromise(...asyncFns)，从左到右串行传值。
// 答：async (x)=>{ for(const f of asyncFns) x=await f(x); return x; }

// 11. 手写 memoize 带 max 缓存条数（LRU 或 FIFO）。
// 答：Map 记顺序，超 max 删最旧条目。

// 12. 实现 partialRight(fn, ...args)，预设右侧参数。
// 答：(...left)=>fn(...left,...args)

// 13. 手写 zip(a, b) -> [[a0,b0],[a1,b1],...]。
// 答：for i in 0..min-1 push [a[i],b[i]]

// 14. 实现 once(fn) 与 before(n, fn)（前 n-1 次执行原函数，第 n 次起不再执行）。
// 答：once 同 daily0401；before：计数器 >=n 则返回 undefined。

// 15. 手写 noop 与 identity，说明在高阶函数里的用途。
// 答：noop(){}；identity(x)=>x；作默认回调或 reduce 初值占位。

// 16. 实现限流：每 windowMs 最多执行 max 次（令牌桶或滑动窗口思路）。
// 答：队列+时间戳数组清理过期；或桶内令牌数。

// 17. 手写 safeGet(obj, 'a.b.c', defaultValue)。
// 答：path.split('.').reduce((o,k)=>o?.[k], obj) ?? default

// 18. 实现 binarySearch(sortedArr, target) 返回下标或 -1。
// 答：双闭区间 while(l<=r) mid 比较缩半。

// 19. 说明纯函数与副作用，各举一例 React 中的对应写法。
// 答：纯：props 映射 UI 无请求；副作用：useEffect 里 fetch、订阅。

// 20. 手写一个简单的 Observable：subscribe、unsubscribe、next（不必完全符合规范）。
// 答：Set 存监听；subscribe 返回 ()=>delete；next 遍历调用。
