/**
 * 022101 面试算法题（20 道）- 专题：字符串
 * 日期：2026-02-21
 * 规则：仅题干、输入输出与约束；个人完成后再补充解答与测试用例。
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 反转字符串 ====================
// 题干：原地反转字符数组 s。
// 输入：s: string[]（原地修改）
// 输出：无
// 约束：O(1) 额外空间

function reverseString(s) {
    for (let i = 0, j = s.length - 1; i < j; i++, j--) [s[i], s[j]] = [s[j], s[i]];
}

// ==================== 2. 反转字符串中的单词 ====================
// 题干：字符串 s，单词间可能有多空格，反转单词顺序并规范空格（单空格）。
// 输入：s: string
// 输出：string
// 约束：不可使用额外空间（或 O(1)）

function reverseWords(s) {
    return s.trim().split(/\s+/).reverse().join(' ');
}

// ==================== 3. 字符串中的第一个唯一字符 ====================
// 题干：字符串 s，返回第一个不重复字符的下标，无则 -1。
// 输入：s: string
// 输出：number
// 约束：哈希计数或两次遍历

function firstUniqChar(s) {
    const cnt = {};
    for (const c of s) cnt[c] = (cnt[c] || 0) + 1;
    for (let i = 0; i < s.length; i++) if (cnt[s[i]] === 1) return i;
    return -1;
}

// ==================== 4. 有效的回文串 ====================
// 题干：字符串 s，只考虑字母数字，判断是否回文（忽略大小写）。
// 输入：s: string
// 输出：boolean
// 约束：双指针

function isPalindromeStr(s) {
    let i = 0, j = s.length - 1;
    while (i < j) {
        while (i < j && !/[\w]/.test(s[i])) i++;
        while (i < j && !/[\w]/.test(s[j])) j--;
        if (s[i].toLowerCase() !== s[j].toLowerCase()) return false;
        i++; j--;
    }
    return true;
}

// ==================== 5. 字符串转换整数 (atoi) ====================
// 题干：实现 atoi：前导空格、可选 +/-、连续数字，溢出 clamp 到 32 位有符号范围。
// 输入：s: string
// 输出：number
// 约束：按规则扫描

function myAtoi(s) {
    let i = 0;
    while (s[i] === ' ') i++;
    let sign = 1;
    if (s[i] === '+' || s[i] === '-') sign = s[i++] === '-' ? -1 : 1;
    let n = 0;
    while (/\d/.test(s[i])) {
        n = n * 10 + Number(s[i++]);
        if (sign * n > 2147483647) return 2147483647;
        if (sign * n < -2147483648) return -2147483648;
    }
    return sign * n;
}

// ==================== 6. 实现 strStr() ====================
// 题干：在 haystack 中找 needle 首次出现下标，无则 -1。needle 空返回 0。
// 输入：haystack: string, needle: string
// 输出：number
// 约束：KMP 或暴力

function strStr(haystack, needle) {
    if (!needle) return 0;
    for (let i = 0; i <= haystack.length - needle.length; i++) {
        if (haystack.slice(i, i + needle.length) === needle) return i;
    }
    return -1;
}

// ==================== 7. 重复的子字符串 ====================
// 题干：判断 s 是否可由某个子串重复多次得到。
// 输入：s: string
// 输出：boolean
// 约束：KMP 或 s+s 去首尾包含 s

function repeatedSubstringPattern(s) {
    return (s + s).slice(1, -1).includes(s);
}

// ==================== 8. 最长回文子串 ====================
// 题干：字符串 s，返回最长回文子串。
// 输入：s: string
// 输出：string
// 约束：中心扩展或 Manacher

function longestPalindrome(s) {
    let max = '';
    const expand = (l, r) => {
        while (l >= 0 && r < s.length && s[l] === s[r]) l--, r++;
        return s.slice(l + 1, r);
    };
    for (let i = 0; i < s.length; i++) {
        const s1 = expand(i, i), s2 = expand(i, i + 1);
        if (s1.length > max.length) max = s1;
        if (s2.length > max.length) max = s2;
    }
    return max;
}

// ==================== 9. 编辑距离 ====================
// 题干：word1 转为 word2 的最少单字符操作数（插入、删除、替换）。
// 输入：word1: string, word2: string
// 输出：number
// 约束：DP

function minDistance(word1, word2) {
    const m = word1.length, n = word2.length;
    const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = word1[i - 1] === word2[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    return dp[m][n];
}

// ==================== 10. 最长公共子序列 ====================
// 题干：text1、text2，返回最长公共子序列长度（不要求连续）。
// 输入：text1: string, text2: string
// 输出：number
// 约束：DP

function longestCommonSubsequence(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = text1[i - 1] === text2[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    return dp[m][n];
}

// ==================== 11. 最长公共前缀 ====================
// 题干：字符串数组 strs，返回最长公共前缀。
// 输入：strs: string[]
// 输出：string
// 约束：纵向扫描或二分

function longestCommonPrefix(strs) {
    if (!strs.length) return '';
    for (let j = 0; j < strs[0].length; j++)
        for (let i = 1; i < strs.length; i++)
            if (strs[i][j] !== strs[0][j]) return strs[0].slice(0, j);
    return strs[0];
}

// ==================== 12. 压缩字符串 ====================
// 题干：字符数组 chars，按 "字符+次数" 原地压缩，若次数为 1 不写数字。返回新长度。
// 输入：chars: character[]（原地修改）
// 输出：number
// 约束：双指针

function compress(chars) {
    let w = 0, i = 0;
    while (i < chars.length) {
        const c = chars[i];
        let cnt = 0;
        while (i < chars.length && chars[i] === c) { cnt++; i++; }
        chars[w++] = c;
        if (cnt > 1) for (const d of String(cnt)) chars[w++] = d;
    }
    return w;
}

// ==================== 13. 比较版本号 ====================
// 题干：版本号 "1.01"、"1.001" 等，比较 version1 与 version2。返回 1 / -1 / 0。
// 输入：version1: string, version2: string
// 输出：number
// 约束：按段分割比较

function compareVersion(version1, version2) {
    const v1 = version1.split('.').map(Number), v2 = version2.split('.').map(Number);
    const len = Math.max(v1.length, v2.length);
    for (let i = 0; i < len; i++) {
        const a = v1[i] || 0, b = v2[i] || 0;
        if (a > b) return 1;
        if (a < b) return -1;
    }
    return 0;
}

// ==================== 14. 整数转罗马数字 ====================
// 题干：1~3999 整数 num，转为罗马数字字符串。
// 输入：num: number
// 输出：string
// 约束：贪心或查表

function intToRoman(num) {
    const val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const sym = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    let res = '';
    for (let i = 0; i < val.length; i++)
        while (num >= val[i]) { res += sym[i]; num -= val[i]; }
    return res;
}

// ==================== 15. 罗马数字转整数 ====================
// 题干：罗马数字字符串 s，转为整数。
// 输入：s: string
// 输出：number
// 约束：从左到右，小值在大值前则减

function romanToInt(s) {
    const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let sum = 0;
    for (let i = 0; i < s.length; i++) {
        const v = map[s[i]], next = map[s[i + 1]];
        sum += next > v ? -v : v;
    }
    return sum;
}

// ==================== 16. 外观数列 ====================
// 题干：countAndSay(n)：前一项描述。如 "1" -> "11" -> "21" -> "1211"。
// 输入：n: number
// 输出：string
// 约束：模拟

function countAndSay(n) {
    let s = '1';
    for (let k = 1; k < n; k++) {
        let t = '', i = 0;
        while (i < s.length) {
            let j = i;
            while (j < s.length && s[j] === s[i]) j++;
            t += (j - i) + s[i];
            i = j;
        }
        s = t;
    }
    return s;
}

// ==================== 17. 字母大小写全排列 ====================
// 题干：字符串 s 含字母和数字，将字母大小写变换，返回所有可能字符串。
// 输入：s: string
// 输出：string[]
// 约束：回溯/DFS

function letterCasePermutation(s) {
    const res = [];
    const dfs = (i, path) => {
        if (i === s.length) { res.push(path); return; }
        const c = s[i];
        if (/\d/.test(c)) dfs(i + 1, path + c);
        else { dfs(i + 1, path + c.toLowerCase()); dfs(i + 1, path + c.toUpperCase()); }
    };
    dfs(0, '');
    return res;
}

// ==================== 18. 验证回文串 II ====================
// 题干：字符串 s，最多删一个字符能否成回文。
// 输入：s: string
// 输出：boolean
// 约束：双指针，允许一次不等

function validPalindrome(s) {
    const check = (i, j) => {
        while (i < j) { if (s[i++] !== s[j--]) return false; }
        return true;
    };
    let i = 0, j = s.length - 1;
    while (i < j) {
        if (s[i] !== s[j]) return check(i + 1, j) || check(i, j - 1);
        i++; j--;
    }
    return true;
}

// ==================== 19. 字符串相乘 ====================
// 题干：两个非负整数 num1、num2 的字符串形式，返回乘积的字符串。
// 输入：num1: string, num2: string
// 输出：string
// 约束：模拟竖式或数组位乘

function multiply(num1, num2) {
    if (num1 === '0' || num2 === '0') return '0';
    const m = num1.length, n = num2.length;
    const arr = new Array(m + n).fill(0);
    for (let i = m - 1; i >= 0; i--)
        for (let j = n - 1; j >= 0; j--) {
            const p = i + j + 1, mul = Number(num1[i]) * Number(num2[j]);
            arr[p] += mul;
            arr[p - 1] += (arr[p] / 10) | 0;
            arr[p] %= 10;
        }
    let start = arr[0] === 0 ? 1 : 0;
    return arr.slice(start).join('');
}

// ==================== 20. 不同的子序列 ====================
// 题干：s 和 t，计算 s 中有多少个子序列等于 t。
// 输入：s: string, t: string
// 输出：number
// 约束：DP

function numDistinct(s, t) {
    const m = s.length, n = t.length;
    const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = 1;
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = dp[i - 1][j] + (s[i - 1] === t[j - 1] ? dp[i - 1][j - 1] : 0);
    return dp[m][n];
}
