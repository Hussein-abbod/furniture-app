from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ── Auth Schemas ──────────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str

class SignupRequest(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=150)
    email: str
    password: str = Field(..., min_length=6)

class GoogleLoginRequest(BaseModel):
    token: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin_id: int
    username: str


# ── Product Schemas ───────────────────────────────────────────────
class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    image_url: Optional[str] = None
    category: str = Field(..., min_length=1)
    stock: int = Field(default=0, ge=0)
    is_featured: Optional[int] = 0


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    image_url: Optional[str] = None
    category: Optional[str] = None
    stock: Optional[int] = Field(None, ge=0)
    is_featured: Optional[int] = None


class ProductResponse(ProductBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# ── Admin Schemas ─────────────────────────────────────────────────
class AdminCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=6)
    email: Optional[str] = None

class AdminUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=100)
    password: Optional[str] = Field(None, min_length=6)


class AdminResponse(BaseModel):
    id: int
    username: str
    email: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ── User Schemas ──────────────────────────────────────────────────
class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    avatar_url: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    full_name: Optional[str]
    email: str
    avatar_url: Optional[str]
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None
    is_active: bool
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

# ── Cart Schemas ──────────────────────────────────────────────────
class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(default=1, gt=0)

class CartItemUpdate(BaseModel):
    quantity: int = Field(..., gt=0)

class CartItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    added_at: Optional[datetime]
    product: ProductResponse

    class Config:
        from_attributes = True

# ── Favorite Schemas ───────────────────────────────────────────────
class FavoriteCreate(BaseModel):
    product_id: int

class FavoriteResponse(BaseModel):
    id: int
    product_id: int
    added_at: Optional[datetime]
    product: ProductResponse

    class Config:
        from_attributes = True

# ── Order Schemas ──────────────────────────────────────────────────
class CheckoutRequest(BaseModel):
    full_name: str
    address: str
    city: str
    country: str
    phone: str

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    unit_price: float
    category: Optional[str]
    product: ProductResponse

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    shipping_name: Optional[str] = None
    shipping_address: Optional[str] = None
    shipping_city: Optional[str] = None
    shipping_country: Optional[str] = None
    shipping_phone: Optional[str] = None
    created_at: Optional[datetime]
    user: Optional[UserResponse] = None
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True
