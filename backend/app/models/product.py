from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Enum
from sqlalchemy.sql import func
from ..core.database import Base
import enum


class CategoryEnum(str, enum.Enum):
    living_room = "Living Room"
    bedroom = "Bedroom"
    dining_room = "Dining Room"
    office = "Office"
    outdoor = "Outdoor"
    kitchen = "Kitchen"
    bathroom = "Bathroom"
    hallway = "Hallway"


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    image_url = Column(String(500), nullable=True)
    category = Column(String(100), nullable=False, index=True)
    stock = Column(Integer, default=0, nullable=False)
    is_featured = Column(Integer, default=0)  # 0 or 1
    total_sold = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
