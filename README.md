# Sophea Naildesign

**Full-stack salon website & content management system**  
Delivered by **[Kalapak Team](https://github.com/kalapak-team)**

[![Stack](https://img.shields.io/badge/Frontend-Next.js%2015-black)](./frontend)
[![Backend](https://img.shields.io/badge/Backend-Laravel%20API-FF2D20)](./backend)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-336791)](./backend)
[![Docs](https://img.shields.io/badge/Docs-Client%20Delivery-E91E63)](./docs)

---

## Overview

**Sophea Naildesign** is a production-ready digital presence for a nail studio in Winterthur, Switzerland. The public website closely recreates the design and section order of the original Webflow reference site, while adding a secure **Admin CMS** so the salon can manage prices, promotions, opening hours, and site content without developer help.

| | |
|---|---|
| **Client** | Sophea Naildesign |
| **Vendor** | Kalapak Team |
| **Reference design** | [sopheanaildesign.webflow.io](https://sopheanaildesign.webflow.io/) |
| **Repository** | [github.com/kalapak-team/sopheanaildesign](https://github.com/kalapak-team/sopheanaildesign) |
| **Status** | Delivered — ready for review & deployment |

**Stack summary**

- **frontend/** — React + Next.js 15 + Tailwind CSS 4 (public site + `/admin`)
- **backend/** — Laravel 13 API + Sanctum (admin role)
- **Database** — PostgreSQL (Railway in production; SQLite locally by default)

---

## Business value

| For the salon | For stakeholders |
|---------------|------------------|
| Brand-accurate public website | Clear source-code ownership on GitHub |
| Update prices & promotions in minutes | Documented handover package (Word + Markdown) |
| Edit opening hours without calling a developer | Modern, maintainable tech stack |
| Professional admin dashboard | PostgreSQL-ready for production |

---

## Features

### Public website

- Hero with fixed background, brand messaging, phone & social links  
- Image carousel with arrows and pagination  
- Price list (Preisliste) section  
- About (“Über Mich”) section  
- Study / benefits section  
- Services (“Dienstleistungen”) section  
- Promotions (“Aktionen”) section  
- Instagram feed (Elfsight widget)  
- Footer with logo, phone, hours, location, social & credits  
- Sticky navigation on scroll  
- Brand favicon  
- Responsive layout (desktop & mobile)

### Admin CMS (`/admin`)

- Secure login with Sanctum token auth  
- Overview dashboard (categories, services, promotions, messages)  
- **Preise** — edit service prices by category  
- **Aktionen** — edit promotion prices  
- **Öffnungszeiten** — edit footer opening hours  
- **Messages** — review visitor messages  
- **Settings** — advanced site settings (JSON)  
- Toast notifications, mobile sidebar, “View site” shortcut  

---

## Technology stack

```
┌──────────────────────┐         REST / JSON         ┌──────────────────────┐
│  Next.js Frontend    │ ◄─────────────────────────► │  Laravel API          │
│  Public site + Admin │                             │  Sanctum Auth         │
└──────────────────────┘                             └───────────┬──────────┘
                                                                 │
                                                                 ▼
                                                      ┌──────────────────────┐
                                                      │  PostgreSQL          │
                                                      │  sopheanaildesign    │
                                                      └──────────────────────┘
```

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | React, Next.js 15, Tailwind CSS | Public website + Admin UI |
| Backend | Laravel (PHP), Sanctum | REST API, auth, business logic |
| Database | PostgreSQL 18 | Production data store |
| Auth | Bearer tokens (Sanctum) | Protect admin endpoints |
| Source control | GitHub | Versioning & handover |

---

## Repository structure

```
sopheanaildesign/
├── frontend/                 # Next.js public site + Admin dashboard
│   ├── src/app/              # Pages (home, /admin, /admin/login)
│   ├── src/components/       # UI sections (Hero, Footer, …)
│   ├── public/images/        # Brand & section assets
│   └── vercel.json
├── backend/                  # Laravel API
│   ├── app/Http/Controllers/Api/
│   ├── app/Models/
│   ├── database/migrations/
│   ├── database/seeders/
│   ├── routes/api.php
│   ├── Dockerfile            # Railway / Docker deploy
│   ├── railway.toml
│   └── docker/entrypoint.sh
├── docs/                     # Client delivery documentation
│   ├── CLIENT_DELIVERY.docx / .md
│   ├── ADMIN_USER_GUIDE.docx / .md
│   └── images/               # Diagrams for documentation
└── README.md                 # This file
```

---

## Quick start (local)

### Requirements

- **Node.js** 20+  
- **PHP** 8.2+ with Composer  
- **PostgreSQL** 14+ (recommended; SQLite works locally)  
- Git  

### 1. Clone

```bash
git clone https://github.com/kalapak-team/sopheanaildesign.git
cd sopheanaildesign
```

### 2. Backend (Laravel API)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Configure the database in `backend/.env` (PostgreSQL recommended):

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=sopheanaildesign
DB_USERNAME=postgres
DB_PASSWORD=your_password
FRONTEND_URL=http://localhost:3000
APP_URL=http://127.0.0.1:8000
```

Create the database in PostgreSQL (once), then:

```bash
php artisan migrate --seed
php artisan serve
# If image uploads fail with 413, restart with:
# php -c php-upload.ini artisan serve --host=127.0.0.1 --port=8000
```

API base URL: **http://127.0.0.1:8000/api**  
Uploads: max **50 MB** (JPG/PNG/WebP). Local PHP needs `upload_max_filesize` / `post_max_size` ≥ 64M (see `php-upload.ini`).

### 3. Frontend (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

| Surface | URL |
|---------|-----|
| Public website | http://localhost:3000 |
| Admin login | http://localhost:3000/admin/login |
| Admin dashboard | http://localhost:3000/admin |

---

## Default admin credentials (development)

| Field | Value |
|-------|-------|
| Email | `admin@sopheanaildesign.ch` |
| Password | `admin123` |
| Role | `admin` |

> **Security:** Change this password before any public / production deployment. Do not commit real production secrets to Git.

---

## API overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/site` | Public | Full site payload for the frontend |
| `POST` | `/api/contact` | Public | Submit contact message |
| `POST` | `/api/admin/login` | Public | Admin login → access token |
| `POST` | `/api/admin/logout` | Admin | Logout |
| `GET` | `/api/admin/me` | Admin | Current user |
| `GET/PUT/...` | `/api/admin/categories` | Admin | Service categories |
| `PUT` | `/api/admin/services/{id}` | Admin | Update service (e.g. price) |
| `GET/PUT/...` | `/api/admin/promotions` | Admin | Promotions |
| `GET/PUT/...` | `/api/admin/opening-hours` | Admin | Opening hours |
| `GET/PUT` | `/api/admin/settings` | Admin | Site settings |
| `GET` | `/api/admin/messages` | Admin | Contact messages |

Full routes: [`backend/routes/api.php`](./backend/routes/api.php)

---

## Deploy: Vercel (frontend) + Railway (backend + Postgres)

The backend ships with a **Dockerfile** (`backend/Dockerfile`) so Railway can run PHP + pgsql reliably.

### A. GitHub remotes

| Remote | URL |
|--------|-----|
| Personal | https://github.com/phuem-norng/SoPheaNailDesign |
| Kalapak Team | https://github.com/kalapak-team/sopheanaildesign |

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

Local fallback: keep `MEDIA_DISK=public` and `php artisan storage:link`.

---

## Client documentation

Professional handover materials for the client live in **[`docs/`](./docs/)**:

| Document | Format | Audience |
|----------|--------|----------|
| [CLIENT_DELIVERY](./docs/CLIENT_DELIVERY.docx) | Word + Markdown | Client / stakeholders — full delivery & acceptance |
| [ADMIN_USER_GUIDE](./docs/ADMIN_USER_GUIDE.docx) | Word + Markdown | Salon staff — how to use the CMS |
| [docs/README](./docs/README.md) | Markdown | How to export PDF & send to client |

Regenerate Word files from Markdown (if needed):

```bash
python docs/md_to_docx.py
```

---

## Environment notes

| File | Purpose | In Git? |
|------|---------|---------|
| `backend/.env` | Local/production secrets | **No** (gitignored) |
| `backend/.env.example` | Template for setup | Yes |
| `frontend/.env.local` | Frontend env (API URL, etc.) | **No** |

Never commit database passwords, API keys, or production admin credentials. Secrets stay on Vercel / Railway only.

---

## Deployment checklist (high level)

1. Provision PostgreSQL and create database `sopheanaildesign`  
2. Deploy Laravel API (PHP 8.2+, Composer, `php artisan migrate --seed`)  
3. Deploy Next.js frontend (Node host / Vercel / VPS)  
4. Set production `APP_URL`, `FRONTEND_URL`, CORS, and API base URL  
5. Enable HTTPS on the domain  
6. Change admin password; set `APP_DEBUG=false`  

A detailed deployment proposal can be provided by Kalapak Team as an additional service.

---

## Notes

- Images in `frontend/public/images` may include stock placeholders — replace with original salon photos for a true visual match.
- Admin can edit prices, promotions, opening hours, settings, and view contact messages without changing code.

---

## Acceptance & support

Use the acceptance checklist in [`docs/CLIENT_DELIVERY.md`](./docs/CLIENT_DELIVERY.md) during handover.

| Type | Handling |
|------|----------|
| Defect in delivered scope | Covered during agreed warranty window |
| New features / redesign | Quoted as change request |
| Hosting / domain / email | Separate operations package |

---

## Team

| | |
|---|---|
| **Organization** | [Kalapak Team](https://github.com/kalapak-team) |
| **Project** | Sophea Naildesign Full-Stack Website |
| **Repository** | https://github.com/kalapak-team/sopheanaildesign |

---

## License & confidentiality

This repository is delivered for the **Sophea Naildesign** engagement. Redistribution or reuse outside the agreed client contract requires written permission from Kalapak Team and/or the client.

---

© 2026 Kalapak Team · Built for Sophea Naildesign
