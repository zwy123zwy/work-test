// 分析这段Promise代码的执行过程
console.log("=== 代码分析 ===");

// 原始代码
console.log("执行原始代码:");
new Promise((resolve) => {
    console.log("A");
    resolve("");
    return Promise.resolve("").then(() => {
        console.log("C");
        // 注意：这里的resolve("11111")不会生效，因为外部的resolve("")已经设置了值
    });
}).then((res) => {
    console.log(res.toString());  // 这里会输出什么？
});

new Promise((resolve) => {
    console.log("B");
    resolve("");
}).then(() => {
    console.log("F");
});

console.log("\n=== 详细分析 ===");
console.log("1. 首先执行第一个Promise的executor函数，输出'A'");
console.log("2. 调用resolve('')，此时Promise的状态变为fulfilled，值为''");
console.log("3. 执行return Promise.resolve('').then(() => {...})，这个then里的函数也会被执行，输出'C'");
console.log("4. 但注意：then里面的resolve('11111')不会影响外层Promise的值，因为那时外层Promise已经resolve了");
console.log("5. 第一个Promise的后续then接收到的是''，所以输出空字符串");
console.log("6. 然后执行第二个Promise，输出'B'");
console.log("7. 第二个Promise resolve后，执行后续then，输出'F'");

console.log("\n=== 预期输出顺序 ===");
console.log("A");
console.log("C");
console.log("(空行，因为res是空字符串)");
console.log("B");
console.log("F");

console.log("\n=== 验证 ===");
setTimeout(() => {
  console.log("\n实际运行结果:");
  new Promise((resolve) => {
      console.log("A");
      resolve("");
      return Promise.resolve("").then(() => {
          console.log("C");
          resolve("11111");
      });
  }).then((res) => {
      console.log(res.toString());
  });

  new Promise((resolve) => {
      console.log("B");
      resolve("");
  }).then(() => {
      console.log("F");
  });
}, 100);