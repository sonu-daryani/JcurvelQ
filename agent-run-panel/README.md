# Agent Run Panel

React (hooks), Vite, Tailwind. Mock timed event stream from JSON fixtures — no backend.

## Setup

```bash
npm install
npm run dev
```

## Fixtures

The brief requires `run_success.json` and `run_error.json`. In the UI:

| Control | Source |
|--------|--------|
| `success` | `mock/fixtures/run_success.json` |
| `error` | `mock/fixtures/run_error.json` |
| `idle` | No events — covers **§10 empty / idle state** (not a third JSON file) |

Switching fixture remounts the panel (`key` on `AgentRunPanel`) so replay starts clean.

## Theme

Header **sun / moon** toggles light and dark. Preference is stored in `localStorage` under `agent-run-panel-theme` (`light` | `dark`). If unset, `prefers-color-scheme` is used. `main.tsx` applies the class on `document.documentElement` before React mounts to limit flash.

Tailwind `dark:` variants are enabled via `@custom-variant dark` on the `html.dark` class (`src/index.css`).

## Layout

- `src/types/events.ts` — event shapes  
- `src/model/runState.ts` — `applyEvent`, run/task state  
- `src/lib/runHelpers.ts` — elapsed string, task ordering / parallel sections  
- `src/panel/` — replay hook, UI (`AgentRunPanel`, header, tasks, final output)  
- `src/theme/` — theme helper, toggle, icons  
- `mock/fixtures/` — JSON streams  

## Known gaps

Static JSON + client-side delays, not WebSocket/SSE. Tool results match the latest open call for the same `tool` on the same task.

## Submission (brief)

**Hardest part:** Correct task UI across parallel updates, `failed → running` retries, and `cancelled` without treating it as failure.

**Schema:** Add `event_id` and per-invocation `call_id` on tool events for unambiguous pairing.
