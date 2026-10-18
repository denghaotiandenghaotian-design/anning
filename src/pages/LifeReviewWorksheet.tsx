import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const KEY = 'anning-handbook-ws-life-review';

const STAGES = [
  { id: 'childhood', label: '童年与原生家庭', icon: '👶', prompt: '出生地、父母、童年最深的画面……' },
  { id: 'youth', label: '青年与学习', icon: '🎓', prompt: '求学经历、青春期的梦想与转折……' },
  { id: 'career', label: '事业与成家', icon: '🌳', prompt: '工作、家庭、孩子的到来……' },
  { id: 'middle', label: '中年与转折', icon: '⛰', prompt: '挑战与成长、关键决定……' },
  { id: 'later', label: '晚年与现在', icon: '🌿', prompt: '当下的生活、想做的事、想说的话……' },
  { id: 'legacy', label: '想留下的', icon: '🕊', prompt: '想传给家人或后辈的话、智慧、叮嘱……' },
];

type Draft = Record<string, string>;

export function LifeReviewWorksheet() {
  const [draft, setDraft] = useState<Draft>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      /* ignore */
    }
    return {};
  });
  const [active, setActive] = useState(STAGES[0].id);
  const [meta, setMeta] = useState({ name: '', date: new Date().toISOString().slice(0, 10) });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(draft));
  }, [draft]);

  const current = STAGES.find((s) => s.id === active)!;
  const filled = STAGES.filter((s) => draft[s.id]?.trim().length > 0).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/worksheets" className="hover:text-brand-600">工作表</Link>
        <span className="mx-2">/</span>
        <span>生命回顾</span>
      </nav>

      <header className="mb-6 border-b border-gray-200 pb-6 dark:border-brand-800">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          意义建构 · 互动工作表
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-gray-900 dark:text-white">生命回顾工作纸</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
          按人生阶段回顾经历、关键他人与未竟事宜，接纳圆满与遗憾，完成自我整合。
          适用于 Erikson 老年期"自我整合 vs. 绝望"任务的实务介入。
        </p>
      </header>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <Field label="姓名/称呼">
          <input
            value={meta.name}
            onChange={(e) => setMeta({ ...meta, name: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
          />
        </Field>
        <Field label="日期">
          <input
            type="date"
            value={meta.date}
            onChange={(e) => setMeta({ ...meta, date: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
          />
        </Field>
      </div>

      <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
        <span>已完成 {filled} / {STAGES.length} 个阶段</span>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
        >
          🖨 打印
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {STAGES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(s.id)}
            className={`rounded-lg border px-3 py-2 text-sm transition ${
              active === s.id
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:hover:bg-brand-900'
            }`}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      <main className="rounded-xl border border-gray-200 bg-white p-6 dark:border-brand-800 dark:bg-brand-900/40">
        <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
          {current.icon} {current.label}
        </h2>
        <p className="mt-1 text-sm italic text-gray-500">{current.prompt}</p>
        <textarea
          value={draft[active] ?? ''}
          onChange={(e) => setDraft({ ...draft, [active]: e.target.value })}
          rows={10}
          placeholder="慢慢写下你的回忆……"
          className="mt-3 w-full rounded-lg border border-brand-200 bg-brand-50/40 p-4 text-base leading-relaxed outline-none focus:border-brand-400 dark:border-brand-700 dark:bg-brand-950/30"
        />
      </main>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-brand-800 dark:bg-brand-900/40">
        <h3 className="font-serif text-base font-bold">完整生命回顾 · 预览</h3>
        <div className="mt-4 space-y-4">
          {STAGES.map((s) => (
            <div key={s.id}>
              <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">
                {s.icon} {s.label}
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                {draft[s.id] || <em className="text-gray-400">（未填）</em>}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-right text-xs text-gray-500">
          {meta.name || '匿名'} · {meta.date}
        </p>
      </section>

      <section className="mt-6 rounded-xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-700 dark:bg-amber-900/20">
        <h3 className="font-serif text-sm font-bold text-amber-900 dark:text-amber-200">使用提示</h3>
        <ul className="mt-2 space-y-1 text-xs text-amber-900 dark:text-amber-100">
          <li>• 可结合老照片、旧物件、口述史等媒介一起使用。</li>
          <li>• 引导完成"未竟事宜"的和解：如未寄出的信、未说出的话。</li>
          <li>• 不必所有阶段都写满，<strong>顺其自然</strong>，让记忆自己浮现。</li>
          <li>• Butler（1963）与 Erikson（1950）的研究都指出：系统回顾促进自我整合。</li>
        </ul>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
      {children}
    </label>
  );
}