import { Link } from 'react-router-dom';

const WORKSHEETS = [
  {
    id: 'four-sentences',
    icon: '💌',
    title: '四道人生工作纸',
    desc: '道谢、道歉、道爱、道别四步完成情感闭环。',
    tag: '临终家庭工作',
    route: '/worksheets/four-sentences',
  },
  {
    id: 'life-review',
    icon: '🌱',
    title: '生命回顾工作纸',
    desc: '按人生阶段回顾经历，接纳圆满与遗憾。',
    tag: '意义建构',
    route: '/worksheets/life-review',
  },
  {
    id: 'five-wishes',
    icon: '💚',
    title: '我的五个愿望（生前预嘱）',
    desc: '五个维度表达临终医疗与照护意愿，可打印签署。',
    tag: '生前预嘱',
    route: '/worksheets/five-wishes',
  },
  {
    id: 'group-bereaved',
    icon: '🤝',
    title: '居丧家属哀伤辅导小组模板',
    desc: '6—8 人封闭小组，6 节次，含每节流程与物资清单。',
    tag: '小组工作',
    route: '/worksheets/group-bereaved',
  },
  {
    id: 'group-death-anxiety',
    icon: '🌅',
    title: '死亡焦虑干预小组模板',
    desc: '8—10 人封闭小组，8 节次，面向养老机构老年入住者。',
    tag: '小组工作',
    route: '/worksheets/group-death-anxiety',
  },
];

export function WorksheetsHub() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          互动工作表
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-gray-900 dark:text-white">实务工作表与小组模板</h1>
        <p className="mt-3 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
          可在线填写并打印带走的工作表。所有内容可本地保存为草稿，方便多次使用。
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {WORKSHEETS.map((w) => (
          <Link
            key={w.id}
            to={w.route}
            className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-brand-300 hover:shadow-md dark:border-brand-800 dark:bg-brand-900/40 dark:hover:border-brand-600"
          >
            <div className="text-3xl">{w.icon}</div>
            <h3 className="mt-3 font-serif text-xl font-bold text-gray-900 group-hover:text-brand-700 dark:text-white">
              {w.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{w.desc}</p>
            <span className="mt-3 inline-block rounded-md bg-brand-100 px-2 py-0.5 text-[10px] text-brand-800 dark:bg-brand-800 dark:text-brand-100">
              {w.tag}
            </span>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-xl border border-brand-200 bg-brand-50/40 p-6 dark:border-brand-700 dark:bg-brand-900/30">
        <h2 className="font-serif text-base font-bold text-brand-900 dark:text-brand-200">使用建议</h2>
        <ul className="mt-2 space-y-1 text-xs text-brand-900 dark:text-brand-100">
          <li>• 填写时不必追求完整表达，<strong>尊重案主当下的情绪节奏</strong>。</li>
          <li>• 可代笔、可口述、可停顿，<strong>随时可以暂停或退出</strong>。</li>
          <li>• 工作表内容可在浏览器中保存草稿，也可直接打印带走。</li>
          <li>• 涉及创伤或强烈情绪时，建议在专业社工或心理咨询师陪同下完成。</li>
        </ul>
      </section>
    </div>
  );
}