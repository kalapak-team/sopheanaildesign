# Sophea Naildesign — Full Stack

Pixel-close recreation of [sopheanaildesign.webflow.io](https://sopheanaildesign.webflow.io/) with:

- **frontend/** — React + Next.js 15 + Tailwind CSS 4 (public site + `/admin`)
- **backend/** — Laravel 13 API + Sanctum (admin role)
- **Database** — PostgreSQL ready (SQLite used locally by default)

## Quick start

### 1. Backend (Laravel)

```bash
cd backend
composer install
copy .env.example .env   # if needed
php artisan key:generate
# Ensure database/database.sqlite exists when using sqlite
php artisan migrate --seed
php artisan serve
```

API: `http://127.0.0.1:8000/api`

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Site: `http://localhost:3000`  
Admin: `http://localhost:3000/admin/login`

### Admin login (seeded)

- Email: `admin@sopheanaildesign.ch`
- Password: `admin123`
- Role: `admin`

## PostgreSQL setup

1. Create database `sopheanaildesign`
2. In `backend/.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=sopheanaildesign
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

3. Run:

```bash
php artisan migrate:fresh --seed
```

## API overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/site` | public | Full site payload |
| POST | `/api/contact` | public | Contact form |
| POST | `/api/admin/login` | public | Admin login |
| GET/PUT/... | `/api/admin/*` | Bearer token | CRUD for prices, promotions, hours, settings, messages |

## Project structure

```
sopheanaildesign/
├── frontend/          # Next.js public site + admin UI
└── backend/           # Laravel API + PostgreSQL/SQLite
```

## Notes

- Images in `frontend/public/images` are stock placeholders (Unsplash). Replace with original salon photos for a true 100% visual match.
- Admin can edit prices, promotions, opening hours, settings, and view contact messages without changing code.
