// 二叉树的层序遍历 II
var levelOrderBottom = function (root) {
  let res = [],
    queue = [];
  queue.push(root);
  while (queue.length && root !== null) {
    // 存放当前层级节点数组
    let curLevel = [];
    // 计算当前层级节点数量
    let length = queue.length;
    while (length--) {
      let node = queue.shift();
      // 把当前层节点存入curLevel数组
      curLevel.push(node.val);
      // 把下一层级的左右节点存入queue队列
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
    }
    // 从数组前头插入值，避免最后反转数组，减少运算时间
    res.unshift(curLevel);
  }
  return res;
};

// 二叉树的右视图
var rightSideView = function (root) {
  //二叉树右视图 只需要把每一层最后一个节点存储到res数组
  let res = [],
    queue = [];
  queue.push(root);

  while (queue.length && root !== null) {
    // 记录当前层级节点个数
    let length = queue.length;
    while (length--) {
      let node = queue.shift();
      // length长度为0的时候表明到了层级最后一个节点
      if (!length) {
        res.push(node.val);
      }
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
    }
  }

  return res;
};


// 二叉树的层序遍历求每一层的平均值
var averageOfLevels = function (root) {
  let res = [],
    queue = [];
  queue.push(root);
  while (queue.length) {
    // 每一层节点个数;
    let lengthLevel = queue.length,
      len = queue.length,
      //   sum记录每一层的和;
      sum = 0;
    while (lengthLevel--) {
      const node = queue.shift();
      sum += node.val;
      //   队列存放下一层节点
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
    }
    // 求平均值
    res.push(sum / len);
  }
  return res;
};

// N叉树的层序遍历
var levelOrder = function (root) {
  //每一层可能有2个以上,所以不再使用node.left node.right
  let res = [],
    queue = [];
  queue.push(root);

  while (queue.length && root !== null) {
    //记录每一层节点个数还是和二叉树一致
    let length = queue.length;
    //存放每层节点 也和二叉树一致
    let curLevel = [];
    while (length--) {
      let node = queue.shift();
      curLevel.push(node.val);

      //这里不再是 ndoe.left node.right 而是循坏node.children
      for (let item of node.children) {
        item && queue.push(item);
      }
    }
    res.push(curLevel);
  }

  return res;
};

// 找到每一层的最大值
var largestValues = function (root) {
  let res = [],
    queue = [];
  queue.push(root);
  if (root === null) {
    return res;
  }
  while (queue.length) {
    let lengthLevel = queue.length,
      // 初始值设为负无穷大
      max = -Infinity;
    while (lengthLevel--) {
      const node = queue.shift();
      //   在当前层中找到最大值
      max = Math.max(max, node.val);
      // 找到下一层的节点
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
    }
    res.push(max);
  }
  return res;
};

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root) {
  // 二叉树的 最大深度 是指从根节点到最远叶子节点的最长路径上的节点数。
  let max = 0,
    queue = [root];
  if (root === null) {
    return max;
  }
  while (queue.length) {
    max++;
    let length = queue.length;
    while (length--) {
      let node = queue.shift();
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
    }
  }
  return max;
};
// 
/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var removeElements = function (head, val) {
  const ret = new ListNode(0, head);
  let cur = ret;
  while (cur.next) {
    if (cur.next.val === val) {
      cur.next = cur.next.next;
      continue;
    }
    cur = cur.next;
  }
  return ret.next;
};


var swapPairs = function (head) {
  let ret = new ListNode(0, head), temp = ret;
  while (temp.next && temp.next.next) {
    let cur = temp.next.next, pre = temp.next;
    pre.next = cur.next;
    cur.next = pre;
    temp.next = cur;
    temp = pre;
  }
  return ret.next;
};

const findLengthOfLCIS = (nums) => {
  let dp = new Array(nums.length).fill(1);


  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i + 1] > nums[i]) {
      dp[i + 1] = dp[i] + 1;
    }
  }

  return Math.max(...dp);
};


// 使用两个数组的栈方法（push, pop） 实现队列
/**
* Initialize your data structure here.
*/
var MyQueue = function () {
  this.stackIn = [];
  this.stackOut = [];
};

/**
* Push element x to the back of queue. 
* @param {number} x
* @return {void}
*/
MyQueue.prototype.push = function (x) {
  this.stackIn.push(x);
};

/**
* Removes the element from in front of queue and returns that element.
* @return {number}
*/
MyQueue.prototype.pop = function () {
  const size = this.stackOut.length;
  if (size) {
    return this.stackOut.pop();
  }
  while (this.stackIn.length) {
    this.stackOut.push(this.stackIn.pop());
  }
  return this.stackOut.pop();
};

/**
* Get the front element.
* @return {number}
*/
MyQueue.prototype.peek = function () {
  const x = this.pop();
  this.stackOut.push(x);
  return x;
};

/**
* Returns whether the queue is empty.
* @return {boolean}
*/
MyQueue.prototype.empty = function () {
  return !this.stackIn.length && !this.stackOut.length
};


var isValid = function (s) {
  const stack = [];
  for (let i = 0; i < s.length; i++) {
    let c = s[i];
    switch (c) {
      case '(':
        stack.push(')');
        break;
      case '[':
        stack.push(']');
        break;
      case '{':
        stack.push('}');
        break;
      default:
        if (c !== stack.pop()) {
          return false;
        }
    }
  }
  return stack.length === 0;
};
// 简化版本
var isValid = function(s) {
    const stack = [], 
        map = {
            "(":")",
            "{":"}",
            "[":"]"
        };
    for(const x of s) {
        if(x in map) {
            stack.push(x);
            continue;
        };
        if(map[stack.pop()] !== x) return false;
    }
    return !stack.length;
};


// js 没有堆 需要自己构造
class Heap {
    constructor(compareFn) {
        this.compareFn = compareFn;
        this.queue = [];
    }

    // 添加
    push(item) {
        // 推入元素
        this.queue.push(item);

        // 上浮
        let index = this.size() - 1; // 记录推入元素下标
        let parent = Math.floor((index - 1) / 2); // 记录父节点下标

        while (parent >= 0 && this.compare(parent, index) > 0) { // 注意compare参数顺序
            [this.queue[index], this.queue[parent]] = [this.queue[parent], this.queue[index]];

            // 更新下标
            index = parent;
            parent = Math.floor((index - 1) / 2);
        }
    }

    // 获取堆顶元素并移除
    pop() {
        // 边界情况，只有一个元素或没有元素应直接弹出
        if (this.size() <= 1) {
            return this.queue.pop()
        }

        // 堆顶元素
        const out = this.queue[0];

        // 移除堆顶元素 填入最后一个元素
        this.queue[0] = this.queue.pop();

        // 下沉
        let index = 0; // 记录下沉元素下标
        let left = 1; // left 是左子节点下标 left + 1 则是右子节点下标
        let searchChild = this.compare(left, left + 1) > 0 ? left + 1 : left;

        while (this.compare(index, searchChild) > 0) { // 注意compare参数顺序
            [this.queue[index], this.queue[searchChild]] = [this.queue[searchChild], this.queue[index]];

            // 更新下标
            index = searchChild;
            left = 2 * index + 1;
            searchChild = this.compare(left, left + 1) > 0 ? left + 1 : left;
        }

        return out;
    }

    size() {
        return this.queue.length;
    }

    // 使用传入的 compareFn 比较两个位置的元素
    compare(index1, index2) {
        // 处理下标越界问题
        if (this.queue[index1] === undefined) return 1;
        if (this.queue[index2] === undefined) return -1;

        return this.compareFn(this.queue[index1], this.queue[index2]);
    }

}

const topKFrequent = function (nums, k) {
    const map = new Map();

    for (const num of nums) {
        map.set(num, (map.get(num) || 0) + 1);
    }

    // 创建小顶堆
    const heap= new Heap((a, b) => a[1] - b[1]);

    // entry 是一个长度为2的数组，0位置存储key，1位置存储value
    for (const entry of map.entries()) {
        heap.push(entry);

        if (heap.size() > k) {
            heap.pop();
        }
    }

    // return heap.queue.map(e => e[0]);

    const res = [];

    for (let i = heap.size() - 1; i >= 0; i--) {
        res[i] = heap.pop()[0];
    }

    return res;
};
