import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { getSearchIndex } from '@/lib/content';

type Props = { open: boolean; onClose: () => void };

export function SearchCommand({ open, onClose }: Props) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const fuse = useMemo(
    () =>
      new Fuse(getSearchIndex(), {
        keys: ['title', 'chapter', 'description', 'body'],
        threshold: 0.38,
        includeMatches: true,
      }),
    []
  );

  const results = q.trim() ? fuse.search(q.trim()).slice(0, 12) : [];

  useEffect(() => {
    if (!open) {
      setQ('');
      setActive(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, Math.max(0, results.length - 1)));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      }
      if (e.key === 'Enter' && results[active]) {
        navigate(`/docs/${results[active].item.slug}`);
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, active, navigate, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 p-4 pt-[12vh]" onClick={onClose}>
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-brand-800 dark:bg-brand-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-gray-100 px-4 dark:border-brand-800">
          <span className="text-gray-400">⌕</span>
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            placeholder="搜索章节、关键词、评估工具…"
            className="flex-1 bg-transparent py-4 text-sm outline-none dark:text-white"
          />
          <kbd className="rounded border border-gray-200 px-1.5 py-0.5 text-[10px] text-gray-400 dark:border-brand-700">ESC</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto py-2">
          {!q.trim() && (
            <li className="px-4 py-6 text-center text-sm text-gray-400">输入关键词开始搜索，支持 SAS、尊严疗法、四道人生等</li>
          )}
          {q.trim() && results.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-gray-400">未找到相关内容</li>
          )}
          {results.map(({ item }, i) => (
            <li key={item.slug}>
              <button
                type="button"
                className={`flex w-full flex-col gap-0.5 px-4 py-3 text-left text-sm ${
                  i === active ? 'bg-brand-50 dark:bg-brand-800/50' : 'hover:bg-gray-50 dark:hover:bg-brand-800/30'
                }`}
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  navigate(`/docs/${item.slug}`);
                  onClose();
                }}
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.chapter} · {item.title}
                </span>
                {item.description && <span className="text-xs text-gray-500">{item.description}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
