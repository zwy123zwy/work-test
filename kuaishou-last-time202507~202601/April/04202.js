// 04202 - 数组专题（含参考答案）

// 问题1：实现数组去重（保留顺序）
function solution_04202_1(arr) {
  return [...new Set(arr)];
}

// 问题2：实现数组交集
function solution_04202_2(a, b) {
  const s = new Set(b);
  return [...new Set(a.filter((x) => s.has(x)))];
}

// 问题3：实现数组并集
function solution_04202_3(a, b) {
  return [...new Set([...a, ...b])];
}

// 问题4：实现数组差集
function solution_04202_4(a, b) {
  const s = new Set(b);
  return a.filter((x) => !s.has(x));
}

// 问题5：实现数组分组 groupBy
function solution_04202_5(arr, key) {
  return arr.reduce((acc, cur) => {
    const k = typeof key === 'function' ? key(cur) : cur[key];
    (acc[k] ||= []).push(cur);
    return acc;
  }, {});
}

// 问题6：实现按块切分 chunk
function solution_04202_6(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
  return res;
}

// 问题7：实现随机打乱 shuffle
function solution_04202_7(arr) {
  const res = arr.slice();
  for (let i = res.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

// 问题8：实现数组旋转 rotate
function solution_04202_8(arr, k) {
  const n = arr.length;
  if (!n) return [];
  const step = ((k % n) + n) % n;
  return [...arr.slice(-step), ...arr.slice(0, n - step)];
}

// 问题9：实现数组拍平 flattenDeep
function solution_04202_9(arr) {
  return arr.reduce((acc, cur) => acc.concat(Array.isArray(cur) ? solution_04202_9(cur) : cur), []);
}

// 问题10：实现按路径排序 sortByPath
function solution_04202_10(arr, path) {
  const keys = path.split('.');
  const get = (obj) => keys.reduce((o, k) => (o == null ? o : o[k]), obj);
  return arr.slice().sort((a, b) => {
    const va = get(a);
    const vb = get(b);
    if (va === vb) return 0;
    return va > vb ? 1 : -1;
  });
}

// 问题11：实现稳定排序 stableSort
function solution_04202_11(arr, compareFn) {
  return arr
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const r = compareFn(a.item, b.item);
      return r === 0 ? a.index - b.index : r;
    })
    .map((x) => x.item);
}

// 问题12：实现查找第 K 大元素
function solution_04202_12(arr, k) {
  return arr.slice().sort((a, b) => b - a)[k - 1];
}

// 问题13：实现滑动窗口最大值
function solution_04202_13(nums, k) {
  const deque = [];
  const res = [];
  for (let i = 0; i < nums.length; i += 1) {
    while (deque.length && deque[0] <= i - k) deque.shift();
    while (deque.length && nums[deque[deque.length - 1]] <= nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) res.push(nums[deque[0]]);
  }
  return res;
}

// 问题14：实现前缀和构建
function solution_04202_14(arr) {
  const pre = [0];
  for (const n of arr) pre.push(pre[pre.length - 1] + n);
  return pre;
}

// 问题15：实现二维数组转一维
function solution_04202_15(matrix) {
  return matrix.flat();
}

// 问题16：实现一维数组转二维
function solution_04202_16(arr, cols) {
  return solution_04202_6(arr, cols);
}

// 问题17：实现数组去空值 compact
function solution_04202_17(arr) {
  return arr.filter(Boolean);
}

// 问题18：实现按条件拆分 partition
function solution_04202_18(arr, fn) {
  return arr.reduce(
    (acc, cur) => {
      acc[fn(cur) ? 0 : 1].push(cur);
      return acc;
    },
    [[], []],
  );
}

// 问题19：实现求众数 mode
function solution_04202_19(arr) {
  const map = new Map();
  let ans = null;
  let max = 0;
  for (const n of arr) {
    const cnt = (map.get(n) || 0) + 1;
    map.set(n, cnt);
    if (cnt > max) {
      max = cnt;
      ans = n;
    }
  }
  return ans;
}

// 问题20：实现数组笛卡尔积
function solution_04202_20(arrays) {
  return arrays.reduce((acc, cur) => acc.flatMap((a) => cur.map((b) => [...a, b])), [[]]);
}
