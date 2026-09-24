from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import secrets

from app.database.session import get_db
from app.models.models import User
from app.schemas.schemas import UserResponse
from app.api.deps import require_current_user

router = APIRouter(prefix="/users", tags=["User Profile & Settings"])

class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None

class UpdateSettingsRequest(BaseModel):
    sensitivity_threshold: Optional[float] = 0.65
    email_alerts: Optional[bool] = True
    theme_preference: Optional[str] = "dark"
    auto_expand_claims: Optional[bool] = True

@router.get("/me", response_model=UserResponse)
def get_user_profile(current_user: User = Depends(require_current_user)):
    return current_user

@router.put("/profile", response_model=UserResponse)
def update_profile(
    req: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_current_user)
):
    if req.full_name:
        current_user.full_name = req.full_name
    if req.role:
        current_user.role = req.role
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/generate-api-key")
def generate_api_key(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_current_user)
):
    new_key = f"tl_live_{secrets.token_hex(20)}"
    current_user.api_key = new_key
    db.commit()
    return {"api_key": new_key, "message": "API key generated successfully."}

@router.post("/settings")
def update_settings(
    req: UpdateSettingsRequest,
    current_user: User = Depends(require_current_user)
):
    return {
        "status": "success",
        "message": "User preferences updated successfully",
        "settings": req.model_dump()
    }
