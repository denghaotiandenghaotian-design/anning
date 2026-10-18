import { useEffect, useState } from 'react';
import type { TocEntry } from '@/lib/toc';

type Props = { entries: TocEntry[] };

export function TableOfContents({ entries }: Props) {
  const [active, setActive] = useState('');

  useEffect(() => {
    if (entries.length === 0) return;
    const ids = entries.map((e) => e.id);
    const observer = new IntersectionObserver(
      (obs) => {
        const visible = obs.filter((o) => o.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <nav className="hidden xl:block">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">本页目录</p>
      <ul className="space-y-2 border-l border-gray-200 text-sm dark:border-brand-800">
        {entries.map((e) => (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              className={`block border-l-2 py-0.5 pl-3 transition-colors ${
                e.level === 3 ? 'ml-3 text-xs' : ''
              } ${
                active === e.id
                  ? 'border-brand-500 text-brand-700 dark:text-brand-300'
                  : 'border-transparent text-gray-500 hover:text-brand-600 dark:text-gray-400'
              }`}
            >
              {e.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
