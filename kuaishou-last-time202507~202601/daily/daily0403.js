/**
 * daily0403.js — JS 面试代码题 20 道（Promise / async-await）
 * 题后 // 答：… 为参考答案。
 */

// 1. 下面输出顺序？
// console.log(1);
// Promise.resolve().then(() => console.log(2));
// console.log(3);
// 答：1、3、2。

// 2. 下面输出顺序？
// setTimeout(() => console.log('t'), 0);
// Promise.resolve().then(() => console.log('p'));
// console.log('s');
// 答：s、p、t。

// 3. 手写 Promise.all(iterable)，要点：空数组、reject 短路、保序。
// 答：[] 直接 resolve([])；计数或 Promise.resolve 每项；任一 reject 立即 reject；结果按下标填。

// 4. 手写 Promise.race(iterable)。
// 答：第一个 settle（fulfill 或 reject）决定最终结果。

// 5. 下面输出什么？
// Promise.resolve(1)
//   .then(() => { throw 2; })
//   .catch((e) => e)
//   .then((x) => console.log(x));
// 答：2。catch 返回普通值会进入 fulfilled。

// 6. async 函数返回值在外部如何用 then 接到？
// 答：foo().then(v => ...) 或 await foo()。

// 7. 下面输出顺序？
// async function f() {
//   console.log('a');
//   await Promise.resolve();
//   console.log('b');
// }
// console.log('c');
// f();
// Promise.resolve().then(() => console.log('b'));
// console.log('d');
// 答：c、a、d，然后两个微任务：先 await 续体 b，再 then 的 b → 即 c a d b b（两行都是 b）。

// 8. 手写 sleep(ms) 返回 Promise。
// 答：const sleep = ms => new Promise(r => setTimeout(r, ms));

// 9. 实现 retry(fn, times)，fn 返回 Promise，失败重试最多 times 次。
// 答：循环 try/catch 或 .catch 链，失败递减 times 直至成功或耗尽。

// 10. 下面会打印 catch 吗？为什么？
// Promise.resolve().then(() => {
//   throw new Error('e');
// });
// 答：不会（链上无 catch）。触发 unhandledrejection。

// 11. 手写 Promise.allSettled。
// 答：每项包成 Promise.resolve(p).then(v=>({status:'fulfilled',value:v}),e=>({status:'rejected',reason:e})) 再 all。

// 12. 如何把回调风格 fs.readFile 转成 Promise（手写 promisify 思路）？
// 答：new Promise((res,rej)=>fn(...args,(err,v)=>err?rej(err):res(v)))。

// 13. 下面输出什么？
// const p = new Promise((r) => {
//   r(1);
//   r(2);
// });
// p.then(console.log);
// 答：1。Promise 只能 settle 一次。

// 14. async 里未 await 的 Promise 抛错，外层 try/catch 能捕获吗？举例。
// 答：不能同步捕获。须 await 或 .catch。

// 15. 手写串行执行 tasks: Array<() => Promise<any>>。
// 答：tasks.reduce((p,t)=>p.then(()=>t()), Promise.resolve())。

// 16. 实现超时包装：withTimeout(promise, ms)，超时 reject。
// 答：Promise.race([promise, new Promise((_,r)=>setTimeout(()=>r(new Error('timeout')),ms))])。

// 17. 下面输出什么？
// Promise.reject('a')
//   .then(null, (e) => { console.log(e); throw 'b'; })
//   .catch((e) => console.log(e));
// 答：先打印 a，再打印 b。

// 18. 手写 Promise.any（有一个 fulfilled 即成功，全失败则 AggregateError）。
// 答：竞态 fulfill；全 reject 聚合成 AggregateError（需 Promise 环境支持）。

// 19. 解释微任务队列与宏任务：一次点击可能产生哪些任务？
// 答：同步监听器 → 微任务（Promise 等）→ 渲染/下一宏任务（setTimeout 等）。

// 20. 实现 debouncePromise(fn, wait)：连续调用只保留最后一次，且返回对应 Promise。
// 答：定时器重置 + 为每次调用挂 resolve；仅最后一次定时到期时 resolve 该次结果。
