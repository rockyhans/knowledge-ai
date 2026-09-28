const DEFAULT_CHUNK_SIZE = 900;
const DEFAULT_OVERLAP = 150;

export function chunkText(text, chunkSize = DEFAULT_CHUNK_SIZE, overlap = DEFAULT_OVERLAP) {
  const normalized = text.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').trim();
  if (!normalized) return [];
  if (normalized.length <= chunkSize) return [normalized];

  const chunks = [];
  let start = 0;

  while (start < normalized.length) {
    let end = Math.min(start + chunkSize, normalized.length);

    if (end < normalized.length) {
      const boundary = Math.max(
        normalized.lastIndexOf('. ', end),
        normalized.lastIndexOf('\n', end),
        normalized.lastIndexOf(' ', end)
      );
      if (boundary > start + chunkSize * 0.65) end = boundary + 1;
    }

    const chunk = normalized.slice(start, end).trim();
    if (chunk) chunks.push(chunk);
    if (end >= normalized.length) break;

    start = Math.max(end - overlap, start + 1);
  }

  return chunks;
}
