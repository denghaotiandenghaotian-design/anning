import { navigation, type NavItem } from '@/site.config';

const modules = import.meta.glob('../content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function slugFromPath(path: string): string {
  const m = path.match(/\/([^/]+)\.md$/);
  return m?.[1] ?? '';
}

const contentBySlug: Record<string, string> = {};
for (const [path, raw] of Object.entries(modules)) {
  const slug = slugFromPath(path);
  if (slug) contentBySlug[slug] = raw;
}

export type DocPage = NavItem & { body: string };

export function getAllDocs(): DocPage[] {
  return navigation
    .map((item) => ({
      ...item,
      body: contentBySlug[item.slug] ?? '',
    }))
    .filter((d) => d.body.length > 0);
}

export function getDocBySlug(slug: string): DocPage | undefined {
  const meta = navigation.find((n) => n.slug === slug);
  if (!meta) return undefined;
  const body = contentBySlug[slug];
  if (!body) return undefined;
  return { ...meta, body };
}

export function getSearchIndex() {
  return getAllDocs().map((d) => ({
    slug: d.slug,
    title: d.title,
    chapter: d.chapter ?? '',
    description: d.description ?? '',
    body: d.body.replace(/[#*`|[\]()>-]/g, ' ').slice(0, 8000),
  }));
}
