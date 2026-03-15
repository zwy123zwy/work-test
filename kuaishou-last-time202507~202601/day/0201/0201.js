// 动态规划：最大子数组和（带路径记录）
// 问题：实现函数 maxSubArrayWithPath(nums: number[]): { maxSum: number, path: number[] }，返回最大子数组和及其子数组路径。

// 要求：时间复杂度 O(n)，空间复杂度 O(1)（路径需原地构造）
// 必须返回路径（不仅是和值）
// 示例：
function maxSubArrayWithPath(nums) {
    if (nums.length === 0) return null;
    let maxSum = nums[0];
    let curSum = nums[0];
    let curStartIndex = 0; // 记录当前子数组起始位置
    let maxStartIndex = 0; // 记录最大子数组起始位置
    let maxEndIndex = 0;   // 记录最大子数组结束位置

    for (let i = 1; i < nums.length; i++) {
        if (curSum > 0) {
            curSum += nums[i];
        } else {
            curSum = nums[i];
            curStartIndex = i; // 重新开始计算，更新起始位置
        }

        if (curSum > maxSum) {
            maxSum = curSum;
            maxStartIndex = curStartIndex; // 更新最大值对应的起始位置
            maxEndIndex = i;               // 更新最大值对应的结束位置
        }
    }

    // 根据起始和结束位置构建路径数组
    let path = [];
    for (let i = maxStartIndex; i <= maxEndIndex; i++) {
        path.push(nums[i]);
    }

    return { maxSum, path };

}
console.log(maxSubArrayWithPath([-2, 1, -3, 4, -1, 2, 1, -5, 4]))
maxSubArrayWithPath([-2, 1, -3, 4, -1, 2, 1, -5, 4])
// { maxSum: 6, path: [4, -1, 2, 1] }


// 二叉树层序遍历优化：每层平均值 + 内存压缩
// 问题：实现函数 averageOfLevels(root: TreeNode): number[]，返回二叉树每层节点值的平均值。

// 要求：
// 时间复杂度 O(n)，空间复杂度 O(1)（禁止使用队列存储整层）
// 必须处理大数溢出（阿里业务数据量级）

// 二叉树节点定义
class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// 二叉树层序遍历优化：每层平均值 + 内存压缩
// 问题：实现函数 averageOfLevels(root: TreeNode): number[]，返回二叉树每层节点值的平均值。
// 要求：
// 时间复杂度 O(n)，空间复杂度 O(1)（禁止使用队列存储整层）
// 必须处理大数溢出（阿里业务数据量级）
function averageOfLevels(root) {
    if (!root) return [];

    let res = [],
        queue = [];
    queue.push(root);

    while (queue.length > 0) {
        const levelSize = queue.length;  // 当前层的节点数量
        let levelSum = 0n; // 使用BigInt来处理大数

        // 遍历当前层的所有节点
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            levelSum += BigInt(node.val); // 转换为BigInt

            // 将下一层的节点加入队列
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        // 计算当前层的平均值，转换回普通数字
        // 使用整数除法，如果需要更精确的平均值可以保留小数部分
        const levelAvg = Number(levelSum) / levelSize;
        res.push(levelAvg);
    }

    return res;
}


// 创建测试用的二叉树
//       3
//      / \
//     9   20
//        /  \
//       15   7
const tree = new TreeNode(3,
    new TreeNode(9),
    new TreeNode(20,
        new TreeNode(15),
        new TreeNode(7)
    )
);

console.log(averageOfLevels(tree)); // 应该输出 [3, 14.5, 11]

// 测试大数情况
const bigTree = new TreeNode(Number.MAX_SAFE_INTEGER,
    new TreeNode(1),
    new TreeNode(2,
        new TreeNode(Number.MAX_SAFE_INTEGER),
        new TreeNode(Number.MAX_SAFE_INTEGER)
    )
);

console.log(averageOfLevels(bigTree));


//  字符串单词反转（O(1)空间原地操作）
// 问题：实现函数 reverseWords(s: string): string，反转字符串中单词的顺序（单词内部顺序不变）。

// 要求：
// 时间复杂度 O(n)，空间复杂度 O(1)（禁止使用 split/reverse）
// 处理连续空格（如 " hello world " → "world hello"）

function reverseWords(s) {
    // JavaScript中字符串是不可变的，所以我们要先把字符串转换成字符数组来模拟原地操作
    let chars = s.split('');

    // 第一步：去除多余的空格（前导、尾随和中间多余的空格）
    chars = removeExtraSpaces(chars);

    // 第二步：反转整个字符串
    reverseString(chars, 0, chars.length - 1);

    // 第三步：反转每个单词
    reverseEachWord(chars);

    return chars.join('');
}

// 去除多余空格的辅助函数
function removeExtraSpaces(chars) {
    let slow = 0; // 慢指针，指向下一个要填充的位置

    for (let fast = 0; fast < chars.length; fast++) {
        // 如果当前字符不是空格，则是一个单词的开始
        if (chars[fast] !== ' ') {
            // 如果不是第一个单词，先添加一个空格
            if (slow !== 0) {
                chars[slow++] = ' ';
            }

            // 复制整个单词
            while (fast < chars.length && chars[fast] !== ' ') {
                chars[slow++] = chars[fast++];
            }
        }
    }

    // 截取有效部分
    return chars.slice(0, slow);
}

// 反转指定范围内的字符
function reverseString(chars, start, end) {
    while (start < end) {
        [chars[start], chars[end]] = [chars[end], chars[start]];
        start++;
        end--;
    }
}

// 反转每个单词
function reverseEachWord(chars) {
    let start = 0;

    for (let end = 0; end <= chars.length; end++) {
        // 如果到达字符串末尾或者遇到空格，则反转当前单词
        if (end === chars.length || chars[end] === ' ') {
            reverseString(chars, start, end - 1);
            start = end + 1;
        }
    }
}

// 测试用例
console.log(reverseWords("  hello world  ")); // "world hello"
console.log(reverseWords("the sky is blue")); // "blue is sky the"
console.log(reverseWords("  Bob    Loves  Alice   ")); // "Alice Loves Bob"
console.log(reverseWords("a")); // "a"




// 三数之和（去重优化 + 大数据场景）
// 问题：实现函数 threeSum(nums: number[]): number[][]，返回所有唯一三元组，使三元组和为0。

// 要求：
// 时间复杂度 O(n²)，空间复杂度 O(1)（去重需原地处理）
// 优化大数据场景：输入数组可能有10^6个元素（阿里日志分析场景）

function threeSum(nums) {
    // 排序数组，方便去重和查找
    nums.sort((a, b) => a - b);

    const res = [];

    // 遍历数组中的每一个元素
    for (let i = 0; i < nums.length - 2; i++) {
        // 跳过重复元素
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        let left = i + 1, right = nums.length - 1;
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            if (sum === 0) {
                res.push([nums[i], nums[left], nums[right]]);
                // 跳过重复元素
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++;
                right--;
            }
            else if (sum < 0) left++;
            else right--;
        }

    }
    return res;
}

console.log(threeSum([-1, 0, 1, 2, -1, -4]));


// 多路归并：合并k个排序数组（优先队列优化）
// 问题：实现函数 mergeKSortedArrays(arrays: number[][]): number[]，合并k个已排序数组为一个排序数组。

// 要求：
// 时间复杂度 O(n log k)，空间复杂度 O(k)
// 必须使用最小堆（禁止使用sort）
// 示例：

function mergeKSortedArrays(arrays) {
    // 创建最小堆
    const heap = new MinHeap();

    // 将所有数组的元素加入堆中
    for (let i = 0; i < arrays.length; i++) {
        for (let j = 0; j < arrays[i].length; j++) {
            heap.insert([arrays[i][j], i, j]);
        }
        arrays[i] = [];
    }
    const res = [];

    while (!heap.isEmpty()) {
        const [val, i, j] = heap.extractMin();
        res.push(val);
        if (j + 1 < arrays[i].length) {
            heap.insert([arrays[i][j + 1], i, j + 1]);
        }
    }
    return res;
}

class MinHeap {
    constructor() {
        this.heap = [];
    }

    insert(val) {
        this.heap.push(val);
        this.siftUp(this.heap.length - 1);
    }

    extractMin() {
        if (this.isEmpty()) {
            return null;
        }

        const min = this.heap[0];
        const last = this.heap.pop();
    }

    siftUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index][0] < this.heap[parentIndex][0]) {
                [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
                index = parentIndex;
            }
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    siftDown(index) {
        const leftChildIndex = 2 * index + 1;
        const rightChildIndex = 2 * index + 2;
        let minIndex = index;

        if (leftChildIndex < this.heap.length && this.heap[leftChildIndex][0] < this.heap[minIndex][0]) {
            minIndex = leftChildIndex;
        }

        if (rightChildIndex < this.heap.length && this.heap[right]) {
            if (this.heap[rightChildIndex][0] < this.heap[minIndex][0]) {
                minIndex = rightChildIndex;
            }
        }
        if (minIndex !== index) {
            [this.heap[index], this.heap[minIndex]] = [this.heap[minIndex], this.heap[index]];
            this.siftDown(minIndex);
        }
        return minIndex;
    }

}

mergeKSortedArrays([[1, 4, 5], [1, 3, 4], [2, 6]])
// [1, 1, 2, 3, 4, 4, 5, 6]

function create(obj) {
    function F() { }
    F.prototype = obj
    return new F()
}


function myInstanceof(left, right) {
    let proto = Object.getPrototypeOf(left), // 获取对象的原型
        prototype = right.prototype; // 获取构造函数的 prototype 对象

    // 判断构造函数的 prototype 对象是否在对象的原型链上
    while (true) {
        if (!proto) return false;
        if (proto === prototype) return true;

        proto = Object.getPrototypeOf(proto);
    }
}


function objectFactory() {
    let newObject = null;
    let constructor = Array.prototype.shift.call(arguments);
    let result = null;
    // 判断参数是否是一个函数
    if (typeof constructor !== "function") {
        console.error("type error");
        return;
    }
    // 新建一个空对象，对象的原型为构造函数的 prototype 对象
    newObject = Object.create(constructor.prototype);
    // 将 this 指向新建对象，并执行函数
    result = constructor.apply(newObject, arguments);
    // 判断返回对象
    let flag = result && (typeof result === "object" || typeof result === "function");
    // 判断返回结果
    return flag ? result : newObject;
}



const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

function MyPromise(fn) {
    // 保存初始化状态
    var self = this;

    // 初始化状态
    this.state = PENDING;

    // 用于保存 resolve 或者 rejected 传入的值
    this.value = null;

    // 用于保存 resolve 的回调函数
    this.resolvedCallbacks = [];

    // 用于保存 reject 的回调函数
    this.rejectedCallbacks = [];

    // 状态转变为 resolved 方法
    function resolve(value) {
        // 判断传入元素是否为 Promise 值，如果是，则状态改变必须等待前一个状态改变后再进行改变
        if (value instanceof MyPromise) {
            return value.then(resolve, reject);
        }

        // 保证代码的执行顺序为本轮事件循环的末尾
        setTimeout(() => {
            // 只有状态为 pending 时才能转变，
            if (self.state === PENDING) {
                // 修改状态
                self.state = RESOLVED;

                // 设置传入的值
                self.value = value;

                // 执行回调函数
                self.resolvedCallbacks.forEach(callback => {
                    callback(value);
                });
            }
        }, 0);
    }

    // 状态转变为 rejected 方法
    function reject(value) {
        // 保证代码的执行顺序为本轮事件循环的末尾
        setTimeout(() => {
            // 只有状态为 pending 时才能转变
            if (self.state === PENDING) {
                // 修改状态
                self.state = REJECTED;

                // 设置传入的值
                self.value = value;

                // 执行回调函数
                self.rejectedCallbacks.forEach(callback => {
                    callback(value);
                });
            }
        }, 0);
    }

    // 将两个方法传入函数执行
    try {
        fn(resolve, reject);
    } catch (e) {
        // 遇到错误时，捕获错误，执行 reject 函数
        reject(e);
    }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
    // 首先判断两个参数是否为函数类型，因为这两个参数是可选参数
    onResolved =
        typeof onResolved === "function"
            ? onResolved
            : function (value) {
                return value;
            };

    onRejected =
        typeof onRejected === "function"
            ? onRejected
            : function (error) {
                throw error;
            };

    // 如果是等待状态，则将函数加入对应列表中
    if (this.state === PENDING) {
        this.resolvedCallbacks.push(onResolved);
        this.rejectedCallbacks.push(onRejected);
    }

    // 如果状态已经凝固，则直接执行对应状态的函数

    if (this.state === RESOLVED) {
        onResolved(this.value);
    }

    if (this.state === REJECTED) {
        onRejected(this.value);
    }
};

function promiseAll(promises) {
    return new Promise(function (resolve, reject) {
        if (!Array.isArray(promises)) {
            throw new TypeError(`argument must be a array`)
        }
        var resolvedCounter = 0;
        var promiseNum = promises.length;
        var resolvedResult = [];
        for (let i = 0; i < promiseNum; i++) {
            Promise.resolve(promises[i]).then(value => {
                resolvedCounter++;
                resolvedResult[i] = value;
                if (resolvedCounter == promiseNum) {
                    return resolve(resolvedResult)
                }
            }, error => {
                return reject(error)
            })
        }
    })
}
// test
let p1 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(1)
    }, 1000)
})
let p2 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(2)
    }, 2000)
})
let p3 = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve(3)
    }, 3000)
})
promiseAll([p3, p1, p2]).then(res => {
    console.log(res) // [3, 1, 2]
})


Promise.race = function (args) {
    return new Promise((resolve, reject) => {
        for (let i = 0, len = args.length; i < len; i++) {
            args[i].then(resolve, reject)
        }
    })
}

// 函数防抖的实现
function debounce(fn, wait) {
    let timer = null;

    return function () {
        let context = this,
            args = arguments;

        // 如果此时存在定时器的话，则取消之前的定时器重新记时
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }

        // 设置定时器，使事件间隔指定事件后执行
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, wait);
    };
}


// 函数节流的实现;
function throttle(fn, delay) {
    let curTime = Date.now();

    return function () {
        let context = this,
            args = arguments,
            nowTime = Date.now();

        // 如果两次时间间隔超过了指定时间，则执行函数。
        if (nowTime - curTime >= delay) {
            curTime = Date.now();
            return fn.apply(context, args);
        }
    };
}


function getType(value) {
    // 判断数据是 null 的情况
    if (value === null) {
        return value + "";
    }
    // 判断数据是引用类型的情况
    if (typeof value === "object") {
        let valueClass = Object.prototype.toString.call(value),
            type = valueClass.split(" ")[1].split("");
        type.pop();
        return type.join("").toLowerCase();
    } else {
        // 判断数据是基本数据类型的情况和函数的情况
        return typeof value;
    }
}

// call函数实现
Function.prototype.myCall = function (context) {
    // 判断调用对象
    if (typeof this !== "function") {
        console.error("type error");
    }
    // 获取参数
    let args = [...arguments].slice(1),
        result = null;
    // 判断 context 是否传入，如果未传入则设置为 window
    context = context || window;
    // 将调用函数设为对象的方法
    context.fn = this;
    // 调用函数
    result = context.fn(...args);
    // 将属性删除
    delete context.fn;
    return result;
};

// apply 函数实现
Function.prototype.myApply = function (context) {
    // 判断调用对象是否为函数
    if (typeof this !== "function") {
        throw new TypeError("Error");
    }
    let result = null;
    // 判断 context 是否存在，如果未传入则为 window
    context = context || window;
    // 将函数设为对象的方法
    context.fn = this;
    // 调用方法
    if (arguments[1]) {
        result = context.fn(...arguments[1]);
    } else {
        result = context.fn();
    }
    // 将属性删除
    delete context.fn;
    return result;
};


// bind 函数实现
Function.prototype.myBind = function (context) {
    // 判断调用对象是否为函数
    if (typeof this !== "function") {
        throw new TypeError("Error");
    }
    // 获取参数
    var args = [...arguments].slice(1),
        fn = this;
    return function Fn() {
        // 根据调用方式，传入不同绑定值
        return fn.apply(
            this instanceof Fn ? this : context,
            args.concat(...arguments)
        );
    };
};



function curry(fn, args) {
    // 获取函数需要的参数长度
    let length = fn.length;

    args = args || [];

    return function () {
        let subArgs = args.slice(0);

        // 拼接得到现有的所有参数
        for (let i = 0; i < arguments.length; i++) {
            subArgs.push(arguments[i]);
        }

        // 判断参数的长度是否已经满足函数所需参数的长度
        if (subArgs.length >= length) {
            // 如果满足，执行函数
            return fn.apply(this, subArgs);
        } else {
            // 如果不满足，递归返回科里化的函数，等待参数的传入
            return curry.call(this, fn, subArgs);
        }
    };
}

// es6 实现
function curry(fn, ...args) {
    return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args);
}



function compose(...funcs) {
    if (funcs.length === 0) {
        return arg => arg;
    }

    if (funcs.length === 1) {
        return funcs[0];
    }

    return funcs.reduce((a, b) => (...args) => a(b(...args)));
}