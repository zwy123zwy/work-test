// object.is
Object.is = function (x, y) {
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    }
    return x !== x && y !== y;
}

// 原型链继承
function Parent() {
    this.name = 'parent';
}

Parent.prototype.getName = function () {
    console.log(this.name);
}

function Child() {
    this.age = 18;
}

const parent = new Parent();
Child.prototype = parent;
const child = new Child();
child.getName();

// 构造函数
function Parent() {
    this.name = 'parent';
    this.getName = function () {
        console.log(this.name);
    }
}

function Child() {
    Parent.call(this);
    this.age = 18;
}

// 组合继承
function Parent() {
    this.name = 'parent';
}

Parent.prototype.getName = function () {
    console.log(this.name);
}

function Child() {
    Parent.call(this);
    this.age = 18;
}

Child.prototype = new Parent();

// 原型继承
let parent = { name: 'parent' };

let child = Object.create(parent);

// 寄生继承
function createAnother(original) {
    let clone = object(original);  // 通过调用函数创建一个新对象 
    clone.sayHi = function () {     // 以某种方式增强这个对象 
        console.log("hi");
    };
    return clone;           // 返回这个对象 
}


// 寄生组合式继承
function Parent() {
    this.name = 'parent';
    this.getName = function () {
        console.log(this.name);
    }
    this.friends = ['a', 'b', 'c'];
}
