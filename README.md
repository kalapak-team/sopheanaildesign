# Sophea Naildesign — Full Stack

Pixel-close recreation of [sopheanaildesign.webflow.io](https://sopheanaildesign.webflow.io/) with:

- **frontend/** — React + Next.js 15 + Tailwind CSS 4 (public site + `/admin`)
- **backend/** — Laravel 13 API + Sanctum (admin role)
- **Database** — PostgreSQL (Railway in production; SQLite locally by default)

## Quick start (local)

### 1. Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Ensure database/database.sqlite exists when using sqlite
php artisan migrate --seed
php artisan serve
# If image uploads fail with 413, restart with:
# php -c php-upload.ini artisan serve --host=127.0.0.1 --port=8000
```

API: `http://127.0.0.1:8000/api`  
Uploads: max **50 MB** (JPG/PNG/WebP). Local PHP needs `upload_max_filesize` / `post_max_size` ≥ 64M (see `php-upload.ini`).

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Site: `http://localhost:3000`  
Admin: `http://localhost:3000/admin/login`

### Admin login (seeded)

- Email: `admin@sopheanaildesign.ch`
- Password: `admin123`
- Role: `admin`

## Deploy: Vercel (frontend) + Railway (backend + Postgres)

Yes — the backend ships with a **Dockerfile** (`backend/Dockerfile`) so Railway can run PHP + pgsql reliably.

### A. Push this repo to GitHub

Already set up as `https://github.com/phuem-norng/SoPheaNailDesign.git`.

### B. Railway — PostgreSQL + Laravel API

1. Create a project on [Railway](https://railway.app).
2. **Add PostgreSQL** (New → Database → PostgreSQL).
3. **Add a service** from this GitHub repo:
   - **Root Directory:** `backend`
   - Railway will use `backend/Dockerfile` + `backend/railway.toml`.
4. **Variables** on the API service (Settings → Variables):

| Variable | Value |
|----------|--------|
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_KEY` | `php artisan key:generate --show` (paste the `base64:…` value) |
| `APP_URL` | `https://YOUR-API.up.railway.app` (or custom domain) |
| `DB_CONNECTION` | `pgsql` |
| `DB_URL` | reference Railway Postgres `DATABASE_URL` |
| `CORS_ALLOWED_ORIGINS` | `https://YOUR-APP.vercel.app` (comma-separated if multiple) |
| `MEDIA_DISK` | `r2` (recommended; ephemeral disk on Railway) |
| `RUN_MIGRATIONS` | `true` |
| `RUN_SEED` | `true` once for first deploy, then set `false` |

Also copy your R2 keys if using Cloudflare R2 (`R2_*` from `.env.example`).

5. Generate a public domain for the API service (Settings → Networking → Generate Domain).
6. Health check path is `/up`.

### C. Vercel — Next.js frontend

1. Import the same GitHub repo in [Vercel](https://vercel.com).
2. **Root Directory:** `frontend`
3. Framework: Next.js (auto).
4. Environment variables:

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-API.up.railway.app/api` |
| `NEXT_PUBLIC_R2_HOST` | optional CDN host for `next/image` |

5. Deploy. After the Vercel URL is known, add it to Railway `CORS_ALLOWED_ORIGINS` and redeploy the API if needed.

### D. Cloudflare R2 (image uploads on Railway)

Railway containers do not keep local uploads. Prefer R2:

```env
MEDIA_DISK=r2
R2_ACCESS_KEY_ID=…
R2_SECRET_ACCESS_KEY=…
R2_BUCKET=…
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
R2_URL=https://pub-xxxx.r2.dev
```

## PostgreSQL (local)

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
├── frontend/          # Next.js → deploy on Vercel
│   └── vercel.json
└── backend/           # Laravel → deploy on Railway (Docker)
    ├── Dockerfile
    ├── railway.toml
    └── docker/entrypoint.sh
```

## Notes

- Images in `frontend/public/images` are stock placeholders (Unsplash). Replace with original salon photos for a true 100% visual match.
- Admin can edit prices, promotions, opening hours, settings, and view contact messages without changing code.
- Local fallback: keep `MEDIA_DISK=public` and `php artisan storage:link`.
- Never commit `backend/.env` or `frontend/.env.local` (secrets stay on Vercel / Railway only).
