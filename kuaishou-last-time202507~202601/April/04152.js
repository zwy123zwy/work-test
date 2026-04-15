/**
 * 04152.js — 前端代码算法题 20 道（字符串 / 栈 / 哈希）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const cnt = new Map();
  for (const ch of s) cnt.set(ch, (cnt.get(ch) || 0) + 1);
  for (const ch of t) {
    if (!cnt.has(ch)) return false;
    const left = cnt.get(ch) - 1;
    if (left === 0) cnt.delete(ch);
    else cnt.set(ch, left);
  }
  return cnt.size === 0;
}

function canConstruct(ransomNote, magazine) {
  const cnt = new Map();
  for (const ch of magazine) cnt.set(ch, (cnt.get(ch) || 0) + 1);
  for (const ch of ransomNote) {
    if (!cnt.get(ch)) return false;
    cnt.set(ch, cnt.get(ch) - 1);
  }
  return true;
}

function firstUniqChar(s) {
  const cnt = new Map();
  for (const ch of s) cnt.set(ch, (cnt.get(ch) || 0) + 1);
  for (let i = 0; i < s.length; i += 1) if (cnt.get(s[i]) === 1) return i;
  return -1;
}

function reverseString(s) {
  let l = 0;
  let r = s.length - 1;
  while (l < r) {
    [s[l], s[r]] = [s[r], s[l]];
    l += 1;
    r -= 1;
  }
  return s;
}

function reverseWords(s) {
  return s.trim().split(/\s+/).reverse().join(' ');
}

function isPalindromeString(s) {
  const t = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let l = 0;
  let r = t.length - 1;
  while (l < r) {
    if (t[l] !== t[r]) return false;
    l += 1;
    r -= 1;
  }
  return true;
}

function validPalindromeII(s) {
  const check = (l, r) => {
    while (l < r) {
      if (s[l] !== s[r]) return false;
      l += 1;
      r -= 1;
    }
    return true;
  };
  let l = 0;
  let r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return check(l + 1, r) || check(l, r - 1);
    l += 1;
    r -= 1;
  }
  return true;
}

function isSubsequence(s, t) {
  let i = 0;
  let j = 0;
  while (i < s.length && j < t.length) {
    if (s[i] === t[j]) i += 1;
    j += 1;
  }
  return i === s.length;
}

function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  let pre = strs[0];
  for (let i = 1; i < strs.length; i += 1) {
    while (!strs[i].startsWith(pre)) pre = pre.slice(0, -1);
    if (!pre) return '';
  }
  return pre;
}

function countAndSay(n) {
  let s = '1';
  for (let i = 2; i <= n; i += 1) {
    let cur = '';
    for (let j = 0; j < s.length; ) {
      let k = j;
      while (k < s.length && s[k] === s[j]) k += 1;
      cur += `${k - j}${s[j]}`;
      j = k;
    }
    s = cur;
  }
  return s;
}

function romanToInt(s) {
  const m = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let ans = 0;
  for (let i = 0; i < s.length; i += 1) {
    const v = m[s[i]];
    if (i + 1 < s.length && v < m[s[i + 1]]) ans -= v;
    else ans += v;
  }
  return ans;
}

function isValidParentheses(s) {
  const st = [];
  const pair = { ')': '(', ']': '[', '}': '{' };
  for (const ch of s) {
    if (pair[ch]) {
      if (st.pop() !== pair[ch]) return false;
    } else {
      st.push(ch);
    }
  }
  return st.length === 0;
}

function removeOuterParentheses(s) {
  let bal = 0;
  let ans = '';
  for (const ch of s) {
    if (ch === '(') {
      if (bal > 0) ans += ch;
      bal += 1;
    } else {
      bal -= 1;
      if (bal > 0) ans += ch;
    }
  }
  return ans;
}

function makeGood(s) {
  const st = [];
  for (const ch of s) {
    const top = st[st.length - 1];
    if (top && top !== ch && top.toLowerCase() === ch.toLowerCase()) st.pop();
    else st.push(ch);
  }
  return st.join('');
}

function backspaceCompare(s, t) {
  const build = (str) => {
    const st = [];
    for (const ch of str) {
      if (ch === '#') st.pop();
      else st.push(ch);
    }
    return st.join('');
  };
  return build(s) === build(t);
}

function decodeString(s) {
  const numSt = [];
  const strSt = [];
  let num = 0;
  let cur = '';
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') num = num * 10 + Number(ch);
    else if (ch === '[') {
      numSt.push(num);
      strSt.push(cur);
      num = 0;
      cur = '';
    } else if (ch === ']') {
      cur = strSt.pop() + cur.repeat(numSt.pop());
    } else {
      cur += ch;
    }
  }
  return cur;
}

function wordPattern(pattern, s) {
  const words = s.split(' ');
  if (pattern.length !== words.length) return false;
  const p2w = new Map();
  const w2p = new Map();
  for (let i = 0; i < pattern.length; i += 1) {
    const p = pattern[i];
    const w = words[i];
    if ((p2w.has(p) && p2w.get(p) !== w) || (w2p.has(w) && w2p.get(w) !== p)) return false;
    p2w.set(p, w);
    w2p.set(w, p);
  }
  return true;
}

function uncommonFromSentences(s1, s2) {
  const map = new Map();
  for (const w of `${s1} ${s2}`.trim().split(/\s+/)) map.set(w, (map.get(w) || 0) + 1);
  return [...map.entries()].filter(([, c]) => c === 1).map(([w]) => w);
}

function shortestCompletingWord(licensePlate, words) {
  const need = Array(26).fill(0);
  for (const ch of licensePlate.toLowerCase()) {
    const idx = ch.charCodeAt(0) - 97;
    if (idx >= 0 && idx < 26) need[idx] += 1;
  }
  const ok = (w) => {
    const cnt = Array(26).fill(0);
    for (const ch of w.toLowerCase()) cnt[ch.charCodeAt(0) - 97] += 1;
    for (let i = 0; i < 26; i += 1) if (cnt[i] < need[i]) return false;
    return true;
  };
  let ans = '';
  for (const w of words) {
    if (ok(w) && (!ans || w.length < ans.length)) ans = w;
  }
  return ans;
}

function buddyStrings(s, goal) {
  if (s.length !== goal.length) return false;
  if (s === goal) return new Set(s).size < s.length;
  const diff = [];
  for (let i = 0; i < s.length; i += 1) if (s[i] !== goal[i]) diff.push(i);
  return diff.length === 2 && s[diff[0]] === goal[diff[1]] && s[diff[1]] === goal[diff[0]];
}

module.exports = {
  isAnagram,
  canConstruct,
  firstUniqChar,
  reverseString,
  reverseWords,
  isPalindromeString,
  validPalindromeII,
  isSubsequence,
  longestCommonPrefix,
  countAndSay,
  romanToInt,
  isValidParentheses,
  removeOuterParentheses,
  makeGood,
  backspaceCompare,
  decodeString,
  wordPattern,
  uncommonFromSentences,
  shortestCompletingWord,
  buddyStrings,
};
