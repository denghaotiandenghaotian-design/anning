/**
 * 量表计分自检脚本 —— 验证反向计分、维度汇总、界值判定是否符合原始文档
 * 用法：node scripts/verify-scoring.mjs
 */
import { ASSESSMENTS } from '../src/lib/assessments.ts';

let fail = 0;
let pass = 0;

function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) { pass++; console.log(`  ✅ ${name}: ${JSON.stringify(actual)}`); }
  else { fail++; console.log(`  ❌ ${name}: 期望 ${JSON.stringify(expected)}，实得 ${JSON.stringify(actual)}`); }
}

const get = (id) => ASSESSMENTS.find((a) => a.id === id);
const fill = (n, val, from = 1) => {
  const o = {};
  for (let i = from; i < from + n; i++) o[i] = val;
  return o;
};

console.log('\n=== 1. 量表总数 ===');
check('量表总数', ASSESSMENTS.length, 20);
check('全部含 T-DAS', ASSESSMENTS.some((a) => a.id === 'tdas'), true);
check('全部含 CES-D-10', ASSESSMENTS.some((a) => a.id === 'cesd'), true);

console.log('\n=== 2. SAS 反向计分（反向题 5/9/13/17/19） ===');
{
  const sas = get('sas');
  // 全部选 1（"没有或很少时间"）：正向题=1，反向题翻转后=4 → 15*1 + 5*4 = 35
  const all1 = fill(20, 1);
  check('全选1 粗分', sas.scoring(all1).total, Math.round(35 * 1.25));
  // 全部选 4：正向题=4，反向题翻转后=1 → 15*4 + 5*1 = 65
  const all4 = fill(20, 4);
  check('全选4 粗分', sas.scoring(all4).total, Math.round(65 * 1.25));
}

console.log('\n=== 3. SDS 反向计分（反向题 10 道） ===');
{
  const sds = get('sds');
  // 全选 1：10*1 + 10*4 = 50
  check('全选1 粗分', sds.scoring(fill(20, 1)).total, Math.round(50 * 1.25));
  // 全选 4：10*4 + 10*1 = 50
  check('全选4 粗分', sds.scoring(fill(20, 4)).total, Math.round(50 * 1.25));
}

console.log('\n=== 4. GDS-30 反向计分 + 30 题唯一性 ===');
{
  const gds = get('gds');
  check('条目数', gds.items.length, 30);
  const texts = gds.items.map((i) => i.text);
  check('条目无重复', new Set(texts).size, 30);
  // 全选"是"(0)：7 道反向题翻转后=1，23 道正向=0 → 总分 7
  check('全选是 总分', gds.scoring(fill(30, 0)).total, 7);
  // 全选"否"(1)：7 道反向题翻转后=0，23 道正向=1 → 总分 23
  check('全选否 总分', gds.scoring(fill(30, 1)).total, 23);
}

console.log('\n=== 5. MLQ 第 2 题反向计分 ===');
{
  const mlq = get('mlq');
  // 全选 1：seek=4*1=4；pres: 第2题 8-1=7，4/7/8/9 = 4 → 11；总 15
  const r = mlq.scoring(fill(9, 1));
  check('全选1 总分', r.total, 15);
  check('全选1 MLQ-S', r.dimensions.find((d) => d.name.includes('MLQ-S')).value, 4);
  check('全选1 MLQ-P', r.dimensions.find((d) => d.name.includes('MLQ-P')).value, 11);
  // 全选 7：seek=28；pres: 8-7=1 + 7*4=28 → 29；总 57
  check('全选7 总分', mlq.scoring(fill(9, 7)).total, 57);
}

console.log('\n=== 6. SSRS 逐题选项 + 维度汇总 ===');
{
  const ssrs = get('ssrs');
  check('条目数', ssrs.items.length, 10);
  check('每题均有独立选项', ssrs.items.every((i) => Array.isArray(i.options) && i.options.length === 4), true);
  const r = ssrs.scoring(fill(10, 4));
  check('全选4 总分', r.total, 40);
  check('全选4 客观支持', r.dimensions.find((d) => d.name === '客观支持').value, 16);
  check('全选4 主观支持', r.dimensions.find((d) => d.name === '主观支持').value, 12);
  check('全选4 支持利用度', r.dimensions.find((d) => d.name === '支持利用度').value, 12);
}

console.log('\n=== 7. T-DAS 反向计分 ===');
{
  const t = get('tdas');
  check('条目数', t.items.length, 15);
  // 全选"是"(0)：6 道正向=0，9 道反向翻转后=1 → 9
  check('全选是 总分', t.scoring(fill(15, 0)).total, 9);
  // 全选"否"(1)：6 道正向=1，9 道反向翻转后=0 → 6
  check('全选否 总分', t.scoring(fill(15, 1)).total, 6);
}

console.log('\n=== 8. CES-D-10 反向计分 ===');
{
  const c = get('cesd');
  check('条目数', c.items.length, 10);
  // 全选 0：2 道反向翻转后=3，8 道正向=0 → 6
  check('全选0 总分', c.scoring(fill(10, 0)).total, 6);
  // 全选 3：2 道反向翻转后=0，8 道正向=3 → 24
  check('全选3 总分', c.scoring(fill(10, 3)).total, 24);
}

console.log('\n=== 9. ZBI / KPS / PPS / Barthel / ESAS / NRS / VAS ===');
{
  const zbi = get('zbi');
  check('ZBI 条目数', zbi.items.length, 22);
  check('ZBI 全选4 总分', zbi.scoring(fill(22, 4)).total, 88);
  check('ZBI 全选0 总分', zbi.scoring(fill(22, 0)).total, 0);

  const kps = get('kps');
  check('KPS 等级数', kps.levels.length, 11);
  check('KPS 100分', kps.scoring({ 1: 100 }).total, 100);

  const pps = get('pps');
  check('PPS 等级数', pps.levels.length, 11);
  check('PPS 维度列数', pps.matrixColumns.length, 5);

  const bi = get('barthel');
  check('Barthel 条目数', bi.items.length, 10);
  // Barthel 每题选项不同，需逐题取各自最高分
  const biMax = {};
  bi.items.forEach((it) => { biMax[it.id] = Math.max(...it.options.map((o) => o.value)); });
  check('Barthel 逐题最高 总分', bi.scoring(biMax).total, 100);
  const biMin = {};
  bi.items.forEach((it) => { biMin[it.id] = Math.min(...it.options.map((o) => o.value)); });
  check('Barthel 逐题最低 总分', bi.scoring(biMin).total, 0);
  // 单项权重校验：进食 10 / 洗澡 5 / 修饰 5 / 穿衣 10 / 大便 10 / 小便 10 / 如厕 10 / 转移 15 / 行走 15 / 楼梯 10
  check('Barthel 权重合计', Object.values(biMax).reduce((a, b) => a + b, 0), 100);

  const esas = get('esas');
  check('ESAS 条目数', esas.items.length, 10);
  check('ESAS 前9项求和', esas.scoring(fill(10, 5)).total, 45);

  const nrs = get('nrs');
  check('NRS 满分10', nrs.scoring({ 1: 10 }).total, 10);

  const vas = get('vas');
  check('VAS 满分100', vas.scoring({ 1: 100 }).total, 100);
}

console.log('\n=== 10. AGS 无统一临界值声明 ===');
{
  const ags = get('ags');
  check('AGS 条目数', ags.items.length, 27);
  check('AGS 全选5 总分', ags.scoring(fill(27, 5)).total, 135);
  check('AGS 全选1 总分', ags.scoring(fill(27, 1)).total, 27);
  check('AGS 解读含"无统一"', ags.scoring(fill(27, 3)).interpretation.includes('无统一'), true);
}

console.log('\n=== 11. ICG-19 命名与上限 ===');
{
  const icg = get('icg');
  check('ICG 名称', icg.name, 'ICG-19');
  check('ICG 条目数', icg.items.length, 19);
  check('ICG 满分', icg.scoring(fill(19, 4)).total, 76);
  check('ICG ≥25 判高风险', icg.scoring(fill(19, 4)).level.color, 'red');
}

console.log('\n=== 12. 自杀风险提示存在性 ===');
{
  const sds = get('sds');
  const phq = get('phq9');
  check('SDS 第19题≥3 触发危机提示', sds.scoring({ ...fill(20, 1), 19: 4 }).recommendations.join('').includes('必须立即评估自杀风险'), true);
  check('PHQ-9 第9题≥1 触发危机提示', phq.scoring({ ...fill(9, 0), 9: 1 }).recommendations.join('').includes('必须立即进一步评估安全风险'), true);
}

console.log(`\n${'='.repeat(46)}`);
console.log(`通过 ${pass} 项，失败 ${fail} 项`);
console.log('='.repeat(46));
if (fail > 0) process.exit(1);
