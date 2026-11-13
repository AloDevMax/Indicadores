# Authorization

- **Roles**: `user` (regular employee), `supervisor` (manages their own productive unit), `admin` (global access).
- Admins reach every productive unit: they see, award, import, review and manage users across all units, and they alone maintain the global badge library (`/api/admin/badges`) and productive units.
- Supervisors are scoped to their `productive_unit_id` (`ensureUsersWithinScope`, `ensureSubmissionWithinScope`, `ensureManagerUnitScope`) and can only create `user` accounts.
- `POST /api/admin/users` rejects any role outside `admin`/`supervisor`/`user` with 400.
- There is no `developer` role anymore (migration `20261113000000_remove_developer_role` turned existing developers into admins). The built-in account (`alo.de.castro@hotmail.com`) is a regular `admin` that the seed (`ensureBuiltInAdmin`) recreates on every deploy, resetting its password to `DEVELOPER_INITIAL_PASSWORD`. The role is never derived from the e-mail.
- Sessions end as soon as access is withdrawn: an inactive user's token is rejected (401), an admin password reset or deactivation revokes all of the user's sessions, and changing your own password revokes your other sessions.
- `POST /api/auth/login` is rate limited on failed attempts only (`express-rate-limit`, in memory): 10 per e-mail and 100 per IP every 15 minutes, answering 429. The IP comes from `req.ip`, so `TRUST_PROXY` must match the proxies in front of the app.
- A login for an unknown e-mail still runs scrypt (against `DUMMY_PASSWORD_HASH`), so response time does not reveal which e-mails have accounts.
- E-mails are stored in lowercase (`users_email_lowercase` check constraint), so the unique index also rejects case variants; `POST /api/admin/users` answers 409 for a duplicate.
- Editing an existing account (`POST /api/admin/users` with `id`) is checked against the account as stored, not only against the payload:
  - a supervisor can edit only `user` accounts of their own productive unit;
  - admins can edit any account.
