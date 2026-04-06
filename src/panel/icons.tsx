/** Inline SVG — no icon dependency */

export function LiveDot({ live }: { live: boolean }) {
  return (
    <span className="relative flex h-2 w-2">
      {live ? (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-45 dark:bg-emerald-400" />
      ) : null}
      <span
        className={`relative inline-flex h-2 w-2 rounded-full ${
          live
            ? 'bg-emerald-600 shadow-[0_0_10px_rgba(22,163,74,0.5)] dark:bg-emerald-400 dark:shadow-[0_0_12px_rgba(52,211,153,0.55)]'
            : 'bg-zinc-400 dark:bg-zinc-500'
        }`}
      />
    </span>
  )
}
