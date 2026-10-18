/**
 * 资源中心数据 - 政策文件、推广机构、可下载模板
 * 内容来源：本手册第六章、第七章、第八章及参考来源
 */

export type ResourceKind = '政策文件' | '地方标准' | '学术文献' | '评估工具' | '工作模板' | '推广机构' | '外部链接';

export interface Resource {
  id: string;
  title: string;
  kind: ResourceKind;
  issuer?: string;
  year?: string | number;
  summary: string;
  /** 文档代码或编号 */
  refCode?: string;
  url?: string;
  /** 是否本地 PDF（指 public/ 文件） */
  localPdf?: boolean;
  tags?: string[];
}

export const RESOURCES: Resource[] = [
  /* ---------- 国家级政策 ---------- */
  {
    id: 'r-nat-palliative-2025',
    title: '安宁疗护实践指南（2025 年版）',
    kind: '政策文件',
    issuer: '国家卫生健康委办公厅',
    year: 2025,
    refCode: '国卫办医政函〔2025〕332 号',
    summary: '现行有效的国家层面实践规范，明确安宁疗护以终末期患者和家属为中心、以多学科协作模式进行，包含症状控制、舒适照护、心理精神及社会支持等内容。',
    tags: ['现行有效', '国家标准'],
  },
  {
    id: 'r-nat-palliative-2017',
    title: '安宁疗护中心基本标准（试行）和管理规范（试行）',
    kind: '政策文件',
    issuer: '国家卫生计生委',
    year: 2017,
    refCode: '国卫医发〔2017〕7 号',
    summary: '规定独立设置安宁疗护中心的基本条件、科室与设备配置（含关怀室/告别室）、管理要求，为机构开展安宁疗护提供设置标准。',
    tags: ['机构设置'],
  },
  {
    id: 'r-nat-palliative-trial',
    title: '安宁疗护实践指南（试行）',
    kind: '政策文件',
    issuer: '国家卫生计生委',
    year: 2017,
    refCode: '国卫办医发〔2017〕5 号',
    summary: '已被 2025 年版替代，仅供历史参考。',
    tags: ['已废止'],
  },

  /* ---------- 地方标准 ---------- */
  {
    id: 'r-sz-2024',
    title: '安宁疗护社会工作服务指南',
    kind: '地方标准',
    issuer: '深圳市市场监督管理局',
    year: 2024,
    refCode: 'DB4403/T 521—2024',
    summary: '国内首个安宁疗护社会工作地方标准，规定服务原则（自决、全人、全家、全程、多学科协作）、服务流程（接案—预估—计划—介入—评估—结案）及尊严疗法、意义疗法、叙事疗法等介入取向。',
    tags: ['深圳', '社会工作'],
  },
  {
    id: 'r-sh-2020',
    title: '上海市安宁疗护服务规范',
    kind: '地方标准',
    issuer: '上海市卫生健康委员会',
    year: 2020,
    refCode: '沪卫基层〔2020〕9 号',
    summary: '地方规范进一步细化准入标准：经执业医师明确诊断的疾病终末期或老年患者，经评估预期生存期在 6 个月以内，患者或家属同意接受服务约定或协议。',
    tags: ['上海'],
  },
  {
    id: 'r-xj-2025',
    title: '新疆维吾尔自治区安宁疗护服务规范',
    kind: '地方标准',
    issuer: '新疆维吾尔自治区卫生健康委员会',
    year: 2025,
    summary: '第五条：服务对象为经二级及以上医疗机构明确诊断的疾病终末期患者，KPS 评分 70 分以下，或经姑息功能量表（PPS）评估预期生存期在 6 个月以内。',
    tags: ['新疆'],
  },

  /* ---------- 立法 ---------- */
  {
    id: 'r-sz-medical-ordinance',
    title: '《深圳经济特区医疗条例》第七十八条',
    kind: '政策文件',
    issuer: '深圳市人大常委会',
    year: 2022,
    summary: '全国首次将生前预嘱写入地方性法规。医疗机构在患者不可治愈的伤病末期或者临终时实施医疗措施，应当尊重符合条件的生前预嘱。',
    tags: ['生前预嘱', '深圳', '立法'],
  },

  /* ---------- 推广机构 ---------- */
  {
    id: 'r-lwpa',
    title: '北京生前预嘱推广协会（LWPA）',
    kind: '推广机构',
    summary: '国内推广生前预嘱与"选择与尊严"理念的主要公益组织。',
    url: 'https://www.lwpa.org.cn',
    tags: ['生前预嘱', '公益'],
  },
  {
    id: 'r-five-wishes',
    title: '《我的五个愿望》生前预嘱文本',
    kind: '工作模板',
    issuer: '北京生前预嘱推广协会',
    summary: '五个维度：要不要相关医疗服务、使不使用生命支持、希望别人怎么对待我、想让家人朋友知道什么、希望谁帮助我；含音乐陪伴、环境布置等个性化安排。',
    url: 'https://www.lwpa.org.cn',
    tags: ['生前预嘱', '模板'],
  },

  /* ---------- 评估工具 ---------- */
  {
    id: 'r-zung-sas',
    title: 'Zung 焦虑自评量表（SAS）',
    kind: '评估工具',
    issuer: 'Zung, W. W. K. (1971)',
    summary: '20 题，标准分 = 粗分 × 1.25，50/60/70 为轻/中/重分界。',
    tags: ['焦虑', '自评'],
  },
  {
    id: 'r-zung-sds',
    title: 'Zung 抑郁自评量表（SDS）',
    kind: '评估工具',
    issuer: 'Zung, W. W. K. (1965)',
    summary: '20 题，标准分 = 粗分 × 1.25，53/63/73 为轻/中/重分界。',
    tags: ['抑郁', '自评'],
  },
  {
    id: 'r-prigerson-icg',
    title: '复杂性哀伤量表（ICG）',
    kind: '评估工具',
    issuer: 'Prigerson 等',
    summary: '≥25 提示延长哀伤高风险，需评估是否符合 ICD-11 延长哀伤障碍标准。',
    tags: ['哀伤'],
  },
  {
    id: 'r-chochinov-pdi',
    title: '患者尊严量表（PDI）',
    kind: '评估工具',
    issuer: 'Chochinov',
    summary: '分数越高尊严困扰越重，与尊严疗法配套使用。',
    tags: ['尊严'],
  },
  {
    id: 'r-xiao-ssrs',
    title: '社会支持评定量表（SSRS）',
    kind: '评估工具',
    issuer: '肖水源',
    summary: '10 题简版，含主观支持、客观支持、支持利用度三个维度。',
    tags: ['社会支持'],
  },
  {
    id: 'r-yesavage-gds',
    title: '老年抑郁量表（GDS-30）',
    kind: '评估工具',
    issuer: 'Yesavage 等',
    summary: '30 项，≥11 提示抑郁可能，≥21 提示中重度，适合老年人群。',
    tags: ['老年', '抑郁'],
  },

  /* ---------- 工作模板 ---------- */
  {
    id: 't-four-sentences',
    title: '四道人生工作纸',
    kind: '工作模板',
    summary: '引导患者与家属完成道谢、道歉、道爱、道别的情感闭环。可直接打印作为会谈素材。',
    tags: ['家庭工作', '临终'],
  },
  {
    id: 't-life-review',
    title: '生命回顾工作纸',
    kind: '工作模板',
    summary: '按人生阶段（童年、青年、中年、晚年）回顾经历与重要他人，接纳圆满与遗憾。',
    tags: ['生命回顾', '意义建构'],
  },
  {
    id: 't-group-outline-bereaved',
    title: '居丧家属哀伤辅导小组活动模板',
    kind: '工作模板',
    summary: '封闭小组 6 人，每周 1 次 × 6 节，含每节目标、流程、物资、风险预案。',
    tags: ['小组工作', '居丧'],
  },
  {
    id: 't-group-outline-death-anxiety',
    title: '死亡焦虑干预小组活动模板',
    kind: '工作模板',
    summary: '面向养老机构老年入住者，封闭小组 8—10 人，每周 1 次 × 8 节，围绕无憾感、掌控感、生命意义感设计。',
    tags: ['小组工作', '死亡焦虑'],
  },
  {
    id: 't-death-edu',
    title: '社区死亡教育课程大纲',
    kind: '工作模板',
    summary: '面向社区居民的死亡教育系列课程或工作坊大纲，可直接用作宣教材料。',
    tags: ['社区工作', '宣教'],
  },

  /* ---------- 学术文献 ---------- */
  {
    id: 'r-ecare',
    title: 'E-CARE 五维核心能力框架',
    kind: '学术文献',
    issuer: 'BMC Palliative Care, 2025',
    summary: '福建医科大学等基于系统评价提出：伦理、协调、评估、资源分配、教育五维核心能力框架，可作为安宁疗护社工专业能力建设与考核的参照。',
    tags: ['能力框架', '社会工作'],
  },
  {
    id: 'r-adapts',
    title: 'ADAPTS 哀伤评估与干预配对模式',
    kind: '学术文献',
    issuer: '周燕雯（香港大学）',
    summary: '六个面向：异常情绪、功能失调认知、适应困难、生理症状、创伤反应、分离痛苦。干预前先评估并定位个体主导的痛苦面向，再配对针对性方法。',
    tags: ['哀伤', '香港'],
  },
  {
    id: 'r-duke-2026',
    title: '《安宁疗护如何融入癌症照护体系》',
    kind: '学术文献',
    issuer: '昆山杜克大学全球健康研究中心',
    year: 2026,
    summary: '系统梳理安宁疗护在中国的试点沿革与制度演化，包含截至 2024 年底国家级试点覆盖 185 个市（区）的最新数据。',
    url: 'https://globalhealth.dukekunshan.edu.cn',
    tags: ['试点', '综述'],
  },

  /* ---------- 原文链接 ---------- */
  {
    id: 'r-samr',
    title: '全国标准信息公共服务平台',
    kind: '外部链接',
    summary: '查询国家标准、行业标准、地方标准的官方平台。',
    url: 'https://std.samr.gov.cn',
    tags: ['查询'],
  },
  {
    id: 'r-nhc',
    title: '国家卫生健康委官网',
    kind: '外部链接',
    summary: '查看最新政策文件、通知、试点进展。',
    url: 'https://www.nhc.gov.cn',
    tags: ['查询'],
  },
  {
    id: 'r-who-pc',
    title: 'WHO Palliative Care',
    kind: '外部链接',
    summary: '世界卫生组织缓和照护官方定义与实况报道。',
    url: 'https://www.who.int/news-room/fact-sheets/detail/palliative-care',
    tags: ['WHO', '国际'],
  },
];

export function getResourcesByKind(): Record<ResourceKind, Resource[]> {
  const groups: Record<string, Resource[]> = {};
  for (const r of RESOURCES) {
    if (!groups[r.kind]) groups[r.kind] = [];
    groups[r.kind].push(r);
  }
  return groups as Record<ResourceKind, Resource[]>;
}

export const RESOURCE_KIND_COLORS: Record<ResourceKind, string> = {
  政策文件: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
  地方标准: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
  学术文献: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  评估工具: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200',
  工作模板: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  推广机构: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  外部链接: 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-200',
};