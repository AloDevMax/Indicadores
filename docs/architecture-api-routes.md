# Key API Routes

```
POST /api/auth/login|logout                # no self-registration: accounts come from POST /api/admin/users
GET  /api/auth/me
GET  /api/health

GET  /api/badges | badge-legends | productive-units   # Public catalog
GET  /api/users                         # Session required; plain users get no emails but their own
GET  /api/user-badges                   # Session required; scoped (own unit; user without unit: own; admin: all)
GET  /api/ranking?year=&month=          # Session required; per-user monthly score/counts for every unit, no individual awards
GET  /api/submissions                   # Session required; scoped (user: own, supervisor: unit)

POST /api/submissions                   # User requests a badge
POST /api/submissions/:id/review        # Admin approves/rejects

POST /api/admin/badges
POST /api/admin/companies
POST /api/admin/productive-units
POST /api/admin/users                  # no password given → returns a one-time temporary_password
POST /api/admin/users/bulk-invite      # returns temporaryPasswords: one per created user
POST /api/admin/award-badges
POST /api/admin/import-monthly-badges  # Excel import (see architecture-excel-import.md)
PUT  /api/user/profile                 # own name and password (current_password required); e-mail is admin-only
```

Accounts created or reset by an admin have `must_change_password`. Until the user sets their own password, every route except `/api/auth/me`, `/api/auth/logout` and `PUT /api/user/profile` answers `403 { code: 'PASSWORD_CHANGE_REQUIRED' }` (`requireAuthenticatedUser`), and the SPA only shows "Meu perfil".
