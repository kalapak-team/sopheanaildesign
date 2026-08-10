# Project Delivery Document

**Sophea Naildesign — Full-Stack Website**

| | |
|---|---|
| **Project** | Sophea Naildesign Website & Admin CMS |
| **Client** | Sophea Naildesign |
| **Prepared by** | Kalapak Team |
| **Document version** | 1.0 |
| **Delivery date** | 10 August 2026 |
| **Status** | Delivered — Ready for review & deployment |
| **Repository** | [github.com/kalapak-team/sopheanaildesign](https://github.com/kalapak-team/sopheanaildesign) |

---

## 1. Executive Summary

Kalapak Team has designed and developed a full-stack website for **Sophea Naildesign**, a nail studio in Winterthur, Switzerland. The public website closely recreates the look and feel of the existing Webflow presentation site ([sopheanaildesign.webflow.io](https://sopheanaildesign.webflow.io/)), while adding a professional **Admin Dashboard** so the salon can update prices, promotions, opening hours, and site content without changing code.

The solution includes:

- A modern, responsive **public website** (desktop & mobile)
- A secure **Admin CMS** with role-based access
- A **Laravel REST API** backend
- A **PostgreSQL** database for production-ready data storage
- Source code hosted on GitHub for long-term ownership and handover

---

## 2. Project Objectives

| Objective | Result |
|-----------|--------|
| Match the reference website visually | Public site sections, typography, spacing, and imagery aligned to the Webflow design |
| Make content editable by the salon | Admin panel for prices, promotions, hours, settings, and messages |
| Use a modern, maintainable stack | React / Next.js frontend + Laravel API + PostgreSQL |
| Provide a clear handover | Source code, documentation, and credentials process included |

---

## 3. Scope of Delivery

### 3.1 In scope (delivered)

**Public website**

- Hero section with fixed background and brand messaging  
- Image carousel / slider  
- Price list (Preisliste) section  
- About (“Über Mich”) section  
- Study / benefits section (“Überraschende Studie”)  
- Services (“Dienstleistungen”) section  
- Promotions (“Aktionen”) section  
- Instagram feed (Elfsight widget, matching the reference site)  
- Footer with logo, phone, opening hours, location, and social links  
- Sticky navigation that appears on scroll  
- Brand favicon  

**Admin CMS** (`/admin`)

- Secure login  
- Overview dashboard with key statistics  
- Edit service prices by category  
- Edit promotion prices  
- Edit opening hours  
- View contact / enquiry messages  
- Edit advanced site settings (JSON)  
- Logout and “View site” shortcut  

**Backend & data**

- Laravel API with Sanctum authentication  
- Admin role  
- PostgreSQL database (`sopheanaildesign`) with migrations and seed data  
- Seeded default admin account and salon content  

**Documentation & code**

- This delivery document  
- Admin user guide  
- Technical README for developers  
- GitHub repository  

### 3.2 Out of scope / client follow-up

The following are **not** completed as part of this development delivery and typically belong to hosting / business setup:

- Custom domain connection (e.g. `sopheanaildesign.ch`)  
- Production hosting (VPS, Vercel, Forge, cPanel, etc.)  
- SSL certificate on production  
- Production email / SMTP for contact notifications  
- App Store / Google Play apps  
- Ongoing SEO campaigns or Google Ads  
- Legal pages (Impressum / Datenschutz) beyond what already exists in content — confirm with your lawyer if required in Switzerland  

---

## 4. Website Walkthrough (Public Site)

The homepage follows the same section order as the reference site.

| # | Section | Purpose |
|---|---------|---------|
| 1 | **Hero** | Strong first impression: brand, tagline, phone, social icons; background stays fixed while scrolling |
| 2 | **Carousel** | Showcase salon / nail images with arrows and pagination dots |
| 3 | **Preisliste** | Visual price list presentation |
| 4 | **Über Mich** | About the studio / brand story |
| 5 | **Überraschende Studie** | Highlighted benefits / study content |
| 6 | **Dienstleistungen** | Services introduction with imagery |
| 7 | **Aktionen** | Current promotions with large price display |
| 8 | **Instagram** | Live Instagram feed via Elfsight widget |
| 9 | **Footer / Kontakt** | Phone, hours, address, social links, copyright |

**Navigation**

- Header menu on the hero  
- Fixed white navigation bar after scrolling past the hero  
- Links: Über Mich · Dienstleistungen · Aktionen · Preise · Kontakt  

**Local preview URLs (development)**

| Item | URL |
|------|-----|
| Public website | `http://localhost:3000` |
| Admin login | `http://localhost:3000/admin/login` |
| Admin dashboard | `http://localhost:3000/admin` |
| Backend API | `http://127.0.0.1:8000/api` |

Production URLs will replace these after hosting is configured.

---

## 5. Admin CMS Overview

The Admin panel is a professional dashboard for salon staff.

| Module | What the client can do |
|--------|-------------------------|
| **Overview** | See counts of categories, services, promotions, and messages; API status |
| **Preise** | Update CHF prices per service; changes save when leaving the price field |
| **Aktionen** | Update promotion prices |
| **Öffnungszeiten** | Update opening hours shown in the footer |
| **Messages** | Review visitor messages (when the contact channel is used) |
| **Settings** | Advanced site settings (phone, address, social links, text content) as JSON |

A separate step-by-step guide is provided in:

**`docs/ADMIN_USER_GUIDE.md`**

---

## 6. Technology Architecture

```
┌─────────────────────┐       HTTPS / JSON        ┌─────────────────────┐
│  Next.js Frontend   │ ◄──────────────────────► │  Laravel API         │
│  (Public + Admin)   │                           │  (Sanctum Auth)      │
└─────────────────────┘                           └──────────┬──────────┘
                                                             │
                                                             ▼
                                                  ┌─────────────────────┐
                                                  │  PostgreSQL         │
                                                  │  sopheanaildesign   │
                                                  └─────────────────────┘
```

| Layer | Technology | Role |
|-------|------------|------|
| Frontend | React, Next.js 15, Tailwind CSS | Public website + Admin UI |
| Backend | Laravel (PHP), Sanctum | REST API, authentication, business logic |
| Database | PostgreSQL 18 | Persistent content & users |
| Auth | Bearer token (Sanctum) | Protects admin endpoints |
| Source control | GitHub | Version history & handover |

**Project folders**

```
sopheanaildesign/
├── frontend/     → Public site + Admin dashboard
├── backend/      → Laravel API + database migrations/seeders
├── docs/         → Client & handover documentation
└── README.md     → Developer quick start
```

---

## 7. Database & Content

**Database name:** `sopheanaildesign`  

**Main content tables:**

| Table | Content |
|-------|---------|
| `users` | Admin accounts (role: admin) |
| `service_categories` | Price categories (e.g. Maniküre, Extras) |
| `services` | Individual services and prices |
| `promotions` | Aktionen / promotional offers |
| `opening_hours` | Days and hours for the footer |
| `site_settings` | Phone, address, social, text blocks |
| `hero_slides` | Carousel images |
| `gallery_images` | Gallery assets |
| `contact_messages` | Visitor messages |

Initial content has been seeded to match the salon’s published information (services, promotions, hours, phone, etc.).

---

## 8. Security & Access

| Control | Implementation |
|---------|----------------|
| Admin authentication | Email + password login |
| Session / API auth | Laravel Sanctum personal access tokens |
| Role | `admin` role required for management endpoints |
| Secrets | `.env` files are **not** stored in GitHub |
| Public API | Read-only site data endpoint for the frontend |

### Default admin account (development / handover)

| Field | Value |
|-------|-------|
| Email | `admin@sopheanaildesign.ch` |
| Temporary password | `admin123` |
| Role | `admin` |

**Important security recommendation**

Change this password immediately after handover, and before going live on a public domain. Do **not** share this document widely with the temporary password still active. Prefer sending credentials in a separate private message.

---

## 9. API Summary (for technical stakeholders)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/site` | Public | Full site payload for the frontend |
| `POST` | `/api/contact` | Public | Submit contact message |
| `POST` | `/api/admin/login` | Public | Admin login → token |
| `POST` | `/api/admin/logout` | Admin | Logout |
| `GET/PUT/...` | `/api/admin/*` | Admin | Manage prices, promotions, hours, settings, messages |

Full route list is in `backend/routes/api.php`.

---

## 10. How to Run Locally (for review)

### Backend

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
# Configure PostgreSQL in .env (DB_CONNECTION=pgsql, etc.)
php artisan migrate --seed
php artisan serve
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:3000` and `http://localhost:3000/admin/login`.

---

## 11. Deployment Recommendations

To put the site live for customers, the client (or hosting partner) should:

1. **Provision hosting**  
   - Frontend: Node hosting suitable for Next.js (e.g. Vercel, or a VPS)  
   - Backend: PHP 8.2+ host with Composer (e.g. Laravel Forge, shared hosting with SSH, or VPS)  
   - Database: Managed PostgreSQL or same VPS  

2. **Configure environment**  
   - Set production `.env` (APP_KEY, DB_*, APP_URL, FRONTEND_URL, CORS)  
   - Point frontend API URL to the production API  

3. **Connect domain & SSL**  
   - DNS A/CNAME records  
   - HTTPS certificate  

4. **Hardening**  
   - Change admin password  
   - Disable debug mode (`APP_DEBUG=false`)  
   - Restrict admin URL if desired (optional IP allowlist / extra auth)  

Kalapak Team can provide a separate **Deployment Proposal** if the client requests production setup as an additional service.

---

## 12. Acceptance Checklist

Please confirm each item during handover review:

| # | Item | OK |
|---|------|----|
| 1 | Homepage matches agreed visual design / reference | ☐ |
| 2 | All main sections display correctly on desktop | ☐ |
| 3 | Mobile layout is usable and branded | ☐ |
| 4 | Navigation and footer links work | ☐ |
| 5 | Admin login works | ☐ |
| 6 | Prices can be updated from Admin → Preise | ☐ |
| 7 | Promotions can be updated from Admin → Aktionen | ☐ |
| 8 | Opening hours can be updated from Admin → Öffnungszeiten | ☐ |
| 9 | Site settings are accessible | ☐ |
| 10 | Source code is available on GitHub | ☐ |
| 11 | Delivery documentation received | ☐ |
| 12 | Temporary admin password will be changed before go-live | ☐ |

**Client acceptance**

| | |
|---|---|
| Accepted by (name) | ______________________________ |
| Signature | ______________________________ |
| Date | ______________________________ |

---

## 13. Support & Change Requests

| Type | Typical handling |
|------|------------------|
| **Bug** (feature does not work as delivered) | Covered during agreed warranty / support window |
| **Change request** (new section, new language, booking system, etc.) | Quoted separately |
| **Hosting / domain / email** | Separate ops task unless included in a hosting package |

Suggested warranty period (customize as needed): **30 days** after acceptance for defect fixes related to delivered scope.

---

## 14. Handover Package Contents

| Item | Location |
|------|----------|
| Source code | [github.com/kalapak-team/sopheanaildesign](https://github.com/kalapak-team/sopheanaildesign) |
| This delivery document | `docs/CLIENT_DELIVERY.md` |
| Admin user guide | `docs/ADMIN_USER_GUIDE.md` |
| Developer README | `README.md` |
| Environment template | `backend/.env.example` |

---

## 15. Contact

For questions about this delivery:

| | |
|---|---|
| **Team** | Kalapak Team |
| **Repository** | https://github.com/kalapak-team/sopheanaildesign |
| **Project** | Sophea Naildesign Full-Stack Website |

---

*End of Project Delivery Document — Version 1.0*  
*Confidential — Intended for the client and authorized stakeholders only.*
