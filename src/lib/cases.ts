/**
 * 个案追踪数据层 - 全部存储在浏览器 localStorage
 * 不上传任何数据；仅用于个人/团队本地工作辅助
 */

export type CaseStage = '接案' | '预估' | '计划' | '介入' | '评估' | '结案' | '回访';

export type RiskFlag = 'normal' | 'watch' | 'high';

export interface CaseNote {
  id: string;
  date: string;
  stage: CaseStage;
  content: string;
  intervention: string;
  next: string;
}

export interface AssessmentRecord {
  id: string;
  assessmentId: string;
  assessmentName: string;
  date: string;
  total: number;
  level: string;
  interpretation: string;
}

export interface CaseFile {
  id: string;
  /** 案主代号/编号（隐私保护，不建议写真名） */
  code: string;
  /** 性别/年龄/疾病类型 */
  gender?: string;
  age?: number;
  diagnosis?: string;
  /** 家属/照顾者情况 */
  caregivers?: string;
  /** 风险等级 */
  risk: RiskFlag;
  /** 关键议题 */
  concerns: string[];
  /** 当前阶段 */
  stage: CaseStage;
  /** 服务起始日期 */
  startDate: string;
  /** 简短总目标 */
  goal: string;
  /** 关键他人/联系信息 */
  contact?: string;
  /** 服务记录 */
  notes: CaseNote[];
  /** 评估记录 */
  assessments: AssessmentRecord[];
  /** 备注 */
  remark?: string;
}

const KEY = 'anning-handbook-cases';

function readAll(): CaseFile[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CaseFile[]) : [];
  } catch {
    return [];
  }
}

function writeAll(cases: CaseFile[]) {
  localStorage.setItem(KEY, JSON.stringify(cases));
}

export function listCases(): CaseFile[] {
  return readAll();
}

export function getCase(id: string): CaseFile | undefined {
  return readAll().find((c) => c.id === id);
}

export function createCase(input: Omit<CaseFile, 'id' | 'notes' | 'assessments'>): CaseFile {
  const cases = readAll();
  const id = `case-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  const next: CaseFile = {
    ...input,
    id,
    notes: [],
    assessments: [],
  };
  cases.unshift(next);
  writeAll(cases);
  return next;
}

export function updateCase(id: string, patch: Partial<CaseFile>): CaseFile | undefined {
  const cases = readAll();
  const idx = cases.findIndex((c) => c.id === id);
  if (idx < 0) return undefined;
  cases[idx] = { ...cases[idx], ...patch };
  writeAll(cases);
  return cases[idx];
}

export function deleteCase(id: string) {
  const cases = readAll().filter((c) => c.id !== id);
  writeAll(cases);
}

export function addNote(caseId: string, note: Omit<CaseNote, 'id'>): CaseFile | undefined {
  const c = getCase(caseId);
  if (!c) return undefined;
  const next: CaseNote = { ...note, id: `n-${Date.now().toString(36)}` };
  return updateCase(caseId, { notes: [next, ...c.notes] });
}

export function removeNote(caseId: string, noteId: string): CaseFile | undefined {
  const c = getCase(caseId);
  if (!c) return undefined;
  return updateCase(caseId, { notes: c.notes.filter((n) => n.id !== noteId) });
}

export function addAssessment(caseId: string, record: Omit<AssessmentRecord, 'id'>): CaseFile | undefined {
  const c = getCase(caseId);
  if (!c) return undefined;
  const next: AssessmentRecord = { ...record, id: `a-${Date.now().toString(36)}` };
  return updateCase(caseId, { assessments: [next, ...c.assessments] });
}

/** 内置样例个案 - 用于首次打开应用时演示 */
export function seedSampleCases() {
  if (readAll().length > 0) return;
  const today = new Date().toISOString().slice(0, 10);
  const samples: CaseFile[] = [
    {
      id: `case-demo-${Math.random().toString(36).slice(2, 7)}`,
      code: 'P-2024-001',
      gender: '男',
      age: 68,
      diagnosis: '晚期肺癌（多发转移）',
      caregivers: '妻子（主要照顾者），女儿（每周探望）',
      risk: 'watch',
      concerns: ['疼痛控制', '死亡焦虑', '妻子照护负担'],
      stage: '介入',
      startDate: '2026-09-12',
      goal: '缓解死亡焦虑，提升患者与家属临终生命质量',
      contact: '妻子电话已备案',
      notes: [
        {
          id: `n-demo-${Math.random().toString(36).slice(2, 7)}`,
          date: today,
          stage: '介入',
          content: '完成第 3 次家庭会谈，患者主动表达对妻子的感谢，妻子情感释放明显。',
          intervention: '四道人生 - 道谢环节',
          next: '下节推进"道爱"，鼓励夫妻间直接表达爱意',
        },
      ],
      assessments: [
        {
          id: `a-demo-${Math.random().toString(36).slice(2, 7)}`,
          assessmentId: 'sas',
          assessmentName: 'SAS 焦虑自评量表',
          date: '2026-09-15',
          total: 56,
          level: '轻度焦虑',
          interpretation: '标准分 56，对死亡话题存在明显回避与紧张。',
        },
      ],
      remark: '示范样例，可在个案管理页面删除。',
    },
  ];
  writeAll(samples);
}

export const STAGES: CaseStage[] = ['接案', '预估', '计划', '介入', '评估', '结案', '回访'];

export const RISK_LABELS: Record<RiskFlag, { label: string; color: string }> = {
  normal: { label: '一般', color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' },
  watch: { label: '关注', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' },
  high: { label: '高危', color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200' },
};