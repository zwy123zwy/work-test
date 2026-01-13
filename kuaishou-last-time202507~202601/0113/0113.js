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


