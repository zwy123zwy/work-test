const questions = [
  { id: 1, title: '机票列表页架构题', prompt: '筛选、排序、缓存、埋点一体化。', starter: 'function buildFlightPage() {\n  // TODO\n}', answer: '标准答案：状态分层设计，查询条件与列表结果解耦；请求层做去重和缓存；首屏骨架 + 虚拟滚动优化；埋点和监控独立为基础设施。', focus: ['综合设计'] },
  { id: 2, title: '酒店详情页首屏优化', prompt: '覆盖预加载和懒加载。', starter: 'function optimizeHotelDetail() {\n  // TODO\n}', answer: '标准答案：SSR/预渲染首屏关键信息，首图 preload，次屏模块按可视区懒加载，长列表切片渲染，接口并发并加缓存。', focus: ['性能综合'] },
  { id: 3, title: '统一请求 SDK', prompt: '鉴权、重试、取消、监控。', starter: 'function createRequestSDK() {\n  // TODO\n}', answer: '标准答案：分为核心请求器、拦截器层、重试/超时/取消策略、统一错误模型和监控上报层；业务只消费稳定 API。', focus: ['基础设施'] },
  { id: 4, title: '搜索页联想与结果页联动', prompt: '热搜、历史、埋点一体化。', starter: 'function buildSearchFlow() {\n  // TODO\n}', answer: '标准答案：输入流走防抖请求，联想词点击透传到结果页；历史搜索本地缓存；热搜和实验权重独立配置；全链路埋点贯通曝光、点击、转化。', focus: ['复杂交互'] },
  { id: 5, title: '订单确认页状态管理', prompt: '价格、库存、优惠统一处理。', starter: 'function buildOrderStore() {\n  // TODO\n}', answer: '标准答案：把订单页拆成基础信息、库存、价格明细、优惠状态四个子域；用派生计算而不是四处手改总价；接口失败要有降级和回滚。', focus: ['复杂状态'] },
  { id: 6, title: '微前端主子应用通信层', prompt: '事件广播和共享登录态。', starter: 'function createMicroBus() {\n  // TODO\n}', answer: '标准答案：定义统一事件总线协议，主应用提供登录态、路由和监控上下文；子应用通过 mount 时注入桥接对象，卸载时清理订阅。', focus: ['架构设计'] },
  { id: 7, title: '监控 SDK', prompt: '采集错误、性能、埋点。', starter: 'function createMonitorSDK() {\n  // TODO\n}', answer: '标准答案：模块化拆分为错误监控、性能监控、资源监控、行为埋点和上报通道；统一上下文字段、采样策略和离线补发。', focus: ['前端基础设施'] },
  { id: 8, title: '大文件上传平台前端', prompt: '支持秒传和续传。', starter: 'function buildUploader() {\n  // TODO\n}', answer: '标准答案：文件 hash 标识唯一文件，分片上传并记录进度；上传前询问服务端已完成区块；失败可重试，暂停后继续只上传缺失片。', focus: ['文件场景'] },
  { id: 9, title: '低代码表单设计器', prompt: '拖拽生成 schema。', starter: 'function buildFormDesigner() {\n  // TODO\n}', answer: '标准答案：设计态维护 DSL/schema，运行态解释 schema 渲染组件；拖拽只修改 schema，不直接操作业务 DOM；配置与渲染彻底分离。', focus: ['工程抽象'] },
  { id: 10, title: '跨端主题系统', prompt: 'Web 与 H5 共用 token。', starter: 'function buildThemeSystem() {\n  // TODO\n}', answer: '标准答案：设计 token 作为唯一真源，编译生成 CSS Variables、JS 常量和移动端样式映射；主题切换只切 token 集合。', focus: ['设计系统'] },
  { id: 11, title: '营销落地页引擎', prompt: '模块化拼装和性能优化。', starter: 'function buildLandingEngine() {\n  // TODO\n}', answer: '标准答案：页面由模块 schema 驱动，资源按模块异步加载；首屏模块静态化，次屏模块懒执行；埋点能力内建到基础模块。', focus: ['业务平台化'] },
  { id: 12, title: 'BFF 聚合层容灾', prompt: '超时、限流、缓存、降级。', starter: 'function buildBFFGuard() {\n  // TODO\n}', answer: '标准答案：下游调用统一经过超时控制、熔断器、缓存层和 fallback；强依赖接口失败可中断页面，弱依赖接口用兜底数据降级。', focus: ['全链路稳定性'] },
  { id: 13, title: '前端灰度发布平台', prompt: '支持回滚。', starter: 'function buildGrayPlatform() {\n  // TODO\n}', answer: '标准答案：版本、策略、用户桶和回滚机制是核心；客户端拉取灰度配置后根据稳定 hash 判桶；异常时一键切回旧版配置。', focus: ['工程能力'] },
  { id: 14, title: '统一表格方案', prompt: '筛选、权限、导出配置驱动。', starter: 'function buildTableSolution() {\n  // TODO\n}', answer: '标准答案：列配置描述展示、权限、排序、筛选和导出能力；表格组件只解释配置，业务不再重复造轮子。', focus: ['组件体系'] },
  { id: 15, title: '多页面共享缓存中心', prompt: '不同页面共享热点数据。', starter: 'function createSharedCache() {\n  // TODO\n}', answer: '标准答案：内存缓存为主，跨 Tab 可配合 BroadcastChannel 或 storage 事件同步；缓存项需有 TTL、版本和失效策略。', focus: ['缓存架构'] },
  { id: 16, title: '旅游日历价格组件', prompt: '兼顾性能和复杂规则。', starter: 'function buildPriceCalendar() {\n  // TODO\n}', answer: '标准答案：日历网格渲染与价格规则计算分层，缓存每月结果，切月时增量计算；交互层负责 hover、选中和区间高亮。', focus: ['业务复杂组件'] },
  { id: 17, title: '搜索结果页 AB 实验框架', prompt: '动态切流和归因。', starter: 'function createABRuntime() {\n  // TODO\n}', answer: '标准答案：实验配置中心下发实验组与流量比例，客户端稳定分桶并把实验信息透传给埋点、接口和页面渲染层。', focus: ['实验平台'] },
  { id: 18, title: '跨页面草稿恢复', prompt: '任意入口都可继续填写。', starter: 'function createDraftRecovery() {\n  // TODO\n}', answer: '标准答案：以业务实体 id 为键保存草稿，入口页、详情页和确认页共享同一草稿源；提交成功或取消后统一清理。', focus: ['体验设计'] },
  { id: 19, title: '前端排障工具箱', prompt: '环境、日志、请求记录一体化。', starter: 'function buildDebugPanel() {\n  // TODO\n}', answer: '标准答案：聚合版本号、环境信息、用户上下文、最近请求、错误日志和埋点；对线上排障场景可一键导出问题快照。', focus: ['运维工具'] },
  { id: 20, title: '开放题答题模板', prompt: '如何支撑高并发、高稳定性、高可维护性。', starter: 'function answerArchitectureQuestion() {\n  // TODO\n}', answer: '标准答案：先讲分层和职责边界，再讲性能与稳定性措施，最后讲监控、灰度、回滚和工程规范；表达时优先结合真实业务场景。', focus: ['架构表达'] },
];

module.exports = questions;
