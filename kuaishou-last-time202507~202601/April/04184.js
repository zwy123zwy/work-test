/**
 * 04184.js
 * 题目 + 函数骨架 + 标准答案
 */

const questions = [
  { id: 1, title: '实现 usePrevious', prompt: '返回上一次值。', starter: 'function usePrevious(value) {\n  // TODO\n}', answer: '标准解法：用 useRef 保存旧值，在 useEffect 中把当前 value 写入 ref，渲染时返回 ref.current。', focus: ['Hook', 'useRef'] },
  { id: 2, title: '实现 useDebounce', prompt: '延迟输出值。', starter: 'function useDebounce(value, wait) {\n  // TODO\n}', answer: '标准解法：内部 state 保存 debouncedValue；useEffect 里开定时器，wait 后 setState；依赖变化时清理旧 timer。', focus: ['Hook 封装'] },
  { id: 3, title: '实现 useThrottle', prompt: '节流输出值。', starter: 'function useThrottle(value, wait) {\n  // TODO\n}', answer: '标准解法：用 useRef 记录上次更新时间和 trailing timer；在 effect 中判断是否立即更新，否则补尾调用。', focus: ['节流', 'Hook'] },
  { id: 4, title: '实现 useLatest', prompt: '总能拿到最新回调。', starter: 'function useLatest(value) {\n  // TODO\n}', answer: '标准解法：用 ref 保存 value，并在每次渲染时同步 ref.current = value；返回 ref 供异步回调中读取。', focus: ['闭包问题'] },
  { id: 5, title: '实现 useUnmount', prompt: '卸载时执行回调。', starter: 'function useUnmount(fn) {\n  // TODO\n}', answer: '标准解法：配合 useLatest 保存最新 fn，在 useEffect(() => () => latest.current(), []) 中注册清理逻辑。', focus: ['副作用清理'] },
  { id: 6, title: '实现 useEventListener', prompt: '封装 window/document 事件。', starter: 'function useEventListener(target, type, handler) {\n  // TODO\n}', answer: '标准解法：用 useLatest 保证 handler 最新；useEffect 中 addEventListener，返回时 removeEventListener；target 支持 ref 或函数。', focus: ['事件封装'] },
  { id: 7, title: '实现 useRequest', prompt: '支持 loading、error、retry。', starter: 'function useRequest(service, options) {\n  // TODO\n}', answer: '标准解法：维护 data/loading/error 状态；run 调用 service 并更新状态；retry 记录上次参数后重试；卸载时阻止过期响应覆盖最新状态。', focus: ['异步状态管理'] },
  { id: 8, title: '实现 useInfiniteScroll', prompt: '滚动到底加载更多。', starter: 'function useInfiniteScroll(loadMore, options) {\n  // TODO\n}', answer: '标准解法：监听滚动容器底部距离或使用 IntersectionObserver 观察哨兵元素；触底时判断非 loading 且 hasMore 后触发 loadMore。', focus: ['分页加载'] },
  { id: 9, title: '实现 useVirtualList', prompt: '输出可视区切片。', starter: 'function useVirtualList(data, itemHeight, containerHeight) {\n  // TODO\n}', answer: '标准解法：根据 scrollTop 算 start/end，下发 list、offset、totalHeight；overscan 预留上下缓冲区减少滚动抖动。', focus: ['性能优化'] },
  { id: 10, title: '实现表单引擎', prompt: '支持联动和校验。', starter: 'function useFormEngine(schema) {\n  // TODO\n}', answer: '标准解法：formState 统一存值，schema 描述字段和规则；字段变更后重新计算依赖字段显示/禁用状态；校验器同步或异步返回错误信息。', focus: ['表单抽象'] },
  { id: 11, title: '实现 Modal 管理器', prompt: '支持 Promise 风格调用。', starter: 'function createModalManager() {\n  // TODO\n}', answer: '标准解法：全局维护 modal 队列；open 返回 Promise，把 resolve/reject 存到实例；用户确认或取消时回写结果并销毁实例。', focus: ['Portal', '状态管理'] },
  { id: 12, title: '实现 ErrorBoundary', prompt: '捕获子树错误。', starter: 'class ErrorBoundary extends React.Component {\n  // TODO\n}', answer: '标准解法：类组件里用 static getDerivedStateFromError 设置 hasError，用 componentDidCatch 上报 error 和 info，渲染 fallback UI。', focus: ['异常兜底'] },
  { id: 13, title: '实现 keepAlive', prompt: '切页后保留状态。', starter: 'function KeepAlive({ activeKey, children }) {\n  // TODO\n}', answer: '标准解法：缓存已渲染过的 ReactElement/DOM 容器；切换时隐藏非活跃节点而不是卸载；必要时限制缓存数并按 LRU 淘汰。', focus: ['缓存渲染'] },
  { id: 14, title: '实现权限路由组件', prompt: '按角色控制访问。', starter: 'function PermissionRoute({ roles, element }) {\n  // TODO\n}', answer: '标准解法：从用户上下文读取当前角色，与目标角色集合比对；通过则渲染 element，否则重定向到 403 或登录页。', focus: ['权限控制'] },
  { id: 15, title: '实现配置驱动表格', prompt: '支持排序筛选和自定义单元格。', starter: 'function SmartTable({ columns, dataSource }) {\n  // TODO\n}', answer: '标准解法：columns 描述 title、dataIndex、sorter、filters、render；表头统一渲染排序筛选控件，表体逐列解释配置。', focus: ['组件抽象'] },
  { id: 16, title: '实现上传组件', prompt: '支持分片和续传。', starter: 'function Upload() {\n  // TODO\n}', answer: '标准解法：文件切片后按 hash 标识上传；先向服务端查询已上传分片，缺失部分继续传；维护暂停、继续、进度和失败重试。', focus: ['文件处理'] },
  { id: 17, title: '实现搜索联想框', prompt: '支持防抖和键盘导航。', starter: 'function SearchSuggest() {\n  // TODO\n}', answer: '标准解法：输入值防抖触发请求；每次请求附带序号或 AbortController，过期结果丢弃；上下键移动 activeIndex，回车确认当前项。', focus: ['交互细节'] },
  { id: 18, title: '实现 SSR 安全请求 Hook', prompt: '避免重复请求。', starter: 'function useSSRRequest(key, service) {\n  // TODO\n}', answer: '标准解法：服务端请求结果注水到 window.__INITIAL_DATA__；客户端 Hook 首次渲染优先读注水数据，没有再发请求。', focus: ['同构渲染'] },
  { id: 19, title: '实现主题切换', prompt: '支持 CSS Variables。', starter: 'function useTheme() {\n  // TODO\n}', answer: '标准解法：主题 token 写入 document.documentElement.style.setProperty；切换结果持久化到 localStorage；初始化时读取缓存或跟随系统。', focus: ['样式系统'] },
  { id: 20, title: '实现微前端挂载器', prompt: '封装 load、mount、unmount。', starter: 'function mountSubApp(config) {\n  // TODO\n}', answer: '标准解法：先动态加载子应用入口资源，再调用其暴露的 mount；切换或销毁时调用 unmount；主应用负责路由同步和公共上下文注入。', focus: ['微前端'] },
];

module.exports = questions;
