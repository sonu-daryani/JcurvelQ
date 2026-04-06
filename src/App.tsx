import { useEffect, useMemo, useState } from 'react'
import type { StreamEvent } from './types/events'
import { AgentRunPanel } from './panel'
import { THEME_STORAGE_KEY, type ThemeMode, applyThemeToDocument, resolveTheme } from './theme/theme'
import { ThemeToggle } from './theme/ThemeToggle'
import successFixture from '../mock/fixtures/run_success.json'
import errorFixture from '../mock/fixtures/run_error.json'

type Fixture = 'success' | 'error' | 'idle'

const success = successFixture as StreamEvent[]
const error = errorFixture as StreamEvent[]

export default function App() {
  const [fixture, setFixture] = useState<Fixture>('success')
  const [theme, setTheme] = useState<ThemeMode>(resolveTheme)

  useEffect(() => {
    applyThemeToDocument(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const events = useMemo(() => {
    if (fixture === 'success') return success
    if (fixture === 'error') return error
    return [] as StreamEvent[]
  }, [fixture])

  return (
    <div className="agent-shell">
      <header className="agent-header-glass sticky top-0 z-10">
        <div className="mx-auto flex w-full min-w-0 max-w-4xl flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3">
          <h1 className="min-w-0 shrink-0 text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
            Agent Run Panel
          </h1>
          <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap sm:justify-end">
            <div className="flex min-w-0 flex-1 justify-stretch rounded-xl border border-zinc-200/80 bg-white/60 p-0.5 shadow-sm sm:flex-none dark:border-zinc-700/80 dark:bg-zinc-900/60">
              {(['success', 'error', 'idle'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFixture(key)}
                  className={`min-h-10 min-w-0 flex-1 rounded-lg px-2 py-2 text-xs font-medium transition-all sm:min-h-9 sm:flex-none sm:px-2.5 sm:py-1.5 ${
                    fixture === key
                      ? 'bg-gradient-to-b from-violet-600 to-violet-700 text-white shadow-md shadow-violet-500/25 dark:from-violet-500 dark:to-violet-600 dark:shadow-violet-900/40'
                      : 'text-zinc-600 hover:bg-zinc-100/80 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/80 dark:hover:text-zinc-100'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
            <div className="shrink-0">
              <ThemeToggle theme={theme} onChange={setTheme} />
            </div>
          </div>
        </div>
      </header>
      <AgentRunPanel key={fixture} events={events} />
    </div>
  )
}
