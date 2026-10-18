import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getDocBySlug } from '@/lib/content';
import { getPrevNext } from '@/site.config';
import { extractToc } from '@/lib/toc';
import { isBookmarked, toggleBookmark } from '@/lib/bookmarks';
import { MarkdownContent } from '@/components/MarkdownContent';
import { TableOfContents } from '@/components/TableOfContents';

export function DocPage() {
  const { slug = '' } = useParams();
  const doc = getDocBySlug(slug);
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(slug));

  const toc = useMemo(() => (doc ? extractToc(doc.body) : []), [doc]);
  const { prev, next } = getPrevNext(slug);

  if (!doc) return <Navigate to="/" replace />;

  const onBookmark = () => {
    const nextVal = toggleBookmark(slug);
    setBookmarked(nextVal);
    window.dispatchEvent(new Event('bookmarks-updated'));
  };

  return (
    <div className="mx-auto flex max-w-6xl gap-10 px-4 py-8 lg:px-8">
      <article className="min-w-0 flex-1">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-6 dark:border-brand-800">
          <div>
            <p className="text-sm font-medium text-brand-600 dark:text-brand-300">{doc.chapter}</p>
            <h1 className="mt-1 font-serif text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">{doc.title}</h1>
            {doc.description && <p className="mt-2 text-sm text-gray-500">{doc.description}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/print/${slug}`}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:hover:bg-brand-900"
              target="_blank"
            >
              🖨 打印
            </Link>
            <button
              type="button"
              onClick={onBookmark}
              className={`rounded-lg border px-3 py-2 text-sm ${
                bookmarked
                  ? 'border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-brand-700 dark:hover:bg-brand-900'
              }`}
            >
              {bookmarked ? '★ 已加入书签' : '☆ 加入书签'}
            </button>
          </div>
        </div>

        <MarkdownContent content={doc.body} />

        <nav className="mt-12 flex flex-col gap-4 border-t border-gray-200 pt-8 sm:flex-row sm:justify-between dark:border-brand-800">
          {prev ? (
            <Link to={`/docs/${prev.slug}`} className="group max-w-[48%] rounded-lg border border-gray-200 p-4 hover:border-brand-400 dark:border-brand-800">
              <span className="text-xs text-gray-400">上一章</span>
              <p className="font-medium text-brand-700 group-hover:underline dark:text-brand-300">{prev.title}</p>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to={`/docs/${next.slug}`}
              className="group max-w-[48%] rounded-lg border border-gray-200 p-4 text-right hover:border-brand-400 dark:border-brand-800 sm:ml-auto"
            >
              <span className="text-xs text-gray-400">下一章</span>
              <p className="font-medium text-brand-700 group-hover:underline dark:text-brand-300">{next.title}</p>
            </Link>
          ) : null}
        </nav>
      </article>

      <aside className="hidden w-56 shrink-0 lg:block xl:w-64">
        <div className="sticky top-20">
          <TableOfContents entries={toc} />
        </div>
      </aside>
    </div>
  );
}
