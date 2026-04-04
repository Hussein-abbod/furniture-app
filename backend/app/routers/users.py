from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.security import get_current_user, get_password_hash
from ..models.user import User
from ..schemas.schemas import UserResponse, UserProfileUpdate

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    update_data: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if update_data.full_name is not None:
        current_user.full_name = update_data.full_name
    if update_data.email is not None:
        # Check if email is taken
        if current_user.email != update_data.email:
            existing = db.query(User).filter(User.email == update_data.email).first()
            if existing:
                raise HTTPException(status_code=400, detail="Email already taken")
            current_user.email = update_data.email
    if update_data.password is not None:
        if len(update_data.password) < 6:
            raise HTTPException(status_code=400, detail="Password too short")
        current_user.password_hash = get_password_hash(update_data.password)
    # avatar_url is typically handled via a specific upload endpoint, but we can set it here too
    if update_data.avatar_url is not None:
        current_user.avatar_url = update_data.avatar_url

    if update_data.address is not None:
        current_user.address = update_data.address
    if update_data.city is not None:
        current_user.city = update_data.city
    if update_data.country is not None:
        current_user.country = update_data.country
    if update_data.phone is not None:
        current_user.phone = update_data.phone

    db.commit()
    db.refresh(current_user)
    return current_user
