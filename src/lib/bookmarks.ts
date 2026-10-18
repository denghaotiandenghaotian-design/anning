const KEY = 'anning-handbook-bookmarks';

export function getBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function toggleBookmark(slug: string): boolean {
  const set = new Set(getBookmarks());
  if (set.has(slug)) {
    set.delete(slug);
  } else {
    set.add(slug);
  }
  localStorage.setItem(KEY, JSON.stringify([...set]));
  return set.has(slug);
}

export function isBookmarked(slug: string): boolean {
  return getBookmarks().includes(slug);
}
