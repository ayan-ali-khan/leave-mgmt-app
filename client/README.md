# Leave Management Frontend (React + Tailwind)

This is a ready-to-run frontend for your **leave-mgmt-app** backend.

## Quick Start

```bash
npm i
npm run dev
```

Create a `.env` at project root with your backend URL:
```bash
VITE_API_URL=http://localhost:5000
```

## Route assumptions (easily tweak in the code)

The frontend calls these endpoints (adjust in `src/utils/api.js` and page files if your backend differs):

- `POST /api/auth/login` — expects `{ token, user }`
- `POST /api/auth/register` — returns `{ token, user }` or a success message
- `GET  /api/me` — current user profile `{ fullName, email, department, joinDate, totalLeaveBalance, usedLeave, remainingLeave }`
- `GET  /api/leaves/me` — current user leave list
- `POST /api/leaves` — create leave `{ startDate, endDate, reason }`
- `GET  /api/admin/leaves` — admin: list all requests (with employee info)
- `PATCH /api/admin/leaves/:id` — admin: set `{ status: 'approved'|'rejected' }`
- `GET  /api/admin/employees` — admin: list employees

If your backend uses different paths (e.g., `/users/login`, `/leave/apply`, etc.), search for those strings in the code and update.

## Features

- Home page with **Employee** and **Admin** login/signup entry points
- Auth with token storage, protected routes
- Employee pages: **Profile**, **My Leaves** with **Apply** modal (max 20 days, optional balance check)
- Admin pages: **Leave Requests** approve/reject, **Employees** directory
- TailwindCSS UI, responsive and clean

---

Generated on 2025-08-13.
