/**
 * 会话管理 - 静态前端登录架构
 *
 * 当前实现：localStorage 模拟登录（角色 + 姓名）。
 * 生产环境替换要点：
 *  - 把 `signIn()` 改为调用真实后端的微信 OAuth 回调（需后端 + 公众号 AppID + AppSecret）
 *  - 把 `signOut()` 改为清空 token + 调用后端注销
 *  - 把 `getSession()` 改为校验 JWT/cookie 等
 *
 * 真实微信登录最小架构（公众号 H5 网页授权）：
 *  1. 用户点击"微信登录" → 跳转 https://open.weixin.qq.com/connect/oauth2/authorize
 *     ?appid=APPID&redirect_uri=CALLBACK&response_type=code&scope=snsapi_userinfo&state=STATE
 *  2. 微信回调到 CALLBACK,带 code 参数
 *  3. 后端用 code 换取 access_token 和用户信息
 *  4. 后端返回 session token 或写入 httpOnly cookie
 *  5. 前端从 cookie/接口读取用户信息
 */

const KEY = 'anning-handbook-session';
const CRED_KEY = 'anning-handbook-credentials';

export type UserRole = '医务社工' | '心理咨询师' | '医护人员' | '志愿者' | '家属' | '管理者' | '其他';

export const ROLE_OPTIONS: { value: UserRole; icon: string; desc: string }[] = [
  { value: '医务社工', icon: '🧑‍⚕️', desc: '安宁疗护社工、家庭工作' },
  { value: '心理咨询师', icon: '💭', desc: '心理评估、危机干预' },
  { value: '医护人员', icon: '👩‍⚕️', desc: '医生、护士、症状管理' },
  { value: '志愿者', icon: '🤝', desc: '陪伴、文娱、纪念活动' },
  { value: '家属', icon: '👨‍👩‍👧', desc: '患者家属、照顾者' },
  { value: '管理者', icon: '📋', desc: '机构管理、培训' },
  { value: '其他', icon: '👤', desc: '研究、教学、其他' },
];

export interface Session {
  /** 用户 ID（随机生成） */
  id: string;
  /** 登录来源：local / wechat / wechat-mp / qq / phone */
  provider: 'local' | 'wechat' | 'wechat-mp' | 'wechat-qr' | 'qq' | 'phone' | 'demo';
  /** 显示名（不强制实名） */
  name: string;
  role: UserRole;
  /** 头像 emoji（可选） */
  avatar?: string;
  /** 登录时间戳 */
  signedAt: number;
  /** 是否完成新手引导 */
  onboarded: boolean;
}

export interface Credential {
  id: string;
  /** 简化密码（仅本地 demo 使用，生产环境必须用 token） */
  password: string;
  session: Session;
}

/* ---------------- 凭证管理（仅本地） ---------------- */

function readAllCreds(): Credential[] {
  try {
    const raw = localStorage.getItem(CRED_KEY);
    return raw ? (JSON.parse(raw) as Credential[]) : [];
  } catch {
    return [];
  }
}

function writeAllCreds(creds: Credential[]) {
  localStorage.setItem(CRED_KEY, JSON.stringify(creds));
}

/* ---------------- 会话 ---------------- */

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    return s;
  } catch {
    return null;
  }
}

function writeSession(s: Session | null) {
  if (!s) {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event('session-updated'));
    return;
  }
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event('session-updated'));
}

export function signInLocal(input: { name: string; password: string; role: UserRole }): { ok: boolean; error?: string; session?: Session } {
  const name = input.name.trim();
  if (!name) return { ok: false, error: '请填写姓名/称呼' };
  if (!input.password || input.password.length < 4) return { ok: false, error: '请输入至少 4 位登录密码' };

  const creds = readAllCreds();
  const existing = creds.find((c) => c.session.name === name);

  if (existing) {
    if (existing.password !== input.password) return { ok: false, error: '密码不正确' };
    existing.session.signedAt = Date.now();
    existing.session.role = input.role;
    writeAllCreds(creds);
    writeSession(existing.session);
    return { ok: true, session: existing.session };
  }

  const session: Session = {
    id: `u-${Date.now().toString(36)}`,
    provider: 'local',
    name,
    role: input.role,
    signedAt: Date.now(),
    onboarded: false,
  };
  creds.push({ id: session.id, password: input.password, session });
  writeAllCreds(creds);
  writeSession(session);
  return { ok: true, session };
}

/**
 * 微信登录的占位实现
 *
 * 真实环境下，这里需要：
 * 1. 跳转 https://open.weixin.qq.com/connect/oauth2/authorize?appid=...&redirect_uri=...
 * 2. 后端用返回的 code 换取用户信息
 * 3. 创建/匹配用户并写入 session
 *
 * 当前实现：模拟扫码成功后的流程，把用户输入的微信号作为身份。
 * 后端接入时只需替换此函数即可。
 */
export function signInWeChat(input: { wechatId: string; displayName: string; role: UserRole }): { ok: boolean; error?: string; session?: Session } {
  const wid = input.wechatId.trim();
  const name = input.displayName.trim();
  if (!wid) return { ok: false, error: '请填写微信号' };
  if (!name) return { ok: false, error: '请填写微信昵称' };

  const session: Session = {
    id: `wx-${wid}`,
    provider: 'wechat',
    name,
    role: input.role,
    signedAt: Date.now(),
    onboarded: true,
  };
  writeSession(session);
  return { ok: true, session };
}

export function signInDemo(): Session {
  const session: Session = {
    id: `demo-${Date.now().toString(36)}`,
    provider: 'demo',
    name: '体验账号',
    role: '医务社工',
    signedAt: Date.now(),
    onboarded: true,
  };
  writeSession(session);
  return session;
}

export function markOnboarded() {
  const s = getSession();
  if (!s) return;
  s.onboarded = true;
  writeSession(s);
}

export function signOut() {
  writeSession(null);
}

/* ---------------- React Hook ---------------- */

import { useEffect, useState } from 'react';

export function useSession(): Session | null {
  const [s, setS] = useState<Session | null>(() => getSession());
  useEffect(() => {
    const onUpdate = () => setS(getSession());
    window.addEventListener('session-updated', onUpdate);
    return () => window.removeEventListener('session-updated', onUpdate);
  }, []);
  return s;
}

/* ---------------- 微信集成说明 ---------------- */

/**
 * 真实接入微信开放平台所需配置（生产环境）
 *
 * 1. 在 https://mp.weixin.qq.com 注册"服务号"或"订阅号"
 * 2. 在 https://open.weixin.qq.com 完成"网站应用" 接入审核，获取 AppID 与 AppSecret
 * 3. 配置授权回调域名为部署的域名（如 zuc5x9r5tjvwe.space.mcode.cn）
 * 4. 后端实现：
 *    - GET /api/wechat/oauth → 返回微信授权 URL
 *    - GET /api/wechat/callback → 接收微信 code，换取 access_token + 用户信息，颁发 JWT
 *    - GET /api/me → 校验 JWT，返回当前用户
 * 5. 前端 signInWeChat 改为：
 *    - 点击 → 跳转后端 /api/wechat/oauth → 微信 → 回调 → 写入 cookie → 跳回应用
 *    - 首次登录时让用户补全角色（UserRole）
 *
 * 注意：纯静态前端无法完成"code → access_token"的兑换（AppSecret 不能暴露在前端）。
 */