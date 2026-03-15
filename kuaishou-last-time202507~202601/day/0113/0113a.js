// lis
function lis(arr){
    const n = arr.length;
    const dp = new Array(n).fill(1);
    for(let i = 1; i < n; i++){
        for(let j = 0; j < i; j++){
            if(arr[i] > arr[j]){
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    return Math.max(...dp);
}

// 数组扁平花
function flatten(arr) {
    const result = [];
    for (const item of arr) {
        if (Array.isArray(item)) {
            result.push(...flatten(item));
        } else {
            result.push(item);
        }
    }
    return result;
}

// json to tree
function jsonToTree(json) {
    const tree = [];
    const map = new Map();
    
    for (const item of json) {
        map.set(item.id, { ...item, children: [] });
    }
    for (const item of json) {
        const parent = map.get(item.parentId);
        if (parent) {
            parent.children.push(map.get(item.id));
        } else {
            tree.push(map.get(item.id));
        }
    }
    return tree;
}

const list = [
    { id: 1, name: '部门A', parentId: 0 },
    { id: 2, name: '部门B', parentId: 1 },
    { id: 3, name: '部门C', parentId: 1 },
    { id: 4, name: '部门D', parentId: 3 },
    { id: 5, name: '部门E', parentId: 2 },
];

console.log(JSON.stringify(jsonToTree(list)));

// lru
class LRUCache {    
    
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
        this.queue = []
    }
    
    get(key) {
        if (this.cache.has(key)) {
            this.queue.splice(this.queue.indexOf(key), 1);
            this.queue.push(key);
            return this.cache.get(key);
        }
        return -1;
    }
    
    put(key, value) {
        if (this.cache.has(key)) {
            this.queue.splice(this.queue.indexOf(key), 1);
        } else if (this.cache.size === this.capacity) {
            const keyToRemove = this.queue.shift();
            this.cache.delete(keyToRemove);
        }
        this.queue.push(key);
        this.cache.set(key, value);
    }
}

// array.flat

Array.prototype.myFlat = function (depth = 1) {
    let result = [];
    for (let i = 0; i < this.length; i++) {
        if (Array.isArray(this[i]) && depth > 0) {
            result = result.concat(this[i].myFlat(depth - 1));
        } else {
            result.push(this[i]);
        }
    }
}

// array.forEach
Array.prototype.myForEach = function (callback) {
    for (let i = 0; i < this.length; i++) {
        callback(this[i], i, this);
    }
}


// array.map
Array.prototype.myMap = function (callback) {
    let result = [];
    for (let i = 0; i < this.length; i++) {
        result.push(callback(this[i], i, this));
    }
    return result;
}

// array.filter
Array.prototype.myFilter = function (callback) {
    let result = [];
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            result.push(this[i]);
        }
    }
    return result;
}

// array.push
Array.prototype.myPush = function (...args) {
    for (let i = 0; i < args.length; i++) {
        this[this.length] = args[i];
    }
    return this.length;
}

// array.pop

Array.prototype.myPop = function () {
    if (this.length === 0) {
        return undefined;
    }
    let result = this[this.length - 1];
    delete this[this.length - 1];
    this.length--;
    return result;
}

// array.shift
Array.prototype.myShift = function () {
    if (this.length === 0) {
        return undefined;
    }
    let result = this[0];
    for (let i = 1; i < this.length; i++) {
        this[i - 1] = this[i];
    }
    delete this[this.length - 1];
    this.length--;
    return result;
}

// array.unshift    
Array.prototype.myUnshift = function (...args) {
    for (let i = this.length - 1; i >= 0; i--) {
        this[i + args.length] = this[i];
    }
    for (let i = 0; i < args.length; i++) {
        this[i] = args[i];
    }
    return this.length;
}

// array.reduce

Array.prototype.myReduce = function (callback, initialValue) {
    let result = initialValue;
    for (let i = 0; i < this.length; i++) {
        result = callback(result, this[i], i, this);
    }
    return result;
}

// array.some
Array.prototype.mySome = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return true;
        }
    }
    return false;
}

// array.every
Array.prototype.myEvery = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (!callback(this[i], i, this)) {
            return false;
        }
    }
    return true;
}

// array.find
Array.prototype.myFind = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return this[i];
        }
    }
    return undefined;
}

// array.findIndex
Array.prototype.myFindIndex = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return i;
        }
    }
    return -1;
}

// array.includes
Array.prototype.myIncludes = function (value) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === value) {
            return true;
        }
    }
    return false;
}

// array.join
Array.prototype.myJoin = function (separator = ',') {
    let result = '';
    for (let i = 0; i < this.length; i++) {
        result += this[i] + separator;
    }
    return result.slice(0, -separator.length);
}

// array.reverse
Array.prototype.myReverse = function () {
    for (let i = 0; i < this.length / 2; i++) {
        let temp = this[i];
        this[i] = this[this.length - 1 - i];
        this[this.length - 1 - i] = temp;
    }
    return this;
}

// array.splice
Array.prototype.mySplice = function (start, deleteCount, ...args) {
    let result = [];
    for (let i = start; i < start + deleteCount; i++) {
        result.push(this[i]);
        delete this[i];
    }
    for (let i = this.length - 1; i >= start + deleteCount; i--) {
        this[i + args.length] = this[i];
    }
    for (let i = 0; i < args.length; i++) {
        this[start + i] = args[i];
    }
    this.length = this.length - deleteCount + args.length;
    return result;
}

// array.slice
Array.prototype.mySlice = function (start, end) {
    let result = [];
    for (let i = start; i < end; i++) {
        result.push(this[i]);
    }
    return result;
}

// array.concat
Array.prototype.myConcat = function (...args) {
    let result = [];
    for (let i = 0; i < this.length; i++) {
        result.push(this[i]);
    }
    for (let i = 0; i < args.length; i++) {
        if (Array.isArray(args[i])) {
            for (let j = 0; j < args[i].length; j++) {
                result.push(args[i][j]);
            }
        } else {
            result.push(args[i]);
        }
    }
    return result;
}
// array.indexOf
Array.prototype.myIndexOf = function (value) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] === value) {
            return i;
        }
    }
    return -1;
}

// array.lastIndexOf
Array.prototype.myLastIndexOf = function (value) {
    for (let i = this.length - 1; i >= 0; i--) {
        if (this[i] === value) {
            return i;
        }
    }
    return -1;
}

// array.reduce
Array.prototype.myReduce = function (callback, initialValue) {
    let result = initialValue;
    for (let i = 0; i < this.length; i++) {
        result = callback(result, this[i], i, this);
    }
    return result;
}
// array.reduceRight
Array.prototype.myReduceRight = function (callback, initialValue) {
    let result = initialValue;
    for (let i = this.length - 1; i >= 0; i--) {
        result = callback(result, this[i], i, this);
    }
    return result;
}

const useRequest = (request,options = {}){
    const {debounceWait = 0,throttleWait = 0} = options
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(null)
    const [data,setData] = useState(null)
    const run = useCallback((params)=>{
        setLoading(true)
        const doRequest = ()=>{
            request(params).then(res=>setData(res)).catch(e=>setError(e))
            .finally(setLoading(false))
        }
        if(debounceWait > 0){
            debounce(doRequest,debounceWait)
        }else if(throttleWait > 0){
            throttle(doRequest,throttleWait)
        }else{
            doRequset()
        }
    }
    ,[request,debounceWait,throttleWait])
    return {loading,run,error,data}
}
Web通道侧面试题库（持续收集中）
面试题汇总
一、数据结构 / 算法题（校招&社招）
1、【中】实现字符串的indexOf方法
答案
// 简单实现
var str = 'abcdefg'
String.prototype.indexOf2 = function (s) {
  var arr = this.split(s)
  return arr.length == 1 ? -1 : arr[0].length
}
console.log(str.indexOf2('cd'), str.indexOf('cd'))
console.log(str.indexOf2('acd'), str.indexOf('acd'))
// 转 match
String.prototype.indexOf3 = function(str) {
  const result = this.match(str)
  if(!result) {
    return -1;
  }
  return result.index
}
// 加分项：字符串遍历比对，性能会高一些
function indexOf(str, searchValue) {
  let index = -1;
  let len = 0;
  let lastMatch = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] !== searchValue[len]) {
      if (len === searchValue.length) {
      	return index;
      }
      index = -1
      len = 0;
      if (str[i] === searchValue[0]) {
          lastMatch = i;
      }
      if (lastMatch !== 0) {
      	i = lastMatch - 1;
	      lastMatch = 0;
  	  }
      continue;
    }
    len++;
    if (index === -1) {
    	index = i;
      continue;
    }
    if (str[i] === searchValue[0]) {
      	lastMatch = i;
    }
  }
  return index;
}跑个单测
const tests = [
  ['abc', 'a', 0],
  ['abc', 'b', 1],
  ['', 'b', -1],
  ['abc', '', 0],
  ['abc', 'd', -1],
]

tests.forEach(([str, target, expected]) => {
  function test(fn) {
  	if (str[fn](target) !== expected) {
      console.log('error', fn, source, target, expect);
    }
  }
  test('indexOf');
  // 假设扩展到 String.prototype.indexOf2
  test('indexOf2');
})
2、【中】连续最大子串和
答案

3、【简】有序链表合并、链表快排
答案

4、【简】斐波那契数列
	4.1 变种: 一只青蛙一次可以跳上1级台阶，也可以跳上2级台阶。求该青蛙跳上一个 n 级的台阶总共有多少种跳法。
答案

5、【简】实现全排列
const run = <T>(arr: T[]): T[][] => {
  //TODO
}
input: [1,2,3]
output: [
  [1,2,3],
  [1,3,2],
  [2,1,3],
  [2,3,1],
  [3,2,1],
  [3,1,2],
]
答案
由@赵缙翔指出，根据排列的定义，当参数为空集的时候，排列有一种，为空排列，所以当参数为 []，返回值应该为 [[]] 
见https://zh.wikipedia.org/zh-cn/%E7%BD%AE%E6%8F%9B
 
全排列即为 n = k，这时候就退化为 n 的阶乘。
0 个元素的集合的全排列数字为 0 的阶乘就是 1。
const run = <T>(arr: T[]): T[][] => {
  if (arr.length === 0) return [arr];
  return arr.flatMap((v, i) => {
    const temp = [...arr];
    temp.splice(i, 1);
    return run(temp).map(list => [v, ...list]);
  });
};
const range = (length: number) =>
    Array.from({ length })
        .fill(undefined)
        .map((x, i) => i);

const insertAt = (xs: ReadonlyArray<number>, i: number, value: number) => {
    const ret = xs.slice();
    ret.splice(i, 0, value);
    return ret;
};

const run = (xs: ReadonlyArray<number>): ReadonlyArray<ReadonlyArray<number>> => {
    if (xs.length === 0) return [[]];
    const [head, ...tail] = xs;
    return run(tail).flatMap((xs) => range(xs.length + 1).map((i) => insertAt(xs, i, head)));
};
6、【中】二叉搜索树中第K小的元素
答案

7、【中】数组中的第K个最大元素
答案

8、【中】链表反转
type List<T> = {
	value: T;
  next?: List<T>;
}
const reverse = <T>(list:List<T>): List<T> =>{
  //TODO
}
input: {value:1,next:{value:2,next:{value:3}}}output: {value:3,next:{value:2,next:{value:1}}}
答案	
const reverse = <T>(list:List<T>): List<T> =>{
  const run = (list?:List<T>,acc?:List<T>):List<T>=>list?run(list.next,{value:list.value,next:acc}):acc;
  return run(list)
}

9、【简】数组随机打散
答案

10、【中】判断有向图中是否有环
答案

11、【中】实现字典树
答案

12、【简】N叉树的前序遍历/后续遍历
答案

13、【简/中】查找最近的空闲时间
根据输入的忙碌时间（起点和终点），查找最近大家的空闲时间（都不忙碌的那天）
function getFreeTime(busyTime:number[][]): numbrer {
	// your code here...
}

const busyTime = [
		[1, 3], // 此人第一天到第三天忙碌
  	[2, 3], // 此人第二天到第三天忙碌
  	[2, 5],
  	[6, 7],
  	[10, 11, 13, 17] // 此人第十天到十一天，十三到十七天忙碌
]

console.log(getFreeTime(busyTime)); // 8

13、【中】实现一个LRU缓存
示例：
class LRU {
	  // TODO
	  set(key: any, value: any) {
    		// TODO
    }
  	get(key: any) {
      	// TODO
    }
}


const cache = new LRU(2);
cache.set(1, 1);
cache.set(2, 1);
console.log(cache.get(1));
// 1
cache.set(3, 'abc');
cache.get(2);
// undefined
cache.set(4, '123');
cache.get(1);
// undefined
cache.get(3);
// 'abc'
cache.get(4);
// '123'
答案：
var LRUCache = function(capacity) {
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
    }
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
    }
    this.createEntry = (key, value) => {
        return {
            key,
            value,
            left: null,
            right: null
        }
    }
};

LRUCache.prototype.get = function(key) {
    if (this.hashMap.has(key)) {
        let item = this.hashMap.get(key);
        this.removeNode(item);
        this.addToTop(item);
        return item.value;
    }
    return -1;
};

LRUCache.prototype.set = function(key, value) {
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
    public declare val: V;
    public declare next: Node<V> | null;
    public declare prev: Node<V> | null;
    constructor(val: V, next: Node<V> | null = null, prev: Node<V> | null = null) {
        this.val = val;
        this.prev = prev;
        this.next = next;
    }
}
class LRUCache<K = number, V = number> {
    public declare readonly capacity: number;
    private readonly dummyHead = new Node<V>('dummyHead' as V);
    private readonly dummyTail: Node<V> = new Node<V>('dummyTail' as V);
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
            throw new Error('prev and next should not be null');
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
            throw new Error('insertedNode.prev and insertedNode.next should be null');
        }
        const { next } = prev;
        if (next === null) {
            throw new Error('baseNode.next should not be null');
        }

        prev.next = insertedNode;
        insertedNode.prev = prev;
        next.prev = insertedNode;
        insertedNode.next = next;
    }

    private moveToHead(node: Node<V>) {
        if (node.prev === null || node.next === null) {
            throw new Error('node.prev and node.next should not be null');
        }
        this.unlinkNode(node);
        this.insertNodeAfter(this.dummyHead, node);
    }
    get(key: K): V {
        const node = this.map.get(key);
        if (node === undefined) {
            throw new Error()
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
14、【简】字符串处理
粗心的小明在写完代码后发现，自己看错了设计稿的单位，在开发时将所有的像素值都写成了应有的一半。请你帮助小明解决这个问题：
// input
const cssCode = `
.box {
  color: rgba(255, 255, 255, .7);
	font-size: 12px;
}
`
function doublePixels(cssCode: string): string {
    // your code here...
}

const res = doublePixels(cssCode);

expect(res).toEqual(`
.box {
  color: rgba(255, 255, 255, .7);
	font-size: 24px;
}`);
// 新增难度：不改写不该改写的地方
const cssCode = `
.box:after {
  content: '这段文字的大小是 24px（ font-size: 24px; ）';
	font-size: 24px;
}
.box-30px {
	font-size: 30px;
}
`
expect(res).toEqual(`
.box:after {
  content: '这段文字的大小是 24px（ font-size: 24px; ）';
	font-size: 48px;
}
.box-30px {
	font-size: 60px;
}
`);

15、【简】实现数组千分位
//正则实现
function format (num) {
    var reg=/\d{1,3}(?=(\d{3})+$)/g;
    return num.toString().replace(reg, '$&,');
}

//基础
function format(num){
    num+='';
    var str="";
    for(var i=num.length-1,j=1;i>=0;i--,j++){
        if(j%3===0 & i!=0){
            str+=num[i]+',';
        }else{
            str+=num[i];
        }
    }
    return str.split('').reverse().join('');
}
二、基础能力题（校招&社招）
CSS相关
1、【中】display: none  /  visibility: hidden /  opacity: 0之间的区别
答案
+--------------------+----------------+-----------------+
| Property           | occupies space | consumes clicks |
+--------------------+----------------+-----------------+
| opacity: 0         |        ✓       |        ✓        |
+--------------------+----------------+-----------------+
| visibility: hidden |        ✓       |        ✗        |
+--------------------+----------------+-----------------+
| display: none      |        ✗       |        ✗        |
+--------------------+----------------+-----------------+

加分项：能够回答出对layout/paint影响，事件影响，继承关系等

2、【简】CSS选择器优先级
答案

3、【中】position的值有哪些，分别是什么表现
答案

4、【中】有见到过上下margin重合的情况吗？产生原因是什么？
答案
加分项：能够引出BFC/IFC/FFC/GFC等概念

5、margin和padding分别适合什么场景使用（简）
答案

6、伪类和伪元素区别是什么（简）
答案

7、为什么 height:100x 会无效（简）
答案

8、png、jpg、gif、webp等格式会在什么场合下使用（中）
答案

9、常见的 CSS优化、提高性能的手段有哪些（中）
答案

10、什么是替换元素（中）
答案

11、样式编写（中）
有如下dom结构，要求仅补充style中的部分实现如下布局：
1. img与p是横向排列在div中，相距100px
2. p的宽度随着div的宽度变化而自适应变化
3. 要求给出至少两种实现
<style>
  img {
    width: 100px;
    height: 100px;
  }
  div {
    border: 1px solid;
    margin: 10px;
    padding: 10px;
  }
</style>
<div>
  <img src="https://s2-10623.kwimgs.com/udata/pkg/cloudcdn/img/logo_dark.49fc3549.svg">
  <p class="content">
    此处有无数多的内容
  </p>
</div>
<!-- 请将代码补充到下面的style标签中 -->
<style>
  
</style>
答案
/* 第一种解法 */
div	{
	position: relative;
  min-height: 100px;
}

img {
  position: absolute;
  top: 10px;
  left: 10px;
}

p {
  margin-left 110px;
}

/* 第二种解法 */
div {
  display: flex;
}

p {
  flex: 1;
}

/* 第三种解法 */
div::after {
	clear: both;
}

img,
p {
  float: left;
}
p {
  width: calc(100% - 110px);
  margin-left: 10px;
}

网络相关
1、能简单介绍一下OSI七层网络模型吗？从下到上每一层都是什么，主要负责什么工作？（简）
答案

2、常见的HTTP Code与其含义（中）
答案

3、HTTPS与HTTP的区别是什么？具体建联流程有什么区别？（中）
答案

4、TCP与UDP的区别，是否可以通过UDP实现HTTP（中）
答案

5、什么是XSS/CSRF，有什么预防措施吗？（中）
答案

6、能解释一下浏览器中DNS 的解析过程吗？（中）
答案

7、浏览器中经常能看到的200 from cache和304 not modified的区别是什么吗？（简）
答案
加分项：引申问出HTTP 1.0/1.1/2.0/3.0的主要变化

8、什么是对称加密和非对称加密，都有哪些应用场景？
答案



JavaScript相关
1、这段代码'abcdcba'.replace(/c/, "h")会返回什么结果（简）
答案

2、原型链 / new关键词的考察（中）
以下代码输出结果是什么？
function Foo() {
  this.a = 1;
  return {
    a: 4,
    b: 5,
  };
}

Foo.prototype.a = 6;
Foo.prototype.b = 7;
Foo.prototype.c = 8;

var o = new Foo();

console.log(o.a);
console.log(o.b);
console.log(o.c);
答案
console.log(o.a)的结果为4
console.log(o.b)的结果为5
console.log(o.c)的结果为undefined

原因是因为，Foo内部return了一个Object，根据ES规范，new操作符当遇到函数内部返回引用类型数据的时候，直接会将当前对象作为返回值返回，所有后续对于prototype操作并无效果。
如果这里不写返回，或者是返回Primitive类型的话，那么new的操作是首先创建一个空对象，将空对象的prototype指向到Foo的prototype上，然后将这个对象作为this执行Foo内的操作，最后返回，查找的话就是从对象顺序再进一步向上查找原型链，结果就可能为1，7，8

3、值传递引用传递（简）
以下代码执行结果是什么？
var a = [1, 2, 3, 4];
function set(a) {
  a = [5, 6, 7, 8];
}
set(a);
console.log(a);
答案

4、考察作用域（简）
以下代码执行结果是什么？
var a = 10;
function m() {
  return a + 10;
}

function n[]() {
  var a = 20;
  return m();
}

console.log(n());
答案
20

5、考察考察闭包/作用域/事件委托（简）
页面上100个li，补充<script>里的实现，使得点击li能console.log里面的内容
<ul>
  <li>1</li>
  <li>2<li>
  ...
  <li>100</li>
</ul>
<script>
  // TODO
</script>
答案

6、考察this指向（简）
以下代码输出是什么：
var name = '123';
var obj = {
    name: '456',
    getName: function () {
        function printName () {
            console.log(this.name);
        }

        printName();
    }
}
obj.getName();
答案
123

7. 页面将如何变化
function run() {
    document.body.style.backgroundColor = 'red';    
    console.log(window.getComputedStyle(document.body).backgroundColor);
    const now = Date.now();
    while(Date.now() - now <= 2000) {};
    document.body.style.backgroundColor = 'blue';
    console.log(2)
}
run()
答案

三、编程能力题（考核代码组织能力和思考方式）（比如原生API的实现、Request Pool、RPC通讯、事件机制、LRU缓存系统等）
1、实现flat函数（Array.prototype.flat的polyfill，数组扁平化）
示例：
function flat(arr: any[], deep?: number) {
		// TODO
}

flat([1, [2, [3]]]);
// [1, 2, [3]]

flat([1, [2, [3]]], 2);
// [1, 2, 3]

flat([1, [2, [3]]], Infinity);
// [1, 2, 3]
答案

2、【易】kebab-case的字符串转化成PascalCase
示例：
function kebabToPascal(str: string) {
  	// TODO
}

console.log(kebabToPascal('my-component'))
// 'MyComponent'
答案

3、实现数组的forEach方法
示例：
function forEach<T>(arr: T[], callback: (item: T, index: number, arr: T[]) => void) {
  	// TODO
}

forEach([1,2,3], (item) => {
  console.log(`hello ${item}`);
});
// hello 1
// hello 2
// hello 3
答案

4、周期性执行某个函数n次
示例：
function repeat(fn: Function, repeat: number) {
		// TODO
}

const repeatFunc = repeat(console.log, 4);

repeatFunc("helloworld");
// 每3秒打印一个helloworld，总计执行4次
答案

5、随机生成一个合法的HEX颜色值
示例：
function randomHEX() {
  	// TODO
}
console.log(randomHEX())
// #f4d13d
console.log(randomHEX())
// #f54
答案:
考核点：JS进制转换、random值为左闭右开
// 答案1
'#'+('000000'+Math.floor(Math.random()*(0xffffff+1)).toString(16)).substr(-6)

6、实现一个leftPad
示例：
function leftPad(str: string, len: number, ch: string) {
   // TODO
}

console.log(leftPad('abc', 5, '1'));
// '11abc'
答案

7、实现HTML元素反转
示例：
<ul>
    <li>1</li>
    <li>2</li>
    <li>3</li>
</ul>
<script>
function reverse(){
    // TODO
}
</script>
<!--
<ul>
    <li>3</li>
    <li>2</li>
    <li>1</li>
</ul>
-->
答案

8、对照MDN的规范描述，实现Promise.all / Promise.allSettled的polyfill
示例：
Promise.prototype.allSettled = function <T = any>(promise: Array<Promise<T>>) {
  	// TODO
}
答案

9、一层对象数组去重（可考虑衍伸问法）
实现一个数组去重，首先我们对数组有一些限定条件：
1. 数组中每一项均为Object，不存在Primitive类型
2. 数组中每一项Object均为一层结构，不存在多层嵌套场景
3. 对象中每个key所对应的value，均为Primitive类型，不存在如Date、Function等引用类型
示例：
const arr = [
  {
    a: 1,
    b: 2,
  },
  {
    b: 2,
    a: 1,
  },
  {
    c: 1
  },
  {
    a: '1',
    b: 2,
  }
];

由于数组本身为对象数组，不能通过简单的===来进行判断，所以对于重复项的判定，约定为：结构相同的两个对象会判定为重复对象（对象的key的数量，key的值，以及每个key所对应的value的类型和值一致）
示例：
上图中数组第一项和第二项，满足前面约定的结构相同，需要仅保留一项；数组中第二项和第四项，不满足结构相同，原因是a所对应的value的类型不一致。

现需要补充以下函数，完成题目要求：
function dropRepeat(arr: ReadonlyArray<Record<string, number | string | boolean>>): Array<Record<string, number | string | boolean>> {
    // 待补充
}
/**
 * @typedef {Record<string, number | string | boolean>} Element 数组的元素
 */

/**
 * @param array {ReadonlyArray<Element>}
 * 
 * @return {Array<Element>}
 */
function dropRepeat(array) {
    // 待补充
    
    return []
}

答案
基础：
	面试者能够给出O(n2)时间复杂度的答案，完成题目要求。
	难度：K3A需满足
中等：
	引导面试者通过“空间换时间”，能够通过构建合理的hash作为key进行重复比较（需要考虑对象key的顺序），给出O(n)时间复杂度的答案。
	难度：K3B需满足
高级：
	如果数组对象可以是多层嵌套结构（暂不考虑循环引用），考察面试者如何构建合理的hash作为key进行重复比较，给出O(n)时间复杂度的答案。
	难度：K3B+需满足
// 参考实现

function zip<X, Y>(xs: ReadonlyArray<X>, ys: ReadonlyArray<Y>): Array<[x: X, y: Y]> {
    const minLengthArr = xs.length < ys.length ? xs : ys;
    return minLengthArr.map((_, i) => [xs[i]!, ys[i]!]);
}
function shallowEqual<T extends Record<string, unknown>>(a: T, b: T) {
    const entriesA = Object.entries(a).sort((a, b) => a[0].localeCompare(b[0]));
    const entriesB = Object.entries(b).sort((a, b) => a[0].localeCompare(b[0]));
    if (entriesA.length !== entriesB.length) {
        return false;
    }
    return zip(entriesA, entriesB).every(([[keyA, valA], [keyB, valB]]) => keyA === keyB && valA === valB);
}

function uniqWith<T>(xs: ReadonlyArray<T>, equal: (a: T, b: T) => boolean) {
    return xs.filter((x, indexOfX, ys) => ys.findIndex((y) => equal(x, y)) === indexOfX);
}
function dropRepeatV1(
    arr: ReadonlyArray<Record<string, number | string | boolean>>,
): Array<Record<string, number | string | boolean>> {
    return uniqWith(arr, shallowEqual);
}

function shallowSortedKey<T extends Record<string, unknown>>(obj: T): T {
    return Object.fromEntries(Object.entries(obj).sort((a, b) => a[0].localeCompare(b[0]))) as T;
}
function uniqBy<T>(xs: ReadonlyArray<T>, getKey: (item: T) => unknown) {
    const keySet = new Set();
    return xs.filter((item) => {
        const key = getKey(item);
        if (keySet.has(key)) {
            return false;
        } else {
            keySet.add(key);
            return true;
        }
    });
}
function dropRepeatV2(
    arr: ReadonlyArray<Record<string, number | string | boolean>>,
): Array<Record<string, number | string | boolean>> {
    return uniqBy(arr, (item) => JSON.stringify(shallowSortedKey(item)));
}

console.log(dropRepeatV1([{ a: 1, b: 2 }, { b: 2, a: 1 }, { c: 1 }, { a: '1', b: 2 }]));
console.log(dropRepeatV2([{ a: 1, b: 2 }, { b: 2, a: 1 }, { c: 1 }, { a: '1', b: 2 }]));
10、实现EventEmitter类，需要实现on,off,once,emit几个方法
示例：
class EventEmitter {
  	// TODO 待补充
  	// ...
  	on(name: string, callback: Function) {
      	// TODO
    }

	  off(name: string) {
      	// TODO
    }

    once(name: string, callback: Function) {
      	// TODO
    }
  
  	emit(name: string, value: any) {
      	// TODO
    }
}
答案
class EventEmitter {
		map = new Map<string, Set<(p:any)=>void>>()
  	on(name: string, callback: (p:any)=>void) {
      	let set = this.map.get(name);
      	if(!set){
					set = new Set()
          this.map.set(name,set)
				}
      	set.add(callback)
    }

	  off(name: string) {
      	const set = this.map.get(name);
      	set?.clear()
    }

    once(name: string, callback: (p:any)=>void) {
      	this.on(name,(v)=>{
          	const set = this.map.get(name);
						set?.off(callback);
						callback(v);
				})
    }
  
  	emit(name: string, value: any) {
        const set = this.map.get(name);
				set?.forEach(f=>f(value))
    }
}
11、实现一个Request Pool
1、假设全局已经实现一个方法：
declare function ajax(url: string, params?: any): Promise<any>;
2、假设浏览器无最大并发请求限制

需实现createRequest方法，要求
1.调用方式，createRequest函数调用后会返回一个函数，参数pool为最大并发限制，在描述3中会进行补充
const request = createRequest({
    // 在同一时刻内，浏览器最大的并发数量
    pool: 3,
});
2.当前这个request函数和ajax的调用方式完全一致（参数，返回值），也就是表示在任何场景下，ajax和request可以做到等价替换
3. 表现不同，ajax会同时发起20个请求，request会在同一时刻最多并行pool个请求，比如以下代码：
for (let i = 0; i < 20; i++) {
    ajax('/user', { id: i }).then(console.log);
}


for (let i = 0; i < 20; i++) {
    request('/user', { id: i }).then(console.log);
}
前者，Network模块中会显示同时发起20个请求，每个请求结束后会在控制台打印出对应结果，后者则会如下图所示，在每一个时刻最多并发出3个请求
 
请补充以下代码来完成题目要求：
function createRequest(params: { pool: number }) {
		// TODO
}

答案
// 闭包保存变量版
function createRequest({ pool }: { pool: number }) {
    const waitingList: Array<() => void> = [];
    let count = 0;

    function doNext() {
        if (count < pool && waitingList.length) {
            const next = waitingList.shift();
            next();
        }
    }
    return function (url: string, params?: any) {
        return new Promise((resolve, reject) => {
            waitingList.push(() => {
                count++;
                ajax(url, params).then(res => {
                    count--;
                    resolve(res);
                    doNext()
                }).catch(reason => {
                    count--;
                    reject(reason);
                    doNext()
                })
            });
            doNext();
        });
    }
}
/* 特别卷的写法（很OOP） */
class PoolManager {
    private pool: Map<string, Pool> = new Map;
    has(domain: string) {
        return this.pool.has(domain);
    }
    get(domain: string) {
        return this.pool.get(domain);
    }
    add(domain: string, limit: number) {
        const pool = new Pool(limit);
        this.pool.set(domain, pool);
        return pool;
    }
}

class Pool {
    private pool: Array<MyRequest> = [];
    private count = 0;
    private limit: number;
    constructor(limit: number) {
        this.limit = limit;
    }
    push(request: MyRequest) {
        this.pool.push(request);
        this.doNext();
    }
    doNext() {
        if (this.count < this.limit && this.pool.length) {
            const request = this.pool.shift();
            this.count++;
            request.doRequest().then(() => {
                this.count--;
                this.doNext();
            }).catch(() => {
                this.count--;
                this.doNext();
            });
        }
    }
}

class MyRequest {
    private url: string;
    private params?: any;
    private resolve: (value: any) => void;
    private reject: (err: any) => void;
    constructor({
        url,
        params,
        resolve,
        reject
    }: {
        url: string;
        params?: any;
        resolve: (value: any) => void;
        reject: (err: any) => void;
    }) {
        this.url = url;
        this.params = params;
        this.resolve = resolve;
        this.reject = reject;
    }
    doRequest() {
        return ajax(this.url, this.params).then(this.resolve, this.reject);
    }
}

function getDomain(url: string) {
    if (url.startsWith('//') || url.startsWith('http')) {
        const matchs = url.match(/^(https?:)?\/\/(\w+\.?)+/);
        return matchs && matchs[2] || '';
    }
    return location.hostname;
}

function createRequest({ pool }: { pool: number }) {
    const poolManager = new PoolManager();
    return (url: string, params?: any) => {
        const domain = getDomain(url);
        const currentPool = poolManager.has(domain)
            ? poolManager.get(domain)
            : poolManager.add(domain, pool);
        return new Promise((resolve, reject) => {
            currentPool.push(new MyRequest({
                url,
                params,
                resolve,
                reject
            }));
        });
    }
}

基础：
	基本完成功能，有一些代码瑕疵，比如使用Promise.race进行并发控制，代码逻辑性上虽然完成了功能，但是扔有待推敲。
	难度：K3B以上需满足
中等：
	能够较为清晰的整理出代码，无显著瑕疵，比如对于回调的控制，计数/请求队列的管理，边界情况的考量。
	难度：K3B+以上需满足
高级：
	构造场景： 1. 假设老板突然说，需要区分域名做最大请求限制，你会如何更改你的代码？（假设用于CORS） 2. 老板突然又说这个方式不太好，还是改成全局最大并发限制，但是你出于对代码可维护性的理解，担心老板有一天又要变卦，那么你将如何修改你的代码以应对变化？ 考察面试者是否考虑到了开闭原则，单一职责以及里氏替换原则等。
	难度：K3C以上需满足


四、框架能力题（考核主流框架的熟悉程度）
1、基于Vue / React实现一个Dialog组件
考察点：prop / event以及Children / Slot等的设计

答案

2、基于Vue / React实现一个带全选功能的列表
UI示例：
口 全选

口 苹果
口 香蕉
口 梨
。。。
。。
。
。

答案

3、在Vue / React中，什么是受控组件什么是非受控组件
考察点：组件边界思考

答案

4、在Vue / React中，什么是受控组件什么是非受控组件
考察点：组件边界思考

答案
  
5、在React / Vue中如何避免组件的重新渲染
考察点：Vue中的响应式原理，React中render结果比对理解，闭包应用理解等

答案

6、在Vue / React中，什么是受控组件什么是非受控组件
考察点：组件边界思考

答案

7、React / Vue生命周期有哪些不同阶段

答案

8、如何理解React / Vue中的Context
考察点：组件边界思考

答案

9、Vue中是如何做到依赖收集的？（比如将变量与模板中使用的变量关联上）

答案


