const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    constructor(executor) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;

        const resolve = (value) => {
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;
            }
        }

        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;
            }
        }

        executor(resolve, reject);
    }

    // 定义 then 方法
    then(onFulfilled, onRejected) {
        if (this.status === FULFILLED) {
            onFulfilled(this.value);
        }

        if (this.status === REJECTED) {
            onRejected(this.reason);
        }
    }

}

module.exports = MyPromise;


const myFlat = arr => {
    return arr.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? myFlat(cur) : cur);
    }, []);
};


const myFlat = (arr) => {
    let newArr = [];
    let cycleArray = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            if (Array.isArray(item)) {
                cycleArray(item);
                continue;
            } else {
                newArr.push(item);
            }
        }
    }
    cycleArray(arr);
    return newArr;
}



/**
 * @param {*} target 需要被拷贝的对象
 * @param {*} hash   性能考虑不用 Map，使用弱引用的 WeakMap
 * @returns
 */
function deepClone(target, hash = new WeakMap) {
    // null 和 undefiend 是不需要拷贝的
    if (target == null) { return target; }
    // RegExp 和 Date 这两种特殊值暂不考虑
    if (target instanceof RegExp) { return new RegExp(target) }
    if (target instanceof Date) { return new Date(target) }
    // 基本数据类型直接返回即可，函数暂不考虑
    if (typeof target != 'object') return target;
    // 针对 [] {} 两种类型，基于它们的构造函数来实例化一个新的对象实例
    let clonedTarget = new target.constructor();
    // 说明是一个已经拷贝过的对象，那么直接返回即可，防止循环引用
    if (hash.get(target)) {
        return hash.get(target)
    }
    // 记录下已经拷贝过的对象
    hash.set(target, clonedTarget);
    // 遍历对象的 key，in 会遍历当前对象上的属性 和 __proto__ 指向的属性
    for (let key in target) {
        // 如果 key 是对象自有的属性
        if (target.hasOwnProperty(key)) {
            // 如果值依然是对象，就继续递归拷贝
            clonedTarget[key] = deepClone(target[key], hash);
        }
    }
    return clonedTarget
}


const shallowClone = (target) => {
    if (typeof target === 'object' && target !== null) {
        const cloneTarget = Array.isArray(target) ? [] : {};
        for (let prop in target) {
            if (target.hasOwnProperty(prop)) { // 遍历对象自身可枚举属性（不考虑继承属性和原型对象）
                cloneTarget[prop] = target[prop];
            }
        }
        return cloneTarget;
    } else {
        return target;
    }
}


class LRUCache6 {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) {
            return -1;
        }
        let value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
    }

    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        if (this.cache.size >= this.capacity) {
            let key = this.cache.keys().next().value;
            this.cache.delete(key);
        }
        this.cache.set(key, value);
    }

    toString() {
        console.log('capacity', this.capacity);
        console.table(this.cache);
    }
}

// function sleep(delay: number): Promise<void> {
//     return new Promise(resolve => {
//         setTimeout(resolve, delay);
//     });
// }


let timer = null;
function myInterval(cb, delay) {
    let interval = () => {
        cb();
        timer = setTimeout(interval, delay);  // 递归执行
    }
    timer = setTimeout(interval, delay); //触发执行
}
myInterval(() => { console.log('I am Jack') }, 1000)


function asyncToGenerator(generatorFunc) {
    //传入一个生成器函数
    //返回一个新的函数
    return function () {
        //先调用generator函数生成<迭代器>
        const gen = generatorFunc.apply(this, arguments);
        //返回一个promise
        return new Promise((resolve, reject) => {
            //内部定义一个step函数来源 用来一步步跨过yield的阻碍
            //key有next和throw两种取值,分别对应了gen的next和throw方法
            //arg参数则是用来promise resolve得带的值交给下一个yield
            function step(key, arg) {
                let generatorResult;

                try {
                    generatorResult = gen[key](arg);
                } catch (err) {
                    return reject(err);
                }
                //gen.next()得到的结果是一个{value,done}的结构
                const { value, done } = generatorResult;
                if (done) {
                    //已经完成
                    return resolve(value);
                } else {
                    return Promise.resolve(
                        //对value不是promise的情况包裹一层
                        value //这个value对应的是yield后面的promise
                    ).then(
                        function onResolve(val) {
                            step("next", val);
                        },
                        function onReject(err) {
                            step("throw", err);
                        }
                    );
                }
            }
            step("next"); //第一次调用next
        });
    };
}
function fn(nums) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(nums * 2);
        }, 1000);
    });
}
function* gen() {
    const num1 = yield fn(1);
    console.log(num1); // 2
    const num2 = yield fn(num1);
    console.log(num2); // 4
    const num3 = yield fn(num2);
    console.log(num3); // 8
    return num3;
}
const testGAsync = asyncToGenerator(gen);
// 返回的是一个函数,函数调用返回一个promise
testGAsync().then(res => {
    console.log(res);
});
//对应上面的gen()
async function asyncFn() {
    const num1 = await fn(1);
    console.log(num1); // 2
    const num2 = await fn(num1);
    console.log(num2); // 4
    const num3 = await fn(num2);
    console.log(num3); // 8
    return num3;
}
asyncFn()

let arr = [1, 2, 3, 4]
let proxy = new Proxy(arr, {
    get(target, key) {
        if (key < 0) {
            return target[target.length + parseInt(key)]
        }
        return target[key]
    }
})
console.log(proxy[-2]);
console.log(proxy[2]);


Array.prototype.bubbleSort = function () {
    for (let i = 0; i < this.length - 1; i++) {
        for (let j = 0; j < this.length - 1 - i; j++) {
            if (this[j] > this[j + 1]) {
                const temp = this[j + 1];
                this[j + 1] = this[j];
                this[j] = temp;
            }
        }
    }
}
// O(n^2), 冒泡排序
const arr1 = [6, 5, 4, 3, 2, 1];
arr1.bubbleSort();

Array.prototype.selectionSort = function () {
    for (let i = 0; i < this.length - 1; i++) {
        let indexMin = i;
        for (let j = i; j < this.length; j++) {
            if (this[j] < this[indexMin]) {
                indexMin = j;
            }
        }
        // 如果最小值的位置就是i就不用交换
        if (indexMin !== i) {
            const temp = this[i];
            this[i] = this[indexMin];
            this[indexMin] = temp;
        }
    }
}
// 时间复杂度O(n^2)
const arr2 = [6, 5, 4, 3, 2, 1];
arr2.selectionSort();

Array.prototype.quickSort = function () {
    const rec = (arr) => {
        if (arr.length < 2) { return arr; }
        const left = [];
        const right = [];
        const mid = arr[0];
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < mid) {
                left.push(arr[i]);
            } else {
                right.push(arr[i]);
            }
        }
        return [...rec(left), mid, ...rec(right)];
    };

    const res = rec(this);
    // 把arr里面的值改为res
    res.forEach((n, i) => {
        this[i] = n;
    })
}
// 递归时间复杂度O(logN),分区时间复杂度O(n),总体时间复杂度为O(nlogN);
const arr3 = [6, 5, 4, 3, 2, 1];
arr3.quickSort();


Array.prototype.insertionSort = function () {
    for (let i = 1; i < this.length; i++) {
        const temp = this[i];
        let j = i;
        // 寻找插入的位置
        while (j > 0) {
            if (this[j - 1] > temp) {
                this[j] = this[j - 1];
            } else {
                break;
                // 此时j为应该插入的位置
            }
            j--;
        }
        this[j] = temp;
    }
}
// 时间复杂度O(n^2)
const arr4 = [2, 5, 4, 8, 2, 1];
arr4.insertionSort();

Array.prototype.mergeSort = function () {
    const rec = (arr) => {
        if (arr.length === 1) { return arr; }
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid, arr.length);
        const orderLeft = rec(left);
        const orderRight = rec(right);
        const res = [];
        while (orderLeft.length || orderRight.length) {
            if (orderLeft.length && orderRight.length) {
                res.push(orderLeft[0] < orderRight[0] ? orderLeft.shift() : orderRight.shift());
            } else if (orderLeft.length) {
                res.push(orderLeft.shift());
            } else if (orderRight.length) {
                res.push(orderRight.shift());
            }
        }
        return res;
    }
    const res = rec(this);
    // 把arr里面的值改为res
    res.forEach((n, i) => {
        this[i] = n;
    })
}
// 分的时间复杂度O(logN)，并的时间复杂度O(n),总体时间复杂度是O(nlogN)
const arr5 = [2, 5, 4, 8, 2, 1];
arr5.mergeSort();


/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function (root) {
    if (!root) return [];
    let res = [];
    const dfs = (node) => {
        res.push(node.val);
        node.left && dfs(node.left)
        node.right && dfs(node.right)
    }
    dfs(root);
    return res;
};

var levelOrder = function (root) {
    if (!root) return [];
    let res = [];
    let queue = [root];

    while (queue.length) {
        //记录当前层级节点数
        let len = queue.length;
        //存放每一层的节点
        let curLevel = [];
        for (let i = 0; i < len; i++) {
            let node = queue.shift();
            curLevel.push(node.val);
            //存入下一层的节点
            node.left && queue.push(node.left);
            node.right && queue.push(node.right);
        }
        res.push(curLevel);
    }
    return res;
};


function invertTree(root) {
    if (!root) return root;
    invertTree(root.left);
    invertTree(root.right);
    [root.left, root.right] = [root.right, root.left];
    return root;
};

/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root) {
    if (!root) return 0;
    let res = 0;
    const queue = [root];

    while (queue.length) {
        let len = queue.length;
        while (len--) {
            let node = queue.shift();
            node.left && queue.push(node.left)
            node.right && queue.push(node.right)
        }
        res++
    }
    return res;
};

function parseParam(url) {
    const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
    const paramsArr = paramsStr.split('&'); // 将字符串以 & 分割后存到数组中
    let paramsObj = {};
    // 将 params 存到对象中
    paramsArr.forEach(param => {
        if (/=/.test(param)) { // 处理有 value 的参数
            let [key, val] = param.split('='); // 分割 key 和 value
            val = decodeURIComponent(val); // 解码
            val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字
            if (paramsObj.hasOwnProperty(key)) { // 如果对象有 key，则添加一个值
                paramsObj[key] = [].concat(paramsObj[key], val);
            } else { // 如果对象没有这个 key，创建 key 并设置值
                paramsObj[key] = val;
            }
        } else { // 处理没有 value 的参数
            paramsObj[param] = true;
        }
    })
    return paramsObj;
}


Array.prototype._map = function (fn) {
    if (typeof fn !== "function") {
        throw Error('参数必须是一个函数');
    }
    const res = [];
    for (let i = 0, len = this.length; i < len; i++) {
        res.push(fn(this[i]));
    }
    return res;
}

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

