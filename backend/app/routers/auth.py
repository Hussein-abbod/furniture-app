from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.security import verify_password, create_access_token, get_password_hash
from ..core.cookies import set_auth_cookie, clear_auth_cookie
from ..core.rate_limit import rate_limit_login
from ..models.admin import Admin
from ..models.user import User
from ..schemas.schemas import LoginRequest, SignupRequest

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login")
async def login(
    request: LoginRequest, 
    response: Response, 
    db: Session = Depends(get_db),
    _=Depends(rate_limit_login)
):
    # Try Admin login first
    admin = db.query(Admin).filter(Admin.username == request.username).first()
    if admin and verify_password(request.password, admin.password_hash):
        token = create_access_token(data={"sub": admin.username, "role": "admin"})
        set_auth_cookie(response, token)
        return {"role": "admin", "username": admin.username}

    # Try User login
    # In user case, username field maps to email in the user table
    user = db.query(User).filter(User.email == request.username).first()
    if user and verify_password(request.password, user.password_hash):
        if not user.is_active:
            raise HTTPException(status_code=400, detail="Account is disabled")
        token = create_access_token(data={"sub": user.email, "role": "user"})
        set_auth_cookie(response, token)
        return {"role": "user", "username": user.full_name, "email": user.email}

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid username/email or password",
    )

@router.post("/signup")
async def signup(request: SignupRequest, response: Response, db: Session = Depends(get_db)):
    # Check if email exists
    if db.query(User).filter(User.email == request.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if admin has this username/email (just in case they collide)
    if db.query(Admin).filter(Admin.username == request.email).first():
        raise HTTPException(status_code=400, detail="Email already registered as admin")

    hashed_pw = get_password_hash(request.password)
    user = User(
        full_name=request.full_name,
        email=request.email,
        password_hash=hashed_pw
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Auto-login upon signup
    token = create_access_token(data={"sub": user.email, "role": "user"})
    set_auth_cookie(response, token)
    return {"role": "user", "username": user.full_name, "email": user.email}

@router.post("/logout")
async def logout(response: Response):
    clear_auth_cookie(response)
    return {"status": "ok"}

@router.get("/me")
async def get_me(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        return {"isAuthenticated": False}
    
    from jose import JWTError, jwt
    from ..core.config import settings
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        role = payload.get("role")
        sub = payload.get("sub")
        if role == "admin":
            admin = db.query(Admin).filter(Admin.username == sub).first()
            if admin:
                return {"isAuthenticated": True, "role": "admin", "username": admin.username}
        elif role == "user":
            user = db.query(User).filter(User.email == sub).first()
            if user and user.is_active:
                return {"isAuthenticated": True, "role": "user", "username": user.full_name, "email": user.email}
    except JWTError:
        pass
    
    return {"isAuthenticated": False}
