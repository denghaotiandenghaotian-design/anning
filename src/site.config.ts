export const siteConfig = {
  title: '安宁疗护实务指引',
  subtitle: '医务社会工作 · 供内部学习与服务参考',
  version: '2026.10',
  pdfPath: '/安宁疗护服务手册4.pdf',
  githubStyle: {
    /** 参考 DocCraft / Luma Docs 的文档站交互模式 */
    searchHotkey: true,
    readingProgress: true,
    tableOfContents: true,
  },
} as const;

export type NavItem = {
  slug: string;
  title: string;
  chapter?: string;
  description?: string;
};

export const navigation: NavItem[] = [
  { slug: 'ch01', chapter: '第一章', title: '什么是安宁疗护', description: '核心理念与概念辨析' },
  { slug: 'ch02', chapter: '第二章', title: '适用人群', description: '服务对象与政策依据' },
  { slug: 'ch03', chapter: '第三章', title: '适用范围', description: '场所、团队与服务边界' },
  { slug: 'ch04', chapter: '第四章', title: '主要服务模块', description: '症状控制与心理社会干预' },
  { slug: 'ch05', chapter: '第五章', title: '医务社工介入', description: '角色定位与服务流程' },
  { slug: 'ch06', chapter: '第六章', title: '个案介入指引', description: '评估工具与分阶段实施' },
  { slug: 'ch07', chapter: '第七章', title: '小组工作介入', description: '小组类型与带领要点' },
  { slug: 'ch08', chapter: '第八章', title: '社区工作介入', description: '宣教活动与资源联动' },
  { slug: 'references', chapter: '附录', title: '参考来源', description: '政策与学术文献' },
  { slug: 'afterword', chapter: '结语', title: '后记', description: '编写说明与致谢' },
];

export function getNavIndex(slug: string): number {
  return navigation.findIndex((n) => n.slug === slug);
}

export function getPrevNext(slug: string) {
  const i = getNavIndex(slug);
  if (i < 0) return { prev: null, next: null };
  return {
    prev: i > 0 ? navigation[i - 1] : null,
    next: i < navigation.length - 1 ? navigation[i + 1] : null,
  };
}
