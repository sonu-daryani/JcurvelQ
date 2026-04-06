import type { ReactNode } from 'react'
import type { TaskModel } from '../model/runState'
import { depLabel } from '../lib/runHelpers'

function statusAccent(s: TaskModel['status']) {
  switch (s) {
    case 'running':
      return 'border-l-amber-500 shadow-[0_0_20px_-6px_rgba(245,158,11,0.35)] dark:border-l-amber-400 dark:shadow-[0_0_24px_-8px_rgba(251,191,36,0.25)]'
    case 'complete':
      return 'border-l-emerald-500 dark:border-l-emerald-400'
    case 'failed':
      return 'border-l-rose-500 dark:border-l-rose-400'
    case 'cancelled':
      return 'border-l-sky-500 dark:border-l-sky-400'
    default:
      return 'border-l-zinc-400 dark:border-l-zinc-600'
  }
}

function statusPill(s: TaskModel['status']) {
  switch (s) {
    case 'running':
      return 'bg-amber-100 text-amber-900 ring-amber-200 dark:bg-amber-950/55 dark:text-amber-100 dark:ring-amber-700/50'
    case 'complete':
      return 'bg-emerald-100 text-emerald-900 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-100 dark:ring-emerald-800/40'
    case 'failed':
      return 'bg-rose-100 text-rose-900 ring-rose-200 dark:bg-rose-950/50 dark:text-rose-100 dark:ring-rose-800/40'
    case 'cancelled':
      return 'bg-sky-100 text-sky-900 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-100 dark:ring-sky-800/35'
    default:
      return 'bg-zinc-200 text-zinc-800 ring-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-600'
  }
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">{children}</p>
  )
}

export function TaskCard({ task, tasks }: { task: TaskModel; tasks: Record<string, TaskModel> }) {
  const mid = task.outputs.filter((o) => !o.is_final)
  const fin = task.outputs.filter((o) => o.is_final)

  return (
    <article
      className={`rounded-xl border border-zinc-200/90 border-l-[3px] bg-white/95 p-3 shadow-sm ring-1 ring-black/[0.02] dark:border-zinc-800 dark:bg-zinc-900/90 dark:ring-white/[0.04] ${statusAccent(task.status)}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{task.label}</h3>
          <p className="mt-1 inline-flex rounded-md border border-violet-200/80 bg-violet-50/80 px-2 py-0.5 font-mono text-[11px] text-violet-800 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-200">
            {task.agent}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${statusPill(task.status)}`}
        >
          {task.status}
        </span>
      </div>

      {task.depends_on.length > 0 ? (
        <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">Depends on </span>
          {task.depends_on.map((id, i) => (
            <span key={id}>
              {i > 0 ? <span className="text-zinc-400"> · </span> : null}
              <span className={tasks[id] ? 'text-zinc-800 dark:text-zinc-200' : 'italic text-amber-700 dark:text-amber-300'}>
                {depLabel(id, tasks)}
              </span>
            </span>
          ))}
        </p>
      ) : null}

      {task.retryCount > 0 ? (
        <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200/90 bg-amber-50/90 px-2.5 py-2 text-xs text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/25 dark:text-amber-100">
          <span className="font-mono text-amber-600 dark:text-amber-400">↻</span>
          <span>Retried after failure ({task.retryCount}×)</span>
        </div>
      ) : null}

      {task.status === 'cancelled' ? (
        <div className="mt-2 rounded-lg border border-sky-200/90 bg-sky-50/90 px-2.5 py-2 text-sm text-sky-950 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-50">
          <p className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">Cancelled</p>
          {task.cancel_reason ? <p className="mt-1 font-mono text-[11px] text-sky-800/90 dark:text-sky-200/80">{task.cancel_reason}</p> : null}
          {task.cancel_message ? <p className="mt-1.5 leading-relaxed">{task.cancel_message}</p> : null}
        </div>
      ) : null}

      {task.status === 'failed' && task.error ? (
        <div className="mt-2 rounded-lg border border-rose-200/90 bg-rose-50/90 px-2.5 py-2 dark:border-rose-900/45 dark:bg-rose-950/35">
          <p className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">Failed</p>
          <p className="mt-1 font-mono text-xs leading-relaxed text-rose-900 dark:text-rose-100">{task.error}</p>
        </div>
      ) : null}

      {task.toolCalls.length > 0 ? (
        <div className="mt-3">
          <SectionLabel>Tool calls</SectionLabel>
          <ul className="space-y-2">
            {task.toolCalls.map((c, i) => (
              <li
                key={`${c.tool}-${c.timestamp}-${i}`}
                className="rounded-lg border border-zinc-200/80 bg-zinc-50/90 p-2.5 font-mono text-[11px] leading-snug dark:border-zinc-700/80 dark:bg-black/35"
              >
                <div className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100">
                  <span className="select-none text-violet-500 dark:text-violet-400">›</span>
                  <span className="font-semibold">{c.tool}</span>
                </div>
                <div className="mt-1 pl-4 text-zinc-600 dark:text-zinc-400">
                  <span className="text-zinc-400 dark:text-zinc-500">in</span> {c.input_summary}
                </div>
                {c.output_summary ? (
                  <div className="mt-1 pl-4 text-emerald-700 dark:text-emerald-300">
                    <span className="text-zinc-400 dark:text-zinc-500">out</span> {c.output_summary}
                  </div>
                ) : (
                  <div className="mt-1 pl-4 italic text-amber-600 dark:text-amber-400/90">awaiting…</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {mid.length > 0 ? (
        <div className="mt-3">
          <SectionLabel>Partial output</SectionLabel>
          <ul className="space-y-1.5">
            {mid.map((o, i) => (
              <li
                key={`${o.timestamp}-${i}`}
                className="rounded-lg border border-dashed border-zinc-300/90 bg-zinc-50/50 px-2.5 py-2 text-sm leading-relaxed text-zinc-800 dark:border-zinc-600 dark:bg-zinc-950/40 dark:text-zinc-200"
              >
                {o.content}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {fin.length > 0 ? (
        <div className="mt-3">
          <SectionLabel>Output</SectionLabel>
          <ul className="space-y-1.5">
            {fin.map((o, i) => (
              <li
                key={`f-${o.timestamp}-${i}`}
                className="rounded-lg border border-emerald-200/90 bg-emerald-50/90 px-2.5 py-2 text-sm leading-relaxed text-emerald-950 dark:border-emerald-900/45 dark:bg-emerald-950/30 dark:text-emerald-50"
              >
                {o.content}
                {o.quality_score != null ? (
                  <span className="mt-2 block border-t border-emerald-200/60 pt-2 font-mono text-[10px] text-emerald-800 dark:border-emerald-800/40 dark:text-emerald-300/90">
                    quality_score: {o.quality_score}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  )
}
