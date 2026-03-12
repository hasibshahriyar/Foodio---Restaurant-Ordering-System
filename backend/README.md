# Foodio Backend — NestJS REST API

NestJS + TypeORM + PostgreSQL backend for the Foodio restaurant ordering system.

**Base URL (production):** https://foodio-backend-9v1l.onrender.com

---

## Tech Stack

- **Framework:** NestJS (TypeScript)
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Auth:** JWT (Bearer token), bcrypt
- **Validation:** class-validator, class-transformer
- **File Uploads:** Multer (local `/uploads` directory)

---

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

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

### 3. Create the database

```sql
CREATE DATABASE foodio;
```

### 4. Run in development

```bash
npm run start:dev
```

API available at `http://localhost:3001`.

### 5. Seed the database

Run **once** to populate users, categories, and menu items:

```bash
npm run seed
```

Seed credentials:

| Role  | Email            | Password |
|-------|------------------|----------|
| Admin | admin@foodio.com | admin123 |
| User  | user@foodio.com  | user123  |

---

## API Endpoints

### Auth
| Method | Endpoint       | Auth   | Description           |
|--------|----------------|--------|-----------------------|
| POST   | /auth/register | Public | Register new user     |
| POST   | /auth/login    | Public | Login, returns JWT    |
| GET    | /auth/me       | User   | Get current user info |

### Categories
| Method | Endpoint        | Auth   | Description      |
|--------|-----------------|--------|------------------|
| GET    | /categories     | Public | List categories  |
| POST   | /categories     | Admin  | Create category  |
| DELETE | /categories/:id | Admin  | Delete category  |

### Menu Items
| Method | Endpoint        | Auth   | Description                                   |
|--------|-----------------|--------|-----------------------------------------------|
| GET    | /menu-items     | Public | List items (filter by category, search, sort) |
| GET    | /menu-items/:id | Public | Get single item                               |
| POST   | /menu-items     | Admin  | Create item (multipart/form-data)             |
| PUT    | /menu-items/:id | Admin  | Update item                                   |
| DELETE | /menu-items/:id | Admin  | Delete item                                   |

### Orders
| Method | Endpoint           | Auth  | Description                  |
|--------|--------------------|-------|------------------------------|
| POST   | /orders            | User  | Place order                  |
| GET    | /orders/my-orders  | User  | Get current user orders      |
| GET    | /orders            | Admin | List all orders (paginated)  |
| GET    | /orders/:id        | Admin | Get order details            |
| PATCH  | /orders/:id/status | Admin | Update order status          |

---

## Project Structure

```
src/
├── auth/           # JWT strategy, guards, decorators
├── users/          # User entity & service
├── categories/     # Category CRUD
├── menu-items/     # Menu item CRUD + image upload
├── orders/         # Order placement & status management
├── seed/           # Database seeder script
└── main.ts         # App bootstrap, CORS, ValidationPipe
uploads/            # Uploaded images (gitignored)
```

---

## Build for Production

```bash
npm run build
npm run start:prod
```
