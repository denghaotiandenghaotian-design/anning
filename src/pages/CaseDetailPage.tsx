import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  addNote,
  deleteCase,
  getCase,
  RISK_LABELS,
  STAGES,
  updateCase,
  type CaseFile,
  type CaseNote,
  type CaseStage,
} from '@/lib/cases';
import { ASSESSMENTS } from '@/lib/assessments';
import { ShareDialog } from '@/components/ShareDialog';
import { useSession } from '@/lib/auth';

export function CaseDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [c, setC] = useState<CaseFile | undefined>(() => getCase(id));
  const [noteDraft, setNoteDraft] = useState({
    date: new Date().toISOString().slice(0, 10),
    stage: '介入' as CaseStage,
    content: '',
    intervention: '',
    next: '',
  });
  const [shareOpen, setShareOpen] = useState(false);
  const session = useSession();

  useEffect(() => {
    setC(getCase(id));
  }, [id]);

  if (!c) return <Navigate to="/cases" replace />;

  const onStageChange = (stage: CaseStage) => {
    const next = updateCase(id, { stage });
    if (next) setC(next);
  };

  const onAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteDraft.content.trim()) return;
    const next = addNote(id, noteDraft);
    if (next) {
      setC(next);
      setNoteDraft({ ...noteDraft, content: '', intervention: '', next: '' });
    }
  };

  const onDelete = () => {
    if (!confirm(`确定删除个案 ${c.code}？此操作不可恢复。`)) return;
    deleteCase(id);
    navigate('/cases');
  };

  const onExport = () => {
    const blob = new Blob([JSON.stringify(c, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${c.code}-${c.startDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/cases" className="hover:text-brand-600">个案管理</Link>
        <span className="mx-2">/</span>
        <span>{c.code}</span>
      </nav>

      <header className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-6 dark:border-brand-800">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-mono font-serif text-2xl font-bold text-gray-900 dark:text-white">{c.code}</h1>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${RISK_LABELS[c.risk].color}`}>
              {RISK_LABELS[c.risk].label}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {c.gender} · {c.age ? `${c.age}岁` : '年龄未知'} · {c.diagnosis ?? '未填诊断'}
          </p>
          {c.goal && (
            <p className="mt-3 text-sm">
              <span className="font-semibold">服务目标：</span>
              <span className="text-gray-700 dark:text-gray-300">{c.goal}</span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="rounded-lg border border-brand-300 bg-brand-50 px-3 py-1.5 text-xs text-brand-700 hover:bg-brand-100 dark:border-brand-700 dark:bg-brand-900 dark:text-brand-200"
          >
            📤 分享
          </button>
          <button
            type="button"
            onClick={onExport}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:hover:bg-brand-900"
          >
            📥 导出 JSON
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:hover:bg-brand-900"
          >
            🖨 打印
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/30"
          >
            删除
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          {/* 阶段流程图 */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-brand-800 dark:bg-brand-900/40">
            <h2 className="mb-3 font-serif text-base font-bold">服务阶段</h2>
            <div className="flex flex-wrap gap-2">
              {STAGES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onStageChange(s)}
                  className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                    c.stage === s
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:hover:bg-brand-900'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* 添加记录 */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 dark:border-brand-800 dark:bg-brand-900/40">
            <h2 className="mb-3 font-serif text-base font-bold">新增服务记录</h2>
            <form onSubmit={onAddNote} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
                <input
                  type="date"
                  value={noteDraft.date}
                  onChange={(e) => setNoteDraft({ ...noteDraft, date: e.target.value })}
                  className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
                />
                <select
                  value={noteDraft.stage}
                  onChange={(e) => setNoteDraft({ ...noteDraft, stage: e.target.value as CaseStage })}
                  className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
                >
                  {STAGES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <textarea
                value={noteDraft.content}
                onChange={(e) => setNoteDraft({ ...noteDraft, content: e.target.value })}
                rows={3}
                placeholder="本次会谈内容摘要…"
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
              />
              <input
                value={noteDraft.intervention}
                onChange={(e) => setNoteDraft({ ...noteDraft, intervention: e.target.value })}
                placeholder="采用方法（如 尊严疗法、四道人生-道谢、家庭会议…）"
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
              />
              <input
                value={noteDraft.next}
                onChange={(e) => setNoteDraft({ ...noteDraft, next: e.target.value })}
                placeholder="下一步计划…"
                className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
              />
              <button
                type="submit"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                添加记录
              </button>
            </form>
          </section>

          {/* 历史记录 */}
          <section>
            <h2 className="mb-3 font-serif text-base font-bold">服务记录 ({c.notes.length})</h2>
            {c.notes.length === 0 ? (
              <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-brand-700">
                暂无服务记录
              </p>
            ) : (
              <div className="space-y-3">
                {c.notes.map((n) => (
                  <NoteCard key={n.id} note={n} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* 侧栏：基本信息 + 评估 */}
        <aside className="space-y-4">
          <section className="rounded-xl border border-gray-200 bg-white p-4 text-sm dark:border-brand-800 dark:bg-brand-900/40">
            <h3 className="font-serif text-sm font-bold">基本信息</h3>
            <dl className="mt-3 space-y-2 text-xs">
              <Row k="编号" v={c.code} />
              <Row k="性别" v={c.gender ?? '—'} />
              <Row k="年龄" v={c.age ? `${c.age}岁` : '—'} />
              <Row k="诊断" v={c.diagnosis ?? '—'} />
              <Row k="起案日期" v={c.startDate} />
              <Row k="照顾者" v={c.caregivers ?? '—'} />
              <Row k="联系方式" v={c.contact ?? '—'} />
            </dl>
            {c.concerns.length > 0 && (
              <div className="mt-3">
                <p className="text-[10px] font-semibold uppercase text-gray-400">关键议题</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {c.concerns.map((x) => (
                    <span key={x} className="rounded-md bg-brand-100 px-2 py-0.5 text-[10px] text-brand-800 dark:bg-brand-800 dark:text-brand-100">
                      #{x}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {c.remark && (
              <p className="mt-3 text-xs italic text-gray-500">{c.remark}</p>
            )}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4 text-sm dark:border-brand-800 dark:bg-brand-900/40">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-sm font-bold">评估记录 ({c.assessments.length})</h3>
              <Link to="/tools" className="text-[10px] text-brand-600 hover:underline">+ 新增</Link>
            </div>
            {c.assessments.length === 0 ? (
              <p className="mt-3 text-xs text-gray-400">暂无评估记录。完成量表后选择"保存到个案"即可加入。</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {c.assessments.map((a) => (
                  <li key={a.id} className="rounded-lg bg-gray-50 p-2 text-xs dark:bg-brand-950">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{a.assessmentName.split(' ')[0]}</span>
                      <span className="font-mono">{a.total}</span>
                    </div>
                    <p className="mt-1 text-[10px] text-gray-500">{a.level} · {a.date}</p>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3 flex flex-wrap gap-1">
              {ASSESSMENTS.map((a) => (
                <Link
                  key={a.id}
                  to={`/tools/${a.id}`}
                  className="rounded-md border border-gray-200 px-2 py-0.5 text-[10px] text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:hover:bg-brand-900"
                >
                  {a.name}
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        meta={{
          type: 'case',
          title: `个案档案 · ${c.code}`,
          subtitle: c.diagnosis ?? '',
          createdAt: Date.now(),
          author: session?.name,
          expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 天后过期
        }}
        data={c}
        preview={
          <div>
            <p className="font-mono text-xs">{c.code} · {c.stage}</p>
            <p className="mt-1 text-xs">{c.diagnosis ?? '未填诊断'}</p>
            <p className="mt-1 text-[10px] text-gray-500">
              {c.notes.length} 条记录 · {c.assessments.length} 次评估
            </p>
          </div>
        }
      />
    </div>
  );
}

function NoteCard({ note }: { note: CaseNote }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 dark:border-brand-800 dark:bg-brand-900/40">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-gray-400">{note.date}</span>
          <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] text-brand-800 dark:bg-brand-800 dark:text-brand-100">
            {note.stage}
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">{note.content}</p>
      {note.intervention && (
        <p className="mt-2 text-xs">
          <span className="font-semibold text-gray-500">方法：</span>
          <span className="text-gray-700 dark:text-gray-300">{note.intervention}</span>
        </p>
      )}
      {note.next && (
        <p className="mt-1 text-xs">
          <span className="font-semibold text-gray-500">下一步：</span>
          <span className="text-gray-700 dark:text-gray-300">{note.next}</span>
        </p>
      )}
    </article>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-gray-400">{k}</span>
      <span className="text-right text-gray-700 dark:text-gray-300">{v}</span>
    </div>
  );
}