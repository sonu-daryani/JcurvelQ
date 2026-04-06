import type { RunThought } from '../model/runState'

export function AgentThoughts({ items }: { items: RunThought[] }) {
  if (items.length === 0) return null

  return (
    <details className="group rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50/80 via-white to-cyan-50/40 text-left shadow-sm dark:border-violet-900/40 dark:from-violet-950/30 dark:via-zinc-900/80 dark:to-cyan-950/20 dark:shadow-none">
      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-zinc-800 marker:hidden dark:text-zinc-200 [&::-webkit-details-marker]:hidden">
        Agent thoughts ({items.length})
      </summary>
      <ul className="space-y-2 border-t border-violet-200/40 px-4 py-3 dark:border-violet-900/30">
        {items.map((th, i) => (
          <li
            key={`${th.timestamp}-${i}`}
            className="rounded-xl border border-zinc-200/80 bg-white/90 px-3 py-2.5 text-sm shadow-sm dark:border-zinc-700/80 dark:bg-zinc-950/80 dark:shadow-none"
          >
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              {th.task_id ?? 'system'}
            </span>
            <p className="mt-1 leading-relaxed text-zinc-700 dark:text-zinc-300">{th.thought}</p>
          </li>
        ))}
      </ul>
    </details>
  )
}
