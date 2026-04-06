import type { StreamEvent } from '../types/events'
import { useEventReplay } from './useEventReplay'
import { RunHeader } from './RunHeader'
import { AgentThoughts } from './AgentThoughts'
import { TaskList } from './TaskList'
import { FinalOutput } from './FinalOutput'
import { EmptyState } from './EmptyState'

const mainPad = 'mx-auto w-full min-w-0 max-w-4xl px-3 py-8 sm:px-4 sm:py-8 md:px-5'

export function AgentRunPanel({ events }: { events: StreamEvent[] }) {
  const run = useEventReplay(events)

  if (events.length === 0) {
    return (
      <div className={`${mainPad} pb-10`}>
        <EmptyState />
      </div>
    )
  }

  return (
    <div className={`${mainPad} flex flex-col gap-4 sm:gap-5`}>
      <RunHeader run={run} />
      {run.thoughts.length > 0 ? <AgentThoughts items={run.thoughts} /> : null}
      {Object.keys(run.tasks).length > 0 ? (
        <TaskList tasks={run.tasks} taskOrder={run.taskOrder} />
      ) : run.status === 'running' ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-violet-300/50 bg-violet-50/40 px-3 py-10 text-sm text-zinc-600 dark:border-violet-800/40 dark:bg-violet-950/20 dark:text-zinc-400 sm:py-12">
          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-violet-500 dark:bg-violet-400" />
          <span className="text-center">Waiting for tasks…</span>
        </div>
      ) : null}
      {run.finalOutput ? <FinalOutput run={run} /> : null}
    </div>
  )
}
