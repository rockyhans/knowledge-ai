import db from './database.js';

export function createItem({ type, title, source, content }) {
  const statement = db.prepare(`
    INSERT INTO items (type, title, source, content)
    VALUES (@type, @title, @source, @content)
  `);
  const result = statement.run({ type, title, source, content });
  return getItemById(result.lastInsertRowid);
}

export function getItemById(id) {
  return db.prepare(`SELECT id, type, title, source, content, created_at FROM items WHERE id = ?`).get(id);
}

export function listItems() {
  return db.prepare(`
    SELECT
      i.id, i.type, i.title, i.source, i.created_at,
      COUNT(c.id) AS chunk_count
    FROM items i
    LEFT JOIN chunks c ON c.item_id = i.id
    GROUP BY i.id
    ORDER BY i.created_at DESC
  `).all();
}

export function createChunks(chunks) {
  const insert = db.prepare(`
    INSERT INTO chunks (item_id, chunk_index, content, embedding)
    VALUES (@itemId, @chunkIndex, @content, @embedding)
  `);

  const transaction = db.transaction((rows) => {
    for (const row of rows) insert.run(row);
  });

  transaction(chunks);
}

export function getAllChunks() {
  return db.prepare(`
    SELECT c.id, c.item_id, c.chunk_index, c.content, c.embedding,
           i.title, i.source, i.type
    FROM chunks c
    INNER JOIN items i ON i.id = c.item_id
    ORDER BY c.item_id, c.chunk_index
  `).all();
}
