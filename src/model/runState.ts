import type { RunStatus, StreamEvent, TaskStatus, ToolResultEvent } from '../types/events'

export interface ToolCallRecord {
  tool: string
  input_summary: string
  output_summary?: string
  timestamp: number
  completedAt?: number
}

export interface OutputChunk {
  content: string
  is_final: boolean
  quality_score?: number | null
  timestamp: number
}

export interface TaskModel {
  id: string
  label: string
  agent: string
  spawned_by: string
  parallel_group: string | null
  depends_on: string[]
  status: TaskStatus
  error: string | null
  cancel_reason: string | null
  cancel_message: string | null
  toolCalls: ToolCallRecord[]
  outputs: OutputChunk[]
  retryCount: number
  spawnedAt: number
}

export interface RunThought {
  task_id: string | null
  thought: string
  timestamp: number
}

export interface RunModel {
  runId: string | null
  query: string | null
  status: RunStatus
  startedAt: number | null
  endedAt: number | null
  lastEventAt: number | null
  serverDurationMs: number | null
  errorMessage: string | null
  finalOutput: {
    summary: string
    citations: { ref_id: string; title: string; source: string; page: number }[]
  } | null
  tasks: Record<string, TaskModel>
  taskOrder: string[]
  thoughts: RunThought[]
}

function emptyRun(): RunModel {
  return {
    runId: null,
    query: null,
    status: 'idle',
    startedAt: null,
    endedAt: null,
    lastEventAt: null,
    serverDurationMs: null,
    errorMessage: null,
    finalOutput: null,
    tasks: {},
    taskOrder: [],
    thoughts: [],
  }
}

function ensureTask(state: RunModel, taskId: string, defaults?: Partial<TaskModel>): TaskModel {
  if (!state.tasks[taskId]) {
    state.tasks[taskId] = {
      id: taskId,
      label: defaults?.label ?? taskId,
      agent: defaults?.agent ?? 'unknown',
      spawned_by: defaults?.spawned_by ?? 'coordinator',
      parallel_group: defaults?.parallel_group ?? null,
      depends_on: defaults?.depends_on ?? [],
      status: 'pending',
      error: null,
      cancel_reason: null,
      cancel_message: null,
      toolCalls: [],
      outputs: [],
      retryCount: 0,
      spawnedAt: defaults?.spawnedAt ?? Date.now(),
    }
    if (!state.taskOrder.includes(taskId)) state.taskOrder.push(taskId)
  }
  return state.tasks[taskId]
}

function pairToolResult(state: RunModel, e: ToolResultEvent) {
  const task = ensureTask(state, e.task_id)
  const pending = [...task.toolCalls]
    .reverse()
    .find((c) => c.tool === e.tool && c.output_summary === undefined)
  if (pending) {
    pending.output_summary = e.output_summary
    pending.completedAt = e.timestamp
  } else {
    task.toolCalls.push({
      tool: e.tool,
      input_summary: '—',
      output_summary: e.output_summary,
      timestamp: e.timestamp,
      completedAt: e.timestamp,
    })
  }
}

export function applyEvent(state: RunModel, event: StreamEvent): RunModel {
  const next: RunModel = {
    ...state,
    tasks: { ...state.tasks },
    taskOrder: [...state.taskOrder],
    thoughts: [...state.thoughts],
  }

  const bumpTime = () => {
    next.lastEventAt = event.timestamp
  }

  switch (event.type) {
    case 'run_started':
      return {
        ...emptyRun(),
        runId: event.run_id,
        query: event.query,
        status: 'running',
        startedAt: event.timestamp,
        lastEventAt: event.timestamp,
      }

    case 'agent_thought':
      bumpTime()
      next.thoughts.push({
        task_id: event.task_id,
        thought: event.thought,
        timestamp: event.timestamp,
      })
      return next

    case 'task_spawned': {
      bumpTime()
      const t = ensureTask(next, event.task_id, {
        label: event.label,
        agent: event.agent,
        spawned_by: event.spawned_by,
        parallel_group: event.parallel_group,
        depends_on: event.depends_on,
        spawnedAt: event.timestamp,
      })
      Object.assign(t, {
        label: event.label,
        agent: event.agent,
        spawned_by: event.spawned_by,
        parallel_group: event.parallel_group,
        depends_on: event.depends_on,
        status: 'running' as const,
        spawnedAt: event.timestamp,
      })
      return next
    }

    case 'tool_call': {
      bumpTime()
      const t = ensureTask(next, event.task_id)
      t.toolCalls.push({
        tool: event.tool,
        input_summary: event.input_summary,
        timestamp: event.timestamp,
      })
      return next
    }

    case 'tool_result':
      bumpTime()
      pairToolResult(next, event)
      return next

    case 'partial_output': {
      bumpTime()
      const t = ensureTask(next, event.task_id)
      t.outputs.push({
        content: event.content,
        is_final: event.is_final,
        quality_score: event.quality_score,
        timestamp: event.timestamp,
      })
      return next
    }

    case 'task_update': {
      bumpTime()
      const t = ensureTask(next, event.task_id)
      if (t.status === 'failed' && event.status === 'running') t.retryCount += 1
      t.status = event.status
      t.error = event.error
      if (event.status === 'cancelled') {
        t.cancel_reason = event.reason
        t.cancel_message = event.message
      }
      return next
    }

    case 'run_complete':
      bumpTime()
      next.status = 'complete'
      next.endedAt = event.timestamp
      next.serverDurationMs = event.duration_ms
      next.finalOutput = event.output
      return next

    case 'run_error':
      bumpTime()
      next.status = 'failed'
      next.endedAt = event.timestamp
      next.errorMessage = event.message
      return next

    default:
      return state
  }
}

export function createInitialRunState(): RunModel {
  return emptyRun()
}
