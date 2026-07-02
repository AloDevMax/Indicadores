# Authorization

- **Roles**: `user` (regular employee), `admin` (manages their own company), `developer` (global access).
- Admins are scoped to their `company_id`; they cannot access other companies' data.
- Built-in developer account (`alo.de.castro@hotmail.com`) has role normalized to `developer` automatically.
