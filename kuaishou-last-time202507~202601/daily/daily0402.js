/**
 * daily0402.js — JS 面试代码题 20 道（原型 / 继承 / class）
 * 题后 // 答：… 为参考答案。
 */

// 1. 下面 instanceof 的结果？
// [] instanceof Array
// [] instanceof Object
// (function(){}) instanceof Object
// 答：三者均为 true（数组、函数都是 Object 派生）。

// 2. 手写 myInstanceof(left, right)。
// 答：沿 Object.getPrototypeOf(left) 走，直到等于 right.prototype 或 null。

// 3. Object.create(null) 创建的对象和 {} 有何区别？
// 答：前者无 Object.prototype 链，无 toString 等，适合作字典；{} 会继承原型。

// 4. 下面输出什么？
// function F() {}
// F.prototype.x = 1;
// const a = new F();
// F.prototype = { x: 2 };
// const b = new F();
// console.log(a.x, b.x);
// 答：1 和 2。a 用的是替换前的原型；b 用新原型。

// 5. 寄生组合式继承：写出 Parent、Child 的核心代码（含修复 constructor）。
// 答：Child.prototype = Object.create(Parent.prototype); Child.prototype.constructor = Child; Parent.call(this,...)

// 6. 下面输出什么？
// class A { static x = 1; y = 2; }
// console.log(A.x, new A().y, A.y);
// 答：1、2、undefined。y 是实例字段，不是 A 的静态属性。

// 7. class 里声明的方法是否可枚举？与普通对象字面量方法对比。
// 答：class 方法默认 enumerable:false；对象简写方法默认可枚举。

// 8. 下面是否报错？输出什么？
// class B extends null {
//   constructor() { super(); }
// }
// 答：TypeError。extends null 时 super() 无法建立合法原型链。

// 9. 手写 Object.create 的 polyfill（处理 proto 为 null 与对象）。
// 答：function F(){} F.prototype=proto; return proto===null?Object.create(null):new F()（注意旧环境 null 特例）。

// 10. 下面输出什么？
// const p = { a: 1 };
// const c = Object.create(p);
// c.b = 2;
// console.log('a' in c, c.hasOwnProperty('a'));
// 答：true false。'a' 在原型上；非 c 自有。

// 11. ES6 class 中 super 在静态方法与实例方法里分别指向什么？
// 答：静态方法里 super 指父类（构造函数对象）；实例方法里 super 指父类 prototype。

// 12. 实现一个简单的 Mixin：把对象 m 上的方法拷贝到 class C 的原型上（不覆盖已有同名方法）。
// 答：遍历 m 的函数属性，if (!(k in C.prototype)) C.prototype[k] = m[k]。

// 13. 下面输出什么？
// Function.prototype.__proto__ === ?
// 答：Object.prototype（函数也是对象）。

// 14. new 操作符做了哪几步？手写 myNew(Ctor, ...args)。
// 答：新建对象、链到 Ctor.prototype、执行构造函数、按返回值规则返回。
// const o=Object.create(Ctor.prototype); const r=Ctor.apply(o,args); return (r&&typeof r==='object')||typeof r==='function'?r:o;

// 15. 下面输出什么？
// const o = {};
// o.__proto__ = Array.prototype;
// console.log(o instanceof Array, Array.isArray(o));
// 答：true false。instanceof 看链；isArray 看内部标记。

// 16. 用 class 实现一个 EventEmitter（on、off、emit、once）。
// 答：Map<event,Set<fn>>；once 用包装函数里 off 自身；emit 遍历副本。

// 17. 原型链终点是什么？如何获取某对象的原型？
// 答：null。Object.getPrototypeOf(obj)。

// 18. 下面输出什么？
// class D { foo() {} }
// console.log(Object.getOwnPropertyNames(D.prototype));
// 答：含 constructor、foo 等（方法名在 prototype 上）。

// 19. 组合优于继承：举一个前端场景说明为何用组合更合适。
// 答：例：页面能力用多个 hook/小组件组合，比深继承更灵活、易测。

// 20. 手写 extends 的等价思路（子类原型 __proto__ 指向父类 prototype，子类 __proto__ 指向父类）。
// 答：Child.__proto__=Parent; Child.prototype.__proto__=Parent.prototype; 并修正 constructor。
