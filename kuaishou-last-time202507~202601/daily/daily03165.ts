function curry(fn: (...args: any[]) => any) {
    const placeholder = curry.placeholder;

    function mergeArgs(prev: any[], next: any[]) {
        const res = [...prev];
        let nextIndex = 0;
        for (let i = 0; i < res.length && nextIndex < next.length; i++) {
            if (res[i] === placeholder) {
                res[i] = next[nextIndex++];
            }
        }
        // 多余的新参数直接 push 到末尾
        while (nextIndex < next.length) {
            res.push(next[nextIndex++]);
        }
        return res;
    }

    function curried(...args: any[]): any {
        const filledCount = args.filter(arg => arg !== placeholder).length;
        if (filledCount >= fn.length) {
            // 有占位符时，这里简单调用；更严谨可以再裁剪长度
            return fn(...args);
        }
        return (...args2: any[]) => curried(...mergeArgs(args, args2));
    }

    return curried;
}

// 定义占位符
curry.placeholder = Symbol('curry_placeholder');

const addF = (a: number, b: number, c: number) => a + b + c;
const curriedAdd = curry(addF);
curriedAdd(1)(2)(3);           // 6
curriedAdd(1, 2)(3);           // 6
curriedAdd(1)(2, 3);           // 6
curriedAdd(1, 2, 3);           // 6
// 进阶：支持占位符
const _ = curry.placeholder;
curriedAdd(1)(_, 3)(2);        // 6