/**
 * daily0329-utils.js — 为 daily03291~94 生成完整 solution 字段
 */

function buildSolution(q) {
  const parts = [];
  if (q.answerOutput != null && String(q.answerOutput).trim() !== '') {
    parts.push('【输出 / 结论】\n' + q.answerOutput);
  }
  if (q.designThinking != null && String(q.designThinking).trim() !== '') {
    parts.push('【设计思路】\n' + q.designThinking);
  }
  parts.push('【解析】\n' + q.answer);
  if (q.answerCode) {
    parts.push('【参考代码】\n' + q.answerCode);
  }
  return parts.join('\n\n');
}

function withSolutions(questionBank) {
  return questionBank.map((q) => ({ ...q, solution: buildSolution(q) }));
}

module.exports = { buildSolution, withSolutions };
