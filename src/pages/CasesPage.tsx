import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listCases, RISK_LABELS, seedSampleCases, type CaseFile, type CaseStage } from '@/lib/cases';

export function CasesPage() {
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [stageFilter, setStageFilter] = useState<CaseStage | '全部'>('全部');
  const [riskFilter, setRiskFilter] = useState<'全部' | '一般' | '关注' | '高危'>('全部');
  const [q, setQ] = useState('');

  useEffect(() => {
    seedSampleCases();
    setCases(listCases());
  }, []);

  const filtered = cases.filter((c) => {
    if (stageFilter !== '全部' && c.stage !== stageFilter) return false;
    if (riskFilter !== '全部' && RISK_LABELS[c.risk].label !== riskFilter) return false;
    if (q) {
      const haystack = `${c.code} ${c.diagnosis ?? ''} ${c.goal} ${c.concerns.join(' ')}`.toLowerCase();
      if (!haystack.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            个案管理
          </p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-gray-900 dark:text-white">个案档案</h1>
          <p className="mt-3 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
            用于接案—介入—结案的全过程追踪。数据存储在浏览器本地（localStorage），不上传任何服务器，请定期通过"导出 JSON"备份。
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/cases/new"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-brand-700"
          >
            + 新建个案
          </Link>
        </div>
      </header>

      <section className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-brand-800 dark:bg-brand-900/40">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索编号、诊断、议题…"
          className="flex-1 min-w-[200px] rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-400 dark:border-brand-700"
        />
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value as CaseStage | '全部')}
          className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
        >
          <option>全部</option>
          {(['接案', '预估', '计划', '介入', '评估', '结案', '回访'] as CaseStage[]).map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value as '全部' | '一般' | '关注' | '高危')}
          className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
        >
          <option>全部</option>
          <option>一般</option>
          <option>关注</option>
          <option>高危</option>
        </select>
      </section>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-brand-700">
          <p className="text-4xl">📂</p>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            {cases.length === 0 ? '暂无个案档案' : '没有符合条件的个案'}
          </p>
          <Link
            to="/cases/new"
            className="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white"
          >
            建立第一个个案
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((c) => (
            <Link
              key={c.id}
              to={`/cases/${c.id}`}
              className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md dark:border-brand-800 dark:bg-brand-900/40 dark:hover:border-brand-600"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-sm font-bold text-gray-900 group-hover:text-brand-700 dark:text-white">
                      {c.code}
                    </h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${RISK_LABELS[c.risk].color}`}>
                      {RISK_LABELS[c.risk].label}
                    </span>
                    <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] text-brand-800 dark:bg-brand-800 dark:text-brand-100">
                      {c.stage}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {c.gender} · {c.age ? `${c.age}岁` : '年龄未知'} · {c.diagnosis ?? '未填诊断'}
                  </p>
                </div>
              </div>

              {c.goal && (
                <p className="mt-3 text-xs text-gray-500">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">目标：</span>
                  {c.goal}
                </p>
              )}

              {c.concerns.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.concerns.map((concern) => (
                    <span
                      key={concern}
                      className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] text-gray-700 dark:bg-brand-800 dark:text-brand-100"
                    >
                      #{concern}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <span>起案：{c.startDate}</span>
                <span>
                  📝 {c.notes.length} 条记录 · 📊 {c.assessments.length} 次评估
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <section className="mt-10 rounded-xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-700 dark:bg-amber-900/20">
        <h2 className="font-serif text-base font-bold text-amber-900 dark:text-amber-200">🔒 数据隐私</h2>
        <ul className="mt-2 space-y-1 text-xs text-amber-900 dark:text-amber-100">
          <li>• 所有个案数据仅存在您的浏览器 localStorage，不会上传任何服务器。</li>
          <li>• 建议使用编号（如 P-2024-001）代替真实姓名，保护服务对象隐私。</li>
          <li>• 定期通过"导出 JSON"备份到本地，避免清除浏览器数据后丢失。</li>
          <li>• 多设备同步需自行在不同设备间复制备份文件。</li>
        </ul>
      </section>
    </div>
  );
}