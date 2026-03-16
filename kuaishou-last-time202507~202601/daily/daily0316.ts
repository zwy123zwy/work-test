class LazyMan {
    name: string;
    queue: (() => void)[];
    constructor(name: string) {
        this.name = name;
        this.queue = [];
        console.log(`Hi I am ${name}`);
        setTimeout(() => {
            this.next();
        }, 0);
    }
    next() {
        if (this.queue.length > 0) {
            const task = this.queue.shift();
            task && task();
        }
        return this;
    }
    eat(food: string) {
        this.queue.push(() => {
            console.log(`I am eating ${food}`);
            this.next();
        });
        return this;
    }
    sleep(delay: number) {
        this.queue.push(() => {
            setTimeout(() => {
                console.log(`I am sleeping for ${delay} seconds`);
                this.next();
            }, delay * 1000);
        });
        return this;
    }
    sleepFirst(delay: number) {
        this.queue.unshift(() => {
            setTimeout(() => {
                console.log(`I am sleeping for first ${delay} seconds`);
                this.next();
            }, delay * 1000);
        });
        return this;
    }
}

new LazyMan("Tony")
    .eat("lunch")
    .sleep(2)
    .eat("dinner")
    .sleepFirst(3)
    .eat("breakfast");
