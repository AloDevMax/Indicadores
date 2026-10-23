# Authorization

- **Roles**: `user` (regular employee), `admin` (manages their own company), `developer` (global access).
- Admins are scoped to their `company_id`; they cannot access other companies' data.
- Built-in developer account (`alo.de.castro@hotmail.com`) is stored with role `developer`; the seed (`ensureBuiltInDeveloper`) keeps it that way. The role is never derived from the e-mail.
- Sessions end as soon as access is withdrawn: an inactive user's token is rejected (401), an admin password reset or deactivation revokes all of the user's sessions, and changing your own password revokes your other sessions.
- `POST /api/auth/login` is rate limited on failed attempts only (`express-rate-limit`, in memory): 10 per e-mail and 100 per IP every 15 minutes, answering 429. The IP comes from `req.ip`, so `TRUST_PROXY` must match the proxies in front of the app.
- A login for an unknown e-mail still runs scrypt (against `DUMMY_PASSWORD_HASH`), so response time does not reveal which e-mails have accounts.
- E-mails are stored in lowercase (`users_email_lowercase` check constraint), so the unique index also rejects case variants; `POST /api/admin/users` answers 409 for a duplicate.
- Editing an existing account (`POST /api/admin/users` with `id`) is checked against the account as stored, not only against the payload:
  - only the developer can edit the developer account;
  - a supervisor can edit only `user` accounts of their own productive unit;
  - admins can edit any other account.
