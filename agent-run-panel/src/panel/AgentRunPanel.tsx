import type { StreamEvent } from '../types/events'
import { useEventReplay } from './useEventReplay'
import { RunHeader } from './RunHeader'
import { AgentThoughts } from './AgentThoughts'
import { TaskList } from './TaskList'
import { FinalOutput } from './FinalOutput'
import { EmptyState } from './EmptyState'

export function AgentRunPanel({ events }: { events: StreamEvent[] }) {
  const run = useEventReplay(events)

  if (events.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5 px-4 py-8">
      <RunHeader run={run} />
      {run.thoughts.length > 0 ? <AgentThoughts items={run.thoughts} /> : null}
      {Object.keys(run.tasks).length > 0 ? (
        <TaskList tasks={run.tasks} taskOrder={run.taskOrder} />
      ) : run.status === 'running' ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-violet-300/50 bg-violet-50/40 py-12 text-sm text-zinc-600 dark:border-violet-800/40 dark:bg-violet-950/20 dark:text-zinc-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-violet-500 dark:bg-violet-400" />
          Waiting for tasks…
        </div>
      ) : null}
      {run.finalOutput ? <FinalOutput run={run} /> : null}
    </div>
  )
}
