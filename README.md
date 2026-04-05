# 🛋️ Maison — Premium Furniture Store

A full-stack furniture e-commerce application built with **FastAPI**, **React**, and **MySQL**. Designed with a premium aesthetic, featuring a seamless user experience and a robust admin dashboard.

---

## ✨ Features

- **🛍️ Premium Shopping Experience**:
    - Smooth scroll-to-top navigation transitions.
    - Responsive, mobile-first design with high-end typography.
    - Category-based browsing and featured product carousels.
    - Real-time search and multi-filter (category, price, featured).
- **🔐 Secure Admin Panel**:
    - JWT-based authentication for secure access.
    - Password visibility toggle on login for better UX.
    - Full product CRUD (Create, Read, Update, Delete).
    - Dashboard with live sales stats and category distribution charts.
- **🖼️ Media Handling**:
    - Image upload support (local storage + URL).
    - Skeleton loading states for a polished feel.
- **📦 Pre-seeded Data**:
    - Comes with 19 sample products across 6 curated categories.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Routing**: React Router DOM 6
- **Icons**: Lucide React
- **Animations**: CSS Transitions & Smooth Scroll API
- **State/Auth**: Context API (AuthContext)
- **Styling**: Vanilla CSS (Global Design System)

### Backend
- **Framework**: FastAPI (Python 3.12+)
- **ORM**: SQLAlchemy 2.0
- **Authentication**: JWT (Jose) + Passlib (Bcrypt)
- **Web Server**: Uvicorn / Gunicorn
- **Validation**: Pydantic v2

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
    │   │   ├── admin/        # Layouts, ProtectedRoute
    │   │   ├── shop/         # Navbar, Footer, ProductCard
    │   │   └── ui/           # Skeleton, Pagination
    │   ├── context/          # Auth & Global state
    │   ├── pages/            # Shop & Admin views
    │   ├── utils/            # api.js (Axios layer)
    │   └── main.jsx
    └── package.json
```

---

## 🚀 Local Quick Start

### 1. Database Setup
Ensure you have MySQL running and create the database:
```sql
CREATE DATABASE furniture_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env      # Configure your local DB credentials
python seed.py            # Initialize tables and sample data
uvicorn main:app --reload --port 8000
```
> API Docs: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
> App: [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deployment (Azure)

This application is optimized for deployment using **Azure for Students**.

1. **Frontend**: Hosted on **Azure Static Web Apps**.
2. **Backend**: Hosted on **Azure App Service (Linux)**.
3. **Database**: Hosted on **Azure Database for MySQL (Flexible Server)**.

### Production Environment Variables
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend URL for the frontend. |
| `DATABASE_URL` | MySQL connection string for the backend. |
| `SECRET_KEY` | JWT signing key. |

---

## 🔑 Default Credentials (Local)

| Field    | Value      |
|----------|------------|
| Username | `admin`    |
| Password | `admin123` |

> ⚠️ **Caution**: Change these credentials immediately after deploying to a production environment.
