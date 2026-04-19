const questions = [
  { id: 1, title: '实现 LRUCache', prompt: 'get/put 都要 O(1)。', starter: 'class LRUCache {\n  // TODO\n}', answer: '标准解法：Map + 双向链表；Map 负责 O(1) 查找，链表维护最近使用顺序；get 命中后移动到头部，put 超容量时淘汰尾节点。', focus: ['数据结构'] },
  { id: 2, title: '实现 TopK 热门搜索', prompt: '实时维护前 K。', starter: 'function topK(words, k) {\n  // TODO\n}', answer: '标准解法：Map 统计频次，最小堆维护前 K 个高频词；遍历词频表时根据频次更新堆顶。', focus: ['堆', 'Map'] },
  { id: 3, title: '二叉树层序遍历', prompt: '返回二维数组。', starter: 'function levelOrder(root) {\n  // TODO\n}', answer: '标准解法：BFS 队列；每轮记录当前层节点数，循环弹出并收集值，把左右子节点入队。', focus: ['BFS'] },
  { id: 4, title: '最近公共祖先', prompt: '普通二叉树。', starter: 'function lowestCommonAncestor(root, p, q) {\n  // TODO\n}', answer: '标准解法：递归；当前节点为空返回 null；命中 p 或 q 直接返回；左右子树都命中则当前节点是答案，否则返回非空一侧。', focus: ['递归'] },
  { id: 5, title: '路径和', prompt: '返回所有满足条件路径。', starter: 'function pathSum(root, target) {\n  // TODO\n}', answer: '标准解法：DFS + 回溯；递归时减去当前值并记录路径，到叶子且剩余值为 0 时收集当前路径拷贝。', focus: ['回溯'] },
  { id: 6, title: '链表反转', prompt: '写迭代版。', starter: 'function reverseList(head) {\n  // TODO\n}', answer: '标准解法：prev、cur 双指针循环推进；保存 next，令 cur.next = prev，然后整体后移。', focus: ['链表'] },
  { id: 7, title: '链表成环检测', prompt: '返回布尔值。', starter: 'function hasCycle(head) {\n  // TODO\n}', answer: '标准解法：快慢指针；slow 每次一步，fast 每次两步，相遇则有环，fast 走到 null 则无环。', focus: ['快慢指针'] },
  { id: 8, title: '合并 K 个有序链表', prompt: '优先考虑复杂度。', starter: 'function mergeKLists(lists) {\n  // TODO\n}', answer: '标准解法：最小堆维护每条链表当前头节点；每次弹出最小值接到结果链表，再把该节点下一位入堆。', focus: ['最小堆'] },
  { id: 9, title: '最长无重复子串', prompt: '返回长度。', starter: 'function lengthOfLongestSubstring(s) {\n  // TODO\n}', answer: '标准解法：滑动窗口 + Map 记录字符最后出现位置；右指针扩张，左指针跳到重复字符上次位置之后。', focus: ['滑动窗口'] },
  { id: 10, title: '最长递增子序列', prompt: '写 O(n log n)。', starter: 'function lengthOfLIS(nums) {\n  // TODO\n}', answer: '标准解法：维护 tails 数组，tails[i] 表示长度为 i+1 的递增子序列最小结尾；对每个数二分替换 tails 中第一个 >= 它的位置。', focus: ['二分', 'DP'] },
  { id: 11, title: '接雨水', prompt: '给双指针解法。', starter: 'function trap(height) {\n  // TODO\n}', answer: '标准解法：左右双指针和 leftMax/rightMax；哪边当前高度小就结算哪边可接雨水，因为短板决定水位。', focus: ['双指针'] },
  { id: 12, title: '岛屿数量', prompt: '统计二维矩阵连通块。', starter: 'function numIslands(grid) {\n  // TODO\n}', answer: '标准解法：遍历矩阵，遇到 1 时计数 +1，并通过 DFS/BFS 把相邻陆地全部沉没为 0。', focus: ['DFS'] },
  { id: 13, title: '课程表拓扑排序', prompt: '判断是否能修完。', starter: 'function canFinish(numCourses, prerequisites) {\n  // TODO\n}', answer: '标准解法：构建邻接表和入度数组；入度为 0 的课程入队，BFS 逐个出队并减少后继入度；最终访问数等于课程总数则可完成。', focus: ['图', '拓扑排序'] },
  { id: 14, title: '全排列', prompt: '输出全部排列。', starter: 'function permute(nums) {\n  // TODO\n}', answer: '标准解法：回溯；维护 used 数组和 path，递归枚举每个未使用元素，路径长度等于 nums.length 时收集结果。', focus: ['回溯'] },
  { id: 15, title: '子集枚举', prompt: '返回所有子集。', starter: 'function subsets(nums) {\n  // TODO\n}', answer: '标准解法：DFS 每个位置做选/不选；或从空集开始遍历每个数，把现有所有子集各复制一份并追加当前数。', focus: ['回溯'] },
  { id: 16, title: '区间合并', prompt: '合并重叠区间。', starter: 'function merge(intervals) {\n  // TODO\n}', answer: '标准解法：先按起点排序；遍历时若当前区间起点 <= 结果尾区间终点，则更新终点为两者最大值，否则新开一个区间。', focus: ['排序'] },
  { id: 17, title: '螺旋矩阵遍历', prompt: '顺时针输出元素。', starter: 'function spiralOrder(matrix) {\n  // TODO\n}', answer: '标准解法：维护 top、bottom、left、right 四个边界，按上右下左依次遍历，每完成一条边就收缩对应边界。', focus: ['边界控制'] },
  { id: 18, title: '最小覆盖子串', prompt: '找出最短区间。', starter: 'function minWindow(s, t) {\n  // TODO\n}', answer: '标准解法：滑动窗口 + 计数表；右指针扩张直到满足全部需求，再尽量收缩左边界更新最优答案。', focus: ['滑动窗口'] },
  { id: 19, title: '股票买卖 II', prompt: '允许多次交易。', starter: 'function maxProfit(prices) {\n  // TODO\n}', answer: '标准解法：贪心，把所有相邻上升段的差值累加起来，等价于每次逢低买入逢高卖出。', focus: ['贪心'] },
  { id: 20, title: '最少会议室数量', prompt: '检测排期冲突。', starter: 'function minMeetingRooms(intervals) {\n  // TODO\n}', answer: '标准解法：按开始时间排序；最小堆维护当前会议结束时间，若堆顶结束 <= 当前开始则复用房间，否则新开房间。', focus: ['堆', '业务建模'] },
];

module.exports = questions;
