// 引入包含MySplice实现的文件
require('./0130/0130.js');

console.log('=== 测试 MySplice 方法 ===');

// 测试1: 删除指定数量的元素
let arr1 = [1, 2, 3, 4, 5];
let deleted1 = arr1.MySplice(2, 2);
console.log('原数组: [1, 2, 3, 4, 5]');
console.log('arr1.MySplice(2, 2)');
console.log('删除的元素:', deleted1); // [3, 4]
console.log('修改后的数组:', arr1); // [1, 2, 5]

console.log();

// 测试2: 删除元素并插入新元素
let arr2 = [1, 2, 3, 4, 5];
let deleted2 = arr2.MySplice(1, 2, 'a', 'b');
console.log('原数组: [1, 2, 3, 4, 5]');
console.log('arr2.MySplice(1, 2, "a", "b")');
console.log('删除的元素:', deleted2); // [2, 3]
console.log('修改后的数组:', arr2); // [1, 'a', 'b', 4, 5]

console.log();

// 测试3: 只插入元素，不删除任何元素
let arr3 = [1, 2, 3];
let deleted3 = arr3.MySplice(1, 0, 'x', 'y');
console.log('原数组: [1, 2, 3]');
console.log('arr3.MySplice(1, 0, "x", "y")');
console.log('删除的元素:', deleted3); // []
console.log('修改后的数组:', arr3); // [1, 'x', 'y', 2, 3]

console.log();

// 测试4: 使用负数索引
let arr4 = [1, 2, 3, 4, 5];
let deleted4 = arr4.MySplice(-2, 1, 'new');
console.log('原数组: [1, 2, 3, 4, 5]');
console.log('arr4.MySplice(-2, 1, "new")');
console.log('删除的元素:', deleted4); // [4]
console.log('修改后的数组:', arr4); // [1, 2, 3, 'new', 5]

console.log();

// 测试5: 不提供deleteCount参数
let arr5 = [1, 2, 3, 4, 5];
let deleted5 = arr5.MySplice(2);
console.log('原数组: [1, 2, 3, 4, 5]');
console.log('arr5.MySplice(2)');
console.log('删除的元素:', deleted5); // [3, 4, 5]
console.log('修改后的数组:', arr5); // [1, 2]

console.log();

// 与原生splice方法对比测试
console.log('=== 与原生splice方法对比 ===');
let arr6 = [1, 2, 3, 4, 5];
let arr7 = [1, 2, 3, 4, 5];

let nativeResult = arr6.splice(1, 2, 'native');
let myResult = arr7.MySplice(1, 2, 'my');

console.log('原生splice结果:', nativeResult, '数组变为:', arr6);
console.log('我的splice结果:', myResult, '数组变为:', arr7);
console.log('结果相同:', JSON.stringify(nativeResult) === JSON.stringify(myResult) && 
           JSON.stringify(arr6) === JSON.stringify(arr7));