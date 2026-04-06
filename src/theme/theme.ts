export const THEME_STORAGE_KEY = 'agent-run-panel-theme'

export type ThemeMode = 'light' | 'dark'

export function resolveTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyThemeToDocument(mode: ThemeMode) {
  document.documentElement.classList.toggle('dark', mode === 'dark')
}
