// 1
// const p1 = new Promise((resolve) => {
//     setTimeout(() => {
//         resolve('resolve3');
//         console.log('timer1') // 3 timer1
//     }, 0)
//     resolve('resovle1');
//     resolve('resolve2');
// }).then(res => {
//     console.log(res) // 1 resolve1
//     setTimeout(() => {
//         console.log(p1) // 2
//     }, 1000)
// }).finally(res => {
//     console.log('finally', res) // 2 finally undefined
// })

// 2

// const async1 = async () => {
//     console.log('async1'); // 2
//     setTimeout(() => {
//         console.log('timer1') // 8
//     }, 2000)
//     await new Promise(resolve => {
//         console.log('promise1') // 3
//     })
//     console.log('async1 end') // 5
//     return 'async1 success'
// }
// console.log('script start'); // 1
// async1().then(res => console.log(res));
// console.log('script end'); // 4
// Promise.resolve(1)
//     .then(2)
//     .then(Promise.resolve(3))
//     .catch(4)
//     .then(res => console.log(res)) // 6
// setTimeout(() => {
//     console.log('timer2') // 7
// }, 1000)


// 3

// const first = () => (new Promise((resolve, reject) => {
//     console.log(3); // 1
//     let p = new Promise((resolve, reject) => {
//         console.log(7); //2
//         setTimeout(() => {
//             console.log(5); // 6
//             resolve(6);
//             console.log(p) //7
//         }, 0)
//         resolve(1);
//     });
//     resolve(2);
//     p.then((arg) => {
//         console.log(arg); // 4 1
//     });
// }));
// first().then((arg) => {
//     console.log(arg); // 5 2
// });
// console.log(4); // 3



// 4
// async function async1() {
//     try {
//         await Promise.reject('error!!!')
//     } catch (e) {
//         console.log(e) // 2 error!!!
//     }
//     console.log('async1'); // 3
//     return Promise.resolve('async1 success')
// }
// async1().then(res => console.log(res)) // 4
// console.log('script start') // 1

// 5
// async function async1() {
//     await async2();
//     console.log('async1'); // 2
//     return 'async1 success'
// }
// async function async2() {
//     return new Promise((resolve, reject) => {
//         console.log('async2') // 1
//         reject('error')
//     })
// }
// async1().then(res => console.log(res)) // 3



// 6

// async function testSometing() {
//     console.log("执行testSometing"); // 2
//     return "testSometing";
// }

// async function testAsync() {
//     console.log("执行testAsync");  // 6
//     return Promise.resolve("hello async");
// }

// async function test() {
//     console.log("test start..."); // 1
//     const v1 = await testSometing();
//     console.log(v1);              // 5
//     const v2 = await testAsync();
//     console.log(v2); // 8
//     console.log(v1, v2); // 9
// }

// test();

// var promise = new Promise(resolve => {
//     console.log("promise start..."); // 3
//     resolve("promise");
// });
// promise.then(val => console.log(val)); // 7

// console.log("test end..."); // 4


// 7

// async function async1() {
//     console.log("async1 start"); // 2
//     await async2();
//     console.log("async1 end"); // 6
// }

// async function async2() {
//     console.log("async2"); // 3
// }

// console.log("script start"); //1

// setTimeout(function () {
//     console.log("setTimeout"); // 8
// }, 0);

// async1();

// new Promise(function (resolve) {
//     console.log("promise1"); // 4
//     resolve();
// }).then(function () {
//     console.log("promise2"); // 7
// });
// console.log('script end') // 5


// 8
// async function async1() {
//     console.log('async1 start'); // 2
//     await new Promise(resolve => {
//         console.log('promise1') // 3
//         resolve('promise resolve')
//     })
//     console.log('async1 success'); // 5
//     return 'async1 end'
// }
// console.log('srcipt start') // 1
// async1().then(res => {
//     console.log(res) // 6
// })
// new Promise(resolve => {
//     console.log('promise2') // 4
//     setTimeout(() => {
//         console.log('timer') // 7
//     })
// })


// 9
// async function async1() {
//     console.log('async1 start'); // 2
//     await new Promise(resolve => {
//         console.log('promise1') // 3
//     })
//     console.log('async1 success');
//     return 'async1 end'
// }
// console.log('srcipt start') // 1
// async1().then(res => console.log(res))
// console.log('srcipt end')   // 4

// 10
// async function async1() {
//     console.log("async1 start"); //1
//     await async2();
//     console.log("async1 end"); // 4
//     setTimeout(() => {
//         console.log('timer1') // 7
//     }, 0)
// }
// async function async2() {
//     setTimeout(() => {
//         console.log('timer2') // 5
//     }, 0)
//     console.log("async2"); // 2
// }
// async1();
// setTimeout(() => {
//     console.log('timer3') // 6
// }, 0)
// console.log("start") // 3


// 11
// async function async1() {
//     console.log("async1 start"); // 1
//     await async2();
//     console.log("async1 end"); // 4
// }
// async function async2() {
//     setTimeout(() => {
//         console.log('timer') // 5
//     }, 0)
//     console.log("async2"); // 2
// }
// async1();
// console.log("start") // 3


// 12
// async function async1() {
//     console.log("async1 start"); // 1
//     await async2();
//     console.log("async1 end");  // 4
// }
// async function async2() {
//     console.log("async2"); // 2
// }
// async1();
// console.log('start')    // 3

// 13
// function promise1() {
//     let p = new Promise((resolve) => {
//         console.log('promise1'); //1
//         resolve('1')
//     })
//     return p;
// }
// function promise2() {
//     return new Promise((resolve, reject) => {
//         reject('error')
//     })
// }
// promise1()
//     .then(res => console.log(res)) // 2
//     .catch(err => console.log(err))
//     .finally(() => console.log('finally1')) // 4

// promise2()
//     .then(res => console.log(res))
//     .catch(err => console.log(err)) // 3
//     .finally(() => console.log('finally2'))     //5

// // 14
// Promise.reject('err!!!')
//     .then((res) => {
//         console.log('success', res)
//     }, (err) => {
//         console.log('error', err)
//     }).catch(err => {
//         console.log('catch', err)
//     })


// 15
// Promise.resolve(1)
//     .then(2)
//     .then(Promise.resolve(3))
//     .then(console.log)

// 16
// const promise = Promise.resolve().then(() => {
//     return promise;
// })
// promise.catch(console.err)

// 17
// Promise.resolve().then(() => {
//     return new Error('error!!!')
// }).then(res => {
//     console.log("then: ", res)
// }).catch(err => {
//     console.log("catch: ", err)
// })

// 18
// const promise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         console.log('timer')
//         resolve('success')
//     }, 1000)
// })
// const start = Date.now();
// promise.then(res => {
//     console.log(res, Date.now() - start)
// })
// promise.then(res => {
//     console.log(res, Date.now() - start)
// })


// 19
// Promise.reject(1)
//     .then(res => {
//         console.log(res);
//         return 2;
//     })
//     .catch(err => {
//         console.log(err);
//         return 3
//     })
//     .then(res => {
//         console.log(res);
//     });

// 20
// const promise = new Promise((resolve, reject) => {
//     resolve("success1");
//     reject("error");
//     resolve("success2");
// });
// promise
//     .then(res => {
//         console.log("then: ", res);
//     }).catch(err => {
//         console.log("catch: ", err);
//     })


// 21
// const promise1 = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve("success");
//         console.log("timer1");//4
//     }, 1000);
//     console.log("promise1里的内容"); // 1
// });
// const promise2 = promise1.then(() => {
//     throw new Error("error!!!"); //5
// });
// console.log("promise1", promise1); // 2
// console.log("promise2", promise2); // 3
// setTimeout(() => {
//     console.log("timer2");// 5
//     console.log("promise1", promise1);
//     console.log("promise2", promise2);
// }, 2000);

// 22
const promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('success')
    }, 1000)
})
const promise2 = promise1.then(() => {
    throw new Error('error!!!')
})
console.log('promise1', promise1)// 1
console.log('promise2', promise2)// 2
setTimeout(() => {
    console.log('promise1', promise1)
    console.log('promise2', promise2)
}, 2000)
