export function EmptyState() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-violet-300/60 bg-white/80 px-4 py-10 text-center shadow-sm sm:px-6 sm:py-12 dark:border-violet-800/50 dark:bg-zinc-900/60">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-600/20" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-600/15" />
      <div className="relative mx-auto max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        <p className="text-balance font-semibold text-zinc-900 dark:text-zinc-100">No run loaded</p>
        <p className="mt-2 break-words">
          Select <code className="rounded-md bg-violet-100/80 px-1.5 py-0.5 font-mono text-xs text-violet-900 dark:bg-violet-950/60 dark:text-violet-200">success</code>,{' '}
          <code className="rounded-md bg-violet-100/80 px-1.5 py-0.5 font-mono text-xs text-violet-900 dark:bg-violet-950/60 dark:text-violet-200">error</code>, or{' '}
          <code className="rounded-md bg-violet-100/80 px-1.5 py-0.5 font-mono text-xs text-violet-900 dark:bg-violet-950/60 dark:text-violet-200">idle</code>. Fixtures:{' '}
          <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">mock/fixtures/</code>
        </p>
      </div>
    </div>
  )
}
