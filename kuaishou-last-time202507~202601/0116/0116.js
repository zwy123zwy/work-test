/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
    let pre = null;
    let cur = head;
    while (cur) {
        let next = cur.next;
        cur.next = pre;
        pre = cur;
        cur = next;
    }
    return pre;

};

class ListNode {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}
let node1 = new ListNode(1);
node1.next = new ListNode(2);
node1.next.next = new ListNode(3);
node1.next.next.next = new ListNode(4);
node1.next.next.next.next = new ListNode(5);
console.log(JSON.stringify(reverseList(node1)));


/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
    const set = new Set();//Set ES6新增
    const len = s.length;
    let left = 0, right = 0;
    let max = 0;
    while (right < len) {
        if (!set.has(s.charAt(right))) {
            set.add(s.charAt(right));
            right++;
        } else {
            set.delete(s.charAt(left));
            left++;
        }
        max = Math.max(max, set.size);
    }
    return max;
}

// 快速排序
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArray = function (nums) {

    function quickSort(nums, left, right) {
        if (left >= right) return;
        let pivot = nums[left];
        let i = left;
        let j = right;
        while (i < j) {
            while (nums[j] >= pivot && i < j) j--;
            while (nums[i] <= pivot && i < j) i++;
            [nums[i], nums[j]] = [nums[j], nums[i]]
        }
        [nums[left], nums[i]] = [nums[i], nums[left]];
        quickSort(nums, left, i - 1);
        quickSort(nums, i + 1, right);
        return nums;
    }

    return quickSort(nums, 0, nums.length - 1);
};
console.log(sortArray([5, 2, 3, 1]));

/**
 * @param {number} capacity
 */
var LRUCache = function (capacity) {
    this.capacity = capacity;
    this.cache = new Map();
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function (key) {
    if (this.cache.has(key)) {
        let value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }
    return -1;
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function (key, value) {
    // 如果key已存在，先删除它，再重新添加（这样更新顺序）
    if (this.cache.has(key)) {
        this.cache.delete(key);
    } else {
        // 如果缓存满了，并且当前添加的key不存在，则需要删除最久未使用的元素
        if (this.cache.size >= this.capacity) {
            // 获取最久未使用的key
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
    }

    // 设置新的键值对
    this.cache.set(key, value);
};


/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function (nums) {
    let dp = new Array(nums.length).fill(0);
    for (let i = 1; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    return Math.max(...dp);

};
console.log([3, 1, 2].sort((a, b) => a - b));


class EventEmitter {
    constructor() {
        this.listeners = {};
    }

    /**
     * 注册事件
     * @param {string} type 事件类型
     * @param {function} fn 事件处理函数
     */
    on(type, fn) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(fn);
    }

    /**
     * 发布事件
     * @param {string} type 事件类型
     * @param  {...any} args 事件参数
     */
    emit(type, ...args) {
        if (this.listeners[type]) {
            this.listeners[type].forEach(fn => fn(...args));
        }
    }

    /**
     * 移除某个类型的一个事件
     * @param {string} type 事件类型
     * @param {function} fn 事件处理函数
     */
    off(type, fn) {
        if (this.listeners[type]) {
            this.listeners[type] = this.listeners[type].filter(item => item !== fn);
            if (this.listeners[type].length === 0) {
                delete this.listeners[type];
            }
        }
    }

    /**
     * 移除某个类型的所有事件
     * @param {string} type 事件类型
     */
    offAll(type) {
        if (this.listeners[type]) {
            delete this.listeners[type];
        }
    }
}

// import React, { useState, useEffect } from 'react'
// import useCountDown from './useCountDown'
// const useCountDown = (num) => {
//     const [seconds, setSecond] = useState(num)
//     useEffect(() => {
//         setTimeout(() => {
//             if (seconds > 0) {
//                 setSecond(c => c - 1);
//             }
//         }, 1000);
//     }, [seconds]);
//     return [seconds, setSecond]
// }


Promise.race = (promiseArray) => {
    return new Promise((resolve, reject) => {
        promiseArray.forEach((item) => {
            Promise.resolve(item).then(
                (val) => {
                    resolve(val);
                },
                (reason) => {
                    reject(reason);
                },
            );
        });
    });
};

function parse(url) {
    // 一、夹杂在 ? 与 # 之前的字符就是 qs，使用 /\?([^/?#:]+)#?/ 正则来抽取
    // 使用正则从 URL 中解析出 querystring
    // 二、通过 Optional Chain 来避免空值错误
    const queryString = url.match(/\?([^/?#:]+)#?/)?.[1];

    if (!queryString) {
        return {};
    }

    queryObj = queryString.split("&").reduce((params, block) => {
        // 三、如果未赋值，则默认为空字符串
        const [_k, _v = ""] = block.split("=");
        // 四、通过 decodeURIComponent 来转义字符，切记不可出现在最开头，以防 ?tag=test&title=1%2B1%3D2 出错
        const k = decodeURIComponent(_k);
        const v = decodeURIComponent(_v);

        if (params[k] !== undefined) {
            // 处理 key 出现多次的情况，设置为数组
            params[k] = [].concat(params[k], v);
        } else {
            params[k] = v;
        }
        return params;
    }, {});
    return queryObj;
}


Promise.any = (promiseArray) => {
    return new Promise((resolve, reject) => {
        const _promiseArray = Array.from(promiseArray);
        const length = _promiseArray.length;
        const rejectedArray = [];
        _promiseArray.forEach((item) => {
            Promise.resolve(item).then(
                (val) => {
                    resolve(val);
                },
                (reason) => {
                    rejectedArray.push(reason);
                    if (rejectedArray.length === length) {
                        reject(new AggregateError(rejectedArray));
                    }
                },
            );
        });
    });
};



function pAll(_promises) {
    return new Promise((resolve, reject) => {
        // Iterable => Array
        const promises = Array.from(_promises);
        // 结果用一个数组维护
        const r = [];
        const len = promises.length;
        let count = 0;
        for (let i = 0; i < len; i++) {
            // Promise.resolve 确保把所有数据都转化为 Promise
            Promise.resolve(promises[i])
                .then((o) => {
                    // 因为 promise 是异步的，保持数组一一对应
                    r[i] = o;

                    // 如果数组中所有 promise 都完成，则返回结果数组
                    if (++count === len) {
                        resolve(r);
                    }
                    // 当发生异常时，直接 reject
                })
                .catch((e) => reject(e));
        }
    });
}


setTimeout(() => {
    console.log("A"); // 7
    Promise.resolve().then(() => {
        console.log("B"); // 8
    });
}, 1000);

Promise.resolve().then(() => {
    console.log("C"); // 4
});

new Promise((resolve) => {
    console.log("D"); //1
    resolve("");
}).then(() => {
    console.log("E"); //5
});

async function sum(a, b) {
    console.log("F"); //2
}

async function asyncSum(a, b) {
    await Promise.resolve();
    console.log("G"); //6
    return Promise.resolve(a + b);
}

sum(3, 4);
asyncSum(3, 4);
console.log("H"); //3


function fun(arr, n, sum) {
    let result = [];
    if (arr.length < n) return -1;
    arr.sort((prev, next) => {
        return prev - next;
    });
    function getSum(arr, n, currSum, index, incArr = []) {
        for (let i = index; i < arr.length; i++) {
            let temp = currSum + arr[i];
            if (temp > sum) break;

            if (n > 1) {
                getSum(arr, n - 1, temp, i + 1, [arr[i], ...incArr]);
            }

            if (n === 1 && temp === sum) {
                result.push([arr[i], ...incArr]);
            }
        }
    }
    getSum(arr, n, 0, 0);
    return result;
}