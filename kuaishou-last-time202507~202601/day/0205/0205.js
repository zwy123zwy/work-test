/**
 * 0205 面试题：Promise 输出题 + CSS 布局实现（20 道）
 * 日期：2026-02-05
 */

// ==================== 一、Promise 输出题（1-10） ====================

// 1. 基础同步与微任务顺序
// 问：输出顺序？
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// 答：1 4 3 2（同步 → 微任务 → 宏任务）

// 2. 多层 then 与 setTimeout
// 问：输出顺序？
Promise.resolve()
  .then(() => { console.log('A'); setTimeout(() => console.log('B'), 0); })
  .then(() => console.log('C'));
setTimeout(() => console.log('D'), 0);
console.log('E');
// 答：E A C D B（E 同步；微任务 A→then 再注册微任务 C→C；宏任务 D、B）

// 3. Promise 内同步与 then
// 问：输出顺序？
new Promise((resolve) => {
  console.log('p1');
  resolve('p2');
  console.log('p3');
}).then((r) => console.log(r));
console.log('p4');
// 答：p1 p3 p4 p2（executor 同步执行；then 回调微任务）

// 4. then 返回新 Promise
// 问：输出顺序？
Promise.resolve(1)
  .then((v) => { console.log(v); return 2; })
  .then((v) => { console.log(v); return Promise.resolve(3); })
  .then((v) => console.log(v));
// 答：1 2 3（return Promise 会多一次微任务拆包，但结果仍为 3）

// 5. 链中抛出错误
// 问：输出顺序？
Promise.resolve()
  .then(() => { console.log('a'); throw new Error('err'); })
  .then(() => console.log('b'))
  .catch((e) => console.log('c', e.message))
  .then(() => console.log('d'));
// 答：a c err d（throw 后跳到 catch，catch 后继续 then）

// 6. async/await 与微任务
// 问：输出顺序？
async function f() {
  console.log('f1');
  await Promise.resolve();
  console.log('f2');
}
console.log('s1');
f();
console.log('s2');
// 答：s1 f1 s2 f2（await 后的代码相当于放在 then 里，即微任务）

// 7. await 表达式的值
// 问：输出？
async function foo() {
  const a = await 100;
  const b = await Promise.resolve(200);
  console.log(a, b);
}
foo();
// 答：100 200（await 非 thenable 则包装成 resolved Promise；thenable 取 resolve 值）

// 8. 多个 Promise 同时 resolve
// 问：输出顺序？
const p1 = Promise.resolve().then(() => console.log(1));
const p2 = Promise.resolve().then(() => console.log(2));
Promise.all([p1, p2]).then(() => console.log(3));
// 答：1 2 3（p1、p2 的 then 先入微任务队列，按序 1 2，再 all 的 then 输出 3）

// 9. Promise 与 setTimeout 混用
// 问：输出顺序？
setTimeout(() => console.log('t1'), 0);
new Promise((r) => r()).then(() => console.log('p1'));
Promise.resolve().then(() => console.log('p2'));
console.log('sync');
// 答：sync p1 p2 t1（同步先；微任务按注册顺序 p1 p2；宏任务 t1）

// 10. 链式 then 与 return undefined
// 问：输出？
Promise.resolve(1)
  .then((v) => { console.log(v); })
  .then((v) => console.log(v));
// 答：1 undefined（第一个 then 无 return，第二个 then 收到 undefined）


// ==================== 二、CSS 布局实现（11-20） ====================

// 11. 水平垂直居中（flex）
// 题目：单元素在父容器内水平垂直居中，用 flex。
/*
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%; height: 400px;
}
.child { width: 100px; height: 100px; }
*/

// 12. 水平垂直居中（绝对定位 + transform）
// 题目：未知子元素宽高时，用 position 实现居中。
/*
.parent { position: relative; width: 100%; height: 400px; }
.child {
  position: absolute;
  left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  width: 100px; height: 100px;
}
*/

// 13. 两栏布局：左固定宽，右自适应
// 题目：左侧 200px，右侧填满剩余宽度。
/*
.left { float: left; width: 200px; }
.right { margin-left: 200px; }
或
.container { display: flex; }
.left { width: 200px; flex-shrink: 0; }
.right { flex: 1; }
*/

// 14. 三栏布局：左右固定，中间自适应（flex）
// 题目：左 200px、右 200px，中间自适应。
/*
.container { display: flex; }
.left, .right { width: 200px; flex-shrink: 0; }
.center { flex: 1; }
*/

// 15. 三栏布局：圣杯布局（中间内容先渲染）
// 题目：HTML 顺序为 center-left-right，中间自适应，左右固定。
/*
.container { padding: 0 200px; }
.center { float: left; width: 100%; }
.left { float: left; width: 200px; margin-left: -100%; position: relative; right: 200px; }
.right { float: left; width: 200px; margin-left: -200px; }
*/

// 16. 三栏布局：双飞翼（中间多一层包裹）
// 题目：中间内容先渲染，中间栏用子元素 margin 留出左右空间。
/*
.main-wrap { float: left; width: 100%; }
.main-wrap .main { margin: 0 200px; }
.left { float: left; width: 200px; margin-left: -100%; }
.right { float: left; width: 200px; margin-left: -200px; }
*/

// 17. Grid 等分多列
// 题目：一行 N 列等分，子项等高。
/*
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
*/

// 18. 两列等高（flex）
// 题目：左右两列内容不等时，视觉等高。
/*
.container { display: flex; }
.left, .right { flex: 1; }
（flex 默认 align-items: stretch，子项会等高）
*/

// 19. 水平居中：块级元素
// 题目：块级元素自身水平居中。
/*
.block { width: 200px; margin-left: auto; margin-right: auto; }
或
.parent { display: flex; justify-content: center; }
*/

// 20. sticky 吸顶
// 题目：滚动到一定位置时，某栏吸顶。
/*
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
}
*/
