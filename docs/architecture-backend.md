# Backend

- **Entry**: `/server/index.mjs` — Express app on `PORT` env var (default 4004). Serves static frontend in production.
- **Module system**: ES modules (`.mjs` files) throughout the server.
- **Layers**:
  - `server/auth/` — login, register, logout, session validation, password hashing
  - `server/admin/` — CRUD for badges, companies, productive units, users, bulk invites, import sources
  - `server/operations/` — badge award logic, badge submissions (create/review), notifications
  - `server/db/` — PostgreSQL client, schema.sql, bootstrap loader
  - `server/data/` — in-memory fallback store + seed data
