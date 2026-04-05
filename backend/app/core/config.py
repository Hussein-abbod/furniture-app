from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    DATABASE_URL: str = "mysql+pymysql://root:password@localhost:3306/furniture_db"
    SECRET_KEY: str = "change-this-secret-key-in-production-32chars"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    GOOGLE_CLIENT_ID: Optional[str] = None
    ENVIRONMENT: str = "development"
    SMTP_EMAIL: Optional[str] = None
    SMTP_APP_PASSWORD: Optional[str] = None
    FRONTEND_URL: Optional[str] = None

    class Config:
        env_file = ".env"


settings = Settings()
