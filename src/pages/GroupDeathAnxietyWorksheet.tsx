import { Link } from 'react-router-dom';

const SESSIONS = [
  {
    no: 1,
    title: '建立联结',
    goal: '组员相互认识，建立团体安全感。',
    flow: ['签到 + 心情脸谱', '自我介绍 + 一句话心愿', '小组介绍与契约', '破冰：我的老物件故事'],
    materials: '签到表、心情卡、笔。',
    risk: '留意初期防御明显者，不强迫深入。',
  },
  {
    no: 2,
    title: '生命历程回顾',
    goal: '回顾一生重要节点，看到"完整的我"。',
    flow: ['签到', '生命线绘制（坐标纸）', '三人小组分享', '正念呼吸放松'],
    materials: '坐标纸、彩笔。',
    risk: '触及哀伤议题，温和处理。',
  },
  {
    no: 3,
    title: '掌控感：我的"小决定"',
    goal: '通过微小决定找回掌控感。',
    flow: ['签到', '一周"小决定"清单', '自主—胜任—归属需要讲解', '下节预告'],
    materials: '决定清单纸。',
    risk: '尊重成员对自主权的不同表达。',
  },
  {
    no: 4,
    title: '过去遗憾与和解',
    goal: '面对过去遗憾，尝试与自己和解。',
    flow: ['签到', '未寄出的信写作', '小组分享（自愿）', '正念呼吸'],
    materials: '信纸、信封。',
    risk: '未竟事宜可能引发强烈情绪。',
  },
  {
    no: 5,
    title: '未来遗憾与心愿',
    goal: '把心愿落实到可执行的小目标。',
    flow: ['签到', '心愿清单', '"90 天心愿计划"制定', '成员互赠祝福'],
    materials: '心愿卡。',
    risk: '心愿难以实现时引导接纳。',
  },
  {
    no: 6,
    title: '意义感与生命价值',
    goal: '从经历、人际、日常小事中挖掘意义。',
    flow: ['签到', '生命意义树（根—枝—叶—花—果）', '三人小组分享', '正念呼吸'],
    materials: '彩笔、画纸。',
    risk: '意义感缺失者不强求结论。',
  },
  {
    no: 7,
    title: '身体与现在',
    goal: '回到当下的身体感受与日常节奏。',
    flow: ['签到', '渐进性肌肉放松', '日常作息分享', '意向书写'],
    materials: '放松引导音频。',
    risk: '留意成员躯体不适。',
  },
  {
    no: 8,
    title: '回顾与告别',
    goal: '巩固八节历程，建立后续支持。',
    flow: ['签到 + 前后测对比', '团体互赠祝福', '社区资源介绍', '告别仪式 + 合影'],
    materials: '照片、合照打印。',
    risk: '离别情绪可能出现，事先沟通。',
  },
];

export function GroupDeathAnxietyWorksheet() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/worksheets" className="hover:text-brand-600">工作表</Link>
        <span className="mx-2">/</span>
        <span>死亡焦虑干预小组</span>
      </nav>

      <header className="mb-6 border-b border-gray-200 pb-6 dark:border-brand-800">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          小组工作 · 实务模板
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-gray-900 dark:text-white">
          死亡焦虑干预小组 · 8 节活动模板
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
          封闭小组 8—10 人，每周 1 次 × 8 节，每次 60—70 分钟。
          面向养老机构中存在不同程度死亡焦虑的老年入住者（认知功能正常）。
          设计依据：Tomer & Eliason 死亡焦虑综合模型（过去遗憾 / 未来遗憾 / 意义感缺失）。
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <Spec label="对象" value="养老机构老人" />
          <Spec label="规模" value="8—10 人" />
          <Spec label="频次" value="每周 1 次 × 8 节" />
          <Spec label="时长" value="60—70 分钟/节" />
        </div>
      </header>

      <section className="mb-6 grid gap-3 sm:grid-cols-3">
        <Spec label="主要目标" value="无憾感、掌控感、生命意义感提升" />
        <Spec label="理论框架" value="死亡焦虑综合模型" />
        <Spec label="可干预因子" value="过去遗憾、未来遗憾、意义感" />
      </section>

      <section className="space-y-6">
        {SESSIONS.map((s) => (
          <article key={s.no} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-brand-800 dark:bg-brand-900/40">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                第 {s.no} 节 · {s.title}
              </h2>
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] text-brand-800 dark:bg-brand-800 dark:text-brand-100">
                {s.no}/8
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-brand-600 dark:text-brand-300">🎯 {s.goal}</p>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-brand-950/40">
                <p className="text-xs font-semibold uppercase text-gray-500">流程</p>
                <ol className="mt-2 space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                  {s.flow.map((step, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="shrink-0 text-brand-600 dark:text-brand-300">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-700 dark:bg-amber-900/20">
                  <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">🎁 物资</p>
                  <p className="mt-1 text-xs text-amber-900 dark:text-amber-100">{s.materials}</p>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50/50 p-3 dark:border-red-700 dark:bg-red-900/20">
                  <p className="text-xs font-semibold text-red-900 dark:text-red-200">⚠️ 风险</p>
                  <p className="mt-1 text-xs text-red-900 dark:text-red-100">{s.risk}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-xl border border-brand-200 bg-brand-50/40 p-6 dark:border-brand-700 dark:bg-brand-900/30">
        <h2 className="font-serif text-base font-bold text-brand-900 dark:text-brand-200">评估建议</h2>
        <ul className="mt-3 space-y-2 text-sm text-brand-900 dark:text-brand-100">
          <li>• <strong>过程评估</strong>：出席率、参与度、即时反馈、带领者观察。</li>
          <li>• <strong>结果评估</strong>：简易情绪脸谱打分、满意度问卷。</li>
          <li>• <strong>前后测</strong>（可选）：DAP-R 死亡态度描绘量表、GDS 老年抑郁量表、SSRS 社会支持量表。</li>
          <li>• <strong>归档</strong>：签到表、过程记录、作品影像、督导台账。</li>
        </ul>
      </section>

      <div className="mt-6 flex gap-3 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          🖨 打印全部
        </button>
        <Link to="/worksheets" className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:hover:bg-brand-900">
          返回工作表
        </Link>
      </div>
    </div>
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