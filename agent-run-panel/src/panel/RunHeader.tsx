import type { RunModel } from '../model/runState'
import { formatElapsed } from '../lib/runHelpers'
import { LiveDot } from './icons'

const label: Record<RunModel['status'], string> = {
  idle: 'Idle',
  running: 'Running',
  complete: 'Complete',
  failed: 'Failed',
}

const badge: Record<RunModel['status'], string> = {
  idle: 'bg-zinc-200/90 text-zinc-700 ring-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-600',
  running:
    'bg-amber-100 text-amber-900 ring-amber-300/80 shadow-sm shadow-amber-500/10 dark:bg-amber-950/60 dark:text-amber-100 dark:ring-amber-600/50 dark:shadow-amber-900/20',
  complete:
    'bg-emerald-100 text-emerald-900 ring-emerald-300/70 dark:bg-emerald-950/50 dark:text-emerald-100 dark:ring-emerald-700/40',
  failed:
    'bg-rose-100 text-rose-900 ring-rose-300/70 dark:bg-rose-950/50 dark:text-rose-100 dark:ring-rose-800/40',
}

export function RunHeader({ run }: { run: RunModel }) {
  if (run.status === 'idle') return null

  const live = run.status === 'running'

  return (
    <div className="agent-frame">
      <header className="agent-frame-inner p-4 md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <LiveDot live={live} />
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ring-1 ${badge[run.status]}`}
              >
                {label[run.status]}
              </span>
              {run.runId ? (
                <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] text-violet-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-violet-300">
                  {run.runId}
                </span>
              ) : null}
              <span className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 font-mono text-[11px] tabular-nums text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                <span className="text-zinc-500 dark:text-zinc-500">Elapsed </span>
                {formatElapsed(run)}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600/90 dark:text-violet-400/90">
                Query
              </p>
              <p className="mt-1.5 text-base font-semibold leading-snug tracking-tight text-zinc-900 dark:text-zinc-50 md:text-lg">
                {run.query}
              </p>
            </div>
          </div>
        </div>
        {run.status === 'failed' && run.errorMessage ? (
          <div className="mt-4 rounded-xl border border-rose-200/90 bg-rose-50/90 px-3 py-2.5 dark:border-rose-900/50 dark:bg-rose-950/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Run error</p>
            <p className="mt-1 font-mono text-xs leading-relaxed text-rose-900 dark:text-rose-100">{run.errorMessage}</p>
          </div>
        ) : null}
      </header>
    </div>
  )
}
