const questions = [
  { id: 1, title: '实现 Button 组件', prompt: '支持 size/type/loading。', starter: 'function Button(props) {\n  // TODO\n}', answer: '标准解法：抽象 variant、size、disabled、loading 等状态，loading 时禁用点击并展示加载图标；通过 className 或 token 驱动样式。', focus: ['基础组件'] },
  { id: 2, title: '实现 Input 组件', prompt: '支持 clearable 和字数统计。', starter: 'function Input(props) {\n  // TODO\n}', answer: '标准解法：受控优先，兼容非受控；有值时展示清空按钮；maxLength 场景显示当前字数和上限。', focus: ['受控组件'] },
  { id: 3, title: '实现 Select 组件', prompt: '支持单选多选搜索。', starter: 'function Select(props) {\n  // TODO\n}', answer: '标准解法：维护 open、selected、keyword 状态；搜索时过滤 options；多选返回数组并支持 tag 删除。', focus: ['组件状态'] },
  { id: 4, title: '实现 Cascader 数据转换', prompt: '平铺数据转级联。', starter: 'function buildCascaderOptions(list) {\n  // TODO\n}', answer: '标准解法：与数组转树相同，先建立节点 Map，再根据 parentId 组装 children，最后映射成 label/value/children 结构。', focus: ['树结构'] },
  { id: 5, title: '实现 DateRangePicker 核心', prompt: '开始结束联动。', starter: 'function useDateRange() {\n  // TODO\n}', answer: '标准解法：分别维护 start 和 end，选中 start 后限制 end >= start；若重新选择更晚的 start，可清空原 end。', focus: ['时间组件'] },
  { id: 6, title: '实现表格固定列', prompt: '横向滚动时固定左右列。', starter: 'function calcStickyOffsets(columns) {\n  // TODO\n}', answer: '标准解法：预计算每列宽度，固定左列累加前面列宽得到 left，固定右列倒序累加得到 right，再配合 position: sticky。', focus: ['复杂布局'] },
  { id: 7, title: '实现表格行选择器', prompt: '支持全选和半选。', starter: 'function useRowSelection(data) {\n  // TODO\n}', answer: '标准解法：selectedKeys 用 Set 存储；全选时批量写入当前可选行；表头状态根据已选数量推导为未选/半选/全选。', focus: ['状态同步'] },
  { id: 8, title: '实现表头拖拽排序', prompt: '调整列顺序。', starter: 'function useColumnDrag(columns) {\n  // TODO\n}', answer: '标准解法：拖拽开始记录源索引，悬停目标位置时更新列数组顺序，拖完后把结果持久化到本地。', focus: ['交互实现'] },
  { id: 9, title: '配置驱动表单', prompt: 'schema 渲染不同控件。', starter: 'function FormRenderer({ schema }) {\n  // TODO\n}', answer: '标准解法：根据 schema.type 选择渲染 Input/Select/DatePicker 等组件，统一 formModel 和 onChange。', focus: ['抽象能力'] },
  { id: 10, title: '表单联动显隐', prompt: '字段值影响其他字段展示。', starter: 'function computeFieldState(schema, formData) {\n  // TODO\n}', answer: '标准解法：在字段配置中声明 visibleWhen/disabledWhen 函数，formData 更新后统一重新计算 UI 状态。', focus: ['规则系统'] },
  { id: 11, title: '弹窗拖拽与边界限制', prompt: '不能拖出视口。', starter: 'function useDraggableModal() {\n  // TODO\n}', answer: '标准解法：记录鼠标按下时偏移量，移动时计算新坐标并用视口宽高裁剪边界，松开后移除事件监听。', focus: ['交互细节'] },
  { id: 12, title: '通知队列', prompt: '同屏最多展示 n 条。', starter: 'function createNoticeManager(limit) {\n  // TODO\n}', answer: '标准解法：维护消息队列和当前显示列表；满额时后续消息进入等待队列，已有通知关闭后补位显示。', focus: ['全局状态'] },
  { id: 13, title: '实现 Steps 组件', prompt: '支持横向纵向。', starter: 'function Steps(props) {\n  // TODO\n}', answer: '标准解法：基于 current 和 status 计算每一步的完成、进行中、错误态，布局层通过 direction 控制横向或纵向。', focus: ['组件 API'] },
  { id: 14, title: 'Tabs 缓存模式', prompt: '切换时保留状态。', starter: 'function CachedTabs(props) {\n  // TODO\n}', answer: '标准解法：已激活过的 Tab 面板不卸载，只隐藏；可用 keepAliveKey 管理缓存并限制最大数量。', focus: ['状态保活'] },
  { id: 15, title: 'Tree 组件展开选择', prompt: '支持懒加载。', starter: 'function useTreeState(tree) {\n  // TODO\n}', answer: '标准解法：expandedKeys、checkedKeys 分离维护；勾选时根据父子联动规则递归更新；未加载子节点的展开事件触发异步请求。', focus: ['树控件'] },
  { id: 16, title: 'JSON Schema 渲染器', prompt: '自动生成表单。', starter: 'function renderBySchema(schema) {\n  // TODO\n}', answer: '标准解法：解释 type、enum、format、required 等字段，映射成组件和校验规则；把 schema 和 formState 解耦。', focus: ['低代码基础'] },
  { id: 17, title: '主题 token 编译器', prompt: '输出 CSS Variables。', starter: 'function compileTokens(tokens) {\n  // TODO\n}', answer: '标准解法：把设计 token 平铺为 --color-primary、--spacing-md 等变量名，再生成 :root 或主题类选择器对应的 CSS 文本。', focus: ['设计系统'] },
  { id: 18, title: '组件多语言切换', prompt: '响应语言变化。', starter: 'function useLocaleText(namespace) {\n  // TODO\n}', answer: '标准解法：组件通过全局 locale 和 namespace 获取当前文案，locale 变化后自动重新渲染。', focus: ['国际化'] },
  { id: 19, title: '表格导出器', prompt: '按当前筛选导出 CSV。', starter: 'function exportCSV(columns, rows) {\n  // TODO\n}', answer: '标准解法：按当前列顺序取值，处理逗号、换行和引号转义，拼接 CSV 文本后通过 Blob 触发下载。', focus: ['数据处理'] },
  { id: 20, title: '权限化配置页面', prompt: '按角色动态展示配置项。', starter: 'function filterSettings(configs, perms) {\n  // TODO\n}', answer: '标准解法：配置项声明 requiredPerms，渲染前按权限过滤；无权限项不进入 UI 层，避免仅靠 disabled 伪隐藏。', focus: ['B 端权限'] },
];

module.exports = questions;
