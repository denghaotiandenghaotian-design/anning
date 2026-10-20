import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getAssessment,
  LEVEL_BAR_COLORS,
  LEVEL_COLORS,
  type Assessment,
  type ChoiceOption,
} from '@/lib/assessments';
import { addAssessment, listCases } from '@/lib/cases';
import { ShareDialog } from '@/components/ShareDialog';
import { useSession } from '@/lib/auth';

export function ToolRunner() {
  const { assessmentId = '' } = useParams();
  const navigate = useNavigate();
  const assessment = getAssessment(assessmentId);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [stage, setStage] = useState<'form' | 'result'>('form');
  const [savedToCase, setSavedToCase] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const session = useSession();

  useEffect(() => {
    setAnswers({});
    setStage('form');
    setSavedToCase(null);
  }, [assessmentId]);

  const totalItems = assessment?.items.length ?? 0;
  const answeredCount = assessment
    ? assessment.mode === 'exclusive'
      ? answers[1] !== undefined ? 1 : 0
      : Object.keys(answers).filter((k) => answers[Number(k)] !== undefined).length
    : 0;

  const complete =
    assessment &&
    (assessment.mode === 'exclusive'
      ? answers[1] !== undefined
      : answeredCount >= totalItems);

  const result = useMemo(() => {
    if (!assessment || !complete) return null;
    return assessment.scoring(answers);
  }, [assessment, answers, complete]);

  if (!assessment) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-gray-500">未找到对应量表。</p>
        <Link to="/tools" className="mt-4 inline-block text-brand-600 underline">返回工具箱</Link>
      </div>
    );
  }

  const cases = listCases();
  const pct = totalItems ? (answeredCount / totalItems) * 100 : 0;

  const onReset = () => {
    if (confirm('清空当前作答？')) {
      setAnswers({});
      setStage('form');
      setSavedToCase(null);
    }
  };

  const onSaveToCase = (caseId: string) => {
    if (!result) return;
    addAssessment(caseId, {
      assessmentId: assessment.id,
      assessmentName: `${assessment.name} ${assessment.fullName}`,
      date: new Date().toISOString().slice(0, 10),
      total: result.total,
      level: result.level.label,
      interpretation: result.interpretation,
    });
    setSavedToCase(caseId);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/tools" className="hover:text-brand-600">工具箱</Link>
        <span className="mx-2">/</span>
        <span>{assessment.name}</span>
      </nav>

      <header className="mb-6 border-b border-gray-200 pb-6 dark:border-brand-800">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
            {assessment.category}
          </p>
          {assessment.assessorRated && (
            <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
              由评定者评定
            </span>
          )}
        </div>
        <h1 className="mt-1 font-serif text-3xl font-bold text-gray-900 dark:text-white">{assessment.name}</h1>
        <p className="mt-1 text-sm text-gray-500">{assessment.fullName}</p>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{assessment.purpose}</p>
        <p className="mt-2 text-xs text-gray-400">
          ⏱ {assessment.duration} · {assessment.mode === 'exclusive' ? `${assessment.levels?.length ?? 0} 个等级单选` : `${totalItems} 个条目`}
        </p>
      </header>

      {assessment.admin && assessment.admin.length > 0 && stage === 'form' && (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-700 dark:bg-amber-900/20">
          <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">施测说明</p>
          <ul className="mt-1 list-decimal space-y-0.5 pl-5 text-xs text-amber-900 dark:text-amber-100">
            {assessment.admin.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>
      )}

      {stage === 'form' && (
        <>
          {assessment.mode !== 'exclusive' && (
            <div className="mb-4 flex items-center justify-between rounded-lg bg-brand-50 px-4 py-3 text-xs dark:bg-brand-900/40">
              <span>已完成 {answeredCount} / {totalItems} 题</span>
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-brand-200 dark:bg-brand-800">
                <div className="h-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}

          {assessment.mode === 'choice' && (
            <ChoiceForm
              assessment={assessment}
              answers={answers}
              onChange={(id, v) => setAnswers((p) => ({ ...p, [id]: v }))}
            />
          )}

          {assessment.mode === 'exclusive' && (
            <ExclusiveForm
              assessment={assessment}
              answers={answers}
              onChange={(id, v) => setAnswers({ [id]: v })}
            />
          )}

          {assessment.mode === 'numeric' && (
            <NumericForm
              assessment={assessment}
              answers={answers}
              onChange={(id, v) => setAnswers((p) => ({ ...p, [id]: v }))}
            />
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-6 dark:border-brand-800">
            <button
              type="button"
              onClick={onReset}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:hover:bg-brand-900"
            >
              重置作答
            </button>
            <button
              type="button"
              disabled={!complete}
              onClick={() => setStage('result')}
              className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-brand-700 disabled:opacity-50"
            >
              {complete ? '查看结果' : assessment.mode === 'exclusive' ? '请先选择等级' : `还需作答 ${totalItems - answeredCount} 题`}
            </button>
          </div>
        </>
      )}

      {stage === 'result' && result && (
        <div className="space-y-6">
          <div className={`rounded-xl border p-6 ${LEVEL_COLORS[result.level.color]}`}>
            <p className="text-sm font-medium">评估等级</p>
            <h2 className="mt-2 font-serif text-3xl font-bold">{result.level.label}</h2>
            <p className="mt-2 text-sm">{result.interpretation}</p>
          </div>

          {result.dimensions && result.dimensions.length > 0 && (
            <section>
              <h3 className="mb-3 font-serif text-base font-bold">分维度得分</h3>
              <div className="space-y-3">
                {result.dimensions.map((d) => (
                  <div key={d.name} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-brand-800 dark:bg-brand-900/30">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{d.name}</span>
                      <span className="font-mono text-base">{d.value}/{d.max}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-brand-800">
                      <div
                        className={`h-full transition-all ${LEVEL_BAR_COLORS[(d.level ?? result.level).color]}`}
                        style={{ width: `${Math.min(100, (d.value / d.max) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {assessment.mode === 'exclusive' && (
            <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-brand-800 dark:bg-brand-900/30">
              <h3 className="font-serif text-base font-bold">评定明细</h3>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{result.interpretation}</p>
            </section>
          )}

          <section className="rounded-xl border border-brand-200 bg-brand-50/50 p-5 dark:border-brand-700 dark:bg-brand-900/30">
            <h3 className="font-serif text-base font-bold">建议介入</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {result.recommendations.map((r, i) => (
                <li key={i} className="flex gap-2"><span className="text-brand-600 dark:text-brand-300">▸</span><span>{r}</span></li>
              ))}
            </ul>
          </section>

          {assessment.printNote && (
            <section className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-brand-800 dark:bg-brand-950">
              <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-300">📋 量表出处与计分说明</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-gray-600 dark:text-gray-400">{assessment.printNote}</p>
            </section>
          )}

          <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-700 dark:bg-amber-900/20">
            <h3 className="font-serif text-base font-bold text-amber-900 dark:text-amber-200">⚠️ 重要提示</h3>
            <ul className="mt-2 space-y-1 text-xs text-amber-900 dark:text-amber-100">
              <li>• 量表结果为初步筛查工具，<strong>不能替代专业诊断</strong>。</li>
              {assessment.assessorRated && <li>• 本量表需由经过培训的评定者评定，结果方具参考价值。</li>}
              <li>• 所有数据保存在您的浏览器本地，不会上传。</li>
              <li>• 施测前须取得服务对象知情同意。</li>
            </ul>
          </section>

          <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-6 dark:border-brand-800 print:hidden">
            <button type="button" onClick={() => setStage('form')} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:hover:bg-brand-900">← 返回修改</button>
            <button type="button" onClick={() => window.print()} className="rounded-lg border border-brand-300 bg-white px-4 py-2 text-sm text-brand-700 hover:bg-brand-50 dark:border-brand-700 dark:bg-brand-900">🖨 打印报告</button>
            <button type="button" onClick={onReset} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:hover:bg-brand-900">重新开始</button>
            <button type="button" onClick={() => setShareOpen(true)} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">📤 分享结果</button>
            {cases.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500">保存到个案：</span>
                <select
                  onChange={(e) => { if (e.target.value) onSaveToCase(e.target.value); }}
                  className="rounded-lg border border-gray-300 bg-transparent px-2 py-1.5 text-xs dark:border-brand-700"
                  defaultValue={savedToCase ?? ''}
                >
                  <option value="">— 选择个案 —</option>
                  {cases.map((c) => <option key={c.id} value={c.id}>{c.code} · {c.diagnosis || '未填诊断'}</option>)}
                </select>
                {savedToCase && (
                  <button type="button" onClick={() => navigate(`/cases/${savedToCase}`)} className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs text-white hover:bg-brand-700">查看个案 →</button>
                )}
              </div>
            ) : (
              <Link to="/cases/new" className="rounded-lg border border-brand-300 bg-white px-4 py-2 text-sm text-brand-700 hover:bg-brand-50 dark:border-brand-700 dark:bg-brand-900">📂 先建立个案档案</Link>
            )}
          </div>

          <ShareDialog
            open={shareOpen}
            onClose={() => setShareOpen(false)}
            meta={{
              type: 'assessment', title: `${assessment.name} 评估结果`,
              subtitle: assessment.fullName, createdAt: Date.now(), author: session?.name,
              expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
            }}
            data={{ assessmentId: assessment.id, total: result.total, level: result.level.label, interpretation: result.interpretation, date: new Date().toISOString().slice(0, 10) }}
            preview={<div><p className="font-medium">{assessment.name} · {result.level.label}</p><p className="mt-1 text-xs">总分：<span className="font-mono">{result.total}</span>{assessment.unit ? ` ${assessment.unit}` : ''}</p></div>}
          />
        </div>
      )}
    </div>
  );
}

/* ---------------- choice 题型 ---------------- */

function ChoiceForm({
  assessment, answers, onChange,
}: {
  assessment: Assessment;
  answers: Record<number, number>;
  onChange: (id: number, v: number) => void;
}) {
  return (
    <div className="space-y-4">
      {assessment.items.map((item, i) => {
        const opts = item.options ?? assessment.options ?? [];
        return (
          <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-brand-800 dark:bg-brand-900/30">
            <div className="flex flex-wrap items-baseline gap-2">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                <span className="mr-2 inline-block w-7 text-right text-xs text-gray-400">{i + 1}.</span>
                {item.text}
              </p>
              {item.tag && <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[10px] text-brand-700 dark:bg-brand-800 dark:text-brand-200">{item.tag}</span>}
            </div>
            <div className={`mt-3 grid gap-2 ${opts.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : opts.length <= 5 ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-4'}`}>
              {opts.map((o: ChoiceOption) => {
                const selected = answers[item.id] === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => onChange(item.id, o.value)}
                    className={`rounded-md border px-2 py-2 text-xs transition ${
                      selected
                        ? 'border-brand-500 bg-brand-100 text-brand-900 dark:bg-brand-700 dark:text-white'
                        : 'border-gray-200 hover:border-brand-300 dark:border-brand-700 dark:hover:border-brand-600'
                    }`}
                  >
                    <span className="font-semibold">{o.value}</span>
                    <span className="ml-1">{o.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- exclusive 题型（KPS / PPS） ---------------- */

function ExclusiveForm({
  assessment, answers, onChange,
}: {
  assessment: Assessment;
  answers: Record<number, number>;
  onChange: (id: number, v: number) => void;
}) {
  const selected = answers[1];
  const hasMatrix = Boolean(assessment.matrixColumns?.length);

  if (!hasMatrix) {
    return (
      <div className="space-y-2">
        {assessment.levels?.map((l) => (
          <button
            key={l.score}
            type="button"
            onClick={() => onChange(1, l.score)}
            className={`flex w-full items-center gap-4 rounded-lg border p-3 text-left transition ${
              selected === l.score
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/50'
                : 'border-gray-200 bg-white hover:border-brand-300 dark:border-brand-800 dark:bg-brand-900/30'
            }`}
          >
            <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold ${
              selected === l.score ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600 dark:bg-brand-800 dark:text-gray-300'
            }`}>{l.score}</span>
            <span className="text-sm text-gray-800 dark:text-gray-200">{l.label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-brand-800">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="bg-brand-600 text-white">
            <th className="sticky left-0 z-10 bg-brand-600 px-3 py-2 text-left text-xs font-semibold">PPS</th>
            {assessment.matrixColumns?.map((c) => (
              <th key={c} className="px-3 py-2 text-left text-xs font-semibold">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assessment.levels?.map((l, ri) => (
            <tr
              key={l.score}
              onClick={() => onChange(1, l.score)}
              className={`cursor-pointer border-b border-gray-200 transition dark:border-brand-800 ${
                selected === l.score
                  ? 'bg-brand-100 dark:bg-brand-800/60'
                  : ri % 2 ? 'bg-warm-50 hover:bg-brand-50 dark:bg-brand-950/50 dark:hover:bg-brand-900/40'
                          : 'bg-white hover:bg-brand-50 dark:bg-brand-900/30 dark:hover:bg-brand-900/40'
              }`}
            >
              <td className={`sticky left-0 z-10 px-3 py-2 font-mono text-xs font-bold ${selected === l.score ? 'bg-brand-100 text-brand-800 dark:bg-brand-800/60 dark:text-white' : 'bg-inherit'}`}>
                {selected === l.score && <span className="mr-1">✓</span>}{l.label}
              </td>
              {l.cells?.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-xs text-gray-700 dark:text-gray-300">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-gray-200 bg-gray-50 px-3 py-2 text-[11px] text-gray-500 dark:border-brand-800 dark:bg-brand-950">
        💡 请自左向右依次对照各功能维度，选择<b>最佳横向匹配行</b>。点击任意行即可选中。
      </p>
    </div>
  );
}

/* ---------------- numeric 题型（ESAS / NRS / VAS） ---------------- */

function NumericForm({
  assessment, answers, onChange,
}: {
  assessment: Assessment;
  answers: Record<number, number>;
  onChange: (id: number, v: number) => void;
}) {
  const isVas = assessment.id === 'vas';
  const single = assessment.items.length === 1;

  return (
    <div className="space-y-5">
      {single ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-brand-800 dark:bg-brand-900/30">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{assessment.items[0].text}</p>
          {isVas ? (
            <VasSlider value={answers[1] ?? 0} onChange={(v) => onChange(1, v)} />
          ) : (
            <div className="mt-5 grid grid-cols-6 gap-2 sm:grid-cols-11">
              {Array.from({ length: 11 }, (_, i) => i).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => onChange(1, v)}
                  className={`rounded-md border py-2.5 text-sm font-semibold transition ${
                    answers[1] === v
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : 'border-gray-200 hover:border-brand-400 hover:bg-brand-50 dark:border-brand-700 dark:hover:bg-brand-900'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          )}
          <p className="mt-4 text-center text-3xl font-mono font-bold text-brand-700 dark:text-brand-300">
            {answers[1] ?? 0}
            <span className="ml-1 text-base text-gray-400">{assessment.unit}</span>
          </p>
        </div>
      ) : (
        assessment.items.map((item) => (
          <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-brand-800 dark:bg-brand-900/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.text}</p>
              <span className={`font-mono text-lg font-bold ${
                (answers[item.id] ?? 0) >= 7 ? 'text-red-600 dark:text-red-400'
                : (answers[item.id] ?? 0) >= 4 ? 'text-amber-600 dark:text-amber-400'
                : 'text-brand-600 dark:text-brand-300'
              }`}>
                {answers[item.id] ?? 0}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={item.max ?? 10}
              value={answers[item.id] ?? 0}
              onChange={(e) => onChange(item.id, Number(e.target.value))}
              className="mt-3 w-full accent-brand-600"
            />
            <div className="mt-1 flex justify-between text-[10px] text-gray-400">
              <span>0 = 无</span><span>{(item.max ?? 10) / 2} = 中度</span><span>{item.max} = 最严重</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/** VAS 100 毫米标尺线（兼容鼠标 + 触屏：Pointer Events 统一处理） */
function VasSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const setFromClientX = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    onChange(Math.round(ratio * 100));
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => setFromClientX(e.clientX);
    const onUp = () => setDragging(false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [dragging]);

  return (
    <div className="mt-6">
      <div
        ref={ref}
        onPointerDown={(e) => { e.preventDefault(); setDragging(true); setFromClientX(e.clientX); }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') onChange(Math.max(0, value - 1));
          else if (e.key === 'ArrowRight') onChange(Math.min(100, value + 1));
          else if (e.key === 'Home') onChange(0);
          else if (e.key === 'End') onChange(100);
        }}
        tabIndex={0}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        className="relative h-3 cursor-pointer touch-none rounded-full bg-gradient-to-r from-green-200 via-amber-200 to-red-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <div
          className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand-600 shadow"
          style={{ left: `${value}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-gray-500">
        <span>0（无痛）</span><span>50</span><span>100（最剧烈的疼痛）</span>
      </div>
      <p className="mt-2 text-center text-[11px] text-gray-400">
        点击 / 拖动 / 触屏滑动标尺线，或键盘 ← / → 调整（Home=0，End=100） · 当前 {value} 毫米
      </p>
    </div>
  );
}