// node
class node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

// 反转链表
function reverseList(head) {
    let prev = null;
    let curr = head;

    while (curr !== null) {
        let nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}

// 两两替换链表中的节点
function swapPairs(head) {
    let dummy = new node(0);
    dummy.next = head;
    let prev = dummy;

    while (head !== null && head.next !== null) {
        let firstNode = head;
        let secondNode = head.next;

        // 交换
        prev.next = secondNode;
        firstNode.next = secondNode.next;
        secondNode.next = firstNode;

        // 更新指针
        prev = firstNode;
        head = firstNode.next;
    }
    return dummy.next;
}

// 链表相交
function getIntersectionNode(headA, headB) {
    let pA = headA;
    let pB = headB;

    while (pA !== pB) {
        pA = pA === null ? headB : pA.next;
        pB = pB === null ? headA : pB.next;
    }
    return pA;
}

function cloneDeep(value) {
    const map = new Map();

    function _cloneDeep(value) {
        const isObject = typeof value === "object" && value !== null;

        if (!isObject) return value;

        if (map.has(value)) {
            return map.get(value);
        }

        const clone = Array.isArray(value) ? [] : {};
        for (const [key, v] of value.entries()) {
            clone[key] = _cloneDeep(v);
        }
        map.set(value, clone);
        return clone;
    }

    return _cloneDeep(value);
}

function query(list) {
    this.list = list;
    const api = {
        where(predicate) {
            this.list = this.list.filter(predicate);
            return this;
        },
        sortBy(key) {
            this.list = this.list.sort((a, b) => (a[key] > b[key] ? 1 : -1));
            return this;
        },
        groupBy(key) {
            const grouped = {};
            this.list.forEach(item => {
                const groupKey = item[key];
                if (!grouped[groupKey]) {
                    grouped[groupKey] = [];
                }
                grouped[groupKey].push(item);
            });
            this.list = Object.values(grouped);
            return this;
        },
        execute() {
            return this.list;
        }
    };
    return api; 
}

const result = query(list)
    .where(item => item.age > 18)
    .sortBy('id')
    .groupBy('name')
    .execute();
console.log(result);