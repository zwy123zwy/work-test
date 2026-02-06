
class RequestPool {
    constructor(limit) {
        this.queue = [];
        this.limit = limit;
        this.running = 0;
    }

    add(task) {
        this.queue.push(task);
        this.execute();
    }

    execute() {
        if (this.queue.length === 0 || this.running >= this.limit) {
            return;
        }

        while (this.running < this.limit && this.queue.length > 0) {
            const task = this.queue.shift();

            // 添加检查，确保task存在且为函数
            if (task && typeof task === 'function') {
                this.running++;

                task().then(res => {
                    console.log(res);
                }, err => {
                    console.log(err);
                }).finally(() => {
                    this.running--;
                    this.execute(); // 尝试执行下一个任务
                });
            }
        }
    }
}

const P1 = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("1");
        }, 1000);
    });
};

const P2 = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('2');
        }, 200);
    });
};

const P3 = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('3');
        }, 300);
    });
};

const P4 = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('4');
        }, 500);
    });
};

const test = new RequestPool(3);
test.add(P1);
test.add(P2);
test.add(P3);
test.add(P4);