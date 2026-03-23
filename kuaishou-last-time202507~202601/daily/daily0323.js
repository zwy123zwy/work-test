
// s手撕：
// 1.实现一个useeffect一样功能的hooks，但是第一次不执行副作用
import { useEffect, useRef } from 'react';

function useCustomEffect(effect, deps) {
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        return effect();
    }, deps);
}


// 2.给一个[{tag:1,name:'alice'},{tag:'str',name:'bob'},{tag:'哈哈',name:'jack'}]的数据实现一个函数返回[1,'str','哈哈']
function extractTags(data) {
    return data.map(item => item.tag);
}

// 为什么import一个东西只打包一个东西

// 再做一个笔试题

// 1. 字符串转小写后按照字典排序并去重（5分钟）
// 2. 看到你用for遍历来去重的，有没有其他优化方案去重--Set、Map，API：filter、indexOf等高级语法
// 3. 那filter会修改原数组吗

// **数组的扁平化**（flat 实现）
function flattenArray(arr) {
    const result = [];
    arr.forEach(item => {
        if (Array.isArray(item)) {
            result.push(...flattenArray(item));
        } else {
            result.push(item);
        }
    });
    return result;
}

// **二维数组中的查找**（剑指 Offer 原题，行列递增矩阵查找 target）
function searchMatrix(matrix, target) {
    if (!matrix.length || !matrix[0].length) return false;
    let row = matrix.length - 1;
    let col = 0;
    while (row >= 0 && col < matrix[0].length) {
        if (matrix[row][col] === target) {
            return true;
        } else if (matrix[row][col] > target) {
            row--;
        } else {
            col++;
        }
    }
    return false;

}

// **手写代码**：

// - 组合继承（原型链分析）
function Parent(name) {
    this.name = name;
}
Parent.prototype.sayHello = function () {
    console.log(`Hello, I'm ${this.name}`);
}

function Child(name, age) {
    Parent.call(this, name); // 继承父类属性
    this.age = age;
}
Child.prototype = Object.create(Parent.prototype); // 继承父类方法
Child.prototype.constructor = Child; // 修正构造函数指向
// - 实现 `Async` 函数
function Async(generatorFunc) {
    return function (...args) {
        const generator = generatorFunc(...args);   
        return new Promise((resolve, reject) => {
            function step(nextFunc) {
                let next;   
                try {
                    next = nextFunc();
                } catch (error) {
                    return reject(error);
                }
                if (next.done) {
                    return resolve(next.value);
                }
                Promise.resolve(next.value).then(
                    (v) => step(() => generator.next(v)),
                    (e) => step(() => generator.throw(e))
                );
            }   
            step(() => generator.next());
        });
    }
}


// lis

function lengthOfLIS(nums) {
    if (!nums.length) return 0;
    const dp = new Array(nums.length).fill(1);
    for (let i = 1; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }   
        }
    }
    return Math.max(...dp);
}

MyPromise.allSettled = function (promises) {
    return new MyPromise((resolve) => {
        let results = [];
        let completed = 0;
        promises.forEach((promise, index) => {
            MyPromise.resolve(promise).then(
                (value) => {    
                    results[index] = { status: "fulfilled", value };
                    completed++;    
                    if (completed === promises.length) {
                        resolve(results);
                    }
                },
                (reason) => {
                    results[index] = { status: "rejected", reason };
                    completed++;
                    if (completed === promises.length) {
                        resolve(results);
                    }
                });
        });
    });
}