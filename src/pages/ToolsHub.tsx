import { Link } from 'react-router-dom';
import { ASSESSMENTS, LEVEL_COLORS } from '@/lib/assessments';

export function ToolsHub() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          实用工具
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-gray-900 dark:text-white">评估量表工具箱</h1>
        <p className="mt-3 max-w-3xl text-gray-600 dark:text-gray-400">
          本节收录安宁疗护实务推荐的 8 种标准化评估工具。所有题项、自动计算与结果解读均在浏览器本地完成，
          不上传任何数据。完成评估后可一键保存到个案档案或打印为会谈用报告。
        </p>
      </header>

      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPI icon="📋" label="量表总数" value={ASSESSMENTS.length.toString()} />
        <KPI icon="🔒" label="数据存储" value="本地" />
        <KPI icon="⚡" label="自动计分" value="实时" />
        <KPI icon="🖨" label="可打印" value="支持" />
      </section>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ASSESSMENTS.map((a) => (
          <Link
            key={a.id}
            to={`/tools/${a.id}`}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-brand-300 hover:shadow-md dark:border-brand-800 dark:bg-brand-900/40 dark:hover:border-brand-600"
          >
            <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${LEVEL_COLORS.gray}`}>
              {a.category}
            </span>
            <h3 className="mt-3 font-serif text-xl font-bold text-gray-900 group-hover:text-brand-700 dark:text-white">
              {a.name}
            </h3>
            <p className="mt-1 text-xs text-gray-500">{a.fullName}</p>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{a.purpose}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
              <span>📝 {a.items.length} 题</span>
              <span>⏱ {a.duration}</span>
            </div>
            <div className="mt-4 text-xs font-medium text-brand-600 group-hover:underline dark:text-brand-300">
              开始测评 →
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-12 rounded-xl border border-amber-200 bg-amber-50/60 p-6 dark:border-amber-700 dark:bg-amber-900/20">
        <h2 className="font-serif text-lg font-bold text-amber-900 dark:text-amber-200">
          ⚠️ 使用注意
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-amber-900 dark:text-amber-100">
          <li>• 量表结果为初步筛查工具，<strong>不能替代专业诊断</strong>。中重度得分建议转介心理/精神科评估。</li>
          <li>• PHQ-9 题项 9（自杀意念）若得分 ≥1，必须立即进一步评估安全风险。</li>
          <li>• SDS 题项 19（"认为死了别人会生活得更好"）若得分 ≥3，务必评估自杀风险。</li>
          <li>• ICG ≥25 分提示延长哀伤高风险，需评估是否符合 ICD-11 PGD 标准。</li>
          <li>• 评估需征得服务对象知情同意，结果仅用于专业服务参考。</li>
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