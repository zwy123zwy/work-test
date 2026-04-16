/**
 * 04164.js — 前端代码算法题 20 道（位运算 / 数学技巧）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. singleNumber(nums)：唯一出现一次的数。
function singleNumber(nums) {
  let a = 0;
  for (const x of nums) a ^= x;
  return a;
}

// 2. singleNumberIII(nums)：两个只出现一次的数。
function singleNumberIII(nums) {
  let x = 0;
  for (const n of nums) x ^= n;
  const low = x & -x;
  let a = 0;
  let b = 0;
  for (const n of nums) {
    if (n & low) a ^= n;
    else b ^= n;
  }
  return [a, b];
}

// 3. hammingWeight(n)：1 的个数。
function hammingWeight(n) {
  let c = 0;
  let x = n >>> 0;
  while (x) {
    c += 1;
    x &= x - 1;
  }
  return c;
}

// 4. reverseBits(n)：反转 32 位。
function reverseBits(n) {
  let x = n >>> 0;
  let r = 0;
  for (let i = 0; i < 32; i += 1) {
    r = (r << 1) | (x & 1);
    x >>>= 1;
  }
  return r >>> 0;
}

// 5. isPowerOfTwo(n)：是否为 2 的幂。
function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

// 6. countBits(n)：0..n 每个数的 1 个数。
function countBits(n) {
  const ans = Array(n + 1).fill(0);
  for (let i = 1; i <= n; i += 1) ans[i] = ans[i >> 1] + (i & 1);
  return ans;
}

// 7. getSum(a, b)：不用 + 求和。
function getSum(a, b) {
  let x = a;
  let y = b;
  while (y !== 0) {
    const c = (x & y) << 1;
    x ^= y;
    y = c;
  }
  return x;
}

// 8. missingNumber(nums)：0..n 缺一个。
function missingNumber(nums) {
  let x = nums.length;
  for (let i = 0; i < nums.length; i += 1) x ^= i ^ nums[i];
  return x;
}

// 9. totalNQueens(n)：N 皇后方案数。
function totalNQueens(n) {
  let ans = 0;
  const cols = new Set();
  const d1 = new Set();
  const d2 = new Set();
  const dfs = (r) => {
    if (r === n) {
      ans += 1;
      return;
    }
    for (let c = 0; c < n; c += 1) {
      if (cols.has(c) || d1.has(r - c) || d2.has(r + c)) continue;
      cols.add(c);
      d1.add(r - c);
      d2.add(r + c);
      dfs(r + 1);
      cols.delete(c);
      d1.delete(r - c);
      d2.delete(r + c);
    }
  };
  dfs(0);
  return ans;
}

// 10. subsets(nums)：位掩码枚举子集。
function subsets(nums) {
  const n = nums.length;
  const ans = [];
  for (let mask = 0; mask < 1 << n; mask += 1) {
    const cur = [];
    for (let i = 0; i < n; i += 1) if (mask & (1 << i)) cur.push(nums[i]);
    ans.push(cur);
  }
  return ans;
}

// 11. maximumProduct(words)：无公共字母的两词长度积最大。
function maximumProduct(words) {
  const bits = words.map((w) => {
    let m = 0;
    for (const c of w) m |= 1 << (c.charCodeAt(0) - 97);
    return m;
  });
  let ans = 0;
  for (let i = 0; i < words.length; i += 1) {
    for (let j = i + 1; j < words.length; j += 1) {
      if ((bits[i] & bits[j]) === 0) ans = Math.max(ans, words[i].length * words[j].length);
    }
  }
  return ans;
}

// 12. bitwiseComplement(N)：二进制补（前导 1 到最高位）。
function bitwiseComplement(N) {
  if (N === 0) return 1;
  let m = 1;
  while (m < N) m = (m << 1) | 1;
  return N ^ m;
}

// 13. rangeBitwiseAnd(m, n)：区间按位与。
function rangeBitwiseAnd(m, n) {
  let s = 0;
  while (m !== n) {
    m >>= 1;
    n >>= 1;
    s += 1;
  }
  return m << s;
}

// 14. divide(dividend, divisor)：两数相除（截断向零）。
function divide(dividend, divisor) {
  const neg = (dividend < 0) !== (divisor < 0);
  let a = Math.abs(dividend);
  const b = Math.abs(divisor);
  let ans = 0;
  while (a >= b) {
    let t = b;
    let k = 1;
    while (a >= t << 1 && t << 1 > 0) {
      t <<= 1;
      k <<= 1;
    }
    a -= t;
    ans += k;
  }
  const lim = 2 ** 31;
  if (neg) ans = -ans;
  if (ans >= lim) return lim - 1;
  if (ans < -lim) return -lim;
  return ans;
}

// 15. mySqrt(x)：整数平方根。
function mySqrt(x) {
  let lo = 0;
  let hi = x;
  while (lo <= hi) {
    const m = (lo + hi) >> 1;
    if (m * m <= x) lo = m + 1;
    else hi = m - 1;
  }
  return hi;
}

// 16. isPerfectSquare(num)：是否完全平方。
function isPerfectSquare(num) {
  let lo = 1;
  let hi = num;
  while (lo <= hi) {
    const m = (lo + hi) >> 1;
    const p = m * m;
    if (p === num) return true;
    if (p < num) lo = m + 1;
    else hi = m - 1;
  }
  return false;
}

// 17. validUtf8(data)：是否合法 UTF-8 字节序列。
function validUtf8(data) {
  let i = 0;
  while (i < data.length) {
    const first = data[i];
    let bytes = 1;
    if (first < 0x80) bytes = 1;
    else if ((first >> 5) === 0b110) bytes = 2;
    else if ((first >> 4) === 0b1110) bytes = 3;
    else if ((first >> 3) === 0b11110) bytes = 4;
    else return false;
    for (let j = 1; j < bytes; j += 1) {
      if (i + j >= data.length || (data[i + j] >> 6) !== 0b10) return false;
    }
    i += bytes;
  }
  return true;
}

// 18. convertInteger(A, B)：最少翻转位数使 A→B。
function convertInteger(A, B) {
  let x = (A ^ B) >>> 0;
  let c = 0;
  while (x) {
    c += 1;
    x &= x - 1;
  }
  return c;
}

// 19. findComplement(num)：二进制取反（无前导零）。
function findComplement(num) {
  let m = 1;
  while (m < num) m = (m << 1) | 1;
  return num ^ m;
}

// 20. grayCode(n)：格雷码序列。
function grayCode(n) {
  const ans = [];
  for (let i = 0; i < 1 << n; i += 1) ans.push(i ^ (i >> 1));
  return ans;
}

module.exports = {
  singleNumber,
  singleNumberIII,
  hammingWeight,
  reverseBits,
  isPowerOfTwo,
  countBits,
  getSum,
  missingNumber,
  totalNQueens,
  subsets,
  maximumProduct,
  bitwiseComplement,
  rangeBitwiseAnd,
  divide,
  mySqrt,
  isPerfectSquare,
  validUtf8,
  convertInteger,
  findComplement,
  grayCode,
};
