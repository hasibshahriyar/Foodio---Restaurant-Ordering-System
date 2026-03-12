# Foodio 🍽️ — Restaurant Ordering System

A full-stack restaurant ordering system built with **Next.js**, **NestJS**, **TypeScript**, and **PostgreSQL**.

**Live Demo:** https://foodio-nine.vercel.app  
**Backend API:** https://foodio-backend-9v1l.onrender.com

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | Next.js 14, TypeScript, Tailwind CSS            |
| Backend    | NestJS, TypeScript, TypeORM                     |
| Database   | PostgreSQL                                      |
| Auth       | JWT (Bearer token), bcrypt password hashing     |
| Deployment | Vercel (frontend), Render (backend)             |

---

## Features

### User (Public / Authenticated)
- Browse menu by category with live search and sort/filter
- Add items to cart (persisted in localStorage)
- Place consolidated orders
- Track order status: Pending → Preparing → Ready → Completed

### Admin
- Redirected to `/admin` dashboard automatically on login
- Manage menu items (Create / Edit / Delete, image upload, availability toggle)
- Manage categories (Create / Delete)
- View all orders with pagination
- Update order status inline via dropdown

### Performance
- Vercel Speed Insights integrated for real-user performance monitoring

---

## Prerequisites

- Node.js v18+
- PostgreSQL (running locally or via Docker)
- npm

---

## Setup — Backend

### 1. Configure environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=foodio

JWT_SECRET=foodio_jwt_secret_2026
JWT_EXPIRES_IN=7d

PORT=3001
```

### 2. Create the database

```sql
CREATE DATABASE foodio;
```

### 3. Install dependencies & run

```bash
npm install
npm run start:dev
```

The API will be available at `http://localhost:3001`.

### 4. Seed the database

Run this **once** to seed users, categories, and menu items:

```bash
npm run seed
```

This creates:

| Role  | Email              | Password |
|-------|--------------------|----------|
| Admin | admin@foodio.com   | admin123 |
| User  | user@foodio.com    | user123  |

And the following categories + 9 menu items (Starters, Main Courses, Desserts).

---

## Setup — Frontend

### 1. Configure environment

```bash
cd frontend
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Install dependencies & run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Running Both Together

Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

---

## Project Structure

```
Foodio/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── auth/         # JWT authentication
│   │   ├── users/        # User entity & service
│   │   ├── categories/   # Category CRUD
│   │   ├── menu-items/   # Menu item CRUD + image upload
│   │   ├── orders/       # Order placement & tracking
│   │   └── seed/         # Database seeder
│   └── uploads/          # Uploaded images (gitignored)
│
└── frontend/             # Next.js app
    └── src/
        ├── app/
        │   ├── page.tsx          # Homepage
        │   ├── menu/             # Food menu page
        │   ├── my-orders/        # User order history
        │   ├── auth/             # Sign in / Register
        │   └── admin/            # Admin dashboard
        ├── components/           # Shared UI components
        ├── context/              # Auth + Cart context
        └── lib/                  # API client, types, cart utils
```

---

## API Endpoints

| Method | Endpoint                    | Auth     | Description              |
|--------|-----------------------------|----------|--------------------------|
| POST   | /auth/register              | Public   | Register new user        |
| POST   | /auth/login                 | Public   | Login + get JWT token    |
| GET    | /auth/me                    | User     | Get current user         |
| GET    | /categories                 | Public   | List all categories      |
| POST   | /categories                 | Admin    | Create category          |
| DELETE | /categories/:id             | Admin    | Delete category          |
| GET    | /menu-items                 | Public   | List items (filter/sort) |
| POST   | /menu-items                 | Admin    | Create menu item         |
| PUT    | /menu-items/:id             | Admin    | Update menu item         |
| DELETE | /menu-items/:id             | Admin    | Delete menu item         |
| POST   | /orders                     | User     | Place order              |
| GET    | /orders/my-orders           | User     | Get my orders            |
| GET    | /orders                     | Admin    | List all orders          |
| PATCH  | /orders/:id/status          | Admin    | Update order status      |

---

## Build for Production

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm run build
npm run start
```

---

## Deployment

| Service  | Platform | URL                                          |
|----------|----------|----------------------------------------------|
| Frontend | Vercel   | https://foodio-nine.vercel.app               |
| Backend  | Render   | https://foodio-backend-9v1l.onrender.com     |

The backend is kept alive via a GitHub Actions workflow (`.github/workflows/keep-alive.yml`) that pings it every 14 minutes to prevent Render's free tier from sleeping.

---

## License

MIT
