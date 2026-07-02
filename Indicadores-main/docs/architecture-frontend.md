# Frontend

- **Entry**: `index.html` → `src/main.tsx` → `src/App.tsx` (HashRouter)
- **State**: Lifted to `src/App.tsx` root and passed down via props. No external state manager.
- **Bootstrap**: App calls `/api/bootstrap` on load to hydrate badges, companies, users, and settings; falls back to in-file `INITIAL_*` constants on failure.
- **Auth**: JWT stored in `localStorage` as `quest_auth_token`. Routes guard on `user` state — unauthenticated requests redirect to `/login`.
- **API calls**: All HTTP goes through `src/shared/api.ts` (`*WithApi` helpers + `fetchBootstrapData`, `fetchCurrentUser`).
- **Imports**: Use the `@/` alias (mapped to `src/`) — e.g. `@/shared/types`, `@/features/badges/badgeMetrics`. No relative `../` imports in the frontend.
- **Routing**: Vite dev proxy forwards `/api/*` to `localhost:4004`.

## Layout

The frontend is organized by feature under `src/`, with cross-feature code in `src/shared/`.

```
src/
├── main.tsx                 # ReactDOM root, wraps App in ErrorBoundary
├── App.tsx                  # routes, top-level state, bootstrap effect
├── index.css
├── shared/
│   ├── api.ts               # all server calls (auth, badges, admin, imports)
│   ├── types.ts             # shared domain types
│   ├── components/          # Navbar, Sidebar, BottomNav, ErrorBoundary,
│   │                        # ImageUpload, ToastContainer
│   └── lib/                 # cn (classnames), toast
└── features/
    ├── auth/pages/          # Landing, Login, Register
    ├── dashboard/pages/     # Dashboard, Overview
    ├── badges/
    │   ├── badgeMetrics.ts  # tone weights + monthly aggregation
    │   ├── components/      # BadgeCard, SolicitationModal
    │   └── pages/           # UserBadgesPage
    ├── admin/pages/         # AdminPanel (large), AwardBadges, Requests,
    │                        # Explorers, Library, CompaniesPage,
    │                        # CompanyUnitsPage
    ├── ranking/pages/       # Ranking, GlobalRanking
    └── settings/pages/      # Settings
```

**Placement rules:**
- A component used by only one feature lives under that feature (e.g. `BadgeCard`, `SolicitationModal` under `features/badges/`).
- App-shell or cross-feature components live in `shared/components/`.
- Domain logic specific to one feature lives next to it (`badgeMetrics.ts` under `features/badges/`).
- `shared/api.ts` and `shared/types.ts` are intentionally centralized; split per feature only if they become a bottleneck.

## Notable files

- **`src/App.tsx`** (~500 lines) — owns all top-level state (`badges`, `users`, `userBadges`, `submissions`, etc.), the bootstrap effect, and every `<Route>`. Most page props are threaded from here.
- **`src/features/admin/pages/AdminPanel.tsx`** (~1.8k lines) — single file covering every admin workflow (users, badges, companies, units, imports, submissions review). Strong candidate for future decomposition.
- **`src/shared/api.ts`** (~320 lines) — aggregates ~20 API helpers. Each helper wraps `fetch` with auth headers and JSON handling.

## Config touch points

- `vite.config.ts` — `@` alias resolves to `./src`; dev server on `:3000` with `/api` proxied to `:4004`.
- `tsconfig.app.json` — TS config for the client (`include: ["src/**/*"]`, `paths: { "@/*": ["./src/*"] }`). The root `tsconfig.json` covers only `server/`.
- `index.html` — loads `/src/main.tsx` and `/src/index.css`; pulls React via importmap from `esm.sh`.
