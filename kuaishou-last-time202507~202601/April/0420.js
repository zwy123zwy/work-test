// 问题：手写防抖 debounce
function debounce(fn, wait) {
  let timer = null;
  return function (...args) {
    // 每次触发都重置定时器，只执行最后一次
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

// 问题：手写节流 throttle
function throttle(fn, wait) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    // 在固定时间窗口内只执行一次
    if (now - lastTime >= wait) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// 问题：手写数组扁平化 flatten
function flatten(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      // 遇到嵌套数组就继续递归展开
      result.push(...flatten(item));
    } else {
      result.push(item);
    }
  }
  return result;
}

// 问题：手写数组去重 unique
function unique(arr) {
  return [...new Set(arr)];
}

// 问题：手写深拷贝 deepClone
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  // 处理循环引用
  if (map.has(obj)) return map.get(obj);
  const result = Array.isArray(obj) ? [] : {};
  map.set(obj, result);
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = deepClone(obj[key], map);
    }
  }
  return result;
}

// 问题：手写 Promise.all
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const result = [];
    let count = 0;
    if (promises.length === 0) return resolve([]);

    promises.forEach((p, index) => {
      Promise.resolve(p).then(
        (value) => {
          // 按原顺序保存结果
          result[index] = value;
          count += 1;
          if (count === promises.length) resolve(result);
        },
        // 任意一个失败就直接 reject
        (err) => reject(err),
      );
    });
  });
}

// 问题：手写 Promise.race
function myPromiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((p) => {
      // 谁先有结果就采用谁的状态
      Promise.resolve(p).then(resolve, reject);
    });
  });
}

// 问题：手写 call
Function.prototype.myCall = function (context, ...args) {
  const ctx = context == null ? globalThis : Object(context);
  const key = Symbol('fn');
  // 临时把函数挂到对象上执行
  ctx[key] = this;
  const result = ctx[key](...args);
  delete ctx[key];
  return result;
};

// 问题：手写 apply
Function.prototype.myApply = function (context, args = []) {
  const ctx = context == null ? globalThis : Object(context);
  const key = Symbol('fn');
  // apply 和 call 的区别只是参数形式不同
  ctx[key] = this;
  const result = ctx[key](...args);
  delete ctx[key];
  return result;
};

// 问题：手写 bind
Function.prototype.myBind = function (context, ...args) {
  const fn = this;
  return function (...restArgs) {
    // 返回新函数，并预置部分参数
    return fn.apply(context, [...args, ...restArgs]);
  };
};

// 问题：手写 new
function myNew(fn, ...args) {
  // 新对象的原型指向构造函数原型
  const obj = Object.create(fn.prototype);
  const result = fn.apply(obj, args);
  // 如果构造函数显式返回对象，则返回该对象
  return result && (typeof result === 'object' || typeof result === 'function')
    ? result
    : obj;
}

// 问题：手写 instanceof
function myInstanceof(left, right) {
  if (left == null || (typeof left !== 'object' && typeof left !== 'function')) {
    return false;
  }

  let proto = Object.getPrototypeOf(left);
  while (proto) {
    // 沿着原型链向上查找
    if (proto === right.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

// 问题：手写柯里化 curry
function curry(fn, ...args) {
  return function (...rest) {
    const allArgs = [...args, ...rest];
    if (allArgs.length >= fn.length) {
      return fn(...allArgs);
    }
    // 参数不够时继续返回函数收集参数
    return curry(fn, ...allArgs);
  };
}

// 问题：手写发布订阅模式
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(type, fn) {
    if (!this.events[type]) this.events[type] = [];
    this.events[type].push(fn);
  }

  emit(type, ...args) {
    if (!this.events[type]) return;
    // 依次触发当前事件的所有回调
    this.events[type].forEach((fn) => fn(...args));
  }

  off(type, fn) {
    if (!this.events[type]) return;
    this.events[type] = this.events[type].filter((item) => item !== fn);
  }
}

// 问题：手写数组转树 arrayToTree
function arrayToTree(list) {
  const map = {};
  const result = [];

  list.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  list.forEach((item) => {
    const node = map[item.id];
    if (item.parentId === null) {
      result.push(node);
    } else if (map[item.parentId]) {
      // 把当前节点挂到父节点 children 上
      map[item.parentId].children.push(node);
    }
  });

  return result;
}

// 问题：手写树转数组 treeToArray
function treeToArray(tree) {
  const result = [];

  function dfs(nodes, parentId = null) {
    nodes.forEach((node) => {
      const { children = [], ...rest } = node;
      result.push({ ...rest, parentId });
      // 深度优先遍历子节点
      if (children.length) dfs(children, node.id);
    });
  }

  dfs(tree);
  return result;
}

// 问题：手写两数之和 twoSum
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i];
    if (map.has(need)) {
      return [map.get(need), i];
    }
    // 记录当前值和下标，供后面查找
    map.set(nums[i], i);
  }
  return [];
}

// 问题：手写反转链表 reverseList
function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr) {
    const next = curr.next;
    // 逐个反转指针方向
    curr.next = prev;
    prev = curr;
    curr = next;
  }

  return prev;
}

// 问题：手写二分查找 binarySearch
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) {
      // 目标在右半区间
      left = mid + 1;
    } else {
      // 目标在左半区间
      right = mid - 1;
    }
  }

  return -1;
}

// 问题：手写快速排序 quickSort
function quickSort(arr) {
  if (arr.length <= 1) return arr.slice();

  const pivot = arr[0];
  const left = [];
  const right = [];

  for (let i = 1; i < arr.length; i += 1) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  // 左边递归排好序，再拼上基准值和右边
  return [...quickSort(left), pivot, ...quickSort(right)];
}
