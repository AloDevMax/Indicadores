# Key API Routes

```
POST /api/auth/login|register|logout
GET  /api/auth/me
GET  /api/bootstrap
GET  /api/health

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
