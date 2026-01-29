// 优化版：只使用一个then方法，模拟promise.then(resolve()).then(resolve(VAL))效果

// 通过缓存操作序列，然后一次性执行
class SingleThenChain {
  constructor(initialValue) {
    this.initialValue = initialValue;
    this.operations = [];  // 存储操作序列
  }

  // 添加一个处理函数
  then(handler) {
    this.operations.push({
      type: 'handler',
      fn: handler
    });
    return this;
  }

  // 模拟 resolve() - 不改变当前值
  resolve() {
    this.operations.push({
      type: 'resolve',
      fn: (currentValue) => currentValue  // 保持当前值不变
    });
    return this;
  }

  // 模拟 resolve(VAL) - 用新值替换当前值
  resolveWith(value) {
    this.operations.push({
      type: 'resolveWith',
      fn: () => value  // 返回新值
    });
    return this;
  }

  // 执行所有操作
  execute() {
    // 从初始值开始，依次应用所有操作
    let promise = Promise.resolve(this.initialValue);
    
    for (const op of this.operations) {
      promise = promise.then(op.fn);
    }
    
    return promise;
  }
}

// 使用示例
console.log("=== 优化版实现 ===");

const chain = new SingleThenChain("初始值");

chain
  .then(value => {
    console.log("步骤1 - 当前值:", value);
    return value + " -> 经过处理器1";
  })
  .resolve()  // 模拟 resolve()，保持当前值
  .then(value => {
    console.log("resolve()后 - 当前值:", value);
    return value + " -> 经过处理器2";
  })
  .resolveWith("替换的新值")  // 模拟 resolve(VAL)，替换为新值
  .then(value => {
    console.log("resolve(VAL)后 - 当前值:", value);
    return value + " -> 最终处理";
  });

// 只调用一次真正的then
chain.execute().then(result => {
  console.log("最终结果:", result);
});

console.log("\n=== 实际场景应用 ===");

// 实际使用场景：数据处理管道
new SingleThenChain({ userId: 123, name: "张三" })
  .then(user => {
    console.log("原始用户:", user);
    return { ...user, validated: true };
  })
  .resolve()  // 模拟中间操作，不改变值
  .then(user => {
    console.log("验证后用户:", user);
    return { ...user, processed: true };
  })
  .resolveWith({ 
    id: 999, 
    name: "被替换的用户", 
    status: "replaced" 
  })  // 模拟替换整个对象
  .then(user => {
    console.log("替换后用户:", user);
    return {
      ...user,
      timestamp: new Date().toISOString(),
      final: true
    };
  })
  .execute()
  .then(result => {
    console.log("最终处理结果:", result);
  });

console.log("\n=== 简化的函数式接口 ===");

// 提供一个更简单的函数式接口
function createChain(initialValue) {
  const chain = new SingleThenChain(initialValue);
  
  // 返回一个包装对象，只暴露需要的方法
  return {
    then: (handler) => {
      chain.then(handler);
      return this;
    },
    
    resolve: () => {
      chain.resolve();
      return this;
    },
    
    resolveWith: (value) => {
      chain.resolveWith(value);
      return this;
    },
    
    // 最终执行
    end: () => chain.execute()
  };
}

// 使用简化接口
createChain("简单开始")
  .then(value => {
    console.log("简单处理器1:", value);
    return value + " -> 简单处理";
  })
  .resolve()  // 模拟 resolve()
  .then(value => {
    console.log("简单resolve()后:", value);
    return value + " -> 继续处理";
  })
  .resolveWith("简单替换值")  // 模拟 resolve(VAL)
  .then(value => {
    console.log("简单resolve(VAL)后:", value);
    return value + " -> 完成";
  })
  .end()  // 执行
  .then(result => {
    console.log("简单接口最终结果:", result);
  });