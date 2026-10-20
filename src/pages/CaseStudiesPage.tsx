import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type Tab = 'case' | 'group' | 'community';

/** 三个实务案例的完整数据（照录评审稿，已匿名化） */
const CASE_STUDY = {
  code: 'P-2026-001',
  diagnosis: '慢性病终末期（COPD 合并心衰，长期氧疗）',
  profile: '男性，78 岁，丧偶约一月，与儿子同住。24 小时氧依赖，因一次脱氧险情后出现"脱氧焦虑"。',
  problems: [
    { p: '24 小时氧依赖伴"脱氧焦虑"', need: '对缺氧、窒息的强烈恐惧形成"症状—恐惧"条件反射，越恐惧越不敢活动，躯体功能进一步退化', plan: '与医护团队联动开展疾病知识科普、呼吸放松训练与渐进式活动尝试，打断恐惧循环' },
    { p: '丧偶约一月，思念强烈', need: '预期性悲伤水平偏高，对死亡议题回避与沉浸交替出现', plan: '以持续联结与哀伤双重过程视角开展哀伤辅导、生命回顾' },
    { p: '多次出现轻生念头', need: '急性自杀风险，生存意义感受损', plan: '危机介入优先：制订安全计划、排查环境风险、动态评估，必要时启动转介' },
    { p: '对儿子心怀愧疚，家庭互动紧张', need: '存在未表达的情感与未了心愿，家庭沟通不畅', plan: '家庭会谈，结合四道人生梳理道谢、道爱、道歉内容' },
    { p: '社会支持薄弱', need: '支持网络单一，日常倾诉对象少', plan: '链接病友同伴、志愿陪伴与社区活动资源，扩充支持网络' },
  ],
  assessments: [
    { tool: 'sas', name: 'SAS', label: '焦虑自评量表', pre: 74, preLv: '重度焦虑', mid: [68, 60], post: 54, postLv: '轻度焦虑', note: '焦虑明显缓解但未完全消退，结案后转介定期随访' },
    { tool: 'sds', name: 'SDS', label: '抑郁自评量表', pre: 56, preLv: '轻度抑郁', mid: [52, 49], post: 46, postLv: '', note: '接近正常范围' },
    { tool: 'ags', name: 'AGS', label: '预期性悲伤量表（中文版）', pre: 66, preLv: '中度预期性悲伤', mid: [null, 56], post: 50, postLv: '轻度', note: '预期性悲伤逐步减轻' },
    { tool: 'tdas', name: 'T-DAS', label: '死亡焦虑量表', pre: 13, preLv: '中度死亡焦虑', mid: [null, 11], post: 9, postLv: '轻度死亡焦虑', note: '死亡焦虑下降，回避死亡话题的情况减少（初期评估未含该维度，介入中期补充测评）' },
    { tool: 'ssrs', name: 'SSRS', label: '社会支持评定量表', pre: 34, preLv: '支持中等偏低', mid: [null, null], post: 40, postLv: '', note: '支持网络有所扩充' },
  ],
  theories: [
    { t: '危机介入理论', c: '危机是个体暂时性的失衡状态，干预应限时、聚焦当前问题', u: '回应自杀风险：先安全、后成长，风险动态监测贯穿全程' },
    { t: '依恋理论', c: '丧亲激活依恋系统，分离痛苦源于联结的突然断裂', u: '解释丧偶后的焦虑与"抓取"行为，社工以稳定陪伴提供安全基地' },
    { t: '哀伤双重过程模型', c: '哀伤者在"丧失导向"与"恢复导向"活动之间自然摆动', u: '评估摆动是否僵化：过度沉浸或一味回避丧失均需介入，据此安排缅怀与重建活动的比例' },
    { t: '持续联结理论', c: '与逝者的联结不因死亡而中断，可以新的形式延续', u: '将"放下"重构为"带着联结继续生活"：生命回顾、整理纪念物' },
    { t: '生命周期理论', c: '老年期的发展任务为自我整合对绝望', u: '以生命回顾协助整合一生经验，回应"这一生是否值得"的追问' },
  ],
  path: ['初评：初次会谈聚焦问题清单与危机筛查', '危机评估：确认自杀风险后立即进行，置于服务首位', '计划：依评估选定理论框架与干预方法', '介入：危机干预 → 情绪稳定 → 生命回顾 → 家庭会谈 → 资源链接', '评估：后测对比基线，第 3、5 周设过程监测点', '结案：转介定期随访，支持网络交接'],
  qualitative: '案主情绪趋于平稳，主动交流增多，与儿子的关系明显缓和，能够谈论与亡妻有关的回忆而不再完全回避；轻生念头在服务中期消失，安全计划随风险降低逐步解除。',
  takeaway: '本例呈现了"先评估、再定理论、后干预"的完整链条：危机优先、身心联动、理论配对需求。同时提示，死亡焦虑等维度容易在初期评估中遗漏，宜以结构化工具补全测评，并坚持动态评估与弹性调整。',
};

const GROUP_STUDY = {
  name: '住院期家属支持小组',
  size: '固定组员 6—8 人',
  freq: '每周 1 次 × 6 节，每次约 60 分钟',
  background: '住院安宁疗护患者的主要照顾者普遍存在六类共性问题：① 对安宁疗护存在"等于放弃治疗"的认知误区；② 缺乏简易照护技能；③ 长期情绪积压；④ 与患者沟通不畅；⑤ 道谢、道爱、道别等情感羁绊未疏；⑥ 面对分离的哀伤预备不足。此类共性问题依靠个别辅导覆盖面有限，且家属之间存在强烈的同伴互助需求，故开设封闭式小组。',
  preSurvey: [
    { tool: '自编家属心理状态问卷（8 条目）', focus: '悲伤、接受、迷茫等预感性哀伤反应', result: '悲伤与迷茫维度得分偏高', need: '哀伤预备与情绪疏导', link: null },
    { tool: 'GAD-7', focus: '焦虑症状', result: '8.6 分，中度焦虑', need: '情绪减压', link: 'gad7' },
    { tool: 'CES-D-10', focus: '抑郁症状', result: '14 分，存在抑郁风险', need: '情绪支持与高危观察', link: 'cesd' },
    { tool: 'ZBI 改编（5 条目）', focus: '照护负担', result: '15.4 分，中高负担', need: '照护赋能与减负', link: 'zbi' },
    { tool: '支持需求评估（5 条目）', focus: '信息、情感、工具性支持需求', result: '信息与情感支持需求均较高', need: '知识技能传递与倾听陪伴', link: null },
    { tool: '非正式支持评定（8 条目）', focus: '家庭与朋友支持的可得性', result: '中等水平', need: '搭建同伴互助平台', link: null },
  ],
  sessions: [
    { n: 1, main: '破冰、"微光"瞬间分享、订立契约、安宁疗护认知科普', need: '认知误区纠正、小组安全感建立' },
    { n: 2, main: '照护技巧示范与练习、心愿串珠手作', need: '照护能力不足、照护负担' },
    { n: 3, main: '沟通讲解、情景模拟、道爱卡与道谢卡书写', need: '沟通壁垒、情感表达需求' },
    { n: 4, main: '情绪自测、正念放松、道歉卡书写与自我和解', need: '情绪积压、愧疚自责' },
    { n: 5, main: '温暖回顾、同伴共情、道别卡书写、纪念手作封存', need: '哀伤预备不足、死亡恐惧' },
    { n: 6, main: '全程回顾、收获分享、集体留念、结案赋能', need: '巩固收获、平稳结案' },
  ],
  theories: '小组以家属压力应对理论解释照护倦怠的成因，以社会支持理论支撑同伴互助设计，以情绪 ABC 理论纠正认知误区，以哀伤双重过程模型理解预感性哀伤在"丧失导向"与"恢复导向"间的摆动，并以四道人生作为灵性关怀主线贯穿六节活动。',
  outcome: [
    { tool: 'GAD-7', pre: '8.6（中度）', post: '5.2（轻度）', note: '焦虑症状明显减轻' },
    { tool: 'CES-D-10', pre: '14', post: '9', note: '抑郁风险下降，未完全消退，建议持续观察' },
    { tool: 'ZBI 改编', pre: '15.4', post: '11.8', note: '照护负担有所缓解' },
    { tool: '非正式支持评定', pre: '4.1（中等）', post: '4.7', note: '家庭与朋友支持可得性提升，组员间同伴互助在小组结束后仍延续' },
    { tool: '自编家属心理状态问卷', pre: '悲伤、迷茫维度偏高', post: '各维度均有下降', note: '预感性哀伤反应减轻，接受度提升' },
  ],
  qualitative: '组员普遍反映掌握了实用的沟通与照护技巧，情绪得到安放；多位组员表示"知道了怎么好好跟他说话"，小组结束后仍有组员保持联系、相互支持。',
  takeaway: '对家属共性需求，小组工作能以较低成本实现知识传递、情绪疏导与同伴互助的整合；前测问卷包为节次设计提供了依据，前后测对比则为成效评估提供了量化支撑。高危成员应及时转介个案深度服务。',
};

const COMMUNITY_STUDY = {
  activities: [
    { name: '生前预嘱专题培训', audience: '专业人员（医护、社工）', mapping: '培训内容聚焦患者意愿探询与共同决策的步骤方法；采用专家授课、案例解析与情景模拟相结合的方式；强调在服务对象意识清楚、情绪稳定时以家常方式温和引入话题，不催促、不说服。' },
    { name: '家庭支持与文化因素培训', audience: '专业人员（医护、社工）', mapping: '体现文化敏感性视角：分析生死观、家庭权威结构与宗教信仰对医疗决策的影响；以案例解析和情景模拟提升跨文化背景下的沟通能力；引导理解家属反对背后的孝心、愧疚与担忧。' },
    { name: '社区宣教活动', audience: '社区居民与家属', mapping: '采用"宣讲＋情景模拟＋体验式活动"的组织方式；情景模拟对比"生硬说教"与"温柔共情"的沟通效果；配套手工体验环节帮助参与者释放情绪；设一对一咨询区登记跟进需求。' },
  ],
  implement: {
    培训侧: '使用通俗语言解释专业议题，如说明院外心肺复苏成功率低、插管可能带来明显不适；尊重服务对象与家属的思考节奏，不愿表态者不强行推进，而是将理念融入日常照护。',
    宣教侧: '专业宣讲深入浅出，结合真实情境案例；情景模拟鼓励居民现场演练；手工体验环节以书写温情寄语等方式承载情感表达，工作人员同步观察疏导参与者情绪。',
  },
  feedback: {
    过程: '培训参训覆盖医护与社工专业人员，宣教活动吸引院内家属及周边社区居民百余人参与，情景模拟互动踊跃。',
    结果: '参训人员表示将把对生命的尊重融入日常照护与社工服务，参与者反馈"学到了实用的沟通方法，也把心里话说出来了"。',
    跟进: '一对一咨询区登记了多名服务对象及家属的跟进需求，转入后续个案或小组服务。',
  },
  takeaway: '三次活动体现了社区工作"面向公众与环境的\'面\'"的定位：对内提升专业团队的沟通能力与伦理意识，对外以体验式宣教降低死亡话题的讨论门槛，并把活动中识别出的需求接引到个案与小组服务，形成"社区发现—专业服务"的衔接闭环。',
};

export function CaseStudiesPage() {
  const [tab, setTab] = useState<Tab>('case');

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/worksheets" className="hover:text-brand-600">实务资源</Link>
        <span className="mx-2">/</span>
        <span>案例库</span>
      </nav>

      <header className="mb-6 border-b border-gray-200 pb-6 dark:border-brand-800">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          实务案例库
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-gray-900 dark:text-white">
          三个可直接对照练习的完整案例
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
          以下案例均为<b>通用化整理</b>，不涉及真实机构、专家或项目名称，可直接用于带教、培训与督导。
          案例中的每一个评估工具都可以在
          <Link to="/tools" className="mx-1 text-brand-600 underline dark:text-brand-300">量表工具箱</Link>
          里实际施测，感受"先评估、再定理论、后干预"的完整链条。
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {([
          ['case', '📂 个案案例', '慢性病终末期老年人安宁疗护个案实务解析'],
          ['group', '👥 小组案例', '住院期家属支持小组实务解析'],
          ['community', '🏘️ 社区案例', '安宁疗护社区宣教与培训实务解析'],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`rounded-lg border px-4 py-2 text-sm transition ${
              tab === k
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:text-gray-300 dark:hover:bg-brand-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'case' && <CaseTab />}
      {tab === 'group' && <GroupTab />}
      {tab === 'community' && <CommunityTab />}
    </div>
  );
}

/* ---------------- 个案 ---------------- */

function CaseTab() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-brand-800 dark:bg-brand-900/40">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
              慢性病终末期老年人安宁疗护个案实务解析
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{CASE_STUDY.profile}</p>
            <p className="mt-1 text-xs text-gray-500">诊断：{CASE_STUDY.diagnosis} · 编号：{CASE_STUDY.code}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm('以此案例为模板新建个案？')) navigate('/cases/new');
            }}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            📂 用此案例建个案
          </button>
        </div>
      </section>

      <Section title="（一）问题陈述与介入方案" desc="综合初次会谈、家属访谈与观察记录">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead><tr className="bg-brand-600 text-white"><th className="px-3 py-2 text-left">主要问题</th><th className="px-3 py-2 text-left">需求分析</th><th className="px-3 py-2 text-left">对应解决方案</th></tr></thead>
            <tbody>
              {CASE_STUDY.problems.map((p, i) => (
                <tr key={i} className={i % 2 ? 'bg-warm-50 dark:bg-brand-950/50' : 'bg-white dark:bg-brand-900/30'}>
                  <td className="border border-gray-200 px-3 py-2 font-medium dark:border-brand-800">{p.p}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-600 dark:border-brand-800 dark:text-gray-300">{p.need}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-600 dark:border-brand-800 dark:text-gray-300">{p.plan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="（二）需求评估" desc="按「初评—危机评估—补充测评」的路径开展">
        <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-gray-600 dark:text-gray-400">
          <li>初次会谈聚焦问题清单与危机筛查</li>
          <li>确认自杀风险后立即进行危机评估并置于服务首位</li>
          <li>介入中期针对初期评估遗漏的死亡焦虑维度补充测评</li>
        </ul>
        <div className="space-y-2">
          {CASE_STUDY.assessments.map((a) => (
            <div key={a.tool} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 p-3 dark:border-brand-700">
              <div className="flex items-center gap-3">
                <span className="rounded bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-800 dark:bg-brand-800 dark:text-brand-100">{a.name}</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{a.label}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-red-600 dark:text-red-400">前测 {a.pre}</span>
                <Link to={`/tools/${a.tool}`} className="text-xs text-brand-600 underline dark:text-brand-300">去施测 →</Link>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-500">量表结果与临床观察、家属访谈相互印证，共同构成需求评估结论；评估贯穿服务全程，每次接触均重新确认状态与风险。</p>
      </Section>

      <Section title="（三）服务成效" desc="以后测对比基线，第 3 周、第 5 周设过程监测点">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead><tr className="bg-brand-600 text-white"><th className="px-3 py-2 text-left">评估工具</th><th className="px-3 py-2 text-left">前测</th><th className="px-3 py-2 text-left">过程监测（3 周／5 周）</th><th className="px-3 py-2 text-left">后测</th><th className="px-3 py-2 text-left">变化说明</th></tr></thead>
            <tbody>
              {CASE_STUDY.assessments.map((a, i) => (
                <tr key={a.tool} className={i % 2 ? 'bg-warm-50 dark:bg-brand-950/50' : 'bg-white dark:bg-brand-900/30'}>
                  <td className="border border-gray-200 px-3 py-2 font-medium dark:border-brand-800">{a.name}</td>
                  <td className="border border-gray-200 px-3 py-2 text-red-600 dark:border-red-400 dark:border-brand-800">{a.pre}{a.preLv && <span className="ml-1 text-[10px]">({a.preLv})</span>}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-500 dark:border-brand-800">{a.mid[0] ?? '—'} / {a.mid[1] ?? '—'}</td>
                  <td className="border border-gray-200 px-3 py-2 font-bold text-green-700 dark:text-green-400 dark:border-brand-800">{a.post}{a.postLv && <span className="ml-1 text-[10px] font-normal">({a.postLv})</span>}</td>
                  <td className="border border-gray-200 px-3 py-2 text-xs text-gray-600 dark:border-brand-800 dark:text-gray-300">{a.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-lg border border-brand-200 bg-brand-50/60 p-4 dark:border-brand-700 dark:bg-brand-900/30">
          <p className="text-xs font-semibold text-brand-900 dark:text-brand-200">质性变化</p>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{CASE_STUDY.qualitative}</p>
        </div>
      </Section>

      <Section title="（四）理论依据与运用" desc="依评估确认的需求，先后引入以下理论框架指导干预设计">
        <div className="space-y-3">
          {CASE_STUDY.theories.map((t) => (
            <div key={t.t} className="rounded-lg border border-gray-200 p-3 dark:border-brand-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.t}</p>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">核心观点：{t.c}</p>
              <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">对应需求与运用：{t.u}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="（五）服务路径" desc="接案—预估—计划—介入—评估—结案">
        <ol className="space-y-2">
          {CASE_STUDY.path.map((p, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">{i + 1}</span>
              <span className="text-gray-700 dark:text-gray-300">{p}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Takeaway text={CASE_STUDY.takeaway} />
    </div>
  );
}

/* ---------------- 小组 ---------------- */

function GroupTab() {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-brand-800 dark:bg-brand-900/40">
        <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">{GROUP_STUDY.name}实务解析</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{GROUP_STUDY.background}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Spec label="小组规模" value={GROUP_STUDY.size} />
          <Spec label="频次" value={GROUP_STUDY.freq} />
          <Spec label="主线" value="四道人生情感闭环" />
        </div>
      </section>

      <Section title="（一）前测问卷包与需求">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead><tr className="bg-brand-600 text-white"><th className="px-3 py-2 text-left">评估工具</th><th className="px-3 py-2 text-left">测量重点</th><th className="px-3 py-2 text-left">前测结果</th><th className="px-3 py-2 text-left">反映的需求</th><th className="px-3 py-2 text-left">操作</th></tr></thead>
            <tbody>
              {GROUP_STUDY.preSurvey.map((p, i) => (
                <tr key={i} className={i % 2 ? 'bg-warm-50 dark:bg-brand-950/50' : 'bg-white dark:bg-brand-900/30'}>
                  <td className="border border-gray-200 px-3 py-2 font-medium dark:border-brand-800">{p.tool}</td>
                  <td className="border border-gray-200 px-3 py-2 text-xs text-gray-600 dark:border-brand-800 dark:text-gray-300">{p.focus}</td>
                  <td className="border border-gray-200 px-3 py-2 text-xs text-gray-700 dark:border-brand-800 dark:text-gray-300">{p.result}</td>
                  <td className="border border-gray-200 px-3 py-2 text-xs text-gray-700 dark:border-brand-800 dark:text-gray-300">{p.need}</td>
                  <td className="border border-gray-200 px-3 py-2 dark:border-brand-800">
                    {p.link ? (
                      <Link to={`/tools/${p.link}`} className="text-xs text-brand-600 underline dark:text-brand-300">去施测 →</Link>
                    ) : (
                      <span className="text-[10px] text-gray-400">需自编/改编版</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="（二）六节活动设计" desc="主线为四道人生逐步完成情感闭环">
        <div className="space-y-2">
          {GROUP_STUDY.sessions.map((s) => (
            <div key={s.n} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 p-3 dark:border-brand-700">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">{s.n}</span>
                <span className="text-sm text-gray-800 dark:text-gray-200">{s.main}</span>
              </div>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600 dark:bg-brand-800 dark:text-gray-300">{s.need}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="（三）理论运用">
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{GROUP_STUDY.theories}</p>
      </Section>

      <Section title="（四）服务成效" desc="以后测对比前测，组均值变化">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead><tr className="bg-brand-600 text-white"><th className="px-3 py-2 text-left">评估工具</th><th className="px-3 py-2 text-left">前测</th><th className="px-3 py-2 text-left">后测</th><th className="px-3 py-2 text-left">变化说明</th></tr></thead>
            <tbody>
              {GROUP_STUDY.outcome.map((o, i) => (
                <tr key={i} className={i % 2 ? 'bg-warm-50 dark:bg-brand-950/50' : 'bg-white dark:bg-brand-900/30'}>
                  <td className="border border-gray-200 px-3 py-2 font-medium dark:border-brand-800">{o.tool}</td>
                  <td className="border border-gray-200 px-3 py-2 text-red-600 dark:text-red-400 dark:border-brand-800">{o.pre}</td>
                  <td className="border border-gray-200 px-3 py-2 font-bold text-green-700 dark:text-green-400 dark:border-brand-800">{o.post}</td>
                  <td className="border border-gray-200 px-3 py-2 text-xs text-gray-600 dark:border-brand-800 dark:text-gray-300">{o.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 rounded-lg border border-brand-200 bg-brand-50/60 p-4 dark:border-brand-700 dark:bg-brand-900/30">
          <p className="text-xs font-semibold text-brand-900 dark:text-brand-200">质性反馈</p>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{GROUP_STUDY.qualitative}</p>
        </div>
      </Section>

      <Takeaway text={GROUP_STUDY.takeaway} />

      <div className="flex gap-3">
        <Link to="/worksheets/group-bereaved" className="rounded-lg border border-brand-300 bg-white px-4 py-2 text-sm text-brand-700 hover:bg-brand-50 dark:border-brand-700 dark:bg-brand-900 dark:text-brand-200">
          📋 打开完整小组带领模板
        </Link>
      </div>
    </div>
  );
}

/* ---------------- 社区 ---------------- */

function CommunityTab() {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-brand-800 dark:bg-brand-900/40">
        <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">三场社区活动的实务要点</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          依托医务社工服务项目开展：一场面向医护与社工的生前预嘱专题培训、一场家庭支持与文化因素专题培训、一场面向社区居民与家属的病情沟通技巧宣教活动。
        </p>
      </section>

      <Section title="（一）设计思路与本章方案的对应">
        <div className="space-y-3">
          {COMMUNITY_STUDY.activities.map((a, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-4 dark:border-brand-700">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-800 dark:bg-brand-800 dark:text-brand-100">{a.name}</span>
                <span className="text-xs text-gray-500">{a.audience}</span>
              </div>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{a.mapping}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="（二）实施要点">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 p-4 dark:border-brand-700">
            <p className="text-xs font-semibold text-brand-700 dark:text-brand-300">培训侧</p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{COMMUNITY_STUDY.implement.培训侧}</p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4 dark:border-brand-700">
            <p className="text-xs font-semibold text-brand-700 dark:text-brand-300">宣教侧</p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{COMMUNITY_STUDY.implement.宣教侧}</p>
          </div>
        </div>
      </Section>

      <Section title="（三）成效与反馈">
        <div className="space-y-3">
          {Object.entries(COMMUNITY_STUDY.feedback).map(([k, v]) => (
            <div key={k} className="rounded-lg border border-gray-200 p-4 dark:border-brand-700">
              <p className="text-xs font-semibold text-gray-500">{k === '过程' ? '过程评估' : k === '结果' ? '结果评估' : '跟进评估'}</p>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{v}</p>
            </div>
          ))}
        </div>
      </Section>

      <Takeaway text={COMMUNITY_STUDY.takeaway} />

      <div className="flex gap-3">
        <Link to="/resources" className="rounded-lg border border-brand-300 bg-white px-4 py-2 text-sm text-brand-700 hover:bg-brand-50 dark:border-brand-700 dark:bg-brand-900 dark:text-brand-200">
          📚 查看资源中心（生前预嘱文本、社区方案）
        </Link>
        <Link to="/worksheets/five-wishes" className="rounded-lg border border-brand-300 bg-white px-4 py-2 text-sm text-brand-700 hover:bg-brand-50 dark:border-brand-700 dark:bg-brand-900 dark:text-brand-200">
          💚 填写《我的五个愿望》
        </Link>
      </div>
    </div>
  );
}

/* ---------------- 公共小组件 ---------------- */

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-brand-800 dark:bg-brand-900/40">
      <h3 className="font-serif text-base font-bold text-gray-900 dark:text-white">{title}</h3>
      {desc && <p className="mt-0.5 text-xs text-gray-500">{desc}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-brand-800 dark:bg-brand-900/30">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

function Takeaway({ text }: { text: string }) {
  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-700 dark:bg-amber-900/20">
      <h3 className="font-serif text-base font-bold text-amber-900 dark:text-amber-200">💡 小结与启示</h3>
      <p className="mt-2 text-sm leading-relaxed text-amber-900 dark:text-amber-100">{text}</p>
    </section>
  );
}