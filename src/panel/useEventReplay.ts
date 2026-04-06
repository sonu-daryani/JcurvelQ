import { useEffect, useMemo, useState } from 'react'
import type { StreamEvent } from '../types/events'
import { applyEvent, createInitialRunState, type RunModel } from '../model/runState'
import { REPLAY_MAX_MS, REPLAY_MIN_MS, REPLAY_TS_SCALE } from './constants'

function stepDelay(prevTs: number, nextTs: number): number {
  const raw = (nextTs - prevTs) * REPLAY_TS_SCALE
  return Math.min(REPLAY_MAX_MS, Math.max(REPLAY_MIN_MS, raw))
}

export function useEventReplay(events: StreamEvent[]): RunModel {
  const sorted = useMemo(
    () => [...events].sort((a, b) => a.timestamp - b.timestamp),
    [events],
  )
  const [cursor, setCursor] = useState(0)

  const run = useMemo(() => {
    let s = createInitialRunState()
    for (let i = 0; i < cursor; i++) s = applyEvent(s, sorted[i])
    return s
  }, [cursor, sorted])

  useEffect(() => {
    if (sorted.length === 0 || cursor >= sorted.length) return
    const prevTs = cursor === 0 ? sorted[0].timestamp : sorted[cursor - 1].timestamp
    const t = window.setTimeout(
      () => setCursor((c) => c + 1),
      stepDelay(prevTs, sorted[cursor].timestamp),
    )
    return () => window.clearTimeout(t)
  }, [cursor, sorted])

  return run
}
