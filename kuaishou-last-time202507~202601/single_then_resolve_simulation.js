// 只使用一个then方法，模拟promise.then(resolve()).then(resolve(VAL))的效果

// 定义一个辅助类来管理状态
class ChainExecutor {
  constructor(initialValue) {
    this.value = initialValue;
    this.operations = [];
  }

  // 添加一个"resolve()"操作 - 什么都不做，保持当前值
  addResolve() {
    this.operations.push(() => this.value);
    return this;
  }

  // 添加一个"resolve(VAL)"操作 - 设置新值
  addResolveWith(newValue) {
    this.operations.push(() => newValue);
    return this;
  }

  // 添加普通处理函数
  addHandler(handler) {
    this.operations.push(handler);
    return this;
  }

  // 执行所有操作
  execute() {
    let result = this.value;
    
    for (const op of this.operations) {
      // 将当前结果传入操作函数
      result = op(result);
    }
    
    return Promise.resolve(result);
  }
}

// 使用示例
const executor = new ChainExecutor("初始值");

executor
  .addHandler(value => {
    console.log("处理初始值:", value);
    return value + " -> 经过处理器1";
  })
  .addResolve()  // 模拟 resolve() - 保持当前值
  .addHandler(value => {
    console.log("resolve()之后的值:", value);
    return value + " -> 经过处理器2";
  })
  .addResolveWith("被替换的值")  // 模拟 resolve(VAL) - 替换为新值
  .addHandler(value => {
    console.log("resolve(VAL)之后的值:", value);
    return value + " -> 最终处理";
  });

// 只调用一次then
executor.execute().then(result => {
  console.log("最终结果:", result);
});

console.log("\n--- 更简洁的实现 ---\n");

// 更简洁的实现方式
function createSingleThenChain(initialValue) {
  const ops = [];
  let value = initialValue;

  const chain = {
    then: handler => {
      ops.push(handler);
      return chain;
    },
    resolve: () => {
      // 模拟 resolve() - 保持当前值
      ops.push(currentVal => currentVal);
      return chain;
    },
    resolveWith: (newValue) => {
      // 模拟 resolve(VAL) - 设置新值
      ops.push(() => newValue);
      return chain;
    },
    execute: () => {
      let result = Promise.resolve(value);
      
      for (const op of ops) {
        result = result.then(op);
      }
      
      return result;
    }
  };

  return chain;
}

// 使用简洁实现
createSingleThenChain("开始值")
  .then(value => {
    console.log("第一个处理器:", value);
    return value + " -> 第一步";
  })
  .resolve()  // 模拟 resolve()
  .then(value => {
    console.log("resolve()后:", value);
    return value + " -> 第二步";
  })
  .resolveWith("被替换的值")  // 模拟 resolve(VAL)
  .then(value => {
    console.log("resolve(VAL)后:", value);
    return value + " -> 最后一步";
  })
  .execute()  // 执行整个链条
  .then(result => {
    console.log("最终结果:", result);
  });

console.log("\n--- 函数式实现 ---\n");

// 纯函数实现方式
const createChain = (initialValue) => {
  const operations = [];

  // then函数 - 添加处理函数
  const then = (handler) => {
    operations.push({ type: 'handler', fn: handler });
    return chainAPI;
  };

  // resolve函数 - 添加resolve()操作（保持值）
  const resolve = () => {
    operations.push({ type: 'resolve', fn: (currentValue) => currentValue });
    return chainAPI;
  };

  // resolveWith函数 - 添加resolve(VAL)操作（替换值）
  const resolveWith = (newValue) => {
    operations.push({ type: 'resolveWith', fn: () => newValue });
    return chainAPI;
  };

  // 执行所有操作
  const execute = () => {
    let result = Promise.resolve(initialValue);

    for (const op of operations) {
      result = result.then(op.fn);
    }

    return result;
  };

  const chainAPI = { then, resolve, resolveWith, execute };

  return chainAPI;
};

// 使用函数式实现
createChain("函数式开始")
  .then(value => {
    console.log("函数式处理器1:", value);
    return value + " -> 步骤1";
  })
  .resolve()  // 模拟 resolve()
  .then(value => {
    console.log("函数式resolve()后:", value);
    return value + " -> 步骤2";
  })
  .resolveWith("函数式替换值")  // 模拟 resolve(VAL)
  .then(value => {
    console.log("函数式resolve(VAL)后:", value);
    return value + " -> 最后步骤";
  })
  .execute()
  .then(result => {
    console.log("函数式最终结果:", result);
  });