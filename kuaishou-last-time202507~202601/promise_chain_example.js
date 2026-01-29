// Promise链式调用示例

// 方法一：直接使用原生Promise进行链式调用
console.log("=== 方法一：原生Promise链式调用 ===");
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("第一步完成");
    resolve("第一个结果");
  }, 1000);
});

promise
  .then(result => {
    console.log("接收到:", result);
    return "第二个结果";  // 返回值会传递给下一个then
  })
  .then(result => {
    console.log("接收到:", result);
    return "第三个结果";
  })
  .then(result => {
    console.log("最终结果:", result);
  })
  .catch(error => {
    console.error("发生错误:", error);
  });

// 方法二：创建一个支持链式调用的类
console.log("\n=== 方法二：自定义类实现链式调用 ===");
class ChainablePromise {
  constructor(initialValue) {
    this.promise = Promise.resolve(initialValue);
  }

  then(onFulfilled) {
    this.promise = this.promise.then(onFulfilled);
    return this; // 返回this以支持链式调用
  }

  catch(onRejected) {
    this.promise = this.promise.catch(onRejected);
    return this; // 返回this以支持链式调用
  }

  finally(onFinally) {
    this.promise = this.promise.finally(onFinally);
    return this; // 返回this以支持链式调用
  }

  // 获取最终结果
  getResult() {
    return this.promise;
  }
}

new ChainablePromise("初始值")
  .then(result => {
    console.log("链式调用1:", result);
    return "处理后值1";
  })
  .then(result => {
    console.log("链式调用2:", result);
    return "处理后值2";
  })
  .then(result => {
    console.log("链式调用3:", result);
    return "最终值";
  })
  .getResult()
  .then(finalResult => {
    console.log("最终结果:", finalResult);
  });

// 方法三：模拟你提到的resolve()调用模式
console.log("\n=== 方法三：模拟resolve()链式调用 ===");

function createChainedPromise(initialValue) {
  let promise = Promise.resolve(initialValue);
  
  const chain = {
    then: (resolver) => {
      // resolver是一个函数，它接收resolve和reject作为参数
      promise = promise.then(value => {
        return new Promise((resolve, reject) => {
          try {
            // 调用resolver函数，并传入resolve和reject
            const result = resolver(resolve, reject, value);
            // 如果resolver返回了值，则使用该值
            if (result !== undefined) {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        });
      });
      return chain; // 返回chain对象以支持链式调用
    },
    
    resolve: (val) => {
      // 这是模拟你提到的resolve(VAL)形式
      promise = promise.then(() => val);
      return chain;
    },

    // 最终获取结果的方法
    finally: (callback) => {
      promise = promise.finally(callback);
      return promise;
    },
    
    // 获取最终的Promise
    end: () => promise
  };
  
  return chain;
}

// 使用示例
createChainedPromise("起始值")
  .then((resolve, reject, currentValue) => {
    console.log("当前值:", currentValue);
    resolve("经过第一次处理"); // 这是resolve()的调用
  })
  .then((resolve, reject, currentValue) => {
    console.log("当前值:", currentValue);
    resolve("经过第二次处理"); // 这是resolve()的调用
  })
  .resolve("直接设置这个值") // 这是resolve(VAL)的调用
  .then((resolve, reject, currentValue) => {
    console.log("当前值:", currentValue);
    resolve("最终结果");
  })
  .end()
  .then(result => {
    console.log("最终结果:", result);
  });

// 方法四：更直观的链式调用实现
console.log("\n=== 方法四：更直观的链式调用实现 ===");

function createSimpleChain(value) {
  const chain = {
    value: Promise.resolve(value),
    
    then: function(fn) {
      this.value = this.value.then(fn);
      return this;
    },
    
    resolve: function(val) {
      // 直接解析为指定值
      this.value = Promise.resolve(val);
      return this;
    },
    
    catch: function(fn) {
      this.value = this.value.catch(fn);
      return this;
    },
    
    finally: function(fn) {
      this.value = this.value.finally(fn);
      return this;
    },
    
    end: function() {
      return this.value;
    }
  };
  
  return chain;
}

createSimpleChain("开始值")
  .then(value => {
    console.log("处理值:", value);
    return value + " -> 第一步";
  })
  .then(value => {
    console.log("处理值:", value);
    return value + " -> 第二步";
  })
  .resolve("直接使用这个值")  // 这里会替换掉之前的值
  .then(value => {
    console.log("处理新值:", value);
    return value + " -> 最后一步";
  })
  .end()
  .then(result => {
    console.log("最终结果:", result);
  });

// 方法五：带有异步操作的链式调用
console.log("\n=== 方法五：带异步操作的链式调用 ===");

function asyncOperation(value, delay = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`${value} -> 异步操作完成`);
    }, delay);
  });
}

Promise.resolve("开始")
  .then(value => asyncOperation(value, 500))
  .then(value => {
    console.log(value);
    return asyncOperation(value, 500);
  })
  .then(value => {
    console.log(value);
    return "链式结束";
  })
  .then(value => {
    console.log(value);
  })
  .catch(error => {
    console.error("错误:", error);
  });