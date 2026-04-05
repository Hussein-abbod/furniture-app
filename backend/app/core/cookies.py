from fastapi import Response
from .config import settings

def set_auth_cookie(response: Response, token: str):
    """
    Sets the secure HttpOnly cookie for authentication.
    """
    is_production = getattr(settings, "ENVIRONMENT", "development") == "production"
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="none" if is_production else "lax",
        secure=is_production,
    )

def clear_auth_cookie(response: Response):
    """
    Clears the authentication cookie.
    """
    is_production = getattr(settings, "ENVIRONMENT", "development") == "production"
    response.delete_cookie(
        key="access_token",
        httponly=True,
        samesite="none" if is_production else "lax",
        secure=is_production,
    )
