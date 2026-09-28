import { useState } from 'react';
import { api } from '../lib/api.js';

export default function AddContent({ onAdded }) {
  const [mode, setMode] = useState('note');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'note') {
        await api.ingestNote({ title, content });
      } else {
        await api.ingestUrl({ title, url });
      }

      setTitle('');
      setContent('');
      setUrl('');
      await onAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-xl backdrop-blur-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
            Knowledge source
          </p>

          <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
            Add content
          </h2>
        </div>

        <div className="flex rounded-lg border border-zinc-800 bg-zinc-950 p-1">
          <button
            type="button"
            onClick={() => setMode('note')}
            className={`rounded-md px-5 py-2 text-xs font-medium transition ${mode === 'note'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
              }`}
          >
            Note
          </button>

          <button
            type="button"
            onClick={() => setMode('url')}
            className={`rounded-md px-5 py-2 text-xs font-medium transition ${mode === 'url'
              ? 'bg-zinc-800 text-white shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
              }`}
          >
            URL
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          maxLength={200}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        />

        {mode === 'note' ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste a note, documentation, product detail, or any useful text..."
            rows={8}
            required
            className="w-full resize-y rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm leading-relaxed text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        ) : (
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            type="url"
            required
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        )}

        {error && (
          <p className="text-xs text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-zinc-100 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-white active:scale-[0.99] disabled:cursor-wait disabled:opacity-50"
        >
          {loading
            ? 'Processing...'
            : mode === 'note'
              ? 'Save & index note'
              : 'Fetch & index URL'}
        </button>
      </form>
    </section>
  );
}