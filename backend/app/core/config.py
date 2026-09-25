from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "TruthLens AI"
    PROJECT_VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "truthlens_super_secret_jwt_key_2026_production_grade_382947239847")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./truthlens.db")
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # AI Engine Sensitivity Thresholds
    SENSITIVITY_THRESHOLD_DEFAULT: float = 0.65
    CLICKBAIT_THRESHOLD: float = 0.55
    SENSATIONALISM_THRESHOLD: float = 0.50

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
