// 防抖
// 防抖：在一定时间内，如果多次触发同一个事件，则只执行最后一次。
function debounce(fn: (...args: any[]) => void, delay: number) {
    let timer: NodeJS.Timeout | null = null;
    return function (...args: any[]) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

// 防抖，最后一次执行
function debounceLast(fn: (...args: any[]) => void, delay: number) {
    let timer: NodeJS.Timeout | null = null;
    let isLast = true;
    return function (...args: any[]) {
        if (isLast) {
            fn(...args);
            isLast = false;
        }
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn(...args);
            isLast = true;
        }, delay);
    };
}