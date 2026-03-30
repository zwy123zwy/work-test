/**
 * 前端面试题之代码输出篇 - 完整测试代码
 * 来源：https://www.yuque.com/cuggz/interview/wm7x19
 * 提取时间：2026-03-30
 *
 * 使用方法：
 * - 浏览器：直接在控制台运行
 * - Node.js：node yuque_questions.js
 */

// ============================================
// 一、异步&事件循环 (31题)
// ============================================

// 1. Promise基础
console.log('=== 题目1: Promise基础 ===');
const promise1 = new Promise((resolve, reject) => {
    console.log(1);
    console.log(2);
});
promise1.then(() => {
    console.log(3);
});
console.log(4);

// 2. Promise链式调用
console.log('\n=== 题目2: Promise链式调用 ===');
const promise2 = new Promise((resolve, reject) => {
    console.log('promise1');
    resolve('resolve1');
});
const promise3 = promise2.then(res => {
    console.log(res);
});
console.log('1', promise2);
console.log('2', promise3);

// 3. Promise + setTimeout
console.log('\n=== 题目3: Promise + setTimeout ===');
const promise4 = new Promise((resolve, reject) => {
    console.log(1);
    setTimeout(() => {
        console.log("timerStart");
        resolve("success");
        console.log("timerEnd");
    }, 0);
    console.log(2);
});
promise4.then((res) => {
    console.log(res);
});
console.log(4);

// 4. Promise.resolve + setTimeout
console.log('\n=== �题目4: Promise.resolve + setTimeout ===');
Promise.resolve().then(() => {
    console.log('promise1');
    const timer2 = setTimeout(() => {
        console.log('timer2')
    }, 0);
});
const timer1 = setTimeout(() => {
    console.log('timer1');
    Promise.resolve().then(() => {
        console.log('promise2');
    });
}, 0);
console.log('start');

// 5. Promise状态不会改变
console.log('\n=== 题目5: Promise状态不会改变 ===');
const promise5 = new Promise((resolve, reject) => {
    resolve('success1');
    reject('error');
    resolve('success2');
});
promise5.then((res) => {
    console.log('then:', res);
}).catch((err) => {
    console.log('catch:', err);
});

// 6. Promise.resolve + then参数
console.log('\n=== 题目6: Promise.resolve + then参数 ===');
Promise.resolve(1)
    .then(2)
    .then(Promise.resolve(3))
    .then(console.log);

// 7. Promise + setTimeout + then + catch
console.log('\n=== 题目7: Promise + setTimeout + then + catch ===');
const promise6 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('success');
    }, 1000);
});
const promise7 = promise6.then(() => {
    throw new Error('error!!!');
});
console.log('promise1', promise6);
console.log('promise2', promise7);
setTimeout(() => {
    console.log('promise1', promise6);
    console.log('promise2', promise7);
}, 2000);

// 8. Promise链式调用
console.log('\n=== 飞题目8: Promise链式调用 ===');
Promise.resolve(1)
    .then(res => {
        console.log(res);
        return 2;
    })
    .catch(err => {
        return 3;
    })
    .then(res => {
        console.log(res);
    });

// 9. Promise.resolve + return Error
console.log('\n=== 题目9: Promise.resolve + return Error ===');
Promise.resolve()
    .then(() => {
        return new Error('error!!!');
    })
    .then(res => {
        console.log("then: ", res);
    })
    .catch(err => {
        console.log("catch: ", err);
    });

// 10. Promise死循环
console.log('\n=== 题目10: Promise死循环 ===');
const promise8 = Promise.resolve()
    .then(() => {
        return promise8;
    });
promise8.catch(console.error);

// 11. Promise.resolve + then参数
console.log('\n=== 题目11: Promise.resolve + then参数 ===');
Promise.resolve(1)
    .then(2)
    .then(Promise.resolve(3))
    .then(console.log);

// 12. Promise.reject + then + catch
console.log('\n=== 题目12: Promise.reject + then + catch ===');
Promise.reject('err!!!')
    .then((res) => {
        console.log('success', res);
    }, (err) => {
        console.log('error', err);
    })
    .catch(err => {
        console.log('catch', err);
    });

// 13. Promise.finally
console.log('\n=== 题目13: Promise.finally ===');
Promise.resolve()
    .then(() => {
        return new Error('error!!!');
    })
    .then(res => {
        console.log("then: ", res);
    })
    .catch(err => {
        console.log("catch: ", err);
    });

// 14. Promise.all
console.log('\n=== 题目14: Promise.all ===');
function runAsync(x) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(x);
        }, 1000);
    });
}
Promise.all([runAsync(1), runAsync(2), runAsync(3)])
    .then(res => console.log(res));

// 15. Promise.all + 错误捕获
console.log('\n=== 题目15: Promise.all + 错误捕获 ===');
function runReject(x) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(`Error: ${x}`);
        }, 1000 * x);
    });
}
Promise.all([runAsync(1), runReject(4), runAsync(3), runReject(2)])
    .then(res => console.log(res))
    .catch(err => console.log(err));

// 16. Promise.race
console.log('\n=== 题目16: Promise.race ===');
Promise.race([runAsync(1), runAsync(2), runAsync(3)])
    .then(res => console.log('result: ', res));

// 17. Promise.race + 错误捕获
console.log('\n=== 题目17: Promise.race + 错误捕获 ===');
Promise.all([
    runAsync(1),
    runReject(4),
    runAsync(3),
    runReject(2)
])
    .then(res => console.log(res))
    .catch(err => console.log(err));

// 18. async/await基础
console.log('\n=== 题目18: async/await基础 ===');
async function async1() {
    console.log("async1 start");
    await async2();
    console.log("async1 end");
}
async function async2() {
    console.log("async2");
}
async1();
console.log("start");

// 19. async/await + setTimeout
console.log('\n=== 题目19: async/await + setTimeout ===');
async function async1() {
    console.log("async1 start");
    await async2();
    console.log("async1 end");
    setTimeout(() => {
        console.log("timer1");
    }, 0);
}
async function async2() {
    setTimeout(() => {
        console.log("timer2");
    }, 0);
    console.log("async2");
}
async1();
setTimeout(() => {
    console.log("timer3");
}, 0);
console.log("start");

// 20. async/await + 没有返回值的Promise
console.log('\n=== 题目20: async/await + 没有返回值的Promise ===');
async function async1() {
    console.log("async1 start");
    await new Promise(resolve => {
        console.log("promise1");
    });
    console.log("async1 end");
    return "async1 success";
}
async1().then(res => console.log(res));
console.log("script end");

// 21. async/await + 有返回值的Promise
console.log('\n=== 题目21: async/await + 有返回值的Promise ===');
async function async1() {
    console.log("async1 start");
    await new Promise(resolve => {
        console.log("promise1");
        resolve("promise1 resolve");
    });
    console.log("async1 end");
    return "async1 success";
}
async1().then(res => console.log(res));
console.log("script end");

// 22. async/await + Promise链式
console.log('\n=== 题目22: async/await + Promise链式 ===');
async function async1() {
    console.log("async1 start");
    await async2();
    console.log("async1 end");
}
async function async2() {
    console.log("async2");
}
console.log("script start");
setTimeout(() => {
    console.log("setTimeout");
}, 0);
async1();
new Promise(resolve => {
    console.log("promise1");
    resolve();
}).then(() => {
    console.log("promise2");
});
console.log("script end");

// 23. async/await + 错误处理
console.log('\n=== 题目23: async/await + 错误处理 ===');
async function async1() {
    await async2();
    console.log("async1");
    return "async1 success";
}
async function async2() {
    return new Promise((resolve, reject) => {
        console.log("async2");
        reject(new Error("error"));
    });
}
async1().then(res => console.log(res));

// 24. 多层Promise
console.log('\n=== 题目24: 多层Promise ===');
const first = () => (new Promise((resolve, reject) => {
    console.log(3);
    let p = new Promise((resolve, reject) => {
        console.log(7);
        setTimeout(() => {
            console.log(5);
            resolve(6);
            console.log(p);
        }, 0);
        resolve(1);
    });
    resolve(2);
    p.then((arg) => {
        console.log(arg);
    });
}));
first().then((arg) => {
    console.log(arg);
});
console.log(4);

// 25. 多个Promise + setTimeout
console.log('\n=== 题目25: 多个Promise + setTimeout ===');
const async1 = async () => {
    console.log("async1");
    setTimeout(() => {
        console.log("timer1");
    }, 2000);
    await new Promise(resolve => {
        console.log("promise1");
    });
    console.log("async1 end");
    return "async1 success";
};
console.log("script start");
async1().then(res => console.log(res));
console.log("script end");
Promise.resolve(1)
    .then(2)
    .then(Promise.resolve(3))
    .then(console.log);
setTimeout(() => {
    console.log("timer2");
}, 1000);

// 26. Promise.finally + setTimeout
console.log('\n=== 题目26: Promise.finally + setTimeout ===');
const p1 = new Promise(resolve => {
    setTimeout(() => {
        resolve('resolve3');
        console.log('timer1');
    }, 0);
    resolve('resolve1');
    resolve('resolve2');
}).then(res => {
    console.log(res);
    setTimeout(() => {
        console.log(p1);
    }, 1000);
}).finally(res => {
    console.log('finally', res);
});

// 27. 事件循环完整流程
console.log('\n=== 题目27: 事件循环完整流程 ===');
console.log('1');
setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    });
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5');
    });
});
process.nextTick(function() {
    console.log('6');
});
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8');
});
setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    });
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12');
    });
});

// 28. 多个setTimeout + Promise
console.log('\n=== 题目28: 多个setTimeout + Promise ===');
console.log(1);
setTimeout(() => {
    console.log(2);
}, 0);
new Promise((resolve, reject) => {
    console.log(3);
    resolve();
    console.log(4);
}).then(() => {
    console.log(5);
});
console.log(8);

// 29. Promise.resolve + setTimeout
console.log('\n=== 题目29: Promise.resolve + setTimeout ===');
console.log(1);
setTimeout(() => {
    console.log(2);
}, 0);
Promise.resolve().then(() => {
    console.log(3);
});
setTimeout(() => {
    console.log(4);
}, 0);
console.log(5);

// 30. Promise.then + catch
console.log('\n=== 题目30: Promise.then + catch ===');
Promise.resolve()
    .then(() => {
        console.log(1);
        throw new Error('error1');
    })
    .catch(() => {
        console.log(2);
    })
    .then(() => {
        console.log(3);
    });

// 31. 定时器时间差异
console.log('\n=== 题目31: 定时器时间差异 ===');
console.log(1);
setTimeout(() => {
    console.log(2);
}, 100);
Promise.resolve().then(() => {
    console.log(3);
});
new Promise((resolve) => {
    console.log(4);
    resolve(5);
}).then((data) => {
    console.log(data);
    return new Promise((resolve) => {
        console.log(6);
        setTimeout(() => {
            console.log(7);
        }, 10);
    });
});
console.log(8);

// ============================================
// 二、this指向 (15题)
// ============================================

// 1. 箭头函数 + apply
console.log('\n=== 题目1: 箭头函数 + apply ===');
var a = 10;
var obj = {
    a: 20,
    say: () => {
        console.log(this.a);
    }
};
obj.say();
var anotherObj = { a: 30 };
obj.say.apply(anotherObj);

// 2. 普通函数 + apply
console.log('\n=== 题目2: 普通函数 + apply ===');
var a = 10;
var obj = {
    a: 20,
    say() {
        console.log(this.a);
    }
};
obj.say();
var anotherObj = { a: 30 };
obj.say.apply(anotherObj);

// 3. call + null
console.log('\n=== 题目3: call + null ===');
function a() {
    console.log(this);
}
a.call(null);

// 4. 箭头函数 + 闭包
console.log('\n=== 题目4: 箭头函数 + 闭包 ===');
var obj = {
    say: function() {
        var f1 = () => {
            console.log("111: ", this);
        };
        f1();
    },
    pro: {
        getPro: () => {
            console.log("222: ", this);
        }
    }
};
var o = obj.say();
o();
obj.say();
obj.pro.getPro();

// 5. 立即执行函数 + this
console.log('\n=== 题目5: 立即执行函数 + this ===');
var myObject = {
    foo: "bar",
    func: function() {
        var self = this;
        console.log("outer func: this.foo = " + this.foo);
        console.log("outer func: self.foo = " + self.foo);
        (function() {
            console.log("inner func: this.foo = " + this.foo);
            console.log("inner func: self.foo = " + self.foo);
        }());
    }
};
myObject.func();

// 6. 立即执行函数 + this绑定
console.log('\n=== 题目6: 立即执行函数 + this绑定 ===');
window.number = 2;
var obj = {
    number: 3,
    db1: (function(){
        console.log(this);
        this.number *= 4;
        return function(){
            console.log(this);
            this.number *= 5;
        }
    })()
};
var db1 = obj.db1;
db1();
obj.db1();
console.log(obj.number);     // 15
console.log(window.number);  // 40

// 7. arguments调用
console.log('\n=== 题目7: arguments调用 ===');
var length = 10;
function fn() {
    console.log(this.length);
}
var obj = {
    length: 5,
    method: function(fn) {
        fn();
        arguments[0]();
    }
};
obj.method(fn, 1);

// 8. 函数声明 + 函数表达式
console.log('\n=== 题目8: 函数声明 + 函数表达式 ===');
var obj = {
    foo: function () { console.log(this.a) },
    a: 1
};
var foo = obj.foo;
var a = 2;
obj.foo();     // 1
foo();         // 2

// 9. this指向 + 变量
console.log('\n=== 题目9: this指向 + 变量 ===');
var x = 10;
var obj = {
    x: 20,
    f: function(){
        console.log(this.x);
        var foo = function(){ 
            console.log(this.x); 
        }
        foo();
    }
};
obj.f();

// 10. doFoo调用函数
console.log('\n=== 题目10: doFoo调用函数 ===');
function foo() {
    console.log(this.a);
}
function doFoo(fn) {
    fn();
}
var obj = { a: 2, foo: foo };
var a = 10;
doFoo(obj.foo);

// 11. call调用
console.log('\n=== 题目11: call调用 ===');
function foo() {
    console.log(this.a);
}
var obj = { a: 2 };
foo.call(obj);

// 12. call链式调用
console.log('\n=== 题目12: call链式调用 ===');
var obj = {
    a: 1,
    foo: function (b) {
        b = b || this.a;
        return function (c) {
            console.log(this.a + b + c);
        }
    }
};
var a = 2;
var obj2 = { a: 3 };
obj.foo(a).call(obj2, 1);
obj.foo.call(obj2)(1);

// 13. 多种this绑定方式
console.log('\n=== 题目13: 多种this绑定方式 ===');
function foo() {
    console.log(this.a);
}
var a = 1;
foo();                            // 1
var obj = { a: 2, foo: foo };
obj.foo();                        // 2
foo.call();                       // 1
foo.apply();                      // 1
foo.bind({ a: 3 })();             // 3

// 14. 对象属性赋值 + this
console.log('\n=== 题目14: 对象属性赋值 + this ===');
var a = { n: 1 };
var b = a;
a.x = a = { n: 2 };
console.log(a.x);  // undefined
console.log(b.x);  // { n: 2 }

// 15. this绑定优先级
console.log('\n=== 题目15: this绑定优先级 ===');
function Foo() {
    getName = function () { console.log(1); };
    return this;
}
Foo.getName = function () { console.log(2); };
Foo.prototype.getName = function () { console.log(3); };
var getName = function () { console.log(4); };
function getName() { console.log(5); }

Foo.getName();                // 2
getName();                    // 4
Foo().getName();              // 1
getName();                    // 1
new Foo.getName();            // 2
new Foo().getName();          // 3
new new Foo().getName();      // 3

// ============================================
// 三、作用域&变量提升&闭包 (8题)
// ============================================

// 1. var声明 + 变量赋值
console.log('\n=== 题目1: var声明 + 变量赋值 ===');
var x = y = 1;
console.log(x);  // 1
console.log(y);  // 1

// 2. 函数声明 + 变量提升
console.log('\n=== 题目2: 函数声明 + 变量提升 ===');
function foo() {
    console.log(a);
    var a = 1;
    console.log(a);
    function a() { }
    console.log(a);
}
foo();

// 3. var + 函数声明
console.log('\n=== 题目3: var + 函数声明 ===');
var foo = function () { console.log(2) };
function foo() { console.log(1) };
foo();

// 4. var + if + 变量提升
console.log('\n=== 题目4: var + if + 变量提升 ===');
var a = 1;
function fn() {
    if (!a) {
        var a = 2;
    }
    console.log(a);
}
fn();

// 5. 变量未定义
console.log('\n=== 题目5: 变量未定义 ===');
function foo() {
    console.log(a);
    a = 1;
}
foo(); // 报错：a is not defined

// 6. 闭包 + 作用域
console.log('\n=== 题目6: 闭包 + 作用域 ===');
var a = 1;
function foo() {
    var a = 2;
    function inner() {
        console.log(a);
    }
    return inner;
}
var fn = foo();
fn();

// 7. 闭包 + 参数
console.log('\n=== 题目7: 闭包 + 参数 ===');
function fun(n, o) {
    console.log(o);
    return {
        fun: function (m) {
            return fun(m, n);
        }
    };
}
var a = fun(0);  // undefined
a.fun(1);        // 0
a.fun(2);        // 0
a.fun(3);        // 0
var b = fun(0).fun(1).fun(2).fun(3); // undefined 0 1 2
var c = fun(0).fun(1); // undefined 0
c.fun(2);        // 1
c.fun(3);        // 1

// 8. var + 全局变量
console.log('\n=== 题目8: var + 全局变量 ===');
var f = true;
if (f === true) {
    var a = 10;
}
function fn() {
    var b = 20;
    c = 30;
}
fn();
console.log(a);  // 10
console.log(b);  // 报错：b is not defined
console.log(c);  // 30

// ============================================
// 四、原型&继承 (9题)
// ============================================

// 1. 原型链基础
console.log('\n=== 题目1: 原型链基础 ===');
function Person(name) {
    this.name = name;
}
var p1 = new Person('Tom');
console.log(p1.__proto__ === Person.prototype);  // true
console.log(Person.__proto__ === Function.prototype);  // true
console.log(Function.prototype.__proto__ === Object.prototype);  // true
console.log(Object.prototype.__proto__ === null);  // true

// 2. 原型修改
console.log('\n=== 题目2: 原型修改 ===');
function Foo() {}
Foo.prototype.n = 1;
var b = new Foo();
Foo.prototype = {
    n: 2,
    m: 3
};
var c = new Foo();
console.log(b.n, b.m);  // 1 undefined
console.log(c.n, c.m);  // 2 3

// 3. 原型继承
console.log('\n=== 题目3: 原型继承 ===');
var F = function() {};
Object.prototype.a = function() {
    console.log('a');
};
Function.prototype.b = function() {
    console.log('b');
};
var f = new F();
f.a();  // a
f.b();  // 报错：f.b is not a function
F.a();  // a
F.b();  // b

// 4. 构造函数 + 原型方法
console.log('\n=== 题目4: 构造函数 + 原型方法 ===');
function Foo() {
    Foo.a = function() {
        console.log(1);
    };
    this.a = function() {
        console.log(2);
    };
}
Foo.prototype.a = function() {
    console.log(3);
};
Foo.a = function() {
    console.log(4);
};
Foo.a();                // 4
var obj = new Foo();
obj.a();                // 2
Foo.a();                // 1

// 5. constructor属性
console.log('\n=== 题目5: constructor属性 ===');
function Dog() {}
Dog.prototype.bark = function() {
    console.log('woof');
};
var dog = new Dog();
console.log(dog.constructor === Dog);  // true
console.log(dog instanceof Dog);       // true

// 6. 原型链继承
console.log('\n=== 题目6: 原型链继承 ===');
function A() {}
function B() {}
function C() {}
B.prototype = new A();
C.prototype = new B();
var c = new C();
console.log(c instanceof A);  // true
console.log(c instanceof B);  // true
console.log(c instanceof C);  // true

// 7. 复杂原型链
console.log('\n=== 题目7: 复杂原型链 ===');
function Parent() {
    this.a = 1;
    this.b = [1, 2, this.a];
    this.c = { demo: 5 };
    this.show = function () {
        console.log(this.a, this.b, this.c.demo);
    };
}
function Child() {
    this.a = 2;
    this.change = function () {
        this.b.push(this.a);
        this.a = this.b.length;
        this.c.demo = this.a++;
    };
}
Child.prototype = new Parent();
var parent = new Parent();
var child1 = new Child();
var child2 = new Child();
child1.a = 11;
child2.a = 12;
parent.show();   // 1 [1, 2, 1] 5
child1.show();   // 11 [1, 2, 1] 5
child2.show();   // 12 [1, 2, 1] 5
child1.change();
child1.show();   // 4 [1, 2, 1, 11] 4
child2.show();   // 12 [1, 2, 1, 11, 12] 5
parent.show();   // 1 [1, 2, 1] 5

// 8. 经典继承
console.log('\n=== 题目8: 经典继承 ===');
function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
}
SuperType.prototype.getSuperValue = function() {
    return this.property;
};
function SubType(name, age) {
    SuperType.call(this, name);
    this.age = age;
}
SubType.prototype = new SuperType();
SubType.prototype.getSubValue = function() {
    return this.subproperty;
};
var instance = new SubType();
console.log(instance.getSuperValue());  // true
console.log(instance instanceof Object);     // true
console.log(instance instanceof SuperType);  // true
console.log(instance instanceof SubType);    // true

// 9. 原型继承
console.log('\n=== 题目9: 原型继承 ===');
function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function() {
    console.log(this.name);
};
function SubType(name, age) {
    SuperType.call(this, name);
    this.age = age;
}
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function() {
    console.log(this.age);
};
var instance1 = new SubType("Nicholas", 29);
instance1.colors.push("black");
console.log(instance1.colors);  // ["red", "blue", "green", "black"]
instance1.sayName();            // "Nicholas"
instance1.sayAge();             // 29
var instance2 = new SubType("Greg", 27);
console.log(instance2.colors);  // ["red", "blue", "green"]
instance2.sayName();            // "Greg"
instance2.sayAge();             // 27
