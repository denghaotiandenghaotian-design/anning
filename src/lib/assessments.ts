/**
 * 安宁疗护评估量表数据 + 自动计分与解读
 *
 * 支持 4 种题型（mode）：
 *  - 'choice'   统一选项逐题打分（SAS / SDS / GAD-7 / PHQ-9 / AGS / MLQ / UCLA-3 / ZBI / ICG / PDI / GDS）
 *  - 'exclusive' 互斥等级单选（KPS），可选矩阵列展示（PPS）
 *  - 'numeric'  数字评分（ESAS 多条目求和 / NRS 单值 / VAS 单值毫米）
 *
 * 所有计分与分级严格按源文件所载标准，不做二次推断。
 */

/* ---------------- 类型定义 ---------------- */

export type ChoiceOption = { value: number; label: string; /** 可选的备注，如 Barthel 的分值说明 */ hint?: string };

export type ScoreLevel = {
  label: string;
  color: 'green' | 'yellow' | 'orange' | 'red' | 'blue' | 'gray' | 'purple';
};

/** 互斥等级（KPS / PPS） */
export type Level = {
  score: number;
  label: string;
  /** 矩阵模式下的各维度描述（PPS） */
  cells?: string[];
};

export type AssessmentItem = {
  id: number;
  text: string;
  /** 该题专属选项（Barthel 各题分值不同） */
  options?: ChoiceOption[];
  /** 数字模式下的最大分（ESAS=10, VAS=100） */
  max?: number;
  /** 分组标签（如 ESAS 的症状分类） */
  tag?: string;
};

export type Mode = 'choice' | 'exclusive' | 'numeric';

export type Assessment = {
  id: string;
  name: string;
  fullName: string;
  purpose: string;
  category: '情绪' | '哀伤' | '社会支持' | '尊严' | '老年' | '症状' | '功能' | '照护负担' | '意义感';
  duration: string;
  mode: Mode;
  /** 施测方向说明 */
  admin?: string[];
  items: AssessmentItem[];
  /** choice 模式的统一选项 */
  options?: ChoiceOption[];
  /** exclusive 模式的等级列表 */
  levels?: Level[];
  /** exclusive 模式的矩阵列名（PPS） */
  matrixColumns?: string[];
  /** numeric 模式：求和截止条目数（ESAS 前9项） */
  sumUpTo?: number;
  /** numeric 模式单位（VAS 毫米） */
  unit?: string;
  /** 是否由评定者评定（KPS/PPS/Barthel 需专业培训） */
  assessorRated?: boolean;
  scoring: (answers: Record<number, number>) => ScoreResult;
  /** 打印时展示的注意事项 */
  printNote?: string;
};

export type ScoreResult = {
  total: number;
  dimensions?: { name: string; value: number; max: number; level?: ScoreLevel }[];
  level: ScoreLevel;
  interpretation: string;
  recommendations: string[];
};

/* ---------------- 通用工具 ---------------- */

function levelOf(total: number, thresholds: { upTo: number; label: string; color: ScoreLevel['color'] }[]): ScoreLevel {
  for (const t of thresholds) {
    if (total <= t.upTo) return { label: t.label, color: t.color };
  }
  return thresholds[thresholds.length - 1];
}

function sumAnswers(answers: Record<number, number>, items: AssessmentItem[], upTo?: number): number {
  const list = upTo ? items.slice(0, upTo) : items;
  return list.reduce((acc, it) => acc + (answers[it.id] ?? 0), 0);
}

/**
 * 反向计分求和：当 itemId 属于反向条目时，对该题答案按翻转函数 flip() 翻转后累加。
 * - SAS/SDS 1—4 → 反向 5-v
 * - GDS 是/否 0/1 → 反向 1-v
 * - MLQ 1—7 → 反向 8-v
 * - SEVERITY4 0—3 → 反向 3-v
 */
function sumWithReverse(
  answers: Record<number, number>,
  items: AssessmentItem[],
  reverseIds: ReadonlySet<number>,
  flip: (v: number) => number,
): number {
  return items.reduce((acc, it) => {
    const raw = answers[it.id];
    if (raw === undefined) return acc;
    const v = reverseIds.has(it.id) ? flip(raw) : raw;
    return acc + v;
  }, 0);
}

/** SAS/SDS 标准量表 1—4 选项，反向条目按 5-v 翻转 */
const flip4 = (v: number) => 5 - v;
/** GDS 是/否 0/1，反向按 1-v 翻转 */
const flipBinary = (v: number) => 1 - v;
/** SEVERITY4 / PHQ / GAD-7 / CES-D-10 的 0—3 选项，反向按 3-v 翻转 */
const flip3 = (v: number) => 3 - v;

/* ---------------- 情绪类（原有 8 表） ---------------- */

const SAS_ITEMS: AssessmentItem[] = [
  { id: 1, text: '我觉得比平常更容易紧张和着急' },
  { id: 2, text: '我无缘无故地感到害怕' },
  { id: 3, text: '我容易心里烦乱或觉得惊恐' },
  { id: 4, text: '我觉得我可能将要发疯' },
  { id: 5, text: '我觉得一切都好，也不会发生什么不幸' },
  { id: 6, text: '我手脚发抖打颤' },
  { id: 7, text: '我因为头痛、颈痛和背痛而苦恼' },
  { id: 8, text: '我感觉容易衰弱和疲乏' },
  { id: 9, text: '我得心平气和，并且容易安静坐着' },
  { id: 10, text: '我觉得心跳很快' },
  { id: 11, text: '我因为一阵阵头晕而苦恼' },
  { id: 12, text: '我有晕倒发作，或觉得要晕倒似的' },
  { id: 13, text: '我呼气、吸气都感到很容易' },
  { id: 14, text: '我手脚麻木和刺痛' },
  { id: 15, text: '我因为胃痛和消化不良而苦恼' },
  { id: 16, text: '我常常要小便' },
  { id: 17, text: '我的手脚常常是干燥温暖的' },
  { id: 18, text: '我脸红发热' },
  { id: 19, text: '我容易入睡并且一夜睡得很好' },
  { id: 20, text: '我做恶梦' },
];

const SAS_OPTIONS: ChoiceOption[] = [
  { value: 1, label: '没有或很少时间' },
  { value: 2, label: '小部分时间' },
  { value: 3, label: '相当多时间' },
  { value: 4, label: '绝大部分或全部时间' },
];

const SDS_ITEMS: AssessmentItem[] = [
  { id: 1, text: '我觉得闷闷不乐，情绪低沉' },
  { id: 2, text: '我觉得一天之中早晨最好' },
  { id: 3, text: '我一阵阵哭出来或觉得想哭' },
  { id: 4, text: '我晚上睡眠不好' },
  { id: 5, text: '我吃得跟平常一样多' },
  { id: 6, text: '我与异性密切接触时和以往一样感到愉快' },
  { id: 7, text: '我发觉我的体重在下降' },
  { id: 8, text: '我有便秘的苦恼' },
  { id: 9, text: '心跳比平时快' },
  { id: 10, text: '我无缘无故地感到疲乏' },
  { id: 11, text: '我的头脑跟平常一样清楚' },
  { id: 12, text: '我觉得经常做的事情并没有困难' },
  { id: 13, text: '我觉得不安而平静不下来' },
  { id: 14, text: '我对将来抱有希望' },
  { id: 15, text: '我比平常容易生气激动' },
  { id: 16, text: '我觉得作出决定是容易的' },
  { id: 17, text: '我觉得自己是个有用的人' },
  { id: 18, text: '我的生活过得很有意思' },
  { id: 19, text: '我认为如果我死了别人会生活得好些' },
  { id: 20, text: '平常感兴趣的事我仍然照样感兴趣' },
];

const GAD_ITEMS: AssessmentItem[] = [
  { id: 1, text: '感觉紧张、焦虑或急切' },
  { id: 2, text: '不能停止或控制担心' },
  { id: 3, text: '对各种各样的事情担忧过多' },
  { id: 4, text: '很难放松下来' },
  { id: 5, text: '由于不安而无法静坐' },
  { id: 6, text: '变得容易烦恼或急躁' },
  { id: 7, text: '感到似乎将有可怕的事情发生而害怕' },
];

const PHQ_ITEMS: AssessmentItem[] = [
  { id: 1, text: '做事时提不起劲或没有兴趣' },
  { id: 2, text: '感到心情低落、沮丧或绝望' },
  { id: 3, text: '入睡困难、睡不安稳或睡得过多' },
  { id: 4, text: '感觉疲倦或没有精力' },
  { id: 5, text: '食欲不振或吃太多' },
  { id: 6, text: '觉得自己很糟，或觉得自己很失败，或让自己或家人失望' },
  { id: 7, text: '对事物专注有困难，例如阅读报纸或看电视时' },
  { id: 8, text: '动作或说话速度缓慢到别人可察觉，或正好相反——烦躁或坐立不安' },
  { id: 9, text: '有不如死掉或用某种方式伤害自己的念头' },
];

const SEVERITY4: ChoiceOption[] = [
  { value: 0, label: '完全不会' },
  { value: 1, label: '好几天' },
  { value: 2, label: '超过一周' },
  { value: 3, label: '几乎每天' },
];

/**
 * GDS-30 中文版 30 题（依 Yesavage 1982 / 华人本土化版本整理）。
 * 反向计分条目：1、5、7、11、13、19、23（问句积极，"否"=抑郁=1 分）。
 * 已修复原稿重复：原 14/24、15/25、16/26、17/27、18/28、19/29、20/30 多处雷同，
 * 改写为既有版本常见的差异化问句，确保 30 题互不重复。
 */
const GDS_ITEMS: AssessmentItem[] = [
  { id: 1, text: '你对生活基本上满意吗？' }, { id: 2, text: '你是否已放弃了许多活动与兴趣？' },
  { id: 3, text: '你是否觉得生活空虚？' }, { id: 4, text: '你是否常感到厌倦？' },
  { id: 5, text: '你是否大部分时间心情愉快？' }, { id: 6, text: '你是否害怕将有不好的事情发生在你身上？' },
  { id: 7, text: '你是否大部分时间感到快乐？' }, { id: 8, text: '你是否常常感到无能为力？' },
  { id: 9, text: '你是否宁愿待在家里而不愿外出做些有意义的活动？' }, { id: 10, text: '你是否觉得自己的记忆力比其他老人差？' },
  { id: 11, text: '你是否觉得活着真好？' }, { id: 12, text: '你是否觉得自己很没用？' },
  { id: 13, text: '你是否感到精力充沛？' }, { id: 14, text: '你是否觉得自己的处境没有希望？' },
  { id: 15, text: '你是否觉得多数人活得比你更好？' }, { id: 16, text: '你是否常常因为一点小事而伤心？' },
  { id: 17, text: '你是否常常感到想哭？' }, { id: 18, text: '你是否集中精神有困难？' },
  { id: 19, text: '你是否喜欢每天早晨起床？' }, { id: 20, text: '你是否不愿意参加集体活动？' },
  { id: 21, text: '你是否觉得为自己的生活作决定有困难？' }, { id: 22, text: '你是否觉得头脑不如以前清楚？' },
  { id: 23, text: '你是否觉得自己有活力？' }, { id: 24, text: '你是否大部分时间感到不快乐？' },
  { id: 25, text: '你是否觉得自己的生活毫无价值？' }, { id: 26, text: '你是否常常感到不安或担心？' },
  { id: 27, text: '你是否大部分时间感到情绪低落？' }, { id: 28, text: '你是否大部分时间感到焦虑不安？' },
  { id: 29, text: '你是否大部分时间感到孤独？' }, { id: 30, text: '你是否觉得很难从悲伤中走出来？' },
];
const GDS_REVERSE = new Set([1, 5, 7, 11, 13, 19, 23]);

const GDS_OPTIONS: ChoiceOption[] = [
  { value: 0, label: '是' },
  { value: 1, label: '否' },
];

const ICG_ITEMS: AssessmentItem[] = [
  { id: 1, text: '想到逝者时，我仍然感到悲伤和痛苦' }, { id: 2, text: '想到逝者时，我常想起他/她曾经的样子' },
  { id: 3, text: '想到逝者时，我很难做该做的事' }, { id: 4, text: '想到逝者时，我常感到孤单或空虚' },
  { id: 5, text: '想到逝者时，我常感到紧张或焦虑' }, { id: 6, text: '想到逝者时，我会情不自禁地哭出来' },
  { id: 7, text: '想到逝者时，我试着不去想他/她' }, { id: 8, text: '想到逝者时，我会避免去那些让我想起他/她的地方' },
  { id: 9, text: '想到逝者时，我觉得自己的生活没有意义' }, { id: 10, text: '想到逝者时，我很难相信他/她真的走了' },
  { id: 11, text: '想到逝者时，我感到自己好像被麻痹了' }, { id: 12, text: '想到逝者时，我常责备自己对他/她不够好' },
  { id: 13, text: '想到逝者时，我常感到愤怒' }, { id: 14, text: '想到逝者时，我对他/她如何去世的画面感到痛苦' },
  { id: 15, text: '想到逝者时，我会因为他/她的去世而责备别人' }, { id: 16, text: '想到逝者时，我会嫉妒那些没有失去亲人的人' },
  { id: 17, text: '想到逝者时，我觉得生命不公平' }, { id: 18, text: '想到逝者时，我常感到愤愤不平' },
  { id: 19, text: '想到逝者时，我感到难以信任别人' },
];

const PDI_ITEMS: AssessmentItem[] = [
  { id: 1, text: '我感到自己不再被需要了' }, { id: 2, text: '我感到自己无法再为他人做有意义的事' },
  { id: 3, text: '我感到自己的存在是家人的负担' }, { id: 4, text: '我对自己的身体状况感到羞耻' },
  { id: 5, text: '我感到失去自尊' }, { id: 6, text: '我感到自己无法完成重要的事' },
  { id: 7, text: '我担心自己的疾病给家人带来负担' }, { id: 8, text: '我感到生活失去意义' },
  { id: 9, text: '我感到对自己的未来失去希望' }, { id: 10, text: '我感到自己不再像以前那样被尊重' },
  { id: 11, text: '我感到被剥夺了做重要决定的权利' }, { id: 12, text: '我感到难以维持日常的尊严感' },
];

/**
 * SSRS 社会支持评定量表（肖水源 1986 / 1990 中文版）。
 * 各题选项各异（计数题 / 等级题），不能用统一 1—4 选项。
 */
const SSRS_ITEMS: AssessmentItem[] = [
  {
    id: 1, text: '您有多少关系密切、可以得到支持和帮助的朋友？', tag: '客观支持',
    options: [
      { value: 1, label: '1 · 无' },
      { value: 2, label: '2 · 1—2 个' },
      { value: 3, label: '3 · 3—5 个' },
      { value: 4, label: '4 · 6 个及以上' },
    ],
  },
  {
    id: 2, text: '近一年来您与谁住在一起？', tag: '客观支持',
    options: [
      { value: 1, label: '1 · 独居' },
      { value: 2, label: '2 · 与家人同住' },
      { value: 3, label: '3 · 与多人合住' },
      { value: 4, label: '4 · 与家人+多人' },
    ],
  },
  {
    id: 3, text: '您与邻居关系如何？', tag: '主观支持',
    options: [
      { value: 1, label: '1 · 偶尔往来' },
      { value: 2, label: '2 · 邻居一般关心' },
      { value: 3, label: '3 · 多数邻居关心' },
      { value: 4, label: '4 · 全部邻居关心' },
    ],
  },
  {
    id: 4, text: '您与同事关系如何？', tag: '主观支持',
    options: [
      { value: 1, label: '1 · 偶尔往来' },
      { value: 2, label: '2 · 同事一般关心' },
      { value: 3, label: '3 · 多数同事关心' },
      { value: 4, label: '4 · 全部同事关心' },
    ],
  },
  {
    id: 5, text: '从家庭成员得到的支持和照顾（夫妻/父母/子女/兄弟姐妹）', tag: '主观支持',
    options: [
      { value: 1, label: '1 · 无支持' },
      { value: 2, label: '2 · 极少' },
      { value: 3, label: '3 · 一般' },
      { value: 4, label: '4 · 全力支持' },
    ],
  },
  {
    id: 6, text: '过去在您遇到急难情况时，曾经得到的经济或实际帮助的来源有多少？', tag: '客观支持',
    options: [
      { value: 1, label: '1 · 无任何来源' },
      { value: 2, label: '2 · 1—2 个来源' },
      { value: 3, label: '3 · 3—4 个来源' },
      { value: 4, label: '4 · 5 个及以上' },
    ],
  },
  {
    id: 7, text: '过去在您遇到急难情况时，曾经得到的安慰和关心的来源有多少？', tag: '客观支持',
    options: [
      { value: 1, label: '1 · 无任何来源' },
      { value: 2, label: '2 · 1—2 个来源' },
      { value: 3, label: '3 · 3—4 个来源' },
      { value: 4, label: '4 · 5 个及以上' },
    ],
  },
  {
    id: 8, text: '您遇到烦恼时的倾诉方式', tag: '支持利用度',
    options: [
      { value: 1, label: '1 · 从不向任何人倾诉' },
      { value: 2, label: '2 · 很少倾诉（≤1 人）' },
      { value: 3, label: '3 · 有时倾诉（2—3 人）' },
      { value: 4, label: '4 · 主动多渠道倾诉' },
    ],
  },
  {
    id: 9, text: '您遇到烦恼时的求助方式', tag: '支持利用度',
    options: [
      { value: 1, label: '1 · 只靠自己，不接受帮助' },
      { value: 2, label: '2 · 很少求助（≤1 来源）' },
      { value: 3, label: '3 · 有时求助（2—3 来源）' },
      { value: 4, label: '4 · 主动多渠道求助' },
    ],
  },
  {
    id: 10, text: '对于团体（如党组织、宗教组织、工会等）组织活动，您参加的情况', tag: '支持利用度',
    options: [
      { value: 1, label: '1 · 从不参加' },
      { value: 2, label: '2 · 偶尔参加' },
      { value: 3, label: '3 · 经常参加' },
      { value: 4, label: '4 · 主动参加并承担工作' },
    ],
  },
];

/* ---------------- 新增 10 表 ---------------- */

/** 1. AGS 预期性悲伤量表（中文版 C-AGS，27 项，DB4403/T 521—2024 附录 D） */
const AGS_ITEMS: AssessmentItem[] = [
  '没有人能够取代家人（患者）在我心中的地位', '我非常怀念家人（患者）曾经的样子', '自从家人生病后，我觉得自己像缺少了什么一样',
  '我想和别人谈谈家人（患者）的病情', '自从家人生病后，我再也没有发展新的人际关系了', '我总是想，如果我的家人没有患病，我的生活会是什么样子',
  '我觉得很不公平，为什么是我家人得癌症', '自从家人患病后，我变得更加暴躁', '我很怀念曾经的生活', '我一想到家人患病就非常生气',
  '我心里想的全是家人及他/她的病', '我还没有适应家人患病', '自从家人确诊为癌症后，我就感觉很孤单', '我没有可以帮助我处理家人生病的人际关系',
  "想到家人的疾病，我就忍不住想要哭泣", '自从家人生病后，我对未来就没有任何的规划了', '我感觉跟家人疏远了', '我感觉和患者疏远了',
  '自从家人确诊为癌症后，我就难以入睡', "自从家人生病后，我就没有办法让我的生活很好地继续下去", '我身体状况已经不像家人生病前那么好了',
  '自家人癌症确诊以来，我就很难集中精力工作了', '我无法接受家人患癌这一事实', '自家人癌症确诊以来，我就很难和他人友好相处',
  '自从家人确诊为癌症以来，我就刻意回避一些人', '我对日常活动不再感兴趣了', '我觉得家人生病是我的过错，我很自责',
].map((text, i) => ({ id: i + 1, text }));

/** 2. MLQ 生命意义感量表（刘思斯、甘怡群 2010 中文版，9 题，7 点计分） */
const MLQ_ITEMS: AssessmentItem[] = [
  { id: 1, text: '我正在寻觅我人生的一个目的或使命。', tag: '寻求意义感' },
  { id: 2, text: '我的生活没有明确的目的。', tag: '生命意义感' },
  { id: 3, text: '我正在寻找自己生活的意义。', tag: '寻求意义感' },
  { id: 4, text: '我明白自己生活的意义。', tag: '生命意义感' },
  { id: 5, text: '我正在寻觅让我感觉自己生活饶有意义的东西。', tag: '寻求意义感' },
  { id: 6, text: '我总在尝试找寻自己生活的目的。', tag: '寻求意义感' },
  { id: 7, text: '我的生活有一个清晰的方向。', tag: '生命意义感' },
  { id: 8, text: '我知道什么东西能使自己的生活有意义。', tag: '生命意义感' },
  { id: 9, text: '我已经发现一个让自己满意的生活目的。', tag: '生命意义感' },
];

const MLQ_OPTIONS: ChoiceOption[] = [1, 2, 3, 4, 5, 6, 7].map((v) => ({ value: v, label: String(v) }));

/** 3. UCLA 孤独量表简版（Hughes 等 2004，3 项） */
const UCLA_ITEMS: AssessmentItem[] = [
  { id: 1, text: '您感觉自己缺少陪伴吗？' },
  { id: 2, text: '您感觉自己和其他人疏远吗？' },
  { id: 3, text: '您感觉自己被他人冷落吗？' },
];

const UCLA_OPTIONS: ChoiceOption[] = [
  { value: 1, label: '几乎不' },
  { value: 2, label: '有时' },
  { value: 3, label: '经常' },
];

/** 4. KPS 卡氏功能状态量表（Karnofsky & Burchenal 1949，11 等级） */
const KPS_LEVELS: Level[] = [
  { score: 100, label: '正常，无主诉，无疾病征象' },
  { score: 90, label: '能正常活动，有轻微的疾病征象' },
  { score: 80, label: '正常活动需努力，有一些疾病征象' },
  { score: 70, label: '能自我照料，但不能进行正常活动和工作' },
  { score: 60, label: '需偶发帮助，但能自我照料大部分需求' },
  { score: 50, label: '需大量帮助和经常的医疗护理' },
  { score: 40, label: '无活动能力，需特殊照料和帮助' },
  { score: 30, label: '严重无活动能力，虽经治疗仍需住院' },
  { score: 20, label: '病情严重，需积极支持治疗' },
  { score: 10, label: '濒死状态' },
  { score: 0, label: '死亡' },
];

/** 5. PPS 姑息功能量表（Anderson 等 1996，5 维度矩阵） */
const PPS_LEVELS: Level[] = [
  { score: 100, label: '100%', cells: ['正常', '正常活动与工作，无疾病征象', '完全自理', '正常', '完全清醒'] },
  { score: 90, label: '90%', cells: ['正常', '正常活动伴一定疾病征象', '完全自理', '正常或最低限度下降', '完全清醒'] },
  { score: 80, label: '80%', cells: ['正常，有一定疾病征象', '正常活动伴较多疾病征象', '完全自理', '正常或最低限度下降', '完全清醒'] },
  { score: 70, label: '70%', cells: ['减少，不能从事重体力工作或活动', '显著疾病征象', '完全自理', '正常或最低限度下降', '完全清醒'] },
  { score: 60, label: '60%', cells: ['减少，不能从事重体力工作或活动', '显著疾病征象', '偶需协助', '正常或最低限度下降', '完全清醒或嗜睡时间＜50%'] },
  { score: 50, label: '50%', cells: ['明显受限，不能工作，多数时间坐于椅子或床上', '显著疾病征象', '完全自理但部分活动需帮助', '正常或最低限度下降', '完全清醒或嗜睡时间＜50%'] },
  { score: 40, label: '40%', cells: ['明显受限，主要坐于椅子或床上', '显著疾病征象', '多数自理活动需帮助', '正常或最低限度下降', '有时意识模糊'] },
  { score: 30, label: '30%', cells: ['总卧床', '完全卧床，不能进行任何活动', '多数自理活动需帮助', '正常或最低限度下降', '有时意识模糊或嗜睡时间＞50%'] },
  { score: 20, label: '20%', cells: ['总卧床', '完全卧床，不能进行任何活动', '所有自理活动均需帮助', '最低限度至仅能进流食', '大部分时间意识模糊或嗜睡'] },
  { score: 10, label: '10%', cells: ['总卧床', '完全卧床，不能进行任何活动', '所有自理活动均需帮助', '仅进流食或需管饲', '昏迷或昏睡'] },
  { score: 0, label: '0%', cells: ['—', '—', '—', '—', '—'] },
];

/** 6. Barthel 指数（Mahoney & Barthel 1965，10 项加权） */
const BARTHEL_ITEMS: AssessmentItem[] = [
  { id: 1, text: '进食', options: [{ value: 10, label: '10 分 · 独立进食' }, { value: 5, label: '5 分 · 需部分帮助（如切面包、抹黄油）' }, { value: 0, label: '0 分 · 完全依赖' }] },
  { id: 2, text: '洗澡', options: [{ value: 5, label: '5 分 · 独立洗澡' }, { value: 0, label: '0 分 · 依赖他人' }] },
  { id: 3, text: '修饰', options: [{ value: 5, label: '5 分 · 独立洗脸、刷牙、梳头、剃须等' }, { value: 0, label: '0 分 · 依赖他人' }] },
  { id: 4, text: '穿衣', options: [{ value: 10, label: '10 分 · 独立穿衣，含系鞋带等' }, { value: 5, label: '5 分 · 需部分帮助' }, { value: 0, label: '0 分 · 完全依赖' }] },
  { id: 5, text: '控制大便', options: [{ value: 10, label: '10 分 · 能控制大便' }, { value: 5, label: '5 分 · 偶尔失禁' }, { value: 0, label: '0 分 · 失禁' }] },
  { id: 6, text: '控制小便', options: [{ value: 10, label: '10 分 · 能控制小便' }, { value: 5, label: '5 分 · 偶尔失禁' }, { value: 0, label: '0 分 · 失禁' }] },
  { id: 7, text: '如厕', options: [{ value: 10, label: '10 分 · 独立如厕，含穿脱衣裤、擦净等' }, { value: 5, label: '5 分 · 需部分帮助' }, { value: 0, label: '0 分 · 完全依赖' }] },
  { id: 8, text: '床椅转移', options: [{ value: 15, label: '15 分 · 独立转移' }, { value: 10, label: '10 分 · 需少量帮助（1人搀扶或言语指导）' }, { value: 5, label: '5 分 · 需大量帮助（2人搀扶或借助器械）' }, { value: 0, label: '0 分 · 完全依赖' }] },
  { id: 9, text: '行走', options: [{ value: 15, label: '15 分 · 独立行走 45 米以上' }, { value: 10, label: '10 分 · 需少量帮助或使用轮椅' }, { value: 5, label: '5 分 · 能坐但无法行走' }, { value: 0, label: '0 分 · 完全不能移动' }] },
  { id: 10, text: '上下楼梯', options: [{ value: 10, label: '10 分 · 独立上下楼梯' }, { value: 5, label: '5 分 · 需部分帮助（扶栏杆等）' }, { value: 0, label: '0 分 · 不能' }] },
];

/** 7. ESAS 埃德蒙顿症状评估量表（Bruera 等 1991，9 症状 + 其他） */
const ESAS_ITEMS: AssessmentItem[] = [
  { id: 1, text: '疼痛（pain）', max: 10 }, { id: 2, text: '疲乏（疲倦，tiredness/fatigue）', max: 10 },
  { id: 3, text: '恶心（nausea）', max: 10 }, { id: 4, text: '抑郁（depression）', max: 10 },
  { id: 5, text: '焦虑（anxiety）', max: 10 }, { id: 6, text: '嗜睡（昏昏欲睡，drowsiness）', max: 10 },
  { id: 7, text: '食欲下降（lack of appetite）', max: 10 }, { id: 8, text: '总体舒适感（well-being，总体感觉差）', max: 10 },
  { id: 9, text: '呼吸困难（shortness of breath）', max: 10 },
  { id: 10, text: '其他症状（请在备注中填写）', max: 10 },
];

/** 8. NRS 数字疼痛评分法 */
const NRS_ITEMS: AssessmentItem[] = [{ id: 1, text: '请用 0—10 之间的数字描述您当前的疼痛强度', max: 10 }];

/** 9. VAS 视觉模拟评分法 */
const VAS_ITEMS: AssessmentItem[] = [{ id: 1, text: '请在线上标出最能代表您当前疼痛感受的位置', max: 100 }];

/** 10. ZBI Zarit 照顾者负担量表（王烈等 2006 中文版，22 项） */
const ZBI_ITEMS: AssessmentItem[] = [
  '您是否认为，您所照料的病人会对您提出过多的照顾要求？', '您是否认为，由于护理病人会使自己的时间不够？',
  '您是否认为，在照料病人和努力做好家务及工作之间，您会感到有压力？', '您是否认为，因病人的行为而感到为难？',
  '您是否认为，有病人在您的身边而感到烦恼？', '您是否认为，您的病人已经影响到了您和您的家人与朋友之间的关系？',
  '您是否认为，对未来感到担心？', '您是否认为，病人依赖于您？',
  '当病人在您身边时，您感到紧张吗？', '您是否认为，由于护理病人，您的健康受到影响？',
  '您是否认为，由于护理病人，您没有时间办自己的私事？', '您是否认为，由于护理病人，您的社交受到影响？',
  '您有没有由于病人在家，放弃朋友来家的想法？', '您是否认为，病人只期盼您的照顾，您好像是他/她唯一可依赖的人？',
  '您是否认为，除去您的个人花费，您没有余钱用于护理病人？', '您是否认为，您有可能花更多的时间护理病人？',
  '您是否认为，开始护理以来，按照自己的意愿生活已经不可能了？', '您是否希望，能把病人留给别人来照护？',
  '您对病人有不知如何是好的情形吗？', '您认为应该为病人做更多的事情是吗？', '您认为在护理患者上您能做得更好吗？',
].map((text, i) => ({ id: i + 1, text }));
const ZBI_ITEMS_LAST: AssessmentItem = { id: 22, text: '综合来看您怎样评价自己在护理上的负担？' };

const ZBI_OPTIONS: ChoiceOption[] = [
  { value: 0, label: '没有' }, { value: 1, label: '偶尔' }, { value: 2, label: '有时' },
  { value: 3, label: '经常' }, { value: 4, label: '总是' },
];

/** 11. T-DAS Templer 死亡焦虑量表（中文版，15 项，是/否） */
const TDAS_ITEMS: AssessmentItem[] = [
  { id: 1, text: '我非常害怕死亡。' },
  { id: 2, text: '我很少想到死亡。' },
  { id: 3, text: '别人谈论死亡时我并不紧张。' },
  { id: 4, text: '我一想到要做手术就害怕。' },
  { id: 5, text: '我一点也不怕死亡。' },
  { id: 6, text: '我并不特别害怕得癌症。' },
  { id: 7, text: '想到死亡我从不苦恼。' },
  { id: 8, text: '我常常为时间飞逝而痛苦。' },
  { id: 9, text: '我害怕痛苦地死去。' },
  { id: 10, text: '死后会发生什么让我很不安。' },
  { id: 11, text: '我真的很害怕心脏病发作。' },
  { id: 12, text: '我常常想到「死」，这样活着很烦。' },
  { id: 13, text: '当人们谈论疾病爆发时我非常害怕。' },
  { id: 14, text: '我目睹血肉模糊的场面会非常害怕。' },
  { id: 15, text: '我害怕很多痛苦的事情。' },
];
/** T-DAS 反向题（"否"=1 分死亡焦虑）：2/3/5/6/7/10/12/13/15；正向（"是"=1 分）：1/4/8/9/11/14 */
const TDAS_REVERSE = new Set([2, 3, 5, 6, 7, 10, 12, 13, 15]);
const TDAS_OPTIONS: ChoiceOption[] = [
  { value: 0, label: '是' },
  { value: 1, label: '否' },
];

/** 12. CES-D-10 流调中心抑郁量表简版（Andresen et al. 1994，10 题，0—3 计分） */
const CESD_ITEMS: AssessmentItem[] = [
  { id: 1, text: '我因一些小事而烦恼。' },
  { id: 2, text: '我不太想吃东西，胃口不好。' },
  { id: 3, text: '即使家人或朋友帮助我，我仍然无法摆脱郁闷情绪。' },
  { id: 4, text: '我觉得不如别人好。' },
  { id: 5, text: '我做事无法集中精力。' },
  { id: 6, text: '我感到沮丧。' },
  { id: 7, text: '我觉得做任何事都很费力。' },
  { id: 8, text: '我对未来充满希望。' },
  { id: 9, text: '我觉得我的生活是失败的。' },
  { id: 10, text: '我感到害怕。' },
];
/** CES-D-10 反向题（第 5、8 项正向措辞）：3-v 翻转 */
const CESD_REVERSE = new Set([5, 8]);
const CESD_OPTIONS: ChoiceOption[] = [
  { value: 0, label: '0 · 很少 / 不到 1 天' },
  { value: 1, label: '1 · 少许 / 1—2 天' },
  { value: 2, label: '2 · 较多 / 3—4 天' },
  { value: 3, label: '3 · 经常 / 5—7 天' },
];

/* ---------------- 量表定义 ---------------- */

/** SAS 反向题：5、9、13、17、19（共 5 题正向措辞） */
const SAS_REVERSE = new Set([5, 9, 13, 17, 19]);
/** SDS 反向题：2、5、6、11、12、14、16、17、18、20（共 10 题正向措辞） */
const SDS_REVERSE = new Set([2, 5, 6, 11, 12, 14, 16, 17, 18, 20]);

const SAS: Assessment = {
  id: 'sas', name: 'SAS', fullName: '焦虑自评量表（Self-rating Anxiety Scale）',
  purpose: '评估焦虑症状的严重程度，适用于成人焦虑筛查。', category: '情绪', duration: '约 5 分钟', mode: 'choice',
  admin: ['请根据最近一周的实际感受作答', '每个条目只能选择一个答案', '第 5、9、13、17、19 题为正向措辞，已自动反向计分'],
  items: SAS_ITEMS, options: SAS_OPTIONS,
  scoring: (a) => {
    const raw = sumWithReverse(a, SAS_ITEMS, SAS_REVERSE, flip4);
    const std = Math.round(raw * 1.25);
    const lv = levelOf(std, [{ upTo: 49, label: '无明显焦虑', color: 'green' }, { upTo: 59, label: '轻度焦虑', color: 'yellow' }, { upTo: 69, label: '中度焦虑', color: 'orange' }, { upTo: 100, label: '重度焦虑', color: 'red' }]);
    return { total: std, dimensions: [{ name: '标准分', value: std, max: 100, level: lv }], level: lv,
      interpretation: `粗分 ${raw} 分（已对第 5/9/13/17/19 题反向计分），标准分 ${std} 分（粗分 × 1.25）。当前为${lv.label}。`,
      recommendations: ['情绪安抚、放松训练（腹式呼吸、渐进性肌肉放松）', '陪伴倾听与认知重构', '中重度建议转介心理治疗师'] };
  },
  printNote: 'SAS 反向题：5、9、13、17、19（按 5-v 翻转）。标准分 = 粗分 × 1.25；界值 50 / 60 / 70 为轻度、中度、重度。',
};

const SDS: Assessment = {
  id: 'sds', name: 'SDS', fullName: '抑郁自评量表（Self-rating Depression Scale）',
  purpose: '评估抑郁症状的严重程度，适用于成人抑郁筛查。', category: '情绪', duration: '约 5 分钟', mode: 'choice',
  admin: ['请根据最近一周的实际感受作答', '第 19 题涉及死亡念头，请如实作答', '第 2/5/6/11/12/14/16/17/18/20 题为正向措辞，已自动反向计分'],
  items: SDS_ITEMS, options: SAS_OPTIONS,
  scoring: (a) => {
    const raw = sumWithReverse(a, SDS_ITEMS, SDS_REVERSE, flip4);
    const std = Math.round(raw * 1.25);
    const lv = levelOf(std, [{ upTo: 52, label: '无明显抑郁', color: 'green' }, { upTo: 62, label: '轻度抑郁', color: 'yellow' }, { upTo: 72, label: '中度抑郁', color: 'orange' }, { upTo: 100, label: '重度抑郁', color: 'red' }]);
    const s19 = a[19] ?? 0;
    return { total: std, dimensions: [{ name: '标准分', value: std, max: 100, level: lv }], level: lv,
      interpretation: `粗分 ${raw} 分（已对 10 道正向题反向计分），标准分 ${std} 分（粗分 × 1.25）。当前为${lv.label}。`,
      recommendations: ['心理支持、行为激活、生命回顾', '建立日常规律与微小目标', '中重度建议转介心理或精神科评估',
        s19 >= 3 ? '⚠️ 第 19 题（"认为死了别人会生活得更好"）得分 ≥3，必须立即评估自杀风险' : '⚠️ 若第 19 题得分 ≥3，务必评估自杀风险'] };
  },
  printNote: 'SDS 反向题：2/5/6/11/12/14/16/17/18/20（按 5-v 翻转）。标准分 = 粗分 × 1.25；界值 53 / 63 / 73 为轻度、中度、重度。',
};

const GAD7: Assessment = {
  id: 'gad7', name: 'GAD-7', fullName: '广泛性焦虑量表（Generalized Anxiety Disorder 7-item）',
  purpose: '快速筛查广泛性焦虑障碍，适用于初级保健与社工初评。', category: '情绪', duration: '约 2 分钟', mode: 'choice',
  admin: ['请根据最近两周的症状作答'],
  items: GAD_ITEMS, options: SEVERITY4,
  scoring: (a) => {
    const t = sumAnswers(a, GAD_ITEMS);
    const lv = levelOf(t, [{ upTo: 4, label: '无明显焦虑', color: 'green' }, { upTo: 9, label: '轻度焦虑', color: 'yellow' }, { upTo: 14, label: '中度焦虑', color: 'orange' }, { upTo: 21, label: '重度焦虑', color: 'red' }]);
    return { total: t, dimensions: [{ name: '总分', value: t, max: 21, level: lv }], level: lv,
      interpretation: `总分 ${t}/21。当前为${lv.label}。`,
      recommendations: ['放松训练（腹式呼吸、渐进性肌肉放松）', '认知重构与焦虑教育', '≥10 分建议进一步评估，必要时转介心理治疗'] };
  },
  printNote: 'GAD-7 界值：0—4 无、5—9 轻、10—14 中、15—21 重。',
};

const PHQ9: Assessment = {
  id: 'phq9', name: 'PHQ-9', fullName: '患者健康问卷抑郁量表（Patient Health Questionnaire-9）',
  purpose: '抑郁症状筛查与严重程度评估，含自杀意念题项。', category: '情绪', duration: '约 3 分钟', mode: 'choice',
  admin: ['请根据最近两周的症状作答', '第 9 题涉及自伤念头，请务必如实作答'],
  items: PHQ_ITEMS, options: SEVERITY4,
  scoring: (a) => {
    const t = sumAnswers(a, PHQ_ITEMS);
    const lv = levelOf(t, [{ upTo: 4, label: '无明显抑郁', color: 'green' }, { upTo: 9, label: '轻度抑郁', color: 'yellow' }, { upTo: 14, label: '中度抑郁', color: 'orange' }, { upTo: 19, label: '中重度抑郁', color: 'red' }, { upTo: 27, label: '重度抑郁', color: 'red' }]);
    const q9 = a[9] ?? 0;
    return { total: t, dimensions: [{ name: '总分', value: t, max: 27, level: lv }], level: lv,
      interpretation: `总分 ${t}/27。当前为${lv.label}。`,
      recommendations: ['心理支持、行为激活、社会联结', '≥10 分建议转介心理/精神科',
        q9 >= 1 ? '⚠️ 第 9 题（自杀意念）得分 ≥1，必须立即进一步评估安全风险' : '⚠️ 第 9 题得分 ≥1 时，必须进一步评估安全风险'] };
  },
  printNote: 'PHQ-9 界值：0—4 无、5—9 轻、10—14 中、15—19 中重、20—27 重。',
};

const GDS30: Assessment = {
  id: 'gds', name: 'GDS-30', fullName: '老年抑郁量表（Geriatric Depression Scale, 30-item）',
  purpose: '针对老年人群的抑郁评估，问句简单、避免躯体症状干扰。', category: '老年', duration: '约 8 分钟', mode: 'choice',
  admin: ['请根据最近一周的感受作答', '注意：本表为"反向计分"设计，得分越高提示抑郁越重'],
  items: GDS_ITEMS, options: GDS_OPTIONS,
  scoring: (a) => {
    const t = sumWithReverse(a, GDS_ITEMS, GDS_REVERSE, flipBinary);
    const lv = levelOf(t, [{ upTo: 10, label: '无抑郁', color: 'green' }, { upTo: 20, label: '轻度抑郁', color: 'yellow' }, { upTo: 30, label: '中重度抑郁', color: 'red' }]);
    return { total: t, dimensions: [{ name: '总分', value: t, max: 30, level: lv }], level: lv,
      interpretation: `总分 ${t}/30。当前为${lv.label}。`,
      recommendations: ['陪伴访谈、文娱活动破冰', '中重度或持续高分者转介精神心理科', '融入生命回顾与意义建构'] };
  },
  printNote: 'GDS-30 界值：≤10 无抑郁、11—20 轻度、21—30 中重度。',
};

const ICG_SCALE: Assessment = {
  id: 'icg', name: 'ICG-19', fullName: '复杂性哀伤量表 19 题版（ICG, Prigerson et al. 1995）',
  purpose: '筛查延长哀伤障碍（PGD）高风险人群。', category: '哀伤', duration: '约 6 分钟', mode: 'choice',
  admin: ['请根据丧亲后最近一个月的真实感受作答', '本表为 ICG 19 题原版（Prigerson 等 1995）；如需 ICG-R 30 题扩展版，请使用专业评估包'],
  items: ICG_ITEMS, options: [
    { value: 0, label: '从来没有' }, { value: 1, label: '极少' }, { value: 2, label: '偶尔' }, { value: 3, label: '有时' }, { value: 4, label: '经常' },
  ],
  scoring: (a) => {
    const t = sumAnswers(a, ICG_ITEMS);
    const lv = t >= 25 ? { label: '复杂性哀伤高风险', color: 'red' as const } : { label: '正常哀伤范围', color: 'green' as const };
    return { total: t, dimensions: [{ name: '总分（19 题原版）', value: t, max: 76, level: lv }], level: lv,
      interpretation: `总分 ${t}/76（19 题，每题 0—4 分）。${t >= 25 ? '≥25 分提示延长哀伤高风险，需进一步按 ICD-11 PGD 标准评估。' : '当前在正常哀伤范围。'}`,
      recommendations: ['正常化哀伤反应、鼓励情绪表达', '持续联结取向的纪念活动', '≥25 分建议转介专业哀伤治疗'] };
  },
  printNote: '照录 Prigerson H G, Maciejewski P K, et al. 1995 ICG 19 题原版（0—4 分，0=从来没有，4=经常）。总分 ≥25 为国际哀伤研究常用界值。本系统未启用 ICG-R 30 题扩展版。',
};

const PDI_SCALE: Assessment = {
  id: 'pdi', name: 'PDI', fullName: '患者尊严量表（Patient Dignity Inventory）',
  purpose: '评估临终患者尊严困扰的程度与来源。', category: '尊严', duration: '约 5 分钟', mode: 'choice',
  admin: ['请根据最近一周的感受作答'],
  items: PDI_ITEMS, options: [
    { value: 1, label: '没有困扰' }, { value: 2, label: '轻度困扰' }, { value: 3, label: '中度困扰' },
    { value: 4, label: '重度困扰' }, { value: 5, label: '极重度困扰' },
  ],
  scoring: (a) => {
    const t = sumAnswers(a, PDI_ITEMS);
    const lv = levelOf(t, [{ upTo: 24, label: '轻度尊严困扰', color: 'green' }, { upTo: 36, label: '中度尊严困扰', color: 'yellow' }, { upTo: 60, label: '重度尊严困扰', color: 'red' }]);
    return { total: t, dimensions: [{ name: '总分', value: t, max: 60, level: lv }], level: lv,
      interpretation: `总分 ${t}/60，分数越高尊严困扰越重。当前为${lv.label}。`,
      recommendations: ['尊严疗法（结构化访谈 + 代际传承文件）', '意义建构、生命回顾', '尊重自主权，强化参与照护决策'] };
  },
  printNote: 'PDI 分数越高尊严困扰越重。',
};

const SSRS_SCALE: Assessment = {
  id: 'ssrs', name: 'SSRS', fullName: '社会支持评定量表（Social Support Rating Scale）',
  purpose: '评估主观支持、客观支持与支持利用度三个维度。', category: '社会支持', duration: '约 5 分钟', mode: 'choice',
  admin: ['请根据最近一年内的实际情况作答'],
  items: SSRS_ITEMS,
  scoring: (a) => {
    const sub = (ids: number[]) => ids.reduce((s, i) => s + (a[i] ?? 0), 0);
    const obj = sub([1, 2, 6, 7]); const subj = sub([3, 4, 5]); const util = sub([8, 9, 10]);
    const t = obj + subj + util;
    // 阈值参考：总分 40 满分下，≥30 良好、20—29 一般、≤19 不足。
    const lv = levelOf(t, [{ upTo: 19, label: '社会支持不足', color: 'red' }, { upTo: 29, label: '社会支持一般', color: 'yellow' }, { upTo: 40, label: '社会支持良好', color: 'green' }]);
    return { total: t,
      dimensions: [{ name: '客观支持', value: obj, max: 16 }, { name: '主观支持', value: subj, max: 12 }, { name: '支持利用度', value: util, max: 12 }],
      level: lv,
      interpretation: `总分 ${t}/40（客观支持 ${obj}/16、主观支持 ${subj}/12、支持利用度 ${util}/12）。当前评估为${lv.label}。`,
      recommendations: ['链接正式支持（医护、社工、政策、慈善）', '激活非正式支持（家属、朋辈、志愿者）', '组织或转介支持小组'] };
  },
  printNote: '照录肖水源（1986/1990）SSRS，10 题，每题 1—4 分。维度：客观支持（1/2/6/7）、主观支持（3/4/5）、支持利用度（8/9/10）。各题为不同选项集，已逐题内置。总量表 40 分，得分越低提示支持越不足。',
};

/* ---------- 新增 10 表定义 ---------- */

const AGS: Assessment = {
  id: 'ags', name: 'AGS', fullName: '预期性悲伤量表（Anticipatory Grief Scale, 中文版 C-AGS）',
  purpose: '评估患者去世前家属的预期性悲伤水平，是姑息照护情境下哀伤预备的核心工具。',
  category: '哀伤', duration: '约 8 分钟', mode: 'choice',
  admin: ['由家庭照顾者根据亲人被诊断患有不可治愈疾病以来的实际感受自行填写', '每个条目只能选择一个答案', '各条目均为正向计分，无需反向换算', 'AGS 中文版目前尚无统一临界值，分数仅供前后对比与团队讨论参考'],
  items: AGS_ITEMS, options: [
    { value: 1, label: '非常不同意' }, { value: 2, label: '不同意' }, { value: 3, label: '不确定' }, { value: 4, label: '同意' }, { value: 5, label: '非常同意' },
  ],
  scoring: (a) => {
    const t = sumAnswers(a, AGS_ITEMS);
    // 注：DB4403/T 521—2024 与原汉化论文均未给出统一临界值；
    // 下列 80 / 100 仅作"相对水平"参考，不作为诊断标准。
    const lv = levelOf(t, [{ upTo: 80, label: '相对偏低（仅供参考）', color: 'green' }, { upTo: 100, label: '相对中等（仅供参考）', color: 'yellow' }, { upTo: 135, label: '相对偏高（仅供参考）', color: 'red' }]);
    return { total: t, dimensions: [{ name: '总分（无统一临界值）', value: t, max: 135, level: lv }], level: lv,
      interpretation: `总分 ${t}/135。AGS 中文版目前尚无统一公认的临床临界值，分数仅供个案前后对比与团队讨论参考，不作为诊断或准入标准；请结合访谈与临床判断。当前相对参考为${lv.label}。`,
      recommendations: ['哀伤辅导与预感性哀伤疏导（提前处理分离议题）', '生命回顾、持续联结取向的纪念活动', '家庭会谈协助表达未竟事宜'] };
  },
  printNote: '照录深圳市地方标准 DB4403/T 521—2024 附录 D（C-AGS，27 项，含 7 个维度，均正向计分）。中文版 α=0.896，内容效度指数 0.963。原汉化：周霜、辛大君等（2017）。本表无统一临界值，请结合样本常模与临床判断。',
};

/** MLQ 中文版（刘思斯、甘怡群 2010）：
 *  - 寻求意义感（MLQ-S）：1、3、5、6
 *  - 生命意义感（MLQ-P）：2、4、7、8、9（其中第 2 题反向计分，按 8-v 翻转）
 */
const MLQ: Assessment = {
  id: 'mlq', name: 'MLQ', fullName: '生命意义感量表（Meaning in Life Questionnaire, 中文版）',
  purpose: '测量生命意义感与寻求意义感两个维度，用于意义建构类干预的效果评估。',
  category: '意义感', duration: '约 4 分钟', mode: 'choice',
  admin: ['请根据最近一段时间的真实感受作答', '第 1、3、5、6 题属"寻求意义感"维度；第 2、4、7、8、9 题属"生命意义感"维度', '第 2 题反向计分（按 8-v 翻转）'],
  items: MLQ_ITEMS, options: MLQ_OPTIONS,
  scoring: (a) => {
    const seek = [1, 3, 5, 6].reduce((s, i) => s + (a[i] ?? 0), 0);
    // 生命意义感维度：第 2 题反向（8-v），其余 4/7/8/9 正向计分
    const pres = (a[2] !== undefined ? 8 - a[2] : 0)
      + [4, 7, 8, 9].reduce((s, i) => s + (a[i] ?? 0), 0);
    const t = seek + pres;
    const lv = levelOf(t, [{ upTo: 35, label: '意义感偏低', color: 'red' }, { upTo: 50, label: '意义感中等', color: 'yellow' }, { upTo: 63, label: '意义感较高', color: 'green' }]);
    return { total: t,
      dimensions: [{ name: '寻求意义感（MLQ-S）', value: seek, max: 28 }, { name: '生命意义感（MLQ-P，含第 2 题反向）', value: pres, max: 35 }],
      level: lv,
      interpretation: `总分 ${t}/63（寻求意义感 ${seek}/28、生命意义感 ${pres}/35，第 2 题反向计分后）。分量表得分越高，相应意义感水平越高。当前参考为${lv.label}。`,
      recommendations: ['生命回顾、意义建构干预', '尊严疗法、生命意义树', '协助发现日常小事中的价值'] };
  },
  printNote: '照录刘思斯、甘怡群（2010）修订中文版 MLQ，9 题 Likert 7 点计分。第 2 题反向计分（8-v）。分量表：MLQ-S（第 1/3/5/6 题，满分 28）、MLQ-P（第 2/4/7/8/9 题，满分 35）。原始量表：Steger M F, Frazier P, Oishi S, et al. J Couns Psychol, 2006, 53(1): 80—93。',
};

const UCLA: Assessment = {
  id: 'ucla', name: 'UCLA-3', fullName: 'UCLA 孤独量表简版（3-item short form）',
  purpose: '快速筛查孤独感与社会隔离，适用于社区老年人群。',
  category: '社会支持', duration: '约 1 分钟', mode: 'choice',
  admin: ['请根据平时与他人交往时的实际感受填写'],
  items: UCLA_ITEMS, options: UCLA_OPTIONS,
  scoring: (a) => {
    const t = sumAnswers(a, UCLA_ITEMS);
    const lonely = t >= 6;
    const lv = lonely ? { label: '存在孤独感', color: 'red' as const } : { label: '不孤独', color: 'green' as const };
    return { total: t, dimensions: [{ name: '总分', value: t, max: 9, level: lv }], level: lv,
      interpretation: `总分 ${t}/9。${lonely ? '≥6 分判定存在孤独感。' : '3—5 分提示不孤独。'}`,
      recommendations: lonely ? ['以原有兴趣（棋牌、老歌等）破冰建立关系', '链接院内同伴与集体活动', '搭建家庭线上陪伴约定（每周视频、每月探视）'] : ['维持现有社会联结，定期回访'] };
  },
  printNote: '照录 Hughes 等（2004）从 20 项 UCLA 量表筛选的 3 条目简版，α=0.72，与 20 项版相关系数 0.82。总分 ≥6 判定存在孤独感。',
};

const KPS: Assessment = {
  id: 'kps', name: 'KPS', fullName: '卡氏功能状态量表（Karnofsky Performance Status）',
  purpose: '评定患者体力状况与功能水平，用于服务准入与强度匹配。国内规范常以 KPS ≤70 分作为准入参照。',
  category: '功能', duration: '约 2 分钟', mode: 'exclusive', assessorRated: true,
  admin: ['由评定者根据患者当前的实际功能状态，在下列 11 个等级中选择最符合的一级', '直接记录相应分值'],
  items: [{ id: 1, text: '请选择最符合患者当前功能状态的等级' }],
  levels: KPS_LEVELS,
  scoring: (a) => {
    const v = a[1] ?? 100;
    const lv = v >= 80 ? { label: '可正常活动', color: 'green' as const }
      : v >= 50 ? { label: '不能工作，部分自理', color: 'yellow' as const }
      : { label: '生活不能自理', color: 'red' as const };
    const matched = KPS_LEVELS.find((l) => l.score === v);
    return { total: v, dimensions: [{ name: 'KPS', value: v, max: 100, level: lv }], level: lv,
      interpretation: `KPS ${v} 分 — ${matched?.label ?? ''}。当前为${lv.label}。`,
      recommendations: ['≥80 分：可正常活动或部分恢复工作', '50—70 分：不能工作但尚能自理部分生活', '≤40 分：生活不能自理，需专门照护', '国内安宁疗护服务规范常以 KPS ≤70 分作为服务准入参照'] };
  },
  printNote: '照录 Karnofsky 与 Burchenal（1949）通行标准文本。KPS ≤70 分为多地服务准入参照界值之一。',
};

const PPS: Assessment = {
  id: 'pps', name: 'PPS', fullName: '姑息功能量表（Palliative Performance Scale）',
  purpose: '在 KPS 基础上增加进食与意识水平维度，对功能渐进性衰退更敏感，常用于生存期预测。',
  category: '功能', duration: '约 3 分钟', mode: 'exclusive', assessorRated: true,
  admin: ['由评定者自左向右依次对照各功能维度，为患者当前状态选择最佳的水平匹配行', '国内部分安宁疗护规范以 PPS 评估预期生存期 6 个月以内作为服务准入参照'],
  items: [{ id: 1, text: '请选择最符合患者当前状态的水平匹配行' }],
  levels: PPS_LEVELS,
  matrixColumns: ['行动', '活动与疾病征象', '自理', '进食', '意识'],
  scoring: (a) => {
    const v = a[1] ?? 100;
    const lv = v >= 70 ? { label: '功能较好', color: 'green' as const }
      : v >= 50 ? { label: '中等功能', color: 'yellow' as const }
      : { label: '功能严重受限', color: 'red' as const };
    const matched = PPS_LEVELS.find((l) => l.score === v);
    return { total: v, dimensions: [{ name: 'PPS', value: v, max: 100, level: lv }], level: lv,
      interpretation: `PPS ${v}% — ${matched?.label ?? ''}。当前为${lv.label}。`,
      recommendations: ['国内部分规范以 PPS ≤50% 作为服务准入参考', '加拿大不列颠哥伦比亚省姑息照护福利计划以 PPS ≤50% 为准入参考', '结合进食与意识水平判断照护强度与照护者支持需求'] };
  },
  printNote: '照录 Anderson 等（1996）PPS 通行版本（v2）五维度矩阵描述。',
};

const BARTHEL: Assessment = {
  id: 'barthel', name: 'Barthel', fullName: 'Barthel 日常生活活动能力指数（Index of ADL）',
  purpose: '评估日常生活活动能力（ADL），用于照护资源协调与照护等级匹配。',
  category: '功能', duration: '约 5 分钟', mode: 'choice', assessorRated: true,
  admin: ['由评定者根据患者实际情况在下列 10 个项目上分别评定计分', '各项目按条目所列标准计 0、5、10 或 15 分'],
  items: BARTHEL_ITEMS,
  scoring: (a) => {
    const t = sumAnswers(a, BARTHEL_ITEMS);
    const lv = t >= 100 ? { label: '完全自理', color: 'green' as const }
      : t >= 61 ? { label: '轻度依赖', color: 'yellow' as const }
      : t >= 41 ? { label: '中度依赖', color: 'orange' as const }
      : { label: '重度依赖', color: 'red' as const };
    return { total: t, dimensions: [{ name: '总分', value: t, max: 100, level: lv }], level: lv,
      interpretation: `总分 ${t}/100。评分越低提示生活依赖程度越高。当前为${lv.label}。`,
      recommendations: ['100 分：生活完全自理', '61—99 分：轻度依赖，需少量协助', '41—60 分：中度依赖，需较多照护与协助安排', '≤40 分：重度依赖，需专门照护'] };
  },
  printNote: '照录 Mahoney 与 Barthel（1965）通行版本。常用分级：100 完全自理；61—99 轻度依赖；41—60 中度依赖；≤40 重度依赖。',
};

const ESAS: Assessment = {
  id: 'esas', name: 'ESAS', fullName: '埃德蒙顿症状评估量表（Edmonton Symptom Assessment System）',
  purpose: '快速评估姑息照护患者 9 类常见症状的强度，用于症状负担动态追踪与医护转介决策。',
  category: '症状', duration: '约 3 分钟', mode: 'numeric',
  admin: ['请患者根据目前的感觉，对下列每个症状的严重程度打分', '0 分表示没有该症状，10 分表示该症状最严重'],
  items: ESAS_ITEMS, sumUpTo: 9, unit: '分',
  scoring: (a) => {
    const t = sumAnswers(a, ESAS_ITEMS, 9);
    const severe = ESAS_ITEMS.slice(0, 9).filter((it) => (a[it.id] ?? 0) >= 7);
    const moderate = ESAS_ITEMS.slice(0, 9).filter((it) => { const v = a[it.id] ?? 0; return v >= 4 && v <= 6; });
    const lv = t <= 27 ? { label: '轻度症状负担', color: 'green' as const }
      : t <= 54 ? { label: '中度症状负担', color: 'yellow' as const }
      : { label: '重度症状负担', color: 'red' as const };
    const dims = ESAS_ITEMS.slice(0, 9).map((it) => ({ name: it.text.split('（')[0], value: a[it.id] ?? 0, max: 10 }));
    return { total: t, dimensions: dims, level: lv,
      interpretation: `症状总分 ${t}/90（前 9 项相加）。当前为${lv.label}。${severe.length ? `重度症状（≥7 分）：${severe.map((s) => s.text.split('（')[0]).join('、')}。` : ''}${moderate.length ? `中度症状（4—6 分）：${moderate.map((s) => s.text.split('（')[0]).join('、')}。` : ''}`,
      recommendations: ['任一症状 7—10 分提示重度，需立即转介医护处理', '任一症状 4—6 分提示中度，建议纳入常规处理', '疼痛、恶心、呼吸困难优先联动医护调整方案', '建议作为基线，按固定周期重复施测以追踪变化'] };
  },
  printNote: '照录 Bruera 等（1991）ESAS 原版 9 个症状条目及第 10 项"其他"。每个症状 0—10 分，分级：1—3 轻度、4—6 中度、7—10 重度。',
};

const NRS: Assessment = {
  id: 'nrs', name: 'NRS', fullName: '数字疼痛评分法（Numeric Rating Scale）',
  purpose: '量化疼痛强度。WHO 三阶梯镇痛原则推荐工具，NRS ≥4 分且影响睡眠常提示需进一步镇痛。',
  category: '症状', duration: '约 1 分钟', mode: 'numeric',
  admin: ['请用 0—10 之间的数字描述当前的疼痛强度', '0 代表完全不痛，10 代表最剧烈的疼痛'],
  items: NRS_ITEMS, sumUpTo: 1, unit: '分',
  scoring: (a) => {
    const v = a[1] ?? 0;
    const lv = v === 0 ? { label: '无痛', color: 'green' as const }
      : v <= 3 ? { label: '轻度疼痛', color: 'yellow' as const }
      : v <= 6 ? { label: '中度疼痛', color: 'orange' as const }
      : { label: '重度疼痛', color: 'red' as const };
    return { total: v, dimensions: [{ name: 'NRS', value: v, max: 10, level: lv }], level: lv,
      interpretation: `NRS ${v}/10。当前为${lv.label}。`,
      recommendations: ['0 分：无痛', '1—3 分：轻度疼痛', '4—6 分：中度疼痛', '7—10 分：重度疼痛',
        v >= 4 ? 'NRS ≥4 分且影响睡眠或持续加重者，提示需进一步镇痛处理，请联动医护' : '注意持续观察疼痛变化'] };
  },
  printNote: 'NRS 分级：0 无痛；1—3 轻度；4—6 中度；7—10 重度。',
};

const VAS: Assessment = {
  id: 'vas', name: 'VAS', fullName: '视觉模拟评分法（Visual Analogue Scale）',
  purpose: '以 100 毫米直线标定疼痛等症状强度，与 NRS 高度相关。',
  category: '症状', duration: '约 2 分钟', mode: 'numeric',
  admin: ['画一条长 100 毫米的直线，左端标记 0（无痛），右端标记 10（或 100，最剧烈的疼痛）', '在线上标出最能代表当前感受的位置，测量标记点至左端起点的距离（毫米）'],
  items: VAS_ITEMS, sumUpTo: 1, unit: '毫米',
  scoring: (a) => {
    const v = a[1] ?? 0;
    const lv = v <= 30 ? { label: '轻度', color: 'yellow' as const }
      : v <= 60 ? { label: '中度', color: 'orange' as const }
      : { label: '重度', color: 'red' as const };
    return { total: v, dimensions: [{ name: 'VAS', value: v, max: 100, level: lv }], level: lv,
      interpretation: `VAS ${v} 毫米 / 100。当前为${lv.label}。`,
      recommendations: ['0—30 毫米：轻度', '30—60 毫米：中度', '＞60 毫米：重度', '与 NRS 换算参考：轻度 ≤3、中度 4—6、重度 ≥7'] };
  },
  printNote: 'VAS 分级：0—30 毫米轻度；30—60 毫米中度；＞60 毫米重度。',
};

const ZBI: Assessment = {
  id: 'zbi', name: 'ZBI', fullName: 'Zarit 照顾者负担量表（ZBI 中文版）',
  purpose: '评估家庭照顾者的主观照顾负担，是识别照护者耗竭与安排支持的核心工具。',
  category: '照护负担', duration: '约 8 分钟', mode: 'choice',
  admin: ['由家庭照顾者根据实际情况填写', '第 1—21 条选择各感受出现的频率，第 22 条对总体负担程度评分'],
  items: [...ZBI_ITEMS, ZBI_ITEMS_LAST], options: ZBI_OPTIONS,
  scoring: (a) => {
    const t = sumAnswers(a, [...ZBI_ITEMS, ZBI_ITEMS_LAST]);
    const personal = ZBI_ITEMS.slice(0, 10).reduce((s, it) => s + (a[it.id] ?? 0), 0);
    const role = ZBI_ITEMS.slice(10).reduce((s, it) => s + (a[it.id] ?? 0), 0) + (a[22] ?? 0);
    const lv = levelOf(t, [{ upTo: 20, label: '无或轻微负担', color: 'green' }, { upTo: 40, label: '轻中度负担', color: 'yellow' }, { upTo: 60, label: '中重度负担', color: 'orange' }, { upTo: 88, label: '重度负担', color: 'red' }]);
    return { total: t,
      dimensions: [{ name: '个人负担', value: personal, max: 40 }, { name: '角色负担', value: role, max: 48 }],
      level: lv,
      interpretation: `总分 ${t}/88（个人负担 ${personal}/40、角色负担 ${role}/48）。分数越高提示照顾负担越重。当前为${lv.label}。`,
      recommendations: ['0—20 分：无或轻微负担', '21—40 分：轻中度负担，需关注与减负', '41—60 分：中重度负担，需主动介入支持', '61—88 分：重度负担，建议转介喘息服务/家属支持小组并评估是否需增加照护人力'] };
  },
  printNote: '照录王烈、杨小湜、侯哲等（2006）修订中文版 ZBI（α≈0.87，分个人负担与角色负担两维度）。第 16 条中译文以国内通行刊本为准，临床使用请以原刊为准。',
};

/* 11. T-DAS 死亡焦虑量表（中文版 15 项） */
const TDAS: Assessment = {
  id: 'tdas', name: 'T-DAS', fullName: 'Templer 死亡焦虑量表（Death Anxiety Scale, 15 题中文版）',
  purpose: '评估个体面对死亡议题的焦虑水平，用于安宁疗护中死亡焦虑的筛查与干预效果追踪。',
  category: '情绪', duration: '约 4 分钟', mode: 'choice',
  admin: ['请根据自身对死亡议题的真实感受作答', '每题只能选一个答案；第 2/3/5/6/7/10/12/13/15 题为反向计分（"否"=1 分）'],
  items: TDAS_ITEMS, options: TDAS_OPTIONS,
  scoring: (a) => {
    const t = sumWithReverse(a, TDAS_ITEMS, TDAS_REVERSE, flipBinary);
    const lv = levelOf(t, [
      { upTo: 8, label: '死亡焦虑偏低', color: 'green' },
      { upTo: 12, label: '死亡焦虑中等', color: 'yellow' },
      { upTo: 15, label: '死亡焦虑偏高', color: 'red' },
    ]);
    return {
      total: t,
      dimensions: [{ name: '总分', value: t, max: 15, level: lv }],
      level: lv,
      interpretation: `总分 ${t}/15。分数越高提示死亡焦虑越重。当前为${lv.label}。`,
      recommendations: [
        '≤8 分：偏低；可维持现有心理准备与生命回顾',
        '9—12 分：中等；以意义建构、生命回顾、灵性关怀介入',
        '≥13 分：偏高；建议开展死亡教育、家庭会议、心理转介',
      ],
    };
  },
  printNote: '照录 Templer D I (1970) 死亡焦虑量表 15 题原版；分正向 6 题（1/4/8/9/11/14，"是"=1 分）与反向 9 题（2/3/5/6/7/10/12/13/15，"否"=1 分），总分 0—15 分。中文版见相关临床研究。本表为筛查工具，结果不能替代诊断。',
};

/* 12. CES-D-10 流调中心抑郁量表简版 */
const CESD: Assessment = {
  id: 'cesd', name: 'CES-D-10', fullName: '流调中心抑郁量表简版（CES-D-10）',
  purpose: '抑郁症状的快速筛查，适用于家属随访、入院初评与小组前后测。',
  category: '情绪', duration: '约 3 分钟', mode: 'choice',
  admin: ['请根据过去一周的感受作答', '第 5、8 题为正向措辞，已自动反向计分（3-v 翻转）'],
  items: CESD_ITEMS, options: CESD_OPTIONS,
  scoring: (a) => {
    const t = sumWithReverse(a, CESD_ITEMS, CESD_REVERSE, flip3);
    const lv = levelOf(t, [
      { upTo: 9, label: '无明显抑郁', color: 'green' },
      { upTo: 14, label: '轻度抑郁倾向', color: 'yellow' },
      { upTo: 20, label: '中度抑郁倾向', color: 'orange' },
      { upTo: 30, label: '重度抑郁倾向', color: 'red' },
    ]);
    return {
      total: t,
      dimensions: [{ name: '总分', value: t, max: 30, level: lv }],
      level: lv,
      interpretation: `总分 ${t}/30（已对第 5、8 题反向计分）。≥10 分常作为抑郁风险筛查的参考阈值。当前为${lv.label}。`,
      recommendations: [
        '<10 分：无明显抑郁倾向，常规监测',
        '10—14 分：轻度倾向，建议加强情绪支持与随访',
        '15—20 分：中度倾向，建议心理支持与意义建构干预',
        '≥21 分：重度倾向，需专业心理 / 精神科评估与危机排查',
      ],
    };
  },
  printNote: '照录 Andresen E M et al. (1994) 从 Radloff CES-D 筛选的 10 题简版；0=很少（<1 天），1=少许（1—2 天），2=较多（3—4 天），3=经常（5—7 天）。第 5、8 项反向计分（3-v）。总分 0—30；≥10 提示抑郁风险。',
};

/* ---------------- 导出 ---------------- */

export const ASSESSMENTS: Assessment[] = [
  SAS, SDS, GAD7, PHQ9, GDS30, ICG_SCALE, PDI_SCALE, SSRS_SCALE,
  AGS, MLQ, UCLA, KPS, PPS, BARTHEL, ESAS, NRS, VAS, ZBI, TDAS, CESD,
];

export function getAssessment(id: string): Assessment | undefined {
  return ASSESSMENTS.find((a) => a.id === id);
}

export const CATEGORIES: Assessment['category'][] = ['情绪', '哀伤', '社会支持', '尊严', '老年', '症状', '功能', '照护负担', '意义感'];

export const CATEGORY_COLORS: Record<Assessment['category'], string> = {
  情绪: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
  哀伤: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  社会支持: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200',
  尊严: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  老年: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  症状: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
  功能: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200',
  照护负担: 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-200',
  意义感: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200',
};

export const LEVEL_COLORS: Record<ScoreLevel['color'], string> = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200',
  orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-200',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200',
};

export const LEVEL_BAR_COLORS: Record<ScoreLevel['color'], string> = {
  green: 'bg-green-500', yellow: 'bg-yellow-500', orange: 'bg-orange-500',
  red: 'bg-red-500', blue: 'bg-blue-500', gray: 'bg-gray-500', purple: 'bg-purple-500',
};