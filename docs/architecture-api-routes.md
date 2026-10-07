# Key API Routes

```
POST /api/auth/login|register|logout
GET  /api/auth/me
GET  /api/bootstrap
GET  /api/health

GET  /api/badges | badge-legends | productive-units   # Public catalog (same data as the anonymous bootstrap)
GET  /api/users                         # Session required; plain users get no emails but their own
GET  /api/user-badges                   # Session required; all awards (the ranking needs them)
GET  /api/submissions                   # Session required; scoped like bootstrap (user: own, supervisor: unit)
GET  /api/import-sources                # Session required; admin, developer or supervisor

POST /api/submissions                   # User requests a badge
POST /api/submissions/:id/review        # Admin approves/rejects

POST /api/admin/badges
POST /api/admin/companies
POST /api/admin/productive-units
POST /api/admin/users
POST /api/admin/users/bulk-invite
POST /api/admin/award-badges
POST /api/admin/import-sources
POST /api/admin/import-runs
PUT  /api/user/profile
```
