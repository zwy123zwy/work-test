/**
 * 0407.js — 异步编程代码题 20 道（输出顺序 / Promise / async-await）
 * 本文件给出题面 + 简要答案 / 代码骨架，完整实现多已在：
 *   - April/HandwrittenPromise.js
 *   - April/js-challenges-async-all.js
 */

// 1. 输出顺序？
// console.log(1);
// Promise.resolve().then(() => console.log(2));
// setTimeout(() => console.log(3), 0);
// console.log(4);
// 答：1、4、2、3。（同步 → 微任务 → 宏任务）

// 2. 输出顺序？
// async function f() {
//   console.log('a');
//   await 0;
//   console.log('b');
// }
// f();
// console.log('c');
// 答：a、c、b。await 之后的代码进入微任务。

// 3. 手写 Promise.all（要求：空数组、保序、短路 reject）。
// 答：参考 HandwrittenPromise.all（April/HandwrittenPromise.js）：
// - Array.from(iterable)；空数组直接 resolve([])；
// - 对每一项 Promise.resolve 包装，成功按下标回填，计数到 length resolve；
// - 任一 reject 立即 reject。

// 4. 手写 Promise.race（要求：谁先 settle 用谁）。
// 答：参考 HandwrittenPromise.race：
// - 遍历 iterable，Promise.resolve 包装后 then(resolve, reject)，不计数。

// 5. 手写 Promise.allSettled。
// 答：参考 HandwrittenPromise.allSettled：
// - 每项 then 成功写 {status:'fulfilled',value}，失败写 {status:'rejected',reason}；
// - 计数到 length resolve 整个数组。

// 6. 手写 Promise.any（全失败时抛 AggregateError）。
// 答：参考 HandwrittenPromise.any：
// - 任一 fulfilled 立即 resolve；
// - 收集每次 reject 的 reason 到 errors[]，当全部 reject 时 new AggregateError(errors)。

// 7. 实现 withTimeout(promise, ms)；超时 reject。
// 答：参考 js-challenges-async-all.js: withTimeout：
//   return Promise.race([promise, new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),ms))]);

// 8. 实现 retry(task, times, delay)；失败重试，成功即返回。
// 答：参考 promiseRetry：
//   for (let i=0;i<times;i++) try { return await task(); } catch(e){ last=e; await sleep(delay); } throw last;

// 9. 手写 sleep(ms) 并用它实现：每隔 1s 打印 1..5。
// 答：sleep 见 js-challenges-async-all.js: sleep；printOneToFiveEverySecond 已实现：
//   async function print(){ for(let i=1;i<=5;i++){ console.log(i); if(i<5) await sleep(1000);} }

// 10. 用 setTimeout 实现 setInterval（返回 cancel）。
// 答：见 setTimeoutAsInterval：
//   function setTimeoutAsInterval(fn,delay){ let cleared=false,id; function tick(){ if(cleared)return; fn(); id=setTimeout(tick,delay);} id=setTimeout(tick,delay); return ()=>{cleared=true;clearTimeout(id);} }

// 11. 反过来：用 setInterval 模拟 setTimeout（只执行一次）。
// 答：见 setIntervalAsTimeout：
//   function setIntervalAsTimeout(fn,delay){ const id=setInterval(()=>{clearInterval(id);fn();},delay); return ()=>clearInterval(id);}

// 12. 实现并发池：limitRequest(tasks, limit)（结果按原下标顺序返回）。
// 答：见 concurrentPoolOrdered / promiseAllWithLimit：
//   tasks 为 ()=>Promise；若总数 N，启动 min(limit,N) 个 worker，从共享 cursor 取下标并写 results[idx]。

// 13. 实现 Scheduler 类：add(task)；同一时间最多并发 2 个任务。
// 答：见 Scheduler：
//   内部 queue + running 计数，在 run() 中 while(running<limit&&queue.length) 取任务执行，finally 里 running-- 再次 run()。

// 14. 实现 serial(tasks)：按顺序执行 Promise 任务数组。
// 答：见 runSerial：
//   tasks.reduce((p,t)=>p.then(acc=>t().then(v=>[...acc,v])),Promise.resolve([]));

// 15. 竞态题：连续输入触发请求，后发先至时如何保证只展示最新结果？
// 答：见 createLatestGate：
//   使用自增 seq，在调用时捕获当前 id，await 完成后只在 id===最新 seq 时更新 UI。

// 16. 实现 gate(fn)：上一次未完成时，后续调用直接忽略。
// 答：同 createLatestGate，一种策略是仅返回最新；若要「之前没完成则忽略新的」，可在 busy=true 时直接返回 undefined。

// 17. fetch 请求 5 秒未完成自动中断（AbortController）。
// 答：见 fetchWith5sAbort：
//   const c=new AbortController(); const id=setTimeout(()=>c.abort(),5000); return fetch(url,{signal:c.signal}).finally(()=>clearTimeout(id));

// 18. 用 Promise 封装图片异步加载 loadImage(url)（浏览器环境）。
// 答：见 loadImage：
//   new Promise((res,rej)=>{ const img=new Image(); img.onload=()=>res(img); img.onerror=()=>rej(...); img.src=url; });

// 19. 回调地狱改写：A -> B -> C 三个异步步骤改写成 async/await。
// 答：见 callbackHellToAsync：
//   const a=await wrapCb(getA); const b=await wrapCb(getB,a); const c=await wrapCb(getC,b); return c;

// 20. 手写 asyncToGenerator：把 function* 转成返回 Promise 的函数。
// 答：已在 04061.js 与 js-challenges-async-all.js 中实现 asyncToGenerator：
//   内部通过 gen = genFn(...args)，step('next') 递归，yield 出来的 value 用 Promise.resolve 包装后再 step('next'/'throw')。


