/**
 * 滴滴前端面试 - 10道高频代码题（进阶版）
 * 包含：数组算法、字符串处理、继承、设计模式等
 * 
 * 作者：前端面试导师
 * 日期：2026-03-21
 */

// ============================================
// 1. 寄生组合式继承 🔥🔥🔥
// ============================================
/**
 * 题目：实现寄生组合式继承
 * 
 * 核心思想：
 * 1. 使用 Object.create() 创建父类原型的副本
 * 2. 子类原型指向这个副本
 * 3. 修复 constructor 指向
 * 
 * 优点：
 * - 只调用一次父类构造函数
 * - 避免了在子类原型上创建多余的属性
 * - 原型链保持完整
 */

function Parent(name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}

Parent.prototype.sayName = function () {
    console.log(this.name);
};

function Child(name, age) {
    // 借用构造函数继承属性
    Parent.call(this, name);
    this.age = age;
}

// 寄生组合式继承的核心
function inheritPrototype(child, parent) {
    // 创建父类原型的副本
    const prototype = Object.create(parent.prototype);
    // 修复 constructor 指向
    prototype.constructor = child;
    // 子类原型指向副本
    child.prototype = prototype;
}

inheritPrototype(Child, Parent);

Child.prototype.sayAge = function () {
    console.log(this.age);
};

// 测试
const child1 = new Child('小明', 18);
console.log(child1.name); // 小明
console.log(child1.age); // 18
child1.sayName(); // 小明
child1.sayAge(); // 18


// ============================================
// 2. 观察者模式（Observer） 🔥🔥🔥
// ============================================
/**
 * 题目：实现观察者模式
 * 
 * 核心概念：
 * - Subject（主题）：维护观察者列表，通知观察者
 * - Observer（观察者）：接收通知并执行更新
 * 
 * 应用场景：
 * - Vue 的响应式系统
 * - 事件监听
 * - 数据绑定
 */

class Subject {
    constructor() {
        this.observers = [];
    }

    // 添加观察者
    addObserver(observer) {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }

    // 移除观察者
    removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    // 通知所有观察者
    notify(message) {
        this.observers.forEach(observer => {
            observer.update(message);
        });
    }
}

class Observer {
    constructor(name) {
        this.name = name;
    }

    // 接收通知并更新
    update(message) {
        console.log(`${this.name} 收到消息: ${message}`);
    }
}

// 测试
const subject = new Subject();
const observer1 = new Observer('观察者1');
const observer2 = new Observer('观察者2');

subject.addObserver(observer1);
subject.addObserver(observer2);

subject.notify('大家好！'); // 观察者1 收到消息: 大家好！


// ============================================
// 3. JSONP 实现 🔥🔥
// ============================================
/**
 * 题目：手写 JSONP 实现
 * 
 * 核心原理：
 * 1. 创建 script 标签
 * 2. 设置回调函数名
 * 3. 服务端返回函数调用
 * 4. 执行回调函数
 * 
 * 优点：跨域请求
 * 缺点：只能 GET 请求，存在安全风险
 */

function jsonp(url, params = {}, callbackName = 'callback') {
    return new Promise((resolve, reject) => {
        // 创建 script 标签
        const script = document.createElement('script');

        // 生成回调函数名（避免冲突）
        const fnName = `jsonp_${Date.now()}_${Math.random().toString(36).substr(2)}`;

        // 将回调函数挂载到 window 上
        window[fnName] = function (data) {
            resolve(data);
            // 执行完后删除 script 标签和回调函数
            document.body.removeChild(script);
            delete window[fnName];
        };

        // 拼接参数
        const queryStr = Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');

        // 设置 script 的 src
        script.src = `${url}?${callbackName}=${fnName}&${queryStr}`;

        // 错误处理
        script.onerror = function () {
            reject(new Error('JSONP 请求失败'));
            document.body.removeChild(script);
            delete window[fnName];
        };

        // 添加到页面
        document.body.appendChild(script);
    });
}

// 使用示例
// jsonp('http://example.com/api', { name: '张三' })
//   .then(data => console.log(data))
//   .catch(err => console.error(err));


// ============================================
// 4. 数组扁平化（flatten）- 多种实现 🔥🔥🔥
// ============================================
/**
 * 题目：实现数组扁平化，支持指定深度
 * 
 * 面试话术：
 * 数组扁平化就是将多维数组转换为一维数组。我在面试中常用 4 种方法：
 * 1. 递归法：遍历数组，遇到数组就递归
 * 2. reduce：累加器，初始值为空数组
 * 3. while 迭代：使用扩展运算符，直到没有数组为止
 * 4. ES6 flat：最简单，但需要指定深度
 */

// 方法1：递归
function flatten1(arr, depth = Infinity) {
    const result = [];

    arr.forEach(item => {
        if (Array.isArray(item) && depth > 0) {
            result.push(...flatten1(item, depth - 1));
        } else {
            result.push(item);
        }
    });

    return result;
}

// 方法2：reduce
function flatten2(arr, depth = Infinity) {
    return arr.reduce((acc, item) => {
        if (Array.isArray(item) && depth > 0) {
            return acc.concat(flatten2(item, depth - 1));
        }
        return acc.concat(item);
    }, []);
}

// 方法3：while 迭代
function flatten3(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr);
    }
    return arr;
}

// 方法4：ES6 flat
function flatten4(arr, depth = Infinity) {
    return arr.flat(depth);
}

// 测试
const arr = [1, [2, [3, [4, [5]]]]];
console.log(flatten1(arr, 2)); // [1, 2, 3, [4, [5]]]
console.log(flatten1(arr)); // [1, 2, 3, 4, 5]


// ============================================
// 5. 数组去重 - 多种实现 🔥🔥🔥
// ============================================
/**
 * 题目：实现数组去重，支持对象数组
 * 
 * 面试话术：
 * 数组去重有多种实现方式，每种都有优缺点：
 * 1. Set：最简单，但无法去重对象数组
 * 2. filter + indexOf：兼容性好，但性能差
 * 3. reduce：简洁，但也要遍历
 * 4. Map：可以处理对象数组，性能好
 */

// 方法1：Set
function unique1(arr) {
    return [...new Set(arr)];
}

// 方法2：filter + indexOf
function unique2(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}

// 方法3：reduce
function unique3(arr) {
    return arr.reduce((acc, item) => {
        if (!acc.includes(item)) {
            acc.push(item);
        }
        return acc;
    }, []);
}

// 方法4：Map（支持对象数组）
function unique4(arr, key) {
    const map = new Map();
    return arr.filter(item => {
        const val = key ? item[key] : item;
        return !map.has(val) && map.set(val, true);
    });
}

// 测试
const arr1 = [1, 2, 2, 3, 3, 3];
console.log(unique1(arr1)); // [1, 2, 3]

const arr2 = [{ id: 1 }, { id: 1 }, { id: 2 }];
console.log(unique4(arr2, 'id')); // [{ id: 1 }, { id: 2 }]


// ============================================
// 6. 字符串反转 🔥🔥
// ============================================
/**
 * 题目：实现字符串反转，不使用 reverse()
 * 
 * 核心思路：
 * 1. 分割成数组
 * 2. 从后往前遍历
 * 3. 拼接成字符串
 */

// 方法1：for 循环
function reverseString1(str) {
    let result = '';
    for (let i = str.length - 1; i >= 0; i--) {
        result += str[i];
    }
    return result;
}

// 方法2：递归
function reverseString2(str) {
    if (str === '') return '';
    return reverseString2(str.substr(1)) + str[0];
}

// 方法3：reduce
function reverseString3(str) {
    return str.split('').reduce((acc, char) => char + acc, '');
}

// 方法4：split + reverse + join（面试官不让用 reverse 的话不能用）
function reverseString4(str) {
    return str.split('').reverse().join('');
}

// 测试
console.log(reverseString1('hello')); // olleh
console.log(reverseString2('hello')); // olleh
console.log(reverseString3('hello')); // olleh


// ============================================
// 7. 两数之和 🔥🔥🔥
// ============================================
/**
 * 题目：找出数组中两数之和等于目标值的索引
 * 
 * 核心思路：
 * 使用 Map 存储已遍历的数字，查找时间复杂度 O(1)
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 */

function twoSum(nums, target) {
    const map = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        // 如果 Map 中已经存在补数，直接返回
        if (map.has(complement)) {
            return [map.get(complement), i];
        }

        // 否则将当前数字存入 Map
        map.set(nums[i], i);
    }

    return [];
}

// 测试
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6)); // [1, 2]


// ============================================
// 8. 最长无重复子串 🔥🔥
// ============================================
/**
 * 题目：找出字符串中最长的不含重复字符的子串长度
 * 
 * 核心思路：滑动窗口
 * 1. 使用双指针维护窗口
 * 2. 右指针扩展窗口
 * 3. 遇到重复字符，左指针收缩窗口
 * 
 * 时间复杂度：O(n)
 * 空间复杂度：O(min(n, m))，m 为字符集大小
 */

function lengthOfLongestSubstring(s) {
    let maxLen = 0;
    let left = 0;
    const charSet = new Set();

    for (let right = 0; right < s.length; right++) {
        // 如果字符已存在，收缩左边界
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }

        // 添加字符到集合
        charSet.add(s[right]);

        // 更新最大长度
        maxLen = Math.max(maxLen, right - left + 1);
    }

    return maxLen;
}

// 测试
console.log(lengthOfLongestSubstring('abcabcbb')); // 3 (abc)
console.log(lengthOfLongestSubstring('bbbbb')); // 1 (b)
console.log(lengthOfLongestSubstring('pwwkew')); // 3 (wke)


// ============================================
// 9. 快速排序 🔥🔥🔥
// ============================================
/**
 * 题目：实现快速排序
 * 
 * 核心思路：分治法
 * 1. 选择基准元素（pivot）
 * 2. 分区：小于 pivot 的放左边，大于 pivot 的放右边
 * 3. 递归左右两部分
 * 
 * 时间复杂度：平均 O(n log n)，最坏 O(n²)
 * 空间复杂度：O(log n)
 */

function quickSort(arr) {
    // 递归终止条件
    if (arr.length <= 1) return arr;

    // 选择基准元素（中间元素）
    const pivotIndex = Math.floor(arr.length / 2);
    const pivot = arr[pivotIndex];

    // 分区
    const left = [];
    const right = [];

    for (let i = 0; i < arr.length; i++) {
        if (i === pivotIndex) continue;

        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    // 递归排序并合并
    return [...quickSort(left), pivot, ...quickSort(right)];
}

// 测试
console.log(quickSort([3, 1, 4, 1, 5, 9, 2, 6])); // [1, 1, 2, 3, 4, 5, 6, 9]


// ============================================
// 10. 二叉树层序遍历 🔥🔥
// ============================================
/**
 * 题目：实现二叉树的层序遍历（BFS）
 * 
 * 核心思路：
 * 使用队列（先进先出）
 * 1. 根节点入队
 * 2. 出队并访问
 * 3. 左右子节点入队
 * 4. 重复直到队列为空
 */

function levelOrder(root) {
    if (!root) return [];

    const result = [];
    const queue = [root];

    while (queue.length > 0) {
        const level = [];
        const size = queue.length;

        // 遍历当前层的所有节点
        for (let i = 0; i < size; i++) {
            const node = queue.shift();
            level.push(node.val);

            // 左右子节点入队
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        result.push(level);
    }

    return result;
}

// 测试
const tree = {
    val: 3,
    left: {
        val: 9,
        left: null,
        right: null
    },
    right: {
        val: 20,
        left: { val: 15, left: null, right: null },
        right: { val: 7, left: null, right: null }
    }
};

console.log(levelOrder(tree)); // [[3], [9, 20], [15, 7]]


// ============================================
// 面试技巧总结
// ============================================
/**
 * 1. 手写代码题的核心：
 *    - 理解原理比记住代码更重要
 *    - 能说出时间复杂度和空间复杂度
 *    - 能说出多种实现方式并对比优劣
 * 
 * 2. 答题步骤：
 *    ① 先说思路（面试官理解你的想法）
 *    ② 写代码（注意边界条件）
 *    ③ 说复杂度（时间、空间）
 *    ④ 说优化方案（如果有）
 * 
 * 3. 常见追问：
 *    - 时间复杂度是多少？
 *    - 空间复杂度是多少？
 *    - 能优化吗？
 *    - 有什么边界情况？
 *    - 能说出其他实现方式吗？
 */
