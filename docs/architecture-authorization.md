# Authorization

- **Roles**: `user` (regular employee), `admin` (manages their own company), `developer` (global access).
- Admins are scoped to their `company_id`; they cannot access other companies' data.
- Built-in developer account (`alo.de.castro@hotmail.com`) is stored with role `developer`; the seed (`ensureBuiltInDeveloper`) keeps it that way. The role is never derived from the e-mail.
- E-mails are stored in lowercase (`users_email_lowercase` check constraint), so the unique index also rejects case variants; `POST /api/admin/users` answers 409 for a duplicate.
- Editing an existing account (`POST /api/admin/users` with `id`) is checked against the account as stored, not only against the payload:
  - only the developer can edit the developer account;
  - a supervisor can edit only `user` accounts of their own productive unit;
  - admins can edit any other account.
