import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  ROLE_OPTIONS,
  signInDemo,
  signInLocal,
  signInWeChat,
  type UserRole,
} from '@/lib/auth';

type Mode = 'choice' | 'local' | 'wechat';

export function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('choice');
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
      <header className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
          🔐 登录
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-gray-900 dark:text-white">登录或注册</h1>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          所有数据本地存储，不上传服务器。可随时在「设置」中清除。
        </p>
      </header>

      {err && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-200">
          {err}
        </div>
      )}

      {mode === 'choice' && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setMode('wechat')}
            className="flex w-full items-center gap-4 rounded-xl border-2 border-[#07C160] bg-[#07C160] px-6 py-4 text-left text-white shadow transition hover:bg-[#06ad56]"
          >
            <span className="text-3xl">💚</span>
            <span className="flex-1">
              <span className="block text-base font-bold">微信登录</span>
              <span className="block text-xs opacity-90">扫码或绑定微信号，一键登录</span>
            </span>
            <span className="text-2xl">→</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('local')}
            className="flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white px-6 py-4 text-left transition hover:border-brand-300 hover:shadow-sm dark:border-brand-700 dark:bg-brand-900/40"
          >
            <span className="text-3xl">📝</span>
            <span className="flex-1">
              <span className="block text-base font-bold text-gray-900 dark:text-white">账号密码登录</span>
              <span className="block text-xs text-gray-500">本地账号，无需服务器（适合单机 / 离线）</span>
            </span>
            <span className="text-2xl text-gray-400">→</span>
          </button>

          <button
            type="button"
            onClick={() => {
              signInDemo();
              navigate('/');
            }}
            className="flex w-full items-center gap-4 rounded-xl border border-gray-200 bg-white px-6 py-4 text-left transition hover:border-brand-300 hover:shadow-sm dark:border-brand-700 dark:bg-brand-900/40"
          >
            <span className="text-3xl">🎁</span>
            <span className="flex-1">
              <span className="block text-base font-bold text-gray-900 dark:text-white">免登录体验</span>
              <span className="block text-xs text-gray-500">以体验账号身份进入，所有功能立即可用</span>
            </span>
            <span className="text-2xl text-gray-400">→</span>
          </button>

          <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-700 dark:bg-amber-900/20">
            <h3 className="font-serif text-sm font-bold text-amber-900 dark:text-amber-200">
              ⚙️ 关于微信登录
            </h3>
            <p className="mt-2 text-xs text-amber-900 dark:text-amber-100">
              本应用部署在公网静态站点上，<strong>纯前端无法完成微信 OAuth 的 code → access_token 兑换</strong>（需要 AppSecret 后端调用）。
              当前实现提供了完整的 UI 流程与代码骨架，后端接入只需替换
              <code className="mx-1 rounded bg-amber-100 px-1 py-0.5 dark:bg-amber-900/40">signInWeChat()</code>
              函数即可，详细步骤见 <code className="mx-1 rounded bg-amber-100 px-1 py-0.5 dark:bg-amber-900/40">src/lib/auth.ts</code> 末尾注释。
            </p>
          </section>
        </div>
      )}

      {mode === 'wechat' && <WeChatLogin onBack={() => { setMode('choice'); setErr(null); }} onError={setErr} />}

      {mode === 'local' && (
        <LocalLogin
          onBack={() => { setMode('choice'); setErr(null); }}
          onError={setErr}
          onSuccess={() => navigate('/')}
        />
      )}
    </div>
  );
}

function WeChatLogin({ onBack, onError }: { onBack: () => void; onError: (s: string) => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'qr' | 'form'>('qr');
  const [role, setRole] = useState<UserRole>('医务社工');
  const [wechatId, setWechatId] = useState('');
  const [name, setName] = useState('');

  // 模拟扫码后跳到表单；真实环境下微信回调后直接拿到昵称等信息
  const onSimulateScan = () => {
    setTimeout(() => {
      setWechatId('wx_demo_' + Math.random().toString(36).slice(2, 8));
      setName('微信用户');
      setStep('form');
    }, 600);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = signInWeChat({ wechatId, displayName: name, role });
    if (!r.ok) onError(r.error ?? '登录失败');
    else navigate('/');
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-brand-800 dark:bg-brand-900/40">
      <button onClick={onBack} className="mb-4 text-xs text-gray-500 hover:text-brand-600">← 返回登录方式</button>

      {step === 'qr' && (
        <>
          <h2 className="text-center font-serif text-xl font-bold">微信扫码登录</h2>
          <p className="mt-1 text-center text-xs text-gray-500">
            打开微信扫一扫下方二维码
          </p>

          <div className="mt-6 flex flex-col items-center">
            <div className="relative rounded-xl bg-white p-4 shadow ring-1 ring-gray-200">
              <QRCodeSVG
                value={`https://example.com/wxscan?code=${Date.now()}`}
                size={172}
                level="M"
                includeMargin={false}
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/85 backdrop-blur-sm">
                <div className="text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-300 border-t-brand-600" />
                  <p className="mt-2 text-xs font-medium text-gray-700">等待扫码…</p>
                </div>
              </div>
            </div>
            <p className="mt-3 text-[10px] text-gray-400">
              二维码内容：模拟微信 OAuth 链接（生产环境为 <code>open.weixin.qq.com/connect/oauth2/authorize</code>）
            </p>
            <button
              type="button"
              onClick={onSimulateScan}
              className="mt-3 text-xs text-brand-600 hover:underline"
            >
              （演示）模拟扫码成功 →
            </button>
          </div>

          <div className="mt-6 rounded-lg bg-brand-50/60 p-4 text-xs dark:bg-brand-900/30">
            <p className="font-semibold text-brand-900 dark:text-brand-200">📋 后端接入要点</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-brand-900 dark:text-brand-100">
              <li>注册微信公众号或服务号，在开放平台申请"网站应用"</li>
              <li>配置 OAuth 授权回调域名为部署域名</li>
              <li>后端实现 <code>/api/wechat/callback</code> 用 code 换 access_token</li>
              <li>前端 <code>signInWeChat()</code> 改为读取 cookie/JWT</li>
            </ol>
          </div>
        </>
      )}

      {step === 'form' && (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="text-center">
            <p className="text-2xl">💚</p>
            <p className="mt-1 text-sm font-medium">扫码成功</p>
            <p className="text-xs text-gray-500">首次登录请补全角色信息</p>
          </div>
          <Field label="微信昵称">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="如 李社工"
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
            />
          </Field>
          <Field label="微信号">
            <input
              value={wechatId}
              onChange={(e) => setWechatId(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
            />
          </Field>
          <Field label="角色">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.icon} {r.value} · {r.desc}
                </option>
              ))}
            </select>
          </Field>
          <button type="submit" className="w-full rounded-lg bg-[#07C160] py-2 text-sm font-medium text-white hover:bg-[#06ad56]">
            进入工作台 →
          </button>
        </form>
      )}
    </div>
  );
}

function LocalLogin({ onBack, onError, onSuccess }: { onBack: () => void; onError: (s: string) => void; onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('医务社工');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = signInLocal({ name, password, role });
    if (!r.ok) onError(r.error ?? '登录失败');
    else onSuccess();
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-brand-800 dark:bg-brand-900/40">
      <button onClick={onBack} className="mb-4 text-xs text-gray-500 hover:text-brand-600">← 返回登录方式</button>
      <h2 className="font-serif text-xl font-bold">账号密码登录</h2>
      <p className="mt-1 text-xs text-gray-500">
        本地账号首次输入即自动注册，之后凭相同姓名+密码登录
      </p>
      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <Field label="姓名/称呼">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="如 张社工"
            className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
          />
        </Field>
        <Field label="登录密码（≥4 位）">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="至少 4 位"
            className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
          />
        </Field>
        <Field label="角色">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm dark:border-brand-700"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.icon} {r.value} · {r.desc}
              </option>
            ))}
          </select>
        </Field>
        <button type="submit" className="w-full rounded-lg bg-brand-600 py-2 text-sm font-medium text-white hover:bg-brand-700">
          登录 / 注册 →
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
      {children}
    </label>
  );
}