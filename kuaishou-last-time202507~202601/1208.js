/**
 * 手写高性能事件总线 (JavaScript 设计模式)
题目描述： 实现一个 EventEmitter 类，具备 on, emit, off, once 方法。 限制条件：

off 方法如果不传 callback，移除该事件所有监听。
核心难点：在 emit 触发回调时，如果回调函数内部又调用了 off 移除自身或其他函数，如何保证循环不报错且逻辑正确？（数组塌陷问题）。
考察点：

发布订阅模式。
数组操作与副作用处理（通常需要 copy 数组副本进行遍历）。
this 指向问题
*/

class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(eventName, callback) {
        if (typeof callback !== "function") {
            throw new Error("Callback must be a function");
        }
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    emit(eventName, ...args) {
        const callbacks = this.events[eventName];
        if (!callbacks) return;

        // 【关键修复1】浅拷贝数组
        // 防止回调内部执行 off 导致数组长度变化，从而跳过某些回调
        [...callbacks].forEach((callback) => {
            // 注意：这里需要判断 callback 是否还存在于原始数组中？
            // 某些实现策略允许执行已解绑的（如果它是通过拷贝执行），
            // 另一些策略则要求严格一致。通常拷贝执行更安全，防止索引错乱。
            callback.apply(this, args);
        });
    }

    off(eventName, callback) {
        const callbacks = this.events[eventName];
        if (!callbacks) return;

        if (!callback) {
            delete this.events[eventName];
            return;
        }

        this.events[eventName] = callbacks.filter((item) => {
            // 【关键修复2】同时匹配原始回调和 once 包装器的原始引用
            return item !== callback && item.fn !== callback;
        });
    }

    once(eventName, callback) {
        const onceCallback = (...args) => {
            this.off(eventName, callback); // 注意：这里最好传原始 callback 配合上面的修复逻辑
            callback.apply(this, args);
        };
        // 【关键修复2】将原始 callback 挂载到包装器上，用于 off 匹配
        onceCallback.fn = callback;
        this.on(eventName, onceCallback);
    }
}

/**
 * 异步任务调度链 (Chain + Async Queue) - 经典 LazyMan 变体
题目描述： 实现一个 Task 类（或函数），支持链式调用，但要求支持同步与异步的混合顺序执行。

javascript
复制
new Task('Hank')
    .sleep(1000) // 等待 1秒
    .eat('Dinner') // 打印 Eat Dinner
    .sleepFirst(2000) // 核心：不管在链条哪写，必须最先执行，等待 2秒
    .work(); // 打印 Work

// 输出顺序：
// (等待2s) -> "Wake up after 2s" -> "Hi Hank" -> (等待1s) -> "Eat Dinner" -> "Work"
考察点：

任务队列：维护一个 queue 数组。
Promise / next 机制：如何控制“暂停”和“继续”。
Event Loop 理解：为什么需要 setTimeout(() => this.next(), 0) 来启动链条？
优先级处理：sleepFirst 需使用 unshift 插入队首，普通任务用 push。
 */

class Task {
    constructor(name) {
        this.name = name;
        this.queue = []; // 存放的是函数（Task Thunk），而不是 Promise 实例

        // 初始化第一个任务
        const fn = () => {
            console.log(`Hi ${this.name}`);
            this.next(); // 任务完成，驱动下一个
        };
        this.queue.push(fn);

        // 【关键点】利用宏任务机制，确保链式调用注册完毕后，再开始执行
        // 类似于 Event Loop 的 tick
        setTimeout(() => {
            this.next();
        }, 0);
    }

    // 辅助方法：统一处理 next 逻辑
    next() {
        const fn = this.queue.shift();
        // 这里的 fn 是一个函数，只有调用它，逻辑才真正开始执行
        fn && fn();
    }

    sleep(time) {
        const fn = () => {
            // 只有轮到这个函数执行时，定时器才开始计时
            setTimeout(() => {
                console.log(`Wake up after ${time / 1000}s`);
                this.next();
            }, time);
        };
        this.queue.push(fn);
        return this;
    }

    sleepFirst(time) {
        const fn = () => {
            setTimeout(() => {
                console.log(`Wake up after ${time / 1000}s (First)`);
                this.next();
            }, time);
        };
        // 插入到队首，注意：要插入到“初始化任务”之后吗？
        // 通常 LazyMan 的 sleepFirst 是要插到最最前面的（包括 Hi 之前）
        this.queue.unshift(fn);
        return this;
    }

    eat(food) {
        const fn = () => {
            console.log(`Eat ${food}`);
            this.next();
        };
        this.queue.push(fn);
        return this;
    }

    work() {
        const fn = () => {
            console.log(`Work`);
            this.next();
        };
        this.queue.push(fn);
        return this;
    }
}

new Task("Hank")
    .sleep(1000) // 等待 1秒
    .eat("Dinner") // 打印 Eat Dinner
    .sleepFirst(2000) // 核心：不管在链条哪写，必须最先执行，等待 2秒
    .work(); // 打印 Work

/**
* 带有“取消”和“立即执行”功能的防抖 (Debounce)
题目描述： 防抖（Debounce）是闭包最实用的场景。请手写一个增强版防抖：
支持 immediate 参数（立即执行）。
返回的函数有一个 .cancel() 方法，可以取消防抖等待（比如用户切走了页面，不希望回调再执行）。
function debounce(func, wait, immediate) {
  // 请实现...
}
// 用法
const task = debounce(() => console.log('run'), 1000);
task(); 
task.cancel(); // 任务被取消，不会打印
*/

function debounce(func, wait, immediate) {
    let timeout;

    const debounced = function () {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        if (immediate) {
            const callNow = !timeout;
            timeout = setTimeout(() => {
                timeout = null;
            }, wait);
            if (callNow) func.apply(this, arguments);
        } else {
            timeout = setTimeout(() => {
                func.apply(this, arguments);
            }, wait);
        }
    };
    debounced.cancel = function () {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };
    return debounced;
}
