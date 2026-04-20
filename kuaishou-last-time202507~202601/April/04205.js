// 04205 - 字符串专题（含参考答案）

// 问题1：实现字符串反转
function solution_04205_1(str) {
  return str.split('').reverse().join('');
}

// 问题2：实现回文判断
function solution_04205_2(str) {
  const s = str.replace(/\W/g, '').toLowerCase();
  return s === solution_04205_1(s);
}

// 问题3：实现最长公共前缀
function solution_04205_3(arr) {
  if (!arr.length) return '';
  let prefix = arr[0];
  for (let i = 1; i < arr.length; i += 1) {
    while (!arr[i].startsWith(prefix) && prefix) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

// 问题4：实现千分位格式化
function solution_04205_4(num) {
  return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 问题5：实现驼峰转短横线
function solution_04205_5(str) {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

// 问题6：实现短横线转驼峰
function solution_04205_6(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

// 问题7：实现模板渲染 renderTemplate
function solution_04205_7(tpl, data) {
  return tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => (key in data ? data[key] : ''));
}

// 问题8：实现简单 Markdown 转 HTML
function solution_04205_8(md) {
  return md
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

// 问题9：实现去除多余空格 normalizeSpace
function solution_04205_9(str) {
  return str.trim().replace(/\s+/g, ' ');
}

// 问题10：实现字符串截断 truncate
function solution_04205_10(str, n) {
  return str.length > n ? `${str.slice(0, n)}...` : str;
}

// 问题11：实现首字母大写 capitalize
function solution_04205_11(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : str;
}

// 问题12：实现标题化 titleCase
function solution_04205_12(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(solution_04205_11)
    .join(' ');
}

// 问题13：实现字符串出现次数统计 charCount
function solution_04205_13(str) {
  return [...str].reduce((acc, ch) => {
    acc[ch] = (acc[ch] || 0) + 1;
    return acc;
  }, {});
}

// 问题14：实现字符串匹配计数 matchCount
function solution_04205_14(str, sub) {
  if (!sub) return 0;
  let count = 0;
  let idx = 0;
  while ((idx = str.indexOf(sub, idx)) !== -1) {
    count += 1;
    idx += sub.length;
  }
  return count;
}

// 问题15：实现 KMP 子串查找
function solution_04205_15(text, pattern) {
  if (!pattern) return 0;
  const lps = Array(pattern.length).fill(0);
  for (let i = 1, len = 0; i < pattern.length; ) {
    if (pattern[i] === pattern[len]) lps[i++] = ++len;
    else if (len) len = lps[len - 1];
    else lps[i++] = 0;
  }
  for (let i = 0, j = 0; i < text.length; ) {
    if (text[i] === pattern[j]) {
      i += 1;
      j += 1;
      if (j === pattern.length) return i - j;
    } else if (j) j = lps[j - 1];
    else i += 1;
  }
  return -1;
}

// 问题16：实现字符串编辑距离
function solution_04205_16(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) dp[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) dp[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1];
      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// 问题17：实现 Base64 编解码封装
function solution_04205_17_encode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}
function solution_04205_17_decode(str) {
  return decodeURIComponent(escape(atob(str)));
}

// 问题18：实现 HTML 转义 escapeHtml
function solution_04205_18(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return str.replace(/[&<>"']/g, (m) => map[m]);
}

// 问题19：实现 HTML 反转义 unescapeHtml
function solution_04205_19(str) {
  const map = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
  return str.replace(/&(amp|lt|gt|quot)#?39?;|&#39;/g, (m) => map[m] || m);
}

// 问题20：实现版本号比较 compareVersion
function solution_04205_20(v1, v2) {
  const a = v1.split('.').map(Number);
  const b = v2.split('.').map(Number);
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i += 1) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}
