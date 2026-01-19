const quickSort = (nums) => {
  if (nums.length < 2) {
    return nums;
  } else {
    var left = [];
    var right = [];
    var pivot = Math.floor(nums.length / 2); // Math.floor 向下取整
    var base = nums.splice(pivot, 1)[0];
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] < base) {
        left.push(nums[i]);
      } else {
        right.push(nums[i]);
      }
    }
  }
  return quickSort(left).concat([base], quickSort(right));
};

// deepClone
// function deepClone(obj = {}) {
//     if (typeof obj !== 'object' || obj == null) {
//         // obj 是 null 或者不是对象和数组，直接返回
//         return obj;
//     }
//     let res;
//     if (obj instanceof Array) {
//         res = [];
//     } else {
//         res = {};
//     }

//     for (let key in obj) {
//         // 判断自身中是否包含自身属性
//         if (obj.hasOwnProperty(key)) {
//             res[key] = deepClone(obj[key])
//         }
//     }
//     return res;
// }
// // 验证
// o = {a: 1, d: {c: '4'}};
// res = deepClone(o);
// console.log(res);
// console.log(res == o);

// 模拟 bind
Function.prototype.bind1 = function () {
  // 将参数拆解为数组
  const args = Array.prototype.slice.call(arguments); // 变成数组

  // 获取 this（数组第一项）
  const t = args.shift();

  // fn1.bind(...) 中的 fn1
  const self = this;

  // 返回一个函数
  return function () {
    return self.apply(t, args);
  };
};
function fn1(a, b, c) {
  console.log("this", this);
  console.log(a, b, c);
  return "this is fn1";
}
const fn2 = fn1.bind1({ x: 100 }, 10, 20, 30);
const res = fn2();
console.log(res);

/*
 * --- 手动实现 instanceof ---
 */

function newInstanceOf(leftValue, rightValue) {
  if (typeof leftValue !== "object" || rightValue == null) {
    return false;
  }

  let rightProto = rightValue.prototype;
  leftValue = leftValue.__proto__;

  while (true) {
    if (leftValue === null) return false;
    if (leftValue === rightProto) return true;
    leftValue = leftValue.__proto__;
  }
}

/*
 * --- 验证 ---
 */

const a = [];
const b = {};

function Foo() {}

var c = new Foo();
function Child() {}
function Father() {}
Child.prototype = new Father();
var d = new Child();

console.log(newInstanceOf(a, Array)); // true
console.log(newInstanceOf(b, Object)); // true
console.log(newInstanceOf(b, Array)); // false
console.log(newInstanceOf(a, Object)); // true
console.log(newInstanceOf(c, Foo)); // true
console.log(newInstanceOf(d, Child)); // true
console.log(newInstanceOf(d, Father)); // true
console.log(newInstanceOf(123, Object)); // false
console.log(123 instanceof Object); // false

function promisesAll(promises) {
  return new Promise((resolve, reject) => {
    let count = 0;
    let result = [];
    for (let i = 0; i < promises.length; i++) {
      Promise.resolve(promises[i]).then((res) => {
        count++;
        result[i] = res;
        if (count === promises.length) {
          resolve(result);
        }
      });
    }
  });
}

// my name is Alan
// I eat Banana
// 等待 4s
// I eat Apple
// 等待 5s
// I eat Pear
function Monkey(name) {
  const tasks = [];
  let promise = Promise.resolve();

  tasks.push(() => {
    console.log(`my name is ${name}`);
  });

  const api = {
    eat(food) {
      tasks.push(() => {
        console.log(`I eat ${food}`);
      });
      return this; // ✅ this 指向 api 对象
    },

    sleep(time) {
      tasks.push(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log(`等待 ${time}s`);
            resolve();
          }, time * 1000);
        });
      });
      return this;
    },
  };

  setTimeout(() => {
    tasks.forEach((task) => {
      promise = promise.then(() => task());
    });
  }, 0);

  return api;
}

// Monkey('Alan').eat('Banana').sleep(4).eat('Apple').sleep(5).eat('Pear');

const join = (a, b, c) => {
  console.log(`${a}_${b}_${c}`);
  return `${a}_${b}_${c}`;
};
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}
const curriedJoin = curry(join);
curriedJoin(1, 2, 3); // '1_2_3'
curriedJoin(1)(2, 3); // '1_2_3'
curriedJoin(1, 2)(3); // '1_2_3'

const join2 = (a, b, c) => {
  return `${a}_${b}_${c}`;
};
function curry2(fn) {
  this.placeholder = "_";
  return function curried(...args) {
    const completeArgs = args.filter((arg) => arg !== curry2.placeholder);
    if (completeArgs.length >= fn.length) {
      return fn.apply(this, completeArgs);
    } else {
      return function (...args2) {
        return curried.apply(
          this,
          args.concat(args2.filter((arg) => arg !== curry2.placeholder)),
        );
      };
    }
  };
}
const curriedJoin2 = curry2(join);
const _ = curry2.placeholder;
curriedJoin2(1, 2, 3); // '1_2_3'
curriedJoin2(_, 2)(1, 3); // '1_2_3'
curriedJoin2(_, _, _)(1)(_, 3)(2); // '1_2_3'
curriedJoin2(_, _, _)(1)(_, 3)(2); // '1_2_3'

/**
 * @param { Array } arr
 * @param { number } depth
 */
function flat(arr, depth = 1) {
    let result = [];
    arr.forEach((item) => {
        if (Array.isArray(item) && depth > 0) {
            result.push(...flat(item, depth - 1));
        } else {
            result.push(item)
        };
    });
    return result;
}
const arr = [1, [2], [3, [4]]];
flat(arr);
// [1, 2, 3, [4]]
flat(arr, 1);
// [1, 2, 3, [4]]
flat(arr, 2);
// [1, 2, 3, 4]

function bubbleSort(arr) {

    const len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

// 请实现您自己的Array.prototype.map()。
Array.prototype.myMap = function = function(callback) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        result.push(callback(this[i], i, this));
    }
    console.log(result);
    return result;
}
[1,2,3].myMap(num => num * 2)


Object.is(0, -0) // false
0 === -0 // true
Object.is(NaN, NaN) // true
NaN === NaN // false
function is(x, y) {
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    }
    return x !== x && y !== y;
}

var invertTree = function(root) {
    // 终止条件
    if (!root) {
        return null;
    }
    // 交换左右节点
    const rightNode = root.right;
    root.right = invertTree(root.left);
    root.left = invertTree(rightNode);
    return root;
};

var levelOrder = function(root) {
    //二叉树的层序遍历
    let res = [], queue = [];
    queue.push(root);
    if(root === null) {
        return res;
    }
    while(queue.length !== 0) {
        // 记录当前层级节点数
        let length = queue.length;
        //存放每一层的节点
        let curLevel = [];
        for(let i = 0;i < length; i++) {
            let node = queue.shift();
            curLevel.push(node.val);
            // 存放当前层下一层的节点
            node.left && queue.push(node.left);
            node.right && queue.push(node.right);
        }
        //把每一层的结果放到结果数组
        res.push(curLevel);
    }
    return res;
};

