// const promise = new Promise((resolve, reject) => {
//     console.log(1);
//     console.log(2);
// });
// promise.then(() => {
//     console.log(3);
// });
// console.log(4);

// const promise1 = new Promise((resolve, reject) => {
//     console.log('promise1')
//     resolve('resolve1')
// })
// const promise2 = promise1.then(res => {
//     console.log(res)
// })
// console.log('1', promise1);
// console.log('2', promise2);


// const promise = new Promise((resolve, reject) => {
//     console.log(1);
//     setTimeout(() => {
//         console.log("timerStart");
//         resolve("success");
//         console.log("timerEnd");
//     }, 0);
//     console.log(2);
// });
// promise.then((res) => {
//     console.log(res);
// });
// console.log(4);


// Promise.resolve().then(() => {
//     console.log('promise1');
//     const timer2 = setTimeout(() => {
//         console.log('timer2')
//     }, 0)
// });
// const timer1 = setTimeout(() => {
//     console.log('timer1')
//     Promise.resolve().then(() => {
//         console.log('promise2')
//     })
// }, 0)
// console.log('start');

// const promise = new Promise((resolve, reject) => {
//     resolve('success1');
//     reject('error');
//     resolve('success2');
// });
// promise.then((res) => {
//     console.log('then:', res);
// }).catch((err) => {
//     console.log('catch:', err);
// })



// setTimeout(function () {
//     console.log(1);
// }, 100);

// new Promise(function (resolve) {
//     console.log(2);
//     resolve();
//     console.log(3);
// }).then(function () {
//     console.log(4);
//     new Promise((resove, reject) => {
//         console.log(5);
//         setTimeout(() => {
//             console.log(6);
//         }, 10);
//     })
// });
// console.log(7);
// console.log(8);


// Promise.resolve().then(() => {
//     console.log('1');
//     throw 'Error';
// }).then(() => {
//     console.log('2');
// }).catch(() => {
//     console.log('3');
//     throw 'Error';
// }).then(() => {
//     console.log('4');
// }).catch(() => {
//     console.log('5');
// }).then(() => {
//     console.log('6');
// });


// console.log(1);

// setTimeout(() => {
//     console.log(2);
//     Promise.resolve().then(() => {
//         console.log(3)
//     });
// });

// new Promise((resolve, reject) => {
//     console.log(4)
//     resolve(5)
// }).then((data) => {
//     console.log(data);
// })

// setTimeout(() => {
//     console.log(6);
// })

// console.log(7);



// console.log(1)

// setTimeout(() => {
//     console.log(2)
// })

// new Promise(resolve => {
//     console.log(3)
//     resolve(4)
// }).then(d => console.log(d))

// setTimeout(() => {
//     console.log(5)
//     new Promise(resolve => {
//         resolve(6)
//     }).then(d => console.log(d))
// })

// setTimeout(() => {
//     console.log(7)
// })

// console.log(8)


// console.log('1');

// setTimeout(function() {
//     console.log('2');
//     process.nextTick(function() {
//         console.log('3');
//     })
//     new Promise(function(resolve) {
//         console.log('4');
//         resolve();
//     }).then(function() {
//         console.log('5')
//     })
// })
// process.nextTick(function() {
//     console.log('6');
// })
// new Promise(function(resolve) {
//     console.log('7');
//     resolve();
// }).then(function() {
//     console.log('8')
// })

// setTimeout(function() {
//     console.log('9');
//     process.nextTick(function() {
//         console.log('10');
//     })
//     new Promise(function(resolve) {
//         console.log('11');
//         resolve();
//     }).then(function() {
//         console.log('12')
//     })
// })


// const p1 = new Promise((resolve) => {
//     setTimeout(() => {
//         resolve('resolve3');
//         console.log('timer1')
//     }, 0)
//     resolve('resovle1');
//     resolve('resolve2');
// }).then(res => {
//     console.log(res)  // resolve1
//     setTimeout(() => {
//         console.log(p1)
//     }, 1000)
// }).finally(res => {
//     console.log('finally', res)
// })

// const async1 = async () => {
//     console.log('async1');
//     setTimeout(() => {
//         console.log('timer1')
//     }, 2000)
//     await new Promise(resolve => {
//         console.log('promise1')
//     })
//     console.log('async1 end')
//     return 'async1 success'
// }
// console.log('script start');
// async1().then(res => console.log(res));
// console.log('script end');
// Promise.resolve(1)
//     .then(2)
//     .then(Promise.resolve(3))
//     .catch(4)
//     .then(res => console.log(res))
// setTimeout(() => {
//     console.log('timer2')
// }, 1000)

// async function async1 () {
//   await async2();
//   console.log('async1');
//   return 'async1 success'
// }
// async function async2 () {
//   return new Promise((resolve, reject) => {
//     console.log('async2')
//     reject('error')
//   })
// }
// async1().then(res => console.log(res))


// async function async1() {
//     console.log("async1 start");
//     await async2();
//     console.log("async1 end");
// }

// async function async2() {
//     console.log("async2");
// }

// console.log("script start");

// setTimeout(function () {
//     console.log("setTimeout");
// }, 0);

// async1();

// new Promise(resolve => {
//     console.log("promise1");
//     resolve();
// }).then(function () {
//     console.log("promise2");
// });
// console.log('script end')


// async function async1() {
//     console.log('async1 start');
//     await new Promise(resolve => {
//         console.log('promise1')
//         resolve('promise1 resolve')
//     }).then(res => console.log(res))
//     console.log('async1 success');
//     return 'async1 end'
// }
// console.log('srcipt start')
// async1().then(res => console.log(res))
// console.log('srcipt end')


// async function async1() {
//     console.log('async1 start');
//     await new Promise(resolve => {
//         console.log('promise1')
//     })
//     console.log('async1 success');
//     return 'async1 end'
// }
// console.log('srcipt start')
// async1().then(res => console.log(res))
// console.log('srcipt end')



