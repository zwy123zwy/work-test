/**
 * 022201 数学与位运算（20 道）
 * 1.位1的个数 2.2的幂 3.只出现一次 4.只出现一次II 5.只出现一次III
 * 6.颠倒二进制位 7.数字范围按位与 8.缺失数字 9.3的幂 10.4的幂
 * 11.最大公约数 12.最小公倍数 13.阶乘后的零 14.计数质数 15.Pow(x,n)
 * 16.直线上最多点 17.分数到小数 18.两数相除 19.格雷编码 20.多数元素
 */

function hammingWeight(n) {
    let c = 0;
    while (n) { n &= n - 1; c++; }
    return c >>> 0;
}

function isPowerOfTwo(n) {
    return n > 0 && (n & (n - 1)) === 0;
}

function singleNumber(nums) {
    return nums.reduce((a, b) => a ^ b, 0);
}

function singleNumber2(nums) {
    let ones = 0, twos = 0;
    for (const x of nums) {
        ones = (ones ^ x) & ~twos;
        twos = (twos ^ x) & ~ones;
    }
    return ones;
}

function singleNumber3(nums) {
    const xor = nums.reduce((a, b) => a ^ b, 0);
    const low = xor & -xor;
    let a = 0, b = 0;
    for (const x of nums) (x & low ? a : b) ^= x;
    return [a, b];
}

function reverseBits(n) {
    let res = 0;
    for (let i = 0; i < 32; i++) res = (res << 1) | (n >>> i & 1);
    return res >>> 0;
}

function rangeBitwiseAnd(left, right) {
    let shift = 0;
    while (left < right) { left >>= 1; right >>= 1; shift++; }
    return left << shift;
}

function missingNumber(nums) {
    const n = nums.length;
    return nums.reduce((a, x, i) => a ^ x ^ i, n);
}

function isPowerOfThree(n) {
    if (n <= 0) return false;
    let x = n;
    while (x % 3 === 0) x /= 3;
    return x === 1;
}

function isPowerOfFour(n) {
    return n > 0 && (n & (n - 1)) === 0 && (n & 0xaaaaaaaa) === 0;
}

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
    return (a * b) / gcd(a, b);
}

function trailingZeroes(n) {
    let c = 0;
    while (n >= 5) { n = (n / 5) | 0; c += n; }
    return c;
}

function countPrimes(n) {
    if (n <= 2) return 0;
    const isPrime = new Array(n).fill(true);
    isPrime[0] = isPrime[1] = false;
    for (let i = 2; i * i < n; i++)
        if (isPrime[i]) for (let j = i * i; j < n; j += i) isPrime[j] = false;
    return isPrime.filter(Boolean).length;
}

function myPow(x, n) {
    if (n === 0) return 1;
    if (n < 0) { x = 1 / x; n = -n; }
    let res = 1;
    while (n) { if (n & 1) res *= x; x *= x; n >>>= 1; }
    return res;
}

function maxPoints(points) {
    const n = points.length;
    if (n <= 2) return n;
    let max = 0;
    for (let i = 0; i < n; i++) {
        const map = new Map();
        for (let j = 0; j < n; j++) {
            if (i === j) continue;
            let dx = points[j][0] - points[i][0], dy = points[j][1] - points[i][1];
            const g = gcd(Math.abs(dx), Math.abs(dy));
            dx = (dx / g) | 0; dy = (dy / g) | 0;
            const key = dx + ',' + dy;
            map.set(key, (map.get(key) || 0) + 1);
        }
        for (const v of map.values()) max = Math.max(max, v + 1);
    }
    return max;
}

function fractionToDecimal(numerator, denominator) {
    if (numerator === 0) return '0';
    let sign = (numerator > 0) === (denominator > 0) ? '' : '-';
    let a = Math.abs(numerator), b = Math.abs(denominator);
    let intPart = (a / b) | 0;
    a %= b;
    if (a === 0) return sign + String(intPart);
    const map = new Map();
    let dec = '';
    while (a && !map.has(a)) {
        map.set(a, dec.length);
        a *= 10;
        dec += (a / b) | 0;
        a %= b;
    }
    if (a === 0) return sign + intPart + '.' + dec;
    const i = map.get(a);
    return sign + intPart + '.' + dec.slice(0, i) + '(' + dec.slice(i) + ')';
}

function divide(dividend, divisor) {
    if (dividend === -2147483648 && divisor === -1) return 2147483647;
    const sign = (dividend > 0) === (divisor > 0) ? 1 : -1;
    let a = Math.abs(dividend), b = Math.abs(divisor);
    let res = 0;
    while (a >= b) {
        let t = b, count = 1;
        while (a >= (t << 1) && (t << 1) > 0) { t <<= 1; count <<= 1; }
        a -= t; res += count;
    }
    return sign * res;
}

function grayCode(n) {
    const res = [];
    for (let i = 0; i < 1 << n; i++) res.push(i ^ (i >> 1));
    return res;
}

function majorityElement(nums) {
    let cand = 0, count = 0;
    for (const x of nums) {
        if (count === 0) cand = x;
        count += x === cand ? 1 : -1;
    }
    return cand;
}
