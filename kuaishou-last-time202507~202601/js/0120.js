console.log('start'); // 1
setTimeout(() => {
    console.log('setTimeout1'); // 6
});
Promise.resolve().then(() => {
    console.log('promise1'); // 3
    setTimeout(() => {
        console.log('setTimeout2'); // 7
    });
}).then(() => { console.log('promise2'); }); //5
requestAnimationFrame(() => {
    console.log('raf'); // 4
});
console.log('end'); //2
