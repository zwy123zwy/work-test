const questions = [
  { id: 1, title: '实现简易 webpack loader', prompt: '接收源码字符串并转换。', starter: 'module.exports = function loader(source) {\n  // TODO\n};', answer: '标准解法：loader 接收 source 并返回转换后的字符串；如需 options，可通过 this.getOptions() 读取；异步 loader 用 this.async()。', focus: ['loader'] },
  { id: 2, title: '实现简易 webpack plugin', prompt: '在 emit 阶段输出信息。', starter: 'class DemoPlugin {\n  apply(compiler) {\n    // TODO\n  }\n}', answer: '标准解法：在 apply 中监听 compiler.hooks.emit 或 compilation 阶段 hook；读取 compilation.assets 并注入或打印构建结果。', focus: ['plugin'] },
  { id: 3, title: '实现按环境加载配置', prompt: '区分 dev/test/prod。', starter: 'function loadConfig(env) {\n  // TODO\n}', answer: '标准解法：定义 baseConfig + envConfig，按 env 做浅合并或深合并；公共配置收敛到 base，差异项单独覆盖。', focus: ['配置管理'] },
  { id: 4, title: '实现路径别名解析', prompt: '模拟 @/ 映射。', starter: 'function resolveAlias(importPath, aliasMap) {\n  // TODO\n}', answer: '标准解法：遍历 aliasMap，命中前缀后用真实路径替换，再进行标准路径拼接与归一化。', focus: ['模块解析'] },
  { id: 5, title: '实现依赖图构建器', prompt: '从入口递归收集 import。', starter: 'function buildGraph(entry) {\n  // TODO\n}', answer: '标准解法：读取入口文件，解析 import 语句，构建模块对象 {file, deps}；对每个依赖递归处理并存入图结构，注意去重避免重复遍历。', focus: ['打包原理'] },
  { id: 6, title: '实现 tree shaking 判定', prompt: '识别未使用导出。', starter: 'function markUsedExports(modules) {\n  // TODO\n}', answer: '标准解法：从入口开始记录真正被 import 的命名导出，沿依赖图传播使用信息；未被引用的导出标记为可删除。', focus: ['ESM 静态分析'] },
  { id: 7, title: '实现资源 hash 命名', prompt: '根据内容生成文件名。', starter: 'function createHashedName(content, ext) {\n  // TODO\n}', answer: '标准解法：对 content 做 md5/sha1 摘要，取前若干位作为 contenthash，再与 ext 拼接输出稳定文件名。', focus: ['缓存策略'] },
  { id: 8, title: '实现产物分析器', prompt: '统计 chunk 体积。', starter: 'function analyzeBundles(stats) {\n  // TODO\n}', answer: '标准解法：遍历 stats.modules 或 assets，汇总每个 chunk 的字节数、模块数和公共依赖，输出按体积排序的分析结果。', focus: ['构建优化'] },
  { id: 9, title: '实现环境变量注入', prompt: '把 process.env 替换成真实值。', starter: 'function injectEnv(source, envMap) {\n  // TODO\n}', answer: '标准解法：在编译期扫描代码中的 process.env.KEY，用对应 JSON.stringify(value) 替换，未声明变量给出警告。', focus: ['编译替换'] },
  { id: 10, title: '实现 source map 开关', prompt: '按环境切换。', starter: 'function getDevtool(env) {\n  // TODO\n}', answer: '标准解法：开发环境用 eval-cheap-module-source-map，测试环境用 source-map，生产环境根据体积和安全策略关闭或用 hidden-source-map。', focus: ['调试策略'] },
  { id: 11, title: '实现路由分包建议器', prompt: '输出拆包建议。', starter: 'function suggestSplitChunks(routes) {\n  // TODO\n}', answer: '标准解法：按路由维度统计页面依赖，找出共享依赖和大体积页面；公共依赖建议单独抽离，低频页面建议懒加载。', focus: ['性能工程'] },
  { id: 12, title: '自动生成路由表', prompt: '扫描 pages 输出配置。', starter: 'function generateRoutes(files) {\n  // TODO\n}', answer: '标准解法：把 pages 文件路径映射为路由路径，如 pages/user/[id].tsx -> /user/:id；约定 index 映射根路径或目录首页。', focus: ['约定式路由'] },
  { id: 13, title: '实现 mock 开关注入', prompt: '切换真实接口和 mock。', starter: 'function createApiClient(useMock) {\n  // TODO\n}', answer: '标准解法：根据开关切换 baseURL 或 adapter；开发环境可优先请求 mock，联调时切真实服务。', focus: ['开发体验'] },
  { id: 14, title: '实现脚手架变量替换', prompt: '把项目名写入模板。', starter: 'function renderTemplate(content, data) {\n  // TODO\n}', answer: '标准解法：约定模板占位符如 {{name}}，遍历 data 用正则替换为真实值；必要时处理文件名中的变量。', focus: ['CLI'] },
  { id: 15, title: '实现 commit message 校验', prompt: '检查约定式提交。', starter: 'function validateCommitMsg(msg) {\n  // TODO\n}', answer: '标准解法：用正则校验 type(scope?): subject 格式，type 限制为 feat/fix/docs/refactor/test/chore 等，不符合则返回失败原因。', focus: ['工程规范'] },
  { id: 16, title: '实现 lint-staged 执行器', prompt: '只处理暂存文件。', starter: 'function runLintStaged(stagedFiles) {\n  // TODO\n}', answer: '标准解法：按文件后缀匹配命令，如 js 跑 eslint，css 跑 stylelint；仅对 stagedFiles 执行，失败则终止提交流程。', focus: ['提交流水线'] },
  { id: 17, title: '生成 devServer 代理配置', prompt: '映射多个后端前缀。', starter: 'function createProxyConfig(services) {\n  // TODO\n}', answer: '标准解法：把 /apiA、/apiB 映射到对应 target，设置 changeOrigin、pathRewrite、secure 等字段，形成标准代理对象。', focus: ['代理配置'] },
  { id: 18, title: '实现 CDN 回源兜底', prompt: '失败切备用域名。', starter: 'function loadScriptWithFallback(urls) {\n  // TODO\n}', answer: '标准解法：维护候选域名列表，当前 script 加载失败时切换下一地址重试，直到成功或全部失败再 reject。', focus: ['稳定性'] },
  { id: 19, title: '实现构建耗时统计', prompt: '输出各阶段耗时。', starter: 'class BuildTimerPlugin {\n  apply(compiler) {\n    // TODO\n  }\n}', answer: '标准解法：在 run/compile/emit/done 等 hook 打点，记录时间戳并在 done 阶段汇总耗时输出。', focus: ['构建监控'] },
  { id: 20, title: '实现发布前检查器', prompt: '校验版本和环境。', starter: 'function prePublishCheck(context) {\n  // TODO\n}', answer: '标准解法：检查 Node 版本、lockfile、环境变量、未提交改动、测试结果和构建产物；任一项失败就阻断发布。', focus: ['发布质量'] },
];

module.exports = questions;
