/**
 * 030301 面试题（20 道）- 专题：React 业务与功能实现
 * 日期：2026-03-03
 * 类型：Hooks、表单、列表、路由、状态、组件设计等
 */

// ==================== 1. 受控与非受控表单 ====================
// 题干：实现一个登录表单（用户名、密码），分别用受控组件和 useRef 非受控两种方式，并提交时打印值。
// 输入：无
// 输出：两个 React 组件代码（或关键片段）
// 约束：包含 submit 处理

// 实现：


// ==================== 2. 自定义 useRequest ====================
// 题干：实现 useRequest(url)，返回 { data, loading, error, refetch }。请求中不重复发起。
// 输入：url: string
// 输出：{ data, loading, error, refetch }
// 约束：用 useState + useEffect，可选用 abort

// 实现：


// ==================== 3. 自定义 useDebounce / useDebouncedValue ====================
// 题干：实现 useDebouncedValue(value, delay)，返回防抖后的值，用于搜索框等。
// 输入：value: any, delay: number
// 输出：debouncedValue
// 约束：useEffect + 定时器清理

// 实现：


// ==================== 4. 自定义 useLocalStorage ====================
// 题干：实现 useLocalStorage(key, initialValue)，行为类似 useState，但持久化到 localStorage。
// 输入：key: string, initialValue: any
// 输出：[value, setValue]
// 约束：同步 localStorage 与 SSR 安全（可选）

// 实现：


// ==================== 5. 列表虚拟滚动（思路或简化实现） ====================
// 题干：长列表（如 10000 条）只渲染可视区域 + 缓冲，说明思路或写出简化版（固定高度、根据 scrollTop 计算 startIndex/endIndex）。
// 输入：items: any[], itemHeight: number, containerHeight: number
// 输出：只渲染可见项的组件结构或伪代码
// 约束：至少说明 start/end 计算与总高度占位

// 实现：


// ==================== 6. 无限滚动加载 ====================
// 题干：实现一个列表，滚动到底部时自动加载下一页（fetch），并拼接数据。用 IntersectionObserver 或 scroll 事件。
// 输入：初始 API 与 loadMore API
// 输出：组件关键逻辑（state、effect、ref）
// 约束：防重复请求、loading 态

// 实现：


// ==================== 7. 多选与全选（表格/列表） ====================
// 题干：实现列表项多选 + 表头全选（全选勾选时全部选中，取消全选时全部取消；手动全部选中时全选勾上）。
// 输入：dataSource: { id, name }[]
// 输出：组件 state 设计 + 全选/单选的 handler
// 约束：受控或内部 state 均可

// 实现：


// ==================== 8. 表单校验（同步 + 异步） ====================
// 题干：实现简单表单校验：用户名必填、长度 2～10；密码再次输入一致。可选：用户名失焦时异步校验是否已存在。
// 输入：无
// 输出：表单组件 + 校验逻辑
// 约束：显示错误信息、提交时统一校验

// 实现：


// ==================== 9. 弹窗与 Portal ====================
// 题干：实现一个 Modal 组件，通过 ReactDOM.createPortal 渲染到 body，支持 mask 点击关闭、ESC 关闭、打开时锁定 body 滚动。
// 输入：visible, onClose, children
// 输出：Modal 组件代码
// 约束：无 UI 库依赖

// 实现：


// ==================== 10. 路由鉴权（ProtectedRoute） ====================
// 题干：实现一个 ProtectedRoute，未登录时跳转登录页（或重定向到 /login），登录后可访问子组件。
// 输入：假设有 useAuth() 返回 { isLoggedIn }
// 输出：ProtectedRoute 组件（含 Redirect 或 Navigate）
// 约束：React Router v6 或 v5 任选

// 实现：


// ==================== 11. 全局状态：主题/语言切换 ====================
// 题干：用 Context + useState 实现主题（light/dark）和语言（zh/en）切换，并在某子组件中消费并展示当前值。
// 输入：无
// 输出：Context 定义 + Provider + 使用处的组件
// 约束：避免不必要的重渲染（可选 useMemo）

// 实现：


// ==================== 12. 组件通信：兄弟节点 ====================
// 题干：两个兄弟组件 A 和 B，A 中点击按钮改变 B 中显示的数字。至少给出两种方案：提升 state 到父组件、Context、事件总线（简单实现）。
// 输入：无
// 输出：关键代码结构
// 约束：说明适用场景

// 实现：


// ==================== 13. 动态表单（动态增减表单项） ====================
// 题干：表单中有「联系人」列表，可添加/删除多条，每条有姓名、电话。提交时得到数组。用 React 实现。
// 输入：无
// 输出：表单 state 结构 + 添加/删除逻辑 + 提交
// 约束：受控组件

// 实现：


// ==================== 14. useReducer 管理复杂状态 ====================
// 题干：用 useReducer 实现一个简单 TodoList：添加、删除、切换完成状态。写出 reducer 与初始 state。
// 输入：无
// 输出：reducer + initialState + 使用示例
// 约束：action 类型清晰

// 实现：


// ==================== 15. 避免子组件不必要的重渲染 ====================
// 题干：父组件 state 变化导致所有子组件重渲染。说明如何用 React.memo、useCallback、useMemo 优化，并写出示例。
// 输入：无
// 输出：优化前后对比或关键代码
// 约束：至少用到 memo + useCallback

// 实现：


// ==================== 16. 封装一个 Table 组件（简化版） ====================
// 题干：接收 columns（title, dataIndex, key）和 dataSource，渲染表头与表格 body，支持 key 对应渲染。
// 输入：columns: { title, dataIndex, key }[], dataSource: object[]
// 输出：Table 组件 JSX 结构
// 约束：不要求排序、筛选，仅展示

// 实现：


// ==================== 17. 实现 Tabs 组件 ====================
// 题干：Tabs 下多个 TabPane，点击切换显示对应 content，当前 tab 高亮。
// 输入：tabs: { key, label, children }[]
// 输出：Tabs 组件（受控或非受控）
// 约束：可扩展为受控 activeKey + onChange

// 实现：


// ==================== 18. 文件上传与进度 ====================
// 题干：实现文件上传（单文件），使用 XMLHttpRequest 或 fetch，展示上传进度（percent）和结果（成功/失败）。
// 输入：无
// 输出：上传组件逻辑（onChange file、xhr.upload.onprogress、状态）
// 约束：进度条 UI 可简化

// 实现：


// ==================== 19. 倒计时组件 ====================
// 题干：实现一个倒计时组件，传入目标时间戳或秒数，显示剩余 天:时:分:秒，到 0 后停止并回调 onEnd。
// 输入：targetTime: number (timestamp or seconds), onEnd?: () => void
// 输出：组件代码
// 约束：setInterval 或 requestAnimationFrame，清理定时器

// 实现：


// ==================== 20. 树形数据与递归渲染 ====================
// 题干：数据格式为 { id, label, children?: [] }，递归渲染成可折叠的树形结构（点击展开/收起）。
// 输入：treeData: TreeNode[]
// 输出：Tree 组件（递归子节点）
// 约束：每层缩进、展开状态可本地 state 或受控

// 实现：
