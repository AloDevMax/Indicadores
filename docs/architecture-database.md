# Database

- **ORM**: Prisma 6 with schema at `/prisma/schema.prisma`. Generated client at `/generated/`.
- **Fallback**: If `DATABASE_URL` is missing or PostgreSQL is unavailable, the app falls back to an in-memory store (`server/data/memoryStore.mjs`). Data is **not persisted** in fallback mode.
- **Key models**: `Users`, `Companies`, `ProductiveUnits`, `Badges`, `UserBadges` (earned badges with tone: bronze/silver/gold/loss_1/loss_2), `BadgeSubmissions`, `ImportSources`, `ImportRuns`.
