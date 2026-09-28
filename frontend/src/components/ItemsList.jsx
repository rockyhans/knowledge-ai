export default function ItemsList({ items, loading }) {
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
              className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3 transition-colors hover:border-zinc-700"
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
            </article>
          ))}
        </div>
      )}
    </section>
  );
}