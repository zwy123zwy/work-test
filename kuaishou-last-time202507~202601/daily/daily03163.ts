class LRUCacheSpace {
    public  capacity: number;
    public cache: Map<any,any>;
    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map();
    }
    get(key: number) {
        if (!this.cache.has(key)) {
            return -1;
        }
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }

    put(key: number, value: any) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        this.cache.set(key, value);
        if (this.cache.size > this.capacity) {
            this.cache.delete(this.cache.keys().next().value);
        }
        console.log(this.cache);
    }
}

const cache = new LRUCacheSpace(2);
cache.put(1, 1);
cache.put(2, 2);
cache.get(1);    // 返回 1
cache.put(3, 3); // 淘汰2
cache.get(2);    // 返回 -1