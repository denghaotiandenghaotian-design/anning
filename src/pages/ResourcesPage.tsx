import { useMemo, useState } from 'react';
import { RESOURCE_KIND_COLORS, RESOURCES, getResourcesByKind, type Resource, type ResourceKind } from '@/lib/resources';

const KIND_ORDER: ResourceKind[] = [
  '政策文件',
  '地方标准',
  '评估工具',
  '工作模板',
  '学术文献',
  '推广机构',
  '外部链接',
];

export function ResourcesPage() {
  const groups = useMemo(() => getResourcesByKind(), []);
  const [q, setQ] = useState('');
  const [activeKind, setActiveKind] = useState<ResourceKind | '全部'>('全部');

  const filter = (r: Resource) => {
    if (activeKind !== '全部' && r.kind !== activeKind) return false;
    if (q) {
      const haystack = `${r.title} ${r.summary} ${r.issuer ?? ''} ${r.refCode ?? ''} ${r.tags?.join(' ') ?? ''}`.toLowerCase();
      if (!haystack.includes(q.toLowerCase())) return false;
    }
    return true;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <header className="mb-6 border-b border-gray-200 pb-6 dark:border-brand-800">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          资源中心
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-gray-900 dark:text-white">
          政策 · 标准 · 工具 · 模板
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-gray-600 dark:text-gray-400">
          收录与本手册同源的官方政策文件、地方标准、学术文献、评估工具与实务工作模板，可一键检索或打印。
        </p>
      </header>

      <section className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-brand-800 dark:bg-brand-900/40">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索资源…"
          className="min-w-[220px] flex-1 rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-400 dark:border-brand-700"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveKind('全部')}
            className={`rounded-lg border px-3 py-1 text-xs ${
              activeKind === '全部'
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:hover:bg-brand-900'
            }`}
          >
            全部
          </button>
          {KIND_ORDER.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setActiveKind(k)}
              className={`rounded-lg border px-3 py-1 text-xs ${
                activeKind === k
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:hover:bg-brand-900'
              }`}
            >
              {k} ({groups[k]?.length ?? 0})
            </button>
          ))}
        </div>
      </section>

      {KIND_ORDER.map((kind) => {
        const items = (groups[kind] ?? []).filter(filter);
        if (items.length === 0) return null;
        return (
          <section key={kind} className="mb-10">
            <h2 className="mb-4 flex items-center gap-3 font-serif text-xl font-bold text-gray-900 dark:text-white">
              <span className={`rounded-full px-3 py-1 text-xs ${RESOURCE_KIND_COLORS[kind]}`}>{kind}</span>
              <span className="text-sm text-gray-400">({items.length})</span>
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {items.map((r) => (
                <ResourceCard key={r.id} r={r} />
              ))}
            </div>
          </section>
        );
      })}

      {RESOURCES.filter(filter).length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-brand-700">
          <p className="text-gray-500">未找到匹配的资源</p>
        </div>
      )}
    </div>
  );
}

function ResourceCard({ r }: { r: Resource }) {
  return (
    <article className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md dark:border-brand-800 dark:bg-brand-900/40 dark:hover:border-brand-600">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${RESOURCE_KIND_COLORS[r.kind]}`}>
              {r.kind}
            </span>
            {r.year && <span className="text-[10px] text-gray-400">{r.year}</span>}
            {r.refCode && (
              <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-600 dark:bg-brand-800 dark:text-gray-300">
                {r.refCode}
              </span>
            )}
          </div>
          <h3 className="mt-2 font-serif text-base font-bold text-gray-900 group-hover:text-brand-700 dark:text-white">
            {r.title}
          </h3>
          {r.issuer && <p className="mt-0.5 text-xs text-gray-500">{r.issuer}</p>}
        </div>
      </div>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{r.summary}</p>
      {r.tags && r.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {r.tags.map((t) => (
            <span key={t} className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600 dark:bg-brand-800 dark:text-gray-300">
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3 text-xs dark:border-brand-800">
        {r.url && (
          <a
            href={r.url}
            target="_blank"
            rel="noreferrer"
            className="text-brand-600 hover:underline dark:text-brand-300"
          >
            🔗 访问链接
          </a>
        )}
        <span className="text-gray-400">来源：本手册</span>
      </div>
    </article>
  );
}