var LRUCache = function (capacity) {
    this.MaxLimited = capacity;
    this.hashMap = new Map();
    this.start = null;
    this.end = null;
    this.removeNode = (node) => {
        if (node.left) {
            node.left.right = node.right;
        } else {
            this.start = node.right;
        }

        if (node.right) {
            node.right.left = node.left;
        } else {
            this.end = node.left;
        }
    };
    this.addToTop = (node) => {
        node.right = this.start;
        node.left = null;
        if (this.start) {
            this.start.left = node;
        }
        this.start = node;
        if (!this.end) {
            this.end = node;
        }
    };
    this.createEntry = (key, value) => {
        return {
            key,
            value,
            left: null,
            right: null,
        };
    };
};

LRUCache.prototype.get = function (key) {
    if (this.hashMap.has(key)) {
        let item = this.hashMap.get(key);
        this.removeNode(item);
        this.addToTop(item);
        return item.value;
    }
    return -1;
};

LRUCache.prototype.set = function (key, value) {
    if (this.hashMap.has(key)) {
        let item = this.hashMap.get(key);
        item.value = value;
        this.removeNode(item);
        this.addToTop(item);
    } else {
        let newItem = this.createEntry(key, value);
        if (this.hashMap.size >= this.MaxLimited) {
            this.hashMap.delete(this.end.key);
            this.removeNode(this.end);
        }
        this.hashMap.set(key, newItem);
        this.addToTop(newItem);
    }
};

class Node<V> {
    declare public val: V;
    declare public next: Node<V> | null;
    declare public prev: Node<V> | null;
    constructor(
        val: V,
        next: Node<V> | null = null,
        prev: Node<V> | null = null,
    ) {
        this.val = val;
        this.prev = prev;
        this.next = next;
    }
}
class LRUCache1<K = number, V = number> {
    declare public readonly capacity: number;
    private readonly dummyHead = new Node<V>("dummyHead" as V);
    private readonly dummyTail: Node<V> = new Node<V>("dummyTail" as V);
    private readonly map = new Map<K, Node<V>>();
    private readonly key = new WeakMap<Node<V>, K>();
    constructor(capacity: number) {
        this.capacity = capacity;
        this.dummyHead.next = this.dummyTail;
        this.dummyTail.prev = this.dummyHead;
    }

    private unlinkNode(node: Node<V>) {
        const { prev, next } = node;
        if (prev === null || next === null) {
            throw new Error("prev and next should not be null");
        }
        {
            // unlink node from queue
            prev.next = next;
            next.prev = prev;
        }
        {
            // clear node links
            node.prev = null;
            node.next = null;
        }
        this.map.delete(node.val as unknown as K);
        return node;
    }

    private insertNodeAfter(prev: Node<V>, insertedNode: Node<V>) {
        if (insertedNode.prev !== null || insertedNode.next !== null) {
            throw new Error("insertedNode.prev and insertedNode.next should be null");
        }
        const { next } = prev;
        if (next === null) {
            throw new Error("baseNode.next should not be null");
        }

        prev.next = insertedNode;
        insertedNode.prev = prev;
        next.prev = insertedNode;
        insertedNode.next = next;
    }

    private moveToHead(node: Node<V>) {
        if (node.prev === null || node.next === null) {
            throw new Error("node.prev and node.next should not be null");
        }
        this.unlinkNode(node);
        this.insertNodeAfter(this.dummyHead, node);
    }
    get(key: K): V {
        const node = this.map.get(key);
        if (node === undefined) {
            throw new Error();
        }
        this.moveToHead(node);
        return node.val;
    }

    put(key: K, value: V): void {
        {
            const node = this.map.get(key);
            if (node) {
                node.val = value;
                this.moveToHead(node);
                return;
            }
        }

        if (this.map.size >= this.capacity) {
            const tailNode = this.dummyTail.prev!;
            this.unlinkNode(tailNode);
            const nodeKey = this.key.get(tailNode)!;
            this.map.delete(nodeKey);
        }
        {
            const node = new Node(value);
            this.insertNodeAfter(this.dummyHead, node);
            this.map.set(key, node);
            this.key.set(node, key);
        }
    }
}

class EventEmitter {
    map = new Map<string, Set<(p: any) => void>>();
    on(name: string, callback: (p: any) => void) {
        let set = this.map.get(name);
        if (!set) {
            set = new Set();
            this.map.set(name, set);
        }
        set.add(callback);
    }

    off(name: string) {
        emit(name: string, value: any) {
        const set = this.map.get(name);
				set?.forEach(f=>f(value))
    }    const set = this.map.get(name);
        set?.clear();
    }

    once(name: string, callback: (p: any) => void) {
        this.on(name, (v) => {
            const set = this.map.get(name);
            set?.off(callback);
            callback(v);
        });
    }

    emit(name: string, value: any) {
        const set = this.map.get(name);
        set?.forEach((f) => f(value));
    }
}


function flat(arr: any[], deep?: number) {
	const result: any[] = [];
    const depth = deep === undefined ? 1 : deep;
    
    for (const item of arr) {
        if (Array.isArray(item) && depth > 0) {
            const flattenedItem = flat(item, depth - 1);
            result.push(...flattenedItem);
        } else {
            result.push(item);
        }
    }
    return result;
    
}

flat([1, [2, [3]]]);
// [1, 2, [3]]

flat([1, [2, [3]]], 2);
// [1, 2, 3]

flat([1, [2, [3]]], Infinity);
// [1, 2, 3]


// promise 实现
/**
 * 自定义 Promise 实现
 * 包含 resolve、reject、then 方法
 * 符合 Promise A+ 规范
 */

class MyPromise {
    constructor(executor) {
        // 状态：pending、fulfilled、rejected
        this.status = 'pending';
        this.value = undefined;
        this.reason = undefined;
        
        // 存储 then 回调函数
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        
        // 成功回调
        const resolve = (value) => {
            if (this.status === 'pending') {
                this.status = 'fulfilled';
                this.value = value;
                
                // 执行所有成功回调
                this.onFulfilledCallbacks.forEach(fn => fn());
            }
        };
        
        // 失败回调
        const reject = (reason) => {
            if (this.status === 'pending') {
                this.status = 'rejected';
                this.reason = reason;
                
                // 执行所有失败回调
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        };
        
        // 执行器函数
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }
    
    // then 方法
    then(onFulfilled, onRejected) {
        // 参数可选
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };
        
        // 返回新的 Promise 实现链式调用
        return new MyPromise((resolve, reject) => {
            if (this.status === 'fulfilled') {
                // 异步执行，保证 then 的回调是异步的
                setTimeout(() => {
                    try {
                        const result = onFulfilled(this.value);
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            }
            
            if (this.status === 'rejected') {
                setTimeout(() => {
                    try {
                        const result = onRejected(this.reason);
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            }
            
            // pending 状态，将回调存储起来
            if (this.status === 'pending') {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const result = onFulfilled(this.value);
                            resolve(result);
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                });
                
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const result = onRejected(this.reason);
                            resolve(result);
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                });
            }
        });
    }
    
    // catch 方法
    catch(onRejected) {
        return this.then(null, onRejected);
    }
    
    // finally 方法
    finally(callback) {
        return this.then(
            value => MyPromise.resolve(callback()).then(() => value),
            reason => MyPromise.resolve(callback()).then(() => { throw reason; })
        );
    }
    
    // 静态方法：resolve
    static resolve(value) {
        return new MyPromise((resolve) => resolve(value));
    }
    
    // 静态方法：reject
    static reject(reason) {
        return new MyPromise((resolve, reject) => reject(reason));
    }
    
    // 静态方法：all
    static all(promises) {
        return new MyPromise((resolve, reject) => {
            if (!Array.isArray(promises)) {
                return reject(new TypeError('Argument must be an array'));
            }
            
            const results = [];
            let completedCount = 0;
            
            if (promises.length === 0) {
                return resolve(results);
            }
            
            promises.forEach((promise, index) => {
                MyPromise.resolve(promise).then(
                    value => {
                        results[index] = value;
                        completedCount++;
                        
                        if (completedCount === promises.length) {
                            resolve(results);
                        }
                    },
                    reason => {
                        reject(reason);
                    }
                );
            });
        });
    }
    
    // 静态方法：race
    static race(promises) {
        return new MyPromise((resolve, reject) => {
            if (!Array.isArray(promises)) {
                return reject(new TypeError('Argument must be an array'));
            }
            
            promises.forEach(promise => {
                MyPromise.resolve(promise).then(resolve, reject);
            });
        });
    }
}

// ============== 测试案例 ==============

console.log('=== 基础功能测试 ===');

// 测试1：基本使用
const promise1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功了');
    }, 1000);
});

promise1.then(value => {
    console.log('测试1 - 成功回调:', value);
}).catch(error => {
    console.log('测试1 - 失败回调:', error);
});

// 测试2：失败情况
const promise2 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        reject('失败了');
    }, 1000);
});

promise2.then(value => {
    console.log('测试2 - 成功回调:', value);
}).catch(error => {
    console.log('测试2 - 失败回调:', error);
});

// 测试3：链式调用
const promise3 = new MyPromise((resolve, reject) => {
    resolve('第一步');
});

promise3
    .then(value => {
        console.log('测试3 - 第一步:', value);
        return '第二步';
    })
    .then(value => {
        console.log('测试3 - 第二步:', value);
        return '第三步';
    })
    .then(value => {
        console.log('测试3 - 第三步:', value);
    });

// 测试4：异步链式调用
const promise4 = new MyPromise((resolve, reject) => {
    setTimeout(() => resolve('异步第一步'), 500);
});

promise4
    .then(value => {
        console.log('测试4 - 异步第一步:', value);
        return new MyPromise((resolve) => {
            setTimeout(() => resolve('异步第二步'), 500);
        });
    })
    .then(value => {
        console.log('测试4 - 异步第二步:', value);
    });

// 测试5：错误处理
const promise5 = new MyPromise((resolve, reject) => {
    resolve('正常值');
});

promise5
    .then(value => {
        console.log('测试5 - 正常值:', value);
        throw new Error('模拟错误');
    })
    .then(value => {
        console.log('测试5 - 不会执行');
    })
    .catch(error => {
        console.log('测试5 - 捕获错误:', error.message);
    });

// 测试6：finally
const promise6 = new MyPromise((resolve, reject) => {
    resolve('finally测试');
});

promise6
    .then(value => {
        console.log('测试6 - then:', value);
        return value;
    })
    .finally(() => {
        console.log('测试6 - finally 执行');
    })
    .then(value => {
        console.log('测试6 - finally 后:', value);
    });

console.log('\n=== 静态方法测试 ===');

// 测试7：Promise.resolve
const promise7 = MyPromise.resolve('立即成功');
promise7.then(value => {
    console.log('测试7 - Promise.resolve:', value);
});

// 测试8：Promise.reject
const promise8 = MyPromise.reject('立即失败');
promise8.catch(error => {
    console.log('测试8 - Promise.reject:', error);
});

// 测试9：Promise.all
const promise9a = MyPromise.resolve('A');
const promise9b = new MyPromise(resolve => setTimeout(() => resolve('B'), 1000));
const promise9c = new MyPromise(resolve => setTimeout(() => resolve('C'), 500));

MyPromise.all([promise9a, promise9b, promise9c]).then(values => {
    console.log('测试9 - Promise.all:', values);
});

// 测试10：Promise.race
const promise10a = new MyPromise(resolve => setTimeout(() => resolve('A赢了'), 1000));
const promise10b = new MyPromise(resolve => setTimeout(() => resolve('B赢了'), 500));
const promise10c = new MyPromise(resolve => setTimeout(() => resolve('C赢了'), 800));

MyPromise.race([promise10a, promise10b, promise10c]).then(value => {
    console.log('测试10 - Promise.race:', value);
});

// 测试11：Promise.all 失败情况
const promise11a = MyPromise.resolve('A');
const promise11b = MyPromise.reject('B失败');
const promise11c = new MyPromise(resolve => setTimeout(() => resolve('C'), 1000));

MyPromise.all([promise11a, promise11b, promise11c]).catch(error => {
    console.log('测试11 - Promise.all 失败:', error);
});

console.log('\n=== 边界情况测试 ===');

// 测试12：空数组
MyPromise.all([]).then(values => {
    console.log('测试12 - 空数组:', values);
});

// 测试13：立即执行
new MyPromise(resolve => resolve('立即')).then(value => {
    console.log('测试13 - 立即执行:', value);
});

// 测试14：同步错误
try {
    new MyPromise((resolve, reject) => {
        throw new Error('同步错误');
    }).catch(error => {
        console.log('测试14 - 同步错误:', error.message);
    });
} catch (error) {
    console.log('测试14 - 同步错误被捕获');
}

console.log('\n=== 测试完成 ===');
console.log('所有测试案例已启动，部分测试需要等待异步执行完成');
