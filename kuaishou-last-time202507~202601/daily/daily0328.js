/**
 * daily0328.js
 * 考察：React Redux 串联口述、常见 Hooks 要点、this / 闭包 / 异步时序（输出题 + 解析）
 * 可与 daily0327.js、daily0326.js 对照阅读
 */

// ============================================================
// 一、Redux 与 React 结合（面试口述要点）
// ============================================================
//
// 1) store = createStore(reducer) → getState / dispatch / subscribe
// 2) Provider 把 store 放进 Context
// 3) 组件用 useSyncExternalStore(store.getState, store.subscribe) 或手写 subscribe + forceUpdate
// 4) combineReducers 把多个 slice reducer 合成 rootReducer
// 5) middleware：dispatch 链 compose，典型 thunk（函数 action）与 promise
//

// ============================================================
// 二、常见 Hooks 面试要点（实现见 daily0327 / daily0326）
// ============================================================
//
// - useState：闭包保存 state，setState 入队，下次 render 合并
// - useEffect：依赖数组浅比较，清理函数在下次 effect 前与卸载时执行
// - useMemo / useCallback：缓存依赖不变时的值/函数引用
// - useRef：可变容器，不触发重渲染；useEvent 用 ref 存最新 fn
// - useLayoutEffect：DOM 提交后同步执行，先于浏览器绘制
//

// ============================================================
// 三、this 指向题
// ============================================================

function demoThis() {
  const o = { name: 'o', fn() { return this.name; } };
  const f = o.fn;
  // console.log(o.fn()); // 'o'
  // console.log(f());    // 非严格：window/global；严格：undefined → 报错或 undefined
}

const obj2 = {
  a: 1,
  b() {
    return function () {
      return this.a;
    };
  },
  c() {
    return () => this.a;
  },
};
// const x = obj2.b(); console.log(x()); // 独立调用，this 非 obj2 → undefined（无 a）
// const y = obj2.c(); console.log(y()); // 箭头继承 c 的 this → 1

// ============================================================
// 四、闭包题（var / let 与异步）
// ============================================================

function loopVar() {
  const out = [];
  for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log('var i', i), 0);
  }
  // 输出：3, 3, 3（同一 i，结束时 i=3）
}

function loopLet() {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log('let i', i), 0);
  }
  // 输出：0, 1, 2（每次循环块级 i）
}

// ============================================================
// 五、异步时序题（经典输出顺序）
// ============================================================

function asyncOrder() {
  console.log('1');

  setTimeout(() => console.log('2'), 0);

  Promise.resolve().then(() => console.log('3'));

  console.log('4');

  // 浏览器：1 → 4 → 3 → 2
  // 同步先执行；微任务 3 在宏任务 2 之前
}

function asyncOrder2() {
  async function main() {
    console.log('A');
    await Promise.resolve();
    console.log('B');
  }
  main();
  console.log('C');
  // A → C → B（await 后代码进微任务，C 先同步打印）
}

// ============================================================
// 六、Redux 与组件闭包（易错）
// ============================================================
//
// 在 subscribe 回调里若用 props 而不从 getState() 取最新值，会得到陈旧闭包。
// 解决：useSelector 从 store 读；或 ref 存最新 props；或 useSyncExternalStore。
//

module.exports = {
  demoThis,
  loopVar,
  loopLet,
  asyncOrder,
  asyncOrder2,
  obj2,
};
