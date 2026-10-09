# Key API Routes

```
POST /api/auth/login|register|logout
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
POST /api/admin/users
POST /api/admin/users/bulk-invite
POST /api/admin/award-badges
POST /api/admin/import-monthly-badges  # Excel import (see architecture-excel-import.md)
PUT  /api/user/profile
```
