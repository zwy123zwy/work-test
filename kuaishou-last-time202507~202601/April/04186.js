const questions = [
  { id: 1, title: '实现 MyPartial<T>', prompt: '不使用内置类型。', starter: 'type MyPartial<T> = {\n  // TODO\n};', answer: '标准解法：`type MyPartial<T> = { [K in keyof T]?: T[K] }`。核心是映射类型加可选修饰符。', focus: ['映射类型'] },
  { id: 2, title: '实现 MyRequired<T>', prompt: '全部属性必填。', starter: 'type MyRequired<T> = {\n  // TODO\n};', answer: '标准解法：`type MyRequired<T> = { [K in keyof T]-?: T[K] }`。`-?` 用来去掉可选标记。', focus: ['修饰符'] },
  { id: 3, title: '实现 MyReadonly<T>', prompt: '全部属性只读。', starter: 'type MyReadonly<T> = {\n  // TODO\n};', answer: '标准解法：`type MyReadonly<T> = { readonly [K in keyof T]: T[K] }`。', focus: ['映射类型'] },
  { id: 4, title: '实现 MyPick<T, K>', prompt: '按键提取属性。', starter: 'type MyPick<T, K extends keyof T> = {\n  // TODO\n};', answer: '标准解法：`type MyPick<T, K extends keyof T> = { [P in K]: T[P] }`。', focus: ['索引类型'] },
  { id: 5, title: '实现 MyOmit<T, K>', prompt: '排除指定键。', starter: 'type MyOmit<T, K extends keyof any> = any;', answer: '标准解法：`type MyOmit<T, K extends keyof any> = MyPick<T, Exclude<keyof T, K>>`。', focus: ['Exclude'] },
  { id: 6, title: '实现 MyRecord<K, T>', prompt: '联合类型映射为对象。', starter: 'type MyRecord<K extends keyof any, T> = {\n  // TODO\n};', answer: '标准解法：`type MyRecord<K extends keyof any, T> = { [P in K]: T }`。', focus: ['键映射'] },
  { id: 7, title: '实现 MyExclude<T, U>', prompt: '排除联合成员。', starter: 'type MyExclude<T, U> = T extends U ? never : T;', answer: '标准解法：利用条件类型分发：`type MyExclude<T, U> = T extends U ? never : T`。', focus: ['条件类型'] },
  { id: 8, title: '实现 MyExtract<T, U>', prompt: '提取联合交集。', starter: 'type MyExtract<T, U> = T extends U ? T : never;', answer: '标准解法：`type MyExtract<T, U> = T extends U ? T : never`。', focus: ['条件类型'] },
  { id: 9, title: '实现 MyNonNullable<T>', prompt: '去掉 null 和 undefined。', starter: 'type MyNonNullable<T> = any;', answer: '标准解法：`type MyNonNullable<T> = T extends null | undefined ? never : T`。', focus: ['类型过滤'] },
  { id: 10, title: '实现 MyParameters<T>', prompt: '获取参数元组。', starter: 'type MyParameters<T extends (...args: any) => any> = any;', answer: '标准解法：`type MyParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never`。', focus: ['infer'] },
  { id: 11, title: '实现 MyReturnType<T>', prompt: '获取返回值类型。', starter: 'type MyReturnType<T extends (...args: any) => any> = any;', answer: '标准解法：`type MyReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : never`。', focus: ['infer'] },
  { id: 12, title: '实现 Awaited<T>', prompt: '递归展开 Promise。', starter: 'type MyAwaited<T> = any;', answer: '标准解法：`type MyAwaited<T> = T extends PromiseLike<infer U> ? MyAwaited<U> : T`。', focus: ['递归类型'] },
  { id: 13, title: '实现 DeepReadonly<T>', prompt: '深层只读。', starter: 'type DeepReadonly<T> = any;', answer: '标准解法：对象类型递归映射：`type DeepReadonly<T> = T extends Function ? T : T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T`。', focus: ['递归映射'] },
  { id: 14, title: '实现 TupleToUnion<T>', prompt: '元组转联合。', starter: 'type TupleToUnion<T extends readonly any[]> = any;', answer: '标准解法：`type TupleToUnion<T extends readonly any[]> = T[number]`。', focus: ['索引访问'] },
  { id: 15, title: '实现 Last<T>', prompt: '获取最后一个元素。', starter: 'type Last<T extends any[]> = any;', answer: '标准解法：`type Last<T extends any[]> = T extends [...infer _, infer L] ? L : never`。', focus: ['变长元组'] },
  { id: 16, title: '实现 Pop<T>', prompt: '移除尾元素。', starter: 'type Pop<T extends any[]> = any;', answer: '标准解法：`type Pop<T extends any[]> = T extends [...infer R, any] ? R : []`。', focus: ['infer'] },
  { id: 17, title: '实现 Shift<T>', prompt: '移除首元素。', starter: 'type Shift<T extends any[]> = any;', answer: '标准解法：`type Shift<T extends any[]> = T extends [any, ...infer R] ? R : []`。', focus: ['元组拆解'] },
  { id: 18, title: '实现 Path<T>', prompt: '生成 a.b.c 路径联合。', starter: 'type Path<T> = any;', answer: '标准解法：递归遍历对象键，当前键直接保留，同时拼接 `${K}.${Path<T[K]>}`；基础类型递归终止为 never。', focus: ['复杂递归类型'] },
  { id: 19, title: '实现 PathValue<T, P>', prompt: '按路径取值类型。', starter: 'type PathValue<T, P extends string> = any;', answer: '标准解法：若 P 可拆为 `${K}.${Rest}` 且 K 在 keyof T 中，则递归取 PathValue<T[K], Rest>；否则若 P 是 keyof T，返回 T[P]。', focus: ['字符串字面量类型'] },
  { id: 20, title: '实现统一接口响应泛型', prompt: 'code/message/data 统一约束。', starter: 'interface ApiResponse<T> {\n  // TODO\n}', answer: '标准解法：`interface ApiResponse<T> { code: number; message: string; data: T }`，错误场景可扩展 requestId、success 字段或联合类型。', focus: ['业务建模'] },
];

module.exports = questions;
