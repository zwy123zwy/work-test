/**
 * 020601 JS 算法题（20 道）- 面试出现频率较高
 * 日期：2026-02-06
 * 规则：仅题干、输入输出与约束；个人完成后再补充解答与测试用例。
 */
class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}
// ==================== 1. 合并两个有序链表 ====================
// 题干：将两个升序链表合并为一个升序链表并返回新链表头。
// 输入：head1, head2（链表头节点，含 val、next）
// 输出：合并后的链表头节点
// 约束：链表可能为空

function mergeTwoLists(head1, head2) {
    // 创建虚拟头节点，简化操作
    let dummyHead = new Node(0);
    let current = dummyHead; // 使用另一个指针来构建链表

    let cur1 = head1;
    let cur2 = head2;

    // 当两个链表都还有节点时，比较值大小并连接较小的节点
    while (cur1 && cur2) {
        if (cur1.val < cur2.val) {
            current.next = cur1;
            current = current.next;
            cur1 = cur1.next;
        } else {
            current.next = cur2;
            current = current.next;
            cur2 = cur2.next;
        }
    }

    // 处理剩余的节点
    if (cur1) {
        current.next = cur1;
    } else if (cur2) {
        current.next = cur2;
    }

    // 返回真正的头节点（跳过虚拟头节点）
    return dummyHead.next;
}

// ==================== 2. 环形链表判断 ====================
// 题干：判断链表中是否存在环。若存在环，返回 true，否则 false。
// 输入：head（链表头）
// 输出：boolean
// 约束：O(1) 空间（不用 Map/Set 存节点）

function hasCycle(head) {
    if (!head || !head.next) {
        return false;
    }

    let slow = head;
    let fast = head.next;

    while (fast && fast.next) {
        if (slow === fast) {
            return true;
        }

        slow = slow.next;
        fast = fast.next.next;
    }

    return false;
}

// ==================== 3. 二叉树层序遍历 ====================
// 题干：给定二叉树根节点，返回其层序遍历结果（逐层从左到右的数组的数组）。
// 输入：root（节点含 val, left, right）
// 输出：[[层0], [层1], ...]

function levelOrder(root) {
    if (!root) {
        return [];
    }

    let res = [];
    let queue = [root];

    while (queue.length) {
        let level = [];
        let size = queue.length;

        for (let i = 0; i < size; i++) {
            let node = queue.shift();
            level.push(node.val);
            if (node.left) {
                queue.push(node.left);
            }
            if (node.right) {
                queue.push(node.right);
            }
        }

        res.push(level);
    }
    return res;
}

// ==================== 4. 对称二叉树 ====================
// 题干：判断一棵二叉树是否轴对称（镜像对称）。
// 输入：root
// 输出：boolean
function isSymmetric(root) {
    if (!root) {
        return true;
    }

    function isMirror(left, right) {
        if (!left && !right) {
            return true;
        }

        if (!left || !right) {
            return false;
        }

        return (
            left.val === right.val &&
            isMirror(left.left, right.right) &&
            isMirror(left.right, right.left)
        )
    }
    return isMirror(root.left, root.right);
}


// ==================== 5. 手写 bind ====================
// 【修正】用 myBind 不覆盖原生；正确 API 为 fn.myBind(thisArg,...args)，this 即 fn；new 时 this 指向实例
Function.prototype.myBind = function (thisArg, ...args) {
    const fn = this;
    const bound = function (...args2) {
        return fn.apply(this instanceof bound ? this : thisArg, args.concat(args2));
    };
    bound.prototype = Object.create(fn.prototype);
    return bound;
}


// ==================== 6. 手写 Promise（支持 then、resolve） ====================
// 题干：实现一个简易 Promise 类，支持 new MyPromise(executor)、then(onFulfilled, onRejected)、静态方法 MyPromise.resolve。
// 输入：executor(resolve, reject)
// 输出：具备 then 方法的实例

class MyPromise {
    constructor(executor) {
        this.status = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        
    }
    resolve(value) {
        setTimeout(() => {
            if (this.status === 'pending') {
                this.status = 'fulfilled';
                this.value = value;
                this.onFulfilledCallbacks.forEach(fn => fn(value));
            }
        }, 0); 
    }
    
    reject(reason) {
        setTimeout(() => {
            if (this.status === 'pending') {
                this.status = 'rejected';
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn(reason));
            }
        }, 0); 
    }
    
    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            function resolveHandler(value) {
                try {
                    let result = onFulfilled(value);
                    return result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
                } catch (error) {
                    reject(error);
                } 
            }
            
            function rejectHandler(reason) {
                try {
                    let result = onRejected(reason);
                    return result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
                } catch (error) {
                    reject(error);
                } 
            }
            
            if (this.status === 'fulfilled') {
                resolveHandler(this.value);
            } else if (this.status === 'rejected') {
                rejectHandler(this.reason);
            } else {
                this.onFulfilledCallbacks.push(resolveHandler);
                this.onRejectedCallbacks.push(rejectHandler);
            }
        }) 
    }
}

// ==================== 7. 用栈实现队列 ====================
// 题干：仅用两个栈实现队列的 push、shift、peek（队头）、empty。
// 输入：通过类方法调用
// 输出：push 无返回值，shift 返回队头元素，peek 返回队头，empty 返回是否为空

function MyQueue() {
    this.stack1 = [];
    this.stack2 = [];
    this.size = 0;
    this.top = -1;
    this.pop = function () {
        if (this.stack2.length === 0) {
            while (this.stack1.length) {
                this.stack2.push(this.stack1.pop());
            }
        }
        return this.stack2.pop(); 
    }
    
    this.push = function (x) {
        this.stack1.push(x);
        this.size++;
        this.top = x;
        return x;
    }
    
    this.peek = function () {
        if (this.stack2.length === 0) {
            while (this.stack1.length) {
                this.stack2.push(this.stack1.pop());
            }
        }
        return this.stack2[this.stack2.length - 1]; 
    }
    
    this.empty = function () {
        return this.stack1.length === 0 && this.stack2.length === 0;
    }
}

// ==================== 8. 用队列实现栈 ====================
// 题干：仅用两个队列（或一个队列）实现栈的 push、pop、top、empty。
// 【补充实现】单队列：push 时把前面元素依次出队再入队，使新元素到队头
function MyStack() {
    this.queue = [];
    this.push = function (x) {
        const n = this.queue.length;
        this.queue.push(x);
        for (let i = 0; i < n; i++) this.queue.push(this.queue.shift());
    };
    this.pop = function () { return this.queue.shift(); };
    this.top = function () { return this.queue[0]; };
    this.empty = function () { return this.queue.length === 0; };
}

// ==================== 9. 有效的字母异位词 ====================
// 题干：给定两个字符串 s、t，判断是否为字母异位词（相同字符出现次数相同）。
// 输入：s, t（仅小写字母）
// 输出：boolean
// 【修正】原逻辑：map.get(s[i])>0 恒成立会误判。应分两轮：先统计 s，再遍历 t 减 1
function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    const map = new Map();
    for (const c of s) map.set(c, (map.get(c) || 0) + 1);
    for (const c of t) {
        const n = (map.get(c) || 0) - 1;
        if (n < 0) return false;
        map.set(c, n);
    }
    return true;
}


// ==================== 10. 反转字符串（原地） ====================
// 题干：将字符数组原地反转（不能额外开 O(n) 空间）。
// 输入：s（字符数组，如 ['h','e','l','l','o']）
// 输出：无，原地修改

function reverseString(s) {
    let left = 0;
    let right = s.length - 1;
    while (left < right) {
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }
    return s;
}


// ==================== 11. 大数相加 ====================
// 题干：给定两个非负整数字符串 num1、num2，返回和的字符串。不可直接转 BigInt 或 Number 计算。
// 输入：num1, num2（字符串）
// 输出：和字符串

function addStrings(num1, num2) {
    let i = num1.length - 1;
    let j = num2.length - 1;
    let carry = 0;
    let result = '';
    while (i >= 0 || j >= 0 || carry > 0) {
        let digit1 = i >= 0 ? parseInt(num1[i]) : 0;
        let digit2 = j >= 0 ? parseInt(num2[j]) : 0;
        let sum = digit1 + digit2 + carry;
        let digit = sum % 10;
        result = digit + result;
        carry = Math.floor(sum / 10);
        i--;
        j--;
    }
    return result;
}
// ==================== 12. 实现 EventEmitter（on/emit/off） ====================
// 题干：实现简易事件总线，支持 on(event, cb)、emit(event, ...args)、off(event, cb)。
// 输入：通过实例方法调用
// 输出：on/off 返回 this 便于链式；emit 无返回值
class MyEventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, cb) {
        this.events[event] = this.events[event] || [];
        this.events[event].push(cb);
        return this;
    }
    
    emit(event, ...args) {
        (this.events[event] || []).forEach(cb => cb(...args));
    }
    
    off(event, cb) {
        this.events[event] = (this.events[event] || []).filter(item => item !== cb);
        return this;
    }
    
    once(event, cb) {
        let onceCb = (...args) => {
            cb(...args);
            this.off(event, onceCb);
        };
        this.on(event, onceCb);
        return this;
    }
    
}

// ==================== 13. 并发限制的请求池 ====================
// 题干：实现 RequestPool(limit)，add(task) 添加返回 Promise 的异步任务，同时最多执行 limit 个，按添加顺序执行。
// 输入：limit（数字）、task（无参函数，返回 Promise）
// 输出：add 可返回 Promise，在任务完成时 resolve 该任务结果

class RequestPool {
    constructor(limit) {
        this.limit = limit;
        this.queue = [];
        this.running = 0;
    }

    add(task) {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, resolve, reject });
            this.run();
        });
    }

    run() {
        if(this.running >= this.limit || this.queue.length === 0){
            return;
        }
        while (this.running < this.limit && this.queue.length > 0) {
            const { task, resolve, reject } = this.queue.shift();
            this.running++;
            task().then(res => {
                resolve(res);
            }, err => {
                reject(err);
            }).finally(() => {
                this.running--;
                this.run();
            });   
        }

    }
}

// ==================== 14. 带缓存的斐波那契 ====================
// 题干：实现 fib(n)，同一 n 多次调用只算一次，用缓存优化。
// 输入：n（非负整数）
// 输出：第 n 项斐波那契数

function fib(n) {
    const cache = new Map();
    function fibHelper(n) {
        if (cache.has(n)) {
            return cache.get(n);
        }
        if (n <= 1) {
            return n;
        }
        const result = fibHelper(n - 1) + fibHelper(n - 2);
        cache.set(n, result);
        return result;
    }
    return fibHelper(n);
}

// ==================== 15. 回文链表 ====================
// 题干：判断单链表是否为回文结构（正序与反序相同）。要求 O(n) 时间、O(1) 空间。
// 输入：head
// 输出：boolean

function isPalindrome(head) {
    let slow = head;
    let fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    let prev = null;
    while (slow) {
        let temp = slow.next;
        slow.next = prev;
        prev = slow;
        slow = temp;
    }
    while (prev) {
        if (prev.val !== head.val) {
            return false;
        }
        head = head.next;
        prev = prev.next;
        
    } 
    return true;
}


// ==================== 16. 删除排序链表中的重复元素 ====================
// 题干：给定升序链表，删除所有重复节点，使每个值只出现一次，返回链表头。
// 输入：head
// 输出：新链表头
function deleteDuplicates(head) {
    let cur = head;
    while (cur && cur.next) {
        if (cur.val === cur.next.val) {
            cur.next = cur.next.next;
        } else {
            cur = cur.next;
        }
    }
    return head;
}

// ==================== 17. 二叉树前序遍历（迭代，不用递归） ====================
// 题干：给定根节点，返回前序遍历结果数组（根-左-右），必须用栈迭代实现。
// 输入：root
// 输出：number[]（或 val 数组）
function preorderTraversal(root) {
    const stack = [root];
    const result = [];
    while (stack.length) {
        const node = stack.pop();
        if (node) {
            result.push(node.val);
            stack.push(node.right);
            stack.push(node.left);
        }
    }
    return result;
}


// ==================== 18. 验证二叉搜索树 ====================
// 题干：判断二叉树是否为有效二叉搜索树（左子树所有节点 < 根 < 右子树所有节点）。
// 输入：root
// 输出：boolean

function isValidBST(root) {
    let prev = null;
    let stack = [];
    while (stack.length || root) {
        while (root) {
            stack.push(root);
            root = root.left;
        }
        root = stack.pop();
        if (prev && root.val <= prev.val) {
            return false;
        }
        prev = root;
        root = root.right;
    }
}

// ==================== 19. 最长公共前缀 ====================
// 题干：给定字符串数组，找出最长公共前缀；不存在返回 ''。
// 输入：strs（字符串数组）
// 输出：字符串
function longestCommonPrefix(strs) {
    if (!strs.length) return '';
    let prefix = strs[0];
    for (let i = 1; i < strs.length; i++) {
        let j = 0;
        while (
            j < prefix.length &&
            j < strs[i].length &&
            prefix[j] === strs[i][j]
        ) {
            j++;
        }
        prefix = prefix.slice(0, j);
        if (!prefix) {
            return "";
        }
    }
    return prefix;
}

// ==================== 20. 实现 lodash 的 get ====================
// 题干：实现 get(obj, path, defaultValue)，根据 path 取嵌套属性，path 为 'a.b.c' 或 ['a','b','c']，取不到则返回 defaultValue。
// 输入：obj（对象）, path（字符串或数组）, defaultValue（可选）
// 输出：取到的值或 defaultValue

function get(obj, path, defaultValue) {
    if (obj == null || typeof obj !== 'object') {
        return defaultValue;
    }
    if (typeof path === "string") {
        path = path.split(".");
    }
    for (const key of path) {
        if (obj == null || typeof obj !== 'object' || !(key in obj)) return defaultValue;
        obj = obj[key];
    }
    return obj;
}
// 测试：get({a:{b:{c:0}}},'a.b.c')→0; get(null,'a','x')→'x'

// ==================== 测试用例与辅助函数 ====================
function arrToList(arr) {
    if (!arr || !arr.length) return null;
    const head = { val: arr[0], next: null };
    let cur = head;
    for (let i = 1; i < arr.length; i++) {
        cur.next = { val: arr[i], next: null };
        cur = cur.next;
    }
    return head;
}
function listToArr(head) {
    const a = []; while (head) { a.push(head.val); head = head.next; } return a;
}
function makeCycle(arr, pos) {
    const head = arrToList(arr);
    if (!head || pos < 0) return head;
    let tail = head, n = head; let i = 0;
    while (tail.next) tail = tail.next;
    while (n && i < pos) { n = n.next; i++; }
    tail.next = n; return head;
}
function arrToTree(arr, i = 0) {
    if (i >= arr.length || arr[i] == null) return null;
    const r = { val: arr[i], left: null, right: null };
    r.left = arrToTree(arr, 2 * i + 1);
    r.right = arrToTree(arr, 2 * i + 2);
    return r;
}

async function runTests() {
    const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
    assert(JSON.stringify(listToArr(mergeTwoLists(arrToList([1,2,4]), arrToList([1,3,4])))) === '[1,1,2,3,4,4]', '1');
    assert(hasCycle(makeCycle([3,2,0,-4], 1)) === true && hasCycle(arrToList([1,2])) === false, '2');
    assert(JSON.stringify(levelOrder(arrToTree([3,9,20,null,null,15,7]))) === '[[3],[9,20],[15,7]]', '3');
    assert(isSymmetric(arrToTree([1,2,2,3,4,4,3])) === true, '4');
    const f = function(a,b){ return this.x + a + b; };
    assert(f.myBind({x:1}, 2)(3) === 6, '5');
    await new MyPromise(r => r(1)).then(v => assert(v === 1, '6'));
    const q = new MyQueue(); q.push(1); q.push(2);
    assert(q.shift() === 1 && q.peek() === 2, '7');
    const st = new MyStack(); st.push(1); st.push(2);
    assert(st.pop() === 2 && st.top() === 1, '8');
    assert(isAnagram('anagram','nagaram') === true && isAnagram('rat','car') === false, '9');
    const s = ['h','e','l','l','o']; reverseString(s);
    assert(JSON.stringify(s) === '["o","l","l","e","h"]', '10');
    assert(addStrings('11','123') === '134' && addStrings('999','1') === '1000', '11');
    const ee = new MyEventEmitter(); let n = 0;
    ee.on('e', () => n++); ee.emit('e'); ee.emit('e');
    assert(n === 2, '12');
    const pool = new RequestPool(2);
    await pool.add(() => Promise.resolve(1)).then(v => assert(v === 1, '13'));
    assert(fib(10) === 55 && fib(20) === 6765, '14');
    assert(isPalindrome(arrToList([1,2,2,1])) === true && isPalindrome(arrToList([1,2])) === false, '15');
    assert(JSON.stringify(listToArr(deleteDuplicates(arrToList([1,1,2,3,3])))) === '[1,2,3]', '16');
    assert(JSON.stringify(preorderTraversal(arrToTree([1,2,null,3]))) === '[1,2,3]', '17');
    assert(isValidBST(arrToTree([2,1,3])) === true && isValidBST(arrToTree([5,1,4,null,null,3,6])) === false, '18');
    assert(longestCommonPrefix(['flower','flow','flight']) === 'fl' && longestCommonPrefix([]) === '', '19');
    assert(get({a:{b:{c:0}}}, 'a.b.c') === 0 && get(null, 'a', 'x') === 'x', '20');
    console.log('✅ 全部 20 题测试通过');
}
if (typeof require !== 'undefined' && require.main === module) {
    runTests().catch(e => { console.error(e); process.exit(1); });
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { mergeTwoLists, hasCycle, levelOrder, isSymmetric, isAnagram, reverseString,
        addStrings, fib, isPalindrome, deleteDuplicates, preorderTraversal, isValidBST,
        longestCommonPrefix, get, MyQueue, MyStack, MyEventEmitter, RequestPool, Node, TreeNode };
}