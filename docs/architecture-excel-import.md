# Excel Import System

Bulk badge assignment from a monthly indicators spreadsheet. `AdminPanel.tsx` parses the upload with the `xlsx` library, matches each spreadsheet name to a user, and lets the admin pick month/year. It then sends the awards (`{ userId, badgeId, tone }`, non-zero values only) to `POST /api/admin/import-monthly-badges`, handled by `importMonthlyBadges` in `server/operations/repository.mjs`.

The `import_sources`, `import_runs` and `import_run_rows` tables are legacy: nothing reads or writes them anymore.
