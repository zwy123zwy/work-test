/**
 * daily0405.js — JS 面试代码题 20 道（数组 / 对象 / 字符串）
 * 题后 // 答：… 为参考答案。
 */

// 1. 手写 flat(arr, depth)。
// 答：递归或 reduce，depth<=0 返回切片；元素为数组则递归否则 concat。

// 2. [1,2,3].map(parseInt) 的结果与原因？
// 答：[1, NaN, NaN]。map 传 (item,index) 给 parseInt：parseInt('1',0)→1；parseInt('2',1)→NaN；parseInt('3',2)→NaN。

// 3. 手写 unique(arr)，去重并保持首次出现顺序。
// 答：[...new Set(arr)] 或 filter + Set。

// 4. 实现 groupBy(arr, keyFn)，返回 Record<key, item[]>。
// 答：reduce 里 const k=keyFn(item); (acc[k]??=[]).push(item)。

// 5. 下面输出什么？
// const a = [1, 2, 3];
// a[10] = 10;
// console.log(a.length, Object.keys(a).length);
// 答：11 和 4。length 含空槽；keys 只有 0,1,2,10。

// 6. 手写深拷贝（说明循环引用与 Date/Map 的处理策略）。
// 答：WeakMap 记录已拷贝对象破环；Date 拷贝时间戳；Map/Set 递归；函数/Symbol 常跳过。

// 7. 实现 chunk(arr, size)，如 [1,2,3,4],2 -> [[1,2],[3,4]]。
// 答：for (i=0;i<len;i+=size) push slice(i,i+size)。

// 8. Object.assign 是深拷贝还是浅拷贝？嵌套对象被如何拷贝？
// 答：浅拷贝；嵌套只拷引用。

// 9. 手写 isEqual(a, b) 比较对象/数组（不考虑函数）。
// 答：类型一致；数组逐项；对象同键递归；NaN 用 Object.is。

// 10. 实现模板字符串解析：render('Hi ${name}', { name: 'Tom' })。
// 答：正则 \$\{([^}]+)\} 替换为 data[key.trim()]。

// 11. 下面输出什么？
// console.log([...'👨‍👩‍👧'].length);
// 答：一般为 5（按 Unicode 码点迭代，ZWJ 家族 emoji）；勿与 string.length（UTF-16 单元）混淆。

// 12. 手写 LRU（get/put），容量为 k，均 O(1)（可用 Map）。
// 答：Map 保插入顺序；get 时 delete 再 set 挪到末尾；超容量删 map.keys().next().value。

// 13. 实现 shuffle(arr) 洗牌（Fisher–Yates）。
// 答：从末往前 random(i..n-1) 交换。

// 14. 手写 JSON.parse 的 reviver 使用场景举例（日期字符串转 Date）。
// 答：JSON.parse(str, (k,v)=> /^\d{4}-\d{2}-\d{2}/.test(v)?new Date(v):v)。

// 15. 下面输出什么？
// const o = { a: 1 };
// Object.freeze(o);
// o.a = 2;
// console.log(o.a);
// 答：1。冻结后赋值失败（严格模式会抛错，非严格静默）。

// 16. 实现 pick(obj, keys) 与 omit(obj, keys)。
// 答：pick：只拷 keys 存在项；omit：entries 过滤掉 keys。

// 17. 手写 longestCommonPrefix(strs: string[])。
// 答：以首串为基准逐字符比较，或排序后比首尾。

// 18. 实现 debounce(fn, wait) 与 throttle(fn, wait)（带 leading/trailing 说明）。
// 答：debounce 合并多次；throttle 间隔内最多一次；leading 首次立即；trailing 结束后补一次。

// 19. 下面输出什么？
// const s = '2' + 1 - 1;
// console.log(s);
// 答：20（数字）。'2'+1='21'，'21'-1 数值运算得 20。

// 20. 实现 invert(obj)，键值互换（值需可作为对象键，说明冲突处理）。
// 答：值作 key，冲突时用数组收集多个原 key 或后者覆盖并文档说明。
