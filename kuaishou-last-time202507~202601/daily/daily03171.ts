// 1.实现一个类似AI聊天对话框的CSS布局，要求左侧头像固定，右侧内容自适应，且内容过长时自动换行。
// 2.请说明在处理AI流式输出 (Streaming)时，Fetch API 与传统的XMLHttpRequest 有什么区别?



// 手写代码:实现一个简单的流式数据解析器，将SSE(Server-Sent Events)格式的字符串转换为对象。

function parseSSE(sse: string): Array<{ data?: string; event?: string; id?: string }> {
    const events: Array<{ data?: string; event?: string; id?: string }> = [];
    const blocks = sse.trim().split(/\n\n+/);

    for (const block of blocks) {
        const lines = block.split('\n');
        const obj: Record<string, string> = {};

        for (const line of lines) {
            if (line.startsWith('data:')) {
                const value = line.slice(5).replace(/^\s/, '');
                obj['data'] = obj['data'] ? obj['data'] + '\n' + value : value;
            } else if (line.startsWith('event:')) {
                obj['event'] = line.slice(6).trim();
            } else if (line.startsWith('id:')) {
                obj['id'] = line.slice(3).trim();
            }
        }

        if (Object.keys(obj).length > 0) {
            events.push(obj as { data?: string; event?: string; id?: string });
        }
    }

    return events;
}

// 4.在TypeScript中，如何定义一个支持多种AI模型配置的通用接口
// 5.说一下 JavaScript 的事件循环(Event Loop)以及它如何影响AI字符打字机效果的渲染?


// 6.如何实现一个带有自动滚动到底部功能的对话列表，且用户手动向上滚动时停止自动滚动?

// 7.解释一下Promise.all和Promise.allSettled的区别，在并行调用多个AI模型时你会选哪个
// Promise.all: 全部成功才 resolve，任一失败立即 reject
// Promise.allSettled: 等所有完成，返回 { status, value?/reason? }，不因单个失败而 reject
// 并行调用多个AI模型 → 选 allSettled，可拿到每个模型的结果/错误，便于汇总或择优
function allSettled<T>(promises: Promise<T>[]) {
    return Promise.all(
        promises.map((p) =>
            p.then((v) => ({ status: 'fulfilled' as const, value: v })).catch((e) => ({ status: 'rejected' as const, reason: e }))
        )
    );
}

// 8.简单实现一个防抖函数(Debounce)，并说明它在AI搜索建议(Query Suggestion)场景下的作用。
function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return function (this: unknown, ...args: Parameters<T>) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}
// 搜索建议：用户快速输入时，只在实际停顿 delay 后再发请求，减少请求次数、节省资源

// 9.CSS 中如何实现一个无限旋转的Loading动画，用于表示AI 正在思考?
// @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
// .loading { animation: spin 1s linear infinite; }

// 10.数组转树结构:AIAgent 的任务拆解通常是树状的，请写一个函数将扁平的任务列表转为嵌套树
interface Task {
    id: string;
    parentId: string | null;
    name: string;
    children?: Task[];
}

function listToTree(list: Task[]): Task[] {
    const map = new Map<string, Task>();
    list.forEach((t) => map.set(t.id, { ...t, children: [] }));
    const roots: Task[] = [];
    list.forEach((t) => {
        const node = map.get(t.id)!;
        if (!t.parentId) roots.push(node);
        else map.get(t.parentId)?.children?.push(node);
    });
    return roots;
}