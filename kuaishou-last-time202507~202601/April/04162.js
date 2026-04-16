/**
 * 04162.js — 前端代码算法题 20 道（Trie / 前缀树 / 字符串匹配）
 * 题后给参考答案（核心思路 + 可运行实现）。
 */

// 1. Trie：insert / search / startsWith
class Trie {
  constructor() {
    this.root = {};
  }
  insert(word) {
    let n = this.root;
    for (const c of word) {
      if (!n[c]) n[c] = {};
      n = n[c];
    }
    n.end = true;
  }
  search(word) {
    let n = this.root;
    for (const c of word) {
      if (!n[c]) return false;
      n = n[c];
    }
    return !!n.end;
  }
  startsWith(prefix) {
    let n = this.root;
    for (const c of prefix) {
      if (!n[c]) return false;
      n = n[c];
    }
    return true;
  }
}

// 2. replaceWords(dict, sentence)：用最短词根替换。
function replaceWords(dict, sentence) {
  const root = {};
  for (const w of dict) {
    let n = root;
    for (const c of w) {
      if (!n[c]) n[c] = {};
      n = n[c];
    }
    n.word = w;
  }
  const findRoot = (word) => {
    let n = root;
    for (const c of word) {
      if (!n[c]) break;
      n = n[c];
      if (n.word) return n.word;
    }
    return word;
  };
  return sentence
    .split(' ')
    .map((w) => findRoot(w))
    .join(' ');
}

// 3. longestWord(words)：仅由词典中词逐个加字符可构成。
function longestWord(words) {
  words.sort();
  const s = new Set(['']);
  let best = '';
  for (const w of words) {
    if (s.has(w.slice(0, -1))) {
      s.add(w);
      if (w.length > best.length) best = w;
    }
  }
  return best;
}

// 4. searchSuggestions(products, searchWord)：每输入一字符返回至多 3 个前缀匹配。
function suggestedProducts(products, searchWord) {
  products.sort();
  const ans = [];
  let lo = 0;
  let hi = products.length - 1;
  for (let p = 0; p < searchWord.length; p += 1) {
    const prefix = searchWord.slice(0, p + 1);
    while (lo <= hi && products[lo] < prefix) lo += 1;
    while (lo <= hi && products[hi] > prefix + '\uffff') hi -= 1;
    const row = [];
    for (let i = lo; i <= Math.min(lo + 2, hi); i += 1) row.push(products[i]);
    ans.push(row);
  }
  return ans;
}

// 5. findMaximumXOR(nums)：两数最大异或（01 Trie）。
function findMaximumXOR(nums) {
  let max = 0;
  let mask = 0;
  for (let i = 30; i >= 0; i -= 1) {
    mask |= 1 << i;
    const prefixes = new Set();
    for (const x of nums) prefixes.add(x & mask);
    const want = max | (1 << i);
    let found = false;
    for (const p of prefixes) {
      if (prefixes.has(p ^ want)) {
        found = true;
        break;
      }
    }
    if (found) max = want;
  }
  return max;
}

// 6. StreamChecker(words)：后缀查询（反序建 Trie）。
class StreamChecker {
  constructor(words) {
    this.root = {};
    this.buf = [];
    this.maxLen = 0;
    for (const w of words) {
      this.maxLen = Math.max(this.maxLen, w.length);
      let n = this.root;
      for (let i = w.length - 1; i >= 0; i -= 1) {
        const c = w[i];
        if (!n[c]) n[c] = {};
        n = n[c];
      }
      n.end = true;
    }
  }
  query(letter) {
    this.buf.push(letter);
    if (this.buf.length > this.maxLen) this.buf.shift();
    let n = this.root;
    for (let i = this.buf.length - 1; i >= 0; i -= 1) {
      const c = this.buf[i];
      if (!n[c]) return false;
      n = n[c];
      if (n.end) return true;
    }
    return false;
  }
}

// 7. MapSum：insert / sum(prefix)。
class MapSum {
  constructor() {
    this.m = new Map();
    this.root = { sum: 0, next: {} };
  }
  insert(key, val) {
    const delta = val - (this.m.get(key) || 0);
    this.m.set(key, val);
    let n = this.root;
    n.sum += delta;
    for (const c of key) {
      if (!n.next[c]) n.next[c] = { sum: 0, next: {} };
      n = n.next[c];
      n.sum += delta;
    }
  }
  sum(prefix) {
    let n = this.root;
    for (const c of prefix) {
      if (!n.next[c]) return 0;
      n = n.next[c];
    }
    return n.sum;
  }
}

// 8. countDistinctSubstring(s)：不同子串个数（后缀自动机简化：用 Set 仅适合短串）。
function countDistinctSubstring(s) {
  const seen = new Set();
  for (let i = 0; i < s.length; i += 1) {
    for (let j = i + 1; j <= s.length; j += 1) seen.add(s.slice(i, j));
  }
  return seen.size;
}

// 9. longestCommonPrefix(strs)：最长公共前缀。
function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  let p = strs[0];
  for (let i = 1; i < strs.length; i += 1) {
    while (!strs[i].startsWith(p)) p = p.slice(0, -1);
    if (!p) return '';
  }
  return p;
}

// 10. wordBreak(s, wordDict)：能否完全拆分。
function wordBreak(s, wordDict) {
  const set = new Set(wordDict);
  const n = s.length;
  const dp = Array(n + 1).fill(false);
  dp[0] = true;
  for (let i = 1; i <= n; i += 1) {
    for (let j = 0; j < i; j += 1) {
      if (dp[j] && set.has(s.slice(j, i))) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[n];
}

// 11. wordBreakII(s, wordDict)：所有拆分句子。
function wordBreakII(s, wordDict) {
  const set = new Set(wordDict);
  const memo = new Map();
  const dfs = (start) => {
    if (memo.has(start)) return memo.get(start);
    if (start === s.length) return [''];
    const res = [];
    for (let end = start + 1; end <= s.length; end += 1) {
      const w = s.slice(start, end);
      if (!set.has(w)) continue;
      const rest = dfs(end);
      for (const tail of rest) res.push(tail ? `${w} ${tail}` : w);
    }
    memo.set(start, res);
    return res;
  };
  return dfs(0);
}

// 12. palindromePairs(words)：可组成回文串的词对下标（暴力 + Trie 优化入口）。
function palindromePairs(words) {
  const idx = new Map(words.map((w, i) => [w, i]));
  const isPal = (t) => t === [...t].reverse().join('');
  const ans = [];
  for (let i = 0; i < words.length; i += 1) {
    const w = words[i];
    for (let j = 0; j <= w.length; j += 1) {
      const left = w.slice(0, j);
      const right = w.slice(j);
      const revL = [...left].reverse().join('');
      const revR = [...right].reverse().join('');
      if (isPal(left) && idx.has(revR) && idx.get(revR) !== i) ans.push([idx.get(revR), i]);
      if (j !== w.length && isPal(right) && idx.has(revL) && idx.get(revL) !== i) ans.push([i, idx.get(revL)]);
    }
  }
  return ans;
}

// 13. minimumLengthEncoding(words)：最短编码长度 # 结尾。
function minimumLengthEncoding(words) {
  const sorted = [...new Set(words)].sort((a, b) => b.length - a.length);
  const trie = {};
  let len = 0;
  for (const w of sorted) {
    let n = trie;
    let need = false;
    for (let i = w.length - 1; i >= 0; i -= 1) {
      const c = w[i];
      if (!n[c]) {
        n[c] = {};
        need = true;
      }
      n = n[c];
    }
    if (need) len += w.length + 1;
  }
  return len;
}

// 14. indexPairs(text, words)：文本中所有词出现区间。
function indexPairs(text, words) {
  const ans = [];
  for (const w of words) {
    let i = 0;
    while (i <= text.length - w.length) {
      const j = text.indexOf(w, i);
      if (j === -1) break;
      ans.push([j, j + w.length - 1]);
      i = j + 1;
    }
  }
  return ans.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

// 15. camelMatch(queries, pattern)：驼峰匹配。
function camelMatch(queries, pattern) {
  const match = (q) => {
    let j = 0;
    for (let i = 0; i < q.length; i += 1) {
      const c = q[i];
      if (c >= 'A' && c <= 'Z') {
        if (j >= pattern.length || c !== pattern[j]) return false;
        j += 1;
      } else if (j < pattern.length && c === pattern[j]) j += 1;
    }
    return j === pattern.length;
  };
  return queries.map(match);
}

// 16. boldWords(words, s)：被词覆盖区间合并加粗标记。
function boldWords(words, s) {
  const bold = Array(s.length).fill(false);
  for (const w of words) {
    let i = 0;
    while (i <= s.length - w.length) {
      const j = s.indexOf(w, i);
      if (j === -1) break;
      for (let k = j; k < j + w.length; k += 1) bold[k] = true;
      i = j + 1;
    }
  }
  let res = '';
  for (let i = 0; i < s.length; i += 1) {
    if (bold[i] && (i === 0 || !bold[i - 1])) res += '<b>';
    res += s[i];
    if (bold[i] && (i === s.length - 1 || !bold[i + 1])) res += '</b>';
  }
  return res;
}

// 17. magicDictionary：恰好改一字符能否得到词典词。
class MagicDictionary {
  constructor() {
    this.words = [];
  }
  buildDict(words) {
    this.words = words;
  }
  search(word) {
    for (const w of this.words) {
      if (w.length !== word.length) continue;
      let diff = 0;
      for (let i = 0; i < w.length; i += 1) if (w[i] !== word[i]) diff += 1;
      if (diff === 1) return true;
    }
    return false;
  }
}

// 18. removeSubfolders(paths)：去掉子文件夹路径。
function removeSubfolders(paths) {
  paths.sort();
  const ans = [];
  for (const p of paths) {
    if (!ans.length || !p.startsWith(`${ans[ans.length - 1]}/`)) ans.push(p);
  }
  return ans;
}

// 19. longestDupSubstring(s)：最长重复子串（二分 + Rabin-Karp）。
function longestDupSubstring(s) {
  const n = s.length;
  const mod = 2 ** 32;
  const base = 256;
  const check = (len) => {
    if (len === 0) return '';
    let h = 0;
    let pow = 1;
    for (let i = 0; i < len - 1; i += 1) pow = (pow * base) % mod;
    const seen = new Map();
    for (let i = 0; i < len; i += 1) h = (h * base + s.charCodeAt(i)) % mod;
    seen.set(h, [0]);
    for (let i = len; i < n; i += 1) {
      h = (h - (s.charCodeAt(i - len) * pow) % mod + mod) % mod;
      h = (h * base + s.charCodeAt(i)) % mod;
      const start = i - len + 1;
      if (seen.has(h)) {
        const sub = s.slice(start, i + 1);
        for (const st of seen.get(h)) {
          if (s.slice(st, st + len) === sub) return sub;
        }
      }
      if (!seen.has(h)) seen.set(h, []);
      seen.get(h).push(start);
    }
    return '';
  };
  let lo = 0;
  let hi = n;
  let best = '';
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const t = check(mid);
    if (t) {
      best = t;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return best;
}

// 20. searchMatrixWord(board, word)：网格搜词（DFS + Trie 可优化，此处 DFS）。
function searchMatrixWord(board, word) {
  const m = board.length;
  const n = board[0].length;
  const dfs = (i, j, k) => {
    if (k === word.length) return true;
    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== word[k]) return false;
    const t = board[i][j];
    board[i][j] = '#';
    const ok =
      dfs(i + 1, j, k + 1) ||
      dfs(i - 1, j, k + 1) ||
      dfs(i, j + 1, k + 1) ||
      dfs(i, j - 1, k + 1);
    board[i][j] = t;
    return ok;
  };
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) {
      if (dfs(i, j, 0)) return true;
    }
  }
  return false;
}

module.exports = {
  Trie,
  replaceWords,
  longestWord,
  suggestedProducts,
  findMaximumXOR,
  StreamChecker,
  MapSum,
  countDistinctSubstring,
  longestCommonPrefix,
  wordBreak,
  wordBreakII,
  palindromePairs,
  minimumLengthEncoding,
  indexPairs,
  camelMatch,
  boldWords,
  MagicDictionary,
  removeSubfolders,
  longestDupSubstring,
  searchMatrixWord,
};
