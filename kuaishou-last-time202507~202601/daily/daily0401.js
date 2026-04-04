/**
 * daily0401.js — JS 面试代码题 20 道（作用域 / 闭包 / this）
 * 题后 // 答：… 为参考答案。
 */

// 1. 下面输出什么？
// var a = [];
// for (var i = 0; i < 3; i++) { a[i] = function () { return i; }; }
// console.log(a[0](), a[1](), a[2]());
// 答：3 3 3。var i 共享，循环结束时 i===3，三个闭包都读到 3。

// 2. 把上题改成 let，输出什么？
// 答：0 1 2。每轮块级 i，闭包各自捕获当轮值。

// 3. 下面输出什么？
// let x = 1;
// function f() { console.log(x); let x = 2; }
// f();
// 答：ReferenceError（TDZ）。函数体内 let x 声明前不可访问。

// 4. 手写一个函数 createCounter()，返回 { inc, dec, get }，get 返回当前值。
// 答：闭包保存 n；inc/dec 改 n，get 返回 n。
// function createCounter(init = 0) {
//   let n = init;
//   return {
//     inc: (d = 1) => (n += d),
//     dec: (d = 1) => (n -= d),
//     get: () => n,
//   };
// }

// 5. 下面输出什么？（严格模式）
// 'use strict';
// const obj = { name: 'a', fn() { return this.name; } };
// const g = obj.fn;
// console.log(obj.fn(), g());
// 答：先 'a'，再 TypeError。严格模式独立调用 g() 时 this 为 undefined。

// 6. 实现 call2(fn, thisArg, ...args)，效果同 Function.prototype.call。
// 答：return fn.apply(thisArg, args); 或 Reflect.apply(fn, thisArg, args)

// 7. 下面输出什么？
// const o = { x: 1, m: () => this.x };
// console.log(o.m());
// 答：通常为 undefined。箭头函数 this 不指向 o，取词法 this（模块/严格顶层多为 undefined）。

// 8. 用闭包实现单例模式：getInstance() 多次调用返回同一对象。
// 答：IIFE 内 let inst; return () => (inst ??= {});

// 9. 下面输出什么？
// var b = 10;
// (function () {
//   console.log(b);
//   var b = 20;
//   console.log(b);
// })();
// 答：undefined 然后 20。函数内 var b 提升，第一个 log 时尚未赋值。

// 10. 实现 once(fn)，保证 fn 只执行一次，后续调用返回第一次的返回值。
// 答：let called=false, ret; return (...a)=>{ if(!called){ called=true; ret=fn(...a);} return ret; };

// 11. 下面输出什么？
// function foo() { console.log(this.length); }
// foo.apply([1, 2, 3]);
// 答：3。this 为数组，length 为 3。

// 12. 手写 bind2(fn, thisArg, ...boundArgs)，返回绑定后的函数（不要求 new 兼容）。
// 答：return function(...args){ return fn.apply(thisArg, [...boundArgs, ...args]); };

// 13. 下面输出什么？
// const a = { n: 1 };
// const b = a;
// a.x = a = { n: 2 };
// console.log(a.x, b.x);
// 答：undefined { n: 2 }。先给旧对象加 x，再让 a 指向新对象；b 仍指旧对象，b.x 指向新对象。

// 14. 实现 memoize(fn)，对相同参数缓存结果（参数可 JSON.stringify）。
// 答：Map + JSON.stringify(args) 作 key，命中直接返回。

// 15. 下面输出什么？
// for (var i = 0; i < 3; i++) {
//   setTimeout(() => console.log(i), 0);
// }
// 答：3 3 3（顺序可能略有差异，均为 3）。var i 共享，宏任务执行时循环已结束。

// 16. 用 IIFE + 闭包修正第 15 题，使依次输出 0、1、2。
// 答：for(var i=0;i<3;i++)((j)=>setTimeout(()=>console.log(j),0))(i);
// 或 for(let i=0;i<3;i++) setTimeout(()=>console.log(i),0);

// 17. 下面输出什么？
// function f(a = b, b = 1) { return a + b; }
// console.log(f());
// 答：ReferenceError。默认参数从左求值，a=b 时 b 仍在 TDZ。

// 18. 实现 partial(fn, ...presetArgs)，返回新函数，新函数调用时拼上剩余参数。
// 答：(...rest) => fn(...presetArgs, ...rest)

// 19. 下面输出什么？
// const obj = { a: 1 };
// Object.defineProperty(obj, 'b', { value: 2, enumerable: false });
// console.log(Object.keys(obj).length, Object.getOwnPropertyNames(obj).length);
// 答：1 和 2。keys 不含不可枚举；b 在 getOwnPropertyNames 里。

// 20. 场景：循环里给 DOM 节点绑 click，要拿到正确索引 i（0..n-1），写一段最少改动的代码示例。
// 答：for(let i=0;i<nodes.length;i++) nodes[i].addEventListener('click',()=>console.log(i));
