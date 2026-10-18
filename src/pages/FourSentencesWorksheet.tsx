import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const KEY = 'anning-handbook-ws-four-sentences';

type Section = 'thanks' | 'sorry' | 'love' | 'goodbye';

const SECTIONS: { id: Section; title: string; subtitle: string; prompt: string; icon: string }[] = [
  {
    id: 'thanks',
    title: '道 谢',
    subtitle: '回顾值得感激的瞬间',
    prompt: '我想要感谢的人 / 事 / 瞬间……',
    icon: '🙏',
  },
  {
    id: 'sorry',
    title: '道 歉',
    subtitle: '承认遗憾，放下自责',
    prompt: '我希望向谁 / 为何事说一声抱歉……',
    icon: '🌧',
  },
  {
    id: 'love',
    title: '道 爱',
    subtitle: '把说不出口的话说出来',
    prompt: '我想让你知道……',
    icon: '💗',
  },
  {
    id: 'goodbye',
    title: '道 别',
    subtitle: '完成跨越生死的对话',
    prompt: '如果这是我最后一次见你……',
    icon: '🌅',
  },
];

type Draft = Record<Section, string>;

export function FourSentencesWorksheet() {
  const [active, setActive] = useState<Section>('thanks');
  const [draft, setDraft] = useState<Draft>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      /* ignore */
    }
    return { thanks: '', sorry: '', love: '', goodbye: '' };
  });
  const [meta, setMeta] = useState({ name: '', recipient: '', date: new Date().toISOString().slice(0, 10) });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(draft));
  }, [draft]);

  const current = SECTIONS.find((s) => s.id === active)!;
  const totalChars = SECTIONS.reduce((acc, s) => acc + (draft[s.id]?.trim().length ?? 0), 0);

  const onPrint = () => window.print();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/worksheets" className="hover:text-brand-600">工作表</Link>
        <span className="mx-2">/</span>
        <span>四道人生</span>
      </nav>

      <header className="mb-6 border-b border-gray-200 pb-6 dark:border-brand-800">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          临终家庭工作 · 互动工作表
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-gray-900 dark:text-white">四道人生</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
          道谢、道歉、道爱、道别四步完成情感闭环。写作时不必追求完美，
          <strong>真实比完整更有意义</strong>。可保存草稿、随时返回修改。
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-2 print:hidden">
          {SECTIONS.map((s) => {
            const isActive = s.id === active;
            const filled = draft[s.id]?.trim().length > 0;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
                  isActive
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/40'
                    : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-brand-800 dark:bg-brand-900/30 dark:hover:bg-brand-900/50'
                }`}
              >
                <span className="text-2xl">{s.icon}</span>
                <span className="flex-1">
                  <span className="block font-medium text-sm">{s.title}</span>
                  <span className="block text-[10px] text-gray-500">{s.subtitle}</span>
                </span>
                {filled && <span className="text-brand-500">✓</span>}
              </button>
            );
          })}
          <div className="rounded-lg bg-brand-50/60 p-3 text-xs text-gray-600 dark:bg-brand-900/30 dark:text-gray-400">
            已写：{totalChars} 字
          </div>
        </aside>

        <main className="rounded-xl border border-gray-200 bg-white p-6 dark:border-brand-800 dark:bg-brand-900/40">
          <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4 dark:border-brand-800">
            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                {current.icon} {current.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500">{current.subtitle}</p>
            </div>
            <span className="text-[10px] text-gray-400">
              {SECTIONS.findIndex((s) => s.id === active) + 1} / 4
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Field label="写给谁">
              <input
                value={meta.recipient}
                onChange={(e) => setMeta({ ...meta, recipient: e.target.value })}
                placeholder="如 妻子 / 父亲 / 自己"
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
              />
            </Field>
            <Field label="姓名/称呼">
              <input
                value={meta.name}
                onChange={(e) => setMeta({ ...meta, name: e.target.value })}
                placeholder="如 张爷爷"
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

          <p className="mt-5 text-sm italic text-gray-500">{current.prompt}</p>
          <textarea
            value={draft[active]}
            onChange={(e) => setDraft({ ...draft, [active]: e.target.value })}
            rows={12}
            placeholder="慢慢写，写给此刻心里的那个人……"
            className="mt-2 w-full rounded-lg border border-brand-200 bg-brand-50/40 p-4 text-base leading-relaxed outline-none focus:border-brand-400 dark:border-brand-700 dark:bg-brand-950/30"
          />

          <div className="mt-4 flex flex-wrap gap-3 border-t border-gray-100 pt-4 dark:border-brand-800">
            <button
              type="button"
              disabled={active === SECTIONS[0].id}
              onClick={() => setActive(SECTIONS[SECTIONS.findIndex((s) => s.id === active) - 1].id)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-30 dark:border-brand-700"
            >
              ← 上一节
            </button>
            <button
              type="button"
              disabled={active === SECTIONS[SECTIONS.length - 1].id}
              onClick={() => setActive(SECTIONS[SECTIONS.findIndex((s) => s.id === active) + 1].id)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-30 dark:border-brand-700"
            >
              下一节 →
            </button>
            <button
              type="button"
              onClick={onPrint}
              className="ml-auto rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              🖨 打印全部
            </button>
          </div>
        </main>
      </div>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-brand-800 dark:bg-brand-900/40">
        <h3 className="font-serif text-base font-bold">四道人生 · 完整预览</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {SECTIONS.map((s) => (
            <div key={s.id} className="rounded-lg border border-gray-100 p-4 dark:border-brand-800">
              <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">
                {s.icon} {s.title}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                {draft[s.id] || <em className="text-gray-400">（未填）</em>}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-right text-xs text-gray-500">
          写给 <strong>{meta.recipient || '—'}</strong> · {meta.name || '匿名'} · {meta.date}
        </p>
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