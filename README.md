# Agent Run Panel

A front-end-only **agent run viewer**: it replays a chronological stream of events (run lifecycle, tasks, tools, partial output, thoughts, and final result) and renders them as a live-looking panel. Data comes from **JSON fixtures** and **client-side timers**—there is no server, WebSocket, or SSE.

**Stack:** React 19 (hooks), Vite 8, TypeScript, Tailwind CSS 4 (`@tailwindcss/vite`).

---

## Prerequisites

- Node.js with npm (versions aligned with the repo’s `package-lock.json` are safest).

---

## Install and run

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

### Other scripts

| Command | Purpose |
|--------|---------|
| `npm run build` | Typecheck (`tsc -b`) and production build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint on the project |

---

## Demo controls (fixtures)

The app shell (`src/App.tsx`) exposes three modes:

| Mode | Events source | Behavior |
|------|----------------|----------|
| **success** | `mock/fixtures/run_success.json` | Full happy-path stream ending in `run_complete` |
| **error** | `mock/fixtures/run_error.json` | Stream that ends in `run_error` |
| **idle** | None (empty array) | Empty / idle panel before any run |

Changing the mode **remounts** `AgentRunPanel` with a React `key` so each replay starts from a clean state.

---

## How replay works

1. Events are **sorted by `timestamp`** (see `useEventReplay`).
2. A cursor advances one event at a time. Delay between steps is derived from the gap between consecutive timestamps, scaled and clamped (`REPLAY_MIN_MS`, `REPLAY_MAX_MS`, `REPLAY_TS_SCALE` in `src/panel/constants.ts`).
3. Each applied event updates an immutable-style **run model** via `applyEvent` in `src/model/runState.ts`.

So pacing feels “live” relative to the fixture, but remains bounded so long gaps do not freeze the UI.

---

## Event schema

Typed in `src/types/events.ts`. Summary:

- **`run_started`** — run id, user query, clock
- **`agent_thought`** — optional `task_id`, free-text thought
- **`task_spawned`** — task metadata (`parallel_group`, `depends_on`, etc.)
- **`tool_call` / `tool_result`** — tool name and summaries
- **`partial_output`** — streaming chunks per task (`is_final`, optional `quality_score`)
- **`task_update`** — task status transitions (`pending` → `running` → `complete` / `failed` / `cancelled`, with error/reason/message fields when relevant)
- **`run_complete`** — final summary, citations, duration metadata
- **`run_error`** — run-level failure message

The union type is `StreamEvent`.

---

## UI structure

Main pieces under `src/panel/`:

- **`AgentRunPanel`** — layout container; wires replay hook to children
- **`RunHeader`** — run title, status, timing
- **`TaskList` / `TaskCard`** — ordered tasks, parallel grouping, tool calls, partial output, status styling
- **`AgentThoughts`** — thought stream
- **`FinalOutput`** — completed run summary and citations (when present)
- **`EmptyState`** — when there is no active run content yet

Icons and small visuals live in `src/panel/icons.tsx`; shared panel exports in `src/panel/index.ts`.

---

## Theme (light / dark)

- Header control toggles **light** and **dark**.
- Preference is stored in `localStorage` under `agent-run-panel-theme` (`light` | `dark`).
- If nothing is stored, the initial mode follows **`prefers-color-scheme`** (`resolveTheme` in `src/theme/theme.ts`).
- `src/main.tsx` applies the theme class on `document.documentElement` **before** React mounts to reduce flash of the wrong theme.
- Tailwind `dark:` variants target the `html.dark` class via `@custom-variant dark` in `src/index.css`.

---

## Project layout

| Path | Role |
|------|------|
| `src/types/events.ts` | Event and status types |
| `src/model/runState.ts` | `RunModel`, `TaskModel`, `createInitialRunState`, `applyEvent` |
| `src/lib/runHelpers.ts` | Elapsed time formatting, task ordering, parallel sections |
| `src/panel/useEventReplay.ts` | Sorted stream + timed replay → `RunModel` |
| `src/theme/` | Theme resolution, toggle, icons |
| `mock/fixtures/*.json` | Example event streams |

---

