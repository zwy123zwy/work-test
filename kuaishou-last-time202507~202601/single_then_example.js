// 只使用单个then实现链式调用示例

// 方法一：基本的单then链式调用
console.log("=== 方法一：基本的单then链式调用 ===");

let promise = Promise.resolve("初始值");

// 每次调用then都会返回一个新的Promise，所以可以继续调用then
promise
  .then(value => {
    console.log("第一次处理:", value);
    return value + " -> 处理1";
  })
  .then(value => {
    console.log("第二次处理:", value);
    return value + " -> 处理2";
  })
  .then(value => {
    console.log("第三次处理:", value);
    return value + " -> 处理3";
  })
  .then(value => {
    console.log("最终结果:", value);
  })
  .catch(error => {
    console.error("错误:", error);
  });

// 方法二：创建一个辅助函数，让单then看起来更像链式调用
console.log("\n=== 方法二：通过辅助函数实现单then链式调用 ===");

function createThenChain(initialValue) {
  let currentPromise = Promise.resolve(initialValue);

  return {
    then: function (handler) {
      currentPromise = currentPromise.then(handler);
      return this; // 返回自身以支持链式调用
    },
    catch: function (errorHandler) {
      currentPromise = currentPromise.catch(errorHandler);
      return this;
    },
    finally: function (finallyHandler) {
      currentPromise = currentPromise.finally(finallyHandler);
      return this;
    },
    end: function () {
      return currentPromise; // 返回最终的Promise
    }
  };
}

createThenChain("开始")
  .then(value => {
    console.log("链式1:", value);
    return value + " -> 阶段1";
  })
  .then(value => {
    console.log("链式2:", value);
    return value + " -> 阶段2";
  })
  .then(value => {
    console.log("链式3:", value);
    return value + " -> 阶段3";
  })
  .end()
  .then(result => {
    console.log("链式结果:", result);
  });

// 方法三：模拟你提到的promise.then(resolve()).then(resolve(VAL))形式
console.log("\n=== 方法三：模拟resolve()形式的链式调用 ===");

function createResolveChain(initialValue) {
  let p = Promise.resolve(initialValue);

  return {
    then: (handler) => {
      p = p.then(handler);
      return this;
    },
    resolve: (value) => {
      p = Promise.resolve(value);
      return this;
    },
    end: () => p
  };
}

createResolveChain("起始值")
  .then(() => {
    console.log("执行resolve()");
    return "第一次resolve后的值";
  })
  .resolve("直接设置这个值")  // 这相当于你提到的resolve(VAL)
  .then(value => {
    console.log("当前值:", value);
    return value + " -> 继续处理";
  })
  .resolve("最终值")  // 再次使用resolve(VAL)
  .end()
  .then(result => {
    console.log("最终结果:", result);
  });

// 方法四：最简单的单then连续调用
console.log("\n=== 方法四：最简单的连续单then调用 ===");

Promise.resolve("数据")
  .then(data => {
    console.log("第1个then:", data);
    return data + "-加工1";
  })
  .then(data => {
    console.log("第2个then:", data);
    return data + "-加工2";
  })
  .then(data => {
    console.log("第3个then:", data);
    return data + "-加工3";
  })
  .then(data => {
    console.log("第4个then:", data);
    return data + "-最终";
  })
  .then(result => {
    console.log("完成:", result);
  });

// 方法五：实际应用场景 - 数据处理管道
console.log("\n=== 方法五：实际应用 - 数据处理管道 ===");

const userData = { id: 1, name: "张三", email: "zhangsan@example.com" };

Promise.resolve(userData)
  .then(user => {
    console.log("原始用户数据:", user);
    return { ...user, processed: true };  // 标记为已处理
  })
  .then(user => {
    console.log("添加处理标记:", user);
    return { ...user, validated: true };  // 标记为已验证
  })
  .then(user => {
    console.log("添加验证标记:", user);
    return { ...user, formatted: `ID: ${user.id}, 姓名: ${user.name}, 邮箱: ${user.email}` };  // 格式化
  })
  .then(user => {
    console.log("最终格式化结果:", user.formatted);
    return user;
  });