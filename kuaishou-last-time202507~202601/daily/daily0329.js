/**
 * daily0329.js — 40 题汇总入口（按专题拆分为 daily03291 ~ daily03294）
 *
 * - daily03291.js — 专题一：JavaScript 核心
 * - daily03292.js — 专题二：异步、事件循环、Promise
 * - daily03293.js — 专题三：React、Hooks、状态
 * - daily03294.js — 专题四：算法与数据结构
 *
 * 用法：
 *   const { questions, getBySection, getById, sections } = require('./daily0329.js');
 *   const s1 = require('./daily03291.js');
 */

const { buildSolution, withSolutions } = require('./daily0329-utils.js');

const daily03291 = require('./daily03291.js');
const daily03292 = require('./daily03292.js');
const daily03293 = require('./daily03293.js');
const daily03294 = require('./daily03294.js');

const sections = [daily03291, daily03292, daily03293, daily03294];

const questions = sections.flatMap((m) => m.questions);

function getBySection(section) {
  const mod = sections.find((m) => m.sectionMeta.section === section);
  return mod ? mod.questions : [];
}

function getById(id) {
  for (const m of sections) {
    const q = m.getById(id);
    if (q) return q;
  }
  return null;
}

module.exports = {
  questions,
  total: questions.length,
  sections,
  sectionMetas: sections.map((m) => m.sectionMeta),
  getBySection,
  getById,
  /** 合并【输出/结论】【解析】【参考代码】为完整答案字符串 */
  buildSolution,
  withSolutions,
  /** 分文件导出，便于单独 require */
  daily03291,
  daily03292,
  daily03293,
  daily03294,
};
