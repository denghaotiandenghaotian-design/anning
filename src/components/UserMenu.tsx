import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROLE_OPTIONS, signOut, useSession } from '@/lib/auth';

export function UserMenu() {
  const session = useSession();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!session) {
    return (
      <Link
        to="/login"
        className="rounded-lg bg-[#07C160] px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-[#06ad56]"
      >
        💚 微信登录
      </Link>
    );
  }

  const role = ROLE_OPTIONS.find((r) => r.value === session.role);
  const initials = session.name.slice(0, 1).toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm hover:bg-gray-50 dark:border-brand-700 dark:bg-brand-900"
      >
        <span className="flex h-6 w-9 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
          {initials}
        </span>
        <span className="hidden text-sm text-gray-700 dark:text-gray-200 sm:block">{session.name}</span>
        <span className="text-xs text-gray-400">▾</span>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-label="关闭菜单"
          />
          <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-brand-700 dark:bg-brand-900">
            <div className="border-b border-gray-100 px-4 py-3 dark:border-brand-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{session.name}</p>
              <p className="mt-0.5 text-xs text-gray-500">
                {role?.icon} {session.role}
              </p>
              <p className="mt-1 text-[10px] text-gray-400">
                登录方式：{session.provider === 'wechat' ? '微信' : session.provider === 'demo' ? '体验账号' : '本地账号'} ·
                {' '}{new Date(session.signedAt).toLocaleDateString('zh-CN')}
              </p>
            </div>

            <div className="border-b border-gray-100 dark:border-brand-700">
              <MenuLink to="/cases" onClick={() => setOpen(false)} icon="📂">我的个案</MenuLink>
              <MenuLink to="/tools" onClick={() => setOpen(false)} icon="🧰">量表工具</MenuLink>
              <MenuLink to="/worksheets" onClick={() => setOpen(false)} icon="📝">工作表</MenuLink>
            </div>

            <button
              type="button"
              onClick={() => {
                signOut();
                setOpen(false);
                navigate('/');
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
            >
              <span>🚪</span> 退出登录
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function MenuLink({ to, icon, children, onClick }: { to: string; icon: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-brand-800"
    >
      <span>{icon}</span> {children}
    </Link>
  );
}