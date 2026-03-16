// 防抖配置
// 防抖：支持 immediate（首调）+ trailing（末调）+ cancel
type DebounceOptions = {
    immediate?: boolean; // 首次立即执行
    trailing?: boolean;  // 停止触发后再执行一次
};

function debounceF<T extends (...args: any[]) => void>(
    fn: T,
    delay: number,
    options: DebounceOptions = {}
) {
    const { immediate = false, trailing = true } = options;
    let timer: NodeJS.Timeout | null = null;
    let called = false; // 当前窗口内是否已经触发过 immediate
    let lastArgs: any[] | null = null;
    let lastThis: any = null;

    const debounced = function (this: any, ...args: any[]) {
        lastArgs = args;
        lastThis = this;

        if (timer) clearTimeout(timer);

        // 首次触发立即执行
        if (immediate && !called) {
            fn.apply(lastThis, lastArgs);
            called = true;
        }

        if (trailing) {
            timer = setTimeout(() => {
                // 若未用 immediate 或者 immediate 用过但仍希望末尾再执行一次
                if (!immediate || (immediate && called)) {
                    if (lastArgs) {
                        fn.apply(lastThis, lastArgs);
                    }
                }
                timer = null;
                called = false;
                lastArgs = null;
                lastThis = null;
            }, delay);
        } else {
            // 不需要 trailing，则窗口结束时只需重置状态
            timer = setTimeout(() => {
                timer = null;
                called = false;
                lastArgs = null;
                lastThis = null;
            }, delay);
        }
    } as T & { cancel: () => void };

    debounced.cancel = () => {
        if (timer) clearTimeout(timer);
        timer = null;
        called = false;
        lastArgs = null;
        lastThis = null;
    };

    return debounced;
}

// 节流：支持 leading（首调）+ trailing（末调）+ cancel
type ThrottleOptions = {
    leading?: boolean;
    trailing?: boolean;
};

function throttleF<T extends (...args: any[]) => void>(
    fn: T,
    delay: number,
    options: ThrottleOptions = {}
) {
    const { leading = true, trailing = true } = options;
    let lastTime = 0;
    let timer: NodeJS.Timeout | null = null;
    let lastArgs: any[] | null = null;
    let lastThis: any = null;

    const throttled = function (this: any, ...args: any[]) {
        const now = Date.now();
        if (!lastTime && !leading) {
            lastTime = now;
        }
        const remaining = delay - (now - lastTime);
        lastArgs = args;
        lastThis = this;

        if (remaining <= 0 || remaining > delay) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            lastTime = now;
            fn.apply(lastThis, lastArgs);
            lastArgs = null;
            lastThis = null;
        } else if (trailing && !timer) {
            timer = setTimeout(() => {
                lastTime = leading === false ? 0 : Date.now();
                timer = null;
                if (lastArgs) {
                    fn.apply(lastThis, lastArgs);
                    lastArgs = null;
                    lastThis = null;
                }
            }, remaining);
        }
    } as T & { cancel: () => void };

    throttled.cancel = () => {
        if (timer) clearTimeout(timer);
        timer = null;
        lastTime = 0;
        lastArgs = null;
        lastThis = null;
    };

    return throttled;
}