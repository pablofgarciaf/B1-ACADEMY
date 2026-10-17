/** Split on word boundaries while retaining all text. The signature always covers the full text. */
export function narrationChunks(text: string, limit = 1500): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  let current = '';
  for (const word of words) {
    if (current && current.length + word.length + 1 > limit) { chunks.push(current); current = ''; }
    if (word.length > limit) {
      if (current) { chunks.push(current); current = ''; }
      for (let i = 0; i < word.length; i += limit) chunks.push(word.slice(i, i + limit));
    } else current += (current ? ' ' : '') + word;
  }
  if (current) chunks.push(current);
  return chunks;
}
