import { Link } from 'react-router-dom';

const SESSIONS = [
  {
    no: 1,
    title: '初识与契约',
    goal: '建立团体安全氛围，订立小组契约。',
    flow: [
      '暖场：自我介绍 + 一句话心情（5 分钟）',
      '小组介绍：目标、节次、保密原则（10 分钟）',
      '订立契约：发言方式、隐私、可随时退出（20 分钟）',
      '破冰活动：心愿卡——写下参加小组的希望（15 分钟）',
      '正念呼吸放松（10 分钟）',
    ],
    materials: '心愿卡、签字笔、保密协议、放松引导音频。',
    risk: '观察成员初始状态；情绪激动者单独安抚。',
  },
  {
    no: 2,
    title: '正常化哀伤',
    goal: '认识哀伤反应的多样性，减少自我评判。',
    flow: [
      '回顾上次 + 签到（10 分钟）',
      '哀伤反应分享：身体、情绪、认知、行为、灵性、社会六个面向（30 分钟）',
      '"哀伤三要素"——失落、孤独、未竟事宜讲解（15 分钟）',
      '正念呼吸 + 简短书写（10 分钟）',
    ],
    materials: '六面向图示卡、书写纸。',
    risk: '有人可能首次触碰强烈情绪，注意"温和不深挖"原则。',
  },
  {
    no: 3,
    title: '情绪表达与承载',
    goal: '提供安全的情绪表达空间，学习自我安抚。',
    flow: [
      '签到 + 情绪脸谱打分（10 分钟）',
      '正念呼吸 + 渐进性肌肉放松（10 分钟）',
      '"一封写给逝者的信"片段分享（30 分钟）',
      '身体扫描放松（10 分钟）',
    ],
    materials: '信纸、信封、情绪脸谱图。',
    risk: '情绪崩溃即暂停、单独安抚、必要时转介。',
  },
  {
    no: 4,
    title: '与逝者持续联结',
    goal: '协助成员把与逝者的关系转化为持续性心理联结。',
    flow: [
      '签到 + 上次回顾（10 分钟）',
      '纪念物分享：带来一件与逝者相关的物品（20 分钟）',
      '心愿串珠：DIY 串珠纪念物（30 分钟）',
      '意向书写：未竟事宜（10 分钟）',
    ],
    materials: '串珠材料、彩绳、剪刀（由社工统一收发）。',
    risk: '串珠工具严防自伤；情绪激动者单独安抚。',
  },
  {
    no: 5,
    title: '生活重建',
    goal: '促进哀伤双轨模型中"生活功能"轨道恢复。',
    flow: [
      '签到 + 情绪脸谱打分（10 分钟）',
      '作息、饮食、园艺活动分享（30 分钟）',
      '户外散步或简单园艺操作（30 分钟）',
      '意向书写：本周一件想做的事（5 分钟）',
    ],
    materials: '小型盆栽、香薰、音乐。',
    risk: '体力不支者允许坐位参与；不强求外出。',
  },
  {
    no: 6,
    title: '回顾与告别',
    goal: '巩固小组经验，完成团体告别，建立后续支持网络。',
    flow: [
      '回顾六节历程 + 照片分享（20 分钟）',
      '"我收到了什么"——团体互赠祝福（15 分钟）',
      '情绪脸谱 + 前后测对比（10 分钟）',
      '介绍社区资源、长期支持渠道（10 分钟）',
      '道别仪式 + 合影（10 分钟）',
    ],
    materials: '照片、合照打印、纪念册。',
    risk: '离别情绪可能引发哀伤重现，提前沟通"结束≠失联"。',
  },
];

export function GroupBereavedWorksheet() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/worksheets" className="hover:text-brand-600">工作表</Link>
        <span className="mx-2">/</span>
        <span>居丧家属哀伤辅导小组</span>
      </nav>

      <header className="mb-6 border-b border-gray-200 pb-6 dark:border-brand-800">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          小组工作 · 实务模板
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-gray-900 dark:text-white">
          居丧家属哀伤辅导小组 · 6 节活动模板
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
          封闭小组 6—8 人，每周 1 次 × 6 节。每次 60—90 分钟。
          适用于亲人离世后的居丧家属，可直接打印作为带领者备案。
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <Spec label="对象" value="居丧家属" />
          <Spec label="规模" value="6—8 人" />
          <Spec label="频次" value="每周 1 次 × 6 节" />
          <Spec label="时长" value="60—90 分钟/节" />
        </div>
      </header>

      <section className="space-y-6">
        {SESSIONS.map((s) => (
          <article key={s.no} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-brand-800 dark:bg-brand-900/40">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
                第 {s.no} 节 · {s.title}
              </h2>
              <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] text-brand-800 dark:bg-brand-800 dark:text-brand-100">
                {s.no}/6
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
                  <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">🎁 物资准备</p>
                  <p className="mt-1 text-xs text-amber-900 dark:text-amber-100">{s.materials}</p>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50/50 p-3 dark:border-red-700 dark:bg-red-900/20">
                  <p className="text-xs font-semibold text-red-900 dark:text-red-200">⚠️ 风险防控</p>
                  <p className="mt-1 text-xs text-red-900 dark:text-red-100">{s.risk}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-xl border border-brand-200 bg-brand-50/40 p-6 dark:border-brand-700 dark:bg-brand-900/30">
        <h2 className="font-serif text-base font-bold text-brand-900 dark:text-brand-200">带领者核心原则</h2>
        <ul className="mt-3 space-y-2 text-sm text-brand-900 dark:text-brand-100">
          <li>• <strong>温和原则</strong>：不逼迫发言、不强迫回忆、不强制书写，冥想可睁眼静坐。</li>
          <li>• <strong>多元包容</strong>：不评判情绪深浅与表达方式。</li>
          <li>• <strong>严格保密</strong>：书信与分享内容密封自持、不外传。</li>
          <li>• <strong>安全优先</strong>：任何环节可中途退出，情绪崩溃即暂停安抚。</li>
          <li>• <strong>识别高危</strong>：长期重度失眠、持续自我否定、轻生念头一经发现立即转介。</li>
        </ul>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-brand-800 dark:bg-brand-900/40">
        <h2 className="font-serif text-base font-bold">参考理论</h2>
        <ul className="mt-3 space-y-1 text-xs text-gray-600 dark:text-gray-400">
          <li>• <strong>哀伤双轨模型（Rubin）</strong>：情绪工作与生活重建双线并进。</li>
          <li>• <strong>持续联结理论（Klass 等）</strong>：纪念物、心愿串珠等承载与逝者的持续联结。</li>
          <li>• <strong>表达性艺术治疗</strong>：串珠、绘画等低门槛媒介承载难以言说的情绪。</li>
          <li>• <strong>情绪 ABC 理论（Ellis）</strong>：纠正"悲伤外露是软弱"等不合理认知。</li>
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