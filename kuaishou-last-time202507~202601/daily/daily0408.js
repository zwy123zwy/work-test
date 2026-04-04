/**
 * daily0408.js — JS 面试代码题 20 道（迭代器 / Generator / 模块化）
 * 题后 // 答：… 为参考答案。
 */

// 1. 手写 range(start, end)，返回可迭代对象，for (const x of range(1,3)) 打印 1,2,3。
// 答：带 [Symbol.iterator] 的对象，next 返回递增 value 直到 end。

// 2. function* 与 async function* 的区别？
// 答：前者同步迭代器；后者异步迭代器，可 await，用于 for await...of。

// 3. 下面输出什么？
// function* g() { yield 1; yield* [2, 3]; yield 4; }
// console.log([...g()]);
// 答：[1,2,3,4]。

// 4. 手写 generator 版 fibonacci 前 n 项。
// 答：function* fib(n){ let a=0,b=1; for(let i=0;i<n;i++){ yield a; [a,b]=[b,a+b]; } }

// 5. yield 表达式本身的值从哪来？举例 next 传参。
// 答：来自下一次 gen.next(传入值)，作为上一次 yield 表达式的结果。

// 6. 实现 runGenerator(gen)，自动驱动 generator 直到结束（基于 Promise）。
// 答：递归/循环 it.next()，value 为 Promise 则 then 再 step。

// 7. for await...of 适用于什么？写一段读取 async iterable 的示例骨架。
// 答：消费 AsyncIterable；for await (const x of asyncGen()) { }

// 8. ES module 与 CommonJS 在导出值上的「绑定 vs 拷贝」差异？
// 答：ESM live binding；CJS require 对基本类型像拷贝、对象仍是引用。

// 9. 动态 import() 返回什么？适合什么场景？
// 答：Promise<module namespace>；代码分割、懒加载。

// 10. 下面合法吗？说明 tree-shaking 对 sideEffects 的影响。
// export const a = 1;
// if (true) export const b = 2;
// 答：不合法，export 不能出现在块内。sideEffects:false 利于摇树；有副作用模块需在 package.json 声明。

// 11. 手写简单的模块缓存：模拟 require 只执行一次模块顶层代码。
// 答：Map<id, exports>，首次执行 factory 并缓存，后续直接返回 exports。

// 12. Generator.return( value ) 之后再次 next 会怎样？
// 答：返回 {done:true, value}；之后再 next 仍为 done:true。

// 13. 实现 zipIterables(a, b) 生成器，逐项配对直到较短结束。
// 答：双迭代器 next，任一 done 则停，否则 yield [va,vb]。

// 14. Symbol.asyncIterator 的作用？如何让对象支持 for await？
// 答：异步可迭代协议；对象需 [Symbol.asyncIterator] 返回 AsyncIterator。

// 15. 简述 ESM 循环依赖与 CJS 循环依赖的表现差异（能运行 vs 部分 undefined）。
// 答：ESM 可能 TDZ；CJS 可能先拿到不完整 exports。

// 16. 手写 take(iterable, n)，只取前 n 个元素（惰性）。
// 答：generator 里 for...of 计数到 n 停止。

// 17. function* idMaker() 无限自增 id，如何中断并释放（return / throw）？
// 答：调用方 gen.return() 或 gen.throw()，并不再迭代。

// 18. 顶层 await 在模块中的含义？对依赖该模块的加载有何影响？
// 答：该模块异步求值，导入方会等待其完成。

// 19. 实现 mergeSortedIterables(a, b) 生成有序合并序列（假设输入已升序）。
// 答：双指针比较 yield 较小者，一方耗尽则 yield* 另一方。

// 20. 用 generator 实现二叉树中序遍历（给树节点结构 {val,left,right}）。
// 答：function* inorder(n){ if(!n)return; yield* inorder(n.left); yield n.val; yield* inorder(n.right); }
