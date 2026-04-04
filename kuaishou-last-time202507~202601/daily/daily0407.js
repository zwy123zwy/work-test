/**
 * daily0407.js — JS 面试代码题 20 道（Proxy / Reflect / Symbol / Map-Set）
 * 题后 // 答：… 为参考答案。
 */

// 1. 手写 reactive(obj)：用 Proxy 实现浅层响应式，set 时打印变化。
// 答：new Proxy(obj,{ set(t,k,v,r){ console.log(k,v); return Reflect.set(t,k,v,r); }})（仅一层）。

// 2. Proxy 的 handler 里 get / set / apply 分别何时触发？
// 答：读属性；写属性；目标为函数且被调用。

// 3. 下面会报错吗？
// const p = new Proxy({}, { get() { return 1; } });
// p.a = 2;
// console.log(p.a);
// 答：一般不报错；打印 1（get 陷阱始终返回 1，掩盖 target 上的值）。

// 4. 用 Reflect 改写：删除属性、判断存在、定义属性各用什么 API？
// 答：deleteProperty、has、defineProperty。

// 5. 手写 readonly(obj)：禁止 set、禁止增删键（思路即可）。
// 答：Proxy set/deleteProperty 返回 false 或抛错；或 Object.freeze。

// 6. Symbol 作为对象属性键时，Object.keys 能拿到吗？如何遍历？
// 答：不能。用 Object.getOwnPropertySymbols 或 Reflect.ownKeys。

// 7. 实现单例用 Symbol('singleton') 做私有标记，说明优缺点。
// 答：闭包内 const S=Symbol() 挂实例；缺点调试/序列化不友好。

// 8. 手写迭代器：让对象 { start:1, end:3 } 可用 for...of。
// 答：[Symbol.iterator](){ let v=start; return { next:()=>v<=end?{value:v++,done:false}:{done:true}} }

// 9. Map 与 Object 作为哈希表的主要区别（键类型、顺序、大小）。
// 答：Map 任意键、插入顺序、size；Object 键多为 string/symbol、无标准 size。

// 10. WeakMap 的键有什么限制？典型使用场景？
// 答：必须为对象；DOM 元数据、私有字段、避免循环引用内存泄漏。

// 11. 下面输出什么？
// const m = new Map();
// m.set(NaN, 1);
// console.log(m.get(NaN));
// 答：1。SameValueZero 下 NaN 可匹配。

// 12. 手写双向映射：BiMap set/get/delete（key<->value 唯一）。
// 答：两个 Map kToV 与 vToK，set 时清理旧映射。

// 13. Proxy 实现数组「负索引」访问，如 arr[-1] 表示最后一个元素。
// 答：get 里解析负数字符串键映射到 target[length+idx]。

// 14. Reflect.construct 与 new 的关系？
// 答：Reflect.construct(Ctor, args, newTarget) 类似以 newTarget 为原型执行 new。

// 15. 手写 hideProperty(obj, key)，外部不可枚举但可读写（defineProperty）。
// 答：enumerable:false, writable:true, configurable:true。

// 16. Set 去重对象引用：两个内容相同的不同对象会重复吗？
// 答：会，Set 比引用不比结构。

// 17. 实现 observableArray：push 时触发监听（Proxy 包一层）。
// 答：Proxy set 拦截 length 或索引，调用回调。

// 18. Symbol.iterator 与 @@iterator 是什么关系？
// 答：@@iterator 即规范中对 Symbol.iterator 的称呼。

// 19. 下面输出什么？
// const sym = Symbol('x');
// const o = { [sym]: 1, a: 2 };
// console.log(JSON.stringify(o));
// 答：'{"a":2}'。Symbol 键被 JSON 忽略。

// 20. 用 Proxy 实现「只允许白名单字段写入」的 validator 对象。
// 答：set 陷阱：若 key 不在 Set 白名单则 throw 或 return false。
