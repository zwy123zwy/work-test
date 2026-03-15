/**
 * 020602 代码输出题（20 道）
 * 日期：2026-02-06
 * 规则：仅题干与代码，由个人先完成后再补充解答。
 */

// ==================== 1 ====================
// 问：输出顺序？
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');

// 【答】1 4 3 2
// 【思路】同步 → 微任务 → 宏任务。先执行 console 1、4；微任务队列有 Promise.then(3)；宏任务队列有 setTimeout(2)。清空微任务后输出 3，再输出 2。

// ==================== 2 ====================
// 问：输出？
var a = 1;
function fn() {
  console.log(a);
  var a = 2;
}
fn();

// 【答】undefined
// 【思路】var 提升：fn 内 var a 提升到函数顶部，相当于 fn 内先有 var a; 再 console.log(a)，此时 a 未赋值，为 undefined。外层 a=1 被遮蔽。

// ==================== 3 ====================
// 问：输出？
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 【答】3 3 3
// 【思路】var i 为函数级作用域，循环结束后 i=3。setTimeout 回调在宏任务中执行时，闭包捕获的 i 已是 3。

// ==================== 4 ====================
// 问：输出？
const obj = { a: 1 };
function fn(o) {
  o.a = 2;
  o = { a: 3 };
}
fn(obj);
console.log(obj.a);
// 【答】2
// 【思路】o 与 obj 指向同一对象。o.a=2 修改该对象；o={a:3} 只改变局部 o，不改变 obj 所引用的对象。

// ==================== 5 ====================
// 问：输出？
console.log([] + []);
console.log([] + {});
console.log({} + []);
// 【答】''  '[object Object]'  0（或 '[object Object]'）
// 【思路】+ 有一方为字符串时做字符串拼接。[] 转字符串为 ''，{} 转字符串为 '[object Object]'。[]+[]=''，[]+{}='[object Object]'。{} + [] 中，若 {} 被解析为空块，则 +[] 为 ToNumber([])=0；在表达式语境下 {} + [] 可能是 '[object Object]'。


// ==================== 6 ====================
// 问：输出？
async function f() {
  console.log(1);
  await Promise.resolve();
  console.log(2);
}
console.log(3);
f();
console.log(4);
// 【答】3 1 4 2
// 【思路】f() 执行到 await 前输出 1，await 后的代码作为微任务入队；主流程继续输出 3、4；再执行微任务输出 2。

// ==================== 7 ====================
// 问：输出？
Promise.resolve(1) 
  .then(v => { console.log(v); return 2; })
  .then(v => { console.log(v); })
  .then(v => console.log(v));
// 【答】1 2 undefined
// 【思路】第一个 then 输出 1 并返回 2；第二个 then 输出 2 且无 return，返回 undefined；第三个 then 收到 undefined 并输出。

// ==================== 8 ====================
// 问：输出？
function Foo() {
  this.a = 1;
}
Foo.prototype.b = 2;
const o = new Foo();
console.log(o.a, o.b);
console.log(o.hasOwnProperty('a'), o.hasOwnProperty('b'));
// 【答】1 2 true false
// 【思路】new Foo() 创建的实例有自有属性 a=1；b 在原型上。hasOwnProperty 只查自有属性。

// ==================== 9 ====================
// 问：输出？
const arr = [1, 2, 3];
arr[10] = 10;
console.log(arr.length);
console.log(arr[5]);
// 【答】11 undefined
// 【思路】arr[10]=10 使 length 变为 11；中间索引 5 未赋值，为稀疏数组，访问得 undefined。

// ==================== 10 ====================
// 问：输出？
console.log(typeof null);
console.log(typeof []);
console.log(typeof function () {});
// 【答】object object function
// 【思路】typeof null 为 'object'（历史 bug）；数组、函数均为 object/function。

// ==================== 11 ====================
// 问：输出？
let x = 1;
{
  let x = 2;
  console.log(x);
}
console.log(x);
// 【答】2 1
// 【思路】let 有块级作用域；块内 x=2 遮蔽外层；块外仍为 1。

// ==================== 12 ====================
// 问：输出？
const fn1 = () => {
  console.log(this);
};
fn1.call({ a: 1 });
// 【答】window（或 global/undefined）
// 【思路】箭头函数没有自己的 this，call 无法修改；this 取自定义时的外层作用域。在全局定义则为 window/global。

// ==================== 13 ====================
// 问：输出？
console.log('5' + 3);
console.log('5' - 3);
console.log('5' * '2');
// 【答】53  2  10
// 【思路】+ 遇字符串做拼接；-、* 会将操作数转为数字。

// ==================== 14 ====================
// 问：输出？
const a2 = { n: 1 };
const b2 = a2;
a2.x = a2 = { n: 2 };
console.log(a2.x);
console.log(b2.x);
// 【答】undefined  { n: 2 }
// 【思路】a2.x = a2 = {n:2}：先求 a2.x 的引用（即原对象的 .x），再执行 a2={n:2}，最后把 {n:2} 赋给该引用。a2 指向新对象（无 x），b2 仍指向原对象，其 .x 为 {n:2}。

// ==================== 15 ====================
// 问：输出？
[1, 2, 3].map(parseInt);
// 【答】[1, NaN, NaN]
// 【思路】map 传入 (el, index, arr)，parseInt 收到 (1,0)、(2,1)、(3,2)。parseInt(s,0) 按十进制，得 1；radix 1、2 下 2、3 非法，得 NaN。

// ==================== 16 ====================
// 问：输出？
let i2 = 0;
const timer = setInterval(() => {
  console.log(i2++);
  if (i2 > 2) clearInterval(timer);
}, 100);
// 【答】0 1
// 【思路】i2++ 先返回再自增；输出 0、1 后 i2 变为 3，clearInterval 停止。

// ==================== 17 ====================
// 问：输出？
console.log(Boolean(new Boolean(false)));
console.log(Boolean([]));
console.log(Boolean({}));
// 【答】true true true
// 【思路】new Boolean(false) 是对象，Boolean(对象) 为 true；[]、{} 转为 Boolean 均为 true。

// ==================== 18 ====================
// 问：输出？
function A() {}
function B() {}
A.prototype = new B();
const a3 = new A();
console.log(a3 instanceof A);
console.log(a3 instanceof B);
// 【答】true true
// 【思路】A.prototype = new B()，a3 的原型链为 a3→A.prototype(B 实例)→B.prototype，故同为 A、B 的实例。

// ==================== 19 ====================
// 问：输出？
const p = new Promise((resolve, reject) => {
  resolve(1);
  reject(2);
});
p.then(v => console.log(v)).catch(e => console.log('err', e));
// 【答】1
// 【思路】resolve(1) 后状态变为 fulfilled，reject(2) 无效；then 输出 1，catch 不执行。

// ==================== 20 ====================
// 问：输出？
const o2 = {
  a: 1,
  get b() {
    return this.a + 1;
  },
};
console.log(o2.b);
const o3 = Object.create(o2);
o3.a = 10;
console.log(o3.b);
// 【答】2  11
// 【思路】o2.b 的 getter 中 this=o2，1+1=2。o3=Object.create(o2)，o3.a=10，访问 o3.b 时 this=o3，故 10+1=11。
