# 0208 批改报告（阿里 P6 级）

## 已作答题目批改

### 题 18. Scheduler（每隔固定时间执行） ❌

**你的实现**：`run()` 用 `forEach` 一次性执行所有任务，未体现「每隔 delay 毫秒执行一个」。

**正确思路**：add 时只入队；需有 `start()` 或自动调度逻辑，用 `setInterval` 或递归 `setTimeout`，每次从队列取一个执行，间隔 delay。

**参考实现要点**：
```js
run() {
  const runNext = () => {
    if (this.queue.length === 0) return;
    const fn = this.queue.shift();
    fn();
    setTimeout(runNext, this.delay);
  };
  runNext();
}
```
且 `add(fn)` 若在未 start 时添加，需在首次 add 或显式 start 时启动调度。

---

### 题 19. flattenObject ⚠️

**你的实现**：基本正确，可处理嵌套对象。数组会按索引展开为 `a.0`、`a.1.b` 等，属于合理约定。

**建议改进**：
1. 使用 `Object.prototype.hasOwnProperty.call(obj, key)`，避免 `obj` 为 `Object.create(null)` 时无 `hasOwnProperty`。
2. 题目要求支持自定义分隔符，可增加参数 `sep = '.'`。
3. 数组展开规则需在注释中明确（当前为索引路径）。

---

## 未作答题目参考解答概要

| # | 题目 | 核心思路 |
|---|------|----------|
| 1 | 接雨水 | 双指针，维护左右最大高度，小的一侧向中间移动并累加雨水 |
| 2 | 最长递增子序列 | DP: dp[i]=max(dp[j]+1) 其中 j<i 且 nums[j]<nums[i]；或二分+贪心 |
| 3 | 字符串解码 | 栈存 [curStr, repeat]，遇数字累积，遇 [ 入栈，遇 ] 出栈并重复 |
| 4 | Promise.race | 空数组直接 return new Promise(()=>{})；否则 Promise 包装每个，谁先 settle 谁决定结果 |
| 5 | 带取消的 Promise | 内部 flag，resolve/reject 前检查；cancel 后置 flag 并 reject |
| 6 | compose 洋葱模型 | 递归构建 next：next = () => dispatch(i+1)，中间件内 await next() |
| 7 | retry | 循环执行 fn，catch 后判断 retryCondition，满足则 delay（可指数退避）后重试 |
| 8 | LRU+TTL | Map 存 key->{value, expireAt}，get 时检查过期并删除；put 时设 expireAt=now+ttl |
| 9 | 优先级调度器 | 优先队列（堆）按 priority 排序，并发控制同普通调度器 |
| 10 | 虚拟列表 | startIndex = floor(scrollTop/itemHeight)，endIndex = startIndex + ceil(viewHeight/itemHeight) |
| 11 | flatten(depth) | 递归，depth>0 时对数组项 flatten(arr[i], depth-1) 并 concat |
| 12 | 二叉树右视图 | BFS 层序遍历，每层取最后一个节点 |
| 13 | 最小栈 | 辅助栈同步存当前最小值，push/pop 时同步更新 |
| 14 | EventEmitter 通配符 | 存储时按 event 分桶；emit('*') 触发所有；emit('user:login') 时匹配 'user:*' 的监听 |
| 15 | Object.is | x===y 或 (x!==x && y!==y)，且 (1/x===1/y) 排除 +0/-0 |
| 16 | 路径总和 III | DFS+前缀和 Map，curSum-targetSum 在 Map 中的个数即为以当前节点结尾的路径数 |
| 17 | 最长重复子数组 | dp[i][j]=A[i-1]===B[j-1]?dp[i-1][j-1]+1:0，取最大值 |
| 20 | Vue 响应式 | Proxy get 收集依赖（Set），set 触发 effect；effect 中先清空再执行以避免重复；嵌套用 reactive 递归代理 |

---

## 评分汇总

| 题号 | 状态 | 得分 | 备注 |
|------|------|------|------|
| 1-17 | 未作答 | - | 见上方思路 |
| 18 | 实现不符合题意 | 2/10 | 未实现「每隔 delay 执行一个」 |
| 19 | 基本正确 | 8/10 | 建议补充 hasOwnProperty、分隔符 |
| 20 | 未作答 | - | 见上方思路 |
