import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getDocBySlug } from '@/lib/content';
import { getPrevNext, siteConfig } from '@/site.config';
import { MarkdownContent } from '@/components/MarkdownContent';
import { extractToc } from '@/lib/toc';

/** 打印友好视图 - 大字号排版，无侧边栏，自动触发打印对话框 */
export function PrintPage() {
  const { slug = '' } = useParams();
  const doc = getDocBySlug(slug);

  useEffect(() => {
    if (!doc) return;
    const t = setTimeout(() => window.print(), 350);
    return () => clearTimeout(t);
  }, [doc]);

  if (!doc) return <Navigate to="/" replace />;

  const toc = extractToc(doc.body);
  const { prev, next } = getPrevNext(slug);

  return (
    <div className="mx-auto max-w-3xl bg-white px-6 py-10 text-gray-900 print:px-0 print:py-0">
      <header className="border-b-2 border-brand-600 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{doc.chapter}</p>
        <h1 className="mt-2 font-serif text-3xl font-bold">{doc.title}</h1>
        {doc.description && <p className="mt-2 text-sm text-gray-600">{doc.description}</p>}
        <p className="mt-3 text-[10px] text-gray-400">
          {siteConfig.title} · v{siteConfig.version}
        </p>
      </header>

      {toc.length > 0 && (
        <nav className="my-6 rounded-lg bg-gray-50 p-4 print:bg-white print:border">
          <p className="text-xs font-semibold uppercase text-gray-500">本页目录</p>
          <ul className="mt-2 space-y-1 text-sm">
            {toc.map((e) => (
              <li key={e.id} className={e.level === 3 ? 'ml-4 text-xs' : ''}>
                <a href={`#${e.id}`} className="text-gray-700 hover:underline">
                  {e.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <MarkdownContent content={doc.body} />

      <footer className="mt-10 border-t border-gray-200 pt-6 text-xs text-gray-500">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            {prev && (
              <Link to={`/docs/${prev.slug}`} className="mr-4 text-brand-600 hover:underline">
                ← 上一章 · {prev.title}
              </Link>
            )}
            {next && (
              <Link to={`/docs/${next.slug}`} className="text-brand-600 hover:underline">
                下一章 · {next.title} →
              </Link>
            )}
          </div>
          <span>{siteConfig.title} · 仅供内部学习与服务参考</span>
        </div>
      </footer>
    </div>
  );
}