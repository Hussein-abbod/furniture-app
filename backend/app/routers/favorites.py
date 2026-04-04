from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..core.database import get_db
from ..core.security import get_current_user
from ..models.user import User
from ..models.favorite import Favorite
from ..models.product import Product
from ..schemas.schemas import FavoriteResponse, FavoriteCreate

router = APIRouter(prefix="/api/favorites", tags=["Favorites"])

@router.get("", response_model=List[FavoriteResponse])
async def get_favorites(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.query(Favorite).filter(Favorite.user_id == current_user.id).all()
    return items

@router.post("", response_model=FavoriteResponse)
async def toggle_favorite(
    fav_in: FavoriteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == fav_in.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.product_id == fav_in.product_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        raise HTTPException(status_code=204, detail="Removed from favorites")
    
    new_fav = Favorite(user_id=current_user.id, product_id=fav_in.product_id)
    db.add(new_fav)
    db.commit()
    db.refresh(new_fav)
    return new_fav


