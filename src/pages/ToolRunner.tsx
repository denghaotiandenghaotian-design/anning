import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getAssessment,
  LEVEL_BAR_COLORS,
  LEVEL_COLORS,
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

  const result = useMemo(() => {
    if (!assessment) return null;
    if (Object.keys(answers).length < assessment.items.length) return null;
    return assessment.scoring(answers);
  }, [assessment, answers]);

  if (!assessment) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-gray-500">未找到对应量表。</p>
        <Link to="/tools" className="mt-4 inline-block text-brand-600 underline">
          返回工具箱
        </Link>
      </div>
    );
  }

  const progress = (Object.keys(answers).length / assessment.items.length) * 100;
  const cases = listCases();

  const onChoose = (id: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const onReset = () => {
    if (confirm('清空当前作答？')) {
      setAnswers({});
      setStage('form');
      setSavedToCase(null);
    }
  };

  const onPrint = () => {
    window.print();
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
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          {assessment.category}
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-gray-900 dark:text-white">{assessment.name}</h1>
        <p className="mt-1 text-sm text-gray-500">{assessment.fullName}</p>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{assessment.purpose}</p>
        <p className="mt-2 text-xs text-gray-400">⏱ 预计耗时：{assessment.duration}</p>
      </header>

      {stage === 'form' && (
        <>
          <div className="mb-4 flex items-center justify-between rounded-lg bg-brand-50 px-4 py-3 text-xs dark:bg-brand-900/40">
            <span>已完成 {Object.keys(answers).length} / {assessment.items.length} 题</span>
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-brand-200 dark:bg-brand-800">
              <div
                className="h-full bg-brand-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-6">
            {assessment.items.map((item, i) => (
              <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-brand-800 dark:bg-brand-900/30">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  <span className="mr-2 inline-block w-7 text-right text-xs text-gray-400">{i + 1}.</span>
                  {item.text}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {assessment.options.map((opt) => {
                    const selected = answers[item.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChoose(item.id, opt.value)}
                        className={`rounded-md border px-3 py-2 text-xs transition ${
                          selected
                            ? 'border-brand-500 bg-brand-100 text-brand-900 dark:bg-brand-700 dark:text-white'
                            : 'border-gray-200 hover:border-brand-300 dark:border-brand-700 dark:hover:border-brand-600'
                        }`}
                      >
                        <span className="font-medium">{opt.value}</span>
                        <span className="ml-1">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

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
              disabled={!result}
              onClick={() => setStage('result')}
              className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-brand-700 disabled:opacity-50"
            >
              {result ? '查看结果' : `还需作答 ${assessment.items.length - Object.keys(answers).length} 题`}
            </button>
          </div>
        </>
      )}

      {stage === 'result' && result && (
        <div className="space-y-6 print-result-area">
          <div className={`rounded-xl border p-6 ${LEVEL_COLORS[result.level.color]}`}>
            <p className="text-sm font-medium">评估等级</p>
            <h2 className="mt-2 font-serif text-3xl font-bold">{result.level.label}</h2>
            <p className="mt-2 text-sm">{result.interpretation}</p>
          </div>

          {result.dimensions?.map((d) => (
            <div key={d.name} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-brand-800 dark:bg-brand-900/30">
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
              <BarMarker value={d.value} max={d.max} />
            </div>
          ))}

          <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-brand-800 dark:bg-brand-900/30">
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">结果解读</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {result.interpretation}
            </p>
          </div>

          <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-5 dark:border-brand-700 dark:bg-brand-900/30">
            <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white">建议介入</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              {result.recommendations.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-brand-600 dark:text-brand-300">▸</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-700 dark:bg-amber-900/20">
            <h3 className="font-serif text-lg font-bold text-amber-900 dark:text-amber-200">⚠️ 重要提示</h3>
            <ul className="mt-3 space-y-1 text-xs text-amber-900 dark:text-amber-100">
              <li>• 量表结果为初步筛查工具，<strong>不能替代专业诊断</strong>。</li>
              <li>• 所有数据均保存在您的浏览器本地，不会上传。</li>
              <li>• 结果仅用于专业服务用途，需征得服务对象知情同意。</li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-6 dark:border-brand-800 print:hidden">
            <button
              type="button"
              onClick={() => setStage('form')}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:hover:bg-brand-900"
            >
              ← 返回修改
            </button>
            <button
              type="button"
              onClick={onPrint}
              className="rounded-lg border border-brand-300 bg-white px-4 py-2 text-sm text-brand-700 hover:bg-brand-50 dark:border-brand-700 dark:bg-brand-900 dark:hover:bg-brand-800"
            >
              🖨 打印报告
            </button>
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              📤 分享结果
            </button>
            <button
              type="button"
              onClick={onReset}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:hover:bg-brand-900"
            >
              重新开始
            </button>
            {cases.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500">保存到个案：</span>
                <select
                  onChange={(e) => {
                    if (e.target.value) onSaveToCase(e.target.value);
                  }}
                  className="rounded-lg border border-gray-300 bg-transparent px-2 py-1.5 text-xs dark:border-brand-700"
                  defaultValue={savedToCase ?? ''}
                >
                  <option value="">— 选择个案 —</option>
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} · {c.diagnosis ?? '未填诊断'}
                    </option>
                  ))}
                </select>
                {savedToCase && (
                  <button
                    type="button"
                    onClick={() => navigate(`/cases/${savedToCase}`)}
                    className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs text-white hover:bg-brand-700"
                  >
                    查看个案 →
                  </button>
                )}
              </div>
            ) : (
              <Link
                to="/cases/new"
                className="rounded-lg border border-brand-300 bg-white px-4 py-2 text-sm text-brand-700 hover:bg-brand-50 dark:border-brand-700 dark:bg-brand-900 dark:hover:bg-brand-800"
              >
                📂 先建立个案档案
              </Link>
            )}
          </div>
        </div>
      )}

      {result && (
      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        meta={{
          type: 'assessment',
          title: `${assessment.name} 评估结果`,
          subtitle: assessment.fullName,
          createdAt: Date.now(),
          author: session?.name,
          expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
        }}
        data={{
          assessmentId: assessment.id,
          total: result.total,
          level: result.level.label,
          interpretation: result.interpretation,
          date: new Date().toISOString().slice(0, 10),
        }}
        preview={
          <div>
            <p className="font-medium">{assessment.name} · {result.level.label}</p>
            <p className="mt-1 text-xs">总分：<span className="font-mono">{result.total}</span></p>
            <p className="mt-1 text-[10px] text-gray-500">{assessment.fullName}</p>
          </div>
        }
      />
      )}
    </div>
  );
}

function BarMarker({ max }: { value: number; max: number }) {
  return (
    <div className="mt-3 flex justify-between text-[10px] text-gray-400">
      <span>0</span>
      <span className="-translate-x-2">25%</span>
      <span className="-translate-x-1">50%</span>
      <span className="translate-x-1">75%</span>
      <span>{max}</span>
    </div>
  );
}