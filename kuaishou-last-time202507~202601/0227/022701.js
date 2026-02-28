/**
 * 022701 面试算法题（20 道）- 专题：模拟与实现
 * 日期：2026-02-27
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 螺旋矩阵 ====================
function spiralOrder(matrix) {
    if (!matrix.length) return [];
    const res = [];
    let t = 0, b = matrix.length - 1, l = 0, r = matrix[0].length - 1;
    while (t <= b && l <= r) {
        for (let j = l; j <= r; j++) res.push(matrix[t][j]);
        t++;
        for (let i = t; i <= b; i++) res.push(matrix[i][r]);
        r--;
        if (t <= b) for (let j = r; j >= l; j--) res.push(matrix[b][j]);
        b--;
        if (l <= r) for (let i = b; i >= t; i--) res.push(matrix[i][l]);
        l++;
    }
    return res;
}

// ==================== 2. 螺旋矩阵 II ====================
function generateMatrix(n) {
    const m = Array(n).fill(0).map(() => Array(n).fill(0));
    let t = 0, b = n - 1, l = 0, r = n - 1, v = 1;
    while (t <= b && l <= r) {
        for (let j = l; j <= r; j++) m[t][j] = v++;
        t++;
        for (let i = t; i <= b; i++) m[i][r] = v++;
        r--;
        if (t <= b) for (let j = r; j >= l; j--) m[b][j] = v++;
        b--;
        if (l <= r) for (let i = b; i >= t; i--) m[i][l] = v++;
        l++;
    }
    return m;
}

// ==================== 3. 旋转图像 ====================
function rotate(matrix) {
    const n = matrix.length;
    for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++)
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    for (let i = 0; i < n; i++) matrix[i].reverse();
}

// ==================== 4. 矩阵置零 ====================
function setZeroes(matrix) {
    const m = matrix.length, n = matrix[0].length;
    let col0 = false;
    for (let i = 0; i < m; i++) {
        if (matrix[i][0] === 0) col0 = true;
        for (let j = 1; j < n; j++)
            if (matrix[i][j] === 0) matrix[i][0] = matrix[0][j] = 0;
    }
    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 1; j--)
            if (matrix[i][0] === 0 || matrix[0][j] === 0) matrix[i][j] = 0;
        if (col0) matrix[i][0] = 0;
    }
}

// ==================== 5. 生命游戏 ====================
function gameOfLife(board) {
    const m = board.length, n = board[0].length;
    const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++) {
            let live = 0;
            for (const [di, dj] of dirs) {
                const ni = i + di, nj = j + dj;
                if (ni >= 0 && ni < m && nj >= 0 && nj < n && Math.abs(board[ni][nj]) === 1) live++;
            }
            if (board[i][j] === 1 && (live < 2 || live > 3)) board[i][j] = -1;
            if (board[i][j] === 0 && live === 3) board[i][j] = 2;
        }
    for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
            if (board[i][j] === -1) board[i][j] = 0;
            else if (board[i][j] === 2) board[i][j] = 1;
}

// ==================== 6. 字符串相加 ====================
function addStrings(num1, num2) {
    let i = num1.length - 1, j = num2.length - 1, carry = 0;
    const res = [];
    while (i >= 0 || j >= 0 || carry) {
        const a = i >= 0 ? +num1[i--] : 0, b = j >= 0 ? +num2[j--] : 0;
        const sum = a + b + carry;
        res.push(sum % 10);
        carry = (sum / 10) | 0;
    }
    return res.reverse().join('');
}

// ==================== 7. 字符串相减（大数减法） ====================
function subtractStrings(num1, num2) {
    if (num1.length < num2.length || (num1.length === num2.length && num1 < num2)) return '-' + subtractStrings(num2, num1);
    let i = num1.length - 1, j = num2.length - 1, carry = 0;
    const res = [];
    while (i >= 0 || j >= 0) {
        const a = +num1[i--] || 0, b = +num2[j--] || 0;
        let d = a - b - carry;
        if (d < 0) { d += 10; carry = 1; } else carry = 0;
        res.push(d);
    }
    while (res.length > 1 && res[res.length - 1] === 0) res.pop();
    return res.reverse().join('');
}

// ==================== 8. 复数乘法 ====================
function complexNumberMultiply(num1, num2) {
    const [a, b] = num1.slice(0, -1).split('+').map(Number);
    const [c, d] = num2.slice(0, -1).split('+').map(Number);
    return `${a * c - b * d}+${a * d + b * c}i`;
}

// ==================== 9. 整数转英文表示 ====================
const ONES = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine'];
const TENS = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
const TEEN = ['Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
function numberToWords(num) {
    if (num === 0) return 'Zero';
    function f(x) {
        if (x === 0) return '';
        if (x < 10) return ONES[x];
        if (x < 20) return TEEN[x - 10];
        if (x < 100) return (TENS[(x/10)|0] + ' ' + ONES[x%10]).trim();
        return (ONES[(x/100)|0] + ' Hundred ' + f(x%100)).trim();
    }
    const bil = (num / 1e9) | 0, mil = ((num % 1e9) / 1e6) | 0, thou = ((num % 1e6) / 1000) | 0, rest = num % 1000;
    const parts = [];
    if (bil) parts.push(f(bil) + ' Billion');
    if (mil) parts.push(f(mil) + ' Million');
    if (thou) parts.push(f(thou) + ' Thousand');
    if (rest) parts.push(f(rest));
    return parts.join(' ');
}

// ==================== 10. 基本计算器（含空格、+、-、括号） ====================
function calculate(s) {
    let sign = 1, num = 0, res = 0;
    const stack = [];
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (c >= '0' && c <= '9') num = num * 10 + (+c);
        else if (c === '+') { res += sign * num; num = 0; sign = 1; }
        else if (c === '-') { res += sign * num; num = 0; sign = -1; }
        else if (c === '(') { stack.push(res, sign); res = 0; sign = 1; }
        else if (c === ')') { res += sign * num; num = 0; res = stack.pop() * res + stack.pop(); }
    }
    return res + sign * num;
}

// ==================== 11. 提莫攻击 ====================
function findPoisonedDuration(timeSeries, duration) {
    if (!timeSeries.length) return 0;
    let total = duration;
    for (let i = 1; i < timeSeries.length; i++)
        total += Math.min(duration, timeSeries[i] - timeSeries[i - 1]);
    return total;
}

// ==================== 12. Z 字形变换 ====================
function convert(s, numRows) {
    if (numRows === 1) return s;
    const rows = Array(numRows).fill('');
    let r = 0, down = true;
    for (const c of s) {
        rows[r] += c;
        r += down ? 1 : -1;
        if (r === 0 || r === numRows - 1) down = !down;
    }
    return rows.join('');
}

// ==================== 13. 文本左右对齐 ====================
function fullJustify(words, maxWidth) {
    const res = [];
    let line = [], len = 0;
    for (const w of words) {
        if (len + line.length + w.length > maxWidth && line.length) {
            const spaces = maxWidth - len;
            const gaps = line.length - 1 || 1;
            const base = (spaces / gaps) | 0, extra = spaces % gaps;
            let s = '';
            for (let i = 0; i < line.length; i++) {
                s += line[i];
                if (i < line.length - 1) s += ' '.repeat(base + (i < extra ? 1 : 0));
            }
            res.push(s.length ? s : ' '.repeat(maxWidth));
            line = []; len = 0;
        }
        line.push(w); len += w.length;
    }
    if (line.length) res.push(line.join(' ') + ' '.repeat(maxWidth - len - (line.length - 1)));
    return res;
}

// ==================== 14. 简化路径 ====================
function simplifyPath(path) {
    const stack = [];
    for (const p of path.split('/')) {
        if (p === '..') stack.pop();
        else if (p && p !== '.') stack.push(p);
    }
    return '/' + stack.join('/');
}

// ==================== 15. 验证数独 ====================
function isValidSudoku(board) {
    const row = Array(9).fill(0).map(() => new Set());
    const col = Array(9).fill(0).map(() => new Set());
    const box = Array(9).fill(0).map(() => new Set());
    for (let i = 0; i < 9; i++)
        for (let j = 0; j < 9; j++) {
            const c = board[i][j];
            if (c === '.') continue;
            const b = 3 * ((i/3)|0) + ((j/3)|0);
            if (row[i].has(c) || col[j].has(c) || box[b].has(c)) return false;
            row[i].add(c); col[j].add(c); box[b].add(c);
        }
    return true;
}

// ==================== 16. 旋转链表 ====================
function rotateRight(head, k) {
    if (!head) return null;
    let n = 1, tail = head;
    while (tail.next) { tail = tail.next; n++; }
    tail.next = head;
    k = (n - k % n) % n;
    while (k--) tail = tail.next;
    const newHead = tail.next;
    tail.next = null;
    return newHead;
}

// ==================== 17. 插入区间 ====================
function insert(intervals, newInterval) {
    const res = [];
    let i = 0;
    while (i < intervals.length && intervals[i][1] < newInterval[0]) res.push(intervals[i++]);
    while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    res.push(newInterval);
    while (i < intervals.length) res.push(intervals[i++]);
    return res;
}

// ==================== 18. 轮转数组 ====================
function rotateArray(nums, k) {
    k = k % nums.length;
    const rev = (a, b) => { while (a < b) [nums[a], nums[b]] = [nums[b], nums[a]], a++, b--; };
    rev(0, nums.length - 1);
    rev(0, k - 1);
    rev(k, nums.length - 1);
}

// ==================== 19. 下一个排列 ====================
function nextPermutation(nums) {
    let i = nums.length - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) i--;
    if (i >= 0) {
        let j = nums.length - 1;
        while (nums[j] <= nums[i]) j--;
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }
    for (let l = i + 1, r = nums.length - 1; l < r; l++, r--) [nums[l], nums[r]] = [nums[r], nums[l]];
}

// ==================== 20. 有效数字 ====================
function isNumber(s) {
    s = s.trim();
    let seenE = false, seenDot = false, seenDigit = false;
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (c >= '0' && c <= '9') seenDigit = true;
        else if (c === 'e' || c === 'E') {
            if (seenE || !seenDigit) return false;
            seenE = true; seenDigit = false;
        } else if (c === '.') {
            if (seenDot || seenE) return false;
            seenDot = true;
        } else if (c === '+' || c === '-') {
            if (i > 0 && s[i - 1] !== 'e' && s[i - 1] !== 'E') return false;
        } else return false;
    }
    return seenDigit;
}

// ==================== 测试 ====================
function test022701() {
    const assert = (name, got, expect) => {
        const ok = JSON.stringify(got) === JSON.stringify(expect);
        console.log(ok ? `[OK] ${name}` : `[FAIL] ${name} got=${JSON.stringify(got)} expect=${JSON.stringify(expect)}`);
    };
    assert('1. spiralOrder', spiralOrder([[1,2,3],[4,5,6],[7,8,9]]), [1,2,3,6,9,8,7,4,5]);
    assert('2. generateMatrix(3)', generateMatrix(3), [[1,2,3],[8,9,4],[7,6,5]]);
    const m3 = [[1,2],[3,4]]; rotate(m3); assert('3. rotate', m3, [[3,1],[4,2]]);
    const m4 = [[1,1,1],[1,0,1],[1,1,1]]; setZeroes(m4); assert('4. setZeroes', m4, [[1,0,1],[0,0,0],[1,0,1]]);
    const b5 = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]; gameOfLife(b5); assert('5. gameOfLife', b5, [[0,0,0],[1,0,1],[0,1,1],[0,1,0]]);
    assert('6. addStrings', addStrings('11', '123'), '134');
    assert('7. subtractStrings', subtractStrings('100', '1'), '99');
    assert('8. complexNumberMultiply', complexNumberMultiply('1+1i', '1+1i'), '0+2i');
    assert('9. numberToWords', numberToWords(123), 'One Hundred Twenty Three');
    assert('10. calculate', calculate('1 + 1'), 2);
    assert('11. findPoisonedDuration', findPoisonedDuration([1, 4], 2), 4);
    assert('12. convert', convert('PAYPALISHIRING', 3), 'PAHNAPLSIIGYIR');
    assert('13. fullJustify', fullJustify(['This', 'is', 'an', 'example'], 16).length, 2);
    assert('14. simplifyPath', simplifyPath('/a/./b/../../c/'), '/c');
    const board = [['5','3','.','.','7','.','.','.','.'],['6','.','.','1','9','5','.','.','.'],['.','9','8','.','.','.','.','6','.'],['8','.','.','.','6','.','.','.','3'],['4','.','.','8','.','3','.','.','1'],['7','.','.','.','2','.','.','.','6'],['.','6','.','.','.','.','2','8','.'],['.','.','.','4','1','9','.','.','5'],['.','.','.','.','8','.','.','7','9']];
    assert('15. isValidSudoku', isValidSudoku(board), true);
    const head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));
    const r = rotateRight(head, 2);
    assert('16. rotateRight', r.val === 4 && r.next.val === 5 && r.next.next.val === 1, true);
    assert('17. insert', insert([[1,3],[6,9]], [2,5]), [[1,5],[6,9]]);
    const n18 = [1,2,3,4,5,6,7]; rotateArray(n18, 3); assert('18. rotateArray', n18, [5,6,7,1,2,3,4]);
    const n19 = [1,2,3]; nextPermutation(n19); assert('19. nextPermutation', n19, [1,3,2]);
    assert('20. isNumber', isNumber(' 0.1 '), true);
    console.log('022701 tests done.');
}
test022701();
