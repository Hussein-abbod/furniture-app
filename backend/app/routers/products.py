from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import Optional, List
import os, uuid
import aiofiles
from ..core.database import get_db
from ..core.security import get_current_admin
from ..core.config import settings
from ..models.product import Product
from ..models.admin import Admin
from ..schemas.schemas import ProductCreate, ProductUpdate, ProductResponse, ProductListResponse

router = APIRouter(prefix="/api/products", tags=["Products"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


# ── Public endpoints ──────────────────────────────────────────────
@router.get("", response_model=ProductListResponse)
async def get_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    featured: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Product)

    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.description.ilike(f"%{search}%"),
            )
        )
    if category:
        query = query.filter(Product.category == category)
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    if featured is not None:
        query = query.filter(Product.is_featured == (1 if featured else 0))

    total = query.count()
    total_pages = max(1, -(-total // page_size))
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    return ProductListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/categories", response_model=List[str])
async def get_categories(db: Session = Depends(get_db)):
    results = db.query(Product.category).distinct().all()
    return [r[0] for r in results]


@router.get("/featured", response_model=List[ProductResponse])
async def get_featured(db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.is_featured == 1).limit(8).all()


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# ── Admin-protected endpoints ─────────────────────────────────────
@router.post("", response_model=ProductResponse, status_code=201)
async def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)

    db.commit()
    db.refresh(db_product)
    return db_product


@router.delete("/{product_id}", status_code=204)
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()


@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    _admin: Admin = Depends(get_current_admin),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only image files are allowed")

    content = await file.read()
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large (max 5MB)")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    ext = file.filename.rsplit(".", 1)[-1].lower()
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join(settings.UPLOAD_DIR, filename)

    async with aiofiles.open(filepath, "wb") as f:
        await f.write(content)

    return {"image_url": f"/uploads/{filename}"}


@router.get("/admin/stats")
async def get_stats(
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    from ..models.order import Order

    total_products = db.query(func.count(Product.id)).scalar()
    total_stock = db.query(func.sum(Product.stock)).scalar() or 0
    categories = db.query(Product.category, func.count(Product.id)).group_by(Product.category).all()
    low_stock = db.query(Product).filter(Product.stock <= 5).count()

    total_orders = db.query(func.count(Order.id)).scalar() or 0
    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0
    total_sales = db.query(func.sum(Product.total_sold)).scalar() or 0

    return {
        "total_products": total_products,
        "total_stock": total_stock,
        "categories": [{"name": c[0], "count": c[1]} for c in categories],
        "low_stock_count": low_stock,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "total_sales": total_sales,
    }


@router.get("/admin/chart-data")
async def get_chart_data(
    period: str = Query("month", regex="^(day|month|year)$"),
    db: Session = Depends(get_db),
    _admin: Admin = Depends(get_current_admin),
):
    """
    Returns revenue + order count aggregated by period (day/month/year).
    """
    from ..models.order import Order
    from datetime import datetime, timedelta

    now = datetime.now()

    if period == "day":
        # Last 30 days
        start = now - timedelta(days=30)
        date_fmt = func.date_format(Order.created_at, "%Y-%m-%d")
        label_fmt = func.date_format(Order.created_at, "%d %b")
    elif period == "month":
        # Last 12 months
        start = now - timedelta(days=365)
        date_fmt = func.date_format(Order.created_at, "%Y-%m")
        label_fmt = func.date_format(Order.created_at, "%b %Y")
    else:  # year
        start = now - timedelta(days=365 * 5)
        date_fmt = func.date_format(Order.created_at, "%Y")
        label_fmt = func.date_format(Order.created_at, "%Y")

    rows = (
        db.query(
            date_fmt.label("period_key"),
            label_fmt.label("label"),
            func.coalesce(func.sum(Order.total_amount), 0).label("revenue"),
            func.count(Order.id).label("orders"),
        )
        .filter(Order.created_at >= start)
        .group_by("period_key", "label")
        .order_by("period_key")
        .all()
    )

    return {
        "labels": [r.label for r in rows],
        "revenue": [float(r.revenue) for r in rows],
        "orders": [int(r.orders) for r in rows],
    }

