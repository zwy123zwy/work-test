// console.log('start'); // 1
// setTimeout(() => {
//     console.log('setTimeout1'); // 6
// });
// Promise.resolve().then(() => {
//     console.log('promise1'); // 3
//     setTimeout(() => {
//         console.log('setTimeout2'); // 7
//     });
// }).then(() => { console.log('promise2'); }); //5
// requestAnimationFrame(() => {
//     console.log('raf'); // 4
// });
// console.log('end'); //2
class Parent {
    constructor() {
        this.name = (function () {
            console.log('parent init');
            return 'parent';
        })();
        // this.name = (function () {
        //     console.log('parent init');
        //     return 'parent';
        // })();
        console.log('parent constructor');
        this.run();
        this.runA();
    }
    run() {
        console.log('parent run');
    }
    runA() {
        console.log('parent runA');
    }
}
class Child extends Parent {
    constructor() {
        super();
        this.name = (function () {
            console.log('child init');
            return 'child';
        })();
        console.log('child constructor');
        console.log(this.innerName);
    }
    run() {
        this.innerName = 1;
        console.log('child run');
    }
    runA() {
        console.log('child runA');
    }
}
new Child();
