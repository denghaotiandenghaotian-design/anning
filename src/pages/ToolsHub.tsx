import { Link } from 'react-router-dom';
import { ASSESSMENTS, CATEGORIES, CATEGORY_COLORS, type Assessment } from '@/lib/assessments';

const MODE_LABEL: Record<Assessment['mode'], string> = {
  choice: '逐题打分',
  exclusive: '等级评定',
  numeric: '数字评分',
};

export function ToolsHub() {
  const byCat = CATEGORIES.map((c) => ({ cat: c, list: ASSESSMENTS.filter((a) => a.category === c) })).filter((g) => g.list.length > 0);
  const assessorRated = ASSESSMENTS.filter((a) => a.assessorRated);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          实用工具
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-gray-900 dark:text-white">
          评估量表工具箱 · {ASSESSMENTS.length} 种
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          收录安宁疗护实务推荐的 <b>{ASSESSMENTS.length} 种</b>标准化评估工具，覆盖情绪、哀伤、社会支持、尊严、功能状态、症状负担、照护负担与生命意义感八大维度。
          所有题项、自动计分与结果解读均在浏览器本地完成，<b>不上传任何数据</b>。完成评估后可一键保存到个案档案、打印为会谈用报告，或分享为只读快照。
        </p>
      </header>

      <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KPI icon="📋" label="量表总数" value={ASSESSMENTS.length.toString()} />
        <KPI icon="🔒" label="数据存储" value="本地" />
        <KPI icon="⚡" label="自动计分" value="实时" />
        <KPI icon="🖨" label="可打印" value="支持" />
      </section>

      {byCat.map((group) => (
        <section key={group.cat} className="mb-9">
          <h2 className="mb-3 flex items-center gap-3 font-serif text-lg font-bold text-gray-900 dark:text-white">
            <span className={`rounded-full px-3 py-1 text-xs ${CATEGORY_COLORS[group.cat]}`}>{group.cat}</span>
            <span className="text-sm font-normal text-gray-400">{group.list.length} 种</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.list.map((a) => (
              <Link
                key={a.id}
                to={`/tools/${a.id}`}
                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md dark:border-brand-800 dark:bg-brand-900/40 dark:hover:border-brand-600"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif text-xl font-bold text-gray-900 group-hover:text-brand-700 dark:text-white">{a.name}</h3>
                  {a.assessorRated && (
                    <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-medium text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
                      评定者
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{a.fullName}</p>
                <p className="mt-2.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{a.purpose}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-gray-400">
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 dark:bg-brand-800 dark:text-gray-300">
                    {MODE_LABEL[a.mode]}
                  </span>
                  <span>⏱ {a.duration}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {assessorRated.length > 0 && (
        <section className="mb-8 rounded-xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-700 dark:bg-amber-900/20">
          <h2 className="font-serif text-base font-bold text-amber-900 dark:text-amber-200">🩺 需由评定者施测的量表</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-amber-900 dark:text-amber-100">
            <b>{assessorRated.map((a) => a.name).join('、')}</b> 需由经过培训的评定者依据患者实际情况评定，
            不可由患者自评或代答。结果方具参考价值。
          </p>
        </section>
      )}

      <section className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-700 dark:bg-amber-900/20">
        <h2 className="font-serif text-base font-bold text-amber-900 dark:text-amber-200">⚠️ 使用注意</h2>
        <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-amber-900 dark:text-amber-100">
          <li>• 量表结果为初步筛查工具，<b>不能替代专业诊断</b>。中重度得分建议转介心理/精神科评估。</li>
          <li>• <b>PHQ-9 题项 9（自杀意念）</b>与 <b>SDS 题项 19</b> 若得分 ≥1 / ≥3，必须立即评估安全风险。</li>
          <li>• <b>AGS 无统一临界值</b>，须结合样本常模与临床判断；<b>KPS ≤70、PPS ≤50%</b> 为多地服务准入参照。</li>
          <li>• ESAS 建议作为基线，按固定周期重复施测以追踪症状负担变化。</li>
          <li>• 评估需征得服务对象知情同意；数据仅用于专业服务参考。</li>
        </ul>
      </section>
    </div>
  );
}

function KPI({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-brand-800 dark:bg-brand-900/40">
      <div className="text-2xl">{icon}</div>
      <p className="mt-2 text-xs text-gray-500">{label}</p>
      <p className="mt-1 font-serif text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}