/**
 * daily0409.js — JS 面试代码题 20 道（类型 / 边界 / 安全）
 * 题后 // 答：… 为参考答案。
 */

// 1. typeof null、typeof NaN、Array.isArray(null) 各是什么？
// 答：'object'、'number'、false。

// 2. Object.is 与 === 在哪些值上结果不同？
// 答：NaN 与 NaN；+0 与 -0。

// 3. 手写类型判断：getType(x) 返回 'null' | 'array' | 'date' | 'object' 等。
// 答：Object.prototype.toString.call(x).slice(8,-1).toLowerCase() 再特判。

// 4. 下面输出什么？
// console.log(0.1 + 0.2 === 0.3);
// 如何安全比较两个浮点数？
// 答：false。用 Math.abs(a-b)<EPS 或 Number.EPSILON 缩放比较。

// 5. JSON.stringify 遇到 undefined、function、Symbol 键会怎样？
// 答：对象里 undefined/函数常被省略；Symbol 键被忽略；数组 undefined 变 null。

// 6. 手写 safeJSONParse(str, fallback)。
// 答：try { return JSON.parse(str); } catch { return fallback; }

// 7. parseInt('08')、parseInt('1e2')、Number('1e2') 的结果？
// 答：8、1（在 e 处停止）、100。

// 8. 大整数精度问题：超过 Number.MAX_SAFE_INTEGER 时应注意什么？（BigInt）
// 答：精度丢失；用 BigInt 或字符串运算，勿与 Number 混算不加转换。

// 9. 下面输出什么？
// console.log([] + []);
// console.log([] + {});
// 答：'' 与 '[object Object]'。

// 10. 手写 isPlainObject(obj)。
// 答：toString 为 [object Object] 且原型为 Object.prototype 或 null。

// 11. XSS：innerHTML 插入用户内容如何防护？（思路）
// 答：转义、textContent、CSP、DOMPurify、禁止拼接 HTML。

// 12. eval 与 new Function 的风险对比。
// 答：eval 访问词法作用域更危险；两者都可执行任意代码，需 CSP 与白名单策略。

// 13. 下面输出什么？
// console.log('b' + 'a' + + 'a' + 'a').toLowerCase();
// 答：'banana'（+ 'a' 得 NaN）。

// 14. 手写 htmlEscape(str)，转义 < > & " '。
// 答：replace 映射到 &lt; &gt; &amp; &quot; &#39;。

// 15. structuredClone 与 JSON 深拷贝的能力边界？
// 答：structuredClone 支持更多内置类型与循环引用，不可克隆函数；JSON 更窄。

// 16. 0、-0、Object.is 的关系？
// 答：=== 认为 +0 与 -0 相等；Object.is 区分二者。

// 17. 手写 assert(condition, msg)，失败 throw。
// 答：if (!condition) throw new Error(msg)。

// 18. try/finally 里 return：finally 何时执行？返回值以谁为准？
// 答：finally 在 return 抛出前执行；若 finally 有 return 会覆盖 try/catch 的返回值。

// 19. 下面输出什么？
// async function f() {
//   try { return await Promise.reject(1); } catch (e) { return 2; }
// }
// f().then(console.log);
// 答：2。await reject 被 catch，返回 2。

// 20. Content Security Policy 能缓解哪些攻击？举一条指令例子。
// 答：缓解 XSS 等；例：Content-Security-Policy: default-src 'self';
