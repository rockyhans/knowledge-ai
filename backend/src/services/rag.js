import { env } from '../config/env.js';
import { getAllChunks } from '../db/repository.js';
import { createEmbeddings, generateAnswer } from './gemini.js';

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] ** 2;
    normB += b[i] ** 2;
  }

  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function answerQuestion(question) {
  const [queryEmbedding] = await createEmbeddings([question]);
  const chunks = getAllChunks();

  if (!chunks.length) {
    return { answer: 'There are no saved items to search yet.', sources: [] };
  }

  const ranked = chunks
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, JSON.parse(chunk.embedding))
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, env.TOP_K);

  const sources = ranked.map((chunk) => ({
    id: chunk.id,
    itemId: chunk.item_id,
    title: chunk.title,
    source: chunk.source,
    type: chunk.type,
    content: chunk.content,
    score: Number(chunk.score.toFixed(4))
  }));

  const answer = await generateAnswer(question, sources);
  return { answer, sources };
}
