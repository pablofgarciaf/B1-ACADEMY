/** Public origin used consistently by metadata, structured data and crawlers. */
export const SITE_URL = (() => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return 'https://b1-academy.vercel.app';
  try {
    const url = new URL(configured);
    if (url.protocol !== 'https:' && url.hostname !== 'localhost') return 'https://b1-academy.vercel.app';
    return url.origin;
  } catch {
    return 'https://b1-academy.vercel.app';
  }
})();

export function publicUrl(path = ''): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
