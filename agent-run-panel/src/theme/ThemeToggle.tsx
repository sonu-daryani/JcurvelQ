import type { ThemeMode } from './theme'
import { MoonIcon, SunIcon } from './themeIcons'

export function ThemeToggle({
  theme,
  onChange,
}: {
  theme: ThemeMode
  onChange: (t: ThemeMode) => void
}) {
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={() => onChange(isDark ? 'light' : 'dark')}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200/90 bg-white/80 text-zinc-700 shadow-sm ring-violet-500/0 transition hover:ring-2 hover:ring-violet-500/15 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-200 dark:hover:ring-violet-400/20"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light theme' : 'Dark theme'}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
