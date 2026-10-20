import { Link } from 'react-router-dom';
import { navigation, siteConfig } from '@/site.config';
import { ASSESSMENTS } from '@/lib/assessments';

export function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <section className="mb-12 text-center">
        <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800 dark:bg-brand-800 dark:text-brand-100">
          内部学习与服务参考 · v{siteConfig.version}
        </span>
        <h1 className="mt-6 font-serif text-3xl font-bold text-brand-900 dark:text-white md:text-4xl">
          医务社会工作
          <br />
          安宁疗护社工社会心理服务指引手册
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
          {ASSESSMENTS.length} 种评估量表 · 9 章实务手册 · 实务案例库 · 个案追踪 · 互动工作表 · 资源中心
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/docs/ch01"
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-brand-700"
          >
            📖 开始阅读手册
          </Link>
          <Link
            to="/tools"
            className="rounded-lg bg-white border border-brand-600 px-5 py-2.5 text-sm font-medium text-brand-700 hover:bg-brand-50 dark:bg-brand-900 dark:text-brand-200 dark:border-brand-400 dark:hover:bg-brand-800"
          >
            🧰 进入量表工具
          </Link>
          <Link
            to="/cases/new"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-brand-700 dark:text-gray-200 dark:hover:bg-brand-900"
          >
            📂 建立个案
          </Link>
        </div>
      </section>

      <blockquote className="mb-10 rounded-xl border border-amber-200/80 bg-amber-50/60 px-6 py-5 text-left text-sm italic text-gray-700 dark:border-brand-700 dark:bg-brand-900/40 dark:text-gray-300">
        安宁疗护不是一份关于「如何离开」的技术清单，而是一种关于「如何好好走到终点」的照护哲学——既不加速死亡，也不延缓死亡，只是陪着患者和家人，把剩下的路走得尽量安稳、尽量像自己。
      </blockquote>

      {/* 核心功能区 */}
      <section className="mb-12">
        <h2 className="mb-4 font-serif text-2xl font-bold text-gray-900 dark:text-white">核心功能</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon="📖"
            title="9 章实务手册"
            desc="概念、评估、个案、小组、社区工作 + 伦理规范 + 参考来源"
            to="/docs/ch01"
            tone="brand"
          />
          <FeatureCard
            icon="🧰"
            title={`${ASSESSMENTS.length} 种评估量表`}
            desc="自动计分 + 解读 + 打印报告 + 关联个案 + 分享结果"
            to="/tools"
            tone="amber"
          />
          <FeatureCard
            icon="📑"
            title="实务案例库"
            desc="个案 · 小组 · 社区三个完整案例，含前后测成效对比"
            to="/cases-studies"
            tone="purple"
          />
          <FeatureCard
            icon="📂"
            title="个案管理"
            desc="接案—介入—结案全过程，本地存储 + 一键分享快照"
            to="/cases"
            tone="green"
          />
          <FeatureCard
            icon="📝"
            title="互动工作表"
            desc="四道人生、生命回顾、我的五个愿望、小组活动模板"
            to="/worksheets"
            tone="purple"
          />
          <FeatureCard
            icon="💚"
            title="微信扫码登录"
            desc="提供完整 UI 与后端接入文档，可平滑替换为公众号 H5 授权"
            to="/login"
            tone="brand"
          />
        </div>
      </section>

      {/* 量表速览 */}
      <section className="mb-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">评估量表速览</h2>
          <Link to="/tools" className="text-sm text-brand-600 hover:underline">查看全部 {ASSESSMENTS.length} 种 →</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ASSESSMENTS.map((a) => (
            <Link
              key={a.id}
              to={`/tools/${a.id}`}
              className="rounded-lg border border-gray-200 bg-white p-3 transition hover:border-brand-300 hover:shadow-sm dark:border-brand-800 dark:bg-brand-900/40"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-base font-bold text-brand-700 dark:text-brand-300">{a.name}</span>
                {a.assessorRated && <span className="text-[9px] text-amber-600 dark:text-amber-400">评定者</span>}
              </div>
              <p className="mt-1 text-[10px] text-gray-500">{a.duration}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 手册章节目录 */}
      <section className="mb-12">
        <h2 className="mb-4 font-serif text-2xl font-bold text-gray-900 dark:text-white">手册章节目录</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {navigation.map((item) => (
            <Link
              key={item.slug}
              to={`/docs/${item.slug}`}
              className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-brand-300 hover:shadow-md dark:border-brand-800 dark:bg-brand-900/40 dark:hover:border-brand-600"
            >
              <p className="text-xs font-semibold text-brand-600 dark:text-brand-300">{item.chapter}</p>
              <h3 className="mt-1 font-serif text-base font-semibold text-gray-900 group-hover:text-brand-700 dark:text-white">
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* 设计理念 */}
      <section className="mb-12 rounded-xl border border-brand-200 bg-brand-50/40 p-6 dark:border-brand-700 dark:bg-brand-900/30">
        <h2 className="font-serif text-xl font-bold text-brand-900 dark:text-brand-200">设计理念</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Pillar
            title="数据本地"
            text="所有个案记录、量表结果、工作表草稿均存储在您的浏览器，不上传任何服务器，保护服务对象隐私。"
          />
          <Pillar
            title="实务导向"
            text="所有功能直接对接一线工作场景：评估—记录—打印—分享—追踪，覆盖接案到结案全流程。"
          />
          <Pillar
            title="权威依据"
            text="评估工具、干预方法、政策依据全部引自《安宁疗护实践指南（2025）》《深圳 DB4403/T 521—2024》等权威来源。"
          />
        </div>
      </section>

      <p className="text-center text-xs text-gray-400">
        交互设计参考开源文档站方案 DocCraft / Luma Docs 与心理测验平台开源项目的实务模式
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  to,
  tone,
}: {
  icon: string;
  title: string;
  desc: string;
  to: string;
  tone: 'brand' | 'amber' | 'green' | 'purple';
}) {
  const tones: Record<string, string> = {
    brand: 'bg-brand-100 dark:bg-brand-800/50',
    amber: 'bg-amber-100 dark:bg-amber-800/50',
    green: 'bg-green-100 dark:bg-green-800/50',
    purple: 'bg-purple-100 dark:bg-purple-800/50',
  };
  return (
    <Link
      to={to}
      className="group block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md dark:border-brand-800 dark:bg-brand-900/40 dark:hover:border-brand-600"
    >
      <div className={`inline-block rounded-lg p-2 text-2xl ${tones[tone]}`}>{icon}</div>
      <h3 className="mt-3 font-serif text-base font-bold text-gray-900 group-hover:text-brand-700 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{desc}</p>
    </Link>
  );
}

function Pillar({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h3 className="font-serif text-sm font-bold text-brand-900 dark:text-brand-200">{title}</h3>
      <p className="mt-1 text-xs text-gray-700 dark:text-gray-300">{text}</p>
    </div>
  );
}