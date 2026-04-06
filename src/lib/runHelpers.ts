import type { RunModel, TaskModel } from '../model/runState'

export function formatElapsed(run: RunModel): string {
  if (run.status === 'idle' || !run.startedAt) return '—'
  const ms =
    run.status === 'complete' && run.serverDurationMs != null
      ? run.serverDurationMs
      : run.lastEventAt != null
        ? run.lastEventAt - run.startedAt
        : 0
  if (ms < 1000) return `${ms} ms`
  const s = ms / 1000
  return s >= 60 ? `${Math.floor(s / 60)}m ${Math.round(s % 60)}s` : `${s.toFixed(1)}s`
}

export type TaskSection =
  | { kind: 'single'; taskId: string }
  | { kind: 'parallel'; groupKey: string; taskIds: string[] }

/** Dependencies before dependents (no graph UI). */
export function orderedTaskIds(taskOrder: string[], tasks: Record<string, TaskModel>): string[] {
  const ids = [...new Set(taskOrder)]
  const visited = new Set<string>()
  const out: string[] = []

  function visit(id: string) {
    if (visited.has(id)) return
    const t = tasks[id]
    if (!t) return
    for (const d of t.depends_on) {
      if (tasks[d]) visit(d)
    }
    visited.add(id)
    out.push(id)
  }
  for (const id of ids) visit(id)
  return out
}

export function taskSections(orderedIds: string[], tasks: Record<string, TaskModel>): TaskSection[] {
  const sections: TaskSection[] = []
  let i = 0
  while (i < orderedIds.length) {
    const id = orderedIds[i]
    const g = tasks[id]?.parallel_group
    if (g) {
      const batch: string[] = []
      while (i < orderedIds.length && tasks[orderedIds[i]]?.parallel_group === g) {
        batch.push(orderedIds[i])
        i += 1
      }
      sections.push({ kind: 'parallel', groupKey: g, taskIds: batch })
    } else {
      sections.push({ kind: 'single', taskId: id })
      i += 1
    }
  }
  return sections
}

export function depLabel(depId: string, tasks: Record<string, TaskModel>): string {
  const t = tasks[depId]
  return t ? t.label : `${depId} (not scheduled)`
}
