class EventBus {
    events: Record<string, ((data: any) => void)[]>;
    constructor() {
        this.events = {};
    }
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        return this;
    }

    off(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event] = this.events[event].filter((cb) => cb !== callback);
        return this;
    }

    emit(event, data?: any) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].forEach((callback) => callback(data));
        return this;
    }

    once(event, callback) {
        const onceCallback = (data) => {
            callback?.apply(this, data);
            this.off(event, onceCallback);
        }
        this.on(event, onceCallback);
        return this;
    }
}
const bus = new EventBus();
bus.on('message', (data) => console.log(data));
bus.once('login', () => console.log('logged in'));
bus.emit('message', { text: 'hello' });
bus.emit('login'); // logged in
bus.emit('login'); // 无输出
bus.off('message', (data) => console.log(data));