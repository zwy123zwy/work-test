// ============ 全局变量（模拟 React 内部） ============
let currentFiber = null;
let hookIndex = 0;
// ============ useState ============
function useState(initialState) {
    const fiber = currentFiber;        // 关键：捕获当前 fiber
    const fiberHooks = fiber.hooks;
    const hook = fiberHooks[hookIndex];
    if (!hook) {
        const state = typeof initialState === 'function'
            ? initialState()
            : initialState;
        const newHook = { state, queue: [] };
        fiberHooks[hookIndex] = newHook;
        const setState = (action) => {
            newHook.queue.push(action);
            scheduleRender(fiber);         // 关键：调度到绑定的 fiber
        };
        hookIndex++;
        return [state, setState];
    } else {
        let newState = hook.state;
        while (hook.queue.length > 0) {
            const action = hook.queue.shift();
            newState = typeof action === 'function' ? action(newState) : action;
        }
        hook.state = newState;
        const setState = (action) => {
            hook.queue.push(action);
            scheduleRender(fiber);         // 关键：调度到绑定的 fiber
        };
        hookIndex++;
        return [hook.state, setState];
    }
}
// ============ 模拟渲染流程 ============
function scheduleRender(fiber) {
    hookIndex = 0;
    currentFiber = fiber;              // 关键：切换当前 fiber
    fiber.render();
}