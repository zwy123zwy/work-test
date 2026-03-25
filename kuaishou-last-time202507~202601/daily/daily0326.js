function useEvent(fn) {
    // 第一步：用 ref 保存最新的 fn
    // ref 对象本身在多次 render 之间是稳定的（同一个引用）
    // 但 ref.current 可以随时更新为最新的值
    const fnRef = useRef(fn);

    // 第二步：每次 render 都同步更新 ref.current
    // 这样不管哪次 render 创建的闭包，读到的都是最新的 fn
    fnRef.current = fn;  // 直接赋值，不需要 useEffect

    // 第三步：返回一个稳定的函数
    // useCallback(fn, []) 依赖为空 → 引用永远不变
    // 内部调用 ref.current → 永远执行最新的 fn
    const stableFn = useCallback((...args) => {
        return fnRef.current(...args);
    }, []);  // ← 空依赖！引用永远稳定

    return stableFn;
}
