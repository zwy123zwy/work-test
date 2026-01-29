// 正确的Promise嵌套和链式调用示例

console.log("=== 嵌套Promise示例 ===");

// 1. 在then中返回另一个Promise
const promise1 = Promise.resolve("初始值");

promise1
  .then(value => {
    console.log("第一层:", value);
    // 返回另一个Promise
    return new Promise(resolve => {
      setTimeout(() => {
        resolve("来自嵌套Promise的值");
      }, 100);
    });
  })
  .then(value => {
    console.log("第二层(来自嵌套):", value);
    return value + " -> 继续处理";
  })
  .then(value => {
    console.log("第三层:", value);
  });

console.log("\n=== 在then中返回Promise.resolve ===");

// 2. 在then中返回Promise.resolve
const promise2 = Promise.resolve("另一个初始值");

promise2
  .then(value => {
    console.log("第一层:", value);
    // 返回Promise.resolve
    return Promise.resolve(value + " -> 被Promise.resolve包装");
  })
  .then(value => {
    console.log("第二层:", value);
  });

console.log("\n=== 在then中调用Promise.then ===");

// 3. 在then中调用Promise.then (这可能是你想要的)
const intermediatePromise = Promise.resolve("中间值");

Promise.resolve("外层值")
  .then(outerValue => {
    console.log("外层值:", outerValue);
    // 在这里使用另一个Promise的then
    return intermediatePromise.then(interValue => {
      console.log("内层值:", interValue);
      return `${outerValue} + ${interValue}`;
    });
  })
  .then(result => {
    console.log("合并结果:", result);
  });

console.log("\n=== 错误的语法示例及正确做法 ===");

// 错误: `return Promise.then(val)` 是不正确的语法
// 正确的方式是返回一个Promise或者在Promise内部使用then

// 模拟你可能想要的效果
const val = "要处理的值";

Promise.resolve("开始")
  .then(() => {
    // 如果你想使用某个Promise的then方法来处理val
    return Promise.resolve(val).then(processedVal => {
      console.log("处理的值:", processedVal);
      return processedVal + " -> 已处理";
    });
  })
  .then(result => {
    console.log("结果:", result);
  });

console.log("\n=== 复杂嵌套示例 ===");

// 更复杂的嵌套示例
function asyncOperation(value, delay = 100) {
  return new Promise(resolve => {
    setTimeout(() => resolve(`${value} -> 异步完成`), delay);
  });
}

Promise.resolve("主流程开始")
  .then(mainValue => {
    console.log("主流程:", mainValue);
    
    // 在then中启动另一个异步流程并等待其结果
    return asyncOperation("嵌套流程").then(nestedResult => {
      console.log("嵌套流程:", nestedResult);
      return `${mainValue} + ${nestedResult}`;
    });
  })
  .then(combinedResult => {
    console.log("组合结果:", combinedResult);
  })
  .catch(error => {
    console.error("错误:", error);
  });