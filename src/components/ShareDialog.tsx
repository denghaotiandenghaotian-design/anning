import { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { copyToClipboard, encodeSnapshot, estimateSize, type SnapshotMeta } from '@/lib/share';
import { useSession } from '@/lib/auth';

interface Props<T> {
  open: boolean;
  onClose: () => void;
  meta: SnapshotMeta;
  data: T;
  /** 分享时的渲染预览（用于微信卡片显示） */
  preview?: React.ReactNode;
}

export function ShareDialog<T>({ open, onClose, meta, data, preview }: Props<T>) {
  const session = useSession();
  const [copied, setCopied] = useState(false);

  const url = useMemo(() => (open ? encodeSnapshot(meta, data) : ''), [open, meta, data]);
  const size = useMemo(() => estimateSize(encodeSnapshot(meta, data)), [meta, data]);
  const tooLarge = size > 2500;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const onCopy = async () => {
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-brand-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-4 dark:border-brand-800">
          <div>
            <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white">
              📤 分享 · {meta.title}
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              扫描二维码或复制链接，对方打开即可查看只读快照（无需注册）
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-brand-800"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-6 px-6 py-5 md:grid-cols-[180px_1fr]">
          <div className="flex flex-col items-center justify-center">
            <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-200">
              <QRCodeSVG value={url} size={156} level="M" includeMargin={false} />
            </div>
            <p className="mt-2 text-[10px] text-gray-400">
              扫码即可打开 · {Math.round(size)} chars
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500">分享链接</p>
              <div className="mt-1 flex gap-2">
                <input
                  readOnly
                  value={url}
                  className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-700 dark:border-brand-700 dark:bg-brand-950 dark:text-gray-300"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  type="button"
                  onClick={onCopy}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-medium text-white hover:bg-brand-700"
                >
                  {copied ? '✓ 已复制' : '复制'}
                </button>
              </div>
              {tooLarge && (
                <p className="mt-1 text-[10px] text-amber-600 dark:text-amber-300">
                  ⚠️ 链接较长，建议直接分享二维码
                </p>
              )}
            </div>

            {preview && (
              <div>
                <p className="text-xs font-medium text-gray-500">预览</p>
                <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm dark:border-brand-700 dark:bg-brand-950">
                  {preview}
                </div>
              </div>
            )}

            <div className="rounded-lg bg-brand-50/60 p-3 dark:bg-brand-900/30">
              <p className="text-[11px] font-medium text-brand-900 dark:text-brand-200">
                📱 微信分享建议
              </p>
              <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-[11px] text-brand-900 dark:text-brand-100">
                <li>点击「复制」后粘贴到微信对话框发送给同事</li>
                <li>或截图二维码发送给家属，对方长按识别即可打开</li>
                <li>对方无需注册账号，链接在浏览器直接显示只读快照</li>
              </ol>
            </div>

            <p className="text-[10px] text-gray-400">
              共享者：{session?.name ?? '匿名'} · 创建时间：
              {new Date(meta.createdAt).toLocaleString('zh-CN')}
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-6 py-3 dark:border-brand-800 dark:bg-brand-950">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-100 dark:border-brand-700 dark:hover:bg-brand-900"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}