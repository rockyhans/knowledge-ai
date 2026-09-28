import AddContent from './components/AddContent.jsx';
import ItemsList from './components/ItemsList.jsx';
import AskQuestion from './components/AskQuestion.jsx';
import { useItems } from './hooks/useItems.js';
import './styles.css';

export default function App() {
  const { items, loading, refresh } = useItems();

  return (
    <>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 w-11/12 max-w-7xl items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid size-7 place-items-center rounded-md bg-amber-500 text-sm font-bold text-zinc-950">
                K
              </span>

              <span className="text-sm font-semibold tracking-tight">
                Knowledge Inbox
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-3 md:px-7">
          <section className="mb-6">
            <h1 className="mb-3 font-serif text-4xl font-normal leading-tight tracking-tight md:text-4xl">
              Ask your notes anything.
            </h1>

            <p className="text-base leading-relaxed text-zinc-400">
              Save notes and pages, then ask questions in plain language. Every
              answer points back to the source it came from.
            </p>
          </section>

          <div className="grid items-start gap-5 lg:grid-cols-2">
            <AddContent onAdded={refresh} />
            <ItemsList items={items} loading={loading} onDeleted={refresh} />
          </div>
        </main>
        <AskQuestion />
      </div>
    </>
  );
}