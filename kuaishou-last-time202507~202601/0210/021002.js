/**
 * 021002 字节面试算法题（20 道）
 * 日期：2026-02-10
 * 规则：仅题干、输入输出与约束；个人完成后再补充解答与测试用例。
 */

class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// ==================== 1. 两数之和 ====================
// 题干：给定整数数组 nums 和目标值 target，在数组中找出和为目标值的两个整数下标。假设恰好有一组解。
// 输入：nums: number[], target: number
// 输出：[i, j] 满足 nums[i] + nums[j] === target
// 约束：同一元素不可重复使用；可 O(n) 时间 + 哈希

// 实现：



// ==================== 2. 无重复字符的最长子串 ====================
// 题干：给定字符串 s，求其中不含有重复字符的连续子串的最大长度。
// 输入：s: string
// 输出：number
// 约束：滑动窗口 / 双指针

// 实现：

function lengthOfLongestSubstring(s) {
    if(s.length === 0) return 0;
    let left = 0, right = 0;
    let maxLength = 0;
    let set = new Set();
    while(right < s.length) {
        if(!set.has(s[right])) {
            set.add(s[right]);
            right++;    
            maxLength = Math.max(maxLength, right - left);
        }else {
            set.delete(s[left]);
            left++;
        }
    }
    return maxLength;
}

// ==================== 3. 合并两个有序链表 ====================
// 题干：将两个升序链表合并为一个升序链表，返回新链表头。
// 输入：l1: ListNode | null, l2: ListNode | null
// 输出：ListNode | null
// 约束：可 O(m+n) 时间 O(1) 额外空间（虚拟头）

// 实现：

function mergeTwoLists(l1, l2) {
    if(!l1) return l2;
    if(!l2) return l1;
    let dummy = new ListNode(0);
    let current = dummy;
    while(l1 && l2) {
        if(l1.val < l2.val) {
            current.next = l1;
            l1 = l1.next;
        }else {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }
    current.next = l1 || l2;
    return dummy.next;
}
// ==================== 4. 二叉树的层序遍历 ====================
// 题干：给定二叉树根节点 root，返回层序遍历结果，即 [[层0], [层1], ...]。
// 输入：root: TreeNode | null
// 输出：number[][]
// 约束：BFS

// 实现：

function levelOrder(root) {
    if(!root) return [];
    let res = [];
    let queue = [root];
    while(queue.length) {
        let length = queue.length;
        let curLevel = [];
        while(length--) {
            let node = queue.shift();
            curLevel.push(node.val);
            if(node.left) queue.push(node.left);
            if(node.right) queue.push(node.right);
        }
        res.push(curLevel);
    }
    return res;
}

// ==================== 5. 买卖股票的最佳时机（一次） ====================
// 题干：给定数组 prices，prices[i] 为第 i 天股票价格。最多完成一笔交易（买一次卖一次），求最大利润。
// 输入：prices: number[]
// 输出：number
// 约束：若无法获利返回 0

// 实现：


// ==================== 6. 有效的括号 ====================
// 题干：给定只含 '()[]{}' 的字符串 s，判断括号是否有效（成对且顺序正确）。
// 输入：s: string
// 输出：boolean
// 约束：栈

// 实现：

function isValid(s) {
    if(s.length === 0) return true;
    let stack = [];
    for(let i = 0; i < s.length; i++) {
        if(s[i] === '(' || s[i] === '[' || s[i] === '{') {
            stack.push(s[i]);
        }else if(s[i] === ')' || s[i] === ']' || s[i] === '}') {
            if(stack.length === 0) return false;
            let top = stack.pop();
            if(s[i] === ')' && top !== '(') return false;
            if(s[i] === ']' && top !== '[') return false;
            if(s[i] === '}' && top !== '{') return false;
        }
    }
    return stack.length === 0;
}


// ==================== 7. 反转链表 ====================
// 题干：给定单链表头节点 head，反转链表并返回新的头节点。
// 输入：head: ListNode | null
// 输出：ListNode | null
// 约束：O(n) 时间 O(1) 额外空间

// 实现：

function reverseList(head) {
    if(!head) return null;
    let prev = null;
    let current = head;
    while(current) {
        let next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    return prev;
}

// ==================== 8. 二叉树的最大深度 ====================
// 题干：给定二叉树根节点 root，返回其最大深度（根到最远叶子节点的节点数）。
// 输入：root: TreeNode | null
// 输出：number
// 约束：递归或 BFS 均可

// 实现：

function maxDepth(root) {
    if(!root) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// ==================== 9. 三数之和 ====================
// 题干：给定整数数组 nums，找出所有和为 0 的三元组 [nums[i], nums[j], nums[k]]，且 i<j<k，结果不重复。
// 输入：nums: number[]
// 输出：number[][]
// 约束：排序 + 双指针，去重

// 实现：

function threeSum(nums) {
    if(nums.length < 3) return [];
    nums.sort((a, b) => a - b);
    let res = [];
    for(let i = 0; i < nums.length - 2; i++) {
        if(i > 0 && nums[i] === nums[i - 1]) continue;
        let left = i + 1, right = nums.length - 1;
        while(left < right) {
            let sum = nums[i] + nums[left] + nums[right];
            if(sum === 0) {
                res.push([nums[i], nums[left], nums[right]]);
                while(left < right && nums[left] === nums[left + 1]) left++;
                while(left < right && nums[right] === nums[right - 1]) right--;
                left++;
                right--;
            }
            else if(sum < 0) {
                left++;
            }
            else {
                right--;
            }
        }
    }
    return res;
}

// ==================== 10. 岛屿数量 ====================
// 题干：给定二维网格 grid，'1' 为陆地，'0' 为水。上下左右相连的 '1' 视为一个岛。求岛屿数量。
// 输入：grid: string[][] 或 number[][]
// 输出：number
// 约束：DFS/BFS 标记连通块

// 实现：

function numIslands(grid) {
    if(grid.length === 0) return 0;
    let res = 0;
    for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[i].length; j++) {
            if(grid[i][j] === '1') {
                res++;
            }
            dfs(grid, i, j);
        }
    }
    return res;
}

// ==================== 11. 最长递增子序列（LIS 长度） ====================
// 题干：给定整数数组 nums，求最长严格递增子序列的长度（不要求连续）。
// 输入：nums: number[]
// 输出：number
// 约束：可 O(n^2) DP 或 O(n log n) 二分 + 贪心

// 实现：

function lengthOfLIS(nums) {
    if(nums.length === 0) return 0;
    let dp = new Array(nums.length).fill(1);
    for(let i = 1; i < nums.length; i++) {
        for(let j = 0; j < i; j++) {
            if(nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
    }
    return Math.max(...dp);
}

// ==================== 12. 接雨水 ====================
// 题干：给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子能接多少雨水。
// 输入：height: number[]
// 输出：number
// 约束：双指针 / 单调栈 / 左右前缀最大值

// 实现：


// ==================== 13. 字符串相加（大数） ====================
// 题干：给定两个非负数字字符串 num1、num2，返回它们相加后的字符串。不可直接转 BigInt。
// 输入：num1: string, num2: string
// 输出：string
// 约束：模拟竖式加法

// 实现：


// ==================== 14. 二叉搜索树的最近公共祖先 ====================
// 题干：给定二叉搜索树根节点 root 和两个节点 p、q，求 p 和 q 的最近公共祖先（LCA）。
// 输入：root: TreeNode, p: TreeNode, q: TreeNode
// 输出：TreeNode
// 约束：利用 BST 性质（值大小关系）

// 实现：

function lowestCommonAncestor(root, p, q) {
    if(!root) return null;
    if(root.val > p.val && root.val > q.val) {
        return lowestCommonAncestor(root.left, p, q);
    }
    if(root.val < p.val && root.val < q.val) {
        return lowestCommonAncestor(root.right, p, q);
    }
    return root;
}


// ==================== 15. 全排列 ====================
// 题干：给定不含重复数字的数组 nums，返回其所有可能的全排列。
// 输入：nums: number[]
// 输出：number[][]
// 约束：回溯

// 实现：


// ==================== 16. 最长回文子串 ====================
// 题干：给定字符串 s，返回 s 中最长回文子串。
// 输入：s: string
// 输出：string
// 约束：中心扩展或 DP

// 实现：

function longestPalindrome(s) {

}

// ==================== 17. 合并区间 ====================
// 题干：给定若干区间 intervals，其中 intervals[i] = [start, end]，合并所有重叠区间，返回不重叠的区间列表。
// 输入：intervals: number[][]
// 输出：number[][]
// 约束：按 start 排序后线性合并

// 实现：

function mergeIntervals(intervals) {
    if(intervals.length === 0) return [];
    intervals.sort((a, b) => a[0] - b[0]);
    let res = [intervals[0]];
    for(let i = 1; i < intervals.length; i++) {
        if(intervals[i][0] <= res[res.length - 1][1]) {
            res[res.length - 1][1] = Math.max(res[res.length - 1][1], intervals[i][1]);
        }
        else {
            res.push(intervals[i]);
        }
    }
    return res;
}

// ==================== 18. 手撕 LRU 缓存 ====================
// 题干：实现 LRU (最近最少使用) 缓存。capacity 为容量；get(key) 存在则返回值并视为使用，否则 -1；put(key, value) 超出容量时淘汰最久未使用的项。
// 输入：构造函数 capacity；方法 get/put
// 输出：get 返回值或 -1；put 无返回值
// 约束：get/put 均 O(1)，可用 Map 维护顺序

// 实现：

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }
    get(key) {
        if(!this.cache.has(key)) return -1;
        let value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }
    put(key, value) {
        if(this.cache.has(key)) {
            this.cache.delete(key);
        }
        this.cache.set(key, value);
        if(this.cache.size > this.capacity) {
            this.cache.delete(this.cache.keys().next().value);
        }
    }
    toString() {
        console.log(this.cache);
    }
}

// ==================== 19. 二叉树的右视图 ====================
// 题干：给定二叉树根节点 root，返回从右侧能看到的节点值组成的数组（每层最右边一个）。
// 输入：root: TreeNode | null
// 输出：number[]
// 约束：BFS 取每层最后一个 或 DFS 先右后左记录深度首次

// 实现：

function rightSideView(root) {
    if(!root) return [];
    let res = [];
    let queue = [root];
    while(queue.length) {
        let length = queue.length;
        for(let i = 0; i < length; i++) {
            let node = queue.shift();
            if(i === length - 1) {
                res.push(node.val);
            }
            if(node.left) queue.push(node.left);
            if(node.right) queue.push(node.right);
        }
    }
    return res;
}

// ==================== 20. 最大子数组和 ====================
// 题干：给定整数数组 nums，求连续子数组的最大和（至少包含一个元素）。
// 输入：nums: number[]
// 输出：number
// 约束：可 O(n) 贪心/DP（Kadane）

// 实现：

function maxSubArray(nums) {
   
}