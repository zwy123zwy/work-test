/**
 * 04176.js — 前端代码算法题 20 道（字符串 · 双指针 / 哈希 / KMP / 技巧）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. reverseWords(s)：单词逆序，多空格压缩为单空格。
function reverseWords(s) {
  return s
    .trim()
    .split(/\s+/)
    .reverse()
    .join(' ');
}

// 2. isAnagram(s, t)：字符频相同。
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const c = Array(26).fill(0);
  for (let i = 0; i < s.length; i += 1) {
    c[s.charCodeAt(i) - 97] += 1;
    c[t.charCodeAt(i) - 97] -= 1;
  }
  return c.every((x) => x === 0);
}

// 3. groupAnagrams(strs)
function groupAnagrams(strs) {
  const map = new Map();
  for (const w of strs) {
    const k = Array(26).fill(0);
    for (let i = 0; i < w.length; i += 1) k[w.charCodeAt(i) - 97] += 1;
    const key = k.join(',');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(w);
  }
  return [...map.values()];
}

// 4. lengthOfLongestSubstring(s)：无重复字符最长子串。
function lengthOfLongestSubstring(s) {
  const last = new Map();
  let left = 0;
  let ans = 0;
  for (let r = 0; r < s.length; r += 1) {
    const ch = s[r];
    if (last.has(ch) && last.get(ch) >= left) left = last.get(ch) + 1;
    last.set(ch, r);
    ans = Math.max(ans, r - left + 1);
  }
  return ans;
}

// 5. minWindow(s, t)：含 t 全部字符的最短子串。
function minWindow(s, t) {
  if (!t.length) return '';
  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);
  let miss = need.size;
  let l = 0;
  let best = '';
  let bestLen = Infinity;
  for (let r = 0; r < s.length; r += 1) {
    const cr = s[r];
    if (need.has(cr)) {
      need.set(cr, need.get(cr) - 1);
      if (need.get(cr) === 0) miss -= 1;
    }
    while (miss === 0) {
      if (r - l + 1 < bestLen) {
        bestLen = r - l + 1;
        best = s.slice(l, r + 1);
      }
      const cl = s[l];
      if (need.has(cl)) {
        need.set(cl, need.get(cl) + 1);
        if (need.get(cl) > 0) miss += 1;
      }
      l += 1;
    }
  }
  return bestLen === Infinity ? '' : best;
}

// 6. checkInclusion(s1, s2)：s2 中是否存在 s1 的排列。
function checkInclusion(s1, s2) {
  if (s1.length > s2.length) return false;
  const c1 = Array(26).fill(0);
  const c2 = Array(26).fill(0);
  for (let i = 0; i < s1.length; i += 1) {
    c1[s1.charCodeAt(i) - 97] += 1;
    c2[s2.charCodeAt(i) - 97] += 1;
  }
  const same = () => c1.every((v, i) => v === c2[i]);
  if (same()) return true;
  for (let i = s1.length; i < s2.length; i += 1) {
    c2[s2.charCodeAt(i) - 97] += 1;
    c2[s2.charCodeAt(i - s1.length) - 97] -= 1;
    if (same()) return true;
  }
  return false;
}

// 7. strStr(haystack, needle)：KMP 找首位置。
function strStr(haystack, needle) {
  if (!needle.length) return 0;
  const lps = Array(needle.length).fill(0);
  for (let i = 1, len = 0; i < needle.length; ) {
    if (needle[i] === needle[len]) {
      len += 1;
      lps[i] = len;
      i += 1;
    } else if (len) len = lps[len - 1];
    else {
      lps[i] = 0;
      i += 1;
    }
  }
  for (let i = 0, j = 0; i < haystack.length; ) {
    if (haystack[i] === needle[j]) {
      i += 1;
      j += 1;
      if (j === needle.length) return i - j;
    } else if (j) j = lps[j - 1];
    else i += 1;
  }
  return -1;
}

// 8. multiply(num1, num2)：大数相乘字符串。
function multiply(num1, num2) {
  if (num1 === '0' || num2 === '0') return '0';
  const m = num1.length;
  const n = num2.length;
  const res = Array(m + n).fill(0);
  for (let i = m - 1; i >= 0; i -= 1) {
    for (let j = n - 1; j >= 0; j -= 1) {
      const p = (num1.charCodeAt(i) - 48) * (num2.charCodeAt(j) - 48);
      const s = p + res[i + j + 1];
      res[i + j + 1] = s % 10;
      res[i + j] += (s / 10) | 0;
    }
  }
  let i = 0;
  while (i < res.length - 1 && res[i] === 0) i += 1;
  return res.slice(i).join('');
}

// 9. addBinary(a, b)
function addBinary(a, b) {
  let i = a.length - 1;
  let j = b.length - 1;
  let c = 0;
  const out = [];
  while (i >= 0 || j >= 0 || c) {
    const x = i >= 0 ? a.charCodeAt(i) - 48 : 0;
    const y = j >= 0 ? b.charCodeAt(j) - 48 : 0;
    const s = x + y + c;
    out.push(s & 1);
    c = s >> 1;
    i -= 1;
    j -= 1;
  }
  return out.reverse().join('');
}

// 10. compareVersion(v1, v2)
function compareVersion(v1, v2) {
  const a = v1.split('.').map(Number);
  const b = v2.split('.').map(Number);
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i += 1) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    if (x < y) return -1;
    if (x > y) return 1;
  }
  return 0;
}

// 11. longestPalindrome(s)：用字符重排能组成的最长回文长度。
function longestPalindromeKey(s) {
  const cnt = new Map();
  for (const ch of s) cnt.set(ch, (cnt.get(ch) || 0) + 1);
  let ans = 0;
  let odd = 0;
  for (const v of cnt.values()) {
    ans += Math.floor(v / 2) * 2;
    if (v % 2) odd = 1;
  }
  return ans + odd;
}

// 12. reorganizeString(s)：相邻不同，或 ''。
function reorganizeString(s) {
  const cnt = new Map();
  for (const ch of s) cnt.set(ch, (cnt.get(ch) || 0) + 1);
  const pq = [...cnt.entries()].sort((a, b) => b[1] - a[1]);
  const max = pq[0][1];
  if (max > Math.ceil(s.length / 2)) return '';
  const res = Array(s.length);
  let i = 0;
  for (const [ch, n] of pq) {
    for (let k = 0; k < n; k += 1) {
      res[i] = ch;
      i += 2;
      if (i >= s.length) i = 1;
    }
  }
  return res.join('');
}

// 13. longestPalindromeExpand(s)：中心扩展最长回文子串。
function longestPalindromeExpand(s) {
  let start = 0;
  let len = 0;
  const expand = (l, r) => {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
      l -= 1;
      r += 1;
    }
    return r - l - 1;
  };
  for (let i = 0; i < s.length; i += 1) {
    const o1 = expand(i, i);
    const o2 = expand(i, i + 1);
    const m = Math.max(o1, o2);
    if (m > len) {
      len = m;
      start = i - Math.floor((m - 1) / 2);
    }
  }
  return s.slice(start, start + len);
}

// 14. validPalindrome(s)：删至多 1 字符能否成回文。
function validPalindrome(s) {
  const isPa = (l, r, skip) => {
    while (l < r) {
      if (s[l] !== s[r]) {
        if (skip) return isPa(l + 1, r, false) || isPa(l, r - 1, false);
        return false;
      }
      l += 1;
      r -= 1;
    }
    return true;
  };
  return isPa(0, s.length - 1, true);
}

// 15. compress(chars)：原地压缩 ['a','a','b'] -> ['a','2','b'] 返回新长度。
function compress(chars) {
  let w = 0;
  let i = 0;
  while (i < chars.length) {
    const ch = chars[i];
    let j = i;
    while (j < chars.length && chars[j] === ch) j += 1;
    chars[w++] = ch;
    const run = j - i;
    if (run > 1) {
      const num = String(run);
      for (let k = 0; k < num.length; k += 1) chars[w++] = num[k];
    }
    i = j;
  }
  return w;
}

// 16. romanToInt(s)
function romanToInt(s) {
  const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let ans = 0;
  for (let i = 0; i < s.length; i += 1) {
    const v = map[s[i]];
    if (i + 1 < s.length && v < map[s[i + 1]]) ans -= v;
    else ans += v;
  }
  return ans;
}

// 17. intToRoman(num)
function intToRoman(num) {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let s = '';
  for (let i = 0; i < vals.length; i += 1) {
    while (num >= vals[i]) {
      num -= vals[i];
      s += syms[i];
    }
  }
  return s;
}

// 18. countBinarySubstrings(s)：相等数目的连续 0/1 子串个数。
function countBinarySubstrings(s) {
  let prev = 0;
  let cur = 1;
  let ans = 0;
  for (let i = 1; i < s.length; i += 1) {
    if (s[i] !== s[i - 1]) {
      ans += Math.min(prev, cur);
      prev = cur;
      cur = 1;
    } else cur += 1;
  }
  ans += Math.min(prev, cur);
  return ans;
}

// 19. decodeString(s)：3[a2[c]] -> accaccacc。
function decodeString(s) {
  const st = [];
  let cur = '';
  let num = 0;
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') num = num * 10 + (+ch);
    else if (ch === '[') {
      st.push([cur, num]);
      cur = '';
      num = 0;
    } else if (ch === ']') {
      const [prev, k] = st.pop();
      cur = prev + cur.repeat(k);
    } else cur += ch;
  }
  return cur;
}

// 20. fullJustify(words, maxWidth)：单词间分配空格文本对齐最后一行左对齐。
function fullJustify(words, maxWidth) {
  const res = [];
  let i = 0;
  while (i < words.length) {
    let j = i + 1;
    let tot = words[i].length;
    while (j < words.length && tot + 1 + words[j].length <= maxWidth) {
      tot += 1 + words[j].length;
      j += 1;
    }
    const n = j - i;
    if (j === words.length || n === 1) {
      let line = words.slice(i, j).join(' ');
      while (line.length < maxWidth) line += ' ';
      res.push(line);
    } else {
      const sumChars = words.slice(i, j).reduce((a, w) => a + w.length, 0);
      let spaces = maxWidth - sumChars;
      const gaps = n - 1;
      const base = Math.floor(spaces / gaps);
      let extra = spaces % gaps;
      let line = words[i];
      for (let k = i + 1; k < j; k += 1) {
        const sp = base + (extra > 0 ? 1 : 0);
        if (extra > 0) extra -= 1;
        line += ' '.repeat(sp) + words[k];
      }
      res.push(line);
    }
    i = j;
  }
  return res;
}

module.exports = {
  reverseWords,
  isAnagram,
  groupAnagrams,
  lengthOfLongestSubstring,
  minWindow,
  checkInclusion,
  strStr,
  multiply,
  addBinary,
  compareVersion,
  longestPalindromeKey,
  reorganizeString,
  longestPalindromeExpand,
  validPalindrome,
  compress,
  romanToInt,
  intToRoman,
  countBinarySubstrings,
  decodeString,
  fullJustify,
};
