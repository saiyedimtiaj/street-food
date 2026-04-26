# 🍜 Street Food — Full Project Documentation

> **Purpose:** This document describes the complete current state of the Street Food Review Platform — a university project. It covers architecture, database, API, frontend pages, UI/UX design decisions, and known limitations. Use this to identify improvements.

---

## 1. Project Overview

A **Bangla-language (বাংলা) street food review platform** where users can discover nearby street food shops, write rich-text reviews with images, suggest new shops, and store owners can manage their presence. Admins moderate everything.

**Live URLs:**
- Frontend: Vercel (Next.js)
- Backend API: Vercel (NestJS serverless)
- Database: Supabase PostgreSQL
- Image Storage: Cloudinary

---

## 2. Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2.2 | React framework (App Router) |
| React | 19.2.4 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling (using oklch color system) |
| shadcn/ui (radix-nova) | Latest | UI components (Button, Input, Label, Card, AlertDialog) |
| TanStack Query | 5.96 | Server state management |
| Tiptap | 3.22 | Rich text editor (with 9 extensions) |
| Leaflet + React-Leaflet | 1.9/5.0 | Interactive maps |
| Axios | 1.14 | HTTP client |
| Lucide React | 1.7 | Icons |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| NestJS | 11.x | API framework |
| Prisma | 7.6 | ORM with PostgreSQL driver adapter |
| PostgreSQL | Latest | Database (hosted on Supabase) |
| JWT (@nestjs/jwt) | Latest | Authentication (httpOnly cookies) |
| Cloudinary | v2 | Image upload/storage |
| Multer | Latest | File upload handling (memory storage) |
| class-validator | Latest | DTO validation |
| Swagger | Latest | API documentation at `/api/docs` |
| bcrypt | Latest | Password hashing |

### Infrastructure
| Service | Purpose |
|---|---|
| Vercel | Frontend + Backend hosting (serverless) |
| Supabase | PostgreSQL database hosting |
| Cloudinary | Image CDN and storage |

---

## 3. Database Schema (9 Tables)

### 3.1 `users`
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | Auto-generated |
| name | VARCHAR(100) | Required |
| email | VARCHAR(255) | Unique |
| password | TEXT | bcrypt hashed (10 rounds) |
| role | VARCHAR(20) | `user` / `store` / `admin` (default: `user`) |
| profile_photo | TEXT? | Cloudinary URL |
| profile_photo_public_id | TEXT? | For Cloudinary deletion |
| bio | TEXT? | User bio |
| is_active | BOOLEAN | Default `true`, admin can deactivate |
| created_at / updated_at | TIMESTAMPTZ | Auto-managed |

### 3.2 `stores`
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| owner_id | UUID? (FK→users) | Nullable, SET NULL on user delete |
| name | VARCHAR(150) | |
| description | TEXT? | |
| category | VARCHAR(100)? | e.g. "Snacks", "Biriyani", "Seafood" |
| address | TEXT? | |
| latitude | DECIMAL(10,8) | Required for geo-search |
| longitude | DECIMAL(11,8) | Required for geo-search |
| cover_image / cover_image_public_id | TEXT? | Cloudinary |
| status | VARCHAR(20) | `active` / `inactive` / `suspended` |
| is_claimed | BOOLEAN | Default `false` |
| created_at / updated_at | TIMESTAMPTZ | |

### 3.3 `store_gallery`
| Field | Type |
|---|---|
| id | UUID (PK) |
| store_id | UUID (FK→stores, CASCADE) |
| image_url | TEXT |
| public_id | TEXT |
| created_at | TIMESTAMPTZ |

**Limit:** Max 6 gallery images per store.

### 3.4 `foods`
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| store_id | UUID (FK→stores, CASCADE) | |
| name | VARCHAR(150) | |
| description | TEXT? | |
| price | DECIMAL(10,2) | |
| image_url | TEXT? | |
| is_available | BOOLEAN | Default `true` |
| created_at / updated_at | TIMESTAMPTZ | |

### 3.5 `reviews`
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| user_id | UUID (FK→users, CASCADE) | |
| store_id | UUID (FK→stores, CASCADE) | |
| rating | INT | 1–5 |
| comment | TEXT? | Rich HTML from Tiptap |
| created_at / updated_at | TIMESTAMPTZ | |

**Constraint:** Unique `(user_id, store_id)` — one review per user per store.

### 3.6 `review_images`
| Field | Type |
|---|---|
| id | UUID (PK) |
| review_id | UUID (FK→reviews, CASCADE) |
| image_url / public_id | TEXT |
| created_at | TIMESTAMPTZ |

**Limit:** Max 3 images per review.

### 3.7 `review_replies`
| Field | Type |
|---|---|
| id | UUID (PK) |
| review_id | UUID (FK→reviews, CASCADE) |
| store_id | UUID (FK→stores, CASCADE) |
| reply_text | TEXT |
| created_at / updated_at | TIMESTAMPTZ |

**Rule:** Only one reply per review from the store owner.

### 3.8 `store_suggestions`
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| suggested_by | UUID (FK→users, CASCADE) | |
| name | VARCHAR(150) | |
| description, address | TEXT? | |
| latitude, longitude | DECIMAL? | |
| status | VARCHAR(20) | `pending` / `approved` / `rejected` |
| admin_note | TEXT? | |
| created_at / updated_at | TIMESTAMPTZ | |

### 3.9 `store_claims`
| Field | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| store_id | UUID (FK→stores, CASCADE) | |
| claimed_by | UUID (FK→users, CASCADE) | |
| message | TEXT? | |
| status | VARCHAR(20) | `pending` / `approved` / `rejected` |
| admin_note | TEXT? | |
| created_at / updated_at | TIMESTAMPTZ | |

**Constraint:** Unique `(store_id, claimed_by)`.

### Entity Relationship Summary
```
users ──1:N──> stores (owner)
users ──1:N──> reviews
users ──1:N──> store_suggestions
users ──1:N──> store_claims
stores ──1:N──> store_gallery
stores ──1:N──> foods
stores ──1:N──> reviews
stores ──1:N──> review_replies
stores ──1:N──> store_claims
reviews ──1:N──> review_images
reviews ──1:N──> review_replies
```

---

## 4. Authentication & Authorization

### Auth Flow
1. User registers → password bcrypt-hashed → stored in DB
2. User logs in → password verified → JWT signed with `{sub: userId, email, role}`
3. JWT stored in **httpOnly cookie** (`access_token`, 30-day maxAge, secure in prod, sameSite: none in prod / lax in dev)
4. Bearer token fallback for Swagger/API testing
5. Every protected request: `JwtAuthGuard` extracts token from cookie → verifies → loads user from DB → checks `is_active` → attaches to `request.user`
6. `RolesGuard` checks `user.role` against `@Roles()` decorator
7. Logout clears the cookie

### Role-Based Access
| Role | Capabilities |
|---|---|
| `user` | Browse stores, write reviews, suggest stores, view own reviews/suggestions |
| `store` | All user abilities + manage own store (menu, gallery, reply to reviews), claim stores |
| `admin` | All abilities + dashboard stats, manage users/stores/suggestions/claims, suspend/activate stores, deactivate users |

### Current Limitation
- All role checks are client-side in the frontend (no Next.js middleware)
- JWT expiry is configurable but defaults to 15 minutes (cookie lasts 30 days — mismatch potential)

---

## 5. API Endpoints (35 Total)

Base URL: `/api/v1`

### 5.1 Auth (4)
| Method | Path | Auth | Body/Query | Description |
|---|---|---|---|---|
| POST | `/auth/register` | Public | `{name, email, password, role}` | Register (user/store only) |
| POST | `/auth/login` | Public | `{email, password}` | Login → sets httpOnly cookie |
| POST | `/auth/logout` | Auth | — | Clears cookie |
| GET | `/auth/me` | Auth | — | Returns current user profile |

### 5.2 Users (4)
| Method | Path | Auth | Body/Query | Description |
|---|---|---|---|---|
| PATCH | `/users/profile` | Auth | FormData: `name?, bio?, profile_photo?` | Update own profile |
| GET | `/users` | Admin | `?role=&page=&limit=` | List users (paginated) |
| GET | `/users/:id` | Admin | — | Get user by ID |
| PATCH | `/users/:id/deactivate` | Admin | — | Deactivate user account |

### 5.3 Stores (8)
| Method | Path | Auth | Body/Query | Description |
|---|---|---|---|---|
| POST | `/stores` | Store | FormData: `name, latitude, longitude, description?, category?, address?, cover_image?` | Create store (max 1 per owner) |
| POST | `/stores/:id/gallery` | Store | FormData: `gallery` (up to 6 files) | Upload gallery images |
| GET | `/stores/search` | Public | `?lat=&lng=&radius=` | Haversine geo-search |
| GET | `/stores/my-store` | Store | — | Get own store with gallery |
| GET | `/stores/all` | Admin | `?status=&page=&limit=` | All stores (paginated) |
| GET | `/stores/:id` | Public | — | Full store detail (menu, gallery, reviews, avg rating) |
| PATCH | `/stores/:id` | Store | FormData: various fields | Update store (owner only) |
| DELETE | `/stores/:id` | Admin | — | Delete store + Cloudinary cleanup |

### 5.4 Foods (4)
| Method | Path | Auth | Body/Query | Description |
|---|---|---|---|---|
| POST | `/foods` | Store | `{store_id, name, price, description?, image_url?, is_available?}` | Add food item |
| GET | `/foods/store/:storeId` | Public | `?available=` | Get store menu |
| PATCH | `/foods/:id` | Store | Partial food fields | Update food (owner check) |
| DELETE | `/foods/:id` | Store | — | Delete food (owner check) |

### 5.5 Reviews (6)
| Method | Path | Auth | Body/Query | Description |
|---|---|---|---|---|
| POST | `/reviews` | User | FormData: `store_id, rating, comment?, images?` (up to 3) | Submit review |
| GET | `/reviews/store/:storeId` | Public | `?page=&limit=` | Get reviews (paginated) |
| PATCH | `/reviews/:id` | User | FormData: `rating?, comment?, images_add?, images_remove?` | Update own review |
| DELETE | `/reviews/:id` | User/Admin | — | Delete review + Cloudinary cleanup |
| POST | `/reviews/:reviewId/reply` | Store | `{reply_text}` | Reply to review |
| PATCH | `/reviews/:reviewId/reply` | Store | `{reply_text?}` | Edit reply |

### 5.6 Suggestions (5)
| Method | Path | Auth | Body/Query | Description |
|---|---|---|---|---|
| POST | `/suggestions` | User | `{name, description?, address?, latitude?, longitude?}` | Submit suggestion |
| GET | `/suggestions/my` | User | — | Get own suggestions |
| GET | `/suggestions` | Admin | `?status=` | List all suggestions |
| PATCH | `/suggestions/:id/approve` | Admin | `{admin_note?}` | Approve → auto-creates store |
| PATCH | `/suggestions/:id/reject` | Admin | `{admin_note?}` | Reject with note |

### 5.7 Claims (4)
| Method | Path | Auth | Body/Query | Description |
|---|---|---|---|---|
| POST | `/claims` | Store | `{store_id, message?}` | Claim unclaimed store |
| GET | `/claims` | Admin | `?status=` | List all claims |
| PATCH | `/claims/:id/approve` | Admin | `{admin_note?}` | Approve → links owner + auto-rejects competing claims |
| PATCH | `/claims/:id/reject` | Admin | `{admin_note?}` | Reject with note |

### 5.8 Admin (3)
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/admin/stats` | Admin | Dashboard stats |
| PATCH | `/admin/stores/:id/suspend` | Admin | Suspend store |
| PATCH | `/admin/stores/:id/activate` | Admin | Activate store |

### 5.9 Uploads (1)
| Method | Path | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/uploads/image` | Auth | FormData: `file, folder` | Generic Cloudinary upload |

---

## 6. Frontend Pages & Design

### 6.1 Layout Structure
- **Root layout:** Noto Sans Bengali + Inter fonts, dark/light oklch color tokens
- **Auth layout** `(auth)/`: Clean split-screen design (illustration left, form right). Redirects to `/` if already logged in.
- **Protected layout** `(protected)/`: Sticky top navbar + footer. Redirects to `/login` if not authenticated.

### 6.2 All Pages

#### Public / Auth Pages
| Page | Route | Design Description |
|---|---|---|
| **Login** | `/login` | Split screen — left side has decorative grid with floating cards showing food emojis, right side has email/password form. Link to signup. |
| **Signup** | `/signup` | Same split-screen layout. Name, email, password, confirm password, role selector (user/store dropdown). Link to login. |

#### User Pages
| Page | Route | Design Description |
|---|---|---|
| **Home** | `/` | Welcome greeting with user name, role-based quick action links (4 cards), nearby stores grid using geolocation with StoreCard components |
| **Stores** | `/stores` | Full-width grid of stores. Has search input (filters by name/category/address), radius dropdown (5/10/20/50 km). Geolocation-based loading. Shows StoreCard grid. |
| **Store Detail** | `/stores/[id]` | Cover image hero, store info (name, category, address, status, rating), tabbed info area. Left side: menu items with prices. Right side: reviews section with pagination. Review form with star rating selector + Tiptap rich text editor + image upload (up to 3). Users can delete own reviews. |
| **Suggest** | `/suggest` | Full-width two-column layout. Left: form fields (name, emoji-labeled category grid, description textarea, address, phone, time schedule) in rounded cards. Right: sticky Leaflet map picker with auto-location button, lat/lng inputs, submit button. Circular progress indicator showing form completion. |
| **My Suggestions** | `/my-suggestions` | List of user's suggestions with status badges (pending/approved/rejected), admin notes visible |
| **My Reviews** | `/my-reviews` | User's reviews loaded by scanning nearby stores. Shows review text, rating, store name, delete button. |
| **Profile** | `/profile` | Three-column layout. Left sidebar: avatar card with gradient header, role badge with emoji, edit/save buttons, quick stats (days since join, active status). Right: bio section with empty-state CTA, account info rows with icons (email, role, status, join date), security section with settings link. |
| **Settings** | `/settings` | Simple form: name input, bio textarea, photo upload. Submit button. |

#### Store Owner Pages
| Page | Route | Design Description |
|---|---|---|
| **My Store** | `/my-store` | If no store: full creation form (name, category, description, address, lat/lng, cover image). If store exists: store dashboard with info display. |
| **Menu** | `/my-store/menu` | CRUD interface for food items. Add form at top, list below with edit/delete. Shows name, price, description, availability toggle. |
| **Gallery** | `/my-store/gallery` | Image grid (max 6), upload button, remove button per image. |
| **Store Reviews** | `/my-store/reviews` | View customer reviews. Reply form (one reply per review). Edit reply functionality. |
| **Claim Store** | `/claim` | Dropdown of unclaimed stores, message textarea, submit button. |

#### Admin Pages
| Page | Route | Design Description |
|---|---|---|
| **Dashboard** | `/admin` | Stats cards (total users, stores, reviews, pending suggestions, pending claims, active stores). Navigation links to management pages. |
| **Users** | `/admin/users` | Table/list with role filter tabs, pagination. Deactivate button per user. |
| **Stores** | `/admin/stores` | Table/list with status filter. Suspend/activate/delete actions. |
| **Suggestions** | `/admin/suggestions` | List with status filter. Approve/reject with admin note input. |
| **Claims** | `/admin/claims` | List with status filter. Approve/reject with admin note input. |

#### Static Pages
| Page | Route | Content |
|---|---|---|
| **About** | `/about` | Platform description, team info |
| **Contact** | `/contact` | Contact form (non-functional), info display |
| **Help** | `/help` | FAQ accordion |
| **Privacy** | `/privacy` | Privacy policy text |
| **Terms** | `/terms` | Terms of service text |
| **Popular** | `/popular` | Hardcoded popular food ranking |

---

## 7. Key Components

| Component | Description |
|---|---|
| **Navbar** | Sticky header. Role-based navigation links. Profile avatar + name. Mobile hamburger menu. Logout with AlertDialog confirmation. |
| **Footer** | 4-column footer: Explore (stores, popular, suggest), Account (profile, my reviews, settings), About (about, contact, help, privacy, terms). |
| **StoreCard** | Rounded card with cover image (hover scale + gradient overlay), rating badge (top-right), distance badge (bottom-left), store name, category chip, review count, address. No shadows. |
| **MapPicker** | Leaflet map component. Click to place marker. Draggable marker. Auto-detect location button. Uses OpenStreetMap tiles. |
| **TiptapEditor** | Full rich text editor with grouped toolbar: Bold, Italic, Underline, Strikethrough, Highlight, H1/H2/H3, Bullet/Ordered list, Blockquote, Code block, Inline code, Text alignment (L/C/R), Link, Subscript, Superscript, Horizontal rule, Clear formatting, Undo/Redo. Custom CSS for rendered HTML output. |
| **Providers** | Wraps app in `QueryClientProvider` + `AuthProvider`. |
| **UI Components** | shadcn/ui: Button (with variants), Input, Label, Card, AlertDialog. |

---

## 8. Design System

### Fonts
- **Primary:** Noto Sans Bengali (Bengali text) + Inter (Latin text)
- **Monospace:** JetBrains Mono (code, coordinates)

### Colors (oklch)
- Light primary: `oklch(0.5635 0.2408 260.8178)` — deep blue
- Dark primary: `oklch(0.6231 0.1880 259.8145)` — lighter blue
- Uses oklch color system throughout for perceptually uniform colors

### Design Principles (Current)
- **No shadows** — User preference, all shadow variables exist but kept minimal
- **No background colors on sections** — Transparent/clean
- **No stats/numbers sections** — User preference
- **Minimal, modern** — Clean borders, rounded corners (rounded-2xl), subtle border opacity (border-border/30)
- **Hover effects:** Scale transforms on images, color transitions on text, border color changes
- **Spacing:** Consistent use of Tailwind spacing scale

### Dark Mode
- Full dark mode support via oklch color tokens
- `.dark` class-based switching (though no toggle UI currently implemented)

---

## 9. State Management

- **Server state:** TanStack Query for all API data (auto-caching, invalidation, refetching)
- **Auth state:** React Context (`AuthContext`) backed by TanStack Query (`["auth", "me"]` query key)
- **Form state:** Local `useState` in each page
- **No global client state library** (no Zustand, Redux, etc.)

---

## 10. Current Business Logic

### Store Creation
- Store owners can create **one store** (enforced backend)
- Stores start as `active` with `is_claimed: true` when created by owner
- Stores auto-created from approved suggestions start as `active` with `is_claimed: false`

### Review System
- One review per user per store (unique constraint)
- Rating 1-5 stars with optional rich text comment (HTML)
- Up to 3 images per review (Cloudinary)
- Store owner can reply once per review

### Suggestion → Store Pipeline
- User suggests → Admin reviews → On approve: auto-creates store entry (unclaimed, no owner)
- The auto-created store can then be claimed by a store owner

### Claim System
- Store role users can claim unclaimed stores
- Admin approves → owner_id set, is_claimed=true, competing pending claims auto-rejected

### Geolocation
- Haversine formula for distance calculation (SQL-level)
- Default coordinates: Chittagong, Bangladesh (22.3565, 91.8199)
- Frontend requests browser geolocation, falls back to default

---

## 11. Known Limitations & Issues

### Frontend
1. **No dark mode toggle** — Dark mode CSS exists but no UI to switch
2. **No Next.js middleware** — All auth/role protection is client-side only
3. **My Reviews page is inefficient** — Scans all nearby stores to find user's reviews instead of a dedicated API endpoint
4. **Popular page is hardcoded** — Static data, not from API
5. **Contact form is non-functional** — No backend endpoint
6. **No search page** — Was removed; store filtering exists on `/stores` page
7. **No image optimization** — Using plain `<img>` tags instead of `next/image`
8. **No loading skeletons** — Only spinner loading states
9. **No error boundaries** — Errors may crash the page
10. **No SEO optimization** — Missing meta tags, OG tags, structured data
11. **No PWA support** — No service worker, no offline capability
12. **Settings and Profile pages overlap** — Both allow editing name/bio/photo
13. **No pagination on home page** — Shows all nearby stores at once
14. **No toast/notification system** — Success/error messages are inline only

### Backend
1. **No refresh token** — Single JWT, if expired user must re-login
2. **No rate limiting** — API vulnerable to abuse
3. **No email verification** — Users can register with any email
4. **No password reset** — No forgot password flow
5. **No input sanitization for HTML** — Tiptap HTML stored directly (XSS risk on render)
6. **No image size/dimension validation** — Only max 5MB limit
7. **No logging/monitoring** — No structured logging, no health checks
8. **JWT expiry mismatch** — JWT defaults 15 min but cookie is 30 days
9. **Supabase client configured but unused** — Only using Prisma for DB access
10. **No automated tests** — Only boilerplate e2e spec exists
11. **No caching** — No Redis, no API-level caching
12. **No webhooks/notifications** — No email or push notifications
13. **CORS limited** — Only localhost:3000 and one Vercel domain

### Database
1. **No full-text search index** — Store search is client-side name/category filter
2. **No audit log** — No tracking of admin actions
3. **No soft delete** — Hard deletes everywhere

---

## 12. Seed Data

The database is seeded with:
- **2 admin accounts** (admin@streetfood.com / Admin@123456)
- **15 regular users** (alice@example.com, etc. / User@1234)
- **8 store owners** (ravi@momos.com, etc. / Store@1234)
- **12 stores** in Chittagong area (8 claimed, 4 unclaimed)
- **~80 food items** across stores
- **43 reviews** with comments
- **16 review replies**
- **10 suggestions** (mixed status)
- **5 claims** (mixed status)

---

## 13. File Structure

### Frontend (`street-food/`)
```
app/
├── globals.css          (Tailwind v4 config, oklch tokens, tiptap styles)
├── layout.tsx           (Root: fonts, Providers wrapper)
├── (auth)/
│   ├── layout.tsx       (Redirects to / if authenticated)
│   ├── login/page.tsx   (Split-screen login)
│   └── signup/page.tsx  (Split-screen signup with role selection)
└── (protected)/
    ├── layout.tsx       (Auth guard, Navbar + Footer wrapper)
    ├── page.tsx         (Home — welcome + nearby stores)
    ├── stores/page.tsx  (Store listing with search + radius)
    ├── stores/[id]/page.tsx (Store detail + reviews)
    ├── suggest/page.tsx (Two-column suggest form + map)
    ├── my-suggestions/page.tsx
    ├── my-reviews/page.tsx
    ├── claim/page.tsx
    ├── my-store/page.tsx
    ├── my-store/menu/page.tsx
    ├── my-store/gallery/page.tsx
    ├── my-store/reviews/page.tsx
    ├── profile/page.tsx (Three-column profile + edit)
    ├── settings/page.tsx
    ├── admin/page.tsx
    ├── admin/users/page.tsx
    ├── admin/stores/page.tsx
    ├── admin/suggestions/page.tsx
    ├── admin/claims/page.tsx
    ├── about/page.tsx
    ├── contact/page.tsx
    ├── help/page.tsx
    ├── privacy/page.tsx
    ├── terms/page.tsx
    └── popular/page.tsx

components/
├── navbar.tsx
├── footer.tsx
├── store-card.tsx
├── map-picker.tsx
├── tiptap-editor.tsx
├── providers.tsx
└── ui/ (button, input, label, card, alert-dialog)

lib/
├── api.ts (Axios instance)
├── auth.ts, stores.ts, reviews.ts, foods.ts
├── users.ts, admin.ts, claims.ts, suggestions.ts
├── images.ts (fallback image mapping)
├── types.ts (all TypeScript interfaces)
└── utils.ts (cn helper)

context/
└── auth-context.tsx
```

### Backend (`street-food-backend/`)
```
prisma/
├── schema.prisma        (9 models)
├── seed.ts              (Full seed data)
└── migrations/

src/
├── main.ts              (Bootstrap, global pipes/guards/filters/interceptors)
├── app.module.ts        (Root module)
├── auth/                (controller, service, module, dto/)
├── users/               (controller, service, module, dto/)
├── stores/              (controller, service, module, dto/)
├── foods/               (controller, service, module, dto/)
├── reviews/             (controller, service, module, dto/)
├── suggestions/         (controller, service, module, dto/)
├── claims/              (controller, service, module, dto/)
├── admin/               (controller, service, module)
├── uploads/             (controller, module — generic image upload)
├── common/
│   ├── guards/          (jwt-auth.guard, roles.guard)
│   ├── decorators/      (public, roles, current-user)
│   ├── filters/         (http-exception.filter)
│   └── interceptors/    (response.interceptor)
├── config/              (cloudinary, jwt, supabase)
└── database/            (prisma.service, supabase.service, database.module)
```

---

## 14. Deployment Configuration

### Frontend (Vercel)
- Auto-deploys from Git
- Environment variable: `NEXT_PUBLIC_API_URL`

### Backend (Vercel Serverless)
- Entry point: `api/index.js` (creates NestJS app, caches instance)
- `vercel.json` rewrites all routes to `/api`
- Environment variables: `DATABASE_URL`, `DIRECT_URL`, `JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `CLOUDINARY_*`, `SUPABASE_*`, `FRONTEND_URL`

---

*This document reflects the project state as of April 26, 2026.*
