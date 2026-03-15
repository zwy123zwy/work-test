/**
 * 031101 面试算法题（20 道）- 专题：字符串与解析（API/正则）
 * 日期：2026-03-11
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 实现 strStr ====================
function strStr(haystack, needle) {
    if (!needle) return 0;
    for (let i = 0; i <= haystack.length - needle.length; i++)
        if (haystack.slice(i, i + needle.length) === needle) return i;
    return -1;
}

// ==================== 2. 反转字符串 II ====================
function reverseStr(s, k) {
    const arr = s.split('');
    for (let i = 0; i < arr.length; i += 2 * k) {
        let l = i, r = Math.min(i + k - 1, arr.length - 1);
        while (l < r) [arr[l++], arr[r--]] = [arr[r], arr[l]];
    }
    return arr.join('');
}

// ==================== 3. 替换空格 ====================
function replaceSpace(s) {
    return s.replace(/ /g, '%20');
}

// ==================== 4. 翻转字符串里的单词 ====================
function reverseWords(s) {
    return s.trim().split(/\s+/).reverse().join(' ');
}

// ==================== 5. 左旋转字符串 ====================
function reverseLeftWords(s, n) {
    return s.slice(n) + s.slice(0, n);
}

// ==================== 6. 字符串压缩 ====================
function compress(chars) {
    let w = 0, i = 0;
    while (i < chars.length) {
        const c = chars[i];
        let cnt = 0;
        while (i < chars.length && chars[i] === c) { i++; cnt++; }
        chars[w++] = c;
        if (cnt > 1) for (const d of String(cnt)) chars[w++] = d;
    }
    return w;
}

// ==================== 7. 最长回文子串 ====================
function longestPalindrome(s) {
    const expand = (l, r) => {
        while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
        return s.slice(l + 1, r);
    };
    let res = '';
    for (let i = 0; i < s.length; i++) {
        const a = expand(i, i), b = expand(i, i + 1);
        if (a.length > res.length) res = a;
        if (b.length > res.length) res = b;
    }
    return res;
}

// ==================== 8. 重复的子字符串 ====================
function repeatedSubstringPattern(s) {
    return (s + s).slice(1, -1).includes(s);
}

// ==================== 9. 字符串转换整数 ====================
function myAtoi(s) {
    s = s.trim();
    const m = s.match(/^([+-]?\d+)/);
    if (!m) return 0;
    let n = parseInt(m[1], 10);
    return Math.max(-(2 ** 31), Math.min(2 ** 31 - 1, isNaN(n) ? 0 : n));
}

// ==================== 10. 外观数列 ====================
function countAndSay(n) {
    let s = '1';
    for (let i = 1; i < n; i++) {
        let t = '', j = 0;
        while (j < s.length) {
            let cnt = 0, c = s[j];
            while (j < s.length && s[j] === c) { cnt++; j++; }
            t += cnt + c;
        }
        s = t;
    }
    return s;
}

// ==================== 11. 比较版本号 ====================
function compareVersion(v1, v2) {
    const a = v1.split('.').map(Number), b = v2.split('.').map(Number);
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        const x = a[i] || 0, y = b[i] || 0;
        if (x > y) return 1;
        if (x < y) return -1;
    }
    return 0;
}

// ==================== 12. 字符串相乘 ====================
function multiply(num1, num2) {
    if (num1 === '0' || num2 === '0') return '0';
    const m = num1.length, n = num2.length, res = Array(m + n).fill(0);
    for (let i = m - 1; i >= 0; i--)
        for (let j = n - 1; j >= 0; j--) {
            const p = i + j + 1, mul = (+num1[i]) * (+num2[j]);
            const sum = res[p] + mul;
            res[p] = sum % 10;
            res[p - 1] += (sum / 10) | 0;
        }
    return res.join('').replace(/^0+/, '') || '0';
}

// ==================== 13. 最小窗口子序列 ====================
function minWindowSubseq(s, t) {
    let minLen = Infinity, start = -1;
    for (let i = 0; i < s.length; i++) {
        if (s[i] !== t[0]) continue;
        let j = 0, k = i;
        while (k < s.length && j < t.length) {
            if (s[k] === t[j]) j++;
            k++;
        }
        if (j === t.length && k - i < minLen) { minLen = k - i; start = i; }
    }
    return start < 0 ? '' : s.slice(start, start + minLen);
}

// ==================== 14. 有效的括号字符串 ====================
function checkValidString(s) {
    let lo = 0, hi = 0;
    for (const c of s) {
        lo += c === '(' ? 1 : -1;
        hi += c !== ')' ? 1 : -1;
        if (hi < 0) return false;
        lo = Math.max(lo, 0);
    }
    return lo === 0;
}

// ==================== 15. 验证回文字符串 II ====================
function validPalindrome(s) {
    const pal = (i, j) => {
        while (i < j) if (s[i++] !== s[j--]) return false;
        return true;
    };
    let i = 0, j = s.length - 1;
    while (i < j) {
        if (s[i] !== s[j]) return pal(i + 1, j) || pal(i, j - 1);
        i++; j--;
    }
    return true;
}

// ==================== 16. 子域名访问计数 ====================
function subdomainVisits(cpdomains) {
    const map = {};
    for (const s of cpdomains) {
        const [cnt, dom] = s.split(' ');
        const n = parseInt(cnt, 10);
        const parts = dom.split('.');
        for (let i = 0; i < parts.length; i++) {
            const d = parts.slice(i).join('.');
            map[d] = (map[d] || 0) + n;
        }
    }
    return Object.entries(map).map(([d, n]) => n + ' ' + d);
}

// ==================== 17. 独特的电子邮件地址 ====================
function numUniqueEmails(emails) {
    const set = new Set();
    for (const e of emails) {
        const [local, dom] = e.split('@');
        const norm = local.split('+')[0].replace(/\./g, '') + '@' + dom;
        set.add(norm);
    }
    return set.size;
}

// ==================== 18. 分割回文串 II ====================
function minCut(s) {
    const n = s.length;
    const pal = Array(n).fill(0).map(() => Array(n).fill(true));
    for (let len = 2; len <= n; len++)
        for (let i = 0; i + len <= n; i++) {
            const j = i + len - 1;
            pal[i][j] = s[i] === s[j] && pal[i + 1][j - 1];
        }
    const dp = Array(n).fill(Infinity);
    for (let i = 0; i < n; i++) {
        if (pal[0][i]) { dp[i] = 0; continue; }
        for (let j = 0; j < i; j++)
            if (pal[j + 1][i]) dp[i] = Math.min(dp[i], dp[j] + 1);
    }
    return dp[n - 1];
}

// ==================== 19. 最长特殊序列 ====================
function findLUSlength(a, b) {
    return a === b ? -1 : Math.max(a.length, b.length);
}

// ==================== 20. 统计同构子字符串数目 ====================
function countHomogenous(s) {
    let res = 0, cnt = 0;
    for (let i = 0; i < s.length; i++) {
        cnt = (i > 0 && s[i] === s[i - 1]) ? cnt + 1 : 1;
        res = (res + cnt) % (1e9 + 7);
    }
    return res;
}

// ==================== 测试 ====================
function test031101() {
    const assert = (n, a, e) => console.log(JSON.stringify(a) === JSON.stringify(e) ? `[OK] ${n}` : `[FAIL] ${n}`);
    assert('1', strStr('hello', 'll'), 2);
    assert('2', reverseStr('abcdefg', 2), 'bacdfeg');
    assert('4', reverseWords('the sky is blue'), 'blue is sky the');
    assert('5', reverseLeftWords('abcdefg', 2), 'cdefgab');
    assert('8', repeatedSubstringPattern('abab'), true);
    assert('9', myAtoi('   -42'), -42);
    assert('11', compareVersion('1.01', '1.001'), 0);
    assert('12', multiply('2', '3'), '6');
    assert('15', validPalindrome('aba'), true);
    assert('19', findLUSlength('aba', 'cdc'), 3);
    console.log('031101 tests done.');
}
test031101();
