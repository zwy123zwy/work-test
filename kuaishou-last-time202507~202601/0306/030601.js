/**
 * 030601 面试算法题（20 道）- 专题：链表（React Fiber 链表结构）
 * 日期：2026-03-06
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. 两数相加（链表） ====================
function addTwoNumbers(l1, l2) {
    const dummy = new ListNode(0);
    let p = dummy, carry = 0;
    while (l1 || l2 || carry) {
        const s = (l1?.val || 0) + (l2?.val || 0) + carry;
        p.next = new ListNode(s % 10);
        carry = (s / 10) | 0;
        p = p.next; l1 = l1?.next; l2 = l2?.next;
    }
    return dummy.next;
}

// ==================== 2. 两两交换链表节点 ====================
function swapPairs(head) {
    const dummy = new ListNode(0, head);
    let p = dummy;
    while (p.next && p.next.next) {
        const a = p.next, b = p.next.next;
        p.next = b; a.next = b.next; b.next = a;
        p = a;
    }
    return dummy.next;
}

// ==================== 3. K 个一组翻转链表 ====================
function reverseKGroup(head, k) {
    const dummy = new ListNode(0, head);
    let prev = dummy;
    while (true) {
        let tail = prev;
        for (let i = 0; i < k; i++) { tail = tail.next; if (!tail) return dummy.next; }
        const next = tail.next;
        [prev.next, prev] = reverse(prev.next, tail);
        prev.next = next;
    }
}
function reverse(head, tail) {
    let prev = tail.next, p = head;
    while (prev !== tail) { const n = p.next; p.next = prev; prev = p; p = n; }
    return [tail, head];
}

// ==================== 4. 复制带随机指针的链表 ====================
function copyRandomList(head) {
    if (!head) return null;
    const map = new Map();
    let p = head;
    while (p) { map.set(p, new Node(p.val)); p = p.next; }
    p = head;
    while (p) {
        map.get(p).next = p.next ? map.get(p.next) : null;
        map.get(p).random = p.random ? map.get(p.random) : null;
        p = p.next;
    }
    return map.get(head);
}

// ==================== 5. 排序链表 ====================
function sortList(head) {
    if (!head || !head.next) return head;
    let slow = head, fast = head.next;
    while (fast?.next) { slow = slow.next; fast = fast.next.next; }
    const mid = slow.next; slow.next = null;
    return mergeList(sortList(head), sortList(mid));
}
function mergeList(a, b) {
    const dummy = new ListNode(0);
    let p = dummy;
    while (a && b) { p.next = a.val <= b.val ? (p = a, a = a.next) : (p = b, b = b.next); }
    p.next = a || b;
    return dummy.next;
}

// ==================== 6. 重排链表 ====================
function reorderList(head) {
    if (!head?.next) return;
    let slow = head, fast = head;
    while (fast?.next) { slow = slow.next; fast = fast.next?.next; }
    let second = slow.next; slow.next = null;
    let prev = null;
    while (second) { const n = second.next; second.next = prev; prev = second; second = n; }
    let p = head, q = prev;
    while (q) { const a = p.next, b = q.next; p.next = q; q.next = a; p = a; q = b; }
}

// ==================== 7. 相交链表 ====================
function getIntersectionNode(headA, headB) {
    let a = headA, b = headB;
    while (a !== b) { a = a ? a.next : headB; b = b ? b.next : headA; }
    return a;
}

// ==================== 8. 回文链表 ====================
function isPalindromeList(head) {
    let slow = head, fast = head;
    while (fast?.next) { slow = slow.next; fast = fast.next.next; }
    let prev = null;
    while (slow) { const n = slow.next; slow.next = prev; prev = slow; slow = n; }
    while (prev && head) {
        if (prev.val !== head.val) return false;
        prev = prev.next; head = head.next;
    }
    return true;
}

// ==================== 9. 扁平化多级双向链表 ====================
function flatten(head) {
    const st = [];
    let p = head;
    while (p) {
        if (p.child) {
            if (p.next) st.push(p.next);
            p.next = p.child; p.child.prev = p; p.child = null;
        }
        if (!p.next && st.length) { p.next = st.pop(); p.next.prev = p; }
        p = p.next;
    }
    return head;
}

// ==================== 10. 奇偶链表 ====================
function oddEvenList(head) {
    if (!head?.next) return head;
    let odd = head, even = head.next, evenHead = even;
    while (even?.next) {
        odd.next = even.next; odd = odd.next;
        even.next = odd.next; even = even.next;
    }
    odd.next = evenHead;
    return head;
}

// ==================== 11. 合并 K 个升序链表 ====================
function mergeKLists(lists) {
    const merge = (a, b) => {
        const dummy = new ListNode(0);
        let p = dummy;
        while (a && b) p.next = a.val <= b.val ? (p = a, a = a.next) : (p = b, b = b.next);
        p.next = a || b;
        return dummy.next;
    };
    if (!lists.length) return null;
    while (lists.length > 1) lists.push(merge(lists.shift(), lists.shift()));
    return lists[0];
}

// ==================== 12. 反转链表 II ====================
function reverseBetween(head, left, right) {
    const dummy = new ListNode(0, head);
    let prev = dummy;
    for (let i = 1; i < left; i++) prev = prev.next;
    let cur = prev.next;
    for (let i = 0; i < right - left; i++) {
        const n = cur.next;
        cur.next = n.next; n.next = prev.next; prev.next = n;
    }
    return dummy.next;
}

// ==================== 13. 删除排序链表中的重复元素 ====================
function deleteDuplicatesSimple(head) {
    let p = head;
    while (p?.next) {
        if (p.val === p.next.val) p.next = p.next.next;
        else p = p.next;
    }
    return head;
}

// ==================== 14. 分隔链表（按值） ====================
function partitionList(head, x) {
    const small = new ListNode(0), large = new ListNode(0);
    let ps = small, pl = large;
    while (head) {
        if (head.val < x) { ps.next = head; ps = ps.next; }
        else { pl.next = head; pl = pl.next; }
        head = head.next;
    }
    pl.next = null; ps.next = large.next;
    return small.next;
}

// ==================== 15. 链表求和 ====================
function addLists(l1, l2) {
    const rev = (h) => { let p = null; while (h) { const n = h.next; h.next = p; p = h; h = n; } return p; };
    l1 = rev(l1); l2 = rev(l2);
    const dummy = new ListNode(0);
    let p = dummy, carry = 0;
    while (l1 || l2 || carry) {
        const s = (l1?.val || 0) + (l2?.val || 0) + carry;
        p.next = new ListNode(s % 10);
        carry = (s / 10) | 0;
        p = p.next; l1 = l1?.next; l2 = l2?.next;
    }
    return rev(dummy.next);
}

// ==================== 16. 链表随机节点（蓄水池） ====================
function getRandom(head) {
    let res = 0, i = 0, p = head;
    while (p) {
        i++;
        if (Math.random() < 1 / i) res = p.val;
        p = p.next;
    }
    return res;
}

// ==================== 17. 扁平化嵌套列表迭代器 ====================
class NestedIterator {
    constructor(nestedList) {
        this.flat = [];
        const flatten = (list) => {
            for (const x of list)
                if (x.isInteger()) this.flat.push(x.getInteger());
                else flatten(x.getList());
        };
        flatten(nestedList);
        this.i = 0;
    }
    next() { return this.flat[this.i++]; }
    hasNext() { return this.i < this.flat.length; }
}

// ==================== 18. 设计链表 ====================
class MyLinkedList {
    constructor() { this.head = null; this.len = 0; }
    get(index) {
        if (index < 0 || index >= this.len) return -1;
        let p = this.head;
        for (let i = 0; i < index; i++) p = p.next;
        return p.val;
    }
    addAtHead(val) { this.head = new ListNode(val, this.head); this.len++; }
    addAtTail(val) {
        if (!this.head) { this.head = new ListNode(val); this.len++; return; }
        let p = this.head;
        while (p.next) p = p.next;
        p.next = new ListNode(val);
        this.len++;
    }
    addAtIndex(index, val) {
        if (index <= 0) { this.addAtHead(val); return; }
        if (index > this.len) return;
        let p = this.head;
        for (let i = 0; i < index - 1; i++) p = p.next;
        p.next = new ListNode(val, p.next);
        this.len++;
    }
    deleteAtIndex(index) {
        if (index < 0 || index >= this.len) return;
        if (index === 0) { this.head = this.head.next; this.len--; return; }
        let p = this.head;
        for (let i = 0; i < index - 1; i++) p = p.next;
        p.next = p.next.next;
        this.len--;
    }
}

// ==================== 19. 删除链表中的节点（只给该节点） ====================
function deleteNode(node) {
    node.val = node.next.val;
    node.next = node.next.next;
}

// ==================== 20. 合并两个有序链表 ====================
function mergeTwoLists(l1, l2) {
    const dummy = new ListNode(0);
    let p = dummy;
    while (l1 && l2) {
        if (l1.val <= l2.val) { p.next = l1; l1 = l1.next; }
        else { p.next = l2; l2 = l2.next; }
        p = p.next;
    }
    p.next = l1 || l2;
    return dummy.next;
}

// ==================== 测试 ====================
function test030601() {
    const assert = (n, a, e) => console.log(JSON.stringify(a) === JSON.stringify(e) ? `[OK] ${n}` : `[FAIL] ${n}`);
    const toList = arr => arr.reduceRight((next, v) => new ListNode(v, next), null);
    assert('1', addTwoNumbers(toList([2,4,3]), toList([5,6,4]))?.val, 7);
    assert('2', swapPairs(toList([1,2,3,4]))?.val, 2);
    const c = toList([8, 4, 5]);
    const a = new ListNode(4, new ListNode(1, c));
    const b = new ListNode(5, new ListNode(6, new ListNode(1, c)));
    assert('7', getIntersectionNode(a, b)?.val, 8);
    assert('8', isPalindromeList(toList([1,2,2,1])), true);
    assert('10', oddEvenList(toList([1,2,3,4,5]))?.val, 1);
    assert('13', deleteDuplicatesSimple(toList([1,1,2]))?.next?.val, 2);
    assert('20', mergeTwoLists(toList([1,2,4]), toList([1,3,4]))?.val, 1);
    console.log('030601 tests done.');
}
test030601();
