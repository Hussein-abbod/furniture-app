from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.database import engine
from app.core.config import settings
from app.models import Admin, Product
from app.core.database import Base
from app.routers import auth, products, users, cart, favorites, orders, contact
from app.routers import settings as settings_router

# Create tables
Base.metadata.create_all(bind=engine)

# Ensure upload dir exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app = FastAPI(
    title="Furniture Store API",
    description="Backend API for the Maison Furniture e-commerce platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for uploads
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(users.router)
app.include_router(cart.router)
app.include_router(favorites.router)
app.include_router(orders.router)
app.include_router(contact.router)
app.include_router(settings_router.router)


@app.get("/api/health")
async def health():
    return {"status": "healthy", "app": "Maison Furniture API"}
