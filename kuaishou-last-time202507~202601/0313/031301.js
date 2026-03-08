/**
 * 031301 面试算法题（20 道）- 专题：设计题（Node/React 模式）
 * 日期：2026-03-13
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }
class TreeNode { constructor(val, left = null, right = null) { this.val = val; this.left = left; this.right = right; } }

// ==================== 1. LRU 缓存 ====================
class LRUCache {
    constructor(capacity) { this.cap = capacity; this.cache = new Map(); }
    get(key) {
        if (!this.cache.has(key)) return -1;
        const v = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, v);
        return v;
    }
    put(key, value) {
        if (this.cache.has(key)) this.cache.delete(key);
        this.cache.set(key, value);
        if (this.cache.size > this.cap) this.cache.delete(this.cache.keys().next().value);
    }
}

// ==================== 2. LFU 缓存 ====================
class LFUCache {
    constructor(capacity) {
        this.cap = capacity;
        this.minFreq = 0;
        this.kv = new Map();
        this.kf = new Map();
        this.fk = new Map();
    }
    get(key) {
        if (!this.kv.has(key)) return -1;
        this.update(key);
        return this.kv.get(key);
    }
    put(key, value) {
        if (this.cap === 0) return;
        if (this.kv.has(key)) { this.kv.set(key, value); this.update(key); return; }
        if (this.kv.size >= this.cap) {
            const dels = this.fk.get(this.minFreq);
            const k = dels.keys().next().value;
            dels.delete(k);
            if (!dels.size) this.fk.delete(this.minFreq);
            this.kv.delete(k);
            this.kf.delete(k);
        }
        this.kv.set(key, value);
        this.kf.set(key, 1);
        this.minFreq = 1;
        if (!this.fk.has(1)) this.fk.set(1, new Map());
        this.fk.get(1).set(key, true);
    }
    update(key) {
        const f = this.kf.get(key);
        this.fk.get(f).delete(key);
        if (!this.fk.get(f).size) { this.fk.delete(f); if (this.minFreq === f) this.minFreq++; }
        const nf = f + 1;
        this.kf.set(key, nf);
        if (!this.fk.has(nf)) this.fk.set(nf, new Map());
        this.fk.get(nf).set(key, true);
    }
}

// ==================== 3. 设计哈希集合 ====================
class MyHashSet {
    constructor() { this.buckets = Array(1000).fill(null).map(() => []); }
    hash(k) { return k % 1000; }
    add(key) {
        const h = this.hash(key);
        if (!this.buckets[h].includes(key)) this.buckets[h].push(key);
    }
    remove(key) {
        const h = this.hash(key);
        const i = this.buckets[h].indexOf(key);
        if (i >= 0) this.buckets[h].splice(i, 1);
    }
    contains(key) { return this.buckets[this.hash(key)].includes(key); }
}

// ==================== 4. 设计哈希映射 ====================
class MyHashMap {
    constructor() { this.buckets = Array(1000).fill(null).map(() => []); }
    hash(k) { return k % 1000; }
    put(key, value) {
        const h = this.hash(key);
        const pair = this.buckets[h].find(p => p[0] === key);
        if (pair) pair[1] = value;
        else this.buckets[h].push([key, value]);
    }
    get(key) {
        const pair = this.buckets[this.hash(key)].find(p => p[0] === key);
        return pair ? pair[1] : -1;
    }
    remove(key) {
        const h = this.hash(key);
        const i = this.buckets[h].findIndex(p => p[0] === key);
        if (i >= 0) this.buckets[h].splice(i, 1);
    }
}

// ==================== 5. 设计跳表 ====================
class Skiplist {
    constructor() { this.arr = []; }
    search(target) { return this.arr.includes(target); }
    add(num) {
        const i = this.arr.findIndex(x => x >= num);
        this.arr.splice(i < 0 ? this.arr.length : i, 0, num);
    }
    erase(num) {
        const i = this.arr.indexOf(num);
        if (i < 0) return false;
        this.arr.splice(i, 1);
        return true;
    }
}

// ==================== 6. 最小栈 ====================
class MinStack {
    constructor() { this.s = []; this.m = []; }
    push(x) { this.s.push(x); this.m.push(this.m.length ? Math.min(this.m[this.m.length - 1], x) : x); }
    pop() { this.s.pop(); this.m.pop(); }
    top() { return this.s[this.s.length - 1]; }
    getMin() { return this.m[this.m.length - 1]; }
}

// ==================== 7. 设计链表 ====================
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
        if (!this.head) return this.addAtHead(val);
        let p = this.head;
        while (p.next) p = p.next;
        p.next = new ListNode(val);
        this.len++;
    }
    addAtIndex(index, val) {
        if (index <= 0) return this.addAtHead(val);
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
        p.next = p.next?.next || null;
        this.len--;
    }
}

// ==================== 8. 设计循环队列 ====================
class MyCircularQueue {
    constructor(k) { this.q = []; this.cap = k; }
    enQueue(v) { if (this.isFull()) return false; this.q.push(v); return true; }
    deQueue() { if (this.isEmpty()) return false; this.q.shift(); return true; }
    Front() { return this.isEmpty() ? -1 : this.q[0]; }
    Rear() { return this.isEmpty() ? -1 : this.q[this.q.length - 1]; }
    isEmpty() { return !this.q.length; }
    isFull() { return this.q.length >= this.cap; }
}

// ==================== 9. 设计前中后队列 ====================
class FrontMiddleBackQueue {
    constructor() { this.q = []; }
    pushFront(val) { this.q.unshift(val); }
    pushMiddle(val) { this.q.splice(this.q.length >> 1, 0, val); }
    pushBack(val) { this.q.push(val); }
    popFront() { return this.q.length ? this.q.shift() : -1; }
    popMiddle() { return this.q.length ? this.q.splice((this.q.length - 1) >> 1, 1)[0] : -1; }
    popBack() { return this.q.length ? this.q.pop() : -1; }
}

// ==================== 10. 设计地铁系统 ====================
class UndergroundSystem {
    constructor() { this.checkIn = new Map(); this.trips = new Map(); }
    checkIn(id, stationName, t) { this.checkIn.set(id, [stationName, t]); }
    checkOut(id, stationName, t) {
        const [start, t0] = this.checkIn.get(id);
        const key = start + ',' + stationName;
        const [sum, cnt] = this.trips.get(key) || [0, 0];
        this.trips.set(key, [sum + t - t0, cnt + 1]);
        this.checkIn.delete(id);
    }
    getAverageTime(startStation, endStation) {
        const [sum, cnt] = this.trips.get(startStation + ',' + endStation) || [0, 0];
        return cnt ? sum / cnt : 0;
    }
}

// ==================== 11. 时间基于键值存储 ====================
class TimeMap {
    constructor() { this.map = new Map(); }
    set(key, value, timestamp) {
        if (!this.map.has(key)) this.map.set(key, []);
        this.map.get(key).push([timestamp, value]);
    }
    get(key, timestamp) {
        if (!this.map.has(key)) return '';
        const arr = this.map.get(key);
        let lo = 0, hi = arr.length - 1, res = '';
        while (lo <= hi) {
            const mid = (lo + hi) >>> 1;
            if (arr[mid][0] <= timestamp) { res = arr[mid][1]; lo = mid + 1; }
            else hi = mid - 1;
        }
        return res;
    }
}

// ==================== 12. 设计推特 ====================
class Twitter {
    constructor() { this.users = new Map(); this.time = 0; }
    postTweet(userId, tweetId) {
        if (!this.users.has(userId)) this.users.set(userId, { tweets: [], follow: new Set() });
        this.users.get(userId).tweets.push([this.time++, tweetId]);
    }
    getNewsFeed(userId) {
        if (!this.users.has(userId)) return [];
        const u = this.users.get(userId);
        const ids = [userId, ...u.follow];
        const all = ids.flatMap(id => (this.users.get(id)?.tweets || []).slice(-10));
        return all.sort((a, b) => b[0] - a[0]).slice(0, 10).map(([, id]) => id);
    }
    follow(followerId, followeeId) {
        if (!this.users.has(followerId)) this.users.set(followerId, { tweets: [], follow: new Set() });
        if (followerId !== followeeId) this.users.get(followerId).follow.add(followeeId);
    }
    unfollow(followerId, followeeId) { this.users.get(followerId)?.follow.delete(followeeId); }
}

// ==================== 13. 设计浏览器历史 ====================
class BrowserHistory {
    constructor(homepage) { this.h = [homepage]; this.cur = 0; }
    visit(url) { this.h = this.h.slice(0, this.cur + 1); this.h.push(url); this.cur = this.h.length - 1; }
    back(steps) { this.cur = Math.max(0, this.cur - steps); return this.h[this.cur]; }
    forward(steps) { this.cur = Math.min(this.h.length - 1, this.cur + steps); return this.h[this.cur]; }
}

// ==================== 14. 设计停车系统 ====================
class ParkingSystem {
    constructor(big, medium, small) { this.slots = [0, big, medium, small]; }
    addCar(carType) {
        if (this.slots[carType] <= 0) return false;
        this.slots[carType]--;
        return true;
    }
}

// ==================== 15. 设计有序流 ====================
class OrderedStream {
    constructor(n) { this.arr = Array(n).fill(null); this.ptr = 0; }
    insert(idKey, value) {
        this.arr[idKey - 1] = value;
        const res = [];
        while (this.ptr < this.arr.length && this.arr[this.ptr]) res.push(this.arr[this.ptr++]);
        return res;
    }
}

// ==================== 16. 设计缓存系统 ====================
class CacheNode {
    constructor(key, val) { this.key = key; this.val = val; this.prev = null; this.next = null; }
}
class LRUCache2 {
    constructor(capacity) {
        this.cap = capacity;
        this.map = new Map();
        this.head = new CacheNode(0, 0);
        this.tail = new CacheNode(0, 0);
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    add(node) {
        node.next = this.head.next;
        node.prev = this.head;
        this.head.next.prev = node;
        this.head.next = node;
    }
    remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
    get(key) {
        if (!this.map.has(key)) return -1;
        const node = this.map.get(key);
        this.remove(node);
        this.add(node);
        return node.val;
    }
    put(key, value) {
        if (this.map.has(key)) this.remove(this.map.get(key));
        const node = new CacheNode(key, value);
        this.map.set(key, node);
        this.add(node);
        if (this.map.size > this.cap) {
            const lru = this.tail.prev;
            this.remove(lru);
            this.map.delete(lru.key);
        }
    }
}

// ==================== 17. 设计有限阻塞队列 ====================
class BoundedBlockingQueue {
    constructor(capacity) { this.cap = capacity; this.q = []; }
    async enqueue(element) { while (this.q.length >= this.cap) await new Promise(r => setTimeout(r, 0)); this.q.push(element); }
    async dequeue() { while (!this.q.length) await new Promise(r => setTimeout(r, 0)); return this.q.shift(); }
    size() { return this.q.length; }
}

// ==================== 18. 设计食物评分系统 ====================
class FoodRatings {
    constructor(foods, cuisines, ratings) {
        this.fc = new Map();
        this.fr = new Map();
        this.cr = new Map();
        for (let i = 0; i < foods.length; i++) {
            this.fc.set(foods[i], cuisines[i]);
            this.fr.set(foods[i], ratings[i]);
            const k = cuisines[i];
            if (!this.cr.has(k)) this.cr.set(k, []);
            this.cr.get(k).push([-ratings[i], foods[i]]);
        }
        for (const arr of this.cr.values()) arr.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1].localeCompare(b[1]));
    }
    changeRating(food, newRating) {
        const c = this.fc.get(food);
        this.fr.set(food, newRating);
        const arr = this.cr.get(c);
        const i = arr.findIndex(([, f]) => f === food);
        arr[i] = [-newRating, food];
        arr.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1].localeCompare(b[1]));
    }
    highestRated(cuisine) { return this.cr.get(cuisine)[0][1]; }
}

// ==================== 19. 设计数字容器系统 ====================
class NumberContainers {
    constructor() { this.idx = new Map(); this.num = new Map(); }
    change(index, number) {
        const old = this.idx.get(index);
        if (old !== undefined) {
            const s = this.num.get(old);
            s.delete(index);
            if (!s.size) this.num.delete(old);
        }
        this.idx.set(index, number);
        if (!this.num.has(number)) this.num.set(number, new Set());
        this.num.get(number).add(index);
    }
    find(number) {
        const s = this.num.get(number);
        return s && s.size ? Math.min(...s) : -1;
    }
}

// ==================== 20. 设计键值存储 ====================
class KVStore {
    constructor() { this.map = new Map(); }
    set(key, value) { this.map.set(key, value); }
    get(key) { return this.map.has(key) ? this.map.get(key) : -1; }
    remove(key) { this.map.delete(key); }
}

// ==================== 测试 ====================
function test031301() {
    const assert = (n, a, e) => console.log(JSON.stringify(a) === JSON.stringify(e) ? `[OK] ${n}` : `[FAIL] ${n}`);
    const lru = new LRUCache(2);
    lru.put(1, 1); lru.put(2, 2);
    assert('1', lru.get(1), 1);
    lru.put(3, 3);
    assert('1b', lru.get(2), -1);
    const hs = new MyHashSet();
    hs.add(1); assert('3', hs.contains(1), true);
    const hm = new MyHashMap();
    hm.put(1, 1); assert('4', hm.get(1), 1);
    console.log('031301 tests done.');
}
test031301();
