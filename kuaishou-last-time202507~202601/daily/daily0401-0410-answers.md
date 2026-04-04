# daily0401 ~ daily0410 全部答案

**答案已写入各题文件：`daily0401.js` … `daily0410.js`（每题下 `// 答：`）。下文为展开版备份。**

---

## daily0401（作用域 / 闭包 / this）

1. **输出** `3 3 3`。`var i` 共享一个 `i`，循环结束时 `i===3`，三个函数都读到 3。

2. **输出** `0 1 2`。`let i` 每轮块级绑定，闭包各自捕获当轮 `i`。

3. **ReferenceError**（暂时性死区）。`let x` 声明前在函数体内不可访问。

4. **参考实现**：

```js
function createCounter(init = 0) {
  let n = init;
  return {
    inc: (d = 1) => (n += d),
    dec: (d = 1) => (n -= d),
    get: () => n,
  };
}
```

5. **输出** `obj.fn()` → `'a'`；`g()` → **TypeError**（严格模式独立调用，`this` 为 `undefined`）。

6. **参考实现**：`fn.apply(thisArg, args)` 或 `fn.call(thisArg, ...args)` 的手写即 `Reflect.apply(fn, thisArg, args)`。

```js
function call2(fn, thisArg, ...args) {
  return fn.apply(thisArg, args);
}
```

7. **通常输出 `undefined`**。箭头函数 `this` 为词法 `this`（不指向 `o`）；模块/严格顶层常为 `undefined`，非严格浏览器脚本顶层可能为 `window`（若 `window.x` 不存在仍为 `undefined`）。

8. **参考实现**：

```js
const getInstance = (() => {
  let inst;
  return () => (inst ??= {});
})();
```

9. **输出** `undefined` 然后 `20`。IIFE 内 `var b` 提升，第一个 `log` 时尚未赋值。

10. **参考实现**：

```js
function once(fn) {
  let called = false;
  let ret;
  return function (...args) {
    if (!called) {
      called = true;
      ret = fn.apply(this, args);
    }
    return ret;
  };
}
```

11. **输出 `3`**。`apply` 把 `this` 设为数组，`this.length` 为 3。

12. **参考实现**：

```js
function bind2(fn, thisArg, ...bound) {
  return function (...args) {
    return fn.apply(thisArg, [...bound, ...args]);
  };
}
```

13. **输出** `undefined` 与 `{ n: 2 }`。`a.x = a = { n: 2 }` 先对**旧对象**挂属性 `x`，再让变量 `a` 指向新对象；`b` 仍指向旧对象，其 `x` 指向新对象。

14. **参考实现**：

```js
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const v = fn.apply(this, args);
    cache.set(key, v);
    return v;
  };
}
```

15. **输出** `3`、`3`、`3`（或顺序均为 3）。`var i` 共享，宏任务执行时循环已结束。

16. **示例**：

```js
for (var i = 0; i < 3; i++) {
  ((j) => {
    setTimeout(() => console.log(j), 0);
  })(i);
}
// 或 for (let i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }
```

17. **ReferenceError**。默认参数从左求值，`a = b` 求值时 `b` 仍在 TDZ。

18. **参考实现**：

```js
function partial(fn, ...preset) {
  return (...rest) => fn(...preset, ...rest);
}
```

19. **输出** `1` 与 `2`。`Object.keys` 只含可枚举自有属性（只有 `a`）；`getOwnPropertyNames` 含不可枚举 `b`。

20. **示例**：

```js
for (let i = 0; i < nodes.length; i++) {
  nodes[i].addEventListener('click', () => console.log(i));
}
// 或 var + 包 IIFE；(i) => ... 传参
```

---

## daily0402（原型 / 继承 / class）

1. **`true`**；**`true`**（数组是 Object 派生）；**`true`**（函数是对象）。

2. **参考实现**：

```js
function myInstanceof(left, right) {
  let p = Object.getPrototypeOf(Object(left));
  while (p) {
    if (p === right.prototype) return true;
    p = Object.getPrototypeOf(p);
  }
  return false;
}
```

3. **`Object.create(null)`** 无 `Object.prototype` 链上属性，适合字典；`{}` 有 `toString` 等，键名可能与原型冲突（若未用 `Object.create(null)`）。

4. **输出** `1` 与 `2`。`a` 的原型仍是**替换前**的 prototype 对象；`b` 指向**新** prototype。

5. **寄生组合式**（要点：`Child.prototype = Object.create(Parent.prototype)`，`constructor` 指回 `Child`，`Parent.call(this, ...)` 继承实例属性）。

6. **输出** `1`、`2`、`undefined`。`static x` 在类上；`y` 为实例字段；`A.y` 无此静态属性。

7. **class 中方法**默认 `enumerable: false`；对象字面量简写方法默认可枚举（`true`）。

8. **`extends null` 且 `constructor` 里调用 `super()`** 会 **TypeError**（无法用 `null` 作 `[[Prototype]]` 完成 super）。若省略 `super()` 部分环境可定义类，但实例化行为受限，面试常答「报错」。

9. **polyfill 思路**：`function F() {}` `F.prototype = proto`；`proto === null` 时用 `Object.create(null)` 或文档模式 `document.createElement` 技巧（旧 IE）；否则 `return new F()`。

10. **输出** `true`、`false`。`'a' in c` 沿原型链；`a` 在原型 `p` 上，非 `c` 自有。

11. **静态方法**里 `super` 指向父类（构造函数对象）；**实例方法**里 `super` 指向父类 `prototype`（父原型上的方法）。

12. **思路**：`Object.getOwnPropertyNames(m)` 过滤出函数，`if (!(k in C.prototype)) C.prototype[k] = m[k]`。

13. **`Object.prototype`**（函数也是对象，沿 `__proto__` 最终到 `Object.prototype`）。

14. **new 步骤**：新建对象、`[[Prototype]]` 链到 `Ctor.prototype`、执行构造函数、`this` 绑定、若返回对象则用之否则返回新对象。

```js
function myNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype);
  const ret = Ctor.apply(obj, args);
  return ret != null && (typeof ret === 'object' || typeof ret === 'function') ? ret : obj;
}
```

15. **输出** `true`、`false`。`instanceof` 看原型链；`Array.isArray` 看内部 `[[Class]]`，普通对象即使改 `__proto__` 也不是数组。

16. **EventEmitter**：`Map<event, Set<fn>>`，`on` 添加，`off` 删除，`once` 包装后 `off` 自身，`emit` 遍历副本调用。

17. **原型链终点** `null`。`Object.getPrototypeOf(obj)` 或 `__proto__`（不推荐依赖）。

18. **输出** 含 **`constructor`**、**`foo`**（等方法名）。`class` 方法在 `prototype` 上为非枚举可配置属性。

19. **例**：UI 组件用「组合多个 hook/子组件」比深继承树更灵活；或表格列用配置数组而非 `ColumnA extends Column`。

20. **`Child.__proto__ = Parent`**（静态继承），**`Child.prototype.__proto__ = Parent.prototype`**（实例方法继承），并设置 `constructor`。

---

## daily0403（Promise / async-await）

1. **顺序** `1`、`3`、`2`。

2. **顺序** `s`、`p`、`t`（微任务先于定时器宏任务）。

3. **Promise.all**：空数组立即 `resolve([])`；计数或 `Promise.resolve` 包装每项；任一 `reject` 立即 `reject`。

4. **Promise.race**：第一个 `settle` 的结果作为最终结果。

5. **输出 `2`**。`catch` 返回普通值会 `resolve` 后续 `then`。

6. **`async` 函数返回 Promise**，外部 `asyncFn().then(v => ...)` 或 `await asyncFn()`。

7. **顺序** `c`、`a`、`d`，然后两个微任务：**先** `await` 续体 **`b`**，**再** `then` 的 **`b`**（若两者都打印 `b` 则两行 `b`）。即 **`c a d b b`**（第二段 `b` 来自 `Promise.resolve().then`）。

8. `const sleep = (ms) => new Promise((r) => setTimeout(r, ms));`

9. **retry**：循环 `try/catch`，失败 `times--` 直到成功或次数用尽。

10. **不会**被未挂载的 `catch` 打印；会变成 **未处理的 Promise 拒绝**（`unhandledrejection`）。要捕获需在链上 `.catch` 或 `return` 到外层。

11. **allSettled**：`Promise.all(arr.map(p => Promise.resolve(p).then(v => ({status:'fulfilled',value:v}), e => ({status:'rejected',reason:e}))))`。

12. **promisify**：`new Promise((resolve, reject) => fn(...args, (err, res) => err ? reject(err) : resolve(res)))`。

13. **输出 `1`**。Promise 只能 settle 一次，第一次 `r(1)` 已定稿。

14. **不能**。未 `await` 的 Promise 内错误是异步的，需 `.catch` 或 `await` 才能被同步 `try/catch` 关联到（`await` 会把拒绝转成 throw）。

15. **串行**：`tasks.reduce((p, t) => p.then(() => t()), Promise.resolve())`。

16. **withTimeout**：`Promise.race([promise, new Promise((_, r) => setTimeout(() => r(new Error('timeout')), ms))])`。

17. **输出** 先 **`a`**（`then` 的 onRejected），再 **`b`**（后续 `catch`）。

18. **Promise.any**：与 `all` 类似但首个 `fulfill` 即 resolve；全 reject 时 `AggregateError`。

19. **点击**：同步监听器 → 清空微任务（Promise 等）→ 可能布局/绘制 → 下一个宏任务（如 `setTimeout`）。

20. **debouncePromise**：维护 `wait` 定时器与 `resolve/reject` 映射，只让最后一次调用的 Promise 与最新结果对齐。

---

## daily0404（事件循环 / 浏览器 API）

1. **顺序** `A`、`D`、`C`、`B`（同步 → 微任务 → 宏任务）。

2. **一般**同帧内 **rAF 在重绘前** 与布局后执行；`setTimeout(0)` 为宏任务，多在**下一任务**或更晚。同帧内常 **先** 看到 rAF（若在同一帧注册），实际面试答：**微任务 > rAF 与 setTimeout 的先后依赖注册时机，通常 setTimeout(0) 不早于当前帧 rAF**。

3. **顺序** `1`、`3`、`2`。`click()` 同步执行监听打印 `1`，接着同步 `console.log(3)`，本轮宏任务结束后才清空微任务打印 `2`。

4. **MessageChannel**：`postMessage` 常比 `setTimeout` 更早触发宏任务（历史上是 Vue nextTick 等技巧）；`setTimeout` 有最小延迟（4ms 等）。

5. **调度器**：同步执行完后 `queueMicrotask(() => { while (queue.length) run(queue.shift()); })`。

6. 见 daily0403 第 7 题：**`a c d b b`**（若 `then` 与 `await` 续体都打印 `b`）。

7. **`await` 后续**被编译成 `then`，作为微任务在**当前同步代码结束后的微任务阶段**执行。

8. **顺序** **`p`**，然后 **`t1`**、**`t2`**（两个 `setTimeout` 均为宏任务，按队列顺序）。

9. `const nextTick = (fn) => queueMicrotask(fn);`

10. **rIC**：低优先级工作、分片处理大数据、预加载非关键资源等（注意浏览器兼容与 `requestIdleCallback` 超时）。

11. **输出** `0`、`1`、`2`（在 `i > 2` 时清除，`i` 自增后判断）。

12. **visibilitychange**：页签隐藏暂停音视频/轮询；**pagehide**：卸载前保存草稿（尤其 `persisted` 与 bfcache）。

13. **顺序** `1`、`2`、`3`（返回的内层 Promise 会延迟外层下一个 `then`）。

14. **宏任务**执行完，**清空整个微任务队列**（含微任务中新注册的微任务），再渲染（如需），再取下一个宏任务。

15. **`fetch` 回调**：`then` 在**微任务**；底层 I/O 完成用宏任务/ C++ 层驱动，但 JS 侧 `resolve` 多在微任务。

16. **loadScript**：

```js
function loadScript(url) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = url;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(url));
    document.head.appendChild(s);
  });
}
```

17. **顺序** `1`、`2`、`4`、`3`。

18. **postTask**：可设优先级（`user-blocking`、`user-visible`、`background`），比 `setTimeout` 更贴近调度器，利于避免饿死低优先级任务。

19. **目标阶段**：先**捕获**（根→目标），再**冒泡**（目标→根）。同一元素上按**注册顺序**若同阶段则按添加顺序。

20. **后台堆积**：`visibilitychange` 里 `clearInterval` 或改用 `document.hidden` 时暂停；或用 `setTimeout` 链式代替 `setInterval`；`Page Visibility API` 降频。

---

## daily0405（数组 / 对象 / 字符串）

1. **flat**：递归或栈，`depth` 递减，数组展开否则 `concat`。

2. **`[1, NaN, 3]`**。`map` 传 `(item, index, arr)` 给 `parseInt`，`parseInt(1,0)`→1，`parseInt(2,1)`→NaN，`parseInt(3,2)`→NaN（或按引擎：`parseInt(2,1)` 非法基数）。

   更准确：`parseInt('1',0)` 按 10 → 1；`parseInt('2',1)` 基数非法 → NaN；`parseInt('3',2)` 里 3 不是二进制数字 → NaN。故 **`[1, NaN, NaN]`**。

   再算：`parseInt(1,0)` 实际第二参为 0 时按 10；`parseInt(2,1)` NaN；`parseInt(3,2)` NaN。答案 **`[1, NaN, NaN]`**。

3. **`[...new Set(arr)]`** 或 `filter` + `Set` 保序。

4. **groupBy**：`reduce` 里 `const k = keyFn(item); (acc[k] ??= []).push(item)`。

5. **输出** `11` 与 `4`（稀疏数组 `length` 含空槽，`Object.keys` 只列已赋值下标）。

6. **深拷贝**：`WeakMap` 记循环引用；`Date` 复制时间戳；`Map`/`Set` 递归拷贝；函数/Symbol 常跳过或自定义。

7. **chunk**：`for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))`。

8. **浅拷贝**；嵌套对象**复制引用**。

9. **isEqual**：类型不同 false；数组逐项；对象同键递归；`NaN` 用 `Object.is`。

10. **render**：正则 `\$\{([^}]+)\}` 替换，`with(data)` 或 `new Function`（注意安全）或手动 `split`。

11. **码点迭代**：通常 **`5`**（👨 ZWJ 👩 ZWJ 👧 共 5 个码点）；勿与 UTF-16 `length` 混淆。

12. **LRU + Map**：`get` 时删再 `set` 维持顺序；超容量删 `map.keys().next().value`。

13. **Fisher–Yates**：从后往前 `j = random(i)` 交换。

14. **reviver**：`(k, v) => typeof v === 'string' && /^\d{4}-/.test(v) ? new Date(v) : v`。

15. **输出 `1`**（严格模式静默失败；非严格也失败不赋值）。

16. **pick**：`keys.reduce((o, k) => (k in obj && (o[k] = obj[k]), o), {})`；**omit**：`Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))`。

17. **最长公共前缀**：横向比首字符，或排序比首尾字符串。

18. **debounce**：延时合并；**throttle**：间隔内最多一次；**leading** 首次立即；**trailing** 结束后补一次。

19. **输出数字 `20`**（`'2'+1` → `'21'`，减号转数）。

20. **invert**：值作键时冲突可 `Record[key] = [...]` 数组收集多个原键。

---

## daily0406（函数式 / 工具）

1. **compose**：`(x) => fns.reduceRight((v, f) => f(v), x)`。

2. **pipe**：`(x) => fns.reduce((v, f) => f(v), x)`。

3. **curry**：递归或长度判断，凑够 `fn.length` 再调用。

4. **unary**：`(a) => fn(a)`。

5. **map/filter/reduce**：`for` 循环实现。

6. **flattenObject**：递归，键路径 `a.b`。

7. **throttle trailing**：`last` + `setTimeout` 在间隔结束后补发最后一次。

8. **debounce immediate**：首次 `call`，之后 `wait` 内只重置定时器。

9. **overload**：`switch(arguments.length)` 或 `typeof` 判断分发。

10. **composePromise**：`async (x) => { for (const f of asyncFns) x = await f(x); return x; }`。

11. **memoize + max**：Map + 淘汰最久未用或 FIFO。

12. **partialRight**：`(…left) => fn(...left, ...preset)`。

13. **zip**：`for (let i = 0; i < minLen; i++) out.push([a[i], b[i]])`。

14. **once** 同上；**before(n)**：计数 `< n` 执行否则 noop。

15. **noop** `() => {}`；**identity** `x => x`；用于默认参数、reduce 初值等。

16. **限流**：时间窗内计数，或用队列 + `setTimeout` 释放令牌。

17. **safeGet**：`path.split('.').reduce((o, k) => o?.[k], obj) ?? defaultValue`。

18. **二分**：`while (l <= r) mid = (l+r)>>1` 比较。

19. **纯函数**：相同入参相同出参、无副作用，如 `const double = x => x * 2`；**副作用**：`useEffect` 里请求、`setState` 等。

20. **Observable**：`{ subscribe(next) { ... return () => unsubscribe } }`，内部 `listeners` Set。

---

## daily0407（Proxy / Reflect / Symbol / Map-Set）

1. **reactive**：`new Proxy(obj, { set(t, k, v, r) { console.log(k, v); Reflect.set(...); return true; } })`（浅层只代理一层）。

2. **get**：读属性；**set**：写属性；**apply**：目标为函数且被调用。

3. **不报错**（赋值落到 target）；**读 `p.a` 始终为 `1`**（get 陷阱覆盖）。若严格问「target 上是否有 a」：有，值为 2，但代理读不到。

4. **Reflect.deleteProperty**、**Reflect.has**、**Reflect.defineProperty**。

5. **readonly**：`set`/`deleteProperty` 返回 `false` 或抛错；可配合 `Object.seal`。

6. **Object.keys 拿不到** Symbol 键；用 **`Object.getOwnPropertySymbols`** 或 **`Reflect.ownKeys`**。

7. **Symbol 单例**：闭包内 `const INSTANCE = Symbol()`；缺点：调试难、不可序列化。

8. **range 可迭代**：`{ [Symbol.iterator]() { let v = start; return { next: () => v <= end ? { value: v++, done: false } : { done: true } } } }`。

9. **Map**：任意键、插入顺序、**size**；**Object** 键主要为 string/symbol、无标准 size、有原型干扰。

10. **WeakMap 键必须为对象**；用于私有数据、DOM 节点映射、避免内存泄漏。

11. **输出 `1`**。`Map` 用 `SameValueZero`，`NaN` 与 `NaN` 相等。

12. **BiMap**：两个 Map `kToV`、`vToK`，`set` 时删旧映射。

13. **负索引 Proxy**：`get` 里若 `typeof key === 'string' && /^-\d+$/.test(key)` 映射到 `target[length + +key]`。

14. **Reflect.construct(target, args, newTarget)** 等价于 **`new newTarget(...args)`** 且原型由 `newTarget` 决定，用于子类实例化逻辑。

15. **hideProperty**：`Object.defineProperty(obj, key, { enumerable: false, writable: true, configurable: true })`。

16. **会重复**：`Set` 比引用，不比结构。

17. **observableArray**：`Proxy` 包装数组，`set` 拦截 `length` 或索引变化时 `notify`。

18. **`@@iterator` 即 `Symbol.iterator`**，规范内置符号。

19. **输出 `'{"a":2}'`**。`JSON.stringify` 忽略 Symbol 键。

20. **白名单**：`set` 里 `if (!whitelist.has(k)) throw` 或 `return false`。

---

## daily0408（迭代器 / Generator / 模块化）

1. **range**：见上，返回带 `[Symbol.iterator]` 的对象。

2. **`function*`** 同步迭代器；**`async function*`** 异步迭代器，`yield` 后可 `await`。

3. **输出** `[1, 2, 3, 4]`。

4. **fib generator**：`function* fib(n) { let a=0,b=1; for(let i=0;i<n;i++){ yield a; [a,b]=[b,a+b]; } }`。

5. **`yield` 的值**来自 **`generator.next(注入值)`** 的参数（上一次 `next` 传入的值给**上一次 `yield` 表达式整体**）。

6. **runGenerator**：`const it = gen(); function step(v) { const r = it.next(v); r.done ? resolve(r.value) : Promise.resolve(r.value).then(step, reject); }`。

7. **for await...of**：消费 **AsyncIterable**；`for await (const x of asyncGen()) { }`。

8. **ESM `live binding`**（导出是绑定）；**CJS `require` 得到拷贝**（基本类型）或**引用同一对象**（对象导出时属性可变）。

9. **`import()`** 返回 **`Promise<{...exports}>`**；代码分割、懒加载。

10. **不合法**：`export` 不能出现在块内。`sideEffects: false` 告诉打包工具可安全摇树；若有副作用模块需标 `sideEffects` 或路径。

11. **模块缓存**：`const cache = new Map(); function require(id) { if (cache.has(id)) return cache.get(id); const m = { exports: {} }; cache.set(id, m); runFactory(m.exports, m); return m.exports; }`。

12. **`return` 后**再 **`next()`** 得到 **`{ done: true, value: return的值 }`**，之后继续 `next` 仍为 `done: true`。

13. **zipIterables**：`function* () { const ia=a[Symbol.iterator](), ib=b[Symbol.iterator](); for(;;){ const na=ia.next(), nb=ib.next(); if(na.done||nb.done)break; yield [na.value,nb.value]; } }`。

14. **`Symbol.asyncIterator`**：对象实现 **`asyncIterator`** 方法返回 AsyncIterator，即可 **`for await`**。

15. **ESM 循环依赖**：可能得到**未初始化**的 live binding（TDZ）；**CJS** 可能拿到**不完整 exports**（部分 `undefined`）但仍能跑完。

16. **take**：`function* (it,n){ let i=0; for(const x of it){ if(i++>=n)break; yield x; } }`。

17. **中断**：`gen.return()` 或 `gen.throw()`，并 `break` 循环停止消费。

18. **顶层 await**：模块**异步执行**，依赖它的父模块**等待**其就绪后再求值。

19. **mergeSorted**：双指针 `yield` 较小者直到一方耗尽，再 `yield*` 剩余。

20. **中序 generator**：`function* inorder(node){ if(!node)return; yield* inorder(node.left); yield node.val; yield* inorder(node.right); }`。

---

## daily0409（类型 / 边界 / 安全）

1. **`typeof null`** → **`'object'`**；**`typeof NaN`** → **`'number'`**；**`Array.isArray(null)`** → **`false`**。

2. **`Object.is`** 与 **`===`** 不同：**`NaN`**、**`+0`/`-0`**。

3. **getType**：`Object.prototype.toString.call(x).slice(8,-1)` 转小写，或分支判 `null`/数组/Date。

4. **`false`**。浮点比较：`Math.abs(a-b) < EPS` 或 `Number.EPSILON` 缩放。

5. **`undefined`/函数** 在对象值里常被省略；**Symbol 键**被忽略；数组里 `undefined` 变 `null`（部分情况）。

6. **safeJSONParse**：`try { return JSON.parse(s); } catch { return fallback; }`。

7. **`parseInt('08')`** → **8**（现代无八进制歧义）；**`parseInt('1e2')`** → **1**；**`Number('1e2')`** → **100**。

8. **大整数**：用 **`BigInt`** 或字符串；比较与混运算需注意类型。

9. **`''`** 与 **`'[object Object]'`**。

10. **isPlainObject**：`Object.prototype.toString.call(o)==='[object Object]'` 且原型为 `Object.prototype` 或 `null`。

11. **XSS 防护**：**转义**、**textContent**、**CSP**、**DOMPurify**、禁止拼接 HTML。

12. **eval** 访问闭包与当前词法环境更危险；**new Function** 仍可能执行任意字符串，需白名单与 CSP。

13. **`'banana'`**（`+ 'a'` → `NaN`）。

14. **htmlEscape**：替换 `& < > " '` 为实体。

15. **structuredClone**：支持更多类型（`Map`/`Set`/部分循环引用），**不能克隆函数**；**JSON** 类型更窄。

16. **`Object.is(0,-0)`** 为 **false**；**`===`** 为 **true**（面试常考区分）。

17. **assert**：`if (!condition) throw new Error(msg)`。

18. **finally** 在 return 前**仍会执行**；**返回值**以 **finally 里若有 return 则覆盖**；否则 try/catch 的 return 先暂存，finally 后再提交。

19. **输出 `2`**。`await` 拒绝被 `catch` 捕获，返回 2。

20. **CSP**：缓解 **XSS**、部分 **注入**；例：`Content-Security-Policy: default-src 'self'; script-src 'self'`。

---

## daily0410（手写综合 / 小算法）

1. **twoSum**：哈希表 `need = target - nums[i]`。

2. **反转链表**：三指针 `prev/cur/next` 迭代。

3. **括号栈**：配对弹出，最后栈空。

4. **maxDepth**：`1 + max(left,right)` 或层序。

5. **爬楼梯**：`dp[i]=dp[i-1]+dp[i-2]`，或矩阵快速幂。

6. **合并有序数组（尾部空位）**：从**后往前**三指针，避免覆盖。

7. **快排**：`partition` 选基准，双指针交换，递归；或 `O(n log n)` 期望。

8. **topK 频率**：哈希计数 + 桶排序或小顶堆 `k` 个。

9. **LRU**：见 daily0405；`Map` + 顺序。

10. **minStack**：辅助栈存当前最小值。

11. **EventEmitter**：见 daily0402。

12. **parseQuery**：`URLSearchParams` 或 `split` + 解析，多值变数组。

13. **limitConcurrency**：维护运行数 `running`，队列 `next` 补位。

14. **deepMerge**：对象递归；**数组**常**替换**或按产品要求 **concat**。

15. **formatBytes**：循环除 1024，`['B','KB',...]`。

16. **基数排序**：按位桶分配，**非比较**、整数且范围适中时 `O(d·n)`。

17. **LIS 长度**：`tails` 数组 + 二分，`tails[i]` 为长 `i+1` 链最小末尾。

18. **schedule**：`delayOrder.reduce((p, d) => p.then(() => new Promise(r => setTimeout(r, d))).then(() => task()), Promise.resolve())`。

19. **simpleDiff**：`keys(a)` vs `keys(b)` 集合差。

20. **tinyTemplate**：正则 `{{(.*?)}}`，`path.split('.').reduce((o,k)=>o?.[k], data)`。

---

*题面文件：`daily0401.js` … `daily0410.js`*
