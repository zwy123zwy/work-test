// const myPromise = new Promise((resolve, reject) => {
//     console.log('A');
//     console.log('B');
// });

// myPromise.then(() => {
//     console.log('C');
// });

// console.log('D');


// const newPromise1 = new Promise((resolve, reject) => {
//     console.log('A');
//     resolve('B');
// });
// const newPromise2 = newPromise1.then(res => {
//     console.log(res);
// });
// console.log('C', newPromise1);
// console.log('D', newPromise2);


// const newPromise = new Promise((resolve, reject) => {
//     console.log('A');
//     setTimeout(() => {
//         console.log("timer start");
//         resolve("succeed");
//         console.log("timer end");
//     }, 0);
//     console.log('B');
// });
// newPromise.then((result) => {
//     console.log(result);
// });
// console.log('C');


// Promise.resolve().then(() => {
//     console.log('outerPromise');
//     const innerTimer = setTimeout(() => {
//         console.log('innerTimer')
//     }, 0)
// });

// const timer1 = setTimeout(() => {
//     console.log('outerTimer')
//     Promise.resolve().then(() => {
//         console.log('innerPromise')
//     })
// }, 0)
// console.log('run');


// const promise = new Promise((resolve, reject) => {
//     resolve('succeed1');
//     reject('error');
//     resolve('succeed2');
// });
// promise.then((res) => {
//     console.log('then: ', res);
// }).catch((err) => {
//     console.log('catch: ', err);
// })


// Promise.resolve('A')
//     .then('B')
//     .then(Promise.resolve('C'))
//     .then(console.log)

// const promise1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('success')
//     }, 1000)
// })
// const promise2 = promise1.then(() => {
//     throw new Error('error')
// })
// console.log('promise1', promise1)
// console.log('promise2', promise2)
// setTimeout(() => {
//     console.log('innerPromise1', promise1)
//     console.log('innerPromise2', promise2)
// }, 2000)


// Promise.resolve('A')
//     .then(res => {
//         console.log(res);
//         return 'B';
//     })
//     .catch(err => {
//         return 'C';
//     })
//     .then(res => {
//         console.log(res);
//     });

// Promise.resolve().then(() => {
//     return new Error('error')
// }).then(res => {
//     console.log("then: ", res)
// }).catch(err => {
//     console.log("catch: ", err)
// })


// const promise = Promise.resolve().then(() => {
//   return promise;
// })
// promise.catch(console.err)


// Promise.resolve('A')
//     .then(res => {
//         console.log('promise1', res)
//     })
//     .finally(() => {
//         console.log('finally1')
//     })



// Promise.resolve('B')
//     .finally(() => {
//         console.log('finally2')
//         return 'result'
//     })
//     .then(res => {
//         console.log('promise2', res)
//     })




// function runAsync(num) {
//     return new Promise(
//         r => setTimeout(
//             () => r(num, console.log(num)
//             ), 1000)
//     )
// }

// Promise.all([runAsync(1), runAsync(2), runAsync(3)])
//     .then(res => console.log(res));



// function runAsync(num) {
//     return new Promise((resolve) => setTimeout(
//         () => resolve(num, console.log(num)), 1000)
//     );
// }

// function runReject(num) {
//     return new Promise((resolve, reject) => setTimeout(
//         () => reject(`Error: ${num}`, console.log(num)), 1000 * num)
//     );
// }

// Promise.all([runAsync(1), runReject(4), runAsync(3), runReject(2)])
//     .then((res) => console.log(res))
//     .catch((err) => console.log(err));


// async function runAsync() {
//     console.log("runAsync start");
//     await asyncFunc();
//     console.log("runAsync end");
// }

// async function asyncFunc() {
//     console.log("do something");
// }

// runAsync();
// console.log('start')


// async function async1() {
//     console.log("async1 start");
//     await async2();
//     console.log("async1 end");
//     setTimeout(() => {
//         console.log('async1 timer')
//     }, 0)
// }

// async function async2() {
//     console.log("async2 start");
//     setTimeout(() => {
//         console.log('async2 timer')
//     }, 0)
//     console.log("async2 end");
// }

// async1();
// setTimeout(() => {
//     console.log('outer timer')
// }, 0)
// console.log("run")

// async function runAsync() {
//     console.log("async start");
//     await asyncFunc();
//     console.log("async end");
// }

// async function asyncFunc() {
//     console.log("do something");
// }

// console.log("main start");
// setTimeout(function () {
//     console.log("timer");
// }, 0);
// runAsync();
// new Promise(resolve => {
//     console.log("promise");
//     resolve();
// }).then(function () {
//     console.log("promise then");
// });
// console.log('main end')


// const promiseWrapper = () =>
//     new Promise((resolve, reject) => {
//         console.log('A');
//         let p = new Promise((resolve, reject) => {
//             console.log('B');
//             setTimeout(() => {
//                 console.log('timer start');
//                 resolve('timer succeed');
//                 console.log('timer end');
//             }, 0);
//             resolve('inner succeed');
//         });
//         resolve('outer succeed');
//         p.then((res) => {
//             console.log(res);
//         });
//     });

// promiseWrapper().then((res) => {
//     console.log(res);
// });
// console.log(4);


// console.log('main start');

// setTimeout(function () {
//     console.log('timer1');
//     process.nextTick(function () {
//         console.log('inner nextTick1');
//     })
//     new Promise(function (resolve) {
//         console.log('inner promise1');
//         resolve();
//     }).then(function () {
//         console.log('inner then1')
//     })
// })

// process.nextTick(function () {
//     console.log('nextTick');
// })
// new Promise(function (resolve) {
//     console.log('promise');
//     resolve();
// }).then(function () {
//     console.log('then')
// })

// setTimeout(function () {
//     console.log('timer2');
//     process.nextTick(function () {
//         console.log('inner nextTick2');
//     })
//     new Promise(function (resolve) {
//         console.log('inner promise2');
//         resolve();
//     }).then(function () {
//         console.log('inner then2')
//     })
// })


function test() {
  console.log(this.num);
}

function doTest() {
  test();
}

var obj = {
  num: 1,
  doTest: doTest,
};

var num = 2;
obj.doTest();


