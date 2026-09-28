import { useState } from 'react';
import { api } from '../lib/api.js';

export default function ItemsList({ items, loading, onDeleted }) {
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  async function handleDelete(id) {
    // if (!window.confirm('Delete this item and its vector embeddings?')) return;
    setDeletingId(id);
    setError('');
    try {
      await api.deleteItem(id);
      if (onDeleted) await onDeleted();
    } catch (err) {
      setError(err.message || 'Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-xl backdrop-blur-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
            Library
          </p>

          <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
            Saved items
          </h2>
        </div>

        <span className="flex size-7 items-center justify-center rounded-lg bg-zinc-800 px-2 text-xs font-medium text-zinc-400">
          {items.length}
        </span>
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-red-900/50 bg-red-950/30 p-2.5 text-xs text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm leading-relaxed text-zinc-500">
          Loading...
        </p>
      ) : items.length === 0 ? (
        <p className="text-sm leading-relaxed text-zinc-500">
          No content yet. Add a note or URL to start building your knowledge
          base.
        </p>
      ) : (
        <div className="max-h-100 space-y-2 overflow-y-auto pr-1">
          {items.map((item) => (
            <article
              key={item.id}
              className="group flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3 transition-colors hover:border-zinc-700"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-sm text-indigo-400">
                {item.type === 'url' ? '↗' : '✦'}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="mb-1 truncate text-sm font-medium text-zinc-100">
                  {item.title}
                </h3>

                <p className="truncate text-xs text-zinc-500">
                  {item.source}
                </p>

                <small className="mt-1 block truncate text-xs text-zinc-600">
                  {item.chunk_count} chunk
                  {item.chunk_count === 1 ? '' : 's'} ·{' '}
                  {new Date(`${item.created_at}Z`).toLocaleString()}
                </small>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                title="Delete item"
                aria-label={`Delete ${item.title}`}
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400 active:scale-95 disabled:cursor-wait disabled:opacity-50"
              >
                {deletingId === item.id ? (
                  <span className="size-3 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                ) : (
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}