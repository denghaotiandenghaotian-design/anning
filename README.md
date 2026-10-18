# 安宁疗护实务指引 (anning-handbook-app)

> 医务社会工作 · 安宁疗护多学科协作实务平台 · 供内部学习与服务参考

[![Live Demo](https://img.shields.io/badge/在线体验-zuc5x9r5tjvwe.space.mcode.cn-brightgreen)](https://zuc5x9r5tjvwe.space.mcode.cn)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646cff)](https://vitejs.dev)

## ✨ 功能特性

| 模块 | 说明 |
| --- | --- |
| 📖 **8 章实务手册** | 概念辨析、评估工具、个案、小组、社区工作 + 政策依据 + 参考来源 |
| 🧰 **8 种评估量表** | SAS / SDS / GAD-7 / PHQ-9 / GDS-30 / ICG / PDI / SSRS · 自动计分 + 解读 + 打印报告 |
| 📂 **个案追踪** | 接案—预估—计划—介入—评估—结案—回访 七阶段流程，全程本地存储 |
| 📝 **互动工作表** | 四道人生、生命回顾、居丧家属小组、死亡焦虑小组等 4 个可填写模板 |
| 🔗 **资源中心** | 政策文件 · 地方标准 · 学术文献 · 工作模板 · 推广机构 |
| 💚 **微信登录骨架** | 提供完整 UI 与后端接入文档，可平滑替换为公众号 H5 OAuth |
| 📤 **只读快照分享** | 把个案 / 评估结果编码进 URL，对方浏览器直接查看，无需注册 |
| 🖨 **打印优化** | 每章提供打印模式 + 全站 `@media print` 排版优化 |

## 🚀 快速开始

```bash
# 安装依赖（推荐 pnpm 或 npm）
npm install

# 本地开发
npm run dev          # → http://localhost:5173

# 生产构建
npm run build        # 产物在 dist/

# 预览构建结果
npm run preview
```

## 📁 项目结构

```
anning-handbook-app/
├── index.html                 # 入口 HTML
├── package.json               # 依赖清单
├── vite.config.ts             # Vite 构建配置
├── tailwind.config.js         # Tailwind 主题（brand 深绿 / warm 暖米）
├── tsconfig*.json             # TypeScript 配置
├── postcss.config.js
├── public/                    # 静态资源
│   ├── favicon.svg
│   └── 安宁疗护服务手册4.pdf  # 手册 PDF 原版
└── src/
    ├── App.tsx                # 路由配置
    ├── main.tsx               # 应用入口
    ├── index.css              # 全局样式 + @media print 打印样式
    ├── site.config.ts         # 章节元数据
    ├── components/            # 7 个 UI 组件
    │   ├── AppLayout.tsx
    │   ├── Sidebar.tsx
    │   ├── TopHeader.tsx
    │   ├── UserMenu.tsx       # 用户登录菜单
    │   ├── SearchCommand.tsx
    │   ├── MarkdownContent.tsx
    │   ├── TableOfContents.tsx
    │   ├── ReadingProgress.tsx
    │   └── ShareDialog.tsx    # 分享对话框（含二维码）
    ├── content/               # 10 个章节 Markdown 正文
    │   ├── ch01.md ~ ch08.md
    │   ├── references.md
    │   └── afterword.md
    ├── lib/                   # 5 个核心数据层
    │   ├── assessments.ts     # 8 种量表题目 + 计分
    │   ├── cases.ts           # 个案 CRUD + localStorage
    │   ├── share.ts           # 快照编码 / 解码
    │   ├── auth.ts            # 会话管理 + 微信登录骨架
    │   ├── resources.ts       # 资源中心数据
    │   ├── bookmarks.ts       # 书签管理
    │   ├── content.ts         # 章节正文加载
    │   ├── theme.ts           # 主题切换
    │   └── toc.ts             # 章节目录抽取
    └── pages/                 # 15 个页面
        ├── HomePage.tsx
        ├── DocPage.tsx        # 章节详情
        ├── PrintPage.tsx      # 打印视图
        ├── ToolsHub.tsx       # 量表工具箱首页
        ├── ToolRunner.tsx     # 单个量表运行器
        ├── CasesPage.tsx      # 个案列表
        ├── NewCasePage.tsx    # 新建个案
        ├── CaseDetailPage.tsx # 个案详情
        ├── ResourcesPage.tsx  # 资源中心
        ├── WorksheetsHub.tsx
        ├── FourSentencesWorksheet.tsx
        ├── LifeReviewWorksheet.tsx
        ├── GroupBereavedWorksheet.tsx
        ├── GroupDeathAnxietyWorksheet.tsx
        ├── SharePage.tsx      # 只读快照视图
        └── LoginPage.tsx      # 登录页
```

## 🔐 接入真实微信登录

当前 `src/lib/auth.ts` 中的 `signInWeChat()` 是静态前端占位实现。要替换为真实的微信公众号 H5 授权：

1. **注册服务号 / 网站应用**
   - 微信公众号：https://mp.weixin.qq.com
   - 开放平台：https://open.weixin.qq.com → "网站应用"
2. **配置授权回调域名**为部署域名（`zuc5x9r5tjvwe.space.mcode.cn`）
3. **后端实现**（必须）：
   ```
   GET  /api/wechat/oauth     → 返回微信授权 URL
   GET  /api/wechat/callback  → 接收 code，换取 access_token + 用户信息，颁发 JWT
   GET  /api/me               → 校验 JWT，返回当前用户
   ```
4. **修改前端**：把 `signInWeChat()` 改为读取 cookie 或调用 `/api/me`
   - 完整接入说明见 `src/lib/auth.ts` 末尾注释

⚠️ **AppSecret 绝不能放在前端**（会被反编译拿走）。纯静态前端无法完成"code → access_token"兑换，必须有后端。

## 🔐 隐私与数据安全

| 位置 | 存储方式 | 上传？ |
| --- | --- | --- |
| 个案档案 | 浏览器 localStorage | ❌ 永不上传 |
| 量表结果 | 浏览器 localStorage | ❌ 永不上传 |
| 工作表草稿 | 浏览器 localStorage | ❌ 永不上传 |
| 登录会话 | 浏览器 localStorage | ❌ 永不上传 |
| 分享快照 | 编码到 URL hash | ❌ 仅在 URL 中传递，hash 不会发送到服务器 |

**生产环境对接后端时**：请评估是否需要把 localStorage 数据迁移到服务端加密存储，并遵循《个人信息保护法》《医疗机构病历管理规定》等。

## 📜 政策与学术依据

本平台内容引自：
- 《安宁疗护实践指南（2025 年版）》（国卫办医政函〔2025〕332 号）
- 《安宁疗护中心基本标准（试行）》（国卫医发〔2017〕7 号）
- 深圳市地方标准 DB4403/T 521—2024《安宁疗护社会工作服务指南》
- 《上海市安宁疗护服务规范》（沪卫基层〔2020〕9 号）
- 《新疆维吾尔自治区安宁疗护服务规范》（2025 年）
- WHO Palliative Care Fact Sheet (2020)
- 周燕雯 ADAPTS 哀伤评估与干预配对模式、E-CARE 框架等学术文献

完整参考文献见 `src/content/references.md`。

## 🛠 技术栈

- **React 18** + **TypeScript 5** + **Vite 5**
- **Tailwind CSS 3**（深绿 brand 主题，温馨暖米底色）
- **React Router 6**（hash 模式，便于静态部署）
- **Fuse.js**（全文模糊搜索）
- **react-markdown** + **remark-gfm**（Markdown 渲染）
- **qrcode.react**（分享二维码）

## 🚢 部署

本项目构建产物为纯静态文件（`dist/`），可部署到任何静态托管服务：

```bash
npm run build
# 把 dist/ 目录上传到任意静态托管（Vercel / Netlify / GitHub Pages / 阿里云 / 腾讯云 / Nginx 等）
```

> ⚠️ 由于使用 React Router 的 hash 模式（`#/...`），无需配置 SPA fallback。

## 📄 许可证

MIT License © 2026 本平台编写组

## 🙏 致谢

感谢所有在安宁疗护道路上探索与实践的同行者。本平台将随政策发展与实务积累持续修订完善。