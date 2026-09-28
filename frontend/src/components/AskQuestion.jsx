import { useState } from 'react';
import { api } from '../lib/api.js';

export default function AskQuestion() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError('');

    try {
      setResult(await api.query(question));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 active:scale-95"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-zinc-950/10 text-base">
          ✦
        </span>
        Ask your notes
      </button>
    );
  }

  return (
    <aside className="fixed inset-0 z-50 flex animate-[panelIn_.2s_ease-out] flex-col overflow-hidden bg-zinc-950 text-zinc-100 shadow-2xl lg:inset-y-5 lg:left-auto lg:right-5 lg:w-96 lg:rounded-2xl lg:border lg:border-zinc-800">
      <header className="shrink-0 border-b border-zinc-800 bg-zinc-950 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg tracking-wide text-zinc-100">
              Knowledge Assistant
            </h2>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto bg-zinc-950 p-5">
        {!result && !loading && !error && (
          <div className="w-fit max-w-[85%] rounded-xl rounded-tl-sm border border-zinc-800 border-l-4 border-l-amber-500 bg-zinc-900 px-4 py-3 text-sm text-zinc-300">
            Ask a question and I'll answer using only what you've saved.
          </div>
        )}

        {loading && (
          <div className="flex w-fit items-center gap-1.5 rounded-xl rounded-tl-sm border border-zinc-800 bg-zinc-900 px-4 py-3">
            <span className="size-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.3s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.15s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-zinc-500" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-5">
            <div className="w-fit max-w-[90%] rounded-xl rounded-tl-sm border border-zinc-800 bg-zinc-900 p-4 text-sm leading-relaxed text-zinc-200 whitespace-pre-wrap">
              {result.answer}
            </div>

            {result.sources?.length > 0 && (
              <div>
                <h4 className="mb-2.5 px-1 text-xs font-medium text-zinc-500">
                  Sources
                </h4>
                <div className="grid gap-2">
                  {result.sources.map((source, index) => (
                    <article
                      key={source.id}
                      className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 transition hover:border-zinc-700"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <strong className="truncate text-xs font-medium text-zinc-200">
                          [{index + 1}] {source.title}
                        </strong>
                        <span className="shrink-0 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[11px] font-medium text-amber-400">
                          {source.score}
                        </span>
                      </div>

                      <p className="my-2 line-clamp-3 text-xs leading-relaxed text-zinc-500">
                        {source.content}
                      </p>

                      {source.type === 'url' && (

                        <a href={source.source}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-amber-500 hover:underline"
                        >
                          Open source ↗
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 gap-2 border-t border-zinc-800 bg-zinc-950 p-3"
      >
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          maxLength={2000}
          className="h-12 flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-lg text-zinc-950 transition hover:bg-amber-400 disabled:cursor-wait disabled:opacity-50"
        >
          ➤
        </button>
      </form>

      <button
        type="button"
        onClick={() => setOpen(false)}
        className="flex shrink-0 items-center justify-center gap-2 border-t border-zinc-800 bg-zinc-900 py-3 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
      >
        Close
      </button>
    </aside >
  );
}