/**
 * daily0404.js — JS 面试代码题 20 道（事件循环 / 浏览器 API）
 * 题后 // 答：… 为参考答案。
 */

// 1. 下面输出顺序？
// console.log('A');
// setTimeout(() => console.log('B'), 0);
// queueMicrotask(() => console.log('C'));
// console.log('D');
// 答：A、D、C、B。

// 2. requestAnimationFrame 与 setTimeout(0) 谁先执行？（一般情况）
// 答：同帧内 rAF 在重绘前调度；setTimeout(0) 为宏任务，多在当前任务之后。常表述：微任务先于二者；rAF 与 setTimeout 相对顺序依赖注册时机。

// 3. 下面输出顺序？（浏览器）
// document.body.addEventListener('click', () => console.log(1));
// Promise.resolve().then(() => console.log(2));
// document.body.click();
// console.log(3);
// 答：1、3、2。click 同步执行监听；同步 log(3)；本轮结束后再微任务 2。

// 4. MessageChannel 与 setTimeout 做宏任务的差异（了解即可，简述）。
// 答：MessageChannel 的 postMessage 常比 setTimeout(0) 更早进宏队列（历史上用于更早的异步切分）。

// 5. 手写一个调度器：先执行同步代码，再在同一轮微任务里 flush 队列。
// 答：queueMicrotask(() => { while(q.length) run(q.shift()); }) 在同步末尾注册。

// 6. 下面输出顺序？
// async function f() {
//   await 1;
//   console.log('a');
// }
// f();
// Promise.resolve().then(() => console.log('b'));
// console.log('c');
// 答：c、a、b。f() 里 await 先排队微任务 A；再 then 排队 B；同步执行 log(c)；然后微任务 A 续体打印 a，再 B 打印 b。

// 7. 解释为什么 await 后面的代码像「微任务」。
// 答：async/await 编译为 Promise.then，续体在微任务阶段执行。

// 8. 下面输出顺序？
// setTimeout(() => console.log('t1'));
// setTimeout(() => console.log('t2'), 0);
// Promise.resolve().then(() => console.log('p'));
// 答：p、t1、t2。微任务先于宏任务；两个 setTimeout 按入队顺序。

// 9. 手写 nextTick（浏览器用 queueMicrotask 模拟）。
// 答：const nextTick = (fn) => queueMicrotask(fn);

// 10. 长任务阻塞主线程时，requestIdleCallback 适合做什么？
// 答：低优先级拆分工作、预加载非关键资源等（注意兼容与超时）。

// 11. 下面输出什么？
// let i = 0;
// const id = setInterval(() => {
//   console.log(i++);
//   if (i > 2) clearInterval(id);
// }, 0);
// 答：0、1、2。

// 12. visibilitychange 与 pagehide 的使用场景各举一例。
// 答：隐藏页签暂停视频/轮询；pagehide 卸载前保存草稿（含 bfcache）。

// 13. 下面输出顺序？（考虑微任务嵌套）
// Promise.resolve()
//   .then(() => {
//     console.log(1);
//     return Promise.resolve().then(() => console.log(2));
//   })
//   .then(() => console.log(3));
// 答：1、2、3。

// 14. 解释 event loop：一个宏任务后如何处理微任务队列？
// 答：执行完该宏任务关联的同步代码后，清空全部微任务（含微任务中新注册的），再渲染（如需），再取下一宏任务。

// 15. fetch 发请求后，回调在微任务还是宏任务？
// 答：then/catch 在微任务；网络完成由底层驱动，resolve 多在微任务进入 JS。

// 16. 手写 loadScript(url) 返回 Promise（动态 script 标签）。
// 答：创建 script、onload resolve、onerror reject、append 到 head。

// 17. 下面输出顺序？
// console.log(1);
// new Promise((r) => {
//   console.log(2);
//   r();
// }).then(() => console.log(3));
// console.log(4);
// 答：1、2、4、3。

// 18. scheduler.postTask 与 setTimeout 相比的优势（了解即可）。
// 答：可设任务优先级，利于调度与避免低优先级饿死。

// 19. 同一 DOM 上捕获阶段与冒泡阶段监听，点击时顺序？
// 答：捕获（根→目标）再冒泡（目标→根）；同阶段多个监听按注册顺序。

// 20. 如何避免 setInterval 在页面切后台时堆积？写思路或伪代码。
// 答：visibilitychange 时 clearInterval 或降频；用 setTimeout 链代替 setInterval。
