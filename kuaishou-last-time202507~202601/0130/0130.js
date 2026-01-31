// // /**
// //  * typeof 操作符对不同数据类型的返回结果
// //  */

// // console.log('=== JavaScript 中 typeof 操作符的返回结果 ===');

// // // 1. Number 类型
// // let num = 10;
// // console.log(`typeof ${num}:`, typeof num); // "number"

// // // 2. String 类型
// // let str = "hello";
// // console.log(`typeof "${str}":`, typeof str); // "string"

// // // 3. Boolean 类型
// // let bool = true;
// // console.log(`typeof ${bool}:`, typeof bool); // "boolean"

// // // 4. Undefined 类型
// // let emptyIsUndefined;
// // console.log('typeof emptyIsUndefined:', typeof emptyIsUndefined); // "undefined"

// // // 5. Object 类型 (包括普通对象、数组等)
// // let obj = {};
// // console.log('typeof {}:', typeof obj); // "object"
// // let arr = [1, 2, 3];
// // console.log('typeof []:', typeof arr); // "object"

// // // 6. Function 类型
// // function myFunc() {}
// // console.log('typeof function:', typeof myFunc); // "function"
// // let arrowFunc = () => {};
// // console.log('typeof arrow function:', typeof arrowFunc); // "function"

// // // 7. Symbol 类型 (ES6 新增)
// // let sym = Symbol('test');
// // console.log('typeof Symbol:', typeof sym); // "symbol"

// // // 8. BigInt 类型 (ES2020 新增)
// // let bigIntNum = 123n;
// // console.log('typeof BigInt:', typeof bigIntNum); // "bigint"

// // console.log('\n=== 特殊情况：null ===');
// // // 特别注意：这是 JavaScript 的一个历史遗留问题
// // let nullValue = null;
// // console.log('typeof null:', typeof null); // "object" (这是一个历史错误，但无法修复，因为会破坏现有代码)

// // console.log('\n=== 总结 ===');
// // console.log('typeof 对以下类型返回的字符串值：');
// // console.log('- Number -> "number"');
// // console.log('- String -> "string"');
// // console.log('- Boolean -> "boolean"');
// // console.log('- Undefined -> "undefined"');
// // console.log('- Null -> "object" (特殊/错误的情况)');
// // console.log('- Object (包括数组和普通对象) -> "object"');
// // console.log('- Function -> "function"');
// // console.log('- Symbol -> "symbol"');
// // // console.log('- BigInt -> "bigint"');

// console.log(0 == false);
// console.log(0 === false);
// console.log(null == undefined);
// console.log(NaN == NaN);
// console.log(NaN === NaN);
// console.log(null === undefined);

// Array

Array.prototype.MyPush = function (...args) {
    for (let i = 0; i < args.length; i++) {
        this[this.length] = args[i];
    }
    return this.length;
};

Array.prototype.MyPop = function () {
    if (this.length === 0) {
        return undefined;
    }
    let lastItem = this[this.length - 1];
    this.length--;
    return lastItem;
};

Array.prototype.MyShift = function () {
    if (this.length === 0) {
        return undefined;
    }
    let firstItem = this[0];
    for (let i = 0; i < this.length - 1; i++) {
        this[i] = this[i + 1];
    }
    this.length--;
    return firstItem;
};

// 
Array.prototype.MyUnshift = function (...args) {
    for (let i = this.length - 1; i >= 0; i--) {
        this[i + args.length] = this[i];
    }
    for (let i = 0; i < args.length; i++) {
        this[i] = args[i];
    }
    return this.length;
};

// 
Array.prototype.MySplice = function (start, deleteCount, ...items) {
    // 处理start参数
    let actualStart;

    if (start < 0) {
        actualStart = Math.max(this.length + start, 0);
    } else {
        actualStart = Math.min(start, this.length);
    }

    // 处理deleteCount参数
    if (deleteCount === undefined || deleteCount === null) {
        deleteCount = this.length - actualStart;
    } else if (deleteCount < 0) {
        deleteCount = 0;
    } else {
        deleteCount = Math.min(deleteCount, this.length - actualStart);
    }

    // 获取要删除的元素
    const deletedItems = [];
    for (let i = 0; i < deleteCount; i++) {
        if ((actualStart + i) in this) {
            deletedItems.push(this[actualStart + i]);
        }
    }

    // 如果添加的元素数量与删除的数量相等
    if (items.length === deleteCount) {
        for (let i = 0; i < items.length; i++) {
            this[actualStart + i] = items[i];
        }
    }
    // 如果添加的元素数量大于删除的数量（会导致数组变长）
    else if (items.length > deleteCount) {
        // 将要插入位置之后的元素向后移动
        for (let i = this.length - 1; i >= actualStart + deleteCount; i--) {
            this[i + (items.length - deleteCount)] = this[i];
        }

        // 插入新元素
        for (let i = 0; i < items.length; i++) {
            this[actualStart + i] = items[i];
        }
    }
    // 如果添加的元素数量小于删除的数量（会导致数组变短）
    else {
        // 移动元素填补空缺
        for (let i = actualStart + deleteCount; i < this.length; i++) {
            this[i - (deleteCount - items.length)] = this[i];
        }

        // 减少数组长度
        this.length = this.length - deleteCount + items.length;
    }

    return deletedItems;
};
// slice
Array.prototype.MySlice = function (start, end) {
    let newArray = [];
    for (let i = start; i < end; i++) {
        newArray.push(this[i]);
    }
    return newArray;
};
// concat
Array.prototype.MyConcat = function (...args) {
    let newArray = [];
    for (let i = 0; i < this.length; i++) {
        newArray.push(this[i]);
    }
    for (let i = 0; i < args.length; i++) {
        if (Array.isArray(args[i])) {
            for (let j = 0; j < args[i].length; j++) {
                newArray.push(args[i][j]);
            }
        }
        else {
            newArray.push(args[i]);
        }
    }
    return newArray;
}


// join
Array.prototype.MyJoin = function (separator) {
    let newString = '';
    for (let i = 0; i < this.length; i++) {
        newString += this[i] + separator;
    }
    return newString.slice(0, -separator.length);
}

// foreach
Array.prototype.MyForEach = function (callback) {
    for (let i = 0; i < this.length; i++) {
        callback(this[i], i, this);
    }
}

// map
Array.prototype.MyMap = function (callback) {
    let newArray = [];
    for (let i = 0; i < this.length; i++) {
        newArray.push(callback(this[i], i, this));
    }
    return newArray;
}
// filter
Array.prototype.MyFilter = function (callback) {
    let newArray = [];
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            newArray.push(this[i]);
        }
    }
    return newArray;
}

// reduce

Array.prototype.MyReduce = function (callback, initialValue) {
    let accumulator = initialValue;
    for (let i = 0; i < this.length; i++) {
        accumulator = callback(accumulator, this[i], i, this);
    }
    return accumulator;
}

// reduceRight

Array.prototype.MyReduceRight = function (callback, initialValue) {
    let accumulator = initialValue;
    for (let i = this.length - 1; i >= 0; i--) {
        accumulator = callback(accumulator, this[i], i, this);
    }
    return accumulator;
}

// some
Array.prototype.MySome = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return true;
        }
    }
    return false;
}

// every
Array.prototype.MyEvery = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (!callback(this[i], i, this)) {
            return false;
        }
    }
    return true;
}

// find
Array.prototype.MyFind = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return this[i];
        }
    }
    return undefined;
}

// findIndex
Array.prototype.MyFindIndex = function (callback) {
    for (let i = 0; i < this.length; i++) {
        if (callback(this[i], i, this)) {
            return i;
        }
    }
    return -1;
}

// includes
Array.prototype.MyIncludes = function (searchElement, fromIndex) {
    if (fromIndex === undefined) {
        fromIndex = 0;
    }
    for (let i = fromIndex; i < this.length; i++) {
        if (this[i] === searchElement) {
            return true;
        }
    }
    return false;
}

// indexOf
Array.prototype.MyIndexOf = function (searchElement, fromIndex) {
    if (fromIndex === undefined) {
        fromIndex = 0;
    }
    for (let i = fromIndex; i < this.length; i++) {
        if (this[i] === searchElement) {
            return i;
        }
    }
    return -1;
}

// sort
Array.prototype.MySort = function (compareFunction) {
    for (let i = 0; i < this.length; i++) {
        for (let j = 0; j < this.length - i - 1; j++) {
            if (compareFunction(this[j], this[j + 1]) > 0) {
                let temp = this[j];
                this[j] = this[j + 1];
                this[j + 1] = temp;
            }
        }

    }
    return this;
}
    
// reverse
Array.prototype.MyReverse = function () {
    for (let i = 0; i < this.length / 2; i++) {
        let temp = this[i];
        this[i] = this[this.length - 1 - i];
        this[this.length - 1 - i] = temp;
    }
    return this;
}

// FILL
Array.prototype.MyFill = function (value, start, end) { 
    if (start === undefined) {
        start = 0;
    }
    if (end === undefined) {
        end = this.length;
    }
    for (let i = start; i < end; i++) {
        this[i] = value;
    }
    return this;
}

// FLAT
Array.prototype.MyFlat = function (depth) { 
    if (depth === undefined) {
        depth = 1;
    }
    let newArray = [];
    for (let i = 0; i < this.length; i++) {
        if (Array.isArray(this[i]) && depth > 0) {
            newArray = newArray.concat(this[i].MyFlat(depth - 1));
        }
        else {
            newArray.push(this[i]);
        }
    }
    return newArray;
}


// 1. 原型链继承
function Parent() {
    this.name = 'parent';
    this.colors = ['red', 'blue'];
}

Parent.prototype.getName = function() {
    return this.name;
};

function Child() {
    this.age = 18;
}

// 原型链继承
Child.prototype = new Parent();

const child1 = new Child();
const child2 = new Child();

console.log(child1.getName()); // parent
child1.colors.push('green');
console.log(child2.colors); // ['red', 'blue', 'green'] - 共享引用
// 优点：

// 简单易懂，实现方便
// 可以继承原型上的属性和方法
// 缺点：

// 子类实例共享父类引用类型属性
// 无法向父类构造函数传递参数
// 2. 构造函数继承（经典继承）
function Parent(name) {
    this.name = name;
    this.colors = ['red', 'blue'];
}

Parent.prototype.getName = function() {
    return this.name;
};

function Child(name, age) {
    // 构造函数继承
    Parent.call(this, name);
    this.age = age;
}

const child3 = new Child('child1', 18);
const child4 = new Child('child2', 20);

child3.colors.push('green');
console.log(child4.colors); // ['red', 'blue'] - 各自独立
// 优点：

// 可以向父类构造函数传递参数
// 子类实例拥有独立的属性
// 缺点：

// 只能继承父类构造函数的属性
// 无法继承父类原型上的方法
// 3. 组合继承（原型链 + 构造函数）
function Parent(name) {
    this.name = name;
    this.colors = ['red', 'blue'];
}

Parent.prototype.getName = function() {
    return this.name;
};

function Child(name, age) {
    // 构造函数继承
    Parent.call(this, name);
    this.age = age;
}

// 原型链继承
Child.prototype = new Parent();
Child.prototype.constructor = Child;

const child5 = new Child('child1', 18);
const child6 = new Child('child2', 20);

console.log(child5.getName()); // child1
child5.colors.push('green');
console.log(child6.colors); // ['red', 'blue']
// 优点：

// 既能继承构造函数属性，又能继承原型方法
// 子类实例属性独立
// 缺点：

// 父类构造函数被调用两次
// 存在冗余属性
// 4. 寄生组合继承
function Parent(name) {
    this.name = name;
    this.colors = ['red', 'blue'];
}

Parent.prototype.getName = function() {
    return this.name;
};

function Child(name, age) {
    Parent.call(this, name);
    this.age = age;
}

// 寄生组合继承
function inheritPrototype(subType, superType) {
    const prototype = Object.create(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}

inheritPrototype(Child, Parent);

const child7 = new Child('child1', 18);
const child8 = new Child('child2', 20);

console.log(child7.getName()); // child1
child7.colors.push('green');
console.log(child8.colors); // ['red', 'blue']
// 优点：

// 只调用一次父类构造函数
// 避免了组合继承的冗余属性
// 最佳继承方案
// 缺点：

// 实现相对复杂
// 需要额外的函数封装
// 5. ES6 Class 继承
class Parent {
    constructor(name) {
        this.name = name;
        this.colors = ['red', 'blue'];
    }
    
    getName() {
        return this.name;
    }
}

class Child extends Parent {
    constructor(name, age) {
        super(name); // 调用父类构造函数
        this.age = age;
    }
    
    getAge() {
        return this.age;
    }
}

const child9 = new Child('child1', 18);
const child10 = new Child('child2', 20);

console.log(child9.getName()); // child1
child9.colors.push('green');
console.log(child10.colors); // ['red', 'blue']
// 优点：

// 语法简洁，易于理解
// 代码可读性强
// 与传统面向对象语言相似
// 编译器优化好
// 缺点：

// 需要 ES6 环境支持
// 本质上还是原型继承

// 6. 混入继承（Mixin）
// 混入函数
function mixin(target, source) {
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
    return target;
}

const Parent = {
    name: 'parent',
    colors: ['red', 'blue'],
    getName() {
        return this.name;
    }
};

const Child = {
    age: 18,
    getAge() {
        return this.age;
    }
};

// 混入继承
const child = mixin({}, Parent);
mixin(child, Child);

console.log(child.getName()); // parent
console.log(child.getAge()); // 18