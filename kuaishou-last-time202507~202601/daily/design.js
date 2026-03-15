// solid 设计原则
// 1. 单一职责原则（Single Responsibility Principle）
// 每个类应该只有一个职责，或者说一个类应该只有一个引起它变化的原因。
// 2. 开放封闭原则（Open/Closed Principle）
// 软件实体（类、模块、函数等）应该对扩展开放，对修改封闭。
// 3. 里氏替换原则（Liskov Substitution Principle）
// 子类对象能够替换父类对象，并且程序的行为不变。
// 4. 接口隔离原则（Interface Segregation Principle）
// 客户端不应该被迫依赖它们不使用的接口，接口应该小而专一。
// 5. 依赖倒置原则（Dependency Inversion Principle）
// 高层模块不应该依赖低层模块，二者都应该依赖抽象；抽象不应该依赖细节，细节应该依赖抽象。

// 设计模式
// 1. 单例模式（Singleton Pattern）
class Singleton {
    constructor() {
        if (Singleton.instance) {
            return Singleton.instance;
        }
        Singleton.instance = this;
    }
}

// 原型模式（Prototype Pattern）
function Prototype() {
    this.name = 'Prototype';
}

// 工厂模式（Factory Pattern）
class Factory {
    create(type) {
        if (type === 'A') {
            return new ProductA();
        } else if (type === 'B') {
            return new ProductB();
        }
    }
}

class ProductA {
    constructor() {
        this.name = 'ProductA';
    }       
}

class ProductB {
    constructor() {
        this.name = 'ProductB';
    }
}

// 抽象工厂模式（Abstract Factory Pattern）
class AbstractFactory {
    createProductA() {  }
    createProductB() {  }
}

// 建造者模式
class Builder {
    constructor() {
        this.product = new Product();
    }   
    buildPartA() {
        this.product.partA = 'PartA';
    }   
    buildPartB() {
        this.product.partB = 'PartB';
    }   
    getResult() {
        return this.product;
    }   
}

class Product {
    constructor() {
        this.partA = '';
        this.partB = '';
    }
}   

// 适配器模式（Adapter Pattern）
class Adapter {
    constructor(adaptee) {
        this.adaptee = adaptee;
        
    }
    request() { 
        return this.adaptee.specificRequest();
    }
}

// 装饰器模式（Decorator Pattern）
class Decorator {
    constructor(component) {    
        this.component = component;
    }   
    operation() {
        this.component.operation();
        // 添加额外的功能
    }       
}

// 桥接模式（Bridge Pattern）
class Abstraction{
    constructor(implementation) {
        this.implementation = implementation;
    }
}   

// 组合模式（Composite Pattern）
class Composite {
    constructor() { 
        this.children = [];
            
    }
    add(child) {
        this.children.push(child);
    }
    
    operation() {
        this.children.forEach(child => child.operation());
    }
}

// 外观模式（Facade Pattern）
// 外观模式提供了一个统一的接口，用来访问子系统中的一群接口。外观模式定义了一个高层接口，这个接口使得这一子系统更加容易使用。
class Facade {
    constructor(subsystem1, subsystem2) {
        this.subsystem1 = subsystem1;
        this.subsystem2 = subsystem2;
    }
    operation() {
        this.subsystem1.operation();
        this.subsystem2.operation();
    }   
}

// 享元模式（Flyweight Pattern）
// 享元模式是一种结构型设计模式，它通过共享对象来减少内存使用和提高性能。
// 享元模式将对象分为内在状态和外在状态，内在状态是对象的共享部分，而外在状态是对象的独立部分。
class Flyweight {
    constructor(intrinsicState) {
        this.intrinsicState = intrinsicState;
    }   
    operation(extrinsicState) {
        // 使用内在状态和外在状态进行操作
    }
        
    
}

// 代理模式（Proxy Pattern）
// 代理模式是一种结构型设计模式，它为其他对象提供一种代理以控制对这个对象的访问。
class Proxy {
    constructor(realSubject) {
        this.realSubject = realSubject;
    }   
    request() {
        // 在访问realSubject之前，可以添加一些额外的操作
        this.realSubject.request();
    }   
}

// 中介者模式（Mediator Pattern）
// 中介者模式是一种行为型设计模式，它定义了一个对象来封装一系列对象之间的交互。
// 中介者使各对象不需要显示地相互引用，从而使其耦合松散，并且可以独立地改变它们之间的交互。
class Mediator {
    constructor() {
        this.colleagues = [];
    }
    
    addColleague(colleague) {
        this.colleagues.push(colleague);
    }
    
    send(message, colleague) {
        this.colleagues.forEach(c => {
            if (c !== colleague) {
                c.receive(message);
            }
        });
    }
    
}


// 观察者模式（Observer Pattern）
// 观察者模式是一种行为型设计模式，它定义了一种一对多的依赖关系，让多个观察者对象同时监听某一个主题对象。当主题对象发生变化时，所有依赖于它的观察者对象都会得到通知并被自动更新。
class Subject {
    constructor() {
        this.observers = [];
    }
    addObserver(observer) {
        this.observers.push(observer);
    }
    removeObserver(observer) {
        this.observers = this.observers.filter(o => o !== observer);
    }
    notifyObservers() {
        this.observers.forEach(observer => observer.update());
    }
    
}

class Observer {
    update() {
        // 观察者的更新逻辑
    }       
    
}

// 访问者模式（Visitor Pattern）
// 访问者模式是一种行为型设计模式，它表示一个作用于某对象结构中的各元素的操作。它使你可以在不改变各元素的类的前提下定义作用于这些元素的新操作。
class Visitor {
    visit(element) {
        // 访问元素的逻辑
    }   
}

// 迭代器模式（Iterator Pattern）
// 迭代器模式是一种行为型设计模式，它提供一种方法顺序访问一个聚合对象中的各个元素，而又不暴露该对象的内部表示。
class Iterator {
    constructor(collection) {   
        this.collection = collection;
        this.index = 0;
    }
    hasNext() {
        return this.index < this.collection.length;
    }
    next() {
        return this.collection[this.index++];
    }
}

// 解释器模式（Interpreter Pattern）
// 解释器模式是一种行为型设计模式，它给定一个语言，定义它的文法表示，并定义一个解释器，该解释器使用该表示来解释语言中的句子。
class Interpreter {
    interpret(context) {
        // 解释逻辑
    }
    
    
    
}

// 状态模式（State Pattern）
// 状态模式是一种行为型设计模式，它允许一个对象在其内部状态改变时改变它的行为，对象看起来好像修改了它的类。
class State {   
    handle(context) {
        // 处理逻辑
    }
}

class Context { 
        
    constructor(state) {
        this.state = state;
    }
    request() {
        this.state.handle(this);
    }   
    setState(state) {
        this.state = state; 
    }
}

// 命令模式（Command Pattern）
// 命令模式是一种行为型设计模式，它将一个请求封装为一个对象，从而使你可以用不同的请求对客户进行参数化；对请求排队或者记录请求日志，以及支持可撤销的操作。
class Command {
    execute() {
        // 执行命令的逻辑
    }   
}

// 策略模式（Strategy Pattern）
// 策略模式是一种行为型设计模式，它定义了一系列算法，并将每个算法封装起来，使它们可以互换。策略模式让算法独立于使用它的客户而变化。
class Strategy {    
    execute() {
        // 执行策略的逻辑
    }
}

// 责任链模式（Chain of Responsibility Pattern）

class Handler {
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }
    handle(request) {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        return null;
    }
}

// 备忘录模式（Memento Pattern）
// 备忘录模式是一种行为型设计模式，它在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，以便以后恢复对象到这个状态。
class Memento {
    constructor(state) {
        this.state = state;
    }
}

// 模板方法模式（Template Method Pattern）
// 模板方法模式是一种行为型设计模式，它定义了一个操作中的算法骨架，而将一些步骤延迟到子类中。模板方法使得子类可以在不改变算法结构的情况下重新定义算法的某些特定步骤。
class Template {
    templateMethod() {  
            
        this.step1();
        this.step2();
        this.step3();
    }
}