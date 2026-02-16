/**
 * 021301 面试算法题（20 道）- 专题：链表
 * 日期：2026-02-13
 * 规则：仅题干、输入输出与约束；个人完成后再补充解答与测试用例。
 */

class ListNode {
    constructor(val, next = null) { this.val = val; this.next = next; }
}
class Node {
    constructor(val, next = null, random = null) { this.val = val; this.next = next; this.random = random; this.prev = null; this.child = null; }
}
class TreeNode {
    constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}

// ==================== 1. 反转链表 ====================
// 题干：单链表头 head，反转链表，返回新头。
// 输入：head: ListNode | null
// 输出：ListNode | null
// 约束：迭代 O(n)，O(1) 空间

function reverseList(head) {
    let prev = null;
    while (head) { const n = head.next; head.next = prev; prev = head; head = n; }
    return prev;
}

// ==================== 2. 反转链表 II ====================
// 题干：单链表 head，反转从位置 left 到 right 的节点（1-indexed），返回头。
// 输入：head: ListNode | null, left: number, right: number
// 输出：ListNode | null
// 约束：一趟扫描

function reverseBetween(head, left, right) {
    const dummy = new ListNode(0, head);
    let pre = dummy;
    for (let i = 1; i < left; i++) pre = pre.next;
    let cur = pre.next;
    for (let i = 0; i < right - left; i++) {
        const n = cur.next;
        cur.next = n.next;
        n.next = pre.next;
        pre.next = n;
    }
    return dummy.next;
}

// ==================== 3. 合并两个有序链表 ====================
// 题干：两个升序链表 head1、head2，合并为一个升序链表并返回头。
// 输入：head1: ListNode | null, head2: ListNode | null
// 输出：ListNode | null
// 约束：O(m+n) 时间，O(1) 空间（递归栈除外）

function mergeTwoLists(l1, l2) {
    const dummy = new ListNode(0);
    let p = dummy;
    while (l1 && l2) {
        if (l1.val < l2.val) { p.next = l1; l1 = l1.next; } else { p.next = l2; l2 = l2.next; }
        p = p.next;
    }
    p.next = l1 || l2;
    return dummy.next;
}

// ==================== 4. 合并 K 个升序链表 ====================
// 题干：数组 lists 中每个元素是升序链表头，合并所有链表为一个升序链表并返回头。
// 输入：lists: (ListNode | null)[]
// 输出：ListNode | null
// 约束：可优先队列或分治，O(N log k) N 为总节点数 k 为链表数

function mergeKLists(lists) {
    const merge = (a, b) => {
        const d = new ListNode(0); let p = d;
        while (a && b) { if (a.val < b.val) { p.next = a; a = a.next; } else { p.next = b; b = b.next; } p = p.next; }
        p.next = a || b; return d.next;
    };
    const mergeRange = (lo, hi) => {
        if (lo > hi) return null;
        if (lo === hi) return lists[lo];
        const mid = (lo + hi) >> 1;
        return merge(mergeRange(lo, mid), mergeRange(mid + 1, hi));
    };
    if (!lists.length) return null;
    return mergeRange(0, lists.length - 1);
}

// ==================== 5. 删除链表倒数第 N 个节点 ====================
// 题干：单链表 head 和 n，删除倒数第 n 个节点，返回新头。保证 n 有效。
// 输入：head: ListNode | null, n: number
// 输出：ListNode | null
// 约束：一趟扫描，双指针

function removeNthFromEnd(head, n) {
    const dummy = new ListNode(0, head);
    let fast = dummy, slow = dummy;
    for (let i = 0; i <= n; i++) fast = fast.next;
    while (fast) { fast = fast.next; slow = slow.next; }
    slow.next = slow.next.next;
    return dummy.next;
}

// ==================== 6. 删除排序链表中的重复元素 ====================
// 题干：升序链表 head，删除所有重复节点使每个值只出现一次，返回头。
// 输入：head: ListNode | null
// 输出：ListNode | null
// 约束：O(n)

function deleteDuplicates(head) {
    let cur = head;
    while (cur?.next) {
        if (cur.val === cur.next.val) cur.next = cur.next.next;
        else cur = cur.next;
    }
    return head;
}

// ==================== 7. 删除排序链表中的重复元素 II ====================
// 题干：升序链表 head，删除所有含重复值的节点（只保留出现一次的），返回头。
// 输入：head: ListNode | null
// 输出：ListNode | null
// 约束：O(n)

function deleteDuplicatesII(head) {
    const dummy = new ListNode(0, head);
    let pre = dummy;
    while (pre.next) {
        let cur = pre.next;
        while (cur?.next && cur.val === cur.next.val) cur = cur.next;
        if (pre.next !== cur) pre.next = cur.next;
        else pre = pre.next;
    }
    return dummy.next;
}

// ==================== 8. 环形链表 ====================
// 题干：判断链表是否有环。
// 输入：head: ListNode | null
// 输出：boolean
// 约束：O(1) 空间，快慢指针

function hasCycle(head) {
    let slow = head, fast = head;
    while (fast?.next) {
        slow = slow.next; fast = fast.next.next;
        if (slow === fast) return true;
    }
    return false;
}

// ==================== 9. 环形链表 II ====================
// 题干：若存在环，返回环的入口节点；否则返回 null。O(1) 空间。
// 输入：head: ListNode | null
// 输出：ListNode | null
// 约束：快慢指针找相遇点再找入口

function detectCycle(head) {
    let slow = head, fast = head;
    while (fast?.next) {
        slow = slow.next; fast = fast.next.next;
        if (slow === fast) {
            let p = head;
            while (p !== slow) { p = p.next; slow = slow.next; }
            return p;
        }
    }
    return null;
}

// ==================== 10. 相交链表 ====================
// 题干：两个单链表 headA、headB，找出并返回相交节点；不相交返回 null。
// 输入：headA: ListNode | null, headB: ListNode | null
// 输出：ListNode | null
// 约束：O(m+n) 时间，O(1) 空间（无环）

function getIntersectionNode(headA, headB) {
    let a = headA, b = headB;
    while (a !== b) {
        a = a ? a.next : headB;
        b = b ? b.next : headA;
    }
    return a;
}

// ==================== 11. 回文链表 ====================
// 题干：判断单链表是否为回文结构。
// 输入：head: ListNode | null
// 输出：boolean
// 约束：O(n) 时间 O(1) 空间（可修改链表：找中点、反转后半、比较）

function isPalindrome(head) {
    const rev = (h) => { let p = null; while (h) { const n = h.next; h.next = p; p = h; h = n; } return p; };
    let slow = head, fast = head;
    while (fast?.next) { slow = slow.next; fast = fast.next.next; }
    let p = head, q = rev(slow);
    while (q) { if (p.val !== q.val) return false; p = p.next; q = q.next; }
    return true;
}

// ==================== 12. 重排链表 ====================
// 题干：单链表 L0→L1→…→Ln-1→Ln，重排为 L0→Ln→L1→Ln-1→…。不能修改节点值，只能改指针。
// 输入：head: ListNode | null
// 输出：无（原地修改）
// 约束：O(n) 时间 O(1) 空间

function reorderList(head) {
    if (!head?.next) return;
    let slow = head, fast = head;
    while (fast?.next) { slow = slow.next; fast = fast.next.next; }
    const rev = (h) => { let p = null; while (h) { const n = h.next; h.next = p; p = h; h = n; } return p; };
    let l1 = head, l2 = rev(slow.next);
    slow.next = null;
    while (l2) { const n1 = l1.next, n2 = l2.next; l1.next = l2; l2.next = n1; l1 = n1; l2 = n2; }
}

// ==================== 13. 排序链表 ====================
// 题干：单链表头 head，按升序排序并返回头。
// 输入：head: ListNode | null
// 输出：ListNode | null
// 约束：O(n log n) 时间 O(1) 空间（归并排序，找中点+合并）

function sortList(head) {
    if (!head?.next) return head;
    let slow = head, fast = head;
    while (fast?.next?.next) { slow = slow.next; fast = fast.next.next; }
    const mid = slow.next; slow.next = null;
    return mergeTwoLists(sortList(head), sortList(mid));
}

// ==================== 14. 奇偶链表 ====================
// 题干：单链表，将奇数位置节点放一起、偶数位置放一起，保持相对顺序，返回新头。
// 输入：head: ListNode | null
// 输出：ListNode | null
// 约束：O(n) 时间 O(1) 空间

function oddEvenList(head) {
    if (!head?.next) return head;
    const odd = head, even = head.next;
    let o = odd, e = even;
    while (e?.next) {
        o.next = e.next; o = o.next;
        e.next = o.next; e = e.next;
    }
    o.next = even;
    return odd;
}

// ==================== 15. 两数相加 ====================
// 题干：两个非空链表表示非负整数（逆序存储），求两数之和并以相同形式返回链表头。
// 输入：l1: ListNode | null, l2: ListNode | null
// 输出：ListNode | null
// 约束：模拟竖式加法

function addTwoNumbers(l1, l2) {
    const dummy = new ListNode(0);
    let p = dummy, carry = 0;
    while (l1 || l2 || carry) {
        const s = (l1?.val ?? 0) + (l2?.val ?? 0) + carry;
        p.next = new ListNode(s % 10);
        carry = (s / 10) | 0;
        p = p.next; l1 = l1?.next; l2 = l2?.next;
    }
    return dummy.next;
}

// ==================== 16. 两数相加 II ====================
// 题干：两个非空链表表示非负整数（高位在前），求两数之和并以相同形式返回。不能反转链表。
// 输入：l1: ListNode | null, l2: ListNode | null
// 输出：ListNode | null
// 约束：可用栈或先求长度再对齐相加

function addTwoNumbersII(l1, l2) {
    const toArr = (h) => { const a = []; while (h) { a.push(h.val); h = h.next; } return a; };
    const a = toArr(l1), b = toArr(l2);
    let carry = 0; const res = [];
    for (let i = a.length - 1, j = b.length - 1; i >= 0 || j >= 0 || carry; i--, j--) {
        const s = (a[i] ?? 0) + (b[j] ?? 0) + carry;
        res.unshift(s % 10); carry = (s / 10) | 0;
    }
    const dummy = new ListNode(0); let p = dummy;
    for (const x of res) { p.next = new ListNode(x); p = p.next; }
    return dummy.next;
}

// ==================== 17. 复制带随机指针的链表 ====================
// 题干：链表节点含 val、next、random，深拷贝整张链表并返回新头。
// 输入：head: Node | null（Node 含 val, next, random）
// 输出：Node | null
// 约束：O(n) 时间，可 O(n) 空间（哈希）或 O(1) 空间（穿插复制）

function copyRandomList(head) {
    if (!head) return null;
    let cur = head;
    while (cur) {
        const n = new Node(cur.val, cur.next, null);
        cur.next = n; cur = n.next;
    }
    cur = head;
    while (cur) {
        if (cur.random) cur.next.random = cur.random.next;
        cur = cur.next.next;
    }
    const dummy = new Node(0, null, null);
    let p = dummy; cur = head;
    while (cur) { p.next = cur.next; p = p.next; cur.next = cur.next.next; cur = cur.next; }
    return dummy.next;
}

// ==================== 18. 扁平化多级双向链表 ====================
// 题干：多级双向链表（含 child 指针），按深度优先扁平化为一层，返回头。
// 输入：head: Node | null（val, prev, next, child）
// 输出：Node | null
// 约束：递归或迭代

function flatten(head) {
    const flat = (h) => {
        let cur = h, tail = h;
        while (cur) {
            const n = cur.next;
            if (cur.child) {
                const [ch, ct] = flat(cur.child);
                cur.child = null;
                cur.next = ch; ch.prev = cur;
                ct.next = n; if (n) n.prev = ct;
                tail = ct;
            } else tail = cur;
            cur = n;
        }
        return [h, tail];
    };
    return head ? flat(head)[0] : null;
}

// ==================== 19. 旋转链表 ====================
// 题干：单链表 head 和 k，将链表向右旋转 k 步（尾变头）。
// 输入：head: ListNode | null, k: number
// 输出：ListNode | null
// 约束：先成环再断链，或先求长度再取模

function rotateRight(head, k) {
    if (!head?.next || k === 0) return head;
    let len = 1, tail = head;
    while (tail.next) { tail = tail.next; len++; }
    k %= len; if (k === 0) return head;
    tail.next = head;
    for (let i = 0; i < len - k; i++) tail = tail.next;
    head = tail.next; tail.next = null;
    return head;
}

// ==================== 20. 分隔链表 ====================
// 题干：单链表 head 和 x，使所有小于 x 的节点在大于等于 x 的节点之前，保持相对顺序。
// 输入：head: ListNode | null, x: number
// 输出：ListNode | null
// 约束：O(n) 时间 O(1) 空间，两链表再拼接

function partition(head, x) {
    const small = new ListNode(0), large = new ListNode(0);
    let ps = small, pl = large;
    while (head) {
        if (head.val < x) { ps.next = head; ps = ps.next; } else { pl.next = head; pl = pl.next; }
        head = head.next;
    }
    pl.next = null; ps.next = large.next;
    return small.next;
}
