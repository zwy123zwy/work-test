/**
 * typeof 操作符对不同数据类型的返回结果
 */

console.log('=== JavaScript 中 typeof 操作符的返回结果 ===');

// 1. Number 类型
let num = 10;
console.log(`typeof ${num}:`, typeof num); // "number"

// 2. String 类型
let str = "hello";
console.log(`typeof "${str}":`, typeof str); // "string"

// 3. Boolean 类型
let bool = true;
console.log(`typeof ${bool}:`, typeof bool); // "boolean"

// 4. Undefined 类型
let emptyIsUndefined;
console.log('typeof emptyIsUndefined:', typeof emptyIsUndefined); // "undefined"

// 5. Object 类型 (包括普通对象、数组等)
let obj = {};
console.log('typeof {}:', typeof obj); // "object"
let arr = [1, 2, 3];
console.log('typeof []:', typeof arr); // "object"

// 6. Function 类型
function myFunc() {}
console.log('typeof function:', typeof myFunc); // "function"
let arrowFunc = () => {};
console.log('typeof arrow function:', typeof arrowFunc); // "function"

// 7. Symbol 类型 (ES6 新增)
let sym = Symbol('test');
console.log('typeof Symbol:', typeof sym); // "symbol"

// 8. BigInt 类型 (ES2020 新增)
let bigIntNum = 123n;
console.log('typeof BigInt:', typeof bigIntNum); // "bigint"

console.log('\n=== 特殊情况：null ===');
// 特别注意：这是 JavaScript 的一个历史遗留问题
let nullValue = null;
console.log('typeof null:', typeof null); // "object" (这是一个历史错误，但无法修复，因为会破坏现有代码)

console.log('\n=== 总结 ===');
console.log('typeof 对以下类型返回的字符串值：');
console.log('- Number -> "number"');
console.log('- String -> "string"');
console.log('- Boolean -> "boolean"');
console.log('- Undefined -> "undefined"');
console.log('- Null -> "object" (特殊/错误的情况)');
console.log('- Object (包括数组和普通对象) -> "object"');
console.log('- Function -> "function"');
console.log('- Symbol -> "symbol"');
console.log('- BigInt -> "bigint"');