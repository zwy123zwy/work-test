const questions = [
  { id: 1, title: '实现 rem 适配', prompt: '根据视口设置根字号。', starter: 'function setupRem(baseWidth = 375) {\n  // TODO\n}', answer: '标准解法：根字体大小 = 当前视口宽度 / 设计稿宽度 * 基准值，resize 时重新计算，必要时设置上下限。', focus: ['移动端适配'] },
  { id: 2, title: '实现 1px 边框', prompt: '兼容高分屏。', starter: 'function hairlineStyle() {\n  // TODO\n}', answer: '标准解法：常见方案是伪元素 scale(0.5) 缩放、border-image 或媒体查询适配 dpr。', focus: ['CSS 适配'] },
  { id: 3, title: '实现安全区适配', prompt: '兼容刘海屏。', starter: 'function getSafeAreaStyle() {\n  // TODO\n}', answer: '标准解法：使用 padding-bottom: env(safe-area-inset-bottom) 等环境变量，对底部按钮和导航栏留出安全距离。', focus: ['safe-area'] },
  { id: 4, title: '实现下拉刷新', prompt: '达到阈值触发刷新。', starter: 'function usePullToRefresh() {\n  // TODO\n}', answer: '标准解法：touchstart 记录起点，touchmove 计算下拉距离，仅在滚动顶部允许下拉；超过阈值松手触发 refresh。', focus: ['触摸事件'] },
  { id: 5, title: '实现上拉加载更多', prompt: '滚动到底加载下一页。', starter: 'function useLoadMore() {\n  // TODO\n}', answer: '标准解法：监听滚动容器剩余距离或使用底部哨兵元素；到阈值且非 loading/hasMore 时触发加载。', focus: ['滚动容器'] },
  { id: 6, title: '实现吸顶筛选栏', prompt: '滚动后固定顶部。', starter: 'function useSticky(offsetTop) {\n  // TODO\n}', answer: '标准解法：监听滚动位置，超过目标元素初始 top 时切换 fixed/sticky 状态；占位元素避免布局跳动。', focus: ['滚动监听'] },
  { id: 7, title: '实现横向滑动 Tab', prompt: '选中项居中。', starter: 'function scrollTabIntoView(tabEl, container) {\n  // TODO\n}', answer: '标准解法：计算 tab 中心点与容器中心的差值，平滑滚动到目标位置，并限制不超出左右边界。', focus: ['移动端交互'] },
  { id: 8, title: '实现图片预览器', prompt: '支持缩放和切换。', starter: 'function createImageViewer() {\n  // TODO\n}', answer: '标准解法：单指滑动切图，双指根据两点距离变化缩放；缩放后限制最大最小比例和边界回弹。', focus: ['手势处理'] },
  { id: 9, title: 'H5 调起 App', prompt: '兼容未安装场景。', starter: 'function openApp(schemaUrl, downloadUrl) {\n  // TODO\n}', answer: '标准解法：尝试通过 schema 或 universal link 打开 App，同时记录时间；若一段时间未离开页面则跳转下载页。', focus: ['Hybrid 场景'] },
  { id: 10, title: '实现 JSBridge 封装', prompt: '统一 H5 与原生通信。', starter: 'function callNative(method, params) {\n  // TODO\n}', answer: '标准解法：统一 requestId 和回调注册表；H5 调原生时序列化消息，原生回调时按 requestId 找到对应 Promise resolve/reject。', focus: ['桥接层'] },
  { id: 11, title: '扫码回调页恢复', prompt: '从 App 回到 H5 恢复状态。', starter: 'function restoreAfterScan() {\n  // TODO\n}', answer: '标准解法：扫码前把上下文写入 sessionStorage，回调页解析结果后恢复原页面状态并继续业务流程。', focus: ['页面恢复'] },
  { id: 12, title: '分享参数拼装器', prompt: '输出各渠道配置。', starter: 'function buildShareConfig(data) {\n  // TODO\n}', answer: '标准解法：根据渠道输出 title、desc、image、link 等字段；App 和微信参数命名不同，做一层统一映射。', focus: ['渠道适配'] },
  { id: 13, title: '离线包版本校验', prompt: '判断是否更新资源。', starter: 'function needUpdate(localVersion, remoteVersion) {\n  // TODO\n}', answer: '标准解法：比较版本号或 manifest hash；发现远端更高时先下载新包，校验完整后再切换。', focus: ['Hybrid 更新'] },
  { id: 14, title: '弱网图片降级', prompt: '按网络类型加载不同资源。', starter: 'function chooseImage(networkType, sources) {\n  // TODO\n}', answer: '标准解法：结合 Network Information API 或测速结果，在 2g/slow-2g 场景优先低清晰度图，Wi-Fi 下加载高清图。', focus: ['网络适配'] },
  { id: 15, title: '地址选择器', prompt: '省市区三级联动。', starter: 'function useAddressPicker(data) {\n  // TODO\n}', answer: '标准解法：三级数据做树形映射，选择上级时重置下级选项，选项列表由当前层级节点 children 推导。', focus: ['交互组件'] },
  { id: 16, title: '输入框防遮挡', prompt: '键盘弹起自动滚动。', starter: 'function fixInputVisible(input) {\n  // TODO\n}', answer: '标准解法：focus 后延迟计算输入框位置与视口底部的距离，不足时滚动容器；iOS 常需在键盘动画后再次校正。', focus: ['兼容问题'] },
  { id: 17, title: '来源参数透传', prompt: '保留渠道信息。', starter: 'function persistUtm(url) {\n  // TODO\n}', answer: '标准解法：进入页面时解析 utm 参数并缓存，后续站内跳转、登录和支付链路都从缓存中继承这些来源字段。', focus: ['营销场景'] },
  { id: 18, title: '双列瀑布流', prompt: '按高度均衡分配。', starter: 'function waterfall(items) {\n  // TODO\n}', answer: '标准解法：维护左右列当前累计高度，每次把新卡片放入较短的一列，输出左右两列列表。', focus: ['布局算法'] },
  { id: 19, title: '订单页倒计时保活', prompt: '后台切回仍准确。', starter: 'function usePageCountdown(endTime) {\n  // TODO\n}', answer: '标准解法：剩余时间始终用 endTime - now 计算，并在 visibilitychange 回到前台时立即刷新。', focus: ['页面生命周期'] },
  { id: 20, title: '高频点击保护', prompt: '支付按钮防误触。', starter: 'function protectTap(fn) {\n  // TODO\n}', answer: '标准解法：点击后立即进入 loading/disabled 状态，直到请求结束；如要求更稳，可叠加短时间节流与后端幂等键。', focus: ['交互稳定性'] },
];

module.exports = questions;
