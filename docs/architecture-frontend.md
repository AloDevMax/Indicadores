# Frontend

- **Entry**: `index.html` → `src/main.tsx` → `src/App.tsx` (HashRouter)
- **State**: Lifted to `src/App.tsx` root; passed down via props. No external state manager.
- **Bootstrap**: App fetches `/api/bootstrap` on load to hydrate badges, companies, users, and settings.
- **Auth**: JWT stored in `localStorage` as `quest_auth_token`.
- **Layout**: `src/` organized by feature. `src/features/<feature>/{pages,components}` for domain code (`auth`, `dashboard`, `badges`, `admin`, `ranking`, `settings`); `src/shared/{components,lib,api.ts,types.ts}` for reusables. `AdminPanel.tsx` (~100 KB) lives in `src/features/admin/pages/` and handles all admin workflows.
- **API calls**: All via `src/shared/api.ts` helper functions.
- **Imports**: Use the `@/` alias (mapped to `src/`) — e.g. `@/shared/types`, `@/features/badges/badgeMetrics`.
- **Routing**: Vite dev proxy forwards `/api/*` to `localhost:4004`.
