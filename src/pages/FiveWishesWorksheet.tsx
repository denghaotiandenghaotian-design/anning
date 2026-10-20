import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const KEY = 'anning-handbook-five-wishes';

const WISHES = [
  {
    id: 'w1',
    no: '愿望一',
    title: '我要或不要什么医疗服务',
    core: '是否采取插管、心肺复苏等创伤性抢救措施，是否进行原发疾病的延续性治疗等医疗选择。',
    questions: [
      '当你病重、无法用语言表达时，你希望为你做哪些治疗？',
      '你希望使用哪些药物？哪些药物你不希望使用？',
      '你希望 CPR（心肺复苏）被使用吗？',
      '你希望被放上呼吸机（人工呼吸机）吗？',
      '你希望被紧急插管吗？',
      '你希望接受抗生素来治疗感染吗？',
      '如果你的病情没有好转、还在恶化，你希望医生怎么做？',
    ],
  },
  {
    id: 'w2',
    no: '愿望二',
    title: '我要或不要生命支持系统',
    core: '是否使用呼吸机、体外营养等生命支持治疗，在何种情形下停止使用。',
    questions: [
      '你希望何时停止使用呼吸机等生命支持系统？',
      '你希望使用心脏起搏器或人工心脏吗？',
      '你希望接受透析（人工肾）治疗吗？',
      '你希望使用体外营养（喂食管、胃造口）吗？',
      '你希望接受多久的抢救？',
    ],
  },
  {
    id: 'w3',
    no: '愿望三',
    title: '我希望别人怎么对待我',
    core: '身体照护、病房环境布置、音乐陪伴等个性化照护与陪伴安排。',
    questions: [
      '你希望有亲人在你身边吗？',
      '你希望怎么被照顾？',
      '你希望墓地或骨灰安放方式如何安排？',
      '你希望多长时间被治疗？多久以后停止尝试治疗？',
      '你希望在哪里度过生命最后的日子？',
      '你希望家人如何对待你？',
    ],
  },
  {
    id: 'w4',
    no: '愿望四',
    title: '我想让我的家人和朋友知道什么',
    core: '希望家人知晓的心愿、歉意与爱意表达，对家人未来生活的期许。',
    questions: [
      '你最希望你的家人了解你哪些心愿？',
      '你最希望你的家人了解你哪些歉意（对不起）？',
      '你最希望你的家人了解你的哪些爱意？',
      '你对家人未来的生活有什么期许与祝福？',
      '你最想对家人说的一句话是什么？',
    ],
  },
  {
    id: 'w5',
    no: '愿望五',
    title: '我希望谁帮助我',
    core: '指定可信赖的代理人（联系人），在本人无法表达意愿时代为沟通与决策。',
    questions: [
      '你希望谁能作为你的代理人（或医疗决策代理人）？',
      '这个人的姓名、联系方式是什么？',
      '如果代理人无法到场，第二顺位代理人是谁？',
      '代理人需要被告知哪些关键信息？',
    ],
  },
];

type WishKey = 'w1' | 'w2' | 'w3' | 'w4' | 'w5';

type Draft = {
  w1: string[];
  w2: string[];
  w3: string[];
  w4: string[];
  w5: string[];
  agentName: string;
  agentPhone: string;
  agentBackup: string;
};

const EMPTY: Draft = {
  w1: ['', '', '', '', '', '', ''],
  w2: ['', '', '', '', ''],
  w3: ['', '', '', '', '', ''],
  w4: ['', '', '', '', ''],
  w5: ['', '', '', ''],
  agentName: '',
  agentPhone: '',
  agentBackup: '',
};

export function FiveWishesWorksheet() {
  const [draft, setDraft] = useState<Draft>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return { ...EMPTY, ...JSON.parse(raw) };
    } catch { /* ignore */ }
    return EMPTY;
  });
  const [meta, setMeta] = useState({ name: '', date: new Date().toISOString().slice(0, 10), witness: '' });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(draft));
  }, [draft]);

  const filledCount = Object.values(draft)
    .filter((v): v is string[] => Array.isArray(v))
    .reduce((acc, arr) => acc + arr.filter((s) => s.trim()).length, 0);

  const setAns = (wishId: WishKey, idx: number, val: string) => {
    setDraft((p) => ({ ...p, [wishId]: p[wishId].map((s, i) => (i === idx ? val : s)) }));
  };

  const completed = WISHES.filter((w) => draft[w.id as WishKey].some((s) => s.trim()));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/worksheets" className="hover:text-brand-600">工作表</Link>
        <span className="mx-2">/</span>
        <span>我的五个愿望</span>
      </nav>

      <header className="mb-6 border-b border-gray-200 pb-6 dark:border-brand-800">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          生前预嘱 · 临终意愿表达
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-gray-900 dark:text-white">
          《我的五个愿望》生前预嘱工作纸
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          生前预嘱（Living Will）是指人们在健康或意识清楚时预先签署的、说明在不可治愈的伤病末期或临终时
          <strong>要或不要哪种医疗护理</strong>的指示文件，可随时修改或撤销。
          我国《深圳经济特区医疗条例》（2023 年 1 月 1 日施行）第七十八条已首次将生前预嘱写入地方性法规。
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Spec label="已完成愿望" value={`${completed.length} / 5`} />
          <Spec label="已填条目" value={`${filledCount} 条`} />
          <Spec label="可随时修改" value="是" />
        </div>
      </header>

      <section className="mb-6 grid gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:grid-cols-3 dark:border-brand-800 dark:bg-brand-900/40">
        <Field label="填写人姓名">
          <input value={meta.name} onChange={(e) => setMeta({ ...meta, name: e.target.value })} placeholder="如 张明" className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700" />
        </Field>
        <Field label="填写日期">
          <input type="date" value={meta.date} onChange={(e) => setMeta({ ...meta, date: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700" />
        </Field>
        <Field label="见证人（可选）">
          <input value={meta.witness} onChange={(e) => setMeta({ ...meta, witness: e.target.value })} placeholder="如 李医生" className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700" />
        </Field>
      </section>

      <div className="space-y-5">
        {WISHES.map((w) => {
          const done = draft[w.id as WishKey].filter((s) => s.trim()).length;
          const total = w.questions.length;
          return (
            <section key={w.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-brand-800 dark:bg-brand-900/40">
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-gray-100 pb-3 dark:border-brand-800">
                <div>
                  <p className="text-xs font-semibold text-brand-600 dark:text-brand-300">{w.no}</p>
                  <h2 className="mt-0.5 font-serif text-lg font-bold text-gray-900 dark:text-white">{w.title}</h2>
                  <p className="mt-1 text-xs text-gray-500">{w.core}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                  done === total ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'
                  : done > 0 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
                  : 'bg-gray-100 text-gray-500 dark:bg-brand-800 dark:text-gray-300'
                }`}>
                  {done} / {total}
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {w.questions.map((q, qi) => (
                  <div key={qi}>
                    <p className="text-sm text-gray-800 dark:text-gray-200">{q}</p>
                    <textarea
                      value={draft[w.id as WishKey][qi]}
                      onChange={(e) => setAns(w.id as WishKey, qi, e.target.value)}
                      rows={2}
                      placeholder="写下你的意愿……"
                      className="mt-1.5 w-full rounded-lg border border-brand-200 bg-brand-50/40 px-3 py-2 text-sm leading-relaxed outline-none transition focus:border-brand-400 dark:border-brand-700 dark:bg-brand-950/30"
                    />
                  </div>
                ))}
              </div>

              {w.id === 'w5' && (
                <div className="mt-4 grid gap-3 rounded-lg bg-brand-50/60 p-4 sm:grid-cols-3 dark:bg-brand-900/30">
                  <Field label="代理人姓名">
                    <input value={draft.agentName} onChange={(e) => setDraft({ ...draft, agentName: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-brand-700 dark:bg-brand-950" />
                  </Field>
                  <Field label="代理人电话">
                    <input value={draft.agentPhone} onChange={(e) => setDraft({ ...draft, agentPhone: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-brand-700 dark:bg-brand-950" />
                  </Field>
                  <Field label="第二顺位代理人">
                    <input value={draft.agentBackup} onChange={(e) => setDraft({ ...draft, agentBackup: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-brand-700 dark:bg-brand-950" />
                  </Field>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-700 dark:bg-amber-900/20">
        <h3 className="font-serif text-base font-bold text-amber-900 dark:text-amber-200">⚠️ 使用说明与法律提示</h3>
        <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-amber-900 dark:text-amber-100">
          <li>• 本工作纸依据北京生前预嘱推广协会（其前身为 2006 年创办的"选择与尊严"公益网站）发布的《我的五个愿望》整理，仅作<b>公益宣传与实务参考</b>。</li>
          <li>• <b>正式签署请通过协会官网注册使用</b>：<a href="https://www.lwpa.org.cn" target="_blank" rel="noreferrer" className="underline">www.lwpa.org.cn</a></li>
          <li>• 国外多地（如美国部分州）的生前预嘱具法律效力；<b>我国目前属民间文档</b>，《深圳经济特区医疗条例》第七十八条已开展立法实践，全国性立法仍在推进。</li>
          <li>• 建议在<b>意识清楚、情绪稳定、身体状况良好</b>时填写；避免在抢救关头仓促决定。</li>
          <li>• 填写完成后请<b>打印两份签字、一份自留、一份交给医生或信任的家人</b>，并告知代理人。</li>
          <li>• 本工作纸<b>可随时修改或撤销</b>；修改后请重新告知代理人与医疗团队。</li>
        </ul>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => window.print()} className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white hover:bg-brand-700">
          🖨 打印并签署
        </button>
        <button
          type="button"
          onClick={() => {
            if (confirm('清空全部内容？此操作不可恢复。')) { setDraft(EMPTY); localStorage.removeItem(KEY); }
          }}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:hover:bg-brand-900"
        >
          清空重来
        </button>
        <Link to="/worksheets" className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:hover:bg-brand-900">
          返回工作表
        </Link>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        {meta.name || '未署名'} · {meta.date}{meta.witness && ` · 见证人：${meta.witness}`}
      </p>
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

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 dark:border-brand-800 dark:bg-brand-900/30">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 font-serif text-lg font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}