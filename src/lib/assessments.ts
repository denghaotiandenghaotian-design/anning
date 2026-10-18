/**
 * 安宁疗护常用评估量表数据 + 自动计分与解读
 *
 * 引用标准（按本手册第六章第二节）：
 *  - SAS / SDS：标准分 = 粗分 × 1.25
 *  - SSRS：客观、主观、支持利用度三分量表
 *  - PDI：分数越高尊严困扰越重
 *  - ICG：总分 ≥25 提示延长哀伤高风险
 *  - GDS（30 项）：总分 ≥11 提示抑郁可能
 *  - GAD-7 / PHQ-9：标准 4 级评分
 */

export type ChoiceOption = { value: number; label: string };

export type AssessmentItem = {
  id: number;
  text: string;
  /** 题目是否反向计分（如 SDS 中多数为正向，少数反向） */
  reversed?: boolean;
};

export type Assessment = {
  id: string;
  name: string;
  fullName: string;
  purpose: string;
  category: '情绪' | '哀伤' | '社会支持' | '尊严' | '老年' | '症状';
  duration: string; // 预计耗时
  items: AssessmentItem[];
  options: ChoiceOption[];
  scoring: (answers: Record<number, number>) => ScoreResult;
};

export type ScoreResult = {
  total: number;
  /** 各分量表或维度分数（用于雷达/进度条展示） */
  dimensions?: { name: string; value: number; max: number; level?: ScoreLevel }[];
  level: ScoreLevel;
  interpretation: string;
  recommendations: string[];
};

export type ScoreLevel = {
  label: string;
  color: 'green' | 'yellow' | 'orange' | 'red' | 'blue' | 'gray';
};

/* ---------------- 通用选项模板 ---------------- */

const SAS_OPTIONS: ChoiceOption[] = [
  { value: 1, label: '没有或很少时间' },
  { value: 2, label: '小部分时间' },
  { value: 3, label: '相当多时间' },
  { value: 4, label: '绝大部分或全部时间' },
];

const SDS_OPTIONS: ChoiceOption[] = [
  { value: 1, label: '没有或很少时间' },
  { value: 2, label: '小部分时间' },
  { value: 3, label: '相当多时间' },
  { value: 4, label: '绝大部分或全部时间' },
];

const GAD_OPTIONS: ChoiceOption[] = [
  { value: 0, label: '完全不会' },
  { value: 1, label: '好几天' },
  { value: 2, label: '超过一周' },
  { value: 3, label: '几乎每天' },
];

const PHQ_OPTIONS: ChoiceOption[] = [
  { value: 0, label: '完全不会' },
  { value: 1, label: '好几天' },
  { value: 2, label: '超过一周' },
  { value: 3, label: '几乎每天' },
];

const GDS_OPTIONS: ChoiceOption[] = [
  { value: 0, label: '是' },
  { value: 1, label: '否' },
];

const ICG_OPTIONS: ChoiceOption[] = [
  { value: 0, label: '从来没有' },
  { value: 1, label: '极少' },
  { value: 2, label: '偶尔' },
  { value: 3, label: '有时' },
  { value: 4, label: '经常' },
];

const _UNUSED_SSRS_OPTIONS: ChoiceOption[] = [
  // SSRS 各条目答案不一致（"无"到"全力支持"），由题目录入时分段配置；默认采用 1-4 分
  { value: 1, label: '极少' },
  { value: 2, label: '一般' },
  { value: 3, label: '较多' },
  { value: 4, label: '全力支持' },
];
void _UNUSED_SSRS_OPTIONS;

const PDI_OPTIONS: ChoiceOption[] = [
  { value: 1, label: '没有困扰' },
  { value: 2, label: '轻度困扰' },
  { value: 3, label: '中度困扰' },
  { value: 4, label: '重度困扰' },
  { value: 5, label: '极重度困扰' },
];

/* ---------------- 量表题目 ---------------- */

/** 焦虑自评量表 SAS（Zung）20 题 */
const SAS_ITEMS: AssessmentItem[] = [
  { id: 1, text: '我觉得比平常更容易紧张和着急' },
  { id: 2, text: '我无缘无故地感到害怕' },
  { id: 3, text: '我容易心里烦乱或觉得惊恐' },
  { id: 4, text: '我觉得我可能将要发疯' },
  { id: 5, text: '我觉得一切都好，也不会发生什么不幸' , reversed: true },
  { id: 6, text: '我手脚发抖打颤' },
  { id: 7, text: '我因为头痛、颈痛和背痛而苦恼' },
  { id: 8, text: '我感觉容易衰弱和疲乏' },
  { id: 9, text: '我得心平气和，并且容易安静坐着' , reversed: true },
  { id: 10, text: '我觉得心跳很快' },
  { id: 11, text: '我因为一阵阵头晕而苦恼' },
  { id: 12, text: '我有晕倒发作，或觉得要晕倒似的' },
  { id: 13, text: '我呼气、吸气都感到很容易' , reversed: true },
  { id: 14, text: '我手脚麻木和刺痛' },
  { id: 15, text: '我因为胃痛和消化不良而苦恼' },
  { id: 16, text: '我常常要小便' },
  { id: 17, text: '我的手脚常常是干燥温暖的' , reversed: true },
  { id: 18, text: '我脸红发热' },
  { id: 19, text: '我容易入睡并且一夜睡得很好' , reversed: true },
  { id: 20, text: '我做恶梦' },
];

/** 抑郁自评量表 SDS（Zung）20 题 */
const SDS_ITEMS: AssessmentItem[] = [
  { id: 1, text: '我觉得闷闷不乐，情绪低沉' },
  { id: 2, text: '我觉得一天之中早晨最好' , reversed: true },
  { id: 3, text: '我一阵阵哭出来或觉得想哭' },
  { id: 4, text: '我晚上睡眠不好' },
  { id: 5, text: '我吃得跟平常一样多' , reversed: true },
  { id: 6, text: '我与异性密切接触时和以往一样感到愉快' , reversed: true },
  { id: 7, text: '我发觉我的体重在下降' },
  { id: 8, text: '我有便秘的苦恼' },
  { id: 9, text: '心跳比平时快' },
  { id: 10, text: '我无缘无故地感到疲乏' },
  { id: 11, text: '我的头脑跟平常一样清楚' , reversed: true },
  { id: 12, text: '我觉得经常做的事情并没有困难' , reversed: true },
  { id: 13, text: '我觉得不安而平静不下来' },
  { id: 14, text: '我对将来抱有希望' , reversed: true },
  { id: 15, text: '我比平常容易生气激动' },
  { id: 16, text: '我觉得作出决定是容易的' , reversed: true },
  { id: 17, text: '我觉得自己是个有用的人' , reversed: true },
  { id: 18, text: '我的生活过得很有意思' , reversed: true },
  { id: 19, text: '我认为如果我死了别人会生活得好些' },
  { id: 20, text: '平常感兴趣的事我仍然照样感兴趣' , reversed: true },
];

/** 广泛性焦虑量表 GAD-7 */
const GAD_ITEMS: AssessmentItem[] = [
  { id: 1, text: '感觉紧张、焦虑或急切' },
  { id: 2, text: '不能停止或控制担心' },
  { id: 3, text: '对各种各样的事情担忧过多' },
  { id: 4, text: '很难放松下来' },
  { id: 5, text: '由于不安而无法静坐' },
  { id: 6, text: '变得容易烦恼或急躁' },
  { id: 7, text: '感到似乎将有可怕的事情发生而害怕' },
];

/** 患者健康问卷 PHQ-9 */
const PHQ_ITEMS: AssessmentItem[] = [
  { id: 1, text: '做事时提不起劲或没有兴趣' },
  { id: 2, text: '感到心情低落、沮丧或绝望' },
  { id: 3, text: '入睡困难、睡不安稳或睡得过多' },
  { id: 4, text: '感觉疲倦或没有精力' },
  { id: 5, text: '食欲不振或吃太多' },
  { id: 6, text: '觉得自己很糟，或觉得自己很失败，或让自己或家人失望' },
  { id: 7, text: '对事物专注有困难，例如阅读报纸或看电视时' },
  { id: 8, text: '动作或说话速度缓慢到别人可察觉的程度，或正好相反—烦躁或坐立不安' },
  { id: 9, text: '有不如死掉或用某种方式伤害自己的念头' },
];

/** 老年抑郁量表 GDS（30 项版） */
const GDS_ITEMS: AssessmentItem[] = [
  { id: 1, text: '你对生活基本上满意吗？' , reversed: true },
  { id: 2, text: '你是否已放弃了许多活动与兴趣？' },
  { id: 3, text: '你是否觉得生活空虚？' },
  { id: 4, text: '你是否常感到厌倦？' },
  { id: 5, text: '你是否大部分时间心情愉快？' , reversed: true },
  { id: 6, text: '你是否害怕将有不好的事情发生在你身上？' },
  { id: 7, text: '你是否大部分时间感到快乐？' , reversed: true },
  { id: 8, text: '你是否常常感到无能为力？' },
  { id: 9, text: '你是否宁愿待在家里而不愿外出做些有意义的活动？' },
  { id: 10, text: '你是否觉得自己的记忆力比其他老人差？' },
  { id: 11, text: '你是否觉得活着真好？' , reversed: true },
  { id: 12, text: '你是否觉得自己很没用？' },
  { id: 13, text: '你是否感到精力充沛？' , reversed: true },
  { id: 14, text: '你是否觉得自己的处境没有希望？' },
  { id: 15, text: '你是否觉得多数人比你活得更好？' },
  { id: 16, text: '你是否常常因为一点小事而伤心？' },
  { id: 17, text: '你是否常常感到想哭？' },
  { id: 18, text: '你是否集中精神有困难？' },
  { id: 19, text: '你是否喜欢每天早晨起床？' , reversed: true },
  { id: 20, text: '你是否不愿意参加集体活动？' },
  { id: 21, text: '你是否觉得为自己的生活作决定有困难？' },
  { id: 22, text: '你是否觉得头脑不如以前清楚？' },
  { id: 23, text: '你是否觉得自己有活力？' , reversed: true },
  { id: 24, text: '你是否觉得自己的处境没有希望？' },
  { id: 25, text: '你是否觉得多数人活得比自己好？' },
  { id: 26, text: '你是否常常因为小事情而伤心难过？' },
  { id: 27, text: '你是否常常想哭？' },
  { id: 28, text: '你是否集中精神有困难？' },
  { id: 29, text: '你是否喜欢每天早晨起床？' , reversed: true },
  { id: 30, text: '你是否不喜欢参加集体活动？' },
];

/** 复杂性哀伤量表 ICG（Prigerson）核心 19 题（≥25 提示高风险） */
const ICG_ITEMS: AssessmentItem[] = [
  { id: 1, text: '想到逝者时，我仍然感到悲伤和痛苦' },
  { id: 2, text: '想到逝者时，我常想起他/她曾经的样子' },
  { id: 3, text: '想到逝者时，我很难做该做的事' },
  { id: 4, text: '想到逝者时，我常感到孤单或空虚' },
  { id: 5, text: '想到逝者时，我常感到紧张或焦虑' },
  { id: 6, text: '想到逝者时，我会情不自禁地哭出来' },
  { id: 7, text: '想到逝者时，我试着不去想他/她' },
  { id: 8, text: '想到逝者时，我会避免去那些让我想起他/她的地方' },
  { id: 9, text: '想到逝者时，我觉得自己的生活没有意义' },
  { id: 10, text: '想到逝者时，我很难相信他/她真的走了' },
  { id: 11, text: '想到逝者时，我感到自己好像被麻痹了' },
  { id: 12, text: '想到逝者时，我常责备自己对他/她不够好' },
  { id: 13, text: '想到逝者时，我常感到愤怒' },
  { id: 14, text: '想到逝者时，我对他/她如何去世的画面感到痛苦' },
  { id: 15, text: '想到逝者时，我会因为他/她的去世而责备别人' },
  { id: 16, text: '想到逝者时，我会嫉妒那些没有失去亲人的人' },
  { id: 17, text: '想到逝者时，我觉得生命不公平' },
  { id: 18, text: '想到逝者时，我常感到愤愤不平' },
  { id: 19, text: '想到逝者时，我感到难以信任别人' },
];

/** 患者尊严量表 PDI 简化版（12 题，1-5 分） */
const PDI_ITEMS: AssessmentItem[] = [
  { id: 1, text: '我感到自己不再被需要了' },
  { id: 2, text: '我感到自己无法再为他人做有意义的事' },
  { id: 3, text: '我感到自己的存在是家人的负担' },
  { id: 4, text: '我对自己的身体状况感到羞耻' },
  { id: 5, text: '我感到失去自尊' },
  { id: 6, text: '我感到自己无法完成重要的事' },
  { id: 7, text: '我担心自己的疾病给家人带来负担' },
  { id: 8, text: '我感到生活失去意义' },
  { id: 9, text: '我感到对自己的未来失去希望' },
  { id: 10, text: '我感到自己不再像以前那样被尊重' },
  { id: 11, text: '我感到被剥夺了做重要决定的权利' },
  { id: 12, text: '我感到难以维持日常的尊严感' },
];

/** 社会支持评定量表 SSRS（10 题简版） */
const SSRS_ITEMS: AssessmentItem[] = [
  { id: 1, text: '您有多少关系密切、可以得到支持和帮助的朋友？', /* 1-4 数量 */ reversed: true },
  { id: 2, text: '近一年来您与谁住在一起？', reversed: true },
  { id: 3, text: '您与邻居关系如何？', reversed: true },
  { id: 4, text: '您与同事关系如何？', reversed: true },
  { id: 5, text: '从家庭成员得到的支持和照顾（夫妻/父母/儿女/兄弟姐妹）', reversed: true },
  { id: 6, text: '过去在您遇到急难情况时，曾经得到的经济或实际帮助的来源有多少？', reversed: true },
  { id: 7, text: '过去在您遇到急难情况时，曾经得到的安慰和关心的来源有多少？', reversed: true },
  { id: 8, text: '您遇到烦恼时的倾诉方式', reversed: true },
  { id: 9, text: '您遇到烦恼时的求助方式', reversed: true },
  { id: 10, text: '对于团体（如党组织、宗教组织、工会等）组织活动，您参加的情况', reversed: true },
];

/* ---------------- 计分逻辑 ---------------- */

function levelOf(total: number, thresholds: { upTo: number; label: string; color: ScoreLevel['color'] }[]): ScoreLevel {
  for (const t of thresholds) {
    if (total <= t.upTo) return { label: t.label, color: t.color };
  }
  return thresholds[thresholds.length - 1];
}

function sumAnswers(answers: Record<number, number>, items: AssessmentItem[]): number {
  return items.reduce((acc, it) => {
    const v = answers[it.id];
    if (v === undefined) return acc;
    return acc + v;
  }, 0);
}

/* SAS：粗分 × 1.25 = 标准分 */
const SAS: Assessment = {
  id: 'sas',
  name: 'SAS',
  fullName: '焦虑自评量表（Self-rating Anxiety Scale）',
  purpose: '评估焦虑症状的严重程度，适用于成人焦虑筛查。',
  category: '情绪',
  duration: '约 5 分钟',
  items: SAS_ITEMS,
  options: SAS_OPTIONS,
  scoring: (answers) => {
    const raw = sumAnswers(answers, SAS_ITEMS);
    const standard = Math.round(raw * 1.25);
    const level = levelOf(standard, [
      { upTo: 49, label: '无明显焦虑', color: 'green' },
      { upTo: 59, label: '轻度焦虑', color: 'yellow' },
      { upTo: 69, label: '中度焦虑', color: 'orange' },
      { upTo: 100, label: '重度焦虑', color: 'red' },
    ]);
    const recommendations = [
      '情绪安抚、放松训练（腹式呼吸、渐进性肌肉放松）',
      '陪伴倾听与认知重构',
      '中重度建议转介心理治疗师',
      '重度需评估是否合并惊恐发作或躯体症状',
    ];
    return {
      total: standard,
      dimensions: [{ name: '标准分', value: standard, max: 100, level }],
      level,
      interpretation: `粗分 ${raw} 分，标准分 ${standard} 分（粗分 × 1.25）。当前为${level.label}。`,
      recommendations,
    };
  },
};

/* SDS：粗分 × 1.25 = 标准分 */
const SDS: Assessment = {
  id: 'sds',
  name: 'SDS',
  fullName: '抑郁自评量表（Self-rating Depression Scale）',
  purpose: '评估抑郁症状的严重程度，适用于成人抑郁筛查。',
  category: '情绪',
  duration: '约 5 分钟',
  items: SDS_ITEMS,
  options: SDS_OPTIONS,
  scoring: (answers) => {
    const raw = sumAnswers(answers, SDS_ITEMS);
    const standard = Math.round(raw * 1.25);
    const level = levelOf(standard, [
      { upTo: 52, label: '无明显抑郁', color: 'green' },
      { upTo: 62, label: '轻度抑郁', color: 'yellow' },
      { upTo: 72, label: '中度抑郁', color: 'orange' },
      { upTo: 100, label: '重度抑郁', color: 'red' },
    ]);
    return {
      total: standard,
      dimensions: [{ name: '标准分', value: standard, max: 100, level }],
      level,
      interpretation: `粗分 ${raw} 分，标准分 ${standard} 分（粗分 × 1.25）。当前为${level.label}。`,
      recommendations: [
        '心理支持、行为激活、生命回顾',
        '建立日常规律与微小目标',
        '中重度建议转介心理或精神科评估',
        '⚠️ 若题项 19（"认为死了别人会生活得更好"）得分 ≥3，务必评估自杀风险',
      ],
    };
  },
};

const GAD7: Assessment = {
  id: 'gad7',
  name: 'GAD-7',
  fullName: '广泛性焦虑量表（Generalized Anxiety Disorder 7-item）',
  purpose: '快速筛查广泛性焦虑障碍，适用于初级保健与社工初评。',
  category: '情绪',
  duration: '约 2 分钟',
  items: GAD_ITEMS,
  options: GAD_OPTIONS,
  scoring: (answers) => {
    const total = sumAnswers(answers, GAD_ITEMS);
    const level = levelOf(total, [
      { upTo: 4, label: '无明显焦虑', color: 'green' },
      { upTo: 9, label: '轻度焦虑', color: 'yellow' },
      { upTo: 14, label: '中度焦虑', color: 'orange' },
      { upTo: 21, label: '重度焦虑', color: 'red' },
    ]);
    return {
      total,
      dimensions: [{ name: '总分', value: total, max: 21, level }],
      level,
      interpretation: `总分 ${total}/21。当前为${level.label}。`,
      recommendations: [
        '放松训练（腹式呼吸、渐进性肌肉放松）',
        '认知重构与焦虑教育',
        '≥10 分建议进一步评估，必要时转介心理治疗',
      ],
    };
  },
};

const PHQ9: Assessment = {
  id: 'phq9',
  name: 'PHQ-9',
  fullName: '患者健康问卷抑郁量表（Patient Health Questionnaire-9）',
  purpose: '抑郁症状筛查与严重程度评估，含自杀意念题项。',
  category: '情绪',
  duration: '约 3 分钟',
  items: PHQ_ITEMS,
  options: PHQ_OPTIONS,
  scoring: (answers) => {
    const total = sumAnswers(answers, PHQ_ITEMS);
    const level = levelOf(total, [
      { upTo: 4, label: '无明显抑郁', color: 'green' },
      { upTo: 9, label: '轻度抑郁', color: 'yellow' },
      { upTo: 14, label: '中度抑郁', color: 'orange' },
      { upTo: 19, label: '中重度抑郁', color: 'red' },
      { upTo: 27, label: '重度抑郁', color: 'red' },
    ]);
    return {
      total,
      dimensions: [{ name: '总分', value: total, max: 27, level }],
      level,
      interpretation: `总分 ${total}/27。当前为${level.label}。`,
      recommendations: [
        '心理支持、行为激活、社会联结',
        '≥10 分建议转介心理/精神科',
        '⚠️ 题项 9（自杀意念）得分 ≥1，必须进一步评估安全风险',
      ],
    };
  },
};

const GDS30: Assessment = {
  id: 'gds',
  name: 'GDS-30',
  fullName: '老年抑郁量表（Geriatric Depression Scale, 30-item）',
  purpose: '针对老年人群的抑郁评估，问句简单、避免躯体症状干扰。',
  category: '老年',
  duration: '约 8 分钟',
  items: GDS_ITEMS,
  options: GDS_OPTIONS,
  scoring: (answers) => {
    const total = sumAnswers(answers, GDS_ITEMS);
    const level = levelOf(total, [
      { upTo: 10, label: '无抑郁', color: 'green' },
      { upTo: 20, label: '轻度抑郁', color: 'yellow' },
      { upTo: 30, label: '中重度抑郁', color: 'red' },
    ]);
    return {
      total,
      dimensions: [{ name: '总分', value: total, max: 30, level }],
      level,
      interpretation: `总分 ${total}/30。当前为${level.label}。`,
      recommendations: [
        '陪伴访谈、文娱活动破冰',
        '中重度或持续高分者转介精神心理科',
        '尊重老年生命回顾需求，融入意义建构',
      ],
    };
  },
};

const ICG_SCALE: Assessment = {
  id: 'icg',
  name: 'ICG',
  fullName: '复杂性哀伤量表（Inventory of Complicated Grief）',
  purpose: '筛查延长哀伤障碍（PGD）高风险人群。',
  category: '哀伤',
  duration: '约 6 分钟',
  items: ICG_ITEMS,
  options: ICG_OPTIONS,
  scoring: (answers) => {
    const total = sumAnswers(answers, ICG_ITEMS);
    const level = levelOf(total, [
      { upTo: 24, label: '正常哀伤范围', color: 'green' },
      { upTo: 100, label: '复杂性哀伤高风险', color: 'red' },
    ]);
    return {
      total,
      dimensions: [{ name: '总分', value: total, max: 76, level }],
      level,
      interpretation: `总分 ${total}/76。${total >= 25 ? '≥25 分提示延长哀伤高风险，需评估是否符合 ICD-11 PGD 标准。' : '当前在正常哀伤范围。'}`,
      recommendations: [
        '正常化哀伤反应、鼓励情绪表达',
        '持续联结取向的纪念活动',
        '≥25 分建议转介专业哀伤治疗，社工跟进资源链接',
      ],
    };
  },
};

const PDI_SCALE: Assessment = {
  id: 'pdi',
  name: 'PDI',
  fullName: '患者尊严量表（Patient Dignity Inventory）',
  purpose: '评估临终患者尊严困扰的程度与来源。',
  category: '尊严',
  duration: '约 5 分钟',
  items: PDI_ITEMS,
  options: PDI_OPTIONS,
  scoring: (answers) => {
    const total = sumAnswers(answers, PDI_ITEMS);
    const level = levelOf(total, [
      { upTo: 24, label: '轻度尊严困扰', color: 'green' },
      { upTo: 36, label: '中度尊严困扰', color: 'yellow' },
      { upTo: 60, label: '重度尊严困扰', color: 'red' },
    ]);
    return {
      total,
      dimensions: [{ name: '总分', value: total, max: 60, level }],
      level,
      interpretation: `总分 ${total}/60，分数越高尊严困扰越重。当前为${level.label}。`,
      recommendations: [
        '尊严疗法（结构化访谈 + 代际传承文件）',
        '意义建构、生命回顾',
        '尊重自主权，强化参与照护决策',
      ],
    };
  },
};

const SSRS_SCALE: Assessment = {
  id: 'ssrs',
  name: 'SSRS',
  fullName: '社会支持评定量表（Social Support Rating Scale）',
  purpose: '评估主观支持、客观支持与支持利用度三个维度。',
  category: '社会支持',
  duration: '约 5 分钟',
  items: SSRS_ITEMS,
  options: [
    { value: 1, label: '极少 / 无' },
    { value: 2, label: '一般' },
    { value: 3, label: '较多' },
    { value: 4, label: '全力 / 很多' },
  ],
  scoring: (answers) => {
    const subjective = (answers[3] ?? 0) + (answers[4] ?? 0) + (answers[5] ?? 0);
    const objective = (answers[1] ?? 0) + (answers[2] ?? 0) + (answers[6] ?? 0) + (answers[7] ?? 0);
    const utilization = (answers[8] ?? 0) + (answers[9] ?? 0) + (answers[10] ?? 0);
    const total = subjective + objective + utilization;
    const max = 30;
    const level = levelOf(max - total, [
      { upTo: 8, label: '社会支持良好', color: 'green' },
      { upTo: 17, label: '社会支持一般', color: 'yellow' },
      { upTo: 30, label: '社会支持不足', color: 'red' },
    ]);
    return {
      total,
      dimensions: [
        { name: '客观支持', value: objective, max: 16, level: undefined },
        { name: '主观支持', value: subjective, max: 12, level: undefined },
        { name: '支持利用度', value: utilization, max: 12, level: undefined },
      ],
      level,
      interpretation: `总分 ${total}/30，分量表中客观支持 ${objective}/16、主观支持 ${subjective}/12、支持利用度 ${utilization}/12。当前评估为${level.label}。`,
      recommendations: [
        '链接正式支持（医护、社工、政策、慈善）',
        '激活非正式支持（家属、朋辈、志愿者）',
        '组织或转介支持小组',
      ],
    };
  },
};

/* ---------------- 导出 ---------------- */

export const ASSESSMENTS: Assessment[] = [SAS, SDS, GAD7, PHQ9, GDS30, ICG_SCALE, PDI_SCALE, SSRS_SCALE];

export function getAssessment(id: string): Assessment | undefined {
  return ASSESSMENTS.find((a) => a.id === id);
}

export const LEVEL_COLORS: Record<ScoreLevel['color'], string> = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-200',
};

export const LEVEL_BAR_COLORS: Record<ScoreLevel['color'], string> = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  gray: 'bg-gray-500',
};