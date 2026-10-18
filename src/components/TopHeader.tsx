import { type Theme, setStoredTheme } from '@/lib/theme';
import { UserMenu } from './UserMenu';

type Props = {
  title: string;
  onMenu: () => void;
  onSearch: () => void;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
};

export function TopHeader({ title, onMenu, onSearch, theme, onThemeChange }: Props) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-gray-200/80 bg-white/90 px-4 backdrop-blur dark:border-brand-800 dark:bg-brand-950/90 lg:px-8">
      <button type="button" className="rounded-lg p-2 lg:hidden" onClick={onMenu} aria-label="菜单">
        ☰
      </button>
      <h2 className="min-w-0 flex-1 truncate text-sm font-medium text-gray-600 dark:text-gray-300">{title}</h2>
      <button
        type="button"
        onClick={onSearch}
        className="hidden items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50 sm:flex dark:border-brand-700 dark:hover:bg-brand-900"
      >
        <span>搜索</span>
        <kbd className="rounded bg-gray-100 px-1 dark:bg-brand-800">Ctrl K</kbd>
      </button>
      <button type="button" className="rounded-lg p-2 sm:hidden" onClick={onSearch} aria-label="搜索">
        ⌕
      </button>
      <select
        value={theme}
        onChange={(e) => {
          const t = e.target.value as Theme;
          onThemeChange(t);
          setStoredTheme(t);
        }}
        className="hidden rounded-lg border border-gray-200 bg-transparent px-2 py-1.5 text-xs sm:block dark:border-brand-700"
        aria-label="主题"
      >
        <option value="system">跟随系统</option>
        <option value="light">浅色</option>
        <option value="dark">深色</option>
      </select>
      <UserMenu />
    </header>
  );
}