# Authorization

- **Roles**: `user` (regular employee), `supervisor` (manages their own productive unit), `admin` (global access).
- Admins reach every productive unit: they see, award, import, review and manage users across all units, and they alone maintain the global badge library (`/api/admin/badges`, including badge image uploads) and productive units.
- Supervisors are scoped to their `productive_unit_id` (`ensureUsersWithinScope`, `ensureSubmissionWithinScope`, `ensureManagerUnitScope`) and can only create `user` accounts. A supervisor without a productive unit reaches nobody else: they see only their own submissions and badges and cannot review or award for anyone.
- `POST /api/admin/users` rejects any role outside `admin`/`supervisor`/`user` with 400.
- Reviewing a submission (`POST /api/submissions/:id/review`): 404 if it does not exist, 403 outside the reviewer's scope, 403 for your own submission (admins included), 409 if it is no longer `pending`. The update is conditioned on `status = 'pending'`, so concurrent approvals award the badge once.
- There is no `developer` role anymore (migration `20261113000000_remove_developer_role` turned existing developers into admins). The built-in account (`alo.de.castro@hotmail.com`) is a regular `admin` that the seed (`ensureBuiltInAdmin`) keeps in place on every deploy. The role is never derived from the e-mail. `DEVELOPER_INITIAL_PASSWORD` is used only when the seed creates the account; `seed.mjs --reset-admin-password` writes it again.
- Sessions end as soon as access is withdrawn: an inactive user's token is rejected (401), an admin password reset or deactivation revokes all of the user's sessions, and changing your own password revokes your other sessions.
- `POST /api/auth/login` is rate limited on failed attempts only (`express-rate-limit`, in memory): 10 per e-mail and 100 per IP every 15 minutes, answering 429. The IP comes from `req.ip`, so `TRUST_PROXY` must match the proxies in front of the app.
- A login for an unknown e-mail still runs scrypt (against `DUMMY_PASSWORD_HASH`), so response time does not reveal which e-mails have accounts.
- E-mails are stored in lowercase (`users_email_lowercase` check constraint), so the unique index also rejects case variants; `POST /api/admin/users` answers 409 for a duplicate.
- Editing an existing account (`POST /api/admin/users` with `id`) is checked against the account as stored, not only against the payload:
  - a supervisor can edit only `user` accounts of their own productive unit;
  - admins can edit any account.
- Accounts are never deleted, only deactivated (`is_active: false` through `POST /api/admin/users`), which revokes their sessions and keeps their badge, submission and review history.
- Uploads (`/api/upload/*`) check the session **before** reading the body, and accept exactly one file in the expected field, up to 5MB (413 above that):
  - `badge-image`: admins only, like the badge library (`POST /api/admin/badges`);
  - `user-avatar`: any authenticated user.
