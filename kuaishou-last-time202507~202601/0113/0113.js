// new

function myNew() {
    let obj = {};
    let constructor = Array.prototype.shift.call(arguments);
    obj.__proto__ = constructor.prototype;
    let result = constructor.apply(obj, arguments);
    return typeof result === 'object' && result !== null ? result : obj;
}

// instanceof

function myInstanceof(left, right) {
    let prototype = right.prototype;
    left = Object.getPrototypeOf(left);
    while (true) {
        if (left === null) return false;
        if (left === prototype) return true;
        left = Object.getPrototypeOf(left);
    }
}

// apply 
Function.prototype.myApply = function (context, args) {
    context = context || window;
    context.fn = this;
    let result;
    if (!args) {
        result = context.fn();
    } else {
        result = context.fn(...args);
    }
    delete context.fn;
    return result;
}

// call
Function.prototype.myCall = function (context, ...args) {
    context = context || window;
    context.fn = this;
    let result = context.fn(...args);
    delete context.fn;
    return result;
}
// bind
Function.prototype.myBind = function (context, ...args1) {
    let fn = this;
    return function (...args2) {
        return fn.apply(context, [...args1, ...args2]);
    }
}

// debounce
function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}

// debounce immediate
function debounceImmediate(fn, delay, immediate) {
    let timer = null;
    let result;
    return function (...args) {
        let isExecute = !timer && immediate;
        if (timer) clearTimeout(timer);
        if (isExecute) {
            result = fn.apply(this, args);
            timer = setTimeout(() => {
                timer = null;
            }, delay);
        } else {
            timer = setTimeout(() => {
                fn.apply(this, args);
                timer = null;
            }, delay);
        }

        return result;
    }
}

// throttle
function throttle(fn, delay) {
    let last = Date.now();
    return function (...args) {
        let now = Date.now();
        if (now - last >= delay) {
            last = now;
            fn.apply(this, args);
        }
    }
}

// z字打印二叉树
function zigzagLevelOrder(root) {
    if (!root) return [];
    let result = [];
    let queue = [root];
    let flag = true;
    while (queue.length) {
        let size = queue.length;
        let currentLevel = [];
        for (let i = 0; i < size; i++) {
            let node = queue.shift();
            currentLevel.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        if (!flag) {
            currentLevel.reverse();
        }
        result.push(currentLevel);
        flag = !flag;
    }
    return result;
}

// 示例 TreeNode 定义 (用于本地测试)
function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
}

// 示例测试用例
const root1 = new TreeNode(3,
    new TreeNode(9),
    new TreeNode(20,
        new TreeNode(15),
        new TreeNode(7)
    )
);
console.log(zigzagLevelOrder(root1)); // [[3], [20, 9], [15, 7]]

const root2 = new TreeNode(1);
console.log(zigzagLevelOrder(root2)); // [[1]]

const root3 = null;
console.log(zigzagLevelOrder(root3)); // []

// 原型链式继承
function Parent() {
    this.name = 'parent';
    this.colors = ['red', 'blue', 'green'];
}
Parent.prototype.getName = function () {
    return this.name;
}

function Child() {
    this.age = 10;
}
const parent1 = new Parent();
Child.prototype = parent1;
Child.prototype.constructor = Child;

const child1 = new Child();

console.log(child1.colors);
child1.colors.push('yellow');
console.log(child1.colors);
console.log(parent1.colors);
console.log(child1.name);

// 单例模式
function Singleton() {
    if (Singleton.instance) {
        return Singleton.instance;
    }
    this.name = 'singleton';
    Singleton.instance = this;
}
// 发布-订阅模式
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, listener) {
        if (this.events[event]) {
            this.events[event] = [...this.events[event], listener];
        } else {
            this.events[event] = listener;
        }
    }
    emit(event, ...args) {
        this.events[event].forEach(listener => listener(...args));
    }

    off(event, listener) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(item => item !== listener);
        }
    }
}


// async 
function asyncGenerator(genFn) {
    return function (...args) {
        const gen = genFn.apply(this, args);
        return new Promise((resolve, reject) => {
            function step(key, arg) {
                let info;
                try {
                    info = gen[key](arg);
                } catch (error) {
                    return reject(error);
                }
                const { value, done } = info;
                if (done) {
                    return resolve(value);
                } else {
                    return Promise.resolve(value).then(
                        val => step("next", val),
                        err => step("throw", err)
                    );
                }
            }
            step("next");
        });
    }
}

// url to params
function urlToParams(url) {
    let params = {};
    let queryString = url.split('?')[1];
    if (!queryString) return params;
    let pairs = queryString.split('&');
    for (let pair of pairs) {
        let [key, value] = pair.split('=');
        if (value) {
            if (params[key]) {
                params[key] = [].concat(params[key], decodeURIComponent(value));
            } else {
                params[key] = decodeURIComponent(value);
            }
        } else {
            params[key] = true;
        }
    }
    return params;
}
console.log(urlToParams('http://www.baidu.com?name=zhangsan&age=18&skill=js&skill=node'));
// 二叉树的前序遍历 中左右
function preorderTraversal(root) {
    if (!root) return [];
    let result = [];
    let stack = [root];
    while (stack.length) {
        let node = stack.pop();
        result.push(node.val);
        if (node.right) stack.push(node.right);
        if (node.left) stack.push(node.left);
    }
    return result;
}

// 二叉树的中序遍历 左中右
function inorderTraversal(root) {
    if (!root) return [];
    let result = [];
    let stack = [];
    let current = root;
    while (current || stack.length) {
        while (current) {
            stack.push(current);
            current = current.left;
        }
        current = stack.pop();
        result.push(current.val);
        current = current.right;
    }
    return result;
}
console.log(inorderTraversal(root1));
console.log(preorderTraversal(root1));
// 二叉树的后序遍历 左右中
function postorderTraversal(root) {
    if (!root) return [];
    let result = [];
    let stack = [root];
    while (stack.length) {
        let node = stack.pop();
        result.push(node.val);
        if (node.left) stack.push(node.left);
        if (node.right) stack.push(node.right);
    }
    return result.reverse();
}
// 求二叉树的层序遍历
function levelOrder(root) {
    if (!root) return [];
    let result = [];
    let queue = [root];
    while (queue.length) {
        let size = queue.length;
        let currentLevel = [];
        for (let i = 0; i < size; i++) {
            let node = queue.shift();
            currentLevel.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        result.push(currentLevel);
    }
    return result;
}

// 按之字形顺序打印二叉树
function zigzagLevelOrder(root) {
    if (!root) return [];
    let result = [];
    let queue = [root];
    let flag = true;
    while (queue.length) {
        let size = queue.length;
        let currentLevel = [];
        for (let i = 0; i < size; i++) {
            let node = queue.shift();
            currentLevel.push(node.val);
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        if (!flag) {
            currentLevel.reverse();
        }
        result.push(currentLevel);
        flag = !flag;
    }
    return result;
}
// 二叉树的最大深度
function maxDepth(root) {
    if (!root) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
// 二叉树中和为某一值的路径(一)
function pathSum(root, targetSum) {}
    let result = [];
    function dfs(node, currentPath, currentSum) {
        if (!node) return;
        currentPath.push(node.val);
        currentSum += node.val;
        if (!node.left && !node.right && currentSum === targetSum) {
            result.push([...currentPath]);
        }
        dfs(node.left, currentPath, currentSum);
        dfs(node.right, currentPath, currentSum);
        currentPath.pop();
    }
    dfs(root, [], 0);
    return result;
}
// 二叉搜索树与双向链表
// 对称的二叉树
function isSymmetric(root) {
    if (!root) return true;
    function isMirror(node1, node2) {
        if (!node1 && !node2) return true;
        if (!node1 || !node2) return false;
        return node1.val === node2.val && isMirror(node1.left, node2.right) && isMirror(node1.right, node2.left);
    }
    return isMirror(root.left, root.right);
}
// 合并二叉树
function mergeTrees(root1, root2) {
    if (!root1) return root2;
    if (!root2) return root1;
    root1.val += root2.val;
    root1.left = mergeTrees(root1.left, root2.left);
    root1.right = mergeTrees(root1.right, root2.right);
    return root1;
}

// 二叉树的镜像
function mirrorTree(root) {
    if (!root) return null;
    let temp = root.left;
    root.left = mirrorTree(root.right);
    root.right = mirrorTree(temp);
    return root;
}
// 判断是不是二叉搜索树
function isValidBST(root) {
    if (!root) return true;
    let stack = [root];
    let prev = null;
    while (stack.length) {
        let node = stack.pop();
        if (node) {
            if (node.right) stack.push(node.right);
            stack.push(node);
            stack.push(null);
            if (node.left) stack.push(node.left);
        }
    }
}

// 判断是不是完全二叉树

function isValidBST(root) {
    if (!root) return true;
    let stack = [root];
    let prev = null;
    while (stack.length) {
        let node = stack.pop();
        if (node) {
            if (node.right) stack.push(node.right);
            stack.push(node);
            stack.push(null);
            if (node.left) stack.push(node.left);
        } else {
            node = stack.pop();
            if (prev !== null && node.val <= prev) return false;
            prev = node.val;
        } 
    }
    return true;
}
// 判断是不是平衡二叉树
function isBalanced(root) {
    if (!root) return true;
    let leftHeight = maxDepth(root.left);
    let rightHeight = maxDepth(root.right);
    return Math.abs(leftHeight - rightHeight) <= 1 && isBalanced(root.left) && isBalanced(root.right);
}
// 二叉搜索树的最近公共祖先
function lowestCommonAncestor(root, p, q) {
    if (!root) return null; 
    return root.val > p.val && root.val > q.val ? 
    lowestCommonAncestor(root.left, p, q) : root.val < p.val && root.val < q.val ? lowestCommonAncestor(root.right, p, q) : root;
}
// 用两个栈实现队列
class MyQueue {
    constructor() {
        this.stack1 = [];
        this.stack2 = [];
    }
    push(x) {
        this.stack1.push(x);
    }
    pop() {
        if (this.stack2.length === 0) {
            while (this.stack1.length !== 0) {
                this.stack2.push(this.stack1.pop());
            }
        }
        return this.stack2.pop();
    }
    peek() {
        if (this.stack2.length === 0) {
            while (this.stack1.length !== 0) {
                this.stack2.push(this.stack1.pop());
            }
        }
        return this.stack2[this.stack2.length - 1];
    }
    empty() {
        return this.stack1.length === 0 && this.stack2.length === 0;
    }
    
    

}  
// 包含栈的min函数
class MinStack { 
    constructor() {
        this.stack = [];
        this.minStack = [];
    }
    push(x) {
        this.stack.push(x);
        if (this.minStack.length === 0 || x <= this.minStack[this.minStack.length - 1]) {
            this.minStack.push(x);
        }
    }
    pop() {
        let x = this.stack.pop();
        if (x === this.minStack[this.minStack.length - 1]) {
            this.minStack.pop();
            this.minStack.pop();    
        }   
        return x;
    }
    top() {
        return this.stack[this.stack.length - 1];
    }
    getMin() {
        return this.minStack[this.minStack.length - 1];
    }
}

// 包含min函数的栈
// 有效括号序列
// 滑动窗口的最大值

// 最小的K个数
 function getLeastNumbers(arr, k) {
    arr.sort((a, b) => a - b);
    return arr.slice(0, k);
}

// 寻找第K大
function findKthLargest(nums, k) {
    nums.sort((a, b) => b - a);
    return nums[k - 1];
}
 
// 数据流中的中位数
function mid(array){
    array.sort((a,b)=>a-b);
    let mid = Math.floor(n / 2);
    return array[mid];
}
// 表达式求值
