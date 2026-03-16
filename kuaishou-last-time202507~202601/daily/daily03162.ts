class Scheduler {
    running: number;
    limit: number;
    queue: { task: () => Promise<any>, resolve: (v: any) => void, reject: (e: any) => void }[] = [];
    constructor(limit) {
        this.limit = limit;
        this.queue = [];
        this.running = 0;
    }
    add(task: () => Promise<any>) {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, resolve, reject });
            return this.next();
        });
    }
    next() {
        if (this.running >= this.limit || this.queue.length === 0) {
            return;
        }
        const { task, resolve, reject } = this.queue.shift();
        this.running++;
        Promise.resolve(task()).then(resolve, reject).finally(() => {
            this.running--;
            this.next();
        });
    }
}

const scheduler = new Scheduler(2); // 最多并发2个
function addTask(url, time) {
    return scheduler.add(() =>
        new Promise<void>((res) => {
            setTimeout(() => {
                console.log(url);
                res();
            }, time);
        })
    );
}
addTask('A', 1000).then(console.log); // 1s后输出 A
addTask('B', 500).then(console.log);  // 0.5s后输出 B
addTask('C', 300).then(console.log);  // 等A或B完成后，0.3s输出 C
addTask('D', 400).then(console.log);  // 等A或B完成后，0.4s输出 D