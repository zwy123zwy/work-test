// 7.解释一下Promise.all和Promise.allSettled的区别，在并行调用多个AI模型时你会选哪个

// 8.简单实现一个防抖函数(Debounce)，并说明它在AI搜索建议(Query Suggestion)场景下的作用。
// 9.CSS 中如何实现一个无限旋转的Loading动画，用于表示AI 正在思考?
// 10.数组转树结构:AIAgent 的任务拆解通常是树状的，请写一个函数将扁平的任务列表转为嵌套树

console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});

async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2');
}
async1();

console.log('script end');