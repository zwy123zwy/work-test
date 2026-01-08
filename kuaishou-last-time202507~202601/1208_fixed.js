/**
 * 修复后的高性能事件总线
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

        // 使用副本遍历，防止回调内部调用 off 导致数组塌陷
        const callbacksCopy = [...callbacks];
        callbacksCopy.forEach((callback) => {
            // 检查回调是否仍然注册（可选的安全检查）
            if (this.events[eventName] && this.events[eventName].includes(callback)) {
                callback.apply(this, args);
            }
        });
    }

    off(eventName, callback) {
        const callbacks = this.events[eventName];
        if (!callbacks) return;

        if (!callback) {
            delete this.events[eventName];
            return;
        }

        // 过滤掉指定的回调函数
        this.events[eventName] = callbacks.filter((item) => {
            return item !== callback && item.fn !== callback;
        });
    }

    once(eventName, callback) {
        const onceCallback = (...args) => {
            // 先执行回调，再移除监听器
            callback.apply(this, args);
            this.off(eventName, onceCallback);
        };
        // 将原始回调挂载到包装器上，用于 off 匹配
        onceCallback.fn = callback;
        this.on(eventName, onceCallback);
    }
}

/**
 * 修复后的异步任务调度链
 */
class Task {
    constructor(name) {
        this.name = name;
        this.queue = [];
        this.isRunning = false;

        // 初始化第一个任务
        const fn = () => {
            console.log(`Hi ${this.name}`);
            this.next();
        };
        this.queue.push(fn);

        // 使用 setTimeout 确保链式调用注册完毕后再执行
        setTimeout(() => {
            this.start();
        }, 0);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.next();
    }

    next() {
        const fn = this.queue.shift();
        if (fn) {
            fn();
        } else {
            this.isRunning = false;
        }
    }

    sleep(time) {
        const fn = () => {
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
        // 插入到队列开头，确保最先执行
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

// 测试修复后的 Task
console.log('=== 测试修复后的 Task ===');
new Task("Hank")
    .sleep(1000)
    .eat("Dinner")
    .sleepFirst(2000)
    .work();

/**
 * 修复后的防抖函数
 */
function debounce(func, wait, immediate = false) {
    let timeout;
    let result;

    const debounced = function (...args) {
        const context = this;

        // 清除之前的定时器
        if (timeout) {
            clearTimeout(timeout);
        }

        if (immediate) {
            // 立即执行的逻辑
            const callNow = !timeout;
            timeout = setTimeout(() => {
                timeout = null;
            }, wait);

            if (callNow) {
                result = func.apply(context, args);
            }
        } else {
            // 延迟执行的逻辑
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        }

        return result;
    };

    // 取消方法
    debounced.cancel = function () {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };

    // 立即执行方法（flush）
    debounced.flush = function () {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
            func.apply(this, arguments);
        }
    };

    return debounced;
}

// 测试防抖函数
console.log('\n=== 测试防抖函数 ===');
const task = debounce(() => console.log('run'), 1000, true);
task();
task.cancel(); // 取消任务

setTimeout(() => {
    const task2 = debounce(() => console.log('run2'), 1000);
    task2();
    task2.flush(); // 立即执行
}, 2000);

/**
 * 节流函数实现
 */
function throttle(func, wait) {
    let timeout;
    let previous = 0;

    const throttled = function (...args) {
        const context = this;
        const now = Date.now();

        // 如果距离上次执行超过 wait 时间，则执行
        if (now - previous >= wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            func.apply(context, args);
            previous = now;
        } else if (!timeout) {
            // 否则设置定时器，在剩余时间后执行
            timeout = setTimeout(() => {
                func.apply(context, args);
                previous = Date.now();
                timeout = null;
            }, wait - (now - previous));
        }
    };

    throttled.cancel = function () {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        previous = 0;
    };

    return throttled;
}

// 测试节流函数
console.log('\n=== 测试节流函数 ===');
const throttledTask = throttle(() => console.log('throttled run'), 1000);
throttledTask();
throttledTask();
throttledTask();