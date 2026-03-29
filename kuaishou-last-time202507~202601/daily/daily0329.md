# 中文互联网常见面试手写 / 输出题（daily0329）

> 四个专题，每专题 10 题：**手写代码** 与 **输出判断** 混合。答案附于每题下方折叠区可自行遮挡练习。
>
> **JS 数据版拆分**：`daily03291.js`～`daily03294.js` 各对应专题一至四；`daily0329.js` 为汇总入口（`require('./daily0329.js')` 得全部 40 题）。每题对象含 **`solution`**：由 `daily0329-utils.js` 合并 `answerOutput`（若有）、`answer`、`answerCode`（若有）为一段完整参考答案文本。

---

## 专题一：JavaScript 核心（作用域、this、原型、类型）

### 1.1【输出】下面打印顺序与最终 `a` 的值？

```js
var a = 1;
function f() {
  console.log(a);
  var a = 2;
  console.log(a);
}
f();
console.log(a);
```

<details><summary>参考答案要点</summary>

- `f` 内第一个 `console.log(a)` 为 `undefined`（变量提升，尚未赋值）。
- 第二个为 `2`。
- 外层 `console.log(a)` 为 `1`（函数内 `var a` 是局部变量）。

</details>

### 1.2【手写】实现 `myInstanceof(left, right)`，判断 `left` 的原型链上是否出现 `right.prototype`。

<details><summary>参考答案要点</summary>

```js
function myInstanceof(left, right) {
  let p = Object.getPrototypeOf(left);
  while (p) {
    if (p === right.prototype) return true;
    p = Object.getPrototypeOf(p);
  }
  return false;
}
```

</details>

### 1.3【输出】严格模式下结果？

```js
'use strict';
const o = { x: 1, m() { return this.x; } };
const g = o.m;
console.log(o.m());
console.log(g());
```

<details><summary>参考答案要点</summary>

- `o.m()` → `1`
- `g()` → `TypeError`（严格模式独立调用，this 为 undefined）

</details>

### 1.4【手写】实现 `Object.create` 的 polyfill（只考虑 `proto` 为对象或 `null`）。

<details><summary>参考答案要点</summary>

```js
function myCreate(proto) {
  if (proto !== null && (typeof proto !== 'object' && typeof proto !== 'function')) {
    throw new TypeError();
  }
  function F() {}
  F.prototype = proto;
  return new F();
}
```

</details>

### 1.5【输出】以下输出什么？

```js
console.log(typeof null);
console.log([] + []);
console.log([] + {});
console.log({} + []);
```

<details><summary>参考答案要点</summary>

- `typeof null` → `'object'`（历史遗留）
- `[] + []` → `''`
- `[] + {}` → `'[object Object]'`
- `{} + []` 在语句开头可能被解析为代码块 + `+[]`，常见结果为 `0`（浏览器控制台需注意是否自动加分号）

</details>

### 1.6【手写】实现浅拷贝函数 `shallowCopy(obj)`。

<details><summary>参考答案要点</summary>

```js
function shallowCopy(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.slice();
  return { ...obj };
}
```

</details>

### 1.7【输出】打印结果？

```js
let x = { n: 1 };
const y = x;
x = { n: 2 };
console.log(y.n);
x.n = 3;
console.log(y.n);
```

<details><summary>参考答案要点</summary>

- 第一次：`1`（`x` 指向新对象，`y` 仍指向 `{n:1}`）
- 第二次：仍是 `1`（`y` 与新的 `x` 无关）

</details>

### 1.8【手写】实现 `Array.prototype.flat` 的简化版 `flat(arr, depth = 1)`。

<details><summary>参考答案要点</summary>

```js
function flat(arr, depth = 1) {
  if (depth <= 0) return arr.slice();
  return arr.reduce((acc, cur) => acc.concat(Array.isArray(cur) ? flat(cur, depth - 1) : cur), []);
}
```

</details>

### 1.9【输出】`Promise` 相关输出顺序？

```js
Promise.resolve().then(() => console.log('A'));
console.log('B');
setTimeout(() => console.log('C'), 0);
Promise.resolve().then(() => console.log('D'));
console.log('E');
```

<details><summary>参考答案要点</summary>

- 同步：`B`、`E`
- 微任务：`A`、`D`
- 宏任务：`C`
- 顺序：`B E A D C`

</details>

### 1.10【手写】实现 `compose(f, g, h)(x)` 等价于 `f(g(h(x)))` 的 `compose(...fns)`。

<details><summary>参考答案要点</summary>

```js
function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}
```

</details>

---

## 专题二：异步、事件循环、Promise、工程向

### 2.1【输出】完整输出顺序？

```js
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
queueMicrotask(() => console.log(4));
console.log(5);
```

<details><summary>参考答案要点</summary>

- 同步：`1`、`5`
- 微任务：`queueMicrotask` 与 `then` 同属微任务队列，按入队顺序：若先 `then` 再 `microtask`，需看规范；本题一般：`3`、`4` 或 `4`、`3`（实现相关，面试答清：微任务先于宏任务 `2`）。
- 宏任务：`2`
- 常见：`1 5 3 4 2`（Promise.then 先于 queueMicrotask 入队则 3 先于 4；以运行环境为准，面试说明微任务批次即可）。

</details>

### 2.2【手写】实现 `Promise.all`（失败则 reject，全部成功 resolve 数组）。

<details><summary>参考答案要点</summary>

```js
function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const arr = Array.from(iterable);
    if (arr.length === 0) return resolve([]);
    const res = [];
    let count = 0;
    arr.forEach((p, i) => {
      Promise.resolve(p).then(
        (v) => {
          res[i] = v;
          count++;
          if (count === arr.length) resolve(res);
        },
        reject
      );
    });
  });
}
```

</details>

### 2.3【输出】`async/await` 输出？

```js
async function a() {
  console.log('a1');
  await Promise.resolve();
  console.log('a2');
}
console.log('s');
a();
console.log('e');
```

<details><summary>参考答案要点</summary>

- `s`、`a1`、`e`（同步），然后微任务 `a2`
- 顺序：`s a1 e a2`

</details>

### 2.4【手写】实现带并发上限的 `pMapLimit(items, limit, mapper)`，返回与 `items` 顺序一致的结果数组。

<details><summary>参考答案要点</summary>

```js
async function pMapLimit(items, limit, mapper) {
  const ret = [];
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++;
      ret[idx] = await mapper(items[idx], idx);
    }
  });
  await Promise.all(workers);
  return ret;
}
```

</details>

### 2.5【输出】以下打印？

```js
let i = 0;
const id = setInterval(() => {
  console.log(i++);
  if (i > 2) clearInterval(id);
}, 0);
console.log('x');
```

<details><summary>参考答案要点</summary>

- 先同步 `x`，再多次宏任务回调；`i` 从 0 递增；具体次数与 `clearInterval` 时机有关，面试重点：**setInterval 为宏任务**，晚于同步代码。

</details>

### 2.6【手写】实现 `retry(fn, times)`：`fn` 返回 Promise，失败重试最多 `times` 次。

<details><summary>参考答案要点</summary>

```js
async function retry(fn, times) {
  let err;
  for (let i = 0; i < times; i++) {
    try {
      return await fn();
    } catch (e) {
      err = e;
    }
  }
  throw err;
}
```

</details>

### 2.7【输出】`fetch` 与顺序（假设网络成功且返回 json）？

```js
console.log(1);
fetch('/').then(() => console.log(2));
console.log(3);
```

<details><summary>参考答案要点</summary>

- `1`、`3` 同步；`fetch` 回调为微任务或任务队列实现相关，**then 在微任务**；顺序：`1 3 2`（2 在微任务）。

</details>

### 2.8【手写】实现 `debounce(fn, wait)` 防抖。

<details><summary>参考答案要点</summary>

```js
function debounce(fn, wait) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}
```

</details>

### 2.9【输出】`requestAnimationFrame` 与 `setTimeout(0)` 谁先？

```js
setTimeout(() => console.log('T'), 0);
requestAnimationFrame(() => console.log('R'));
console.log('S');
```

<details><summary>参考答案要点</summary>

- 同步先 `S`；`rAF` 在刷新前，`setTimeout` 为宏任务；通常一帧内：`S` →（下一帧或同帧末）`R` → `T`（具体以浏览器调度为准，面试答：**渲染相关 rAF，宏任务批次不同**）。

</details>

### 2.10【手写】实现 `JSON.stringify` 的极简子集（只处理对象、数组、字符串、数字、布尔、null，忽略循环引用）。

<details><summary>参考答案要点</summary>

```js
function jsonStringify(val) {
  if (val === null) return 'null';
  const t = typeof val;
  if (t === 'number' || t === 'boolean') return String(val);
  if (t === 'string') return '"' + val.replace(/"/g, '\\"') + '"';
  if (Array.isArray(val)) return '[' + val.map(jsonStringify).join(',') + ']';
  if (t === 'object') {
    const keys = Object.keys(val);
    return '{' + keys.map((k) => '"' + k + '":' + jsonStringify(val[k])).join(',') + '}';
  }
}
```

</details>

---

## 专题三：React、Hooks、性能、状态

### 3.1【输出】以下组件首次渲染后，`useEffect` 里打印的 `count`？（React 18 严格模式开发下可能双调用，说明即可）

```js
function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(count);
    setCount(1);
  }, []);
  return null;
}
```

<details><summary>参考答案要点</summary>

- 首次 effect 运行时 `count` 为 `0`；`setCount(1)` 触发更新后若再跑 effect（依赖 [] 不变则不再跑），仅首次打印 `0`。

</details>

### 3.2【手写】实现 `usePrevious(value)`：返回上一次渲染的 `value`。

<details><summary>参考答案要点</summary>

```js
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

</details>

### 3.3【判断】`useMemo` 能否避免子组件重渲染？说明条件。

<details><summary>参考答案要点</summary>

- 不能单靠 `useMemo`；需子组件 `React.memo` 且 props 引用相等，或 `useCallback` 稳定回调；`useMemo` 只缓存**本组件**计算结果。

</details>

### 3.4【手写】实现简易 Context + `useReducer` 的 `dispatch` 透传（伪代码即可）。

<details><summary>参考答案要点</summary>

```jsx
const Ctx = createContext(null);
function Provider({ reducer, initialState, children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
```

</details>

### 3.5【输出】点击按钮后打印？

```js
function X() {
  const [n, setN] = useState(0);
  const click = () => {
    setN(n + 1);
    setN(n + 1);
    setN(n + 1);
  };
  return <button onClick={click}>{n}</button>;
}
```

<details><summary>参考答案要点</summary>

- 三次 `setN` 基于**同一闭包 n**，批量更新合并为一次：`n` 仍为 `0+1=1`，最终显示 `1`。

</details>

### 3.6【手写】实现 `useUpdateEffect`：跳过首次挂载，仅在依赖变化时执行 `effect`。

<details><summary>参考答案要点</summary>

```js
function useUpdateEffect(effect, deps) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    return effect();
  }, deps);
}
```

</details>

### 3.7【判断】`key` 在列表中的作用？用索引作 `key` 的风险？

<details><summary>参考答案要点</summary>

- 标识同一节点身份，优化 diff；**索引作 key** 在列表重排/插入时会导致错误复用状态、动画错乱。

</details>

### 3.8【手写】Redux `combineReducers` 的输入输出说明 + 10 行内伪代码。

<details><summary>参考答案要点</summary>

- 输入：`{ sliceA: reducerA, sliceB: reducerB }`；输出：`(state, action) => ({ sliceA: reducerA(state.sliceA, action), ... })`。

</details>

### 3.9【输出】`flushSync`（若了解）或说明：`setState` 在 `useEffect` 内连续调用与渲染次数？

<details><summary>参考答案要点</summary>

- React 18 自动批处理：同一事件/同一 effect 内多次 `setState` 通常合并为一次渲染（具体以版本与场景为准）。

</details>

### 3.10【手写】自定义 Hook：`useLocalStorage(key, initialValue)`，同步 `localStorage`。

<details><summary>参考答案要点</summary>

```js
function useLocalStorage(key, initial) {
  const [v, setV] = useState(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? JSON.parse(s) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(v));
  }, [key, v]);
  return [v, setV];
}
```

</details>

---

## 专题四：算法与手写数据结构（前端高频）

### 4.1【手写】实现函数 `flatten(arr)` 将嵌套数组打平一层（或指定深度，二选一说明）。

<details><summary>参考答案要点</summary>

- 见 1.8 `flat`；或递归 `concat`。

</details>

### 4.2【输出】下面快排一次划分后（以第一个元素为 pivot），数组形态示例题？

```js
// 数组 [3,1,4,1,5] 以 3 为 pivot 的一次 partition 结果（面试口述即可）
```

<details><summary>参考答案要点</summary>

- 将 `<3` 放左，`>=3` 放右，结果不唯一；考察 partition 思路即可。

</details>

### 4.3【手写】实现 `LRUCache` 类：`get(key)` / `put(key,value)`，容量 `cap`，O(1) 均摊（Map + 双向链表或 Map 保序）。

<details><summary>参考答案要点</summary>

- 面试常用：`Map` 插入顺序 + 删除最前实现 LRU；或手写双向链表 + HashMap。

</details>

### 4.4【手写】判断二叉树是否对称（递归或迭代）。

<details><summary>参考答案要点</summary>

```js
function isSymmetric(root) {
  function eq(a, b) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.val === b.val && eq(a.left, b.right) && eq(a.right, b.left);
  }
  return root ? eq(root.left, root.right) : true;
}
```

</details>

### 4.5【输出】`[1,2,3].sort()` 结果？`[1,11,2].sort()`？

<details><summary>参考答案要点</summary>

- 默认**字典序**字符串排序：`[1,11,2]` → `[1,11,2]` 非数值序；需 `sort((a,b)=>a-b)`。

</details>

### 4.6【手写】实现 `deepClone` 简易版（处理对象、数组，不考虑循环引用可用 `WeakMap` 解决）。

<details><summary>参考答案要点</summary>

```js
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (map.has(obj)) return map.get(obj);
  if (Array.isArray(obj)) {
    const c = [];
    map.set(obj, c);
    obj.forEach((v, i) => (c[i] = deepClone(v, map)));
    return c;
  }
  const c = {};
  map.set(obj, c);
  for (const k of Object.keys(obj)) c[k] = deepClone(obj[k], map);
  return c;
}
```

</details>

### 4.7【手写】二分查找：有序数组中找 `target` 下标，无则返回 `-1`。

<details><summary>参考答案要点</summary>

```js
function binarySearch(arr, t) {
  let lo = 0,
    hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === t) return mid;
    if (arr[mid] < t) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
```

</details>

### 4.8【输出】判断：`JSON.parse(JSON.stringify(obj))` 深拷贝的缺陷（举 3 类）。

<details><summary>参考答案要点</summary>

- `undefined`、函数、`Symbol`、循环引用丢失或失败；`Date` 变字符串；`Map/Set` 不支持等。

</details>

### 4.9【手写】实现 `throttle(fn, wait)` 节流（leading 即可）。

<details><summary>参考答案要点</summary>

```js
function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}
```

</details>

### 4.10【手写】将扁平列表转为树：`[{ id, parentId, name }]` → 根节点数组，子节点挂 `children`。

<details><summary>参考答案要点</summary>

```js
function listToTree(list) {
  const map = new Map();
  list.forEach((n) => map.set(n.id, { ...n, children: [] }));
  const roots = [];
  list.forEach((n) => {
    const node = map.get(n.id);
    if (n.parentId == null) roots.push(node);
    else map.get(n.parentId)?.children.push(node);
  });
  return roots;
}
```

</details>

---

## 使用说明

- **输出题**：先闭卷写出顺序/结果，再展开 `<details>` 对照。
- **手写题**：限时 10～15 分钟，再对照要点补全边界（参数校验、边界条件）。
- 若需 **纯 JS 文件版**（无 Markdown），可把本题拆成 `daily0329-data.js` 用注释导出题目字符串。
