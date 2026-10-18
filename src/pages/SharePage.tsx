import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { readSnapshotFromUrl, type Snapshot } from '@/lib/share';
import { getAssessment } from '@/lib/assessments';
import { RISK_LABELS, type CaseFile } from '@/lib/cases';

export function SharePage() {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [parseError, setParseError] = useState(false);

  useEffect(() => {
    const s = readSnapshotFromUrl();
    if (!s) {
      setParseError(true);
      return;
    }
    setSnap(s);
  }, []);

  if (parseError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-5xl">🔗</p>
        <h1 className="mt-4 font-serif text-2xl font-bold text-gray-900 dark:text-white">链接无效</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          共享链接格式不正确或已过期。请向分享者重新索取链接。
        </p>
        <Link to="/" className="mt-6 inline-block rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white">
          返回首页
        </Link>
      </div>
    );
  }

  if (!snap) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-sm text-gray-500">正在解析…</div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <header className="mb-6 rounded-xl border border-brand-200 bg-brand-50/50 p-4 dark:border-brand-700 dark:bg-brand-900/30">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          🔗 只读快照 · 共享视图
        </p>
        <h1 className="mt-1 font-serif text-2xl font-bold text-gray-900 dark:text-white">
          {snap.title}
        </h1>
        {snap.subtitle && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{snap.subtitle}</p>
        )}
        <p className="mt-3 text-xs text-gray-400">
          由 <strong>{snap.author ?? '匿名用户'}</strong> 分享 ·
          {' '}{new Date(snap.createdAt).toLocaleString('zh-CN')}
          {snap.expiresAt && snap.expiresAt > 0 && (
            <span> · 过期时间 {new Date(snap.expiresAt).toLocaleString('zh-CN')}</span>
          )}
        </p>
      </header>

      <div className="space-y-4">
        {snap.type === 'case' && <CaseView data={snap.data as CaseFile} />}
        {snap.type === 'assessment' && <AssessmentView data={snap.data as { assessmentId: string; total: number; level: string; interpretation: string; date: string }} />}
        {snap.type === 'worksheet' && <WorksheetView data={snap.data as Record<string, unknown>} />}
      </div>

      <section className="mt-10 rounded-xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-700 dark:bg-amber-900/20">
        <h3 className="font-serif text-sm font-bold text-amber-900 dark:text-amber-200">⚠️ 隐私提示</h3>
        <p className="mt-1 text-xs text-amber-900 dark:text-amber-100">
          这是一个<strong>只读</strong>快照，不会写入您的浏览器或服务器。
          请勿把含真实患者信息的快照分享给无关第三方。如需停止分享，请联系原始分享者。
        </p>
      </section>

      <div className="mt-6 flex gap-3">
        <Link to="/" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">
          体验完整功能 →
        </Link>
        <Link to="/login" className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:hover:bg-brand-900">
          创建账号
        </Link>
      </div>
    </div>
  );
}

/* ---------------- 三种快照视图 ---------------- */

function CaseView({ data }: { data: CaseFile }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 dark:border-brand-800 dark:bg-brand-900/40">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-mono font-serif text-xl font-bold text-gray-900 dark:text-white">{data.code}</h2>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${RISK_LABELS[data.risk].color}`}>
          {RISK_LABELS[data.risk].label}
        </span>
        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] text-brand-800 dark:bg-brand-800 dark:text-brand-100">
          {data.stage}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {data.gender || '—'} · {data.age ? `${data.age}岁` : '年龄未填'} · {data.diagnosis ?? '未填诊断'}
      </p>
      {data.goal && (
        <p className="mt-3 text-sm">
          <span className="font-semibold text-gray-700 dark:text-gray-300">服务目标：</span>
          <span className="text-gray-700 dark:text-gray-300">{data.goal}</span>
        </p>
      )}
      {data.concerns.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {data.concerns.map((c) => (
            <span key={c} className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] text-gray-700 dark:bg-brand-800 dark:text-gray-300">
              #{c}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-serif text-sm font-bold">服务记录 ({data.notes.length})</h3>
        {data.notes.length === 0 ? (
          <p className="mt-2 text-xs text-gray-400">暂无记录</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {data.notes.map((n) => (
              <li key={n.id} className="rounded-lg border border-gray-100 p-3 dark:border-brand-700">
                <p className="text-xs text-gray-400">
                  <span className="font-mono">{n.date}</span>
                  <span className="ml-2 rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] text-brand-700 dark:bg-brand-800 dark:text-brand-100">
                    {n.stage}
                  </span>
                </p>
                <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">{n.content}</p>
                {n.intervention && (
                  <p className="mt-1 text-xs"><span className="font-semibold text-gray-500">方法：</span>{n.intervention}</p>
                )}
                {n.next && (
                  <p className="mt-0.5 text-xs"><span className="font-semibold text-gray-500">下一步：</span>{n.next}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <h3 className="font-serif text-sm font-bold">评估记录 ({data.assessments.length})</h3>
        {data.assessments.length === 0 ? (
          <p className="mt-2 text-xs text-gray-400">暂无评估</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {data.assessments.map((a) => (
              <li key={a.id} className="rounded-lg bg-gray-50 p-3 text-xs dark:bg-brand-950">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{a.assessmentName.split(' ')[0]}</span>
                  <span className="font-mono">{a.total}</span>
                </div>
                <p className="mt-1 text-[10px] text-gray-500">{a.level} · {a.date}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

function AssessmentView({ data }: { data: { assessmentId: string; total: number; level: string; interpretation: string; date: string } }) {
  const a = getAssessment(data.assessmentId);
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 dark:border-brand-800 dark:bg-brand-900/40">
      <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
        {a?.name ?? data.assessmentId} · 评估结果
      </h2>
      <p className="mt-1 text-xs text-gray-500">{a?.fullName}</p>
      <p className="mt-3 text-sm text-gray-400">{data.date}</p>
      <div className="mt-4 rounded-xl bg-brand-50/60 p-4 dark:bg-brand-900/40">
        <p className="text-sm">等级：<strong>{data.level}</strong></p>
        <p className="mt-2 text-sm">总分：<strong className="font-mono text-xl">{data.total}</strong></p>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{data.interpretation}</p>
      </div>
    </article>
  );
}

function WorksheetView({ data }: { data: Record<string, unknown> }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 dark:border-brand-800 dark:bg-brand-900/40">
      <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">工作表内容</h2>
      <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-xs text-gray-700 dark:bg-brand-950 dark:text-gray-300">
        {JSON.stringify(data, null, 2)}
      </pre>
    </article>
  );
}