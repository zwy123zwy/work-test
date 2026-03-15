/**
 * 020802 JS 输出题（20 道）
 * 日期：2026-02-08
 * 规则：先写出输出/结果，再运行验证。
 */

// ==================== 1. 事件循环 ====================
// 写出输出顺序。
// console.log(1);
// setTimeout(() => console.log(2), 0);
// Promise.resolve().then(() => console.log(3));
// console.log(4);
// 输出： 1 4 3 2


// ==================== 2. 事件循环 + async ====================
// 写出输出顺序。
// console.log(1);
// async function f() {
//     console.log(2);
//     await Promise.resolve();
//     console.log(3);
// }
// f();
// console.log(4);
// 输出：1243


// ==================== 3. this ====================
// 分别输出什么？
// const obj = {
//     a: 1,
//     fn() { console.log(this.a); }
// };
// const fn2 = obj.fn;
// fn2();
// obj.fn();
// fn2.call(obj);
// 输出：undefined 1 1


// ==================== 4. 闭包 + var ====================
// 输出？
// for (var i = 0; i < 3; i++) {
//     setTimeout(() => console.log(i), 100);
// }
// 输出：3 3 3


// ==================== 5. 闭包 + let ====================
// 输出？
// for (let i = 0; i < 3; i++) {
//     setTimeout(() => console.log(i), 100);
// }
// 输出：0 1 2


// ==================== 6. 类型与隐式转换 ====================
// 分别输出？
// console.log([] + {});
// console.log({} + []);
// console.log([] == ![]);
// 输出：[object Object] [object Object] true


// ==================== 7. typeof ====================
// 分别输出？
// console.log(typeof null);
// console.log(typeof []);
// console.log(typeof undefined);
// 输出：object object undefined


// ==================== 8. 微任务链 ====================
// 写出输出顺序。
// Promise.resolve().then(() => console.log(1)).then(() => console.log(2));
// Promise.resolve().then(() => console.log(3));
// 输出：1 3 2


// ==================== 9. 箭头函数 this ====================
// 输出？
// const obj = {
//     a: 1,
//     fn: () => console.log(this.a)
// };
// obj.fn();
// obj.fn.call({ a: 2 });
// 输出：undefined 2
// 【错误】正确答案：undefined undefined
// 原因：箭头函数的 this 在定义时静态绑定，call/apply/bind 无法修改。两次调用捕获的都是定义时的 this（模块/严格模式下为 undefined）。


// ==================== 10. 引用与赋值 ====================
// 输出？
// const a = { n: 1 };
// const b = a;
// a.x = a = { n: 2 };
// console.log(a.x);
// console.log(b.x);
// 输出：{n: 2} undefined
// 【错误】正确答案：undefined  {n: 2}
// 原因：a.x = a = {n: 2} 的执行顺序：① 先求左侧 a.x 的引用（此时 a 指原对象）② 执行 a = {n: 2}，a 指向新对象 ③ 把新对象赋给「原对象的 x」。故 a 指向新对象且无 x→undefined，b 仍指原对象，b.x 为 {n: 2}。


// ==================== 11. 变量提升 ====================
// 输出？
// console.log(foo);
// var foo = 1;
// function foo() {}
// console.log(foo);
// 输出：undefined function foo() {}
// 【错误】正确答案：function foo() {}  1
// 原因：函数声明优先于 var 提升，第一个 console.log 时 foo 已是函数；执行 var foo = 1 后，foo 被覆盖为 1。


// ==================== 12. 暂存死区 ====================
// 输出？（会报错吗？）
// console.log(x);
// let x = 1;
// 输出：ReferenceError: x is not defined


// ==================== 13. 数组与 length ====================
// 输出？
// const arr = [1, 2, 3];
// arr[10] = 10;
// console.log(arr.length);
// console.log(arr[5]);
// 输出：10 undefined
// 【错误】正确答案：11  undefined
// 原因：arr[10]=10 后，最大索引为 10，数组 length = 最大索引 + 1 = 11。arr[5] 未赋值，为 undefined。


// ==================== 14. 比较运算 ====================
// 分别输出？
// console.log(NaN === NaN);
// console.log(null == undefined);
// console.log(0 == false);
// 输出：true false true
// 【错误】正确答案：false  true  true
// 原因：NaN === NaN 在 JS 中恒为 false，NaN 不等于任何值（包括自身）。null == undefined 和 0 == false 为 true。


// ==================== 15. 原型链 ====================
// 输出？
// function F() {}
// F.prototype.a = 1;
// const o = new F();
// F.prototype = { b: 2 };
// console.log(o.a);
// console.log(o.b);
// 输出：1 undefined


// ==================== 16. 立即执行 + 闭包 ====================
// 输出？
// for (var i = 0; i < 3; i++) {
//     (function(j) {
//         setTimeout(() => console.log(j), 100);
//     })(i);
// }
// 输出：0 1 2


// ==================== 17. 运算符优先级 ====================
// 输出？
// console.log(1 + '2' + 3);
// console.log(1 + 2 + '3');
// console.log('1' - '2' + 3);
// 输出：123 33 2


// ==================== 18. 对象 key ====================
// 输出？
// const a = {};
// const b = { key: 'b' };
// const c = { key: 'c' };
// a[b] = 1;
// a[c] = 2;
// console.log(a[b]);
// 输出：1
// 【错误】正确答案：2
// 原因：对象作属性 key 时会被 toString 转为 "[object Object]"，b、c 转为同一字符串，a[c]=2 覆盖 a[b]=1，故 a[b] 即 a["[object Object]"] 为 2。


// ==================== 19. Promise 构造函数 ====================
// 写出输出顺序。
// console.log(1);
// new Promise(resolve => {
//     console.log(2);
//     resolve();
// }).then(() => console.log(3));
// console.log(4);
// 输出： 1 2 4 3


// ==================== 20. 综合：事件循环 + 优先级 ====================
// 写出输出顺序。
// setTimeout(() => console.log(1), 0);
// Promise.resolve()
//     .then(() => {
//         console.log(2);
//         setTimeout(() => console.log(3), 0);
//     })
//     .then(() => console.log(4));
// console.log(5);
// 输出： 5 2 4 1 3
