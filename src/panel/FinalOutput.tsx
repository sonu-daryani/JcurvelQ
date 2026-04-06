import type { RunModel } from '../model/runState'

export function FinalOutput({ run }: { run: RunModel }) {
  if (!run.finalOutput) return null
  const { summary, citations } = run.finalOutput

  return (
    <section className="min-w-0 rounded-2xl p-[1px] shadow-lg shadow-emerald-500/10 dark:shadow-emerald-950/40">
      <div className="rounded-2xl bg-gradient-to-br from-emerald-400/35 via-emerald-500/20 to-cyan-400/25 dark:from-emerald-600/25 dark:via-emerald-900/20 dark:to-cyan-900/20">
        <div className="m-[1px] min-w-0 rounded-[15px] border border-white/70 bg-white/95 p-3 dark:border-white/5 dark:bg-zinc-950/95 sm:p-4 md:p-5">
          <span className="inline-flex rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white shadow-sm dark:bg-emerald-500">
            Final output
          </span>
          <p className="mt-3 break-words text-base leading-relaxed text-zinc-900 dark:text-zinc-50 sm:mt-4 md:text-[17px]">
            {summary}
          </p>
          {citations.length > 0 ? (
            <ul className="mt-4 space-y-2 sm:mt-5">
              {citations.map((c) => (
                <li
                  key={c.ref_id}
                  className="flex min-w-0 flex-col gap-1 rounded-xl border border-zinc-200/90 bg-zinc-50/80 px-3 py-2 text-sm sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2 dark:border-zinc-700/80 dark:bg-zinc-900/60"
                >
                  <span className="shrink-0 font-mono text-[11px] font-semibold text-violet-600 dark:text-violet-400">
                    {c.ref_id}
                  </span>
                  <span className="min-w-0 break-words font-medium text-zinc-900 dark:text-zinc-100">{c.title}</span>
                  <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                    {c.source} · p.{c.page}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  )
}
