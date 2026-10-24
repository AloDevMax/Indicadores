# Authorization

- **Roles**: `user` (regular employee), `supervisor` (manages their own productive unit), `admin` (full access, no productive unit needed), `developer` (global access, plus the badge library).
- Productive-unit scope applies only to supervisors: an admin or the developer sees and acts on every unit. A supervisor without a productive unit reaches nobody else: they see only their own submissions and badges and cannot review or award for anyone.
- Reviewing a submission (`POST /api/submissions/:id/review`): 404 if it does not exist, 403 outside the reviewer's scope, 403 for your own submission (the developer included), 409 if it is no longer `pending`. The update is conditioned on `status = 'pending'`, so concurrent approvals award the badge once.
- Built-in developer account (`alo.de.castro@hotmail.com`) is stored with role `developer`; the seed (`ensureBuiltInDeveloper`) keeps it that way. The role is never derived from the e-mail.
- Sessions end as soon as access is withdrawn: an inactive user's token is rejected (401), an admin password reset or deactivation revokes all of the user's sessions, and changing your own password revokes your other sessions.
- `POST /api/auth/login` is rate limited on failed attempts only (`express-rate-limit`, in memory): 10 per e-mail and 100 per IP every 15 minutes, answering 429. The IP comes from `req.ip`, so `TRUST_PROXY` must match the proxies in front of the app.
- A login for an unknown e-mail still runs scrypt (against `DUMMY_PASSWORD_HASH`), so response time does not reveal which e-mails have accounts.
- E-mails are stored in lowercase (`users_email_lowercase` check constraint), so the unique index also rejects case variants; `POST /api/admin/users` answers 409 for a duplicate.
- Editing an existing account (`POST /api/admin/users` with `id`) is checked against the account as stored, not only against the payload:
  - only the developer can edit the developer account;
  - a supervisor can edit only `user` accounts of their own productive unit;
  - admins can edit any other account.
- Accounts are never deleted, only deactivated (`is_active: false` through `POST /api/admin/users`), which revokes their sessions and keeps their badge, submission and review history.
