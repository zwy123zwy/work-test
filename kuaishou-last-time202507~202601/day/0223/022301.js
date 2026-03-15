/**
 * 022301 堆与优先队列（20 道）
 * 1.第K大 2.前K高频 3.合并K链表 4.数据流中位数 5.滑动窗口最大
 * 6.最近K点 7.K对最小和 8.矩阵第K小 9.重构字符串 10.任务调度器
 * 11.丑数II 12.超级丑数 13.快选第K大 14.最小K个数 15.单线程CPU
 * 16.Dijkstra堆 17-20.堆变体
 */

class ListNode { constructor(val, next = null) { this.val = val; this.next = next; } }

function findKthLargest(nums, k) {
    const partition = (lo, hi) => {
        const p = nums[hi];
        let i = lo;
        for (let j = lo; j < hi; j++) if (nums[j] >= p) [nums[i], nums[j]] = [nums[j], nums[i]], i++;
        [nums[i], nums[hi]] = [nums[hi], nums[i]];
        return i;
    };
    let lo = 0, hi = nums.length - 1;
    while (true) {
        const p = partition(lo, hi);
        if (p === k - 1) return nums[p];
        if (p < k - 1) lo = p + 1;
        else hi = p - 1;
    }
}

function topKFrequent(nums, k) {
    const cnt = new Map();
    for (const x of nums) cnt.set(x, (cnt.get(x) || 0) + 1);
    const arr = [...cnt.entries()].sort((a, b) => b[1] - a[1]);
    return arr.slice(0, k).map(([x]) => x);
}

function mergeKLists(lists) {
    const pq = [];
    for (let i = 0; i < lists.length; i++) if (lists[i]) pq.push({ node: lists[i], i });
    pq.sort((a, b) => a.node.val - b.node.val);
    const dummy = new ListNode(0);
    let cur = dummy;
    while (pq.length) {
        const { node, i } = pq.shift();
        cur.next = node;
        cur = cur.next;
        if (node.next) {
            pq.push({ node: node.next, i });
            pq.sort((a, b) => a.node.val - b.node.val);
        }
    }
    return dummy.next;
}

class MedianFinder {
    constructor() { this.lo = []; this.hi = []; }
    addNum(num) {
        this.lo.push(num);
        this.lo.sort((a, b) => b - a);
        this.hi.push(this.lo.shift());
        this.hi.sort((a, b) => a - b);
        if (this.hi.length > this.lo.length) this.lo.push(this.hi.shift());
    }
    findMedian() {
        return this.lo.length > this.hi.length ? this.lo[0] : (this.lo[0] + this.hi[0]) / 2;
    }
}

function maxSlidingWindowHeap(nums, k) {
    const q = [];
    const res = [];
    for (let i = 0; i < nums.length; i++) {
        while (q.length && nums[q[q.length - 1]] <= nums[i]) q.pop();
        q.push(i);
        if (q[0] <= i - k) q.shift();
        if (i >= k - 1) res.push(nums[q[0]]);
    }
    return res;
}

function kClosest(points, k) {
    points.sort((a, b) => (a[0] ** 2 + a[1] ** 2) - (b[0] ** 2 + b[1] ** 2));
    return points.slice(0, k);
}

function kSmallestPairs(nums1, nums2, k) {
    const res = [];
    const pq = [[nums1[0] + nums2[0], 0, 0]];
    const seen = new Set(['0,0']);
    while (pq.length && res.length < k) {
        pq.sort((a, b) => a[0] - b[0]);
        const [_, i, j] = pq.shift();
        res.push([nums1[i], nums2[j]]);
        if (i + 1 < nums1.length && !seen.has((i + 1) + ',' + j)) {
            pq.push([nums1[i + 1] + nums2[j], i + 1, j]);
            seen.add((i + 1) + ',' + j);
        }
        if (j + 1 < nums2.length && !seen.has(i + ',' + (j + 1))) {
            pq.push([nums1[i] + nums2[j + 1], i, j + 1]);
            seen.add(i + ',' + (j + 1));
        }
    }
    return res;
}

function kthSmallestMatrix(matrix, k) {
    const n = matrix.length;
    let lo = matrix[0][0], hi = matrix[n - 1][n - 1];
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        let count = 0, j = n - 1;
        for (let i = 0; i < n; i++) {
            while (j >= 0 && matrix[i][j] > mid) j--;
            count += j + 1;
        }
        if (count < k) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

function reorganizeString(s) {
    const cnt = {};
    for (const c of s) cnt[c] = (cnt[c] || 0) + 1;
    const max = Math.max(...Object.values(cnt));
    if (max > (s.length + 1) / 2) return '';
    const arr = Object.entries(cnt).sort((a, b) => b[1] - a[1]);
    const res = new Array(s.length);
    let idx = 0;
    for (const [c, n] of arr)
        for (let i = 0; i < n; i++) {
            res[idx] = c;
            idx += 2;
            if (idx >= s.length) idx = 1;
        }
    return res.join('');
}

function leastInterval(tasks, n) {
    const cnt = {};
    for (const t of tasks) cnt[t] = (cnt[t] || 0) + 1;
    const max = Math.max(...Object.values(cnt));
    const same = Object.values(cnt).filter(v => v === max).length;
    return Math.max(tasks.length, (max - 1) * (n + 1) + same);
}

function nthUglyNumber(n) {
    const dp = [1];
    let p2 = 0, p3 = 0, p5 = 0;
    for (let i = 1; i < n; i++) {
        const next = Math.min(dp[p2] * 2, dp[p3] * 3, dp[p5] * 5);
        dp.push(next);
        if (next === dp[p2] * 2) p2++;
        if (next === dp[p3] * 3) p3++;
        if (next === dp[p5] * 5) p5++;
    }
    return dp[n - 1];
}

function nthSuperUglyNumber(n, primes) {
    const dp = [1];
    const ptr = new Array(primes.length).fill(0);
    for (let i = 1; i < n; i++) {
        let next = Infinity;
        for (let j = 0; j < primes.length; j++) next = Math.min(next, dp[ptr[j]] * primes[j]);
        dp.push(next);
        for (let j = 0; j < primes.length; j++) if (dp[ptr[j]] * primes[j] === next) ptr[j]++;
    }
    return dp[n - 1];
}

function findKthLargestQuickSelect(nums, k) {
    return findKthLargest(nums, k);
}

function getLeastNumbers(arr, k) {
    arr.sort((a, b) => a - b);
    return arr.slice(0, k);
}

function getOrder(tasks) {
    const enq = tasks.map((t, i) => [...t, i]).sort((a, b) => a[0] - b[0]);
    const pq = [];
    let time = 0, i = 0;
    const res = [];
    while (i < enq.length || pq.length) {
        while (i < enq.length && enq[i][0] <= time) {
            pq.push([enq[i][1], enq[i][2]]);
            pq.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
            i++;
        }
        if (pq.length) {
            const [dur, idx] = pq.shift();
            time += dur;
            res.push(idx);
        } else if (i < enq.length) time = enq[i][0];
    }
    return res;
}

function networkDelayTimeHeap(times, n, k) {
    const g = Array(n + 1).fill(0).map(() => []);
    for (const [u, v, w] of times) g[u].push([v, w]);
    const dist = new Array(n + 1).fill(Infinity);
    dist[k] = 0;
    const pq = [[0, k]];
    while (pq.length) {
        pq.sort((a, b) => b[0] - a[0]);
        const [d, u] = pq.pop();
        if (d > dist[u]) continue;
        for (const [v, w] of g[u]) {
            if (dist[v] > dist[u] + w) {
                dist[v] = dist[u] + w;
                pq.push([dist[v], v]);
            }
        }
    }
    let max = 0;
    for (let i = 1; i <= n; i++) { if (dist[i] === Infinity) return -1; max = Math.max(max, dist[i]); }
    return max;
}

function getKthMagicNumber(k) {
    return nthUglyNumber(k);
}

function kthLargestInStream(arr, k) {
    const h = arr.slice(0, k).sort((a, b) => a - b);
    return function add(num) {
        if (num > h[0]) { h[0] = num; h.sort((a, b) => a - b); }
        return h[0];
    };
}

function minRefuelStops(target, startFuel, stations) {
    const pq = [];
    let fuel = startFuel, pos = 0, i = 0, stops = 0;
    while (pos < target) {
        pos += fuel;
        fuel = 0;
        if (pos >= target) return stops;
        while (i < stations.length && stations[i][0] <= pos) pq.push(stations[i++][1]);
        if (!pq.length) return -1;
        pq.sort((a, b) => b - a);
        fuel = pq.shift();
        stops++;
    }
    return stops;
}

function scheduleCourse(courses) {
    courses.sort((a, b) => a[1] - b[1]);
    const pq = [];
    let time = 0;
    for (const [dur, end] of courses) {
        if (time + dur <= end) { time += dur; pq.push(dur); pq.sort((a, b) => b - a); }
        else if (pq.length && pq[0] > dur) { time += dur - pq[0]; pq[0] = dur; pq.sort((a, b) => b - a); }
    }
    return pq.length;
}
