import type { TaskModel } from '../model/runState'
import { orderedTaskIds, taskSections, type TaskSection } from '../lib/runHelpers'
import { TaskCard } from './TaskCard'

function ParallelGroup({
  groupKey,
  taskIds,
  tasks,
}: {
  groupKey: string
  taskIds: string[]
  tasks: Record<string, TaskModel>
}) {
  return (
    <section className="min-w-0 rounded-2xl p-[1px] shadow-md shadow-violet-500/5 dark:shadow-violet-950/30">
      <div className="rounded-2xl bg-gradient-to-br from-cyan-400/25 via-violet-400/20 to-violet-500/25 dark:from-cyan-500/20 dark:via-violet-600/15 dark:to-violet-900/25">
        <div className="m-[1px] min-w-0 rounded-[15px] border border-white/60 bg-white/95 p-2 sm:p-3 dark:border-white/5 dark:bg-zinc-950/90">
          <div className="mb-2 flex min-w-0 flex-wrap items-center gap-2 sm:mb-3">
            <span className="shrink-0 rounded-md bg-cyan-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-200">
              Parallel
            </span>
            <span className="min-w-0 break-all font-mono text-xs font-medium text-violet-800 dark:text-violet-200">
              {groupKey}
            </span>
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {taskIds.map((id) => {
              const t = tasks[id]
              return t ? (
                <div key={id} className="min-w-0">
                  <TaskCard task={t} tasks={tasks} />
                </div>
              ) : null
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function Section({ s, tasks }: { s: TaskSection; tasks: Record<string, TaskModel> }) {
  if (s.kind === 'single') {
    const t = tasks[s.taskId]
    return t ? (
      <div className="min-w-0">
        <TaskCard task={t} tasks={tasks} />
      </div>
    ) : null
  }
  return <ParallelGroup groupKey={s.groupKey} taskIds={s.taskIds} tasks={tasks} />
}

export function TaskList({ tasks, taskOrder }: { tasks: Record<string, TaskModel>; taskOrder: string[] }) {
  const ordered = orderedTaskIds(taskOrder, tasks)
  const sections = taskSections(ordered, tasks)

  return (
    <div className="min-w-0 space-y-4">
      {sections.map((s, i) => (
        <Section
          key={s.kind === 'single' ? s.taskId : `${s.groupKey}-${s.taskIds.join()}-${i}`}
          s={s}
          tasks={tasks}
        />
      ))}
    </div>
  )
}
