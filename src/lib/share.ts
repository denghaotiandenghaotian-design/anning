/**
 * 快照分享 - 把任意 JSON 序列化后编码进 URL hash，对方打开 #share?d=... 直接看只读视图
 *
 * 设计要点：
 *  - 用 location.hash 而不是 query string：hash 不会发送到服务器，浏览器原生隐私保护
 *  - base64url 编码（非标准 base64），URL 安全
 *  - 大型快照会附带 type 字段和 readOnly 标记，确保不会被误写
 *  - 同时支持单次"评估结果"快照和完整"个案档案"快照
 */

const VERSION = 1;

export type SnapshotType = 'case' | 'assessment' | 'worksheet';

export interface SnapshotMeta {
  /** 快照类型，决定渲染逻辑 */
  type: SnapshotType;
  /** 简短标题（用于分享卡片） */
  title: string;
  /** 副标题 */
  subtitle?: string;
  /** 创建时间戳 */
  createdAt: number;
  /** 共享者代号（不暴露真名） */
  author?: string;
  /** 过期时间戳（0 = 永不过期） */
  expiresAt?: number;
}

export interface Snapshot<T = unknown> extends SnapshotMeta {
  version: number;
  data: T;
}

/** base64 字符串 → Uint8Array */
function fromBase64Url(s: string): Uint8Array {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 ? '='.repeat(4 - (padded.length % 4)) : '';
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Uint8Array → base64url */
function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Uint8Array → UTF-8 字符串 */
function bytesToString(bytes: Uint8Array): string {
  return new TextDecoder('utf-8').decode(bytes);
}

/** UTF-8 字符串 → Uint8Array */
function stringToBytes(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

/** 生成只读快照 URL */
export function encodeSnapshot<T>(meta: SnapshotMeta, data: T): string {
  const snapshot: Snapshot<T> = {
    ...meta,
    version: VERSION,
    data,
  };
  const json = JSON.stringify(snapshot);
  const encoded = toBase64Url(stringToBytes(json));
  const base = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
  return `${base}#/share?d=${encoded}`;
}

/** 编码为纯字符串（不含域名） */
export function encodeSnapshotString<T>(meta: SnapshotMeta, data: T): string {
  const snapshot: Snapshot<T> = { ...meta, version: VERSION, data };
  return toBase64Url(stringToBytes(JSON.stringify(snapshot)));
}

/** 从 URL 字符串解码快照 */
export function decodeSnapshot<T = unknown>(encoded: string): Snapshot<T> | null {
  try {
    const bytes = fromBase64Url(encoded);
    const json = bytesToString(bytes);
    const parsed = JSON.parse(json) as Snapshot<T>;
    if (!parsed || typeof parsed !== 'object' || !parsed.version) return null;
    if (parsed.expiresAt && parsed.expiresAt > 0 && parsed.expiresAt < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** 从当前 URL hash 解码 */
export function readSnapshotFromUrl(): Snapshot | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  const idx = hash.indexOf('d=');
  if (idx < 0) return null;
  const params = new URLSearchParams(hash.split('?')[1] || '');
  const d = params.get('d');
  if (!d) return null;
  return decodeSnapshot(d);
}

/** 复制文本到剪贴板（带 fallback） */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined') return false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fallback to legacy */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}

/** 计算 base64 大小（近似） */
export function estimateSize(encoded: string): number {
  return Math.ceil((encoded.length * 3) / 4);
}