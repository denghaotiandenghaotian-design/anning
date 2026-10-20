import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { navigation, siteConfig } from '@/site.config';
import { getBookmarks } from '@/lib/bookmarks';
import { ASSESSMENTS } from '@/lib/assessments';

type Props = { mobileOpen: boolean; onNavigate: () => void };

const TOOL_NAV = [
  { to: '/tools', label: '🧰 量表工具箱', desc: `${ASSESSMENTS.length} 种标准化评估` },
  { to: '/cases', label: '📂 个案管理', desc: '本地追踪与档案' },
  { to: '/cases-studies', label: '📑 实务案例库', desc: '个案·小组·社区' },
  { to: '/worksheets', label: '📝 互动工作表', desc: '工作纸与小组模板' },
  { to: '/resources', label: '🔗 资源中心', desc: '政策、文献、模板' },
];

export function Sidebar({ mobileOpen, onNavigate }: Props) {
  const location = useLocation();
  const [bookmarks, setBookmarks] = useState(getBookmarks);

  useEffect(() => {
    setBookmarks(getBookmarks());
    const onUpdate = () => setBookmarks(getBookmarks());
    window.addEventListener('bookmarks-updated', onUpdate);
    return () => window.removeEventListener('bookmarks-updated', onUpdate);
  }, [location.pathname]);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-brand-800/20 bg-brand-900 text-gray-100 transition-transform lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="border-b border-white/10 px-5 py-6">
        <div className="mb-2 text-2xl">🕊</div>
        <h1 className="font-serif text-lg font-bold leading-snug text-white">{siteConfig.title}</h1>
        <p className="mt-1 text-xs text-brand-200/70">{siteConfig.subtitle}</p>
        <span className="mt-3 inline-block rounded-full bg-brand-700/80 px-2 py-0.5 text-[10px] text-brand-100">
          v{siteConfig.version}
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <NavLink
          to="/"
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            `mb-1 block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-white/15 text-white' : 'text-brand-100/80 hover:bg-white/10'}`
          }
        >
          🏠 首页概览
        </NavLink>

        {bookmarks.length > 0 && (
          <>
            <p className="mb-2 mt-4 px-3 text-[10px] font-semibold uppercase tracking-wider text-brand-300/60">书签</p>
            {bookmarks.map((slug) => {
              const item = navigation.find((n) => n.slug === slug);
              if (!item) return null;
              return (
                <NavLink
                  key={slug}
                  to={`/docs/${slug}`}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `mb-1 block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`
                  }
                >
                  ★ {item.title}
                </NavLink>
              );
            })}
          </>
        )}

        <p className="mb-2 mt-4 px-3 text-[10px] font-semibold uppercase tracking-wider text-brand-300/60">实用工具</p>
        {TOOL_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `mb-1 block rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive ? 'bg-white/15 text-white' : 'text-brand-100/85 hover:bg-white/10'
              }`
            }
            end
          >
            <span className="block font-medium leading-snug">{item.label}</span>
            <span className="block text-[10px] text-brand-300/70">{item.desc}</span>
          </NavLink>
        ))}

        <p className="mb-2 mt-4 px-3 text-[10px] font-semibold uppercase tracking-wider text-brand-300/60">章节目录</p>
        {navigation.map((item) => (
          <NavLink
            key={item.slug}
            to={`/docs/${item.slug}`}
            onClick={onNavigate}
            className={({ isActive }) =>
              `mb-0.5 block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive ? 'bg-white/15 text-white' : 'text-brand-100/85 hover:bg-white/10'
              }`
            }
          >
            <span className="text-[11px] text-brand-300">{item.chapter}</span>
            <span className="mt-0.5 block font-medium leading-snug">{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}