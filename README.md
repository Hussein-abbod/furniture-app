# 🛋️ Maison — Premium Furniture Store

A full-stack furniture e-commerce application built with **FastAPI**, **React**, and **MySQL**.

---

## 📁 Project Structure

```
furniture-app/
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── core/             # Config, DB, Security
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── routers/          # API route handlers
│   │   └── schemas/          # Pydantic validation schemas
│   ├── main.py               # FastAPI application entry
│   ├── seed.py               # Database seeder (sample data)
│   └── requirements.txt
│
└── frontend/                 # React + Vite frontend
    ├── src/
    │   ├── assets/styles/    # Global CSS design system
    │   ├── components/
    │   │   ├── admin/        # AdminLayout, ProtectedRoute
    │   │   ├── shop/         # Navbar, Footer, ProductCard, ShopLayout
    │   │   └── ui/           # SkeletonCard, Pagination
    │   ├── context/          # AuthContext (JWT)
    │   ├── hooks/            # useProducts, useCategories, useStats
    │   ├── pages/
    │   │   ├── admin/        # Login, Dashboard, Products, ProductForm
    │   │   └── shop/         # Home, Products, ProductDetail
    │   ├── utils/            # api.js (Axios layer)
    │   ├── App.jsx           # Router
    │   └── main.jsx
    └── package.json
```

---

## 🚀 Quick Start

### 1. MySQL Database

```sql
CREATE DATABASE furniture_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install pydantic-settings    # if not included

# Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials

# Seed the database (creates tables + admin + 19 sample products)
python seed.py

# Start the API server
uvicorn main:app --reload --port 8000
```

> API docs: http://localhost:8000/api/docs

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

> App: http://localhost:5173

---

## 🔑 Default Credentials

| Field    | Value      |
|----------|------------|
| Username | `admin`    |
| Password | `admin123` |

> ⚠️ Change these in production!

---

## 🌐 API Endpoints

| Method | Endpoint                        | Auth | Description              |
|--------|---------------------------------|------|--------------------------|
| POST   | `/api/auth/login`               | —    | Admin login (JWT)        |
| GET    | `/api/products`                 | —    | List products (paginated)|
| GET    | `/api/products/{id}`            | —    | Get product detail       |
| GET    | `/api/products/featured`        | —    | Get featured products    |
| GET    | `/api/products/categories`      | —    | Get all categories       |
| POST   | `/api/products`                 | ✅   | Create product           |
| PUT    | `/api/products/{id}`            | ✅   | Update product           |
| DELETE | `/api/products/{id}`            | ✅   | Delete product           |
| POST   | `/api/products/upload-image`    | ✅   | Upload product image     |
| GET    | `/api/products/admin/stats`     | ✅   | Dashboard stats          |

### Query Parameters (GET /api/products)

| Param      | Type    | Description                |
|------------|---------|----------------------------|
| page       | int     | Page number (default: 1)   |
| page_size  | int     | Items per page (default: 12)|
| search     | string  | Search by name/description |
| category   | string  | Filter by category         |
| min_price  | float   | Minimum price filter       |
| max_price  | float   | Maximum price filter       |
| featured   | bool    | Show featured only         |

---

## 🎨 Design System

| Token         | Value     |
|---------------|-----------|
| Primary Green | `#0C3B2E` |
| Soft Green    | `#6D9773` |
| Accent Orange | `#B46617` |
| Yellow        | `#FFBA00` |
| Background    | `#faf9f6` |

Fonts: **Cormorant Garamond** (display) + **DM Sans** (body)

---

## 📦 Database Tables

### `admins`
| Column        | Type         |
|---------------|--------------|
| id            | INT PK       |
| username      | VARCHAR(100) |
| email         | VARCHAR(255) |
| password_hash | VARCHAR(255) |
| created_at    | DATETIME     |

### `products`
| Column      | Type         |
|-------------|--------------|
| id          | INT PK       |
| name        | VARCHAR(255) |
| description | TEXT         |
| price       | FLOAT        |
| image_url   | VARCHAR(500) |
| category    | VARCHAR(100) |
| stock       | INT          |
| is_featured | INT (0/1)    |
| created_at  | DATETIME     |
| updated_at  | DATETIME     |

---

## ✨ Features

- ✅ JWT-based admin authentication
- ✅ Full product CRUD (Create, Read, Update, Delete)
- ✅ Image upload (file + URL)
- ✅ Pagination on all product lists
- ✅ Search + multi-filter (category, price, featured)
- ✅ Skeleton loading states
- ✅ Toast notifications
- ✅ Responsive, mobile-first design
- ✅ 19 pre-seeded sample products across 6 categories
- ✅ Admin dashboard with live stats & category chart
