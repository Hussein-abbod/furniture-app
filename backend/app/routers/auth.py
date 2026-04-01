from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.security import verify_password, create_access_token
from ..models.admin import Admin
from ..schemas.schemas import LoginRequest, Token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/login", response_model=Token)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.username == request.username).first()
    if not admin or not verify_password(request.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    token = create_access_token(data={"sub": admin.username})
    return Token(
        access_token=token,
        token_type="bearer",
        admin_id=admin.id,
        username=admin.username,
    )


@router.get("/me")
async def get_me(db: Session = Depends(get_db)):
    """Health check for auth"""
    return {"status": "ok"}
