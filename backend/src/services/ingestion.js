import * as cheerio from 'cheerio';
import { env } from '../config/env.js';
import { createItem, createChunks } from '../db/repository.js';
import { chunkText } from './chunking.js';
import { createEmbeddings } from './gemini.js';

function cleanTitle(title, fallback) {
  return title?.replace(/\s+/g, ' ').trim().slice(0, 200) || fallback;
}

async function fetchUrlContent(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'TuriumKnowledgeInbox/1.0' }
    });

    if (!response.ok) throw new Error(`URL returned HTTP ${response.status}`);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) throw new Error('URL does not return HTML content');

    const html = await response.text();
    const $ = cheerio.load(html);
    $('script, style, noscript, svg, nav, footer, header').remove();

    const title = cleanTitle($('title').first().text(), url);
    const content = $('main').text() || $('article').text() || $('body').text();
    const normalized = content.replace(/\s+/g, ' ').trim();

    if (!normalized) throw new Error('Could not extract readable text from URL');
    return { title, content: normalized };
  } finally {
    clearTimeout(timeout);
  }
}

export async function ingest({ type, content, url, title }) {
  let itemType = type;
  let rawContent = content?.trim();
  let itemTitle = title?.trim();
  let source = 'note';

  if (type === 'url') {
    const result = await fetchUrlContent(url);
    rawContent = result.content;
    itemTitle = itemTitle || result.title;
    source = url;
  }

  if (!rawContent) throw new Error('Content is required');
  if (rawContent.length > env.MAX_CONTENT_CHARS) {
    rawContent = rawContent.slice(0, env.MAX_CONTENT_CHARS);
  }

  itemTitle = cleanTitle(itemTitle, type === 'url' ? source : 'Untitled note');
  const item = createItem({ type: itemType, title: itemTitle, source, content: rawContent });
  const chunks = chunkText(rawContent);
  const embeddings = await createEmbeddings(chunks);

  createChunks(chunks.map((chunk, index) => ({
    itemId: item.id,
    chunkIndex: index,
    content: chunk,
    embedding: JSON.stringify(embeddings[index])
  })));

  return { ...item, chunk_count: chunks.length };
}
