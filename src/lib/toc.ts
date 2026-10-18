export type TocEntry = { id: string; text: string; level: 2 | 3 };

export function extractToc(markdown: string): TocEntry[] {
  const entries: TocEntry[] = [];
  for (const line of markdown.split('\n')) {
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      entries.push({ id: slugify(h2[1]), text: h2[1].trim(), level: 2 });
      continue;
    }
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      entries.push({ id: slugify(h3[1]), text: h3[1].trim(), level: 3 });
    }
  }
  return entries;
}

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '');
}
