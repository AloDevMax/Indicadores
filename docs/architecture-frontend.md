# Frontend

- **Entry**: `index.html` → `index.tsx` → `App.tsx` (HashRouter)
- **State**: Lifted to `App.tsx` root; passed down via props. No external state manager.
- **Bootstrap**: App fetches `/api/bootstrap` on load to hydrate badges, companies, users, and settings.
- **Auth**: JWT stored in `localStorage` as `quest_auth_token`.
- **Pages** (`/pages/`): 16 pages. `AdminPanel.tsx` is the largest (~124 KB) and handles all admin workflows.
- **API calls**: All via `/utils/api.ts` helper functions.
- **Routing**: Vite dev proxy forwards `/api/*` to `localhost:4004`.
