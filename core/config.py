import os
import secrets
from typing import List
from dotenv import load_dotenv

load_dotenv()


class Settings:
    PROJECT_NAME: str = "Urban Scenery Ventures - Electronics Store API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL") or "sqlite:///./urban_ventures.db"
    if DATABASE_URL == "None" or not DATABASE_URL.strip():
        DATABASE_URL = "sqlite:///./urban_ventures.db"

    # Security
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development").strip().lower()
    SECRET_KEY: str = os.getenv("SECRET_KEY", "").strip()
    if not SECRET_KEY:
        if ENVIRONMENT in {"production", "prod"}:
            raise RuntimeError("SECRET_KEY must be configured in production.")
        SECRET_KEY = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

    # CORS: keep the deployed storefront origins allowed even when Render
    # supplies a custom CORS_ORIGINS environment variable.
    _configured_origins = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "").split(",")
        if origin.strip()
    ]
    _required_origins = [
        "https://agentic-connexa-frontend-guj8.vercel.app",
        "https://agentic-connexa-frontend-taupe.vercel.app",
        "https://agentic-connexa-backend-1.onrender.com",
    ]
    _development_origins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    CORS_ORIGINS: List[str] = list(dict.fromkeys(
        _required_origins + _development_origins + _configured_origins
    ))


settings = Settings()
