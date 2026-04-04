/**
 * daily0410.js — JS 面试代码题 20 道（手写综合 / 小算法）
 * 题后 // 答：… 为参考答案。
 */

// 1. 手写 twoSum(nums, target)，返回两索引。
// 答：Map 存值→下标，遍历找 complement = target - nums[i]。

// 2. 手写 reverseLinkedList(head) 迭代版。
// 答：prev=null, cur=head; while(cur){ next=cur.next; cur.next=prev; prev=cur; cur=next; } return prev;

// 3. 手写 validParentheses(s)。
// 答：栈遇左括号入栈，右括号弹栈匹配 map。

// 4. 手写 maxDepth(root) 二叉树最大深度。
// 答：root 空返回 0；否则 1 + max(maxDepth(left),maxDepth(right))。

// 5. 手写 climbStairs(n) 爬楼梯（1 或 2 步）。
// 答：dp[i]=dp[i-1]+dp[i-2]，dp[1]=1,dp[2]=2。

// 6. 手写 mergeSortedArrays(a, b)，原地合并假设 a 尾部有足够 0 占位（经典题变体）。
// 答：三指针从后往前填，避免覆盖未处理元素。

// 7. 手写 quickSort(arr) 或说明原地快排 partition 思路。
// 答：选基准 partition 双指针交换，递归左右；平均 O(n log n)。

// 8. 手写 topKFrequent(nums, k)。
// 答：频次 Map + 桶排序（频率为桶下标）或小顶堆维护 k 个。

// 9. 手写 LRUCache(capacity) class，get/put O(1)。
// 答：Map 顺序 + get 时 delete 再 set；超容量删首部。

// 10. 手写 minStack：push/pop/top/getMin 均 O(1)。
// 答：辅助栈同步当前最小值。

// 11. 手写 EventEmitter：on、off、once、emit。
// 答：Map<event,Set>；once 包装自删；emit 复制 Set 再调。

// 12. 手写 parseQuery(url) -> Record<string, string | string[]>。
// 答：URLSearchParams；同 key 多次出现合并为数组。

// 13. 手写 limitConcurrency(tasks, limit) 并发上限执行 Promise。
// 答：池子 running 计数，队列 next 补位直到任务耗尽。

// 14. 手写 deepMerge(a, b)，数组策略说明（替换还是 concat）。
// 答：对象递归；数组常替换或按产品 concat，需写清策略。

// 15. 手写 formatBytes(n) 如 1024 -> '1 KB'。
// 答：while n>=1024 除 1024 升单位，保留小数。

// 16. 手写 radixSort（整数）或说明适用场景。
// 答：按位桶分配，O(d*n)，适合非负整数且 d 不大。

// 17. 手写 longestIncreasingSubsequence(nums) 长度（O(n log n) 思路）。
// 答：tails 数组 + 二分找替换位置，tails.length 即答案。

// 18. 手写 schedule(task, delayOrder[])：按延迟序列多次调用 task。
// 答：delayOrder.reduce((p,d)=>p.then(()=>new Promise(r=>setTimeout(r,d))).then(task), Promise.resolve())

// 19. 手写 simpleDiff(a, b) 返回 { added, removed }（浅层 key 集合差）。
// 答：keys(b)-keys(a) 为 added；keys(a)-keys(b) 为 removed。

// 20. 实现 tinyTemplate(str, data)，支持 {{key}} 与简单路径 a.b。
// 答：正则替换 {{ path }}，path split('.') reduce 取 data。
