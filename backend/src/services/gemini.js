import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY
});

async function callWithRetry(operation, retries = 2, delayMs = 1000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      const isTransient = error.message?.includes('503') || error.message?.includes('UNAVAILABLE') || error.message?.includes('429');
      if (isTransient && attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
        continue;
      }
      throw error;
    }
  }
}

export async function createEmbeddings(texts) {
  if (!texts || texts.length === 0) return [];

  const batchSize = 50;
  const results = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const response = await callWithRetry(() =>
      ai.models.embedContent({
        model: env.GEMINI_EMBEDDING_MODEL,
        contents: batch,
        config: {
          outputDimensionality: 768
        }
      })
    );

    const embeddings = (response.embeddings || []).map((entry) => entry.values ?? []);
    results.push(...embeddings);
  }

  return results;
}

export async function generateEmbedding(text) {
  const [embedding] = await createEmbeddings([text]);
  return embedding ?? [];
}

export async function generateAnswer(question, sources) {
  const context = sources.map((source, index) => (
    `[Source ${index + 1}] ${source.title}\n${source.content}`
  )).join('\n\n---\n\n');

  const systemInstruction = `You are a knowledge-base assistant. Answer the user's question using only the supplied sources. If the sources do not contain enough information, say so clearly. Do not invent facts. Cite supporting sources inline using [Source 1], [Source 2], etc.`;

  const response = await callWithRetry(() =>
    ai.models.generateContent({
      model: env.GEMINI_CHAT_MODEL,
      contents: `Question:\n${question}\n\nSources:\n${context}`,
      config: {
        systemInstruction
      }
    })
  );

  return response.text;
}

export async function* generateAnswerStream(question, context) {
  const systemInstruction = `You are a knowledge-base assistant. Answer the user's question using only the supplied sources. If the sources do not contain enough information, say so clearly. Do not invent facts. Cite supporting sources inline using [Source 1], [Source 2], etc.`;

  const stream = await ai.models.generateContentStream({
    model: env.GEMINI_CHAT_MODEL,
    contents: `Question:\n${question}\n\nSources:\n${context}`,
    config: {
      systemInstruction
    }
  });

  for await (const chunk of stream) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
}
