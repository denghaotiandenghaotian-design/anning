import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { SearchCommand } from './SearchCommand';
import { ReadingProgress } from './ReadingProgress';
import { navigation, siteConfig } from '@/site.config';
import { getStoredTheme, initTheme, type Theme } from '@/lib/theme';

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());
  const location = useLocation();

  useEffect(() => {
    initTheme();
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const slug = location.pathname.replace(/^\/docs\//, '');
  const docMeta = navigation.find((n) => n.slug === slug);

  const titles: Record<string, string> = {
    '/': siteConfig.title,
    '/tools': '量表工具箱',
    '/cases': '个案管理',
    '/cases/new': '新建个案',
    '/resources': '资源中心',
    '/worksheets': '互动工作表',
    '/worksheets/four-sentences': '四道人生',
    '/worksheets/life-review': '生命回顾',
    '/worksheets/group-bereaved': '居丧家属小组模板',
    '/worksheets/group-death-anxiety': '死亡焦虑小组模板',
  };
  const pageTitle =
    titles[location.pathname] ??
    (location.pathname.startsWith('/tools/')
      ? '评估量表'
      : location.pathname.startsWith('/cases/')
        ? '个案详情'
        : location.pathname.startsWith('/print/')
          ? '打印预览'
          : docMeta
            ? `${docMeta.chapter} · ${docMeta.title}`
            : siteConfig.title);

  return (
    <div className="min-h-screen lg:pl-72">
      {siteConfig.githubStyle.readingProgress && <ReadingProgress />}
      <Sidebar mobileOpen={mobileOpen} onNavigate={() => setMobileOpen(false)} />
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="关闭菜单"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <TopHeader
        title={pageTitle}
        onMenu={() => setMobileOpen(true)}
        onSearch={() => setSearchOpen(true)}
        theme={theme}
        onThemeChange={setTheme}
      />
      <Outlet context={{ refreshSidebar: () => setMobileOpen(false) }} />
      <SearchCommand open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
