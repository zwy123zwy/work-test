const questions = [
  { id: 1, title: '实现 reactive', prompt: 'Proxy 响应式。', starter: 'function reactive(target) {\n  // TODO\n}', answer: '标准解法：返回 Proxy，在 get 时 track，在 set/delete 时 trigger；对嵌套对象递归包裹 reactive。', focus: ['Proxy'] },
  { id: 2, title: '实现 ref', prompt: '包装基础类型。', starter: 'function ref(value) {\n  // TODO\n}', answer: '标准解法：返回带有 getter/setter 的对象，通过内部 dep 做依赖收集和触发；对象值可再交给 reactive 处理。', focus: ['响应式封装'] },
  { id: 3, title: '实现 effect', prompt: '建立依赖关系。', starter: 'function effect(fn) {\n  // TODO\n}', answer: '标准解法：执行 effect 前把 activeEffect 指向当前副作用；track 时把 activeEffect 加入 dep；执行结束后恢复现场。', focus: ['依赖收集'] },
  { id: 4, title: '实现 computed', prompt: '支持缓存。', starter: 'function computed(getter) {\n  // TODO\n}', answer: '标准解法：computed 内部依赖 effect + dirty 标志；依赖变更只把 dirty 置 true，真正读取 value 时才重新求值并缓存。', focus: ['惰性求值'] },
  { id: 5, title: '实现 watch', prompt: '支持 immediate/deep。', starter: 'function watch(source, cb, options) {\n  // TODO\n}', answer: '标准解法：把 source 规范成 getter；deep 模式递归 traverse 收集依赖；旧值新值对比后执行 cb，immediate 时首次立即触发。', focus: ['监听机制'] },
  { id: 6, title: '实现 watchEffect', prompt: '自动收集依赖。', starter: 'function watchEffect(fn) {\n  // TODO\n}', answer: '标准解法：本质是立即执行的 effect；依赖变化时重新执行；若提供 onCleanup，则在下一次执行前先清理副作用。', focus: ['副作用模型'] },
  { id: 7, title: '实现 nextTick', prompt: '放到微任务队列。', starter: 'function nextTick(fn) {\n  // TODO\n}', answer: '标准解法：维护回调队列，首次入队时用 Promise.resolve().then(flushCallbacks) 批量刷新。', focus: ['异步更新'] },
  { id: 8, title: '实现依赖清理', prompt: 'effect 重新执行前删除旧依赖。', starter: 'function cleanup(effectFn) {\n  // TODO\n}', answer: '标准解法：effectFn.deps 保存它加入过的 dep 集合；重新执行前遍历 deps，把 effectFn 从各 dep 中删除，然后清空 effectFn.deps。', focus: ['内存管理'] },
  { id: 9, title: '虚拟 DOM diff 简版', prompt: '比较新旧子节点。', starter: 'function patch(n1, n2, container) {\n  // TODO\n}', answer: '标准解法：先比较 type；同类型则 patchProps + patchChildren，不同则卸载旧节点并挂载新节点。', focus: ['渲染原理'] },
  { id: 10, title: '异步组件加载器', prompt: '支持 loading/error。', starter: 'function defineAsyncComponent(loader) {\n  // TODO\n}', answer: '标准解法：组件内部维护 loading/error/loaded 状态；首次渲染时执行 loader Promise；失败可重试，超时进入 error。', focus: ['工程体验'] },
  { id: 11, title: '实现 v-permission', prompt: '按权限显示元素。', starter: 'const vPermission = {\n  mounted(el, binding) {\n    // TODO\n  }\n};', answer: '标准解法：在 mounted/updated 中读取当前权限码，若不满足则移除元素或置 disabled；权限集合通常来自全局 store。', focus: ['自定义指令'] },
  { id: 12, title: '实现 keep-alive 策略', prompt: '按 meta 决定缓存。', starter: 'function shouldCacheRoute(route) {\n  // TODO\n}', answer: '标准解法：读取 route.meta.keepAlive 或 include/exclude 规则；命中的组件实例进入缓存容器，切走时不销毁，回来时复用。', focus: ['缓存路由'] },
  { id: 13, title: '表单校验 composable', prompt: '支持异步规则。', starter: 'function useValidator(form, rules) {\n  // TODO\n}', answer: '标准解法：按字段维护 errors；validateField 顺序执行规则，规则可返回布尔值、错误文案或 Promise；validateAll 汇总所有字段结果。', focus: ['组合式函数'] },
  { id: 14, title: '实现 usePagination', prompt: '封装分页查询。', starter: 'function usePagination(service) {\n  // TODO\n}', answer: '标准解法：维护 page/pageSize/total/list/loading；load 触发 service，成功后同步 total 和 list；提供 onPageChange、refresh。', focus: ['业务抽象'] },
  { id: 15, title: '筛选状态持久化', prompt: '回到页面后恢复。', starter: 'function persistPageState(key, state) {\n  // TODO\n}', answer: '标准解法：在离开页面时把筛选值、分页和 scrollTop 写入 sessionStorage；页面初始化时读取并恢复。', focus: ['页面恢复'] },
  { id: 16, title: '图片上传预览组件', prompt: '支持大小校验。', starter: 'function useImageUpload() {\n  // TODO\n}', answer: '标准解法：选中文件后校验 size/type，再用 URL.createObjectURL 或 FileReader 生成预览地址，上传完成后释放对象 URL。', focus: ['上传组件'] },
  { id: 17, title: '动态表单渲染器', prompt: '根据 schema 输出控件。', starter: 'function renderForm(schema) {\n  // TODO\n}', answer: '标准解法：schema 描述字段类型、props、rules 和 layout；渲染层根据 type 映射到对应组件并双向绑定 formModel。', focus: ['低代码'] },
  { id: 18, title: '权限按钮组件', prompt: '无权限时隐藏或禁用。', starter: 'function usePermissionButton(code) {\n  // TODO\n}', answer: '标准解法：根据当前权限集合返回 visible/disabled；UI 层只解释结果，不把权限判断散落到每个页面。', focus: ['权限系统'] },
  { id: 19, title: '国际化切换', prompt: '运行时切换语言。', starter: 'function useI18nSwitch() {\n  // TODO\n}', answer: '标准解法：locale 放在全局响应式状态中，切换时动态加载语言包并刷新文案，当前语言持久化到本地。', focus: ['多语言'] },
  { id: 20, title: '页面离开确认', prompt: '表单脏数据提示。', starter: 'function useLeaveConfirm(isDirty) {\n  // TODO\n}', answer: '标准解法：浏览器层面监听 beforeunload；路由层面在 beforeRouteLeave 中，当 isDirty 为 true 弹确认框决定是否放行。', focus: ['路由守卫'] },
];

module.exports = questions;
