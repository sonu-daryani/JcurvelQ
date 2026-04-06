# Decisions (underspecified requirements)

| Topic | Decision | Reason | Revisit if |
|-------|----------|--------|------------|
| Agent thoughts | Single `<details>` list, all `agent_thought` events in order | One place; less noise than duplicating per task | Need per-task prominence |
| Parallel tasks | Shared `parallel_group` → one bordered block, responsive grid | Shows simultaneous spawn | Very large groups |
| Partial output | `is_final: false` dashed; `true` emphasized; `quality_score` when present | Matches spec streaming vs final | Large partial history |
| Cancelled | Neutral panel, `reason` / `message`; not error styling | Spec: not a failure | Frequent cancellations |
| Dependencies | Text labels; missing spawn → “(not scheduled)”; order via topological sort | No graph; respects execution order | Need DAG view |
| Elapsed | `lastEventAt - startedAt` while replaying; `duration_ms` when complete | Mock timeline + server value when given | Live wall-clock streams |
| Theme | Light/dark toggle; `localStorage` (`agent-run-panel-theme`); default from `prefers-color-scheme`; `html.dark` + Tailwind `dark:` | Not in brief; added for readability | Remove if reviewers want spec-only surface |
| Fixture `idle` | Toolbar sets `events = []` to satisfy §10 empty state | Brief names only `run_success` / `run_error` files | Could default initial view to idle instead of a third control |
| Mock JSON | Success `run_complete.output.summary` uses the brief’s sample sentence (with `...`). Non-final `partial_output` events omit `quality_score` (brief: score only on finals). Error path uses `parallel_group: null` so parallel grouping is demonstrated only in `run_success.json` | Keeps mock aligned to spec wording and field rules | — |
